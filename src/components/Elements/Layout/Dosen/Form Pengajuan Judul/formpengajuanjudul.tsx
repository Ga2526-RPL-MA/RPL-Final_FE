"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchJson } from "@/lib/api";
import SidebarDosen from "@/components/Elements/Layout/Dosen/Sidebar";
import { useSearchParams } from "next/navigation";

interface Judul {
  id: string;
  judul: string;
  deskripsi: string;
  lab?: { id: string; nama: string };
  labId?: string;
  dosenId?: string;
  status: string;
}

interface Lab {
  id: string;
  nama: string;
}

interface Profile {
  id: string;
  nama: string;
  email: string;
  role: string;
  labId?: string;
}

interface ProgressTerakhir {
  id: string;
  tahap: string;
  deskripsi: string;
  createdAt: string;
}

interface JudulMahasiswa {
  id: string;
  judul: string;
  deskripsi: string;
  status: string;
  lab: { id: string; nama: string };
  progressTerakhir: ProgressTerakhir | null;
  createdAt: string;
}

interface MahasiswaBimbingan {
  id: string;
  nama: string;
  email: string;
  lab: { id: string; nama: string };
  judul: JudulMahasiswa[];
}

interface PendingRequest {
  id: string;
  judulId: string;
  mahasiswaId: string;
  status: string;
  judul: {
    id: string;
    judul: string;
    status: string;
  };
  mahasiswa: {
    id: string;
    nama: string;
    email: string;
  };
}

