"use client"

import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchJson } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarCalendar } from "../../Calendar/SidebarCalendar"

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
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Optional: Auto-close on mobile if needed, or set initial state based on width
    // For now defaulting to true is fine, but on mobile it starts "open" which covers screen.
    // Let's check window width on mount.
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await fetchJson("/api/auth/me")
        setName(me.profile?.nama || me.user?.email || "")
        setEmail(me.profile?.email || me.user?.email || "")
      } catch {
        setName("")
        setEmail("")
      } finally {
        setIsLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [])

  const onLogout = useCallback(async () => {
    try {
      await fetchJson("/api/auth/logout", { method: "POST" })
    } catch { }
    document.cookie = "access_token=; path=/; max-age=0"
    document.cookie = "role=; path=/; max-age=0"
    router.push("/auth/login")
  }, [router])

  return (
    <>
      {/* Mobile Hamburger Trigger */}
      <button
        className="md:hidden fixed top-[22px] left-4 z-50 p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <i className="bi bi-list text-2xl"></i>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-50 md:z-20 top-0 left-0 h-full md:min-h-screen bg-white border-r border-gray-400 flex flex-col transition-all duration-300 ease-in-out ${isOpen
          ? "translate-x-0 w-[300px]"
          : "-translate-x-full w-[300px] md:translate-x-0 md:w-[80px]"
          }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-300 rounded-full hidden md:flex items-center justify-center shadow-md hover:bg-gray-50 transition z-10"
        >
          <i className={`bi ${isOpen ? "bi-chevron-left" : "bi-chevron-right"} text-gray-600 text-sm`}></i>
        </button>

        <div className="w-full mt-[30px] flex flex-col">
          {menu.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} title={!isOpen ? item.label : ""}>
                <div
                  className={`w-full h-[45px] flex items-center gap-3 px-4 cursor-pointer hover:bg-gray-200 transition ${active ? "bg-gray-100 rounded-md" : ""
                    } ${!isOpen ? "md:justify-center" : ""}`}
                >
                  <i className={`${item.icon} text-xl flex-shrink-0`}></i>
                  {isOpen && <h1 className="font-medium whitespace-nowrap">{item.label}</h1>}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="w-full px-4 my-4">
          <div className="w-full h-[1px] bg-gray-300" />
        </div>

        {/* User Section - Moved Up */}
        <div className="w-full flex flex-col mb-4">
          <div
            className={`w-full flex items-center gap-3 px-4 ${!isOpen ? "md:justify-center flex-col" : ""
              }`}
          >
            <Avatar className={isOpen ? "" : "mx-auto mb-2"}>
              <AvatarImage src="/profile.png" alt={name || "@user"} />
              <AvatarFallback>{(name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isOpen && (
              <>
                <div className="flex-1">
                  {isLoadingProfile ? (
                    <>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </>
                  ) : (
                    <>
                      <h1 className="font-medium">{name || "Pengguna"}</h1>
                      <h1 className="font-small text-gray-500">{email || ""}</h1>
                    </>
                  )}
                </div>
                <button
                  aria-label="Logout"
                  onClick={onLogout}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <i className="bi bi-box-arrow-left text-xl text-gray-700"></i>
                </button>
              </>
            )}
            {!isOpen && (
              <button
                aria-label="Logout"
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors hidden md:block"
              >
                <i className="bi bi-box-arrow-left text-xl text-gray-700"></i>
              </button>
            )}
          </div>
        </div>

        {/* Calendar - Moved Down */}
        {isOpen && (
          <div className="px-4 mb-6">
            <SidebarCalendar />
          </div>
        )}
      </div>
    </>
  )
}

