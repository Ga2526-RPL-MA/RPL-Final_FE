"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchJson, postJson } from "@/lib/api";
import SidebarDosen from "@/components/Elements/Layout/Dosen/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STEPS = [
  "PROPOSAL", "BAB1", "BAB2", "BAB3",
  "SEMINAR", "BAB4", "BAB5", "SIDANG", "EVALUASI", "SELESAI"
];

interface Progress {
  id: string;
  tahap: string;
  deskripsi: string;
  fileUpload: string | null;
  fileUploadUrl: string | null;
  tanggalUpdate: string;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  isiKomentar: string;
  createdAt: string;
  fileUpload: string | null;
  fileUploadUrl: string | null;
  dosen: {
    id: string;
    nama: string;
  };
}

interface Mahasiswa {
  id: string;
  nama: string;
  email: string;
}

interface Judul {
  id: string;
  judul: string;
  status: string;
}

export default function DetailProgresPage() {
  const params = useParams();
  const router = useRouter();
  const mahasiswaId = params.id as string;

  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);
  const [judul, setJudul] = useState<Judul | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [commentFiles, setCommentFiles] = useState<Record<string, File | null>>({});
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [successModal, setSuccessModal] = useState<{
    show: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (mahasiswaId) {
      fetchData();
    }
  }, [mahasiswaId]);

  const fetchData = async () => {
    try {
      const progressJson = await fetchJson(`/api/progress?mahasiswaId=${mahasiswaId}`);

      if (progressJson.success && progressJson.data.length > 0) {
        const progressData = progressJson.data;
        
        const progressWithComments = await Promise.all(
          progressData.map(async (progress: any) => {
            if (progress.id) {
              try {
                const commentsJson = await fetchJson(`/api/progress/${progress.id}/comments`);
                const comments = commentsJson.success ? commentsJson.data : [];
                return {
                  ...progress,
                  comments: comments.map((comment: any) => ({
                    ...comment,
                    fileUpload: comment.fileUpload || null,
                    fileUploadUrl: comment.fileUploadUrl || null,
                  })),
                };
              } catch (err) {
                return { ...progress, comments: [] };
              }
            }
            return { ...progress, comments: [] };
          })
        );

        setProgressList(progressWithComments);

        if (progressData[0]?.tahap) {
          const index = STEPS.indexOf(progressData[0].tahap);
          setCurrentStepIndex(index !== -1 ? index : 0);
        }

        if (progressData[0]?.mahasiswa) {
          setMahasiswa(progressData[0].mahasiswa);
        }
        if (progressData[0]?.judul) {
          setJudul(progressData[0].judul);
        }
      } else {
        const mahasiswaJson = await fetchJson(`/api/dosen/mahasiswa?page=1&limit=100`);
        if (mahasiswaJson.success) {
          const mahasiswaData = Array.isArray(mahasiswaJson.data) ? mahasiswaJson.data : [];
          const found = mahasiswaData.find((m: any) => m.id === mahasiswaId);
          if (found) {
            setMahasiswa({
              id: found.id,
              nama: found.nama,
              email: found.email,
            });
            if (found.judul && found.judul.length > 0) {
              const judulAktif = found.judul.find((j: any) => j.status === "DIAMBIL") || found.judul[0];
              setJudul({
                id: judulAktif.id,
                judul: judulAktif.judul,
                status: judulAktif.status,
              });
            }
          }
        }
      }
    } catch (err) {
      console.error("Error fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStageClick = (stage: string) => {
    if (selectedStage === stage) {
      setSelectedStage(null);
    } else {
      setSelectedStage(stage);
    }
  };

  const filteredProgressList = selectedStage
    ? progressList.filter((p) => p.tahap === selectedStage)
    : progressList;

  const handleEditComment = (comment: Comment, progress: Progress) => {
    setEditingComment(comment);
    setSelectedProgress(progress);
    setCommentTexts({ ...commentTexts, [progress.id]: comment.isiKomentar });
    setCommentFiles({ ...commentFiles, [progress.id]: null });
  };

  const handleSubmitComment = async (progress: Progress) => {
    const commentText = commentTexts[progress.id] || "";
    const commentFile = commentFiles[progress.id] || null;

    if (!commentText.trim() || commentText.trim().length < 3) {
      setSuccessModal({
        show: true,
        message: "Komentar minimal 3 karakter.",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (editingComment && selectedProgress?.id === progress.id) {
        const json = await postJson(`/api/comments/${editingComment.id}`, {
          method: "PATCH",
          body: JSON.stringify({ isiKomentar: commentText }),
        });

        if (!json.success) {
          setSuccessModal({
            show: true,
            message: "Gagal mengupdate komentar!",
          });
          setSubmitting(false);
          return;
        }

        if (commentFile) {
          try {
            const formData = new FormData();
            formData.append("file", commentFile);
            formData.append("commentId", editingComment.id);
            formData.append("folder", "comments");

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

            if (!uploadRes.ok) {
              const errorText = await uploadRes.text();
              let errorMsg = "Upload file gagal";
              try {
                const errorJson = JSON.parse(errorText);
                errorMsg = errorJson.message || errorMsg;
              } catch {
                errorMsg = errorText || errorMsg;
              }
              setSuccessModal({
                show: true,
                message: `Komentar berhasil diupdate, tetapi upload file gagal: ${errorMsg}`,
              });
              setSubmitting(false);
              return;
            }

            const uploadJson = await uploadRes.json();
            if (!uploadJson.success) {
              const errorMsg = uploadJson.message || "Upload file gagal";
              setSuccessModal({
                show: true,
                message: `Komentar berhasil diupdate, tetapi upload file gagal: ${errorMsg}`,
              });
              setSubmitting(false);
              return;
            }
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            setSuccessModal({
              show: true,
              message: `Komentar berhasil diupdate, tetapi upload file gagal: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
            });
            setSubmitting(false);
            return;
          }
          
          await fetchData();
        } else {
          await fetchData();
        }

        setSuccessModal({
          show: true,
          message: "Komentar berhasil diupdate!",
        });
      } else {
        const json = await postJson(`/api/progress/${progress.id}/comments`, {
          body: JSON.stringify({ isiKomentar: commentText }),
        });

        if (!json.success) {
          setSuccessModal({
            show: true,
            message: "Gagal mengirim komentar!",
          });
          setSubmitting(false);
          return;
        }

        if (commentFile) {
          try {
            const formData = new FormData();
            formData.append("file", commentFile);
            formData.append("commentId", json.data.id);
            formData.append("folder", "comments");

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

            if (!uploadRes.ok) {
              const errorText = await uploadRes.text();
              let errorMsg = "Upload file gagal";
              try {
                const errorJson = JSON.parse(errorText);
                errorMsg = errorJson.message || errorMsg;
              } catch {
                errorMsg = errorText || errorMsg;
              }
              setSuccessModal({
                show: true,
                message: `Komentar berhasil dikirim, tetapi upload file gagal: ${errorMsg}`,
              });
              setSubmitting(false);
              return;
            }

            const uploadJson = await uploadRes.json();
            if (!uploadJson.success) {
              const errorMsg = uploadJson.message || "Upload file gagal";
              setSuccessModal({
                show: true,
                message: `Komentar berhasil dikirim, tetapi upload file gagal: ${errorMsg}`,
              });
              setSubmitting(false);
              return;
            }
            
            await fetchData();
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            setSuccessModal({
              show: true,
              message: `Komentar berhasil dikirim, tetapi upload file gagal: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
            });
            setSubmitting(false);
            return;
          }
        } else {
          await fetchData();
        }

        setSuccessModal({
          show: true,
          message: "Komentar berhasil dikirim!",
        });
      }

      setCommentTexts({ ...commentTexts, [progress.id]: "" });
      setCommentFiles({ ...commentFiles, [progress.id]: null });
      setEditingComment(null);
      setSelectedProgress(null);

    } catch (error) {
      console.error("Error submit comment:", error);
      setSuccessModal({
        show: true,
        message: "Terjadi kesalahan saat mengirim komentar.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = (comment: Comment) => {
    setConfirmModal({
      show: true,
      title: "Hapus Komentar",
      message: "Apakah Anda yakin ingin menghapus komentar ini?",
      onConfirm: async () => {
        try {
          const json = await postJson(`/api/comments/${comment.id}`, {
            method: "DELETE",
          });

          if (!json.success) {
            setSuccessModal({
              show: true,
              message: "Gagal menghapus komentar!",
            });
            return;
          }

          setSuccessModal({
            show: true,
            message: "Komentar berhasil dihapus!",
          });
          fetchData();
        } catch (error) {
          console.error("Error delete comment:", error);
          setSuccessModal({
            show: true,
            message: "Terjadi kesalahan saat menghapus komentar.",
          });
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col relative">
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

      <div className="flex flex-1">
        <SidebarDosen />
        <div className="bg-slate-200 flex-1 min-h-screen flex flex-col gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>MONITORING</span>
            <span>&gt;</span>
            <span>DETAIL PROGRES</span>
          </div>

          <h1 className="text-2xl font-bold text-black">Detail Progres</h1>

          <div className="w-full mt-2">
            <div className="flex justify-between items-center w-full overflow-x-auto">
              {STEPS.map((item, index) => {
                const hasProgress = progressList.some((p) => p.tahap === item);
                const isSelected = selectedStage === item;
                const stepIndex = STEPS.indexOf(item);
                const isCompleted = stepIndex < currentStepIndex;
                const isCurrent = stepIndex === currentStepIndex;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 min-w-[70px] cursor-pointer"
                    onClick={() => handleStageClick(item)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-sm transition ${
                        isCompleted
                          ? "bg-blue-600 text-white shadow-lg"
                          : isCurrent
                          ? "bg-blue-100 border-2 border-blue-600"
                          : hasProgress
                          ? "bg-gray-100 border-2 border-gray-400"
                          : "bg-white border"
                      } ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                    >
                      {isCompleted && <i className="bi bi-check text-white"></i>}
                    </div>
                    <span
                      className={`text-sm mt-2 text-center font-medium ${
                        isSelected ? "text-blue-600 font-bold" : isCompleted || isCurrent ? "text-blue-600" : hasProgress ? "text-gray-700" : "text-gray-500"
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full">
            <h2 className="text-2xl font-semibold text-black mb-3">Riwayat Progres</h2>

            {filteredProgressList.length === 0 ? (
              <div className="w-full bg-white rounded-xl border border-gray-300 shadow-sm p-10 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="bi bi-folder-x text-6xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">
                  {selectedStage ? `Belum Ada Progress untuk ${selectedStage}` : "Belum Ada Progress"}
                </h3>
              </div>
            ) : (
              filteredProgressList.map((progress) => (
                <div key={progress.id} className="bg-white w-full rounded-lg shadow-md border border-gray-300 p-6 mb-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">{progress.tahap}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Di-update pada {new Date(progress.tanggalUpdate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 mt-4 text-sm">
                    <span className="text-gray-500">Deskripsi</span>
                    <p className="md:col-span-3">{progress.deskripsi}</p>

                    <span className="text-gray-500">Berkas</span>
                    {progress.fileUploadUrl || progress.fileUpload ? (
                      <div className="md:col-span-3 flex gap-2">
                        <a
                          href={progress.fileUploadUrl || progress.fileUpload || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          Lihat
                        </a>
                        <a
                          href={progress.fileUploadUrl || progress.fileUpload || "#"}
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

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold mb-4">Komentar</h4>
                    
                    {progress.comments && progress.comments.length > 0 && (
                      <div className="mb-4 space-y-4">
                        {progress.comments.map((comment: any) => {
                          const hasFile = !!(comment.fileUploadUrl || comment.fileUpload);
                          return (
                            <div key={comment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{comment.isiKomentar}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.createdAt).toLocaleDateString("id-ID")}
                                  </p>
                                  {hasFile && (
                                    <div className="flex gap-2 mt-2">
                                      <a
                                        href={comment.fileUploadUrl || comment.fileUpload || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                                      >
                                        Lihat
                                      </a>
                                      <a
                                        href={comment.fileUploadUrl || comment.fileUpload || "#"}
                                        download
                                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  )}
                                </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditComment(comment, progress)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Komentar</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tulis komentar..."
                        value={commentTexts[progress.id] || ""}
                        onChange={(e) => setCommentTexts({ ...commentTexts, [progress.id]: e.target.value })}
                      />
                      
                      <div className="flex items-center gap-2 mb-4">
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                          <i className="bi bi-folder2-open"></i>
                          <span className="text-sm">Browse</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setCommentFiles({ ...commentFiles, [progress.id]: e.target.files?.[0] || null })}
                            accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                          />
                        </label>
                        <span className="text-sm text-gray-500">
                          {commentFiles[progress.id]?.name || "Unggah berkas"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">TXT, PDF, DOC, DOCX, JPG, PNG, GIF (Max. 100mb)</p>
                      
                      <div className="flex gap-2">
                        {editingComment && selectedProgress?.id === progress.id && (
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setSelectedProgress(null);
                              setCommentTexts({ ...commentTexts, [progress.id]: "" });
                              setCommentFiles({ ...commentFiles, [progress.id]: null });
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                          >
                            Batal
                          </button>
                        )}
                        <button
                          onClick={() => handleSubmitComment(progress)}
                          disabled={submitting}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {submitting ? "Mengirim..." : editingComment && selectedProgress?.id === progress.id ? "Update Komentar" : "Kirim Komentar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>


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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
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

