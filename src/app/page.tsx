"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token") && hash.includes("type=recovery")) {
      router.replace(`/auth/reset-password${hash}`);
    }
  }, [router]);

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: "url('/home-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Glassmorphism Card */}
      <div className="relative w-full max-w-lg p-10 z-10 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Gradient accent at bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-t from-purple-600/30 via-purple-500/10 to-transparent blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <img
              src="/LogomyITS Final.png"
              alt="MyITS Final"
              className="h-[36px] object-contain brightness-0 invert"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-3 mb-8">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Selamat datang di<br />myITS Final
            </h1>
            <p className="text-base text-gray-300">
              Eksplorasi Tugas Akhir di sini.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Link href="/auth/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30">
                Masuk
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="border border-white/30 hover:bg-white/10 text-white font-semibold py-2 px-6 rounded-lg transition-all">
                Daftar Akun Baru
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
