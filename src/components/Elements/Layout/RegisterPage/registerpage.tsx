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

      <div className="relative bg-white w-[700px] h-[750px] rounded-[45px] p-[27px] z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/logo.png')" }}
          ></div>
          <h1 className="text-black text-lg font-bold">RPL FINAL</h1>
        </div>

        <form
          onSubmit={handleRegister}
          className="w-[378px] mx-auto mt-[20px] flex flex-col"
        >
          <h1 className="text-4xl font-bold">Register</h1>

          <label htmlFor="role" className="mt-[20px]">
            Peran
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value.toUpperCase())}
            className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300"
          >
            <option value="MAHASISWA">Mahasiswa</option>
            <option value="DOSEN">Dosen</option>
          </select>

          <label htmlFor="name" className="mt-[10px]">
            Nama
          </label>
          <input
            type="text"
            id="name"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300 px-3"
            required
          />

          <label htmlFor="email" className="mt-[20px]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300 px-3"
            required
          />
          <p className="text-sm text-gray-700 mt-[10px]">
            Gunakan email civitas akademika ITS
          </p>

          <label htmlFor="password" className="mt-[20px]">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300 px-3"
            required
          />

          <label htmlFor="confirmPassword" className="mt-[20px]">
            Konfirmasi Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300 px-3"
            required
          />

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-3">{success}</p>}

          <div className="flex justify-end mt-[20px]">
            <button
              type="submit"
              className="bg-blue-400 font-bold text-white rounded-md w-[77px] h-[40px]"
            >
              Daftar
            </button>
          </div>

          <div className="flex justify-center items-center gap-2 mt-[20px]">
            <p className="text-sm text-gray-700">Sudah memiliki akun?</p>
            <Link
              href="/auth/login"
              className="text-sm text-blue-500 font-semibold hover:underline"
            >
              Masuk sekarang
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
