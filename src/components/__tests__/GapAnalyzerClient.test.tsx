// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GapAnalyzerClient from "../GapAnalyzerClient";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { interviewService } from "@/services/interview.service";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("@/services/interview.service", () => ({
  interviewService: {
    getInterviewLocal: vi.fn(),
    getInterview: vi.fn(),
    updateInterviewAnalysis: vi.fn(),
    updateInterviewAnalysisLocal: vi.fn(),
  },
}));

// Mock standard chart components
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  RadarChart: ({ children }: any) => <div>{children}</div>,
  PolarGrid: () => <div></div>,
  PolarAngleAxis: () => <div></div>,
  PolarRadiusAxis: () => <div></div>,
  Radar: () => <div></div>,
}));

describe("GapAnalyzerClient Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLanguage).mockReturnValue({
      language: "ar",
      t: (key: string) => key,
    });
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    });
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue(null), // no interviewId by default
    });
  });

  it("renders empty state when no interviewId is provided", () => {
    vi.mocked(useAuth).mockReturnValue({ user: { uid: "123" } });

    render(<GapAnalyzerClient />);
    expect(screen.getByText("gapAnalyzer.hero.title")).toBeDefined();
    expect(screen.getByText("gapAnalyzer.noData")).toBeDefined();
  });

  it("renders analysis overview when data is loaded", async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { uid: "123" } });
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn().mockReturnValue("local_123"),
    });
    
    // Mock local interview data containing an analysis
    const mockData = {
      id: "local_123",
      messages: [],
      score: 85,
      duration: 15,
      timestamp: Date.now(),
      createdAt: new Date(),
      status: "completed" as const,
      analysis: {
        score: 85,
        strengths: ["Good communication"],
        weaknesses: [],
        recommendedTopics: []
      }
    };
    vi.mocked(interviewService.getInterviewLocal).mockReturnValue(mockData);

    render(<GapAnalyzerClient />);
    // Wait for async effect to set analysis and render it
    expect(await screen.findByText("gapAnalyzer.score.title")).toBeDefined();
  });
});