export default function FormPengajuanJudulPage() {
  const searchParams = useSearchParams();
  const [judulList, setJudulList] = useState<Judul[]>([]);
  const [filteredJudulList, setFilteredJudulList] = useState<Judul[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daftar");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "pending" || tab === "mahasiswa" || tab === "daftar") {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingJudul, setEditingJudul] = useState<Judul | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    labId: "",
  });
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
  const [mahasiswaList, setMahasiswaList] = useState<MahasiswaBimbingan[]>([]);
  const [mahasiswaLoading, setMahasiswaLoading] = useState(false);
  const [mahasiswaPage, setMahasiswaPage] = useState(1);
  const [mahasiswaTotalPages, setMahasiswaTotalPages] = useState(1);
  const [pendingList, setPendingList] = useState<PendingRequest[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLab, setFilterLab] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterProgress, setFilterProgress] = useState<string>("");
  const [showFilter, setShowFilter] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [judulData, labsData, meData] = await Promise.all([
          fetchJson("/api/judul"),
          fetchJson("/api/labs"),
          fetchJson("/api/auth/me"),
        ]);
        setJudulList(Array.isArray(judulData.data) ? judulData.data : Array.isArray(judulData) ? judulData : []);
        setLabs(Array.isArray(labsData.data) ? labsData.data : Array.isArray(labsData) ? labsData : []);
        setProfile(meData.profile);
        if (meData.profile?.labId) {
          setFormData((prev) => ({ ...prev, labId: meData.profile.labId }));
        }
      } catch (err) {
        console.error("Error fetch data:", err);
        setJudulList([]);
        setLabs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "daftar") {
      setCurrentPage(1);
    }
    if (activeTab === "mahasiswa") {
      setMahasiswaPage(1);
    }
    if (activeTab === "pending") {
      setPendingPage(1);
    }
  }, [filterLab, filterStatus, filterProgress, searchQuery, activeTab]);

  useEffect(() => {
    if (profile && judulList.length > 0) {
      let filtered = judulList.filter((judul) => judul.dosenId === profile.id);

      // Filter by lab
      if (filterLab) {
        filtered = filtered.filter((judul) => judul.labId === filterLab || judul.lab?.id === filterLab);
      }

      // Filter by status
      if (filterStatus) {
        filtered = filtered.filter((judul) => judul.status === filterStatus);
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (judul) =>
            judul.judul.toLowerCase().includes(query) ||
            judul.deskripsi.toLowerCase().includes(query) ||
            judul.lab?.nama.toLowerCase().includes(query)
        );
      }

      setFilteredJudulList(filtered);
    }
  }, [profile, judulList, filterLab, filterStatus, searchQuery]);

  useEffect(() => {
    if (activeTab === "mahasiswa") {
      setMahasiswaPage(1);
      setFilterProgress("");
      setSearchQuery("");
    } else if (activeTab === "daftar") {
      setCurrentPage(1);
      setFilterLab("");
      setFilterStatus("");
      setSearchQuery("");
    } else if (activeTab === "pending") {
      setPendingPage(1);
      setSearchQuery("");
    }
    setShowFilter(false);
  }, [activeTab]);

  const [filteredMahasiswaList, setFilteredMahasiswaList] = useState<MahasiswaBimbingan[]>([]);
  const [filteredPendingList, setFilteredPendingList] = useState<PendingRequest[]>([]);

  useEffect(() => {
    if (activeTab === "mahasiswa") {
      if (mahasiswaList.length > 0) {
        let filtered = [...mahasiswaList];

        // Filter by progress
        if (filterProgress) {
          filtered = filtered.filter((mahasiswa) => {
            const judulAktif = mahasiswa.judul[0];
            if (!judulAktif?.progressTerakhir) return filterProgress === "no-progress";
            return judulAktif.progressTerakhir.tahap === filterProgress;
          });
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (mahasiswa) =>
              mahasiswa.nama.toLowerCase().includes(query) ||
              mahasiswa.email.toLowerCase().includes(query) ||
              mahasiswa.judul.some((j) => j.judul.toLowerCase().includes(query))
          );
        }

        setFilteredMahasiswaList(filtered);
        setMahasiswaTotalPages(Math.ceil(filtered.length / itemsPerPage));
      } else {
        setFilteredMahasiswaList([]);
        setMahasiswaTotalPages(1);
      }
    }
  }, [mahasiswaList, filterProgress, searchQuery, activeTab]);

  useEffect(() => {
    if (activeTab === "mahasiswa") {
      const fetchMahasiswa = async () => {
        setMahasiswaLoading(true);
        try {
          const data = await fetchJson(`/api/dosen/mahasiswa?page=${mahasiswaPage}&limit=${itemsPerPage}`);
          setMahasiswaList(data.data || []);
          setMahasiswaTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
        } catch (err) {
          console.error("Error fetch mahasiswa:", err);
          setMahasiswaList([]);
        } finally {
          setMahasiswaLoading(false);
        }
      };
      fetchMahasiswa();
    } else if (activeTab === "pending") {
      const fetchPending = async () => {
        setPendingLoading(true);
        try {
          const data = await fetchJson(`/api/judul/requests?status=PENDING`);
          const requests = data.data || [];
          setPendingList(requests);
        } catch (err) {
          console.error("Error fetch pending:", err);
          setPendingList([]);
        } finally {
          setPendingLoading(false);
        }
      };
      fetchPending();
    }
  }, [activeTab, mahasiswaPage]);

  useEffect(() => {
    if (activeTab === "pending") {
      setPendingPage(1);
      if (pendingList.length > 0) {
        let filtered = [...pendingList];

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (request) =>
              request.mahasiswa.nama.toLowerCase().includes(query) ||
              request.mahasiswa.email.toLowerCase().includes(query) ||
              request.judul.judul.toLowerCase().includes(query)
          );
        }

        setFilteredPendingList(filtered);
        setPendingTotalPages(Math.ceil(filtered.length / itemsPerPage));
      } else {
        setFilteredPendingList([]);
        setPendingTotalPages(1);
      }
    }
  }, [pendingList, searchQuery, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showFilter && !target.closest(".filter-dropdown")) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showFilter]);

  const totalPages = Math.ceil(filteredJudulList.length / itemsPerPage);
  const paginatedList = filteredJudulList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleOpenModal = (judul?: Judul) => {
    if (judul) {
      setEditingJudul(judul);
      setFormData({
        judul: judul.judul,
        deskripsi: judul.deskripsi,
        labId: judul.labId || judul.lab?.id || "",
      });
    } else {
      setEditingJudul(null);
      setFormData({
        judul: "",
        deskripsi: "",
        labId: profile?.labId || "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJudul(null);
    setFormData({
      judul: "",
      deskripsi: "",
      labId: profile?.labId || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingJudul) {
        await fetchJson(`/api/judul/${editingJudul.id}/dosen`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            judul: formData.judul,
            deskripsi: formData.deskripsi,
            labId: formData.labId,
          }),
        });
      } else {
        await fetchJson("/api/judul", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            judul: formData.judul,
            deskripsi: formData.deskripsi,
            labId: formData.labId,
          }),
        });
      }
      const data = await fetchJson("/api/judul");
      const updatedList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setJudulList(updatedList);
      handleCloseModal();
      setSuccessModal({
        show: true,
        message: editingJudul ? "Judul berhasil diperbarui" : "Judul berhasil diajukan",
      });
    } catch (err) {
      console.error("Error submit:", err);
      setSuccessModal({
        show: true,
        message: "Gagal menyimpan judul",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = (judulId: string) => {
    setConfirmModal({
      show: true,
      title: "Konfirmasi Status",
      message: "Apakah Anda yakin ingin mengubah status judul ini menjadi 'Belum Diambil'?",
      confirmText: "Ya, Ubah Status",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await fetchJson(`/api/judul/${judulId}/confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await fetchJson("/api/judul");
          const updatedList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setJudulList(updatedList);
          setSuccessModal({
            show: true,
            message: "Status judul berhasil diubah menjadi 'Belum Diambil'",
          });
        } catch (err) {
          console.error("Error confirm:", err);
          const errorMessage = err instanceof Error ? err.message : "Gagal mengubah status judul";
          setSuccessModal({
            show: true,
            message: errorMessage,
          });
        }
      },
    });
  };

  const handleDelete = (judulId: string, judulName: string) => {
    setConfirmModal({
      show: true,
      title: "Hapus Judul",
      message: "Apakah Anda yakin ingin menghapus judul ini?",
      confirmText: "Ya, Hapus Judul",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await fetchJson(`/api/judul/${judulId}`, {
            method: "DELETE",
          });
          const data = await fetchJson("/api/judul");
          const updatedList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
          setJudulList(updatedList);
          setSuccessModal({
            show: true,
            message: "Judul berhasil dihapus",
          });
        } catch (err) {
          console.error("Error delete:", err);
          const errorMessage = err instanceof Error ? err.message : "Gagal menghapus judul";
          setSuccessModal({
            show: true,
            message: errorMessage,
          });
        }
      },
    });
  };

  const handleApprove = (judulId: string, mahasiswaId: string, mahasiswaName: string) => {
    setConfirmModal({
      show: true,
      title: "Setujui Permintaan",
      message: `Apakah Anda yakin ingin menyetujui permintaan dari ${mahasiswaName}?`,
      confirmText: "Ya, Setujui",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await fetchJson(`/api/judul/${judulId}/approve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mahasiswaId }),
          });
          const data = await fetchJson(`/api/judul/requests?status=PENDING`);
          setPendingList(data.data || []);
          setSuccessModal({
            show: true,
            message: "Permintaan berhasil disetujui",
          });
        } catch (err) {
          console.error("Error approve:", err);
          const errorMessage = err instanceof Error ? err.message : "Gagal menyetujui permintaan";
          setSuccessModal({
            show: true,
            message: errorMessage,
          });
        }
      },
    });
  };

  const handleReject = (judulId: string, mahasiswaId: string, mahasiswaName: string) => {
    setConfirmModal({
      show: true,
      title: "Tolak Permintaan",
      message: `Apakah Anda yakin ingin menolak permintaan dari ${mahasiswaName}?`,
      confirmText: "Ya, Tolak",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await fetchJson(`/api/judul/${judulId}/reject`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mahasiswaId }),
          });
          const data = await fetchJson(`/api/judul/requests?status=PENDING`);
          setPendingList(data.data || []);
          setSuccessModal({
            show: true,
            message: "Permintaan berhasil ditolak",
          });
        } catch (err) {
          console.error("Error reject:", err);
          const errorMessage = err instanceof Error ? err.message : "Gagal menolak permintaan";
          setSuccessModal({
            show: true,
            message: errorMessage,
          });
        }
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      DIAMBIL: { label: "Diambil", className: "bg-orange-100 text-orange-800" },
      Draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      Published: { label: "Published", className: "bg-blue-100 text-blue-800" },
      PUBLISHED: { label: "Published", className: "bg-blue-100 text-blue-800" },
      BELUM_DIAMBIL: { label: "Belum Diambil", className: "bg-blue-50 text-blue-700" },
      SELESAI: { label: "Selesai", className: "bg-green-100 text-green-800" },
    };
    const mapped = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${mapped.className}`}>
        {mapped.label}
      </span>
    );
  };

  const getActionIcons = (item: Judul) => {
    if (item.status === "DIAMBIL" || item.status === "Diambil") {
      return (
        <>
          <button
            onClick={() => handleDelete(item.id, item.judul)}
            className="text-red-600 hover:text-red-800"
            title="Hapus judul"
          >
            <i className="bi bi-trash"></i>
          </button>
          <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800">
            <i className="bi bi-pencil"></i>
          </button>
        </>
      );
    } else if (item.status === "DRAFT" || item.status === "Draft") {
      return (
        <>
          <button
            onClick={() => handleConfirm(item.id)}
            className="text-blue-600 hover:text-blue-800"
            title="Unggah (Ubah status menjadi Belum Diambil)"
          >
            <i className="bi bi-upload"></i>
          </button>
          <button
            onClick={() => handleDelete(item.id, item.judul)}
            className="text-red-600 hover:text-red-800"
            title="Hapus judul"
          >
            <i className="bi bi-trash"></i>
          </button>
          <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800">
            <i className="bi bi-pencil"></i>
          </button>
        </>
      );
    } else if (item.status === "PUBLISHED" || item.status === "Published") {
      return (
        <>
          <button
            onClick={() => handleDelete(item.id, item.judul)}
            className="text-red-600 hover:text-red-800"
            title="Hapus judul"
          >
            <i className="bi bi-trash"></i>
          </button>
          <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800">
            <i className="bi bi-pencil"></i>
          </button>
        </>
      );
    } else {
      return (
        <>
          <button
            onClick={() => handleDelete(item.id, item.judul)}
            className="text-red-600 hover:text-red-800"
            title="Hapus judul"
          >
            <i className="bi bi-trash"></i>
          </button>
          <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800">
            <i className="bi bi-pencil"></i>
          </button>
        </>
      );
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="sticky top-0 z-30 w-full h-[80px] flex justify-center items-center border-b border-gray-400 bg-white">
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

      <div className="flex flex-1">
        <SidebarDosen />
        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400 gap-2 text-sm">
            <span>BERANDA</span>
            <span>&gt;</span>
            <span>MANAJEMEN JUDUL</span>
          </div>

          <h1 className="text-2xl font-bold text-black">Manajemen Judul</h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-300 gap-4 md:gap-0">
            <div className="flex gap-4 md:gap-6 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab("daftar")}
                className={`pb-2 px-1 font-medium whitespace-nowrap ${activeTab === "daftar"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
                  }`}
              >
                Daftar Judul
              </button>
              <button
                onClick={() => setActiveTab("mahasiswa")}
                className={`pb-2 px-1 font-medium whitespace-nowrap ${activeTab === "mahasiswa"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
                  }`}
              >
                Daftar Mahasiswa Bimbingan
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`pb-2 px-1 font-medium whitespace-nowrap ${activeTab === "pending"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
                  }`}
              >
                Pending
              </button>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="w-full md:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition mb-3 md:mb-1"
            >
              <i className="bi bi-plus-lg text-lg"></i>
              <span>Ajukan Judul Baru</span>
            </button>
          </div>

          {activeTab === "daftar" && (
            <>
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Cari judul, deskripsi, atau laboratorium..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <div className="relative filter-dropdown">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
                  >
                    <i className="bi bi-funnel"></i>
                    Filter
                    {(filterLab || filterStatus) && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </button>
                  {showFilter && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 filter-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Laboratorium
                          </label>
                          <select
                            value={filterLab}
                            onChange={(e) => setFilterLab(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          >
                            <option value="">Semua Lab</option>
                            {labs.map((lab) => (
                              <option key={lab.id} value={lab.id}>
                                {lab.nama}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          >
                            <option value="">Semua Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="BELUM_DIAMBIL">Belum Diambil</option>
                            <option value="DIAMBIL">Diambil</option>
                            <option value="SELESAI">Selesai</option>
                            <option value="PUBLISHED">Published</option>
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            setFilterLab("");
                            setFilterStatus("");
                          }}
                          className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm"
                        >
                          Reset Filter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-blue-200 hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laboratorium</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading
                      ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                        <tr key={idx}>
                          {Array.from({ length: 6 }).map((_, colIdx) => (
                            <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                            </td>
                          ))}
                        </tr>
                      ))
                      : paginatedList.length > 0
                        ? paginatedList.map((item, index) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.judul}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {item.deskripsi.length > 50
                                ? item.deskripsi.slice(0, 50) + "..."
                                : item.deskripsi}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.lab?.nama || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {getStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-3">
                                {getActionIcons(item)}
                              </div>
                            </td>
                          </tr>
                        ))
                        : (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-gray-500">
                              Belum ada data
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  ))
                  : paginatedList.length > 0
                    ? paginatedList.map((item) => (
                      <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{item.judul}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {item.deskripsi}
                        </p>
                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <i className="bi bi-building"></i>
                            <span>{item.lab?.nama || "-"}</span>
                          </div>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            {getActionIcons(item)}
                          </div>
                        </div>
                      </div>
                    ))
                    : (
                      <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                        Belum ada data
                      </div>
                    )}
              </div>

              <div className="w-full flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "mahasiswa" && (
            <>
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Cari nama mahasiswa, email, atau judul..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <div className="relative filter-dropdown">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition"
                  >
                    <i className="bi bi-funnel"></i>
                    Filter
                    {filterProgress && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </button>
                  {showFilter && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 filter-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Progress
                          </label>
                          <select
                            value={filterProgress}
                            onChange={(e) => setFilterProgress(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          >
                            <option value="">Semua Progress</option>
                            <option value="no-progress">Belum Ada Progress</option>
                            <option value="PROPOSAL">Proposal</option>
                            <option value="BAB1">Bab 1</option>
                            <option value="BAB2">Bab 2</option>
                            <option value="BAB3">Bab 3</option>
                            <option value="SEMINAR">Seminar</option>
                            <option value="BAB4">Bab 4</option>
                            <option value="BAB5">Bab 5</option>
                            <option value="SIDANG">Sidang</option>
                            <option value="EVALUASI">Evaluasi</option>
                            <option value="SELESAI">Selesai</option>
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            setFilterProgress("");
                          }}
                          className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm"
                        >
                          Reset Filter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-blue-200 hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Mahasiswa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Tugas Akhir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progres Terakhir</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mahasiswaLoading
                      ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                        <tr key={idx}>
                          {Array.from({ length: 5 }).map((_, colIdx) => (
                            <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                            </td>
                          ))}
                        </tr>
                      ))
                      : filteredMahasiswaList.length > 0
                        ? filteredMahasiswaList
                          .slice(
                            (mahasiswaPage - 1) * itemsPerPage,
                            mahasiswaPage * itemsPerPage
                          )
                          .map((mahasiswa, index) => {
                            const judulAktif = mahasiswa.judul[0] || null;
                            const progressTerakhir = judulAktif?.progressTerakhir;
                            return (
                              <tr key={mahasiswa.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {(mahasiswaPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {mahasiswa.nama}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {mahasiswa.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {judulAktif ? judulAktif.judul : "-"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {progressTerakhir ? (
                                    <div>
                                      <div className="font-medium">{progressTerakhir.tahap}</div>
                                      <div className="text-xs text-gray-400 mt-1">
                                        {new Date(progressTerakhir.createdAt).toLocaleDateString("id-ID")}
                                      </div>
                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        : (
                          <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                              Belum ada data mahasiswa bimbingan
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-4">
                {mahasiswaLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  ))
                  : filteredMahasiswaList.length > 0
                    ? filteredMahasiswaList
                      .slice(
                        (mahasiswaPage - 1) * itemsPerPage,
                        mahasiswaPage * itemsPerPage
                      )
                      .map((mahasiswa) => {
                        const judulAktif = mahasiswa.judul[0] || null;
                        const progressTerakhir = judulAktif?.progressTerakhir;
                        return (
                          <div key={mahasiswa.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900">{mahasiswa.nama}</h3>
                                <p className="text-xs text-gray-500">{mahasiswa.email}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-gray-500">Judul Tugas Akhir</p>
                                <p className="text-sm text-gray-800 line-clamp-2">{judulAktif ? judulAktif.judul : "-"}</p>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                                <span className="text-xs font-medium text-gray-500">Progres Terakhir</span>
                                {progressTerakhir ? (
                                  <div className="text-right">
                                    <span className="text-sm font-semibold text-blue-600 block">{progressTerakhir.tahap}</span>
                                    <span className="text-xs text-gray-400">{new Date(progressTerakhir.createdAt).toLocaleDateString("id-ID")}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">-</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : (
                      <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                        Belum ada data mahasiswa bimbingan
                      </div>
                    )}
              </div>

              <div className="w-full flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  Page {mahasiswaPage} of {mahasiswaTotalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMahasiswaPage((prev) => (prev > 1 ? prev - 1 : prev))}
                    disabled={mahasiswaPage === 1}
                    className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${mahasiswaPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setMahasiswaPage((prev) => (prev < mahasiswaTotalPages ? prev + 1 : prev))}
                    disabled={mahasiswaPage === mahasiswaTotalPages}
                    className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${mahasiswaPage === mahasiswaTotalPages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "pending" && (
            <>
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Cari nama mahasiswa, email, atau judul..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-blue-200 hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Mahasiswa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Tugas Akhir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingLoading
                      ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                        <tr key={idx}>
                          {Array.from({ length: 5 }).map((_, colIdx) => (
                            <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                            </td>
                          ))}
                        </tr>
                      ))
                      : filteredPendingList.length > 0
                        ? filteredPendingList
                          .slice(
                            (pendingPage - 1) * itemsPerPage,
                            pendingPage * itemsPerPage
                          )
                          .map((request, index) => (
                            <tr key={request.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {(pendingPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {request.mahasiswa.nama}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.mahasiswa.email}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {request.judul.judul}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleApprove(
                                        request.judulId,
                                        request.mahasiswaId,
                                        request.mahasiswa.nama
                                      )
                                    }
                                    className="bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-lg text-sm hover:bg-blue-700 transition"
                                  >
                                    Setujui
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleReject(
                                        request.judulId,
                                        request.mahasiswaId,
                                        request.mahasiswa.nama
                                      )
                                    }
                                    className="bg-red-600 text-white font-semibold py-1.5 px-4 rounded-lg text-sm hover:bg-red-700 transition"
                                  >
                                    Tolak
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        : (
                          <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                              Belum ada permintaan pending
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-4">
                {pendingLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  ))
                  : filteredPendingList.length > 0
                    ? filteredPendingList
                      .slice(
                        (pendingPage - 1) * itemsPerPage,
                        pendingPage * itemsPerPage
                      )
                      .map((request) => (
                        <div key={request.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{request.mahasiswa.nama}</h3>
                              <p className="text-xs text-gray-500">{request.mahasiswa.email}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-medium text-gray-500">Judul Yang Diajukan</p>
                              <p className="text-sm text-gray-800 line-clamp-2">{request.judul.judul}</p>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2">
                              <button
                                onClick={() =>
                                  handleApprove(
                                    request.judulId,
                                    request.mahasiswaId,
                                    request.mahasiswa.nama
                                  )
                                }
                                className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() =>
                                  handleReject(
                                    request.judulId,
                                    request.mahasiswaId,
                                    request.mahasiswa.nama
                                  )
                                }
                                className="flex-1 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-red-700 transition"
                              >
                                Tolak
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    : (
                      <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                        Belum ada permintaan pending
                      </div>
                    )}
              </div>

              <div className="w-full flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  Page {pendingPage} of {pendingTotalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPendingPage((prev) => (prev > 1 ? prev - 1 : prev))}
                    disabled={pendingPage === 1}
                    className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${pendingPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPendingPage((prev) => (prev < pendingTotalPages ? prev + 1 : prev))}
                    disabled={pendingPage === pendingTotalPages}
                    className={`bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm hover:bg-gray-50 ${pendingPage === pendingTotalPages ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
            <h2 className="text-2xl font-bold text-black mb-6">
              {editingJudul ? "Edit Judul" : "Form Pengajuan Judul"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  id="judul"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                  minLength={5}
                />
              </div>
              <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                  minLength={30}
                />
              </div>
              <div>
                <label htmlFor="labId" className="block text-sm font-medium text-gray-700 mb-1">
                  Laboratorium
                </label>
                <select
                  id="labId"
                  value={formData.labId}
                  onChange={(e) => setFormData({ ...formData, labId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                  required
                >
                  <option value="">Pilih Laboratorium</option>
                  {labs.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {editingJudul ? "Simpan" : "Ajukan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setConfirmModal(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{confirmModal.title}</h2>
              <p className="text-gray-600 text-center text-sm">{confirmModal.message}</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-700 transition"
              >
                {confirmModal.confirmText || "Ya, Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {successModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="bi bi-check-circle-fill text-white text-2xl"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-center">{successModal.message}</p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setSuccessModal(null)}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
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
