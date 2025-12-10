"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Smile,
  User,
  Settings,
  BookOpen,
  CreditCard,
  Lock,
  LayoutDashboard,
  UserCheck,
  UserX,
  FileText,
  Database,
  Search,
  Moon,
  Sun,
  Globe,
  Palette,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiDocs from "@/data/api-documentation.json";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smile,
  User,
  Settings,
  BookOpen,
  CreditCard,
  Lock,
  LayoutDashboard,
  UserCheck,
  UserX,
  FileText,
  Database,
};

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return apiDocs.categories;
    
    const query = searchQuery.toLowerCase();
    return apiDocs.categories
      .map((category) => ({
        ...category,
        endpoints: category.endpoints.filter(
          (endpoint) =>
            endpoint.name.toLowerCase().includes(query) ||
            endpoint.path.toLowerCase().includes(query) ||
            endpoint.description.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.endpoints.length > 0);
  }, [searchQuery]);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            FF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">API Docs</span>
            <span className="text-xs text-muted-foreground">v{apiDocs.apiInfo.version}</span>
          </div>
        </div>
        <div className="mt-3 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search endpoints..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              Overview
            </button>
          </SidebarGroupLabel>
        </SidebarGroup>

        {filteredCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || FileText;
          return (
            <SidebarGroup key={category.id}>
              <SidebarGroupLabel className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {category.name}
                {"requiresAuth" in category && category.requiresAuth && (
                  <Lock className="h-3 w-3 text-yellow-500" />
                )}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {category.endpoints.map((endpoint) => (
                    <SidebarMenuItem key={endpoint.id}>
                      <SidebarMenuButton
                        onClick={() => router.push(`/endpoint/${endpoint.id}`)}
                        isActive={pathname === `/endpoint/${endpoint.id}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                            endpoint.method === "GET"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : endpoint.method === "POST"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : endpoint.method === "PUT"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              : endpoint.method === "DELETE"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <span className="truncate text-sm">{endpoint.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/settings")}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const themes = ["light", "dark", "solarized-light"];
                const currentIndex = themes.indexOf(theme || "light");
                const nextIndex = (currentIndex + 1) % themes.length;
                setTheme(themes[nextIndex]);
              }}
              title={`Current: ${theme}. Click to cycle themes.`}
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4" />
              ) : theme === "solarized-light" ? (
                <Palette className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
