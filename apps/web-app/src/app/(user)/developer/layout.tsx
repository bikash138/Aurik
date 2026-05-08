import { DeveloperSidebar } from "@/components/user/apps/Developer-Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DeveloperSidebar />
        <SidebarInset>
          <div className="flex items-center px-4 h-10 group-data-[state=expanded]/sidebar-wrapper:hidden">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
