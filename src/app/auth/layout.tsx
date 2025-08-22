"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/appwrite/services/user.service";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // User is already logged in, redirect to dashboard
          router.push("/dashboard/overview");
        }
      } catch (error) {
        // User is not logged in, continue with auth flow
        console.log("User not authenticated");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}