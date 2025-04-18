
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIProcessorParams {
  action: "generate_health_insight" | "generate_summary" | "generate_diagnostic_suggestion";
  data: any;
}

export const useAIProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processAIRequest = async ({ action, data }: AIProcessorParams) => {
    setIsProcessing(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke("ai-processor", {
        body: { action, data }
      });
      
      if (error) throw error;
      
      return result;
    } catch (error: any) {
      toast.error(`AI processing error: ${error.message || "Unknown error"}`);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const mutation = useMutation({
    mutationFn: processAIRequest,
    onSuccess: (data) => {
      toast.success("AI processing completed successfully");
    }
  });

  return {
    processAIRequest: mutation.mutate,
    isProcessing: isProcessing || mutation.isPending,
    error: mutation.error,
    result: mutation.data
  };
};

export const useAIStats = () => {
  return useQuery({
    queryKey: ["ai-stats"],
    queryFn: async () => {
      // In a real implementation, this would fetch AI usage stats from Supabase
      // For now, we return mock data
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
};
