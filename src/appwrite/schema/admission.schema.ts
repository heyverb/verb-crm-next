import { z } from "zod";
import { Models } from "../config";
import {
  ReligionEnum as UserReligionEnum,
  CastEnum as UserCastEnum,
  GenderEnum as UserGenderEnum,
  BloodgroupEnum as UserBloodgroupEnum,
  AdmissionStatusEnum,
} from "../interface/admission.interface";

// You need to define these enums/types beforehand
const GenderEnum = z.nativeEnum(UserGenderEnum, {
  required_error: "Gender is required",
  invalid_type_error: "Invalid gender",
});

const CastEnum = z.nativeEnum(UserCastEnum, {
  required_error: "Cast is required",
  invalid_type_error: "Invalid cast",
});

const ReligionEnum = z.nativeEnum(UserReligionEnum, {
  required_error: "Religion is required",
  invalid_type_error: "Invalid religion",
});

const BloodGroupEnum = z.nativeEnum(UserBloodgroupEnum, {
  required_error: "Blood group is required",
  invalid_type_error: "Invalid blood group",
});

// Dummy Zod schemas (replace with actual structure)
const StudentDocumentSchema = z.object({
  name: z.string().min(2, "Required"),
  url: z.string().url(),
});
const GuardianDocumentSchema = z.object({
  name: z.string().min(2, "Required"),
  url: z.string().url(),
});

export const CreateAdmissionSchema = z.object({
  fname: z.string().min(2, "First name is required"),
  lname: z.string().min(2, "Last name is required"),
  dob: z.string().min(10, "Date of birth is required"),
  gender: GenderEnum,
  cast: CastEnum,
  religion: ReligionEnum,
  bloodgroup: BloodGroupEnum,
  preferred_class: z.string().min(1, "Preferred class is required"),
  guardian_first_name: z.string().min(2, "Guardian first name is required"),
  guardian_last_name: z.string().min(2, "Guardian last name is required"),
  guardian_phone: z.string().min(10, "Guardian phone number is required"),
  guardian_email: z.string().email(),
  guardian_occupation: z.string().optional(),
  guardian_relation: z.string().optional(),
  flat_no: z.string().optional(),
  address_line1: z.string().min(3, "Address line 1 is required"),
  address_line2: z.string().optional(),
  pincode: z.string().min(6, "Pincode is required"),
  state: z.string().min(2, "State is required"),
  status: z.string().default(AdmissionStatusEnum.PENDING).optional(),
  city: z.string().min(2, "City is required"),
  school: z.string().optional(),
  student_document: z
    .array(StudentDocumentSchema)
    .min(1, "At least one student document is required"),
  guardian_document: z
    .array(GuardianDocumentSchema)
    .min(1, "At least one guardian document is required"),
});

export interface CreateAdmissionType
  extends z.infer<typeof CreateAdmissionSchema> {
  id?: string;
  $id?: string;
}

export interface AdmissionModel
  extends Omit<CreateAdmissionType, keyof Models.Document>,
    Models.Document {}

export const CreateAdmissionDefaultValues: z.infer<
  typeof CreateAdmissionSchema
> = {
  fname: "",
  lname: "",
  dob: "",
  gender: "" as UserGenderEnum,
  cast: "" as UserCastEnum,
  religion: "" as UserReligionEnum,
  bloodgroup: "" as UserBloodgroupEnum,
  preferred_class: "",
  guardian_first_name: "",
  guardian_last_name: "",
  guardian_phone: "",
  guardian_email: "",
  guardian_occupation: "",
  guardian_relation: "",
  flat_no: "",
  address_line1: "",
  address_line2: "",
  pincode: "",
  state: "",
  status: AdmissionStatusEnum.PENDING as AdmissionStatusEnum,
  city: "",
  school: "",
  student_document: [{ name: "", url: "" }],
  guardian_document: [{ name: "", url: "" }],
};
