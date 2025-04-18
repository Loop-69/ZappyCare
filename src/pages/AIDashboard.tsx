import React from 'react';
import PageLayout from "@/components/layout/PageLayout";

const AIDashboard = () => {
  return (
    <PageLayout
      title="AI Dashboard"
      description="Manage and test AI and API integrations."
    >
      <div>
        <h2 className="text-2xl font-bold mb-4">Welcome to the AI Dashboard</h2>
        <p>Select an integration or AI feature from the sidebar to test and manage it.</p>
        {/* TODO: Add navigation to sub-pages */}
      </div>
    </PageLayout>
  );
};

export default AIDashboard;
