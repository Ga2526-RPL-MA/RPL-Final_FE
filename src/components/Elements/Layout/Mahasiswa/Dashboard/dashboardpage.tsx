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
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-house-door text-xl"></i>
                <h1 className="font-medium">Beranda</h1>
              </div>
            </Link>

            <Link href="/mahasiswa/dashboard/tawarantugasakhir">
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-people-fill text-xl"></i>
                <h1 className="font-medium">Tawaran Judul Tugas Akhir</h1>
              </div>
            </Link>

            <Link href="/mahasiswa/dashboard/progresstugasakhir">
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-book text-xl"></i>
                <h1 className="font-medium">Progress Tugas Akhir</h1>
              </div>
            </Link>

            <Link href="/mahasiswa/dashboard/panduanmahasiswa">
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
            <div className="flex items-center justify-between mt-5 ml-10 mr-10">
              <h1 className="font-bold">TAWARAN JUDUL YANG TERSEDIA</h1>
              <input
                type="text"
                placeholder="Cari judul atau dosen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="w-[1250px] h-[380px] ml-10 mt-5 overflow-y-auto p-4 rounded-md">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosen Pembimbing</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laboratorium</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredJudulList.length > 0 ? (
                      filteredJudulList.map((item, index) => (
                        <tr
                          key={item.id}
                          onClick={() => router.push(`/mahasiswa/dashboard/tawarantugasakhir/detailtugasakhir?id=${item.id}`)}
                          className="cursor-pointer hover:bg-gray-100 transition"
                        >

                          <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.judul}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.dosen?.nama || "-"}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.lab?.nama || "-"}</td>

                          {/* STATUS BADGE */}
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === "Diambil"
                                ? "bg-red-100 text-red-800"
                                : item.status === "Draft"
                                  ? "bg-gray-100 text-gray-800"
                                  : item.status === "Published"
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
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                          Belum ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
