import React from 'react';
import PageLayout from "../components/layout/PageLayout";

const AutomatedSummariesPage = () => {
  return (
    <PageLayout
      title="All Automated Summaries"
      description="View all generated automated summaries."
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">All Automated Summaries</h2>
        <p>This page will display all automated summaries fetched from Supabase.</p>
        {/* TODO: Implement data fetching and display of summaries */}
      </div>
    </PageLayout>
  );
};

export default AutomatedSummariesPage;
