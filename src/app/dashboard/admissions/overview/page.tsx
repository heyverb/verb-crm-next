import { Metadata } from "next";
import EnhancedOverviewPage from "./EnhancedOverviewPage";
import { generateMetadata } from "@/lib/page.helper";

export const metadata: Metadata = generateMetadata(
  "Admissions Overview",
  "Comprehensive admissions dashboard with statistics, charts, and analytics."
);

export default function Page() {
  return <EnhancedOverviewPage />;
}
