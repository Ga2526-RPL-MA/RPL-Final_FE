import DetailTugasAkhir from "@/components/Elements/Layout/Mahasiswa/Detail Tugas Akhir/detailtugasakhir";

export default function DetailTugasAkhirPage({ params }: { params: { id: string } }) {
    return <DetailTugasAkhir params={params} />;
}
