"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Play, Copy, Check, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import apiDocs from "@/data/api-documentation.json";
import { getApiSettings } from "@/lib/api-store";
import { useToast } from "@/hooks/use-toast";

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  location?: string;
  description: string;
}

interface RequestBodyField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface RequestBody {
  type: string;
  fields: RequestBodyField[];
  example: string;
}

interface Response {
  status: number;
  description: string;
  example: string;
}

interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  authentication: boolean;
  parameters: Parameter[];
  requestBody: RequestBody | null;
  responses: Response[];
}

export default function EndpointPage() {
  const params = useParams();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [response, setResponse] = React.useState<string>("");
  const [responseStatus, setResponseStatus] = React.useState<number | null>(null);
  const [requestBody, setRequestBody] = React.useState<string>("");
  const [queryParams, setQueryParams] = React.useState<Record<string, string>>({});
  const [baseUrl, setBaseUrl] = React.useState<string>("");

  React.useEffect(() => {
    const settings = getApiSettings();
    setBaseUrl(settings.baseUrl || "");
  }, []);

  const endpoint = React.useMemo(() => {
    for (const category of apiDocs.categories) {
      const found = category.endpoints.find((e) => e.id === params.id);
      if (found) return found as Endpoint;
    }
    return null;
  }, [params.id]);

  const category = React.useMemo(() => {
    for (const cat of apiDocs.categories) {
      if (cat.endpoints.find((e) => e.id === params.id)) {
        return cat;
      }
    }
    return null;
  }, [params.id]);

  React.useEffect(() => {
    if (endpoint?.requestBody?.example) {
      setRequestBody(endpoint.requestBody.example);
    }
  }, [endpoint]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendRequest = async () => {
    if (!baseUrl) {
      toast({
        title: "Base URL not configured",
        description: "Please configure the base URL in settings first.",
        variant: "destructive",
      });
      return;
    }

    if (!endpoint) return;

    setIsLoading(true);
    setResponse("");
    setResponseStatus(null);

    try {
      let targetUrl = baseUrl + endpoint.path;
      
      const queryParamsString = Object.entries(queryParams)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
      
      if (queryParamsString) {
        targetUrl += `?${queryParamsString}`;
      }

      if (endpoint.method !== "GET" && requestBody) {
        try {
          JSON.parse(requestBody);
        } catch {
          toast({
            title: "Invalid JSON",
            description: "Please enter valid JSON in the request body.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const proxyUrl = `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
      
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (endpoint.method !== "GET" && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(proxyUrl, options);
      const proxyResponse = await res.json();
      
      if (proxyResponse.error) {
        setResponse(`Error: ${proxyResponse.error}${proxyResponse.details ? `\n\n${proxyResponse.details}` : ''}`);
        setResponseStatus(proxyResponse.status || 0);
      } else {
        setResponseStatus(proxyResponse.status);
        if (typeof proxyResponse.data === 'string') {
          setResponse(proxyResponse.data);
        } else {
          setResponse(JSON.stringify(proxyResponse.data, null, 2));
        }
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : "Failed to send request"}`);
      setResponseStatus(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (!endpoint) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <span>Endpoint not found</span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Endpoint Not Found</CardTitle>
              <CardDescription>
                The requested endpoint could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 flex items-center gap-3">
          <Badge
            className={`${
              endpoint.method === "GET"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : endpoint.method === "POST"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : endpoint.method === "PUT"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : endpoint.method === "DELETE"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : ""
            }`}
          >
            {endpoint.method}
          </Badge>
          <h1 className="text-lg font-semibold">{endpoint.name}</h1>
          {endpoint.authentication && (
            <Lock className="h-4 w-4 text-yellow-500" />
          )}
        </div>
        {category && (
          <Badge variant="outline">{category.name}</Badge>
        )}
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <code className="text-lg font-mono bg-muted px-2 py-1 rounded">
                  {endpoint.path}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(endpoint.path)}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
              <CardDescription>{endpoint.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {endpoint.authentication && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Authentication Required
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="try" className="space-y-4">
            <TabsList>
              <TabsTrigger value="try">Try It</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
            </TabsList>

            <TabsContent value="try" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Playground</CardTitle>
                  <CardDescription>
                    Test this endpoint in real-time
                    {!baseUrl && (
                      <span className="text-yellow-600 dark:text-yellow-400 ml-2">
                        (Configure base URL in settings first)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Request URL
                    </label>
                    <div className="flex gap-2 items-center">
                      <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono overflow-x-auto">
                        {baseUrl || "https://your-domain.com"}{endpoint.path}
                      </code>
                    </div>
                  </div>

                  {endpoint.parameters.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Query Parameters
                      </label>
                      <div className="space-y-2">
                        {endpoint.parameters.map((param) => (
                          <div key={param.name} className="flex gap-2 items-center">
                            <label className="text-sm min-w-[100px] font-mono">
                              {param.name}
                              {param.required && <span className="text-red-500">*</span>}
                            </label>
                            <Input
                              placeholder={param.description}
                              value={queryParams[param.name] || ""}
                              onChange={(e) =>
                                setQueryParams((prev) => ({
                                  ...prev,
                                  [param.name]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {endpoint.requestBody && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Request Body (JSON)
                      </label>
                      <textarea
                        className="w-full h-40 font-mono text-sm p-3 bg-muted rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        placeholder="Enter JSON request body..."
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleSendRequest}
                    disabled={isLoading || !baseUrl}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Send Request
                      </>
                    )}
                  </Button>

                  {(response || responseStatus !== null) && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Response</label>
                        <div className="flex items-center gap-2">
                          {response && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(response)}
                            >
                              {copied ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          )}
                          {responseStatus !== null && (
                            <Badge
                              variant={responseStatus >= 200 && responseStatus < 300 ? "default" : "destructive"}
                            >
                              Status: {responseStatus}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                        <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                          {response || "No response"}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4">
              {endpoint.parameters.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Query Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {endpoint.parameters.map((param) => (
                        <div
                          key={param.name}
                          className="border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <code className="font-mono font-semibold">
                              {param.name}
                            </code>
                            <Badge variant="outline">{param.type}</Badge>
                            {param.required && (
                              <Badge variant="destructive">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {endpoint.requestBody && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request Body</CardTitle>
                    <CardDescription>
                      Content-Type: application/json
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {endpoint.requestBody.fields.map((field) => (
                        <div
                          key={field.name}
                          className="border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <code className="font-mono font-semibold">
                              {field.name}
                            </code>
                            <Badge variant="outline">{field.type}</Badge>
                            {field.required && (
                              <Badge variant="destructive">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {field.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Example
                      </label>
                      <pre className="bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                        {endpoint.requestBody.example}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {endpoint.parameters.length === 0 && !endpoint.requestBody && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    This endpoint has no parameters.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="responses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Response Codes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {endpoint.responses.map((res, index) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            res.status >= 200 && res.status < 300
                              ? "default"
                              : res.status >= 400 && res.status < 500
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {res.status}
                        </Badge>
                        <span className="font-medium">{res.description}</span>
                      </div>
                      <pre className="bg-muted p-3 rounded text-sm font-mono overflow-x-auto">
                        {res.example}
                      </pre>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
