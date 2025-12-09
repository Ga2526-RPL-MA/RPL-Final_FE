"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Judul {
  id: string;
  judul: string;
  deskripsi: string;
  dosen?: { nama: string };
  lab?: { nama: string };
  status: string;
}

export default function TawaranTugasAkhir() {
  const router = useRouter();
  const [judulList, setJudulList] = useState<Judul[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchJudul = async () => {
      try {
        const res = await fetch("/api/judul");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setJudulList(data.data || data);
      } catch (err) {
        console.error("Error fetch judul:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJudul();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredJudulList = judulList.filter(
    (item) =>
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dosen?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJudulList.length / itemsPerPage);

  const paginatedList = filteredJudulList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full h-[80px] flex justify-center items-center border-b border-gray-400">
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
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar kiri */}
        <div className="w-[300px] h-[944px] border-r border-gray-400 flex flex-col gap-10">
          <div className="w-full h-[180px] mt-[30px] flex flex-col">
            <Link href="/mahasiswa/dashboard">
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-house-door text-xl"></i>
                <h1 className="font-medium">Beranda</h1>
              </div>
            </Link>

            <Link href="/mahasiswa/dashboard/tawarantugasakhir">
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition bg-gray-100 rounded-md">
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
          </div>

          {/* Header + Search */}
          <div className="w-full flex justify-between items-center">
            <h1 className="w-full text-2xl font-semibold text-black">Tawaran Judul</h1>
            <input
              type="text"
              placeholder="Cari judul atau dosen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosen Pembimbing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laboratorium</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading
                  ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                      <tr key={idx}>
                        {Array.from({ length: 6 }).map((_, colIdx) => (
                          <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  : paginatedList.length > 0
                  ? paginatedList.map((item, index) => (
                      <tr
                        key={item.id}
                        onClick={() =>
                          router.push(
                            `/mahasiswa/dashboard/tawarantugasakhir/detailtugasakhir/${item.id}`
                          )
                        }
                        className="cursor-pointer hover:bg-gray-100 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.judul}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.deskripsi.length > 30
                            ? item.deskripsi.slice(0, 30) + "..."
                            : item.deskripsi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.dosen?.nama || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.lab?.nama || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === "Diambil"
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
                  : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        Belum ada data
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="w-full flex justify-between items-center mt-4">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={totalPages === 1}
                className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${
                  totalPages === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={totalPages === 1}
                className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${
                  totalPages === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
