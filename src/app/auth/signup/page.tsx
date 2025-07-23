import { Metadata } from "next";
import SignupPage from "./SignupPage";
import { generateMetadata } from "@/lib/page.helper";

export const metadata: Metadata = generateMetadata(
  "Signup and Onboarding",
  "Create and setup school profile"
);

export default function Page() {
  return <SignupPage />;
}
