import { z } from "zod";
import { AdmissionStatusEnum } from "../interface/admission.interface";
import { PASSWORD_REGEX } from "@/lib/stringUtils";

export const SchoolSchema = z.object({
  school_name: z.string().min(2, "school name is required"),
  pincode: z
    .string()
    .min(6, "pincode must be at least 6 digits")
    .max(6, "pincode can't exceed 6 digits")
    .regex(/^[0-9]+$/, "phone number must contain only digits"),
  state: z.string().min(2, "State is required"),
  status: z.string().default(AdmissionStatusEnum.PENDING).optional(),
  city: z.string().min(2, "City is required"),
  poster: z.string().optional(),
});

export const SchoolAdminSchema = z
  .object({
    fname: z.string().min(2, "first name is required"),
    lname: z.string().min(2, "last name is required"),
    email: z.string().email("please enter a valid email"),
    role: z.string().min(2, "role is required"),
    avatar: z.string().optional(),
    accountId: z.string().optional(),
    password: z
      .string()
      .min(6, "password must be at least 8 characters long")
      .max(50, "password must be less than 50 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export type SchoolModel = z.infer<typeof SchoolSchema>;
export type SchoolAdminModel = z.infer<typeof SchoolAdminSchema>;

export const SchoolDefaultValues: SchoolModel = {
  school_name: "",
  pincode: "",
  state: "",
  status: AdmissionStatusEnum.PENDING as AdmissionStatusEnum,
  city: "",
  poster: "",
};

export const SchoolAdminDefaultValues: SchoolAdminModel = {
  fname: "",
  lname: "",
  email: "",
  role: "",
  password: "",
  confirmpassword: "",
  avatar: "",
  accountId: "",
};
