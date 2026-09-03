import { DashboardSegmentLoading } from "@/components/dashboard/DashboardSegmentLoading";

// Listing-only. A loading.tsx beside [id] starts the response as 200, so
// notFound() on a missing row cannot set HTTP 404 (Next.js loading.js).

export default function Loading() {
  return (
    <DashboardSegmentLoading
      titleKey="dashboard.labUnits.heading"
      pendingLabelKey="dashboard.labUnits.pending"
    />
  );
}
