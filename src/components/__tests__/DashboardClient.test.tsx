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
    vi.mocked(useLanguage).mockReturnValue({
      language: "ar",
      t: (key: string) => key,
    });
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
    });
  });

  it("renders loading state", () => {
    vi.mocked(useAuth).mockReturnValue({ user: { uid: "123" } });
    vi.mocked(useActivities).mockReturnValue({ activities: [], loading: true });

    render(<DashboardClient />);
    // Check for skeleton or loading text if available
    expect(document.querySelector(".animate-pulse")).toBeDefined();
  });

  it("renders activities when loaded", () => {
    vi.mocked(useAuth).mockReturnValue({ user: { uid: "123", displayName: "Test User" } });
    vi.mocked(useActivities).mockReturnValue({ 
      activities: [
        { id: "1", type: "interview", score: 85, createdAt: new Date() }
      ], 
      loading: false 
    });

    render(<DashboardClient />);
    expect(screen.getByText("dashboard.welcome")).toBeDefined();
    expect(screen.getByText("dashboard.history.score")).toBeDefined();
  });
});
