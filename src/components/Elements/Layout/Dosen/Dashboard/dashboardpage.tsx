"use client"
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchJson } from "@/lib/api";
import SidebarDosen from "@/components/Elements/Layout/Dosen/Sidebar";
import Link from "next/link";

export default function DosenDashboardPage() {
  const [profileName, setProfileName] = useState<string>("");
  const [profileEmail, setProfileEmail] = useState<string>("");
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
  }, []);

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
        <SidebarDosen />
        
        <div className="flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">BERANDA</div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://github.com/shadcn.png" alt={profileName || "@user"} />
              <AvatarFallback>{(profileName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Dosen</p>
              <h1 className="text-2xl font-semibold text-gray-900">
                {profileName ? `Selamat datang, ${profileName}` : "Selamat datang"}
              </h1>
              <p className="text-sm text-gray-500">{profileEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <h2 className="text-2xl font-bold">Selasa</h2>
                <p className="text-sm">02 Desember 2025</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm">Agenda Hari Ini:</p>
                <p className="text-sm font-semibold">Seminar Proposal</p>
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
