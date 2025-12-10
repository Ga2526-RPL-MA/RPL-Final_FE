"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/lib/api";
import SidebarDosen from "@/components/Elements/Layout/Dosen/Sidebar";

interface MahasiswaBimbingan {
  id: string;
  nama: string;
  email: string;
  lab: { id: string; nama: string };
  judul: Array<{
    id: string;
    judul: string;
    status: string;
    progressTerakhir: {
      tahap: string;
      createdAt: string;
    } | null;
  }>;
}

export default function MonitorPage() {
  const router = useRouter();
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaBimbingan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgress, setFilterProgress] = useState(""); // Changed from filterLab
  const [showFilter, setShowFilter] = useState(false);

  const itemsPerPage = 10;
  const STEPS = [
    "PROPOSAL", "BAB1", "BAB2", "BAB3", "SEMINAR",
    "BAB4", "BAB5", "SIDANG", "EVALUASI", "SELESAI"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await fetchJson(`/api/dosen/mahasiswa?page=${currentPage}&limit=${itemsPerPage}`);
        if (json.success) {
          setMahasiswaList(json.data);
          setTotalPages(json.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  const getProgressLabel = (tahap: string | null) => {
    if (!tahap) return "-";
    return tahap;
  };

  // Filter Logic
  const filteredList = mahasiswaList.filter((mhs) => {
    const judulAktif = mhs.judul.find((j) => j.status === "DIAMBIL") || mhs.judul[0];
    const matchSearch =
      mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (judulAktif?.judul || "").toLowerCase().includes(searchTerm.toLowerCase());

    // Updated Logic: Filter by Progress Stage
    const currentProgress = judulAktif?.progressTerakhir?.tahap || "";

    let matchProgress = true;
    if (filterProgress === "no-progress") {
      matchProgress = !currentProgress;
    } else if (filterProgress) {
      matchProgress = currentProgress === filterProgress;
    }

    return matchSearch && matchProgress;
  });

  return (
    <div className="bg-white min-h-screen flex flex-col">
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
            <span>MONITORING</span>
          </div>

          <h1 className="text-2xl font-bold text-black">Monitoring</h1>

          {/* Search and Filter Section */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari nama mahasiswa atau judul..."
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
                {filterProgress && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </button>
              {showFilter && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 filter-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progres Terakhir
                    </label>
                    <select
                      value={filterProgress}
                      onChange={(e) => setFilterProgress(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    >
                      <option value="">Semua Tahap</option>
                      <option value="no-progress">Belum Ada Progress</option>
                      {STEPS.map((step) => (
                        <option key={step} value={step}>
                          {step}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setFilterProgress("")}
                    className="w-full mt-4 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-4"></div>
                  <div className="h-px bg-gray-100 my-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                </div>
              ))
            ) : filteredList.length > 0 ? (
              filteredList.map((mahasiswa) => {
                const judulAktif = mahasiswa.judul.find((j) => j.status === "DIAMBIL") || mahasiswa.judul[0];
                return (
                  <div
                    key={mahasiswa.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{mahasiswa.nama}</h3>
                        <p className="text-xs text-gray-500">{mahasiswa.lab?.nama || "-"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">
                          {getProgressLabel(judulAktif?.progressTerakhir?.tahap || null)}
                        </span>
                        {judulAktif?.progressTerakhir?.createdAt && (
                          <div className="text-[10px] text-gray-500 mt-1">
                            {new Date(judulAktif.progressTerakhir.createdAt).toLocaleDateString("id-ID")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-700 font-medium line-clamp-2">
                        {judulAktif?.judul || "-"}
                      </p>
                    </div>

                    <div className="w-full h-[1px] bg-gray-100" />

                    <button
                      onClick={() => router.push(`/dosen/dashboard/monitoring/${mahasiswa.id}`)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      Lihat Detail
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <i className="bi bi-inbox text-4xl mb-2"></i>
                  <p>Tidak ada data ditemukan</p>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block w-full bg-white rounded-lg shadow-md overflow-hidden border border-blue-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Mahasiswa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Tugas Akhir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progres Terakhir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading
                  ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                    <tr key={idx}>
                      {Array.from({ length: 5 }).map((_, colIdx) => (
                        <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                  : filteredList.length > 0
                    ? filteredList.map((mahasiswa, index) => {
                      const judulAktif = mahasiswa.judul.find((j) => j.status === "DIAMBIL") || mahasiswa.judul[0];
                      return (
                        <tr key={mahasiswa.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {mahasiswa.nama}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {judulAktif?.judul || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {getProgressLabel(judulAktif?.progressTerakhir?.tahap || null)}
                              </span>
                              {judulAktif?.progressTerakhir?.createdAt && (
                                <span className="text-xs text-gray-400">
                                  {new Date(judulAktif.progressTerakhir.createdAt).toLocaleDateString("id-ID")}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => router.push(`/dosen/dashboard/monitoring/${mahasiswa.id}`)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })
                    : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                          {searchTerm || filterProgress ? "Tidak ada hasil ditemukan" : "Belum ada data"}
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
                className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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
