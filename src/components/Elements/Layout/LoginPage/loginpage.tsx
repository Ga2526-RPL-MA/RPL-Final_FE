"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal, periksa email dan password");
      }

      //save token *local storage
      localStorage.setItem("access_token", data.access_token);

      // Fetch user data to get the role
      const meRes = await fetch(`/api/auth/me`, {        
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      if (!meRes.ok) {
        throw new Error("Gagal mengambil data pengguna");
      }

      const meData = await meRes.json();
      
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

      <div className="relative bg-white w-[817px] h-[498px] rounded-[45px] flex flex-col p-[27px] z-10">
        <div className="flex items-center w-[159px] h-[42px] rounded-[8px] mb-6">
          <div
            className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/logo.png')" }}
          ></div>
          <h1 className="text-black text-lg ml-3 font-bold">RPL FINAL</h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="w-[378px] h-[350px] rounded-2xl mx-auto flex flex-col"
        >
          <h1 className="text-4xl font-bold mb-5">Log In</h1>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[378px] h-[44px] rounded-[8px] mt-[5px] border border-gray-300 px-3"
            required
          />

          <label htmlFor="password" className="mt-[15px]">
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

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <Link href="/auth/forgot" className="text-blue-500 mt-[10px]">
            Lupa Password?
          </Link>

          <div className="flex justify-end mt-[10px]">
            <button
              type="submit"
              className="bg-blue-400 font-bold text-white rounded-md w-[77px] h-[40px]"
            >
              Masuk
            </button>
          </div>

          <div className="flex justify-center items-center gap-2 mt-[30px]">
            <p className="text-sm text-gray-700">Belum memiliki akun?</p>
            <Link
              href="/auth/register"
              className="text-sm text-blue-500 font-semibold hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
