import Link from "next/link";
import styles from "./contact.module.css";
export default function Contact() {
    return (
        <section className={styles.container}>
            <div className={styles.contact}>
                <h1>Contact Us Page</h1>
                <div><Link href="contacts/birthdays">Go to Users</Link></div>
            </div>
        </section>
    )
}