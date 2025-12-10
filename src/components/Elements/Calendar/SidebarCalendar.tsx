"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAgenda } from "@/components/Elements/Context/AgendaContext"

const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
]

export function SidebarCalendar() {
    const { selectedDate, setSelectedDate, addAgenda, removeAgenda, agendas } = useAgenda()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [activityName, setActivityName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Use currentDate for month view navigation
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay()
    }

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const handleDateClick = (day: number) => {
        const newDate = new Date(year, month, day)
        setSelectedDate(newDate)
    }

    const handleAddAgenda = async () => {
        if (!activityName.trim()) return

        setIsSubmitting(true)
        try {
            await addAgenda(selectedDate, activityName)
            setActivityName("")
        } catch (error) {
            console.error(error)
            alert("Gagal menambahkan agenda")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteAgenda = async (id: string) => {
        // if (!confirm("Hapus agenda ini?")) return

        setDeletingId(id)
        try {
            await removeAgenda(id, selectedDate)
        } catch (error) {
            console.error(error)
            alert("Gagal menghapus agenda")
        } finally {
            setDeletingId(null)
        }
    }

    // Get agendas for selected date
    const dateKey = selectedDate.toISOString().split('T')[0]
    const currentAgendas = agendas[dateKey] || []

    const formattedSelectedDate = selectedDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short"
    })

    return (
        <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <button
                    onClick={prevMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>
                <span className="font-bold text-gray-700">
                    {months[month]} {year}
                </span>
                <button
                    onClick={nextMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2 flex-shrink-0">
                {days.map((day) => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-1 mb-4 flex-shrink-0">
                {/* Empty cells for padding */}
                {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1

                    // Check if this specific day is selected
                    const isSelected =
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === month &&
                        selectedDate.getFullYear() === year

                    // Check if day has agenda (optional: add dot indicator)
                    const checkDate = new Date(year, month, day)
                    const checkKey = checkDate.toISOString().split('T')[0]
                    const hasAgenda = agendas[checkKey]?.length > 0

                    return (
                        <div key={day} className="flex flex-col justify-center items-center relative">
                            <button
                                onClick={() => handleDateClick(day)}
                                className={cn(
                                    "w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all relative",
                                    isSelected
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                {day}
                            </button>
                            {hasAgenda && !isSelected && (
                                <div className="w-1 h-1 bg-blue-400 rounded-full absolute bottom-0"></div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Agenda List Section */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-gray-100 pt-3">
                <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Agenda {formattedSelectedDate}
                </h3>

                <div className="min-h-[100px] mb-3 space-y-2 pr-1">
                    {currentAgendas.length > 0 ? (
                        currentAgendas.map((agenda) => (
                            <div key={agenda.id} className="flex items-center justify-between group bg-gray-50 p-2 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors">
                                <span className="text-sm text-gray-700 truncate mr-2" title={agenda.title}>
                                    {agenda.title}
                                </span>
                                <button
                                    onClick={() => handleDeleteAgenda(agenda.id)}
                                    disabled={deletingId === agenda.id}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                    title="Hapus agenda"
                                >
                                    {deletingId === agenda.id ? (
                                        <div className="w-3.5 h-3.5 border-2 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
                                    ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs italic py-4">
                            <p>Tidak ada agenda</p>
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                    <input
                        type="text"
                        placeholder="Tambah kegiatan..."
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddAgenda()
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleAddAgenda}
                        disabled={isSubmitting || !activityName.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[36px]"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Plus className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
