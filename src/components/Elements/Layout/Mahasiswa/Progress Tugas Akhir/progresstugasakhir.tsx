"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SidebarMahasiswa from "@/components/Elements/Layout/Mahasiswa/Sidebar"
import { useEffect, useState } from "react"

const STEPS = [
  "PROPOSAL", "BAB1", "BAB2", "BAB3",
  "SEMINAR", "BAB4", "BAB5", "SIDANG", "EVALUASI"
]

export default function ProgressTugasAkhir() {
  const [progressList, setProgressList] = useState<any[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1]
  }

  const fetchProgress = async () => {
    try {
      const token = getToken()
      if (!token) return

      const res = await fetch(`/api/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const json = await res.json()

      if (json.success) {
        setProgressList(json.data)

        if (json.data.length > 0) {
          const tahapTerbaru = json.data[0].tahap
          const index = STEPS.indexOf(tahapTerbaru)
          setCurrentStepIndex(index !== -1 ? index : 0)
        }
      }
    } catch (err) {
      console.log("Error fetching progress:", err)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [])

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="w-full h-[80px] flex justify-center items-center border-b border-gray-400">
        <div className="w-[1450px] h-[40px] flex justify-between items-center px-6">
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

      {/* BODY */}
      <div className="flex flex-1">
        <SidebarMahasiswa />
        <div className="bg-slate-200 flex-1 min-h-screen flex flex-col items-center gap-6 p-6 overflow-y-auto">

          {/* PATH */}
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>PROGRES TUGAS AKHIR</span>
          </div>

          {/* HEADER */}
          <h1 className="w-full text-2xl font-semibold text-black">
            Progres Tugas Akhir
          </h1>

          {/* STEP PROGRESS */}
          <div className="w-full bg-transparent mt-2">
            <div className="flex justify-between items-center w-full overflow-x-auto">
              {STEPS.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 min-w-[70px]">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center mx-auto
                      ${index <= currentStepIndex
                        ? "bg-blue-600 text-white"
                        : "bg-white border"}
                    `}
                  />
                  <span className="text-sm mt-2 text-center">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTON UPDATE */}
          <div className="w-full flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              + Update Progres
            </button>
          </div>

          {/* RIWAYAT PROGRES */}
          <div className="w-full">
            <h2 className="w-full text-2xl font-semibold text-black mb-3">Riwayat Progres</h2>

            {progressList.length === 0 ? (
              <div className="text-gray-500">Belum ada progress.</div>
            ) : (
              progressList.map((item) => (
                <div key={item.id} className="bg-white w-full rounded-lg shadow-md border border-gray-300 p-6 mb-5">

                  {/* NAMA TAHAP */}
                  <h3 className="text-lg font-semibold">
                    {item.tahap}
                  </h3>

                  {/* GRID INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 mt-4 text-sm">

                    {/* Tanggal update */}
                    <span className="text-gray-500">Di-update pada</span>
                    <span className="md:col-span-3">
                      {new Date(item.tanggalUpdate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>

                    {/* Deskripsi */}
                    <span className="text-gray-500">Deskripsi</span>
                    <p className="md:col-span-3 leading-relaxed">
                      {item.deskripsi}
                    </p>

                    {/* Komentar */}
                    <span className="text-gray-500">Komentar</span>
                    <div className="md:col-span-3 flex flex-col gap-2">
                      {item.comments?.length === 0 ? (
                        <span className="text-gray-500">Belum ada komentar.</span>
                      ) : (
                        item.comments.map((c: any) => (
                          <div key={c.id} className="p-2 bg-gray-100 rounded-md">
                            <div className="text-sm">{c.isiKomentar}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(c.createdAt).toLocaleString("id-ID")}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* File */}
                    <span className="text-gray-500">Berkas</span>
                    {item.fileUpload ? (
                      <a
                        href={item.fileUpload}
                        className="md:col-span-3 text-blue-600 underline"
                      >
                        {item.fileUpload.split("/").pop()}
                      </a>
                    ) : (
                      <span className="md:col-span-3 text-gray-500">Tidak ada file.</span>
                    )}
                  </div>

                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
