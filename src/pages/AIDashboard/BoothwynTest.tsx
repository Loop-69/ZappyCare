import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BoothwynTest = () => {
  const [patientId, setPatientId] = useState('');
  const [medication, setMedication] = useState('');
  const [quantity, setQuantity] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendTestOrder = async () => {
    setLoading(true);
    setTestResult(null);
    // TODO: Implement actual API call to Boothwyn
    console.log("Sending test order to Boothwyn with:", { patientId, medication, quantity });

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const simulatedResponse = {
      success: true,
      orderId: 'BOOTHWYN-' + Math.random().toString(36).substr(2, 9),
      message: 'Test order sent successfully (simulated).'
    };

    setTestResult(JSON.stringify(simulatedResponse, null, 2));
    setLoading(false);
  };

  return (
    <PageLayout
      title="Boothwyn Integration Test"
      description="Test and monitor the Boothwyn pharmacy integration."
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Boothwyn Test Interface</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input id="patientId" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <Input id="medication" value={medication} onChange={(e) => setMedication(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
        </div>

        <Button onClick={handleSendTestOrder} disabled={loading}>
          {loading ? 'Sending...' : 'Send Test Order'}
        </Button>

        {testResult && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Test Result:</h3>
            <Textarea readOnly value={testResult} className="min-h-[150px] font-mono text-sm" />
          </div>
        )}

        {/* TODO: Add section for monitoring incoming webhooks */}
      </div>
    </PageLayout>
  );
};

export default BoothwynTest;
