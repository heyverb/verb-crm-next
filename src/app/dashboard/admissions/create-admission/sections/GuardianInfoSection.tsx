import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CreateAdmissionSchema } from "@/appwrite/schema/admission.schema";
import ControlledInput from "@/components/controlled/ControlledInput";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormData = z.infer<typeof CreateAdmissionSchema>;

interface GuardianInfoSectionProps {
  form: UseFormReturn<FormData>;
}

export function GuardianInfoSection({ form }: GuardianInfoSectionProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please provide the primary guardian's information. This person will be the main contact for all school communications.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 sm:grid-cols-2">
        <ControlledInput<FormData, "guardian_first_name">
          control={form.control}
          name="guardian_first_name"
          label="Guardian First Name"
          placeholder="Enter guardian's first name"
        />

        <ControlledInput<FormData, "guardian_last_name">
          control={form.control}
          name="guardian_last_name"
          label="Guardian Last Name"
          placeholder="Enter guardian's last name"
        />

        <ControlledInput<FormData, "guardian_phone">
          control={form.control}
          name="guardian_phone"
          label="Phone Number"
          placeholder="+91 98765 43210"
          type="tel"
        />

        <ControlledInput<FormData, "guardian_email">
          control={form.control}
          name="guardian_email"
          label="Email Address"
          placeholder="guardian@example.com"
          type="email"
        />

        <div className="sm:col-span-2">
          <ControlledInput<FormData, "guardian_occupation">
            control={form.control}
            name="guardian_occupation"
            label="Occupation (Optional)"
            placeholder="e.g., Software Engineer, Doctor, Business Owner"
          />
        </div>

        <div className="sm:col-span-2">
          <ControlledInput<FormData, "guardian_relation">
            control={form.control}
            name="guardian_relation"
            label="Relationship with Student"
            placeholder="e.g., Father, Mother, Legal Guardian"
          />
        </div>
      </div>
    </div>
  );
}