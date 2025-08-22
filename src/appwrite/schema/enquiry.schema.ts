import { z } from "zod";
import { Models } from "appwrite";
import {
  EnquiryGenderEnum,
  GuardianRelationEnum,
  EnquirySourceEnum,
  EnquiryStatusEnum,
  EnquiryPriorityEnum,
} from "../interface/enquiry.interface";

const EnquiryFollowUpSchema = z.object({
  date: z.string(),
  notes: z.string(),
  by: z.string(),
  next_action: z.string().optional(),
  created_at: z.string(),
});

export const EnquirySchema = z.object({
  student_fname: z.string().min(1, "Student first name is required"),
  student_lname: z.string().min(1, "Student last name is required"),
  student_dob: z.string().min(1, "Date of birth is required"),
  student_gender: z.nativeEnum(EnquiryGenderEnum),
  interested_class: z.string().min(1, "Interested class is required"),
  previous_school: z.string().optional(),
  guardian_name: z.string().min(1, "Guardian name is required"),
  guardian_relation: z.nativeEnum(GuardianRelationEnum),
  guardian_phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  guardian_email: z.string().email("Invalid email format"),
  guardian_occupation: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^[0-9]+$/, "Pincode must contain only numbers"),
  source: z.nativeEnum(EnquirySourceEnum),
  message: z.string().optional(),
  status: z.nativeEnum(EnquiryStatusEnum).default(EnquiryStatusEnum.New),
  priority: z.nativeEnum(EnquiryPriorityEnum).default(EnquiryPriorityEnum.Medium),
  follow_up_date: z.string().optional(),
  assigned_to: z.string().optional(),
  internal_notes: z.string().optional(),
  preferred_contact_time: z.string().optional(),
  school: z.string().optional(),
  follow_ups: z.array(EnquiryFollowUpSchema).optional(),
});

export type EnquiryModel = z.infer<typeof EnquirySchema> & Models.Document;

// Default values for form initialization
export const defaultEnquiryValues: Partial<z.infer<typeof EnquirySchema>> = {
  student_gender: EnquiryGenderEnum.Male,
  guardian_relation: GuardianRelationEnum.Father,
  source: EnquirySourceEnum.Website,
  status: EnquiryStatusEnum.New,
  priority: EnquiryPriorityEnum.Medium,
  follow_ups: [],
};