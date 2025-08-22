"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader } from "@/components/custom/Loader";
import { toast } from "@/hooks/use-toast";
import { ControlledInput } from "@/components/custom/ControlledInput";
import { ControlledSelect } from "@/components/custom/ControlledSelect";
import { ControlledDatepicker } from "@/components/custom/ControlledDatepicker";
import { StudentSchema, StudentModel, StudentDefaultValues } from "@/appwrite/schema/student.schema";
import { Gender, BloodGroup } from "@/appwrite/interface/user.interface";
import { createStudent } from "@/appwrite/services/student.new.service";
import { getClasses } from "@/appwrite/services/class.service";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/appwrite/interface/user.interface";
import { useQuery } from "@tanstack/react-query";

interface ExtendedStudentModel extends StudentModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CreateStudentPage() {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExtendedStudentModel>({
    resolver: zodResolver(StudentSchema.extend({
      name: StudentSchema.shape.parentName,
      email: StudentSchema.shape.parentEmail.unwrap(),
      password: StudentSchema.shape.parentName.min(8, "Password must be at least 8 characters"),
      confirmPassword: StudentSchema.shape.parentName,
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })),
    defaultValues: {
      ...StudentDefaultValues,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['classes', user?.schoolId],
    queryFn: () => getClasses({ schoolId: user?.schoolId || "" }),
    enabled: !!user?.schoolId,
  });

  if (!hasRole([UserRole.ADMIN])) {
    router.push('/dashboard/unauthorized');
    return null;
  }

  const onSubmit = async (data: ExtendedStudentModel) => {
    try {
      setIsSubmitting(true);
      
      await createStudent({
        ...data,
        schoolId: user?.schoolId || "",
      });

      toast({
        title: "Success",
        description: "Student created successfully",
      });

      router.push('/dashboard/students/list');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create student",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (classesLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
          <CardDescription>
            Fill in the details to register a new student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ControlledInput
                  control={form.control}
                  name="name"
                  label="Student Name"
                  placeholder="Enter student name"
                />
                
                <ControlledInput
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="student@example.com"
                />
                
                <ControlledInput
                  control={form.control}
                  name="admissionNumber"
                  label="Admission Number"
                  placeholder="ADM2024001"
                />
                
                <ControlledInput
                  control={form.control}
                  name="rollNumber"
                  label="Roll Number"
                  placeholder="101"
                />
                
                <ControlledDatepicker
                  control={form.control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="Select date"
                />
                
                <ControlledSelect
                  control={form.control}
                  name="gender"
                  label="Gender"
                  placeholder="Select gender"
                  options={Object.values(Gender).map(g => ({ label: g, value: g }))}
                />
                
                <ControlledSelect
                  control={form.control}
                  name="bloodGroup"
                  label="Blood Group"
                  placeholder="Select blood group"
                  options={Object.values(BloodGroup).map(bg => ({ label: bg, value: bg }))}
                />
                
                <ControlledSelect
                  control={form.control}
                  name="currentClassId"
                  label="Class"
                  placeholder="Select class"
                  options={classes?.map(c => ({ 
                    label: `${c.name} ${c.section || ''}`, 
                    value: c.$id 
                  })) || []}
                />
                
                <ControlledInput
                  control={form.control}
                  name="parentName"
                  label="Parent/Guardian Name"
                  placeholder="Enter parent name"
                />
                
                <ControlledInput
                  control={form.control}
                  name="parentPhone"
                  label="Parent Phone"
                  placeholder="9876543210"
                />
                
                <ControlledInput
                  control={form.control}
                  name="parentEmail"
                  label="Parent Email"
                  type="email"
                  placeholder="parent@example.com"
                />
                
                <ControlledInput
                  control={form.control}
                  name="emergencyContact"
                  label="Emergency Contact"
                  placeholder="9876543210"
                />
                
                <ControlledInput
                  control={form.control}
                  name="aadharNumber"
                  label="Aadhar Number"
                  placeholder="123456789012"
                />
                
                <ControlledDatepicker
                  control={form.control}
                  name="admissionDate"
                  label="Admission Date"
                  placeholder="Select date"
                />
                
                <ControlledInput
                  control={form.control}
                  name="previousSchool"
                  label="Previous School"
                  placeholder="Enter previous school name"
                />
                
                <ControlledInput
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                />
                
                <ControlledInput
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                />
              </div>
              
              <div className="col-span-2">
                <ControlledInput
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="Enter complete address"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Student"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}