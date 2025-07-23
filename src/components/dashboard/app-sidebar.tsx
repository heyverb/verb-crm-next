"use client";

import * as React from "react";

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
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logoutUser } from "@/appwrite/services/user.service";
import { logutUser } from "@/app/redux/action";
import useApi from "@/hooks/useApi";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { mutation, isLoading } = useApi(logoutUser);

  const { user: userData, school } = useAppSelector(
    (state) => state.globalReducer
  );

  console.log(school);

  const logout = async () => {
    try {
      await mutation.mutateAsync({});
      dispatch(logutUser());
      router.replace("/auth/login");
    } catch {}
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={school.documents} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={route.navMain} collapsibleItem={route.navModel} />
        <NavSecondary items={route.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={userData?.db?.documents[0] || null}
          loading={isLoading}
          logout={logout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
