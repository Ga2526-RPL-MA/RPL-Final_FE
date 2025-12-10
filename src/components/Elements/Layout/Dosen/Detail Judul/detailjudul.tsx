"use client";

import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchJson } from "@/lib/api";
import { useParams, useSearchParams } from "next/navigation";
import SidebarDosen from "@/components/Elements/Layout/Dosen/Sidebar";

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

export default function DetailJudulDosen() {
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const id = params?.id || searchParams.get("id") || "";

  const [data, setData] = useState<JudulDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!id) throw new Error("ID judul tidak ditemukan.");
      const result = await fetchJson(`/api/judul/${id}`);
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (errorMsg) return <p className="p-6 text-red-500">Error: {errorMsg}</p>;
  if (!data) return <p className="p-6">Data tidak ditemukan.</p>;

  const statusLabel =
    data.status === "BELUM_DIAMBIL"
      ? "Tersedia"
      : data.status === "DIAMBIL"
        ? "Sudah Diambil"
        : data.status === "PUBLISHED"
          ? "Dipublish"
          : data.status;

  const isAvailable = data.status === "BELUM_DIAMBIL";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="w-full h-[80px] flex justify-center items-center border-b border-gray-300 bg-[#f4f6fb]">
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

      <div className="flex flex-1 bg-[#f4f6fb]">
        <SidebarDosen />
        <div className="flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>\</span>
            <span>TAWARAN JUDUL</span>
            <span>\</span>
            <span>DETAIL</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{data.judul}</h1>

            <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/profile.png" />
                </Avatar>
                <div>
                  <p className="text-sm text-gray-500">Dosen</p>
                  <p className="font-medium">{data.dosen?.nama ?? "Tidak ada data"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Laboratorium</p>
                <p className="font-medium">{data.lab?.nama ?? "Tidak ada data"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {statusLabel}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Tanggal Upload</p>
                <p className="font-medium">
                  {new Date(data.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-white">
              <h2 className="text-lg font-semibold">Deskripsi</h2>
              <p className="text-gray-700 mt-2 whitespace-pre-line">{data.deskripsi}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
