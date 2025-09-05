import styles from "./about.module.css";
export default function About() {
    return (
        <section className={styles.container}>
            <div className={styles.about}>
                <h1>About Us Page</h1>
                <p>Some text about who we are and what we do.</p>
                <p>Resize the browser window to see that this page is responsive by the way.</p>
            </div>
        </section>
    )
}