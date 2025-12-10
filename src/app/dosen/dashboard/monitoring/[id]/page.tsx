import { Suspense } from "react";
import DetailProgresPage from "@/components/Elements/Layout/Dosen/Monitoring/DetailProgres/detailprogres";

export default function MonitoringDetailPage() {
  return (
    <Suspense>
      <DetailProgresPage />
    </Suspense>
  );
}

