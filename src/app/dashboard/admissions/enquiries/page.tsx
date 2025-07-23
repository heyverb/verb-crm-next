import { Metadata } from "next";
import EnquiriesPage from "./EnquiriesPage";
import { generateMetadata } from "@/lib/page.helper";

export const metadata: Metadata = generateMetadata(
  "Enquiries",
  "Admission enquiries"
);

export default function Page() {
  return <EnquiriesPage />;
}
