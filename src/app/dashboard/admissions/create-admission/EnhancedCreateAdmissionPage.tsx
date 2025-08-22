"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  User,
  Users,
  Home,
  FileText,
  Eye,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreateAdmissionSchema,
  CreateAdmissionDefaultValues,
} from "@/appwrite/schema/admission.schema";
import { CreateAdmission } from "@/appwrite/services/admission.service";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";

// Import form sections
import { StudentInfoSection } from "./sections/StudentInfoSection";
import { GuardianInfoSection } from "./sections/GuardianInfoSection";
import { AddressSection } from "./sections/AddressSection";
import { DocumentsSection } from "./sections/DocumentsSection";
import { ReviewSection } from "./sections/ReviewSection";

type FormData = z.infer<typeof CreateAdmissionSchema>;

const steps = [
  {
    id: "student",
    title: "Student Information",
    description: "Basic details about the student",
    icon: User,
    fields: [
      "fname",
      "lname",
      "dob",
      "gender",
      "cast",
      "religion",
      "bloodgroup",
    ],
  },
  {
    id: "guardian",
    title: "Guardian Information",
    description: "Parent or guardian details",
    icon: Users,
    fields: [
      "guardian_first_name",
      "guardian_last_name",
      "guardian_phone",
      "guardian_email",
    ],
  },
  {
    id: "address",
    title: "Address",
    description: "Residential address information",
    icon: Home,
    fields: [
      "flat_no",
      "address_line1",
      "address_line2",
      "pincode",
      "state",
      "city",
    ],
  },
  {
    id: "documents",
    title: "Documents",
    description: "Upload required documents",
    icon: FileText,
    fields: ["guardian_document", "student_document"],
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Review all information before submission",
    icon: Eye,
    fields: [],
  },
];

export default function EnhancedCreateAdmissionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMode, setSaveMode] = useState<"draft" | "submit">("submit");

  const form = useForm<FormData>({
    resolver: zodResolver(CreateAdmissionSchema),
    defaultValues: {
      ...CreateAdmissionDefaultValues,
      school: user?.schoolId,
    },
    mode: "onChange",
  });

  const {
    formState: { errors, isValid, dirtyFields },
    trigger,
  } = form;

  // Calculate progress
  const totalFields = Object.keys(CreateAdmissionSchema.shape).length;
  const completedFields = Object.keys(dirtyFields).length;
  const progress = (completedFields / totalFields) * 100;

  // Check if current step is valid
  const validateStep = async () => {
    const currentStepFields = steps[currentStep].fields;
    if (currentStepFields.length === 0) return true;

    const result = await trigger(currentStepFields as any);
    return result;
  };

  const handleNext = async () => {
    const isStepValid = await validateStep();
    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index);
    } else if (index === currentStep + 1) {
      const isStepValid = await validateStep();
      if (isStepValid) {
        setCurrentStep(index);
      }
    }
  };

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      const formattedValues = {
        ...values,
        student_document: values.student_document.map((item) =>
          JSON.stringify(item)
        ),
        guardian_document: values.guardian_document.map((item) =>
          JSON.stringify(item)
        ),
      };

      await CreateAdmission(formattedValues as any);

      toast.success(
        saveMode === "draft"
          ? "Application saved as draft"
          : "Admission application submitted successfully"
      );

      router.push("/dashboard/admissions/applications");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create Admission
          </h2>
          <p className="text-muted-foreground">
            Complete the admission application form
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/admissions/applications")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= currentStep + 1;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              disabled={!isClickable}
              className={cn(
                "flex flex-1 flex-col items-center gap-2 p-4 text-center transition-all",
                isClickable && "cursor-pointer hover:bg-muted/50",
                !isClickable && "cursor-not-allowed opacity-50"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  isActive &&
                    "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  !isActive && !isCompleted && "border-muted-foreground/30"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{currentStepData.title}</CardTitle>
                  <CardDescription>
                    {currentStepData.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Error Alert */}
              {Object.keys(errors).length > 0 &&
                currentStep < steps.length - 1 && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please fix the errors before proceeding to the next step.
                    </AlertDescription>
                  </Alert>
                )}

              {/* Step Content */}
              <div className="min-h-[400px]">
                {currentStep === 0 && <StudentInfoSection form={form} />}
                {currentStep === 1 && <GuardianInfoSection form={form} />}
                {currentStep === 2 && <AddressSection form={form} />}
                {currentStep === 3 && <DocumentsSection form={form} />}
                {currentStep === 4 && <ReviewSection form={form} />}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {currentStep === steps.length - 1 ? (
                  <>
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isSubmitting || !isValid}
                      onClick={() => setSaveMode("draft")}
                    >
                      {isSubmitting && saveMode === "draft" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save as Draft
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      onClick={() => setSaveMode("submit")}
                    >
                      {isSubmitting && saveMode === "submit" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Submit Application
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep === steps.length - 1}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
