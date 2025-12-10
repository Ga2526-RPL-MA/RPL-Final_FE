"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchJson, postJson } from "@/lib/api"

export interface Agenda {
    id: string
    userId: string
    date: string
    title: string
    createdAt: string
}

interface AgendaContextType {
    selectedDate: Date
    setSelectedDate: (date: Date) => void
    agendas: Record<string, Agenda[]>
    loading: boolean
    addAgenda: (date: Date, title: string) => Promise<void>
    removeAgenda: (id: string, date: Date) => Promise<void>
    refreshAgendas: () => Promise<void>
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined)

export function AgendaProvider({ children }: { children: ReactNode }) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [agendas, setAgendas] = useState<Record<string, Agenda[]>>({})
    const [loading, setLoading] = useState(false)

    const getFormattedDate = (date: Date) => {
        return date.toISOString().split('T')[0]
    }

    const fetchAgendas = async () => {
        if (typeof document !== "undefined" && !document.cookie.includes("access_token")) {
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            const res = await fetchJson("/api/agendas")
            if (res.success && Array.isArray(res.data)) {
                const newAgendas: Record<string, Agenda[]> = {}
                res.data.forEach((item: Agenda) => {
                    const dateKey = item.date.split('T')[0]
                    if (!newAgendas[dateKey]) {
                        newAgendas[dateKey] = []
                    }
                    newAgendas[dateKey].push(item)
                })
                setAgendas(newAgendas)
            }
        } catch (error) {
            if (error instanceof Error && (error.message.includes("401") || error.message.includes("Unauthorized"))) {
                setAgendas({})
                return
            }
            console.error("Failed to fetch agendas:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAgendas()
    }, [])

    const refreshAgendas = async () => {
        await fetchAgendas()
    }

    const addAgenda = async (date: Date, title: string) => {
        const formattedDate = getFormattedDate(date)
        try {
            const res = await postJson("/api/agendas", {
                body: JSON.stringify({ date: formattedDate, title })
            })

            if (res && res.id) {
                setAgendas(prev => ({
                    ...prev,
                    [formattedDate]: [...(prev[formattedDate] || []), res]
                }))
            }
        } catch (error) {
            console.error("Failed to add agenda:", error)
            throw error
        }
    }

    const removeAgenda = async (id: string, date: Date) => {
        const formattedDate = getFormattedDate(date)
        try {
            await fetchJson(`/api/agendas/${id}`, { method: "DELETE" })

            setAgendas(prev => {
                const currentList = prev[formattedDate] || []
                return {
                    ...prev,
                    [formattedDate]: currentList.filter(item => item.id !== id)
                }
            })
        } catch (error) {
            console.error("Failed to delete agenda:", error)
            throw error
        }
    }

    return (
        <AgendaContext.Provider value={{ selectedDate, setSelectedDate, agendas, loading, addAgenda, removeAgenda, refreshAgendas }}>
            {children}
        </AgendaContext.Provider>
    )
}

export function useAgenda() {
    const context = useContext(AgendaContext)
    if (context === undefined) {
        throw new Error("useAgenda must be used within an AgendaProvider")
    }
    return context
}
