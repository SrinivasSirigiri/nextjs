import Link from "next/link";
import styles from "../contact.module.css";
import {CONTACTS_MOCK} from "@/app/mock/contacts";

export default async function ContactView({ params }: { params: { id: string } }) {
    const {id} = await params;
    let contactItem: any = CONTACTS_MOCK.find((contact) => contact.id === id );
    if(!contactItem) {
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts`)
        const contacts = await data.json();
        contactItem = contacts.find((contact:any) => contact.id === id );
        console.log(contactItem);
    }
    
    return ( 
        <section className={styles.container}>
            <div className={styles.contact}>
                <h1>Contact Information</h1>
                <img className={styles.block} src={contactItem.avatarUrl} />
                <h3>{contactItem.firstName} {contactItem.lastName}</h3>
                <p>{contactItem.dateOfBirth}</p>
                <p>{contactItem.email}</p>
                <p>{contactItem.phone}</p>
                <p>{contactItem.address}</p>
            </div>
            <div className={styles.contact}>
            <h3>
               <Link href={`/contacts/birthdays`}>Back to Users</Link>
            </h3>
            </div>
        </section>
    )
}