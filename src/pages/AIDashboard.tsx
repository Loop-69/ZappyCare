import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import PageLayout from "@/components/layout/PageLayout";

const AIDashboard = () => {
  return (
    <PageLayout
      title="AI Dashboard"
    description="Manage and test AI and API integrations."
    >
      <div className="space-y-6"> {/* Added a div for spacing */}
        <p>Select an integration or AI feature from the sidebar to test and manage it.</p>
        
        <Outlet /> {/* Add Outlet here to render nested routes */}
        
        {/* TODO: Add navigation to sub-pages within the dashboard content if needed */}
      </div>
    </PageLayout>
  );
};

export default AIDashboard;
