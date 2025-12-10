"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import SidebarMahasiswa from "@/components/Elements/Layout/Mahasiswa/Sidebar";

interface Dosen {
  nama: string;
}

interface Lab {
  nama: string;
}

interface JudulDetail {
  id: string;
  judul: string;
  deskripsi: string;
  dosen?: Dosen;
  lab?: Lab;
  status: string;
  createdAt: string;
}

export default function DetailTugasAkhir() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams<{ id?: string }>();
  const id = routeParams?.id || searchParams.get("id") || "";

  const [data, setData] = useState<JudulDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [successModal, setSuccessModal] = useState<{
    show: boolean;
    message: string;
  } | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!id) throw new Error("ID judul tidak ditemukan.");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

      const result = await fetchJson(`/api/judul/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!result.data) throw new Error("Judul tidak ditemukan.");
      setData(result.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMsg(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleAmbilJudul = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        setSuccessModal({
          show: true,
          message: "Token tidak ditemukan. Silakan login ulang.",
        });
        return;
      }

      await fetchJson(`/api/judul/${id}/request`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessModal({
        show: true,
        message: "Judul berhasil diambil!",
      });
      fetchDetail();
    } catch (err: any) {
      setSuccessModal({
        show: true,
        message: "Gagal mengambil judul: " + (err?.message || "Terjadi kesalahan."),
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      DIAMBIL: { label: "Diambil", className: "bg-orange-100 text-orange-800" },
      DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-800" },
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

  const statusLabel =
    data?.status === "BELUM_DIAMBIL"
      ? "Tersedia"
      : data?.status === "DIAMBIL"
        ? "Sudah Diambil"
        : data?.status === "PUBLISHED"
          ? "Published"
          : data?.status;

  const isAvailable = data?.status === "BELUM_DIAMBIL" || data?.status === "PUBLISHED";

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
        <SidebarMahasiswa />
        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>TAWARAN JUDUL TUGAS AKHIR</span>
            <span>&gt;</span>
            <span>DETAIL TUGAS AKHIR</span>
          </div>

          <h1 className="text-2xl font-bold text-black">Detail Tugas Akhir</h1>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex items-start justify-between">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>

              <div className="flex justify-end">
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          ) : errorMsg ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-red-500">{errorMsg}</p>
            </div>
          ) : data ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{data.judul}</h1>
                {getStatusBadge(data.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dosen Pembimbing</p>
                  <p className="font-medium text-gray-900">{data.dosen?.nama ?? "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Laboratorium</p>
                  <p className="font-medium text-gray-900">{data.lab?.nama ?? "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  {getStatusBadge(data.status)}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Tanggal Upload</p>
                  <p className="font-medium text-gray-900">
                    {new Date(data.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed break-words">{data.deskripsi}</p>
              </div>

              {isAvailable && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setConfirmModal({
                        show: true,
                        title: "Ambil Judul",
                        message: "Apakah Anda yakin ingin mengambil judul ini?",
                        onConfirm: handleAmbilJudul,
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                  >
                    Ambil Judul
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-500">Data tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-300 w-[400px]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{confirmModal.title}</h3>
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Ya, Ambil
              </button>
            </div>
          </div>
        </div>
      )}

      {successModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-300 w-[400px]">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Notifikasi</h3>
            <p className="text-gray-600 mb-6">{successModal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setSuccessModal(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
