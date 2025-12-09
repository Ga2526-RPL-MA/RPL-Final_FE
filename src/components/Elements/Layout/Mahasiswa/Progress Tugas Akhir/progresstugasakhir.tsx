"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarMahasiswa from "@/components/Elements/Layout/Mahasiswa/Sidebar";
import { useEffect, useState } from "react";
import { fetchJson, postJson } from "@/lib/api";

const STEPS = [
  "PROPOSAL", "BAB1", "BAB2", "BAB3",
  "SEMINAR", "BAB4", "BAB5", "SIDANG", "EVALUASI", "SELESAI"
];

export default function ProgressTugasAkhir() {
  const [progressList, setProgressList] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [showRiwayat, setShowRiwayat] = useState(false);
  const [showKomentar, setShowKomentar] = useState(false);
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);
  const [successModal, setSuccessModal] = useState<{
    show: boolean;
    message: string;
  } | null>(null);
  const semuaKomentar = progressList.flatMap(p => p.comments || []);

  const [tahap, setTahap] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [judulId, setJudulId] = useState<string | null>(null);
  const [judulTugasAkhir, setJudulTugasAkhir] = useState("");

  const fetchProgress = async () => {
    try {
      const [progressJson, judulJson, meJson] = await Promise.all([
        fetchJson("/api/progress"),
        fetchJson("/api/judul"),
        fetchJson("/api/auth/me"),
      ]);

      const profileId = meJson.profile?.id || meJson.user?.id;

      if (progressJson.success) {
        setProgressList(progressJson.data);

        if (progressJson.data.length > 0) {
          const tahapTerbaru = progressJson.data[0].tahap;
          const index = STEPS.indexOf(tahapTerbaru);
          setCurrentStepIndex(index !== -1 ? index : 0);

          setJudulTugasAkhir(progressJson.data[0].judul?.judul || "");
          setJudulId(progressJson.data[0].judulId);
        }
      }

      if (judulJson.success && profileId) {
        const judulData = Array.isArray(judulJson.data) ? judulJson.data : [];
        const judulDiambil = judulData.find((j: any) => 
          j.mahasiswa?.id === profileId || j.mahasiswaId === profileId
        );
        
        if (judulDiambil && !judulId) {
          setJudulId(judulDiambil.id);
          setJudulTugasAkhir(judulDiambil.judul || "");
        }
      }

    } catch (err) {
      console.log("Error fetching progress:", err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const progressTerbaru = progressList[0] || null;

  const handleOpenModal = (progress?: any) => {
    if (progress) {
      setEditingProgressId(progress.id);
      setTahap(progress.tahap || "");
      setDeskripsi(progress.deskripsi || "");
      setFile(null);
    } else {
      setEditingProgressId(null);
      setTahap("");
      setDeskripsi("");
      setFile(null);
    }
    setShowPopup(true);
  };

  const handleSubmitProgress = async () => {
    if (!tahap || !deskripsi || deskripsi.length < 5) {
      setSuccessModal({
        show: true,
        message: "Isi tahap dan deskripsi minimal 5 karakter.",
      });
      return;
    }

    if (!judulId) {
      setSuccessModal({
        show: true,
        message: "Judul tugas akhir tidak ditemukan. Pastikan Anda sudah mengambil judul tugas akhir terlebih dahulu.",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (editingProgressId) {
        const updateData: any = { tahap, deskripsi };
        const json = await postJson(`/api/progress/${editingProgressId}`, {
          method: "PATCH",
          body: JSON.stringify(updateData),
        });

        if (!json.success) {
          setSuccessModal({
            show: true,
            message: "Gagal mengupdate progress!",
          });
          setSubmitting(false);
          return;
        }

        const progressId = editingProgressId;

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("progressId", String(progressId));

          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];

          const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9000";
          const uploadRes = await fetch(`${base}/api/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const uploadJson = await uploadRes.json();
          if (!uploadJson.success) {
            setSuccessModal({
              show: true,
              message: "Progress berhasil diupdate, tetapi upload file gagal.",
            });
            setSubmitting(false);
            return;
          }
        }

        setSuccessModal({
          show: true,
          message: "Progress berhasil diupdate!",
        });
      } else {
        const json = await postJson("/api/progress", {
          body: JSON.stringify({
            tahap,
            deskripsi,
            judulId,
          }),
        });

        if (!json.success) {
          setSuccessModal({
            show: true,
            message: "Gagal membuat progress!",
          });
          setSubmitting(false);
          return;
        }

        const progressId = json.data.id;

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("progressId", String(progressId));

          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];

          const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9000";
          const uploadRes = await fetch(`${base}/api/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const uploadJson = await uploadRes.json();
          if (!uploadJson.success) {
            setSuccessModal({
              show: true,
              message: "Progress berhasil dibuat, tetapi upload file gagal.",
            });
            setSubmitting(false);
            return;
          }
        }

        setSuccessModal({
          show: true,
          message: "Progress berhasil disimpan!",
        });
      }

      setShowPopup(false);
      setTahap("");
      setDeskripsi("");
      setFile(null);
      setEditingProgressId(null);
      fetchProgress();

    } catch (error) {
      console.log("Error submit:", error);
      setSuccessModal({
        show: true,
        message: "Terjadi kesalahan saat menyimpan progress.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col relative">

      {/* HEADER */}
      <div className="w-full h-[80px] flex justify-center items-center border-b border-gray-300 bg-white/80 backdrop-blur-sm">
        <div className="w-[1450px] h-[40px] flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-8 h-8 rounded-lg" />
            <h1 className="text-black text-sm font-bold tracking-wide">RPL FINAL</h1>
          </div>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-1">
        <SidebarMahasiswa />

        <div className="bg-slate-200 flex-1 min-h-screen flex flex-col items-center gap-6 p-6 overflow-y-auto">

          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>PROGRESS TUGAS AKHIR</span>
          </div>

          <h1 className="w-full text-2xl font-semibold text-black">Progres Tugas Akhir</h1>

          {/* Stepper */}
          <div className="w-full mt-2">
            <div className="flex justify-between items-center w-full overflow-x-auto">
              {STEPS.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 min-w-[70px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-sm
                      ${index <= currentStepIndex
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white border"}
                    `}
                  />
                  <span className="text-sm mt-2 text-center font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-between items-center mt-3">
            <button
              onClick={() => setShowRiwayat(true)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Lihat Riwayat
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              + Update Progres
            </button>
          </div>

          <div className="w-full">
            <h2 className="w-full text-2xl font-semibold text-black mb-3">Progress Terbaru</h2>

            {!progressTerbaru ? (
              <div className="w-full bg-white rounded-xl border border-gray-300 shadow-sm p-10 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="bi bi-folder-x text-6xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Belum Ada Progress</h3>
              </div>
            ) : (
              <div className="bg-white w-full rounded-lg shadow-md border border-gray-300 p-6 mb-5">

                <h3 className="text-lg font-semibold">{progressTerbaru.tahap}</h3>

                <p className="text-md font-medium text-gray-700 mb-3">
                  {judulTugasAkhir || "-"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 mt-4 text-sm">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="md:col-span-3">
                    {new Date(progressTerbaru.tanggalUpdate).toLocaleDateString("id-ID")}
                  </span>

                  <span className="text-gray-500">Deskripsi</span>
                  <p className="md:col-span-3">{progressTerbaru.deskripsi}</p>

                  <span className="text-gray-500">File</span>
                  {progressTerbaru.fileUploadUrl || progressTerbaru.fileUpload ? (
                    <div className="md:col-span-3 flex gap-2">
                      <a
                        href={progressTerbaru.fileUploadUrl || progressTerbaru.fileUpload || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Lihat
                      </a>
                      <a
                        href={progressTerbaru.fileUploadUrl || progressTerbaru.fileUpload || "#"}
                        download
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Download
                      </a>
                    </div>
                  ) : (
                    <span className="md:col-span-3 text-gray-500">Tidak ada file</span>
                  )}
                </div>

                <button
                  onClick={() => setShowKomentar(true)}
                  className="mt-5 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Lihat Komentar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[600px] rounded-xl shadow-xl p-6 border border-gray-300">

            <h2 className="text-2xl font-semibold mb-5">
              {editingProgressId ? "Edit Progres" : "Laporkan Progres Baru"}
            </h2>

            <label className="block text-sm font-medium mb-1">Tahap</label>
            <select
              className="w-full border p-3 rounded-lg mb-4"
              value={tahap}
              onChange={(e) => setTahap(e.target.value)}
            >
              <option value="">Pilih Tahapan</option>
              {STEPS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              className="w-full border p-3 rounded-lg h-28 mb-4"
              placeholder="Tulis deskripsi progres..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />

            <label className="block text-sm font-medium mb-1">Unggah Berkas</label>
            <input
              type="file"
              className="w-full border p-3 rounded-lg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                onClick={() => {
                  setShowPopup(false);
                  setEditingProgressId(null);
                  setTahap("");
                  setDeskripsi("");
                  setFile(null);
                }}
                disabled={submitting}
              >
                Batal
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSubmitProgress}
                disabled={submitting}
              >
                {submitting ? "Menyimpan..." : editingProgressId ? "Update Progres" : "Simpan Progres"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRiwayat && (
        <div className="absolute inset-0 flex justify-center items-center z-[999] backdrop-blur-md bg-black/30">
          <div className="bg-white w-[850px] max-h-[85vh] overflow-y-auto rounded-xl shadow-xl p-6 border border-gray-300">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Riwayat Progress</h2>
              <button className="text-red-600 font-semibold" onClick={() => setShowRiwayat(false)}>✕</button>
            </div>

            {progressList.length === 0 ? (
              <p className="text-gray-500 text-center py-10">Belum ada riwayat progress.</p>
            ) : (
              progressList.map((item) => (
                <div key={item.id} className="bg-white w-full rounded-lg shadow-md border border-gray-300 p-6 mb-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{item.tahap}</h3>
                    <button
                      onClick={() => {
                        setShowRiwayat(false);
                        handleOpenModal(item);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 mt-4 text-sm">
                    <span className="text-gray-500">Tanggal</span>
                    <span className="md:col-span-3">{new Date(item.tanggalUpdate).toLocaleDateString("id-ID")}</span>

                    <span className="text-gray-500">Deskripsi</span>
                    <p className="md:col-span-3">{item.deskripsi}</p>

                    <span className="text-gray-500">File</span>
                    {item.fileUploadUrl || item.fileUpload ? (
                      <div className="md:col-span-3 flex gap-2">
                        <a
                          href={item.fileUploadUrl || item.fileUpload || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          Lihat
                        </a>
                        <a
                          href={item.fileUploadUrl || item.fileUpload || "#"}
                          download
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="md:col-span-3 text-gray-500">Tidak ada file</span>
                    )}
                  </div>
                </div>
              ))
            )}

          </div>
        </div>
      )}

      {showKomentar && progressTerbaru && (
        <div className="absolute inset-0 flex justify-center items-center z-[999] backdrop-blur-md bg-black/30">
          <div className="bg-white w-[650px] max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 border border-gray-300">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Komentar Dosen</h2>
              <button className="text-red-600 font-semibold" onClick={() => setShowKomentar(false)}>✕</button>
            </div>

            {semuaKomentar.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Tidak ada komentar.</p>
            ) : (
              semuaKomentar.map((k: any) => (
                <div
                  key={k.id}
                  className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-800">{k.isiKomentar}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(k.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))
            )}

          </div>
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setConfirmModal(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-300 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">{confirmModal.title}</h3>
            <p className="text-gray-700 mb-6">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {confirmModal.confirmText || "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {successModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-300 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Notifikasi</h3>
            <p className="text-gray-700 mb-6">{successModal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setSuccessModal(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
