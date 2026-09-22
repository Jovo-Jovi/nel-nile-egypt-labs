import { DashboardSegmentLoading } from "@/components/dashboard/DashboardSegmentLoading";

export default function Loading() {
  return (
    <DashboardSegmentLoading
      titleKey="dashboard.programmes.heading"
      pendingLabelKey="dashboard.programmes.pending"
    />
  );
}
