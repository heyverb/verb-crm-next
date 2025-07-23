"use client";
import { GalleryVerticalEnd } from "lucide-react";
import { InputOTPForm } from "./ValidateOtp";
import { useState } from "react";
import Image from "next/image";
import { SetupUserProfile } from "./SetupUserProfile";
import { SetupSchoolProfile } from "./SetupSchoolProfile";

import { SchoolAdminModel, SchoolModel } from "@/appwrite/schema/school.schema";

export type OnboardingInterface = SchoolModel & SchoolAdminModel;

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [onboardingData, setOnboardingData] =
    useState<OnboardingInterface | null>(null);

  const onboardingStep = {
    0: <InputOTPForm setStep={setStep} />,
    1: <SetupUserProfile setStep={setStep} setOnboarding={setOnboardingData} />,
    2: (
      <SetupSchoolProfile
        setStep={setStep}
        setOnboarding={setOnboardingData}
        onboardingData={onboardingData}
      />
    ),
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">{onboardingStep[step]}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/image/bg.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={900}
          height={900}
        />
      </div>
    </div>
  );
}
