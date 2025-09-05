"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <p>Login Page !</p>
      <div className="flex items-center justify-center bg-gray-100 p-5 rounded-xl">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-96">
        
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
