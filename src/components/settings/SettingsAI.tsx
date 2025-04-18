
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AlertCircle, BrainCircuit, Check, Copy, Info, Key } from "lucide-react";

export function SettingsAI() {
  const [settings, setSettings] = useState({
    apiProvider: "openai",
    apiKey: "",
    apiKeyMasked: "••••••••••••••••••••••••••",
    apiKeyVisible: false,
    model: "gpt-4o",
    temperature: "0.7",
    maxTokens: "4000",
    enableHealthInsights: true,
    enableAutomatedSummaries: true,
    enableDiagnosisSuggestions: false
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const toggleApiKeyVisibility = () => {
    if (!settings.apiKeyVisible) {
      // This would normally be replaced with an API call to fetch the unmasked key
      setSettings(prev => ({
        ...prev,
        apiKeyVisible: true,
        apiKey: "sk-1234567890abcdefghijklmn"
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        apiKeyVisible: false,
        apiKey: ""
      }));
    }
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("AI settings saved successfully");
    }, 1000);
  };
  
  const providers = [
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "local", label: "Local Model" },
    { value: "custom", label: "Custom API" }
  ];
  
  const models = {
    openai: [
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini" },
      { value: "gpt-4.5-preview", label: "GPT-4.5 Preview" }
    ],
    anthropic: [
      { value: "claude-3-haiku", label: "Claude 3 Haiku" },
      { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
      { value: "claude-3-opus", label: "Claude 3 Opus" }
    ],
    local: [
      { value: "llama-3", label: "Llama 3" },
      { value: "mistral-7b", label: "Mistral 7B" }
    ],
    custom: [
      { value: "custom-api", label: "Custom API Endpoint" }
    ]
  };
  
  const getModelOptions = () => {
    return models[settings.apiProvider as keyof typeof models] || [];
  };
  
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">AI Configuration</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Configure the AI system that powers automated features in Zappy Health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="apiProvider">AI Provider</Label>
          <Select 
            value={settings.apiProvider} 
            onValueChange={(value) => handleChange("apiProvider", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map(provider => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">AI Model</Label>
          <Select 
            value={settings.model} 
            onValueChange={(value) => handleChange("model", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              {getModelOptions().map(model => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey" className="flex items-center gap-2">
          API Key <Key className="h-4 w-4" />
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="apiKey"
              type={settings.apiKeyVisible ? "text" : "password"}
              value={settings.apiKeyVisible ? settings.apiKey : settings.apiKeyMasked}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              placeholder="Enter your API key"
              className={settings.apiKeyVisible ? "" : "text-lg tracking-widest"}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              onClick={toggleApiKeyVisibility}
            >
              {settings.apiKeyVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          <Button variant="outline" size="icon" onClick={() => {
            navigator.clipboard.writeText(settings.apiKey);
            toast.success("API key copied to clipboard");
          }}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Info className="h-4 w-4" />
          Your API key is encrypted and securely stored
        </p>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">Model Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleChange("temperature", e.target.value)}
                className="flex-1"
              />
              <span className="w-12 text-center">{settings.temperature}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Lower values produce more consistent responses, higher values more creative ones.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              value={settings.maxTokens}
              onChange={(e) => handleChange("maxTokens", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Maximum length of the AI response (1 token ≈ 4 characters).
            </p>
          </div>
        </div>
      </div>

      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-4">AI Features</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="healthInsights" className="text-base">Health Insights</Label>
              <p className="text-sm text-muted-foreground">
                AI-powered insights based on patient data
              </p>
            </div>
            <Switch
              id="healthInsights"
              checked={settings.enableHealthInsights}
              onCheckedChange={(value) => handleChange("enableHealthInsights", value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="automatedSummaries" className="text-base">Automated Summaries</Label>
              <p className="text-sm text-muted-foreground">
                Automatically generate summaries for patient visits
              </p>
            </div>
            <Switch
              id="automatedSummaries"
              checked={settings.enableAutomatedSummaries}
              onCheckedChange={(value) => handleChange("enableAutomatedSummaries", value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="diagnosisSuggestions" className="text-base">Diagnosis Suggestions</Label>
              <div className="flex items-center gap-1">
                <p className="text-sm text-muted-foreground">
                  AI-powered diagnostic suggestions
                </p>
                <span className="bg-yellow-100 text-yellow-800 text-xs py-0.5 px-2 rounded-full flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Beta
                </span>
              </div>
            </div>
            <Switch
              id="diagnosisSuggestions"
              checked={settings.enableDiagnosisSuggestions}
              onCheckedChange={(value) => handleChange("enableDiagnosisSuggestions", value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <span className="h-4 w-4 animate-spin">◌</span>
          ) : (
            <Check className="h-4 w-4" />
          )}
          Save AI Settings
        </Button>
      </div>
    </div>
  );
}
