"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import Link from "next/link";

interface Dosen {
  id: string;
  nama: string;
  email: string;
}

interface Lab {
  id: string;
  nama: string;
}

interface Mahasiswa {
  id: string;
  nama: string;
  email: string;
}

interface Judul {
  id: string;
  judul: string;
  deskripsi: string;
  status: string;
  dosenId: string;
  mahasiswaId: string | null;
  labId: string;
  createdAt: string;
  dosen?: Dosen | null;
  mahasiswa?: Mahasiswa | null;
  lab?: Lab | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Judul[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function MahasiswaDashboardPage() {
  const router = useRouter();
  const [judulList, setJudulList] = useState<Judul[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJudulList = judulList.filter(
    (item) =>
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dosen?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    async function fetchJudul() {
      try {
        const res = await fetch("/api/judul");
        const json = await res.json();
        setJudulList(json.data);

      } catch (err) {
        console.error("Error fetch judul:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJudul();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="w-full h-[80px] flex justify-center items-center border-b border-gray-300 bg-[#f4f6fb]">
        <div className="w-[1450px] h-[40px] flex justify-between items-center px-6 relative rounded-md">
          <div className="flex items-center">
            <div
              className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: "url('/logo.png')" }}
            ></div>
            <h1 className="text-black text-sm ml-3 font-bold">RPL FINAL</h1>
          </div>
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt={profileName || "@user"} />
              <AvatarFallback>{(profileName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex flex-1 bg-[#f4f6fb]">
        <SidebarMahasiswa />

        <div className="flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://github.com/shadcn.png" alt={profileName || "@user"} />
              <AvatarFallback>{(profileName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Mahasiswa</p>
              <h1 className="text-2xl font-semibold text-gray-900">
                {profileName ? `Selamat datang, ${profileName}` : "Selamat datang"}
              </h1>
              <p className="text-sm text-gray-500">{profileEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/mahasiswa/dashboard/tawarantugasakhir"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-blue-600">
                <i className="bi bi-search"></i>
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-900">Tawaran Judul</h3>
                <p className="text-sm text-gray-600">Lihat judul tugas akhir yang tersedia.</p>
              </div>
            </Link>

            <Link 
              href="/mahasiswa/dashboard/progresstugasakhir"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-blue-600">
                <i className="bi bi-book"></i>
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-900">Progress Tugas Akhir</h3>
                <p className="text-sm text-gray-600">Laporkan dan lihat progress tugas akhir Anda.</p>
              </div>
            </Link>

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
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">BERANDA</div>

          {/* Main Header */}
          <div className="bg-white w-[1280px] h-[219px] rounded-lg shadow-md border border-gray-400">
            <div className="flex items-center justify-center h-full gap-6 mr-120">
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
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <i className="bi bi-folder-x text-4xl text-gray-400 mb-2"></i>
                <p className="text-sm text-gray-600 mb-3">Anda belum mengambil judul tugas akhir</p>
                <Link
                  href="/mahasiswa/dashboard/tawarantugasakhir"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                >
                  Lihat Tawaran Judul
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            )}
          </div>

          {/* Sub Main */}
          <div className="border w-[1280px] border-gray-300 bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-black">
                Tawaran Judul Yang Tersedia
              </h1>

              <input
                type="text"
                placeholder="Cari judul atau dosen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="border border-dotted border-gray-400 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Judul</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dosen Pembimbing</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Laboratorium</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {filteredJudulList.length > 0 ? (
                    filteredJudulList.map((item, index) => (
                      <tr
                        key={item.id}
                        onClick={() => router.push(`/mahasiswa/dashboard/tawarantugasakhir/detailtugasakhir?id=${item.id}`)}
                        className="cursor-pointer hover:bg-gray-50 transition border-b border-gray-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.judul}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.dosen?.nama || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.lab?.nama || "-"}</td>

                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full 
                    ${item.status === "DIAMBIL"
                                ? "bg-red-100 text-red-800"
                                : item.status === "PUBLISHED"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500">
                        Belum ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
