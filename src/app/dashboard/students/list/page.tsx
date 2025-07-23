import { Metadata } from "next";
import { generateMetadata } from "@/lib/page.helper";
import ListPage from "./ListPage";

export const metadata: Metadata = generateMetadata(
  "Application",
  "Admission applications"
);

export default function Page() {
  return <ListPage />;
}
