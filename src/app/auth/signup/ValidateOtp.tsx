"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React from "react";
import { toast } from "sonner";
import ControlledOtpInput from "@/components/common/ControlledOtpInput";
import CommonInput from "@/components/common/CommonInput";
import { getErrorMessage } from "@/lib/error.helper";
import useApi from "@/hooks/useApi";
import axios from "axios";
import Loader from "@/components/common/Loader";
import Link from "next/link";

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
  setValidateOpt: React.Dispatch<React.SetStateAction<boolean>>;
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

const EmailBox = ({ onSubmit, loading }) => {
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
          <CommonInput
            control={form.control}
            name="email"
            label="Enter email"
            placeholder="abc@example.com"
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader />}
            Submit
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  );
};

const OtpBox = ({ onSubmit, loading }) => {
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
          label="Enter otp"
          control={form.control}
          name="pin"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export function InputOTPForm({ setValidateOpt }: Props) {
  const [showOtp, setShowOtp] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const { mutation: emailMutation, isLoading: isEmailLoading } =
    useApi(EmailApi);

  const { mutation: otpMutation, isLoading: isOtpLoading } = useApi(OtpApi);

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

  async function submitOtp(data: z.infer<typeof Otpchema>) {
    try {
      await otpMutation.mutateAsync({ ...data, email });
      toast.success("Otp verified successfully");
      setValidateOpt(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Validate you email</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      {showOtp ? (
        <OtpBox onSubmit={submitOtp} loading={isOtpLoading} />
      ) : (
        <EmailBox onSubmit={submitEmail} loading={isEmailLoading} />
      )}
    </div>
  );
}
