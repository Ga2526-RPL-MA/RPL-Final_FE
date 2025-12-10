"use client"
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchJson } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarDosen from "@/components/Elements/Layout/Dosen/Sidebar";
import Link from "next/link";
import { useAgenda } from "@/components/Elements/Context/AgendaContext";

export default function DosenDashboardPage() {
  const [profileName, setProfileName] = useState<string>("");
  const [profileEmail, setProfileEmail] = useState<string>("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [pendingCount, setPendingCount] = useState<number>(0);

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
      } finally {
        setIsLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchPendingCount() {
      try {
        const data = await fetchJson("/api/judul/requests?status=PENDING");
        const requests = data.data || [];
        setPendingCount(requests.length);
      } catch (err) {
        console.error("Error fetch pending count:", err);
        setPendingCount(0);
      }
    }
    fetchPendingCount();
    fetchPendingCount();
  }, []);

  const { selectedDate, agendas, refreshAgendas } = useAgenda();

  // Force refresh agendas on mount to ensure data isolation between users
  useEffect(() => {
    refreshAgendas();
  }, []);
  const [currentAgendaIndex, setCurrentAgendaIndex] = useState(0);

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
      <div className="sticky top-0 z-30 w-full h-[80px] flex justify-center items-center border-b border-gray-300 bg-[#f4f6fb]">
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

      <div className="flex flex-1 bg-[#f4f6fb]">
        <SidebarDosen />

        <div className="flex-1 min-h-screen flex flex-col gap-6 p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/profile.png" alt={profileName || "@user"} />
              <AvatarFallback>{(profileName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Dosen</p>
              {isLoadingProfile ? (
                <>
                  <Skeleton className="h-8 w-64 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {profileName ? `Selamat datang, ${profileName}` : "Selamat datang"}
                  </h1>
                  <p className="text-sm text-gray-500">{profileEmail}</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dosen/dashboard/manajemen-judul"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-blue-600">
                <i className="bi bi-laptop"></i>
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-900">Pengajuan Judul</h3>
                <p className="text-sm text-gray-600">Ajukan judul tugas akhir Anda.</p>
              </div>
            </Link>

            <Link
              href="/dosen/dashboard/manajemen-judul?tab=pending"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-3 hover:shadow-md transition-shadow cursor-pointer relative"
            >
              <div className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-blue-600 relative">
                <i className="bi bi-clock"></i>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Pending Request</h3>
                </div>
                <p className="text-sm text-gray-600">Lihat pending request.</p>
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
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Pengumuman</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-md px-3 py-2">
                  <i className="bi bi-bell"></i>
                  <span>We’ve just released a new feature</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
