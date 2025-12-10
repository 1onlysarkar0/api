"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import apiDocs from "@/data/api-documentation.json";
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
  Globe,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";

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

export default function Home() {
  const totalEndpoints = apiDocs.categories.reduce(
    (acc, cat) => acc + cat.endpoints.length,
    0
  );
  
  const publicEndpoints = apiDocs.categories.reduce(
    (acc, cat) =>
      acc +
      cat.endpoints.filter((e) => !e.authentication).length,
    0
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{apiDocs.apiInfo.title}</h1>
        </div>
        <Badge variant="outline">v{apiDocs.apiInfo.version}</Badge>
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3 sm:space-y-4 py-4 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight px-2">
              {apiDocs.apiInfo.title}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {apiDocs.apiInfo.description}
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Endpoints
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEndpoints}</div>
                <p className="text-xs text-muted-foreground">
                  Across {apiDocs.categories.length} categories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Public Endpoints
                </CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publicEndpoints}</div>
                <p className="text-xs text-muted-foreground">
                  No authentication required
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Protected Endpoints
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalEndpoints - publicEndpoints}
                </div>
                <p className="text-xs text-muted-foreground">
                  Admin authentication required
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">API Categories</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {apiDocs.categories.map((category) => {
                const IconComponent = iconMap[category.icon] || FileText;
                return (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {category.name}
                            {"requiresAuth" in category && category.requiresAuth && (
                              <Lock className="h-4 w-4 text-yellow-500" />
                            )}
                          </CardTitle>
                          <CardDescription>
                            {category.endpoints.length} endpoint
                            {category.endpoints.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.endpoints.slice(0, 3).map((endpoint) => (
                          <Link
                            key={endpoint.id}
                            href={`/endpoint/${endpoint.id}`}
                          >
                            <Badge
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                            >
                              <span
                                className={`mr-1 text-[10px] ${
                                  endpoint.method === "GET"
                                    ? "text-green-600 dark:text-green-400"
                                    : endpoint.method === "POST"
                                    ? "text-blue-600 dark:text-blue-400"
                                    : endpoint.method === "DELETE"
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-yellow-600 dark:text-yellow-400"
                                }`}
                              >
                                {endpoint.method}
                              </span>
                              {endpoint.name}
                            </Badge>
                          </Link>
                        ))}
                        {category.endpoints.length > 3 && (
                          <Badge variant="outline">
                            +{category.endpoints.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Learn how to use the FF 1ONLYSARKAR SHOP API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {apiDocs.apiInfo.baseUrl || "Configure in Settings"}
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Public endpoints do not require authentication. Admin endpoints
                  require a valid session cookie obtained through the login endpoint.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Rate Limiting</h3>
                <p className="text-sm text-muted-foreground">
                  Some endpoints have rate limiting. Premium users have higher
                  limits or bypass certain restrictions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        FF 1ONLYSARKAR SHOP API Documentation
      </footer>
    </div>
  );
}
