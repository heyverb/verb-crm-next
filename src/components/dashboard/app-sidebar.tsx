"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { route } from "@/app/routes";
import { logoutUser, getCurrentUser } from "@/appwrite/services/user.service";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user } = useAuth();

  // For now, we'll use a single school until we implement multi-school support
  const schools = user ? [{ 
    $id: "1",
    school_name: "VERB School",
    city: "Mumbai",
    poster: "/school-logo.png"
  }] : [];

  const { data: userDetails } = useQuery({
    queryKey: ["user-details"],
    queryFn: getCurrentUser,
    enabled: !!user,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      router.replace("/auth/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={schools || []} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={route.navMain} collapsibleItem={route.navModel} />
        <NavSecondary items={route.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={userDetails as any}
          loading={logoutMutation.isPending}
          logout={handleLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
