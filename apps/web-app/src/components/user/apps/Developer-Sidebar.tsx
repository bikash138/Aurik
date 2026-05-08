"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, AppWindow, Code2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Overview", href: "/developer", icon: LayoutDashboard },
  { label: "Applications", href: "/developer/apps", icon: AppWindow },
];

export function DeveloperSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="top-16 h-[calc(100svh-4rem)] bg-sidebar border-r border-sidebar-border"
    >
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2 px-1">
          <Code2 className="h-5 w-5 shrink-0 text-sidebar-foreground" />
          <span className="font-medium text-sm text-sidebar-foreground truncate group-data-[collapsible=icon]:hidden">
            Developer Console
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/developer"
                    ? pathname === "/developer"
                    : pathname.startsWith(href);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                      className="font-medium text-sidebar-foreground"
                    >
                      <Link
                        href={href}
                        className="[text-decoration:none] hover:[text-decoration:none]"
                      >
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
