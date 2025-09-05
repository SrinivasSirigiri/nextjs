// pages/ssg-example.tsx

import Nav from "../ssr/Nav";

// Data is fetched at build time, HTML is generated once and served to all users.
export default async function SSGPage() {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      cache: "force-cache", // ✅ default, but explicit here
    });
    const data = await res.json();
  
    return (
        <section className={'container'}>
        <div className={'main'}>
             <Nav /> {/* Client component for navigation */}
            <h1>Static Site Generation (SSG)</h1>
            {!data ? (
              <p>Loading...</p>
            ) : (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    </section>
    );
  }