import { describe, expect, it } from "vitest";
import type { BusinessGoals } from "./goal-engine";
import { DEFAULT_GOAL_CONFIGURATION } from "./goal-config";
import {
  calculateGoalProgress,
  calculateMonthlyProjection,
  calculateGoalRisk,
  generateGoalInsights,
} from "./goal-engine";

describe("goal engine", () => {
  it("calculates progress percentages correctly", () => {
    expect(calculateGoalProgress(50, 50).progressPercent).toBeCloseTo(100);
    expect(calculateGoalProgress(45, 50).progressPercent).toBeCloseTo(90);
    expect(calculateGoalProgress(35, 50).progressPercent).toBeCloseTo(70);
    expect(calculateGoalProgress(34, 50).progressPercent).toBeCloseTo(68);
  });

  it("calculates monthly projection from start, middle and end of month", () => {
    const start = calculateMonthlyProjection(0, 0, 0, 1, 30);
    expect(start.projectedLeads).toBe(0);
    expect(start.projectedAppointments).toBe(0);
    expect(start.projectedPipelineValue).toBe(0);

    const middle = calculateMonthlyProjection(15, 7, 10000, 15, 30);
    expect(middle.projectedLeads).toBe(30);
    expect(middle.projectedAppointments).toBe(14);
    expect(middle.projectedPipelineValue).toBe(20000);

    const end = calculateMonthlyProjection(30, 14, 20000, 30, 30);
    expect(end.projectedLeads).toBe(30);
    expect(end.projectedAppointments).toBe(14);
    expect(end.projectedPipelineValue).toBe(20000);
  });

  it("detects goal risk correctly", () => {
    const goals: BusinessGoals = DEFAULT_GOAL_CONFIGURATION;
    const projection = {
      projectedLeads: 40,
      projectedAppointments: 30,
      projectedPipelineValue: 20000,
    };
    const risk = calculateGoalRisk(projection, goals, 35, 80);
    expect(risk.leads).toBe(true);
    expect(risk.pipelineValue).toBe(true);
    expect(risk.conversion).toBe(true);
    expect(risk.attendance).toBe(true);
  });

  it("generates goal insights with warning and risk statements", () => {
    const progress = {
      leads: calculateGoalProgress(30, 50),
      conversion: calculateGoalProgress(25, 40),
      attendance: calculateGoalProgress(70, 85),
      pipelineValue: calculateGoalProgress(15000, 25000),
    };
    const projection = {
      projectedLeads: 30,
      projectedAppointments: 21,
      projectedPipelineValue: 15000,
    };
    const insights = generateGoalInsights(progress, projection, DEFAULT_GOAL_CONFIGURATION);

    expect(insights.some((line) => line.includes("⚠️"))).toBe(true);
    expect(insights.some((line) => line.includes("🔴"))).toBe(true);
    expect(insights.some((line) => line.includes("Objetivo"))).toBe(true);
  });
});
