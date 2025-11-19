import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";

export default function DetailTugasAkhir() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full h-[80px] flex justify-center items-center border-b border-gray-400">
        <div className="w-[1450px] h-[40px] flex justify-between items-center px-6 relative rounded-md">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: "url('/logo.png')" }}
            ></div>
            <h1 className="text-black text-sm ml-3 font-bold">RPL FINAL</h1>
          </div>

          {/* Avatar */}
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar kiri */}
        <div className="w-[300px] h-[944px] border-r border-gray-400 flex flex-col gap-10">
          {/* Main Sidebar */}
          <div className="w-full h-[180px] mt-[30px] flex flex-col">

            <Link href="/mahasiswa/dashboard">
              {/* Menu 1 */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-house-door text-xl"></i>
                <h1 className="font-medium">Beranda</h1>
              </div>
            </Link>

            <Link href="/mahasiswa/dashboard/tawarantugasakhir">
              {/* Menu 2 */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-people-fill text-xl"></i>
                <h1 className="font-medium">Tawaran Judul Tugas Akhir</h1>
              </div>
            </Link>

            <Link href="/mahasiswa/dashboard/progresstugasakhir">
              {/* Menu 3 */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-book text-xl"></i>
                <h1 className="font-medium">Progress Tugas Akhir</h1>
              </div>
            </Link>

            <Link href="/mahasiswa/dashboard/panduanmahasiswa">
              {/* Menu 4 */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-file-earmark text-xl"></i>
                <h1 className="font-medium">Panduan</h1>
              </div>
            </Link>

          </div>
          {/* Sub Sidebar */}
          <div className="w-full h-[220px] flex flex-col">
            <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
              <i className="bi bi-gear text-xl"></i>
              <h1 className="font-medium">Pengaturan</h1>
            </div>
            <div className="w-full h-[65px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition mt-5">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-medium">John Doe</h1>
                <h1 className="font-small text-gray-500">johndoe@gmail.com</h1>
              </div>
              <div className=" ml-8">
                <i className="bi bi-box-arrow-left text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col items-center gap-6 p-6 overflow-y-auto">
          {/* Path */}
          <div className="flex justify-start w-full text-gray-400 gap-2">
            <span>BERANDA</span>
            <span>\</span>
            <span>TAWARAN JUDUL TUGAS AKHIR</span>
            <span>\</span>
            <span>DETAIL TUGAS AKHIR</span>
          </div>

          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">
              Detail Tugas Akhir
            </h1>
          </div>

          <div className="w-full bg-white border border-gray-300 rounded-xl p-6">

            {/* Judul + Status */}
            <div className="border border-dotted border-gray-400 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-semibold text-black">
                  Analisis Sistem Go Go Card pada <span className="italic">Game</span> Magic Chess Go Go
                </h1>

                {/* Published */}
                <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  Published
                </span>
              </div>

              {/* tanggal & author */}
              <p className="text-sm text-gray-500 mt-2">
                Dibuat pada: 08 November 2025
              </p>
              <p className="text-sm text-gray-500">
                Dibuat oleh: Ir. John Doe S.Kom, M.Kom.
              </p>
            </div>

            {/* Garis */}
            <div className="w-full h-[1px] bg-gray-400 my-4"></div>

            {/* Informasi */}
            <h1 className="text-2xl font-semibold text-black mb-2">Informasi</h1>

            {/* Box Informasi */}
            <div className="border border-dotted border-gray-400 p-4 rounded-lg">
              {/* Judul */}
              <div className="mb-3">
                <p className="text-sm text-gray-500">Judul</p>
                <p className="text-black">
                  Analisis Sistem Go Go Card pada Game Magic Chess Go Go
                </p>
              </div>

              {/* Deskripsi */}
              <div className="mb-3">
                <p className="text-sm text-gray-500">Deskripsi</p>
                <p className="text-black text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  sodales bibendum arcu, at molestie elit laoreet vitae. Aenean
                  non neque mi. Nulla facilisi. Phasellus sit amet tellus tristique,
                  maximus justo non, eleifend massa. Ut pharetra, felis et mollis
                  sodales, risus lectus feugiat libero, a pretium ligula lectus
                  non nisi. In hac habitasse platea dictumst. Nunc volutpat eros eu
                  suscipit pharetra. Morbi ultrices ultricies nisi eu euismod.
                </p>
              </div>

              {/* Lab */}
              <div className="mb-3">
                <p className="text-sm text-gray-500">Laboratorium</p>
                <p className="text-black">Rekayasa Perangkat Lunak</p>
              </div>

              {/* Dosen Pembimbing */}
              <div>
                <p className="text-sm text-gray-500">Dosen Pembimbing</p>
                <p className="text-black">Ir. John Doe S.Kom, M.Kom.</p>
              </div>
            </div>

            {/* Garis */}
            <div className="w-full h-[1px] bg-gray-400 my-4"></div>

            {/* Tombol */}
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                Ambil Judul
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
