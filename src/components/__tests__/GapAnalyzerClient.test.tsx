// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GapAnalyzerClient from "../GapAnalyzerClient";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
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
    (useLanguage as any).mockReturnValue({
      language: "ar",
      t: (key: string) => key,
    });
    (useRouter as any).mockReturnValue({
      push: vi.fn(),
    });
  });

  it("renders empty state when no recent interview", () => {
    (useAuth as any).mockReturnValue({ user: { uid: "123" } });
    // Mock local storage to return null
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    render(<GapAnalyzerClient />);
    expect(screen.getByText("gap_analyzer_title")).toBeDefined();
    expect(screen.getByText("no_interview_data")).toBeDefined();
  });

  it("renders analysis button when interview data exists", () => {
    (useAuth as any).mockReturnValue({ user: { uid: "123" } });
    
    // Mock local storage with valid interview data
    const mockData = {
      messages: [],
      score: 80,
      duration: 15,
      timestamp: Date.now()
    };
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(JSON.stringify(mockData));

    render(<GapAnalyzerClient />);
    expect(screen.getByText("start_gap_analysis")).toBeDefined();
  });
});
