import { CreateAdmissionType } from "@/components/forms/admission-form";

export interface CreateAdmissionTypeWithModel extends CreateAdmissionType {
  $createdAt: string;
}
