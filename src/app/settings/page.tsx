"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Check, Globe, Moon, Sun, Monitor, Palette } from "lucide-react";
import Link from "next/link";
import { getApiSettings, setApiSettings } from "@/lib/api-store";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [baseUrl, setBaseUrl] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const settings = getApiSettings();
    setBaseUrl(settings.baseUrl || "");
  }, []);

  const handleSave = () => {
    let url = baseUrl.trim();
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
    
    setApiSettings({ baseUrl: url });
    setBaseUrl(url);
    setSaved(true);
    
    toast({
      title: "Settings saved",
      description: "Your API base URL has been updated.",
    });
    
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domain Connector
              </CardTitle>
              <CardDescription>
                Configure the base URL for API requests. All API endpoints will use this domain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Base API URL
                </label>
                <Input
                  placeholder="https://your-domain.com"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter your API domain without trailing slash. Example: https://api.example.com
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <code className="text-sm font-mono">
                  {baseUrl || "https://your-domain.com"}/api/emotes
                </code>
              </div>

              <Button onClick={handleSave} className="w-full">
                {saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {mounted && theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the documentation looks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                  variant={mounted && theme === "light" ? "default" : "outline"}
                  className="flex flex-col h-auto py-4 min-h-[80px]"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-5 w-5 sm:h-6 sm:w-6 mb-2" />
                  <span className="text-xs sm:text-sm">Light</span>
                </Button>
                <Button
                  variant={mounted && theme === "dark" ? "default" : "outline"}
                  className="flex flex-col h-auto py-4 min-h-[80px]"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-5 w-5 sm:h-6 sm:w-6 mb-2" />
                  <span className="text-xs sm:text-sm">Dark</span>
                </Button>
                <Button
                  variant={mounted && theme === "solarized-light" ? "default" : "outline"}
                  className="flex flex-col h-auto py-4 min-h-[80px]"
                  onClick={() => setTheme("solarized-light")}
                >
                  <Palette className="h-5 w-5 sm:h-6 sm:w-6 mb-2" />
                  <span className="text-xs sm:text-sm">Solarized</span>
                </Button>
                <Button
                  variant={mounted && theme === "system" ? "default" : "outline"}
                  className="flex flex-col h-auto py-4 min-h-[80px]"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-5 w-5 sm:h-6 sm:w-6 mb-2" />
                  <span className="text-xs sm:text-sm">System</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                API Documentation for FF 1ONLYSARKAR SHOP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Version: 1.0.0</p>
              <p>
                This documentation provides complete reference for all API endpoints
                with real-time testing capabilities.
              </p>
              <p>
                Configure your domain above to start testing API endpoints directly
                from the documentation.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
