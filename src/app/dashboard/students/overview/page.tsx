import { Metadata } from "next";
import OverviewPage from "./OverviewPage";
import { generateMetadata } from "@/lib/page.helper";

export const metadata: Metadata = generateMetadata(
  "Admissions Overview",
  "Admissions overview page with statistics and charts."
);

export default function Page() {
  return <OverviewPage />;
}
