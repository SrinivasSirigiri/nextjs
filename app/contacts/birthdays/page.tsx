"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
// @ts-ignore
import Swal from 'sweetalert2';
import styles from "./birthdays.module.css";
import {CONTACTS_MOCK} from "@/app/mock/contacts";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  favorite: boolean;
  dateOfBirth: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  favorite: boolean;
  dateOfBirth: string;
}

export default function Birthdays() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    avatarUrl: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    favorite: true,
    dateOfBirth: ""
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchContacts();
  }, [searchParams]);

  const fetchContacts = async () => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts`);
      let contactsData = await data.json();
      
      // Sort by dateOfBirth (earliest first) as default
      contactsData = contactsData.sort(
        (a: Contact, b: Contact) => new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime()
      );

      // Apply sorting from URL parameters
      const sort = searchParams.get('sort');
      const dir = searchParams.get('dir');
      
      if (sort) {
        contactsData.sort((a: Contact, b: Contact) => {
          let aVal = a[sort as keyof Contact];
          let bVal = b[sort as keyof Contact];

          // handle DOB as date
          if (sort === "dateOfBirth") {
            aVal = new Date(aVal as string).getTime() as any;
            bVal = new Date(bVal as string).getTime() as any;
          }

          if (aVal < bVal) return dir === "desc" ? 1 : -1;
          if (aVal > bVal) return dir === "desc" ? -1 : 1;
          return 0;
        });
      }

      setContacts(contactsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.avatarUrl.trim()) {
      newErrors.avatarUrl = "Avatar URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = isEditMode 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/${editingContactId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form and close modal
        setFormData({
          firstName: "",
          lastName: "",
          avatarUrl: "",
          phone: "",
          email: "",
          address: "",
          notes: "",
          favorite: true,
          dateOfBirth: ""
        });
        setShowModal(false);
        setIsEditMode(false);
        setEditingContactId(null);
        setErrors({});
        
        // Refresh contacts list
        await fetchContacts();
      } else {
        console.error(`Failed to ${isEditMode ? 'update' : 'add'} contact`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} contact:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setIsEditMode(true);
    setEditingContactId(contact.id);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      avatarUrl: contact.avatarUrl,
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      notes: contact.notes,
      favorite: contact.favorite,
      dateOfBirth: contact.dateOfBirth
    });
    setShowModal(true);
    setErrors({});
  };

  const handleDelete = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    const contactName = contact ? `${contact.firstName} ${contact.lastName}` : 'this contact';
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You are about to delete <span class="font-bold text-blue-600">${contactName}</span>.<br> This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup-compact',
        title: 'swal2-title-compact',
        htmlContainer: 'swal2-content-compact',
        actions: 'swal2-actions-compact'
      },
      width: '380px',
      padding: '0.8rem'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/${contactId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Show success message
          Swal.fire({
            title: 'Deleted!',
            text: `${contactName} has been deleted successfully.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              popup: 'swal2-popup-compact',
              title: 'swal2-title-compact',
              htmlContainer: 'swal2-content-compact'
            },
            width: '320px',
            padding: '0.8rem'
          });
          
          // Refresh contacts list
          await fetchContacts();
        } else {
          // Show error message
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete the contact. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'swal2-popup-compact',
              title: 'swal2-title-compact',
              htmlContainer: 'swal2-content-compact',
              actions: 'swal2-actions-compact'
            },
            width: '320px',
            padding: '0.8rem'
          });
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while deleting the contact. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-compact',
            title: 'swal2-title-compact',
            htmlContainer: 'swal2-content-compact',
            actions: 'swal2-actions-compact'
          },
          width: '320px',
          padding: '0.8rem'
        });
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditingContactId(null);
    setFormData({
      firstName: "",
      lastName: "",
      avatarUrl: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      favorite: true,
      dateOfBirth: ""
    });
    setErrors({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.birthday}>
        <h1>Data loaded from local</h1>
        <ul>
          {CONTACTS_MOCK.map((contact) => (
            <li key={contact.id} className={styles.li_margin}>
              <img src={contact.avatarUrl} alt={`${contact.firstName} ${contact.lastName}`} />
              <h3>
                <a href={`/contacts/${contact.id}`}>{contact.firstName} {contact.lastName}</a>
              </h3>
              <p>{contact.dateOfBirth}</p>
            </li>
          ))}
        </ul>

        <h1>Data loaded from server</h1>
        <ul>
          {contacts.map((contact: Contact) => (
            <li key={contact.id} className={styles.li_margin}>
              <img src={contact.avatarUrl} alt={`${contact.firstName} ${contact.lastName}`} />
              <h3>
                <Link href={`/contacts/${contact.id}`}>{contact.firstName} {contact.lastName}</Link>
              </h3>
              <p>{contact.dateOfBirth}</p>
            </li>
          ))}
        </ul>

        {/* Add User Button */}
        <div className="mb-5 flex justify-end">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add User
          </button>
        </div>

        <table id="contactsTable" className={styles.table}>
          <thead>
            <tr>
              <th>Profile Image</th>
              <th>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push('?sort=firstName&dir=asc')}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Name ↑
                  </button>
                  <button
                    onClick={() => router.push('?sort=firstName&dir=desc')}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    ↓
                  </button>
                </div>
              </th>
              <th>Email</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>Action</th>
            </tr>
          </thead> 
          <tbody>
            {contacts.map((contact: Contact) => (
              <tr key={contact.id}>
                <td><img src={contact.avatarUrl} alt={`${contact.firstName} ${contact.lastName}`} /></td>
                <td><Link href={`/contacts/${contact.id}`}>{contact.firstName} {contact.lastName}</Link></td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.dateOfBirth}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Edit contact"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete contact"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mt-0 mb-5 text-xl font-semibold text-gray-800">
              {isEditMode ? 'Edit User' : 'Add New User'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.firstName}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.lastName}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  Avatar URL *
                </label>
                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.avatarUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.avatarUrl && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.avatarUrl}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.dateOfBirth}</span>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>

              <div className="mb-5">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="favorite"
                    checked={formData.favorite}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="font-semibold text-gray-700">Favorite</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting 
                    ? (isEditMode ? 'Updating...' : 'Adding...') 
                    : (isEditMode ? 'Update User' : 'Add User')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}