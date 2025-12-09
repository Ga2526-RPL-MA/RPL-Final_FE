import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DosenDashboardPage() {
  const [profileName, setProfileName] = useState<string>("");
  const [profileEmail, setProfileEmail] = useState<string>("");
  const router = useRouter();

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

  return (
    <div className="bg-white min-h-screen flex flex-col">
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
              <AvatarImage src="https://github.com/shadcn.png" alt={profileName || "@user"} />
              <AvatarFallback>{(profileName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
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

            <Link href="/dosen/dashboard/formpengajuanjudul">
              <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
                <i className="bi bi-book text-xl"></i>
                <h1 className="font-medium">Form Pengajuan Judul</h1>
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

        <div className="bg-slate-200 flex-1 h-[944px] flex flex-col items-center gap-6 p-6 overflow-y-auto">
          <div className="flex justify-start w-full text-gray-400">BERANDA</div>
          <div className="bg-white w-[1280px] h-[219px] rounded-lg shadow-md border border-gray-400">
            <div className="flex items-center justify-center h-full gap-6 mr-120">
              <Avatar className="w-40 h-40">
                <AvatarImage src="https://github.com/shadcn.png" alt={profileName || "@user"} />
                <AvatarFallback>{(profileName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start">
                <h1 className="text-black text-3xl font-bold">
                  {profileName ? `Selamat Datang, ${profileName}` : "Selamat Datang"}
                </h1>
                <h2 className="text-gray-700 text-lg font-medium mt-1">
                  Dosen
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
