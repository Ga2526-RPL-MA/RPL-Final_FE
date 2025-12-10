"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("MAHASISWA");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      return;
    }
    setSuccess("");

    try {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nama,
          role,
          labId: null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000); // Redirect after 2 seconds
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

      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-8 z-10 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center mb-8">
          <div
            className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/logo.png')" }}
          ></div>
          <h1 className="text-black text-sm ml-3 font-bold">RPL FINAL</h1>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-gray-900">Register</h1>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-medium text-gray-700">
              Peran
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MAHASISWA">Mahasiswa</option>
              <option value="DOSEN">Dosen</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              id="name"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
            <p className="text-xs text-gray-500">
              Gunakan email civitas akademika ITS
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Daftar
          </button>

          <div className="flex justify-center items-center gap-2 text-sm">
            <p className="text-gray-600">Sudah memiliki akun?</p>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Masuk sekarang
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
