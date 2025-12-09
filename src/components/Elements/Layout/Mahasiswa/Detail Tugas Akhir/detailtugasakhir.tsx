"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api";
import { useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const routeParams = useParams<{ id?: string }>();
  const id = routeParams?.id || searchParams.get("id") || "";

  const [data, setData] = useState<JudulDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  if (loading) return <p className="p-4">Loading...</p>;
  if (errorMsg) return <p className="p-4 text-red-500">Error: {errorMsg}</p>;
  if (!data) return <p className="p-4">Data tidak ditemukan.</p>;

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{data.judul}</h1>

      <div className="p-4 border rounded-lg shadow-sm bg-white space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://ui-avatars.com/api/?name=DSN" />
            <AvatarFallback>DSN</AvatarFallback>
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
            className={`px-3 py-1 rounded-full text-sm ${
              isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
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

      <Button onClick={() => alert("Ambil judul belum diimplementasi")} disabled={!isAvailable}>
        Ambil Judul
      </Button>
    </div>
  );
}
