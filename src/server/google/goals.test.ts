import { describe, expect, it, vi, beforeEach } from "vitest";
import { readGoalSettingsFromSheet, writeGoalSettingsToSheet } from "./goals";
import { DEFAULT_GOAL_CONFIGURATION } from "@/lib/goal-config";

const mocks = vi.hoisted(() => ({
  getMock: vi.fn(),
  updateMock: vi.fn(),
}));

vi.mock("googleapis", () => ({
  google: {
    auth: {
      OAuth2: vi.fn().mockImplementation(() => ({
        setCredentials: vi.fn(),
      })),
    },
    sheets: vi.fn().mockReturnValue({
      spreadsheets: {
        values: {
          get: mocks.getMock,
          update: mocks.updateMock,
        },
      },
    }),
  },
}));

vi.mock("./auth", () => ({
  getGoogleAuth: vi.fn(),
}));

vi.mock("@/lib/config.server", () => ({
  getServerConfig: vi.fn().mockReturnValue({
    googleClientId: "test-client-id",
    googleClientSecret: "test-client-secret",
    googleRedirectUri: "https://example.com/oauth2callback",
    googleScopes: "https://www.googleapis.com/auth/spreadsheets",
    googleRefreshToken: "test-refresh-token",
    googleSheetId: "sheet-id",
    googleSheetName: "Leads",
    googleCalendarId: "primary",
    googleCalendarTimeZone: "America/Panama",
    gmailSender: "no-reply@example.com",
  }),
}));

const rows = [
  ["monthlyLeadsGoal", "50"],
  ["conversionGoal", "40"],
  ["attendanceGoal", "85"],
  ["pipelineValueGoal", "25000"],
  ["extraGoal", "999"],
];

describe("Google goals sheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads goals from open A:B range and ignores unknown extra rows", async () => {
    mocks.getMock.mockResolvedValue({
      data: {
        values: rows,
      },
    });

    const result = await readGoalSettingsFromSheet();

    expect(mocks.getMock).toHaveBeenCalledOnce();

    expect(mocks.getMock.mock.calls[0][0].range).toBe("Goals!A:B");

    expect(result).toEqual(DEFAULT_GOAL_CONFIGURATION);
  });

  it("writes goals with explicit stable order", async () => {
    const settings = {
      monthlyLeadsGoal: 60,
      conversionGoal: 38,
      attendanceGoal: 82,
      pipelineValueGoal: 26000,
    };

    mocks.updateMock.mockResolvedValue({});

    await writeGoalSettingsToSheet(settings);

    expect(mocks.updateMock).toHaveBeenCalledOnce();

    expect(mocks.updateMock.mock.calls[0][0].range).toBe("Goals!A:B");

    expect(mocks.updateMock.mock.calls[0][0].requestBody.values).toEqual([
      ["monthlyLeadsGoal", "60"],
      ["conversionGoal", "38"],
      ["attendanceGoal", "82"],
      ["pipelineValueGoal", "26000"],
    ]);
  });
});
