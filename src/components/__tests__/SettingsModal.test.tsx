import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SettingsModal from "../SettingsModal";

// Mock hooks
vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    t: (key: string) => key,
    language: "ar",
    setLanguage: vi.fn(),
  }),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "123", email: "test@example.com" },
    logout: vi.fn(),
  }),
}));

describe("SettingsModal Component", () => {
  it("renders null when isOpen is false", () => {
    const { container } = render(<SettingsModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders modal content when isOpen is true", () => {
    render(<SettingsModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("settingsModal.title")).toBeTruthy();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<SettingsModal isOpen={true} onClose={handleClose} />);
    
    // There should be a close button (aria-label "إغلاق" or similar from mock)
    // Actually, in the file it falls back to "إغلاق" if t() is missing, but our mock returns the key
    const closeButton = screen.getByLabelText("settingsModal.close");
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders correct tabs", () => {
    render(<SettingsModal isOpen={true} onClose={vi.fn()} />);
    
    expect(screen.getByText("settingsModal.tabs.profile")).toBeTruthy();
    expect(screen.getByText("settingsModal.tabs.notifications")).toBeTruthy();
    expect(screen.getByText("settingsModal.tabs.appearance")).toBeTruthy();
  });
});
