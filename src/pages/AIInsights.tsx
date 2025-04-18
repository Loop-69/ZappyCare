
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BrainCircuit, Zap, LineChart, Activity, AlertCircle, ChevronRight, MessageSquare, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState("overview");
  const [generatingInsight, setGeneratingInsight] = useState(false);
  
  // Mock query - this would be replaced with actual data fetching logic
  const { data: aiStats, isLoading: statsLoading } = useQuery({
    queryKey: ["ai-stats"],
    queryFn: async () => {
      // In a real implementation, this would fetch AI usage stats from Supabase
      return {
        totalProcessed: 1247,
        activeRequests: 3,
        averageResponseTime: 1.4,
        recentModels: [
          { name: "GPT-4o", usage: 78 },
          { name: "GPT-4o-mini", usage: 122 },
          { name: "Claude-3-Haiku", usage: 45 }
        ]
      };
    },
  });

  const generateNewInsight = () => {
    setGeneratingInsight(true);
    setTimeout(() => {
      setGeneratingInsight(false);
    }, 3000);
  };

  return (
    <PageLayout
      title="AI Insights & Overseer"
      description="Advanced AI system insights and management"
      isLoading={statsLoading}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total AI Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{aiStats?.totalProcessed || "—"}</div>
                <BrainCircuit className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across all AI systems and models
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active AI Processes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{aiStats?.activeRequests || "—"}</div>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Currently active AI processing jobs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{aiStats?.averageResponseTime || "—"}s</div>
                <Zap className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Response time across all models
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Health Insights</TabsTrigger>
            <TabsTrigger value="summaries">Auto Summaries</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostic AI</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI System Overview</CardTitle>
                <CardDescription>
                  Current status and activity of your AI systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recent Model Usage</h3>
                    {aiStats?.recentModels?.map((model, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BrainCircuit className="h-4 w-4 mr-2 text-primary" />
                          <span>{model.name}</span>
                        </div>
                        <Badge variant="outline">{model.usage} requests</Badge>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Health</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between p-2 rounded-md bg-green-50">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                          <span className="text-sm">API Connectivity</span>
                        </div>
                        <span className="text-green-600 text-sm">Operational</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 rounded-md bg-green-50">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                          <span className="text-sm">Model Availability</span>
                        </div>
                        <span className="text-green-600 text-sm">100%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 rounded-md bg-yellow-50">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                          <span className="text-sm">Rate Limits</span>
                        </div>
                        <span className="text-yellow-600 text-sm">75% Utilized</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Health Insights</CardTitle>
                  <CardDescription>
                    Latest generated patient insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <LineChart className="h-4 w-4 mt-1 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Blood Pressure Trending Analysis</p>
                        <p className="text-xs text-muted-foreground">Generated for John Smith</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <Activity className="h-4 w-4 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium text-sm">Medication Efficacy Summary</p>
                        <p className="text-xs text-muted-foreground">Generated for Emily Johnson</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Generate New Insight</CardTitle>
                  <CardDescription>
                    Request the AI to analyze patient data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Generate a new AI insight based on recent patient data. The system will analyze patterns and provide recommended actions.
                  </p>
                  <Button onClick={generateNewInsight} disabled={generatingInsight} className="w-full">
                    {generatingInsight ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Insight
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Generate New Insight
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Health Insights</CardTitle>
                <CardDescription>
                  AI-generated insights from patient health data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">AI Health Insights System</h3>
                    </div>
                    <p className="text-sm">
                      The Health Insights AI analyzes patient data to identify patterns, potential health risks, and opportunities for preventive care. Configure preferences and sensitivity in the settings tab.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">Patient Weight Trend Analysis</CardTitle>
                          <Badge>High Confidence</Badge>
                        </div>
                        <CardDescription>Generated April 15, 2025</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Analysis of 6-month weight data for patient #12479 shows consistent progress with the current weight management program. Weight loss has stabilized at 0.5 lbs/week, which is within healthy parameters.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4" />
                          <p>No intervention recommended at this time.</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">Medication Response Analysis</CardTitle>
                          <Badge variant="outline">Medium Confidence</Badge>
                        </div>
                        <CardDescription>Generated April 14, 2025</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Patient #38291 shows variable response to current medication regimen based on reported side effects and efficacy. Blood pressure readings show inconsistent control.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <AlertCircle className="h-4 w-4" />
                          <p>Recommend medication review at next appointment.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View All Health Insights
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summaries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Automated Summaries</CardTitle>
                <CardDescription>
                  AI-generated summaries of patient visits and consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium">Auto Summary System</h3>
                    </div>
                    <p className="text-sm">
                      The Automated Summary system uses AI to create concise, structured summaries of patient visits, consultations, and medical notes. Each summary is designed to highlight key information for quick review.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">Initial Consultation Summary</CardTitle>
                          <Badge variant="secondary">Auto-Generated</Badge>
                        </div>
                        <CardDescription>Patient #74291 • April 16, 2025</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium">Chief Complaint</h4>
                            <p className="text-sm text-muted-foreground">Weight management, difficulty losing weight despite diet changes</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Key Points</h4>
                            <ul className="list-disc text-sm text-muted-foreground pl-5 space-y-1">
                              <li>BMI 29.5, up from 28.2 (6 months ago)</li>
                              <li>Reports increased stress and decreased physical activity</li>
                              <li>No significant medical history affecting weight</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Plan</h4>
                            <p className="text-sm text-muted-foreground">Recommended lifestyle modifications, follow-up in 4 weeks, no medication prescribed.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">Follow-up Visit Summary</CardTitle>
                          <Badge variant="secondary">Auto-Generated</Badge>
                        </div>
                        <CardDescription>Patient #62178 • April 15, 2025</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium">Progress</h4>
                            <p className="text-sm text-muted-foreground">3-month follow-up for diabetes management. A1C improved from 7.8% to 6.9%.</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Medication Changes</h4>
                            <p className="text-sm text-muted-foreground">Continued current regimen, no changes needed based on improved lab results.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View All Automated Summaries
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Diagnostic AI Assistant (Beta)</CardTitle>
                  <CardDescription>
                    AI-powered diagnostic suggestions based on patient data
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Beta Feature
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <p className="text-sm font-medium text-yellow-800">
                        Diagnostic suggestions are for reference only and should be verified by qualified healthcare professionals.
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="p-4 border-b bg-slate-50">
                      <h3 className="font-medium">Diagnostic AI Query Tool</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter patient symptoms and relevant medical history to receive potential diagnostic suggestions.
                      </p>
                      <textarea 
                        className="w-full border rounded-md p-3 h-24 mb-4" 
                        placeholder="Describe patient symptoms, test results, and relevant medical history..."
                      />
                      <div className="flex justify-end">
                        <Button>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Generate Diagnostic Suggestions
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recent Diagnostic Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground text-center py-6">
                        No recent diagnostic suggestions available.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
