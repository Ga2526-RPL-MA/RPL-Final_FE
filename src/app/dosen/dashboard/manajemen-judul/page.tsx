import { Suspense } from "react";
import FormPengajuanJudulPage from "@/components/Elements/Layout/Dosen/Form Pengajuan Judul/formpengajuanjudul";

export default function ManajemenJudul() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <FormPengajuanJudulPage />
        </Suspense>
    );
}

