// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomeClient from "../HomeClient";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
    h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
    p: ({ children, className }: any) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("HomeClient Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      language: "ar",
      t: (key: string) => key,
    });
  });

  it("renders hero section for unauthenticated user", () => {
    (useAuth as any).mockReturnValue({
      user: null,
      openAuthModal: vi.fn(),
    });

    render(<HomeClient />);
    expect(screen.getByText("hero_title")).toBeDefined();
    expect(screen.getByText("start_now_free")).toBeDefined();
  });

  it("renders authenticated call to action", () => {
    (useAuth as any).mockReturnValue({
      user: { uid: "123" },
      openAuthModal: vi.fn(),
    });

    render(<HomeClient />);
    expect(screen.getByText("go_to_dashboard")).toBeDefined();
  });
});
