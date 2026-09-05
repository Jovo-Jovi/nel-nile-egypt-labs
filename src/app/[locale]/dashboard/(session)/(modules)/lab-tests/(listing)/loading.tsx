import { DashboardSegmentLoading } from "@/components/dashboard/DashboardSegmentLoading";

export default function Loading() {
  return (
    <DashboardSegmentLoading
      titleKey="dashboard.labTests.heading"
      pendingLabelKey="dashboard.labTests.pending"
    />
  );
}
