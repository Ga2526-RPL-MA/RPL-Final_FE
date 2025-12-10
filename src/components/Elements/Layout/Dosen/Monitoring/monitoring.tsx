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
    } | null;
  }>;
}

export default function MonitorPage() {
  const router = useRouter();
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaBimbingan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    const fetchMahasiswa = async () => {
      try {
        const json = await fetchJson(`/api/dosen/mahasiswa?page=${currentPage}&limit=${itemsPerPage}`);
        if (json.success) {
          setMahasiswaList(json.data);
          setTotalPages(json.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetch mahasiswa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMahasiswa();
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

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="w-full h-[80px] flex justify-center items-center border-b border-gray-400">
        <div className="w-[1450px] h-[40px] flex justify-center items-center px-6 relative rounded-md">
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

          <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-blue-200">
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
                  : mahasiswaList.length > 0
                    ? mahasiswaList.map((mahasiswa, index) => {
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
                            {getProgressLabel(judulAktif?.progressTerakhir?.tahap || null)}
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
                          Belum ada data
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
