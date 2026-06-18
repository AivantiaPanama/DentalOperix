import { GoalCard } from "@/components/admin/GoalCard";
import type { GoalProgress } from "@/lib/goal-engine";

type Props = {
  leads: GoalProgress;
  conversion: GoalProgress;
  attendance: GoalProgress;
  pipelineValue: GoalProgress;
};

export function GoalsOverview({ leads, conversion, attendance, pipelineValue }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      <GoalCard label="Leads" progress={leads} />
      <GoalCard label="Conversión" progress={conversion} />
      <GoalCard label="Asistencia" progress={attendance} />
      <GoalCard label="Valor potencial" progress={pipelineValue} />
    </div>
  );
}
