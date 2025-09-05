// pages/isr-example.tsx
// Like SSG, but the page is re-generated in the background after a given revalidate time
// app/services/isr/page.tsx

import Nav from "../ssr/Nav";


export default async function ISRPage() {
 
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      next: { revalidate: 20 }, // ✅ re-generate every 60 seconds
    });
    const data = await res.json();

    const formattedTime = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24h format; remove if you want AM/PM
      });
  
    return (
        <section className="container">
      <div className="main">
         <Nav /> {/* Client component for navigation */}
        <h1>Incremental Static Regeneration (ISR)</h1>
        <p>Last updated:  {formattedTime}</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </section>
    );
  }
  
