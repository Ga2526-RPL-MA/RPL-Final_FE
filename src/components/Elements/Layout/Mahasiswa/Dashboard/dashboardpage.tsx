import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";

export default function MahasiswaDashboardPage() {
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
          <div className="flex justify-start w-full text-gray-400">BERANDA</div>
          {/* Main Header */}
          <div className="bg-white w-[1280px] h-[219px] rounded-lg shadow-md border border-gray-400">
            <div className="flex items-center justify-center h-full gap-6 mr-120">
              {/* Avatar*/}
              <Avatar className="w-40 h-40">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start">
                <h1 className="text-black text-3xl font-bold">
                  Selamat Datang, Jhon Doe
                </h1>
                <h2 className="text-gray-700 text-lg font-medium mt-1">
                  Mahasiswa
                </h2>
              </div>
            </div>
          </div>

          {/* Sub Main */}
          <div className="bg-white w-[1280px] h-[456px] rounded-lg shadow-md border border-gray-200 flex flex-col">
            <h1 className="font-bold mt-5 ml-10">TAWARAN JUDUL YANG TERSEDIA</h1>
            <div className="w-[1032px] h-[360px] ml-10 mt-5 overflow-y-auto p-4 rounded-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-700 text-sm">
                    <th className="py-2">No</th>
                    <th className="py-2">Judul</th>
                    <th className="py-2 w-[400px]">Dosen Pembimbing</th>
                    <th className="py-2">Lab</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <tr key={num} className="border-t border-gray-300">
                      <td className="py-3">{num}</td>
                      <td className="py-3">Judul</td>
                      <td className="py-3">Dosen Pembimbing</td>
                      <td className="py-3">Lab</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
