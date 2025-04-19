import { Metadata } from "next";
import ApplicationPage from "./ApplicationPage";
import { generateMetadata } from "@/lib/page.helper";

export const metadata: Metadata = generateMetadata(
  "Application",
  "Enquiries of admissions"
);

export default function Page() {
  return <ApplicationPage />;
}
