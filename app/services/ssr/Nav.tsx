// app/services/ssr/Nav.tsx
"use client"; // this file is client-side

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/services/csr", label: "CSR" },
    { href: "/services/ssr", label: "SSR" },
    { href: "/services/ssg", label: "SSG" },
    { href: "/services/isr", label: "ISR" },
  ];

  return (
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            data-active={pathname === link.href}
            style={{
              fontWeight: pathname === link.href ? "bold" : "normal",
              color: pathname === link.href ? "blue" : "inherit",
            }}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
