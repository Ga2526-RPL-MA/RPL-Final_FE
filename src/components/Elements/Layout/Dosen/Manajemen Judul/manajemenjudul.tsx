"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function ManajemenJudulPage() {
  // State untuk mengatur Tab yang aktif
  const [activeTab, setActiveTab] = useState("daftar-judul");

  // Dummy Data untuk Tab 1: Daftar Judul
  const judulData = [
    {
      id: 1,
      judul: "Judul A",
      deskripsi: "Deskripsi A",
      lab: "RPL",
      status: "Diambil",
    },
    {
      id: 2,
      judul: "Judul B",
      deskripsi: "Deskripsi B",
      lab: "KCV",
      status: "Draft",
    },
    {
      id: 3,
      judul: "Judul C",
      deskripsi: "Deskripsi C",
      lab: "AJK",
      status: "Published",
    },
    {
      id: 4,
      judul: "Judul D",
      deskripsi: "Deskripsi D",
      lab: "IGS",
      status: "Belum Diambil",
    },
    {
      id: 5,
      judul: "Judul E",
      deskripsi: "Deskripsi E",
      lab: "MI",
      status: "Selesai",
    },
  ];

  // Dummy Data untuk Tab 2: Mahasiswa Bimbingan
  const mahasiswaData = [
    {
      id: 1,
      nama: "Budi Santoso",
      email: "budi@student.com",
      judul: "Sistem AI",
      progres: "Bab 1",
    },
    {
      id: 2,
      nama: "Siti Aminah",
      email: "siti@student.com",
      judul: "Aplikasi Mobile",
      progres: "Proposal",
    },
    {
      id: 3,
      nama: "Ahmad Dani",
      email: "ahmad@student.com",
      judul: "IoT Pertanian",
      progres: "Bab 3",
    },
  ];

  // Dummy Data untuk Tab 3: Pending
  const pendingData = [
    {
      id: 1,
      nama: "Dewi Lestari",
      email: "dewi@student.com",
      judul: "Blockchain Voting",
    },
    {
      id: 2,
      nama: "Rian Ekky",
      email: "rian@student.com",
      judul: "Game Edukasi",
    },
    {
      id: 3,
      nama: "Fajar Sadboy",
      email: "fajar@student.com",
      judul: "Sistem Pakar",
    },
  ];

  // Helper function untuk warna status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Diambil":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Published":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Selesai":
        return "bg-green-100 text-green-700 border-green-200";
      case "Belum Diambil":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"; // Menggunakan warna hijau/emerald
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="w-full h-[80px] flex justify-center items-center border-b border-gray-400">
        <div className="w-[1450px] h-[40px] flex justify-between items-center px-6 relative rounded-md">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="w-[32px] h-[32px] rounded-[8px] bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: "url('/logo.png')" }}
            ></div>
            <h1 className="text-black text-sm ml-3 font-bold">RPL FINAL</h1>
          </div>

          {/* Avatar */}
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar kiri */}
        <div className="w-[300px] h-[944px] border-r border-gray-400 flex flex-col gap-10">
          <div className="w-full h-[225px] mt-[30px] flex flex-col">
            <Link href="/dosen/dashboard">
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-house-door text-xl"></i>
                <h1 className="font-medium">Beranda</h1>
              </div>
            </Link>
            <Link href="/dosen/dashboard/tawaranjudul">
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-people-fill text-xl"></i>
                <h1 className="font-medium">Tawaran Judul</h1>
              </div>
            </Link>
            <Link href="/dosen/dashboard/manajemenjudul">
              {/* Note: Karena ini halaman manajemen judul, mungkin link ini mengarah ke sini atau ke form add */}
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer bg-gray-200 transition">
                {/* Highlight menu ini karena kita ada di konteks Manajemen Judul */}
                <i className="bi bi-book text-xl"></i>
                <h1 className="font-medium">Manajemen Judul</h1>
              </div>
            </Link>
            <Link href="/dosen/dashboard/monitoring">
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-display text-xl"></i>
                <h1 className="font-medium">Monitoring</h1>
              </div>
            </Link>
            <Link href="/dosen/dashboard/panduandosen">
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
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-medium">John Doe</h1>
                <h1 className="font-small text-gray-500">johndoe@gmail.com</h1>
              </div>
              <div className=" ml-8">
                <i className="bi bi-box-arrow-left text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-start w-full text-sm text-gray-500 gap-2 font-medium uppercase">
              <span>BERANDA</span>
              <span>&gt;</span>
              <span>MANAJEMEN JUDUL</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Manajemen Judul
            </h1>
          </div>

          {/* Tabs & Action Button Container */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Tabs */}
            <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex">
              <button
                onClick={() => setActiveTab("daftar-judul")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "daftar-judul"
                    ? "bg-slate-100 text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Daftar Judul
              </button>
              <button
                onClick={() => setActiveTab("mahasiswa-bimbingan")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "mahasiswa-bimbingan"
                    ? "bg-slate-100 text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Daftar Mahasiswa Bimbingan
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "pending"
                    ? "bg-slate-100 text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Pending
              </button>
            </div>

            {/* Action Button (Only visible on Daftar Judul usually) */}
            {activeTab === "daftar-judul" && (
              <Link href="/dosen/dashboard/manajemenjudul">
                <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
                  <i className="bi bi-plus-lg text-lg"></i>
                  Ajukan Judul Baru
                </button>
              </Link>
            )}
          </div>

          {/* Table Container */}
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {/* --- TAB 1: DAFTAR JUDUL --- */}
              {activeTab === "daftar-judul" && (
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-medium text-gray-500">
                    <tr>
                      <th className="px-6 py-4">No</th>
                      <th className="px-6 py-4">Judul</th>
                      <th className="px-6 py-4">Deskripsi</th>
                      <th className="px-6 py-4">Laboratorium</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {judulData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {item.judul}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {item.deskripsi}
                        </td>
                        <td className="px-6 py-4">{item.lab}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3 text-lg text-gray-400">
                            {/* Logic icon aksi berdasarkan status (simulasi) */}
                            {item.status !== "Published" && (
                              <button className="hover:text-green-600">
                                <i className="bi bi-check-lg"></i>
                              </button>
                            )}
                            <button className="hover:text-red-600">
                              <i className="bi bi-trash"></i>
                            </button>
                            <button className="hover:text-blue-600">
                              <i className="bi bi-pencil"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* --- TAB 2: DAFTAR MAHASISWA BIMBINGAN --- */}
              {activeTab === "mahasiswa-bimbingan" && (
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-medium text-gray-500">
                    <tr>
                      <th className="px-6 py-4">No</th>
                      <th className="px-6 py-4">Nama Mahasiswa</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Judul Tugas Akhir</th>
                      <th className="px-6 py-4">Progres Terakhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mahasiswaData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {item.nama}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {item.email}
                        </td>
                        <td className="px-6 py-4">{item.judul}</td>
                        <td className="px-6 py-4">{item.progres}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* --- TAB 3: PENDING --- */}
              {activeTab === "pending" && (
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-medium text-gray-500">
                    <tr>
                      <th className="px-6 py-4">No</th>
                      <th className="px-6 py-4">Nama Mahasiswa</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Judul Tugas Akhir</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {item.nama}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {item.email}
                        </td>
                        <td className="px-6 py-4">{item.judul}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition">
                              Setujui
                            </button>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition">
                              Tolak
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination (Common for all tabs) */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Page 1 of 10</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Previous
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
