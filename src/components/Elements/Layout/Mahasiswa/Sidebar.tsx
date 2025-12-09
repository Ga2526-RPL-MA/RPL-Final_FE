"use client"

import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchJson } from "@/lib/api"

const menu = [
  { href: "/mahasiswa/dashboard", icon: "bi bi-house-door", label: "Beranda" },
  { href: "/mahasiswa/dashboard/tawarantugasakhir", icon: "bi bi-people-fill", label: "Tawaran Judul Tugas Akhir" },
  { href: "/mahasiswa/dashboard/progresstugasakhir", icon: "bi bi-book", label: "Progress Tugas Akhir" },
  { href: "/mahasiswa/dashboard/panduanmahasiswa", icon: "bi bi-file-earmark", label: "Panduan" },
]

export default function SidebarMahasiswa() {
  const pathname = usePathname()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await fetchJson("/api/auth/me")
        setName(me.profile?.nama || me.user?.email || "")
        setEmail(me.profile?.email || me.user?.email || "")
      } catch {
        setName("")
        setEmail("")
      }
    }
    fetchProfile()
  }, [])

  const onLogout = useCallback(async () => {
    try {
      await fetchJson("/api/auth/logout", { method: "POST" })
    } catch {}
    document.cookie = "access_token=; path=/; max-age=0"
    document.cookie = "role=; path=/; max-age=0"
    router.push("/auth/login")
  }, [router])

  return (
    <div className="w-[300px] h-[944px] border-r border-gray-400 flex flex-col gap-10">
      <div className="w-full h-[180px] mt-[30px] flex flex-col">
        {menu.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition ${
                  active ? "bg-gray-100 rounded-md" : ""
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <h1 className="font-medium">{item.label}</h1>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="w-full h-[220px] flex flex-col">
        <div className="w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition">
          <i className="bi bi-gear text-xl"></i>
          <h1 className="font-medium">Pengaturan</h1>
        </div>
        <div className="w-full h-[65px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition mt-5">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt={name || "@user"} />
            <AvatarFallback>{(name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-medium">{name || "Pengguna"}</h1>
            <h1 className="font-small text-gray-500">{email || ""}</h1>
          </div>
          <div className=" ml-8">
            <button aria-label="Logout" onClick={onLogout}>
              <i className="bi bi-box-arrow-left text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

