import { DashboardSegmentLoading } from "@/components/dashboard/DashboardSegmentLoading";

export default function Loading() {
  return (
    <DashboardSegmentLoading
      titleKey="dashboard.siteSettings.heading"
      pendingLabelKey="dashboard.siteSettings.missing"
    />
  );
}
