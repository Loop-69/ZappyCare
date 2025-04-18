import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SendGridTest = () => {
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendTestEmail = async () => {
    setLoading(true);
    setTestResult(null);
    
    // TODO: Implement actual API call to SendGrid
    console.log("Sending test email to:", toEmail, "with subject:", subject);

    // Simulate sending an email
    await new Promise(resolve => setTimeout(resolve, 1000));

    const simulatedResponse = {
      success: true,
      message: `Test email sent to ${toEmail} (simulated).`
    };

    setTestResult(JSON.stringify(simulatedResponse, null, 2));
    setLoading(false);
  };

  return (
    <PageLayout
      title="SendGrid Integration Test"
      description="Test and monitor the SendGrid email integration."
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">SendGrid Test Interface</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toEmail">To Email</Label>
            <Input id="toEmail" type="email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[100px]" />
          </div>
        </div>

        <Button onClick={handleSendTestEmail} disabled={loading || !toEmail || !subject || !body}>
          {loading ? 'Sending...' : 'Send Test Email'}
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

export default SendGridTest;
