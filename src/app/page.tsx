"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      className="relative h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/home-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 flex items-start justify-start h-full pt-[100px] pl-[107px]">
        <div className="bg-[#181D27] w-[600px] h-[369px] rounded-[45px]">

          <div className="flex items-center mt-[36px] ml-[34px]">
            <div
              className="w-[32px] h-[32px] rounded-[8px] bg-white bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: "url('/logo.png')" }}
            ></div>
            <h1 className="text-white text-lg ml-3 font-bold">RPL FINAL</h1>
          </div>

          <div className="relative item-center justify-center mt-[40px] ml-[70px] w-[456px] h-[183px]">
            <h1 className="text-white w-[414] h-[120] font-bold text-4xl">Selamat Datang Di IFinal</h1>
            <Link href="/auth/login">
              <button className="bg-[#2E90FA] text-white font-bold rounded-[5px] w-[92] h-[46]">Masuk</button>
            </Link>
            <Link href="/auth/register">
              <button className="border-1 rounded-[5px] font-bold text-white w-[173] h-[46] ml-5">Daftar Akun Baru</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
