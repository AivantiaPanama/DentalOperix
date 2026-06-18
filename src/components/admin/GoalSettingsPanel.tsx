"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GoalSettings } from "@/lib/goal-config";
import { validateGoalSettings } from "@/lib/goal-config";

type Props = {
  open: boolean;
  settings: GoalSettings;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: GoalSettings) => void;
};

type FormState = {
  monthlyLeadsGoal: string;
  conversionGoal: string;
  attendanceGoal: string;
  pipelineValueGoal: string;
};

type FormErrors = Partial<Record<keyof GoalSettings, string>>;

export const toFormState = (settings: GoalSettings): FormState => ({
  monthlyLeadsGoal: settings.monthlyLeadsGoal.toString(),
  conversionGoal: settings.conversionGoal.toString(),
  attendanceGoal: settings.attendanceGoal.toString(),
  pipelineValueGoal: settings.pipelineValueGoal.toString(),
});

export const toGoalSettings = (state: FormState): GoalSettings => ({
  monthlyLeadsGoal: Number(state.monthlyLeadsGoal),
  conversionGoal: Number(state.conversionGoal),
  attendanceGoal: Number(state.attendanceGoal),
  pipelineValueGoal: Number(state.pipelineValueGoal),
});

export function GoalSettingsPanel({ open, settings, onOpenChange, onSave }: Props) {
  const [form, setForm] = useState<FormState>(toFormState(settings));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(toFormState(settings));
    setErrors({});
  }, [settings, open]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSave = () => {
    const nextSettings = toGoalSettings(form);
    const validationErrors = validateGoalSettings(nextSettings);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(nextSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle>Configurar metas del negocio</DialogTitle>
          <DialogDescription>
            Actualiza los objetivos mensuales para ver el progreso y los riesgos en tiempo real.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="monthlyLeadsGoal">Meta mensual de leads</Label>
              <span className="text-sm text-muted-foreground">Cantidad</span>
            </div>
            <Input
              id="monthlyLeadsGoal"
              type="number"
              min={1}
              step={1}
              value={form.monthlyLeadsGoal}
              onChange={(event) => handleChange("monthlyLeadsGoal", event.target.value)}
              placeholder="50"
            />
            {errors.monthlyLeadsGoal ? (
              <p className="text-sm text-destructive">{errors.monthlyLeadsGoal}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="conversionGoal">Meta de conversión</Label>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <Input
              id="conversionGoal"
              type="number"
              min={1}
              step={1}
              value={form.conversionGoal}
              onChange={(event) => handleChange("conversionGoal", event.target.value)}
              placeholder="40"
            />
            {errors.conversionGoal ? (
              <p className="text-sm text-destructive">{errors.conversionGoal}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="attendanceGoal">Meta de asistencia</Label>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <Input
              id="attendanceGoal"
              type="number"
              min={1}
              step={1}
              value={form.attendanceGoal}
              onChange={(event) => handleChange("attendanceGoal", event.target.value)}
              placeholder="85"
            />
            {errors.attendanceGoal ? (
              <p className="text-sm text-destructive">{errors.attendanceGoal}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="pipelineValueGoal">Meta de valor potencial</Label>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>
            <Input
              id="pipelineValueGoal"
              type="number"
              min={1}
              step={100}
              value={form.pipelineValueGoal}
              onChange={(event) => handleChange("pipelineValueGoal", event.target.value)}
              placeholder="25000"
            />
            {errors.pipelineValueGoal ? (
              <p className="text-sm text-destructive">{errors.pipelineValueGoal}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)} type="button">
            Cancelar
          </Button>
          <Button onClick={handleSave} type="button">
            Guardar metas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
