"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchJson } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const data = await fetchJson("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      document.cookie = `access_token=${data.access_token}; path=/;`;

      const meData = await fetchJson("/api/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      document.cookie = `role=${meData.profile?.role}; path=/;`;

      if (meData.profile?.role === "MAHASISWA") {
        router.push("/mahasiswa/dashboard");
      } else if (meData.profile?.role === "DOSEN") {
        router.push("/dosen/dashboard");
      } else {
        router.push("/");
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: "url('/home-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-8 z-10">
        <div className="flex items-center mb-8">
          <img
            src="/LogomyITS Final.png"
            alt="MyITS Final"
            className="h-[40px] object-contain"
          />

        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-gray-900">Log In</h1>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link href="/auth/forgot" className="text-sm text-blue-600 hover:text-blue-800">
                Lupa Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Masuk
          </button>

          <div className="flex justify-center items-center gap-2 text-sm">
            <p className="text-gray-600">Belum memiliki akun?</p>
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Daftar sekarang
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
