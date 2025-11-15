import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import Link from "next/link";

export default function FormPengajuanJudulPage() {
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
          <div className="w-full h-[225px] mt-[30px] flex flex-col">
            <Link href="/dosen/dashboard">
              {/* Menu 1 */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-house-door text-xl"></i>
                <h1 className="font-medium">Beranda</h1>
              </div>
            </Link>

            <Link href="/dosen/dashboard/tawaranjudul">
              {/* Menu 2 */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-people-fill text-xl"></i>
                <h1 className="font-medium">Tawaran Judul</h1>
              </div>
            </Link>

            <Link href="/dosen/dashboard/formpengajuanjudul">
              {/* Menu 3 */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-book text-xl"></i>
                <h1 className="font-medium">Form Pengajuan Judul</h1>
              </div>
            </Link>

            <Link href="/dosen/dashboard/monitoring">
              {/* Menu 4 */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-display text-xl"></i>
                <h1 className="font-medium">Monitoring</h1>
              </div>
            </Link>

            <Link href="/dosen/dashboard/panduandosen">
              {/* Menu 5 */}
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
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
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
        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          {/* Path */}
          <div className="flex justify-start w-full text-gray-400 gap-2">
            <span>BERANDA</span>
            <span>\</span>
            <span>FORM PENGAJUAN JUDUL</span>
          </div>

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-black">
            Form Pengajuan Judul
          </h1>

          {/* Form Card */}
          <div className="w-full bg-white rounded-lg shadow-md p-8">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition">
              <i className="bi bi-arrow-left"></i>
              Kembali
            </button>

            <form className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="judul"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Judul
                </label>
                <input
                  type="text"
                  id="judul"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder=""
                />
              </div>

              <div>
                <label
                  htmlFor="deskripsi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder=""
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="laboratorium"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Laboratorium
                </label>
                <input
                  type="text"
                  id="laboratorium"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder=""
                />
              </div>

              <div>
                <label
                  htmlFor="kuota"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kuota Mahasiswa
                </label>
                <input
                  type="number"
                  id="kuota"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  placeholder=""
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                >
                  <option disabled selected>
                    Pilih Status
                  </option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  Ajukan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}