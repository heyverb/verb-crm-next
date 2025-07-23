"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import useApi from "@/hooks/useApi";
import { signin } from "@/appwrite/services/user.service";
import { toast } from "sonner";
import Loader from "../common/Loader";
import { useRouter } from "next/navigation";
import ControlledPassworInput from "../common/ControlledPassworInput";
import ControlledInput from "../controlled/ControlledInput";
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, "password is required"),
});

type LoginType = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const route = useRouter();
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const { mutation, isLoading } = useApi(signin);

  const handleSubmit = async (data) => {
    try {
      await mutation.mutateAsync(data);
      toast.success("logged successfully");
      route.replace("/");
    } catch {
      toast.error("invalid creadentials");
    }
  };
  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6")}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <ControlledInput<LoginType, "email">
            control={form.control}
            name="email"
            label="Email"
            placeholder="eg. abc@verb.com"
            required
          />
          <ControlledPassworInput<LoginType, "password">
            control={form.control}
            name="password"
            label="Password"
            placeholder="*** *** ***"
            required
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader />}
            Login
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
