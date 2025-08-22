import { Metadata } from "next";
import { generateMetadata } from "@/lib/page.helper";
import StudentListPage from "./StudentListPage";

export const metadata: Metadata = generateMetadata(
  "Students",
  "Manage all students"
);

export default function Page() {
  return <StudentListPage />;
}
