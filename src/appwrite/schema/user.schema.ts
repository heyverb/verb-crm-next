import { z } from "zod";
import { UserRole, UserStatus } from "../interface/user.interface";
import { PASSWORD_REGEX } from "@/lib/stringUtils";

export const UserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.nativeEnum(UserRole),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),
  avatar: z.string().optional(),
  schoolId: z.string(),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
  accountId: z.string().optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const UserRegistrationSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.nativeEnum(UserRole),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be less than 50 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string(),
    schoolId: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserModel = z.infer<typeof UserSchema>;
export type UserLoginModel = z.infer<typeof UserLoginSchema>;
export type UserRegistrationModel = z.infer<typeof UserRegistrationSchema>;

export const UserDefaultValues: UserModel = {
  email: "",
  name: "",
  role: UserRole.STUDENT,
  phone: "",
  avatar: "",
  schoolId: "",
  status: UserStatus.ACTIVE,
  accountId: "",
};