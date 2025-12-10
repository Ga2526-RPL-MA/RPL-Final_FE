import SidebarDosen from "@/components/Elements/Layout/Dosen/Sidebar"

export default function PanduanDosen() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 w-full h-[80px] flex justify-center items-center border-b border-gray-400 bg-white">
        <div className="w-full max-w-7xl h-[40px] flex justify-center items-center px-4 md:px-6 relative rounded-md">
          <div className="flex justify-center w-full">
            <img
              src="/LogomyITS Final.png"
              alt="MyITS Final"
              className="h-[50px] object-contain"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <SidebarDosen />

        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>PANDUAN</span>
          </div>

          <h1 className="text-2xl font-bold text-black">Panduan</h1>

          <div className="w-full flex flex-col gap-6">

            {/* CARD 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800">
                Pedoman Penyusunan Laporan Tugas/Proyek Akhir Program Sarjana dan dan Sarjana Terapan
              </h2>

              <p className="text-gray-600 mt-1">
                Pedoman Penyusunan Laporan Tugas/Proyek Akhir Bagi Mahasiswa Program Sarjana & Sarjana Terapan
              </p>

              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                <i className="bi bi-download"></i>
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
                <i className="bi bi-download"></i>
                Unduh Lampiran
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
