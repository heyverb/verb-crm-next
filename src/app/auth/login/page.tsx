import { LoginForm } from "@/components/forms/login-form";
import { generateMetadata } from "@/lib/page.helper";
import { GalleryVerticalEnd } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = generateMetadata(
  "Login to your account",
  "login to your account"
);

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
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
