"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import SidebarMahasiswa from "@/components/Elements/Layout/Mahasiswa/Sidebar";
import { useAgenda } from "@/components/Elements/Context/AgendaContext";

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

interface JudulDiambil {
  id: string;
  judul: string;
  deskripsi: string;
  status: string;
  dosen?: { nama: string } | null;
  lab?: { nama: string } | null;
  mahasiswaId?: string;
  mahasiswa?: { id: string };
}

export default function MahasiswaDashboardPage() {
  const [profileName, setProfileName] = useState<string>("");
  const [profileEmail, setProfileEmail] = useState<string>("");
  const [judulDiambil, setJudulDiambil] = useState<JudulDiambil | null>(null);
  const [loadingJudul, setLoadingJudul] = useState(true);

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

  useEffect(() => {
    async function fetchJudulDiambil() {
      try {
        const [judulData, meData] = await Promise.all([
          fetchJson("/api/judul"),
          fetchJson("/api/auth/me"),
        ]);

        const profileId = meData.profile?.id || meData.user?.id || "";
        const judulListData = Array.isArray(judulData.data) ? judulData.data : Array.isArray(judulData) ? judulData : [];

        const judulYangDiambil = judulListData.find(
          (j: JudulDiambil) =>
            j.mahasiswaId === profileId || j.mahasiswa?.id === profileId
        );

        setJudulDiambil(judulYangDiambil || null);
      } catch (err) {
        console.error("Error fetch judul:", err);
        setJudulDiambil(null);
      } finally {
        setLoadingJudul(false);
      }
    }
    fetchJudulDiambil();
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return {
      day: days[today.getDay()],
      date: today.getDate(),
      month: months[today.getMonth()],
      year: today.getFullYear(),
    };
  };

  const { selectedDate, agendas, refreshAgendas } = useAgenda();
  const [currentAgendaIndex, setCurrentAgendaIndex] = useState(0);

  // Force refresh agendas on mount to ensure data isolation between users
  useEffect(() => {
    refreshAgendas();
  }, []);

  const formattedDate = selectedDate.toISOString().split('T')[0];
  const dayName = selectedDate.toLocaleDateString('id-ID', { weekday: 'long' });
  const fullDate = selectedDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const agendaList = agendas[formattedDate] || [];

  useEffect(() => {
    setCurrentAgendaIndex(0);
  }, [selectedDate]);

  const nextAgenda = () => {
    setCurrentAgendaIndex((prev) => (prev + 1) % agendaList.length);
  };

  const prevAgenda = () => {
    setCurrentAgendaIndex((prev) => (prev - 1 + agendaList.length) % agendaList.length);
  };

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

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-sm text-white p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">{dayName}</h2>
                <p className="text-sm">{fullDate}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm">Agenda Hari Ini:</p>
                {agendaList.length > 0 ? (
                  <div className="flex flex-col items-end w-48">
                    <div className="flex items-center gap-2 mb-1">
                      {agendaList.length > 1 && (
                        <button
                          onClick={prevAgenda}
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <i className="bi bi-chevron-left text-xs"></i>
                        </button>
                      )}
                      <p className="text-sm font-semibold truncate max-w-[120px] text-right">
                        {agendaList[currentAgendaIndex]?.title}
                      </p>
                      {agendaList.length > 1 && (
                        <button
                          onClick={nextAgenda}
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <i className="bi bi-chevron-right text-xs"></i>
                        </button>
                      )}
                    </div>
                    {agendaList.length > 1 && (
                      <span className="text-[10px] opacity-70">
                        {currentAgendaIndex + 1} / {agendaList.length}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-semibold italic opacity-80">Tidak ada agenda</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Judul Tugas Akhir Saya</h3>
            {loadingJudul ? (
              <div className="text-center py-4 text-gray-500 text-sm">Memuat data...</div>
            ) : judulDiambil ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">{judulDiambil.judul}</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      {judulDiambil.deskripsi?.length > 150
                        ? judulDiambil.deskripsi.slice(0, 150) + "..."
                        : judulDiambil.deskripsi || "-"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <i className="bi bi-person"></i>
                        Dosen: {judulDiambil.dosen?.nama || "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="bi bi-building"></i>
                        Lab: {judulDiambil.lab?.nama || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${judulDiambil.status === "DIAMBIL"
                        ? "bg-orange-100 text-orange-800"
                        : judulDiambil.status === "SELESAI"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                        }`}>
                        {judulDiambil.status === "DIAMBIL" ? "Diambil" : judulDiambil.status === "SELESAI" ? "Selesai" : judulDiambil.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/mahasiswa/dashboard/tawarantugasakhir/detailtugasakhir/${judulDiambil.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap flex items-center gap-1"
                  >
                    Lihat Detail
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Pengumuman</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-md px-3 py-2">
                  <i className="bi bi-bell"></i>
                  <span>We've just released a new feature</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
