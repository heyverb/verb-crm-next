import { Metadata } from "next";
import ApplicationPage from "./ApplicationPage";
import { generateMetadata } from "@/lib/page.helper";

export const metadata: Metadata = generateMetadata(
  "Application",
  "Admission applications"
);

export default function Page() {
  return <ApplicationPage />;
}
