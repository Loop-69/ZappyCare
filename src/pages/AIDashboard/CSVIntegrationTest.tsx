import React, { useState, useRef } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const CSVIntegrationTest = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTestResult(null); // Clear previous result
    }
  };

  const handleProcessCSV = async () => {
    if (!selectedFile) {
      setTestResult("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setTestResult(null);
    
    // TODO: Implement actual CSV processing logic
    console.log("Processing CSV file:", selectedFile.name);

    // Simulate CSV processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const simulatedResult = {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      message: `Simulated processing of ${selectedFile.name} complete.`
    };

    setTestResult(JSON.stringify(simulatedResult, null, 2));
    setLoading(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <PageLayout
      title="CSV File Integration Test"
      description="Test integrating CSV files into the system."
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">CSV Integration Test Interface</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvFile">Upload CSV File</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="csvFile" 
                type="file" 
                accept=".csv" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button onClick={handleButtonClick} variant="outline">
                Select File
              </Button>
              <span>{selectedFile ? selectedFile.name : 'No file selected'}</span>
            </div>
          </div>
        </div>

        <Button onClick={handleProcessCSV} disabled={loading || !selectedFile}>
          {loading ? 'Processing...' : 'Process CSV'}
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

export default CSVIntegrationTest;
