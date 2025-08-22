import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CreateAdmissionSchema } from "@/appwrite/schema/admission.schema";
import ControlledInput from "@/components/controlled/ControlledInput";
import ControlledSelect from "@/components/common/ControlledSelect";
import CommonDatepicker from "@/components/common/CommonDatepicker";
import { enumToArray } from "@/lib/utils";
import {
  BloodgroupEnum,
  CastEnum,
  GenderEnum,
  ReligionEnum,
} from "@/appwrite/interface/admission.interface";

type FormData = z.infer<typeof CreateAdmissionSchema>;

interface StudentInfoSectionProps {
  form: UseFormReturn<FormData>;
}

export function StudentInfoSection({ form }: StudentInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <ControlledInput<FormData, "fname">
          control={form.control}
          name="fname"
          label="First Name"
          placeholder="Enter student's first name"
        />

        <ControlledInput<FormData, "lname">
          control={form.control}
          name="lname"
          label="Last Name"
          placeholder="Enter student's last name"
        />

        <CommonDatepicker<FormData, "dob">
          control={form.control}
          name="dob"
          label="Date of Birth"
          placeholder="Select date of birth"
        />

        <ControlledSelect<FormData, "gender">
          control={form.control}
          name="gender"
          label="Gender"
          placeholder="Select gender"
          options={enumToArray(GenderEnum)}
        />

        <ControlledSelect<FormData, "cast">
          control={form.control}
          name="cast"
          label="Caste"
          placeholder="Select caste"
          options={enumToArray(CastEnum)}
        />

        <ControlledSelect<FormData, "religion">
          control={form.control}
          name="religion"
          label="Religion"
          placeholder="Select religion"
          options={enumToArray(ReligionEnum)}
        />

        <ControlledSelect<FormData, "bloodgroup">
          control={form.control}
          name="bloodgroup"
          label="Blood Group"
          placeholder="Select blood group"
          options={enumToArray(BloodgroupEnum)}
        />

        <ControlledInput<FormData, "preferred_class">
          control={form.control}
          name="preferred_class"
          label="Preferred Class"
          placeholder="e.g., Class 5"
        />
      </div>
    </div>
  );
}