// app/services/ssr/page.tsx
import Nav from "./Nav"; // import client component

// ------------------------------
// SERVER COMPONENT (SSR)
// ------------------------------
export default async function SSRPage() {
   
  // 👇 Fetch runs server-side, fresh every request (SSR)
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    next: { revalidate: 0 }, // like SSR, but scoped to request
  });
  const data = await res.json();

  return (
    <section className="container">
      <div className="main">
        <Nav /> {/* Client component for navigation */}
        <h1>Server-Side Rendering (SSR)</h1>
        {!data ? (
            <p>Loading...</p>
          ) : (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          )}
      </div>
    </section>
  );
}



