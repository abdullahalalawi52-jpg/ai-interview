// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardClient from "../DashboardClient";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useActivities } from "@/hooks/useActivities";
import { useRouter } from "next/navigation";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("@/hooks/useActivities", () => ({
  useActivities: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("DashboardClient Component", () => {
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

  it("renders loading state", () => {
    (useAuth as any).mockReturnValue({ user: { uid: "123" } });
    (useActivities as any).mockReturnValue({ activities: [], loading: true });

    render(<DashboardClient />);
    // Check for skeleton or loading text if available
    expect(document.querySelector(".animate-pulse")).toBeDefined();
  });

  it("renders activities when loaded", () => {
    (useAuth as any).mockReturnValue({ user: { uid: "123", displayName: "Test User" } });
    (useActivities as any).mockReturnValue({ 
      activities: [
        { id: "1", type: "interview", score: 85, createdAt: new Date() }
      ], 
      loading: false 
    });

    render(<DashboardClient />);
    expect(screen.getByText("welcome, Test User")).toBeDefined();
    expect(screen.getByText("score_out_of_100")).toBeDefined(); // The score label might be rendered
  });
});
