import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SidebarDosen from "@/components/Elements/Layout/Dosen/Sidebar"

export default function PanduanDosen() {
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

      <div className="flex flex-1">
        <SidebarDosen />

        {/* Main Content */}
        <div className="bg-slate-200 flex-1 min-h-[944px] flex flex-col items-center gap-6 p-6 overflow-y-auto">

          {/* Path */}
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>PANDUAN</span>
          </div>

          {/* Title */}
          <h1 className="w-full text-2xl font-semibold text-black">Panduan</h1>

          {/* Card Container */}
          <div className="w-full flex flex-col gap-6 px-3 sm:px-1">

            {/* CARD 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">
                Pedoman Penyusunan Laporan Tugas/Proyek Akhir Program Sarjana dan dan Sarjana Terapan
              </h2>

              <p className="text-gray-600 mt-1">
                Pedoman Penyusunan Laporan Tugas/Proyek Akhir Bagi Mahasiswa Program Sarjana & Sarjana Terapan
              </p>

              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5
               A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 
               0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Unduh Lampiran
              </button>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">
                Buku Panduan Teknis Aplikasi
              </h2>

              <p className="text-gray-600 mt-1">
                Panduan teknis penggunaan aplikasi iFinal
              </p>

              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5
               A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 
               0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Unduh Lampiran
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
