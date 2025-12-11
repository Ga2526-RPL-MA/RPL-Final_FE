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

  const [pendingCount, setPendingCount] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]); // Using any for efficiency, ideally interface
  const [activeStudents, setActiveStudents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch Pending Requests
        const reqData = await fetchJson("/api/judul/requests?status=PENDING");
        const requests = reqData.data || [];
        setPendingRequests(requests);
        setPendingCount(requests.length);

        // Fetch Active Students (Bimbingan)
        const mhsData = await fetchJson("/api/dosen/mahasiswa?limit=5"); // Limit 5 for recent
        // Assuming API returns { data: [...] }
        setActiveStudents(mhsData.data || []);

      } catch (err) {
        console.error("Error fetch dashboard data:", err);
      }
    }
    fetchDashboardData();
  }, []);

  const { selectedDate, agendas, refreshAgendas } = useAgenda();

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
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Aktivitas Terkini</h3>
            <div className="space-y-3">
              {pendingRequests.length > 0 ? (
                pendingRequests.slice(0, 3).map((req, i) => (
                  <Link
                    key={`req-${i}`}
                    href={`/dosen/dashboard/manajemen-judul?tab=pending`}
                    className="flex items-start gap-3 text-sm bg-orange-50 p-3 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors"
                  >
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="bi bi-person-plus-fill text-xs"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{req.mahasiswa?.nama || "Mahasiswa"}</p>
                      <p className="text-gray-600 text-xs">Mengajukan judul: <span className="italic">"{req.judul?.judul || "Judul"}"</span></p>
                    </div>
                  </Link>
                ))
              ) : null}

              {activeStudents.length > 0 ? (
                activeStudents.slice(0, 3).map((mhs, i) => (
                  <div key={`mhs-${i}`} className="flex items-start gap-3 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="bi bi-journal-text text-xs"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{mhs.nama}</p>
                      <p className="text-gray-600 text-xs">
                        Progress saat ini: <span className="font-medium text-blue-700">{mhs.judul?.[0]?.progressTerakhir?.tahap || "Belum ada progress"}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : null}

              {pendingRequests.length === 0 && activeStudents.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <i className="bi bi-inbox text-3xl mb-2 block opacity-50"></i>
                  <p className="text-xs">Belum ada aktivitas baru</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
