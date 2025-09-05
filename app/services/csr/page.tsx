// pages/csr-example.tsx
// Data is fetched on the client after the page loads (like a normal React app).
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CSRPage() {
  const [data, setData] = useState<any>(null);
  const pathname = usePathname();
  
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1") // API call happens in browser
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);



  return (
        <section className={'container'}>
            <div className={'main'}>
                <ul>
                    <li><Link href="/services/csr" data-active={pathname === '/services/csr'}>CSR</Link></li>
                    <li><Link href="/services/ssr" data-active={pathname === '/services/ssr'}>SSR</Link></li>
                    <li><Link href="/services/ssg" data-active={pathname === '/services/ssg'}>SSG</Link></li>
                    <li><Link href="/services/isr" data-active={pathname === '/services/isr'}>ISR</Link></li>
                </ul>
                <h1>Client-Side Rendering (CSR)</h1>
                {!data ? (
                  <p>Loading...</p>
                ) : (
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                )}
            </div>
        </section>
  );
}
