import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PracticeBetterTest = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateTestClient = async () => {
    setLoading(true);
    setTestResult(null);
    
    // TODO: Implement actual API call to Practice Better
    console.log("Creating test client in Practice Better:", { clientName, clientEmail });

    // Simulate creating a client
    await new Promise(resolve => setTimeout(resolve, 1000));

    const simulatedResponse = {
      success: true,
      clientId: 'PB-' + Math.random().toString(36).substr(2, 9),
      message: `Test client "${clientName}" created (simulated).`
    };

    setTestResult(JSON.stringify(simulatedResponse, null, 2));
    setLoading(false);
  };

  return (
    <PageLayout
      title="Practice Better Integration Test"
      description="Test and monitor the Practice Better CRM integration."
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Practice Better Test Interface</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Client Email</Label>
            <Input id="clientEmail" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
          </div>
        </div>

        <Button onClick={handleCreateTestClient} disabled={loading || !clientName || !clientEmail}>
          {loading ? 'Creating...' : 'Create Test Client'}
        </Button>

        {testResult && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Test Result:</h3>
            <Textarea readOnly value={testResult} className="min-h-[150px] font-mono text-sm" />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default PracticeBetterTest;
