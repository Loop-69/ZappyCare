
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { ProgramGoal } from "@/components/programs/ProgramGoal";
import { WeeklyTasks } from "@/components/programs/WeeklyTasks";
import { WeightProgress } from "@/components/programs/WeightProgress";
import { ProgramResources } from "@/components/programs/ProgramResources";
import { ProgramCoach } from "@/components/programs/ProgramCoach";

const Programs = () => {
  return (
    <PageLayout 
      title="Weight Management Program - Phase 1" 
      description="Week 1 of 12 - Stay on track!"
    >
      <div className="space-y-6">
        <ProgramGoal />
        <WeeklyTasks />
        <WeightProgress />
        <ProgramResources />
        <ProgramCoach />
      </div>
    </PageLayout>
  );
};

export default Programs;
