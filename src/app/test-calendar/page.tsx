import { SidebarCalendar } from "@/components/Elements/Calendar/SidebarCalendar"

export default function TestCalendarPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10">
            <div className="w-[300px]">
                <SidebarCalendar />
            </div>
        </div>
    )
}
