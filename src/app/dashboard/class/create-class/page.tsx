import { AdmissionForm } from "@/components/forms/admission-form";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6">
      <AdmissionForm />
    </div>
  );
}
