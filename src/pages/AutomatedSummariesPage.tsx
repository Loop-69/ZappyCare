import React, { useState, useEffect } from 'react';
import PageLayout from "../components/layout/PageLayout";
import { Eye, Edit, Trash2 } from "lucide-react";

// Mock data for demonstration
const mockSummaries = [
  {
    id: 1,
    patient: "John Doe",
    summary: "Follow-up visit for diabetes management. Patient is stable.",
    createdAt: "2025-04-20",
    doctor: "Dr. Smith"
  },
  {
    id: 2,
    patient: "Jane Smith",
    summary: "Initial consultation. Complaints of fatigue and weight gain.",
    createdAt: "2025-04-18",
    doctor: "Dr. Adams"
  },
];

const AutomatedSummariesPage = () => {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    // Replace with Supabase fetch in production
    setSummaries(mockSummaries);
  }, []);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <PageLayout
      title="All Automated Summaries"
      description="View all generated automated summaries."
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">All Automated Summaries</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th>
                  <input
                    type="checkbox"
                    checked={selected.length === summaries.length && summaries.length > 0}
                    onChange={() =>
                      setSelected(
                        selected.length === summaries.length
                          ? []
                          : summaries.map((s) => s.id)
                      )
                    }
                  />
                </th>
                <th>PATIENT</th>
                <th>SUMMARY</th>
                <th>DATE</th>
                <th>DOCTOR</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {summaries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    No summaries found.
                  </td>
                </tr>
              ) : (
                summaries.map((summary) => (
                  <tr
                    key={summary.id}
                    className={`hover:bg-gray-100 cursor-pointer ${selected.includes(summary.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleSelect(summary.id)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(summary.id)}
                        onChange={() => toggleSelect(summary.id)}
                        onClick={e => e.stopPropagation()}
                      />
                    </td>
                    <td>{summary.patient}</td>
                    <td>{summary.summary}</td>
                    <td>{summary.createdAt}</td>
                    <td>{summary.doctor}</td>
                    <td className="flex gap-2">
                      <button title="View" className="hover:text-blue-600">
                        <Eye size={18} />
                      </button>
                      <button title="Edit" className="hover:text-green-600">
                        <Edit size={18} />
                      </button>
                      <button title="Delete" className="hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
};

export default AutomatedSummariesPage;
