"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/lib/api";
import Link from "next/link";

interface Judul {
  id: string;
  judul: string;
  deskripsi: string;
  dosen?: { nama: string };
  lab?: { id: string; nama: string };
  labId?: string;
  status: string;
}

interface Lab {
  id: string;
  nama: string;
}

export default function TawaranJudulPage() {
  const router = useRouter();
  const [judulList, setJudulList] = useState<Judul[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filterLab, setFilterLab] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [judulData, labsData] = await Promise.all([
          fetchJson("/api/judul"),
          fetchJson("/api/labs"),
        ]);
        const judulListData = Array.isArray(judulData.data) ? judulData.data : Array.isArray(judulData) ? judulData : [];
        const labsListData = Array.isArray(labsData.data) ? labsData.data : Array.isArray(labsData) ? labsData : [];
        setJudulList(judulListData);
        setLabs(labsListData);
      } catch (err) {
        console.error("Error fetch data:", err);
        setJudulList([]);
        setLabs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLab, filterStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".filter-dropdown")) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredJudulList = judulList.filter((item) => {
    if (filterLab && item.labId !== filterLab && item.lab?.id !== filterLab) {
      return false;
    }
    if (filterStatus && item.status !== filterStatus) {
      return false;
    }
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    return (
      (item.judul?.toLowerCase() || "").includes(query) ||
      (item.deskripsi?.toLowerCase() || "").includes(query) ||
      (item.dosen?.nama?.toLowerCase() || "").includes(query) ||
      (item.lab?.nama?.toLowerCase() || "").includes(query)
    );
  });

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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      DIAMBIL: { label: "Diambil", className: "bg-orange-100 text-orange-800" },
      Draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      Published: { label: "Published", className: "bg-blue-100 text-blue-800" },
      PUBLISHED: { label: "Published", className: "bg-blue-100 text-blue-800" },
      BELUM_DIAMBIL: { label: "Belum Diambil", className: "bg-blue-50 text-blue-700" },
      SELESAI: { label: "Selesai", className: "bg-green-100 text-green-800" },
    };
    const mapped = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${mapped.className}`}>
        {mapped.label}
      </span>
    );
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
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

        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>TAWARAN JUDUL</span>
          </div>

          <h1 className="text-2xl font-bold text-black">Tawaran Judul</h1>

          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari judul, deskripsi, atau dosen pembimbing..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="relative filter-dropdown">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
              >
                <i className="bi bi-funnel"></i>
                Filter
                {(filterLab || filterStatus) && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </button>
              {showFilter && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 filter-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Laboratorium
                      </label>
                      <select
                        value={filterLab}
                        onChange={(e) => setFilterLab(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      >
                        <option value="">Semua Lab</option>
                        {labs.map((lab) => (
                          <option key={lab.id} value={lab.id}>
                            {lab.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      >
                        <option value="">Semua Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="BELUM_DIAMBIL">Belum Diambil</option>
                        <option value="DIAMBIL">Diambil</option>
                        <option value="SELESAI">Selesai</option>
                        <option value="PUBLISHED">Published</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setFilterLab("");
                        setFilterStatus("");
                      }}
                      className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-blue-200">
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
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.deskripsi.length > 50
                            ? item.deskripsi.slice(0, 50) + "..."
                            : item.deskripsi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.dosen?.nama || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.lab?.nama || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                    ))
                  : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        {searchTerm.trim() || filterLab || filterStatus
                          ? "Tidak ada hasil yang ditemukan"
                          : "Belum ada data"}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <div className="w-full flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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
