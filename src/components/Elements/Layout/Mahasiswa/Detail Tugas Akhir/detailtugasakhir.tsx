"use client";

import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/api";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [profileName, setProfileName] = useState<string>("");
  const [profileEmail, setProfileEmail] = useState<string>("");
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
        alert("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      await fetchJson(`/api/judul/${id}/request`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Judul berhasil diambil!");
      fetchDetail();
    } catch (err: any) {
      alert("Gagal mengambil judul: " + (err?.message || "Terjadi kesalahan."));
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];
        if (!token) return;
        const me = await fetchJson("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileName(me.profile?.nama || me.user?.email || "");
        setProfileEmail(me.profile?.email || me.user?.email || "");
      } catch (err) {
        console.error("Error fetch profile:", err);
      }
    }
    fetchProfile();
  }, []);

  const statusLabel =
    data?.status === "BELUM_DIAMBIL"
      ? "Tersedia"
      : data?.status === "DIAMBIL"
        ? "Sudah Diambil"
        : data?.status === "PUBLISHED"
          ? "Published"
          : data?.status;

  const isAvailable = data?.status === "BELUM_DIAMBIL";

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
        {/* Sidebar */}
        <div className="w-[300px] h-[944px] border-r border-gray-400 flex flex-col gap-10">
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
                <AvatarImage src="https://github.com/shadcn.png" alt={profileName || "@user"} />
                <AvatarFallback>{(profileName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-medium">{profileName || "Pengguna"}</h1>
                <h1 className="font-small text-gray-500">{profileEmail || ""}</h1>
              </div>
              <div className=" ml-8">
                <button
                  aria-label="Logout"
                  onClick={async () => {
                    try {
                      await fetchJson("/api/auth/logout", { method: "POST" });
                    } catch (e) {
                      console.error("Logout failed", e);
                    } finally {
                      document.cookie = "access_token=; path=/; max-age=0";
                      document.cookie = "role=; path=/; max-age=0";
                      router.push("/auth/login");
                    }
                  }}
                >
                  <i className="bi bi-box-arrow-left text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col items-center gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400 gap-2">
            <span>BERANDA</span>
            <span>\</span>
            <span>TAWARAN JUDUL TUGAS AKHIR</span>
            <span>\</span>
            <span>DETAIL TUGAS AKHIR</span>
          </div>

          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">Detail Tugas Akhir</h1>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : data ? (
            <div className="w-full bg-white border border-gray-300 rounded-xl p-6">
              {/* Judul + Status */}
              <div className="border border-dotted border-gray-400 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-semibold text-black">{data.judul}</h1>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${data.status === "PUBLISHED"
                        ? "bg-blue-100 text-blue-800"
                        : data.status === "DIAMBIL"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Dibuat pada: {new Date(data.createdAt).toLocaleDateString("id-ID")}
                </p>
                <p className="text-sm text-gray-500">
                  Dibuat oleh: {data.dosen?.nama ?? "-"}
                </p>
              </div>

              <div className="w-full h-[1px] bg-gray-400 my-4"></div>

              {/* Informasi */}
              <h1 className="text-2xl font-semibold text-black mb-2">Informasi</h1>
              <div className="border border-dotted border-gray-400 p-4 rounded-lg">
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Judul</p>
                  <p className="text-black">{data.judul}</p>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-500">Deskripsi</p>
                  <p className="text-black text-justify">{data.deskripsi}</p>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-500">Laboratorium</p>
                  <p className="text-black">{data.lab?.nama ?? "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Dosen Pembimbing</p>
                  <p className="text-black">{data.dosen?.nama ?? "-"}</p>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-400 my-4"></div>

              {/* Tombol */}
              <div className="flex justify-end">
                <Button disabled={!isAvailable} onClick={handleAmbilJudul}>
                  Ambil Judul
                </Button>
              </div>
            </div>
          ) : (
            <p>Data tidak ditemukan</p>
          )}
        </div>
      </div>
    </div>
  );
}
