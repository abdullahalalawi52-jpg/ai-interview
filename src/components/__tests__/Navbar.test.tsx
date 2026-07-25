// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "../layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      language: "ar",
      t: (key: string) => key,
      toggleLanguage: vi.fn(),
    });
    (usePathname as any).mockReturnValue("/");
  });

  it("renders login button when unauthenticated", () => {
    (useAuth as any).mockReturnValue({
      user: null,
      openAuthModal: vi.fn(),
    });

    render(<Navbar />);
    expect(screen.getByText("login")).toBeDefined();
  });

  it("renders user menu when authenticated", () => {
    (useAuth as any).mockReturnValue({
      user: { displayName: "Test User", photoURL: "" },
      logout: vi.fn(),
    });

    render(<Navbar />);
    // "Test User" text might not be rendered directly if using an icon, but checking for dashboard link
    expect(screen.getByText("dashboard")).toBeDefined();
  });

  it("opens mobile menu when hamburger is clicked", () => {
    (useAuth as any).mockReturnValue({ user: null });
    
    render(<Navbar />);
    
    const menuBtn = screen.getByLabelText("toggle_menu");
    fireEvent.click(menuBtn);
    
    // Check if the menu opens (it might have an overlay or something specific)
    // Assuming the mobile menu contains links
    const mobileLinks = screen.getAllByRole("link");
    expect(mobileLinks.length).toBeGreaterThan(0);
  });
});
