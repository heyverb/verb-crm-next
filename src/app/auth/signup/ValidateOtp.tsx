"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React from "react";
import { toast } from "sonner";
import ControlledOtpInput from "@/components/common/ControlledOtpInput";
import { getErrorMessage } from "@/lib/error.helper";
import useApi from "@/hooks/useApi";
import axios from "axios";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import ControlledInput from "@/components/controlled/ControlledInput";

const EmailSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .min(1, {
      message: "Email is required.",
    }),
});

const Otpchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const EmailApi = async (data: z.infer<typeof EmailSchema>) => {
  try {
    await axios.post("/api/send-email", {
      to: data.email,
    });
  } catch (e: any) {
    throw new Error(getErrorMessage(e));
  }
};

const OtpApi = async (data: z.infer<typeof Otpchema> & { email: string }) => {
  try {
    await axios.post("/api/verify-email", {
      otp: data.pin,
      email: data.email,
    });
  } catch (e: any) {
    throw new Error(getErrorMessage(e));
  }
};

const ResendOtpApi = async (
  data: z.infer<typeof Otpchema> & { email: string }
) => {
  try {
    await axios.post("/api/resend-otp", {
      otp: data.pin,
      email: data.email,
    });
  } catch (e: any) {
    throw new Error(getErrorMessage(e));
  }
};

const EmailBox = ({ onSubmit, loading, hidebtn }) => {
  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ControlledInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="abc@example.com"
            required
          />

          {!hidebtn && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader />}
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

const OtpBox = ({ onSubmit, loading, resend }) => {
  const form = useForm<z.infer<typeof Otpchema>>({
    resolver: zodResolver(Otpchema),
    defaultValues: {
      pin: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ControlledOtpInput
          label={
            <div className="flex items-center w-full">
              <Label className="gap-0.5">
                Enter otp <span className="text-red-500 font-bold">*</span>
              </Label>
              <Button
                disabled={loading}
                type="button"
                variant="link"
                color="blue"
                className="ml-auto text-sm flex items-center gap-1 hover:text-blue-500"
                onClick={(e) => {
                  e.preventDefault();
                  resend();
                }}
              >
                <RotateCw className={cn(loading && "animate-spin")} />
                Resend
              </Button>
            </div>
          }
          control={form.control}
          name="pin"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader />}
          Verify
        </Button>
      </form>
    </Form>
  );
};

export function InputOTPForm({ setStep }: Props) {
  const [showOtp, setShowOtp] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const { mutation: emailMutation, isLoading: isEmailLoading } =
    useApi(EmailApi);

  const { mutation: otpMutation, isLoading: isOtpLoading } = useApi(OtpApi);

  const { mutation: resendOtpMutation, isLoading: isResendOtpLoading } =
    useApi(ResendOtpApi);

  async function submitEmail(data: z.infer<typeof EmailSchema>) {
    setEmail(data.email);
    try {
      await emailMutation.mutateAsync(data);
      setShowOtp(true);
      toast.success(`Otp sent on ${data.email}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function resendOtp() {
    try {
      await resendOtpMutation.mutateAsync({ email });
      toast.success(`Otp resend on ${email}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function submitOtp(data: z.infer<typeof Otpchema>) {
    try {
      await otpMutation.mutateAsync({ ...data, email });
      toast.success("Email verified successfully");
      setStep((step) => step + 1);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Let’s Get Started!</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {showOtp
            ? "A 6-digit code is waiting in your inbox—drop it here to continue"
            : "    Enter your email address to receive a OTP."}
        </p>
      </div>

      <EmailBox
        onSubmit={submitEmail}
        loading={isEmailLoading}
        hidebtn={showOtp}
      />
      {showOtp && (
        <OtpBox
          onSubmit={submitOtp}
          loading={isOtpLoading || isResendOtpLoading}
          resend={resendOtp}
        />
      )}

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}
