"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake credentials check
    if (username === "admin" && password === "1234qwe") {
      // Save to localStorage (or sessionStorage)
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      window.dispatchEvent(new Event("storage"));
      toast.success(
        <div>
          <strong>Login Successful!</strong>
          <p className="text-sm text-gray-500">Welcome back, {username}!</p>
        </div>
      );
      router.push("/about");
    } else {
      toast.error("Invalid credentials");
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <Image src='/LOGO.png' alt='isoWhiz Logo' width={250} height={100} className="mx-auto" />
        <p className="text-red-500 text-sm mt-2">Login!</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />

            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
