"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/appwrite/services/user.service";
import { UserInterface } from "@/appwrite/services/user.service";
import { UserRole } from "@/appwrite/interface/user.interface";
import Loader from "@/components/common/Loader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Define protected routes and their required roles
const protectedRoutes: Record<string, UserRole[]> = {
  "/dashboard/admissions": [UserRole.ADMIN],
  "/dashboard/students": [UserRole.ADMIN, UserRole.TEACHER],
  "/dashboard/teachers": [UserRole.ADMIN],
  "/dashboard/class": [UserRole.ADMIN, UserRole.TEACHER],
  "/dashboard/subjects": [UserRole.ADMIN, UserRole.TEACHER],
  "/dashboard/exams": [UserRole.ADMIN, UserRole.TEACHER],
  "/dashboard/fees": [UserRole.ADMIN],
  "/dashboard/reports": [UserRole.ADMIN, UserRole.TEACHER],
  "/dashboard/settings": [UserRole.ADMIN],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
          // No user found, redirect to login
          router.push(`/auth/login?redirectTo=${encodeURIComponent(pathname)}`);
          return;
        }

        setUser(currentUser);

        // Check if user has access to current route
        const routeKey = Object.keys(protectedRoutes).find((route) =>
          pathname.startsWith(route)
        );

        if (
          routeKey &&
          !protectedRoutes[routeKey].includes(currentUser.role as UserRole)
        ) {
          router.push("/dashboard/unauthorized");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Generate breadcrumb items based on pathname
  const getBreadcrumbItems = () => {
    const segments = pathname.split("/").filter(Boolean);
    const items: { label: string; href?: string }[] = [];

    segments.forEach((segment, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/");
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      if (index === segments.length - 1) {
        items.push({ label });
      } else {
        items.push({ label, href: path });
      }
    });

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href}>
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
