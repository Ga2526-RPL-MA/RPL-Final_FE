import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";

export default function ProgressTugasAkhir() {
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
        <div className="bg-slate-200 flex-1 min-h-screen flex flex-col items-center gap-6 p-6 overflow-y-auto">

          {/* Path */}
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>PROGRES TUGAS AKHIR</span>
          </div>

          {/* Header */}
          <h1 className="w-full text-2xl font-semibold text-black">
            Progres Tugas Akhir
          </h1>

          {/* Step Progress Full Width */}
          <div className="w-full bg-transparent mt-2">
            <div className="flex justify-between items-center w-full overflow-x-auto">

              {[
                "Proposal", "Bab 1", "Bab 2", "Bab 3",
                "Seminar", "Bab 4", "Bab 5", "Sidang", "Evaluasi",
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 min-w-[70px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto
            ${index === 0 ? "bg-blue-600 text-white" : "bg-white border"} `}
                  />
                  <span className="text-sm mt-2 text-center">{item}</span>
                </div>
              ))}

            </div>
          </div>

          {/* Button di bawah Step Progress */}
          <div className="w-full flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              + Update Progres
            </button>
          </div>

          {/* Riwayat Progres */}
          <div className="w-full">
            <h2 className="w-full text-2xl font-semibold text-black mb-3">Riwayat Progres</h2>

            <div className="bg-white w-full min-h-[250px] rounded-lg shadow-md border border-gray-300 p-6">
              <h3 className="text-lg font-semibold">Proposal</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 mt-4 text-sm">
                <span className="text-gray-500">Di-update pada</span>
                <span className="md:col-span-3">09 November 2025</span>

                <span className="text-gray-500">Deskripsi</span>
                <p className="md:col-span-3 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sodales bibendum arcu,
                  at molestie elit laoreet vitae. Aenean non neque mi. Nulla facilisi. Phasellus sit amet tellus
                  tristique, maximus justo non, eleifend massa.
                </p>

                <span className="text-gray-500">Komentar</span>
                <span className="md:col-span-3">Belum ada komentar untuk saat ini.</span>

                <span className="text-gray-500">Berkas</span>
                <a href="#" className="md:col-span-3 text-blue-600 underline">
                  Proposal.pdf
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
