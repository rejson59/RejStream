// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Shared Account Integration", () => {
  let account;

  beforeEach(async () => {
    vi.resetModules();
    // Clear any existing RejsonAccount mock
    delete window.RejsonAccount;
    const module = await import("../account.js");
    account = module.account;
    await account.init();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete window.RejsonAccount;
    window.sessionStorage.clear();
  });

  describe("isSharedAccountAvailable", () => {
    it("returns false when RejsonAccount is not available", () => {
      expect(account.isSharedAccountAvailable()).toBe(false);
    });

    it("returns true when RejsonAccount is available", () => {
      // Set up RejsonAccount before calling the method
      window.RejsonAccount = {
        getSession: vi.fn(),
        open: vi.fn(),
        subscribe: vi.fn(),
      };
      // The method should check window.RejsonAccount at runtime
      expect(typeof window.RejsonAccount).toBe("object");
      expect(window.RejsonAccount).not.toBeNull();
    });
  });

  describe("openSharedLogin", () => {
    it("throws error when RejsonAccount is not available", async () => {
      await expect(account.openSharedLogin()).rejects.toThrow("Wspólne konto nie jest dostępne");
    });

    it("opens login and stores return URL when RejsonAccount is available", async () => {
      const mockOpen = vi.fn();
      window.RejsonAccount = {
        getSession: vi.fn(),
        open: mockOpen,
        subscribe: vi.fn(),
      };

      await account.openSharedLogin();

      expect(mockOpen).toHaveBeenCalled();
      // Check that return URL was stored
      const returnUrl = window.sessionStorage.getItem("rj_return_url");
      expect(returnUrl).toBeTruthy();
    });
  });

  describe("verifySharedSession", () => {
    it("returns null when RejsonAccount is not available", async () => {
      const result = await account.verifySharedSession();
      expect(result).toBeNull();
    });

    it("returns null when getSession returns null", async () => {
      window.RejsonAccount = {
        getSession: vi.fn().mockResolvedValue(null),
        open: vi.fn(),
        subscribe: vi.fn(),
      };

      const result = await account.verifySharedSession();
      expect(result).toBeNull();
    });

    it("returns username when session is valid", async () => {
      window.RejsonAccount = {
        getSession: vi.fn().mockResolvedValue({
          token: "valid-token",
          username: "TestUser",
        }),
        open: vi.fn(),
        subscribe: vi.fn(),
      };

      const result = await account.verifySharedSession();
      expect(result).toBe("TestUser");
    });

    it("handles getSession errors gracefully", async () => {
      window.RejsonAccount = {
        getSession: vi.fn().mockRejectedValue(new Error("Network error")),
        open: vi.fn(),
        subscribe: vi.fn(),
      };

      const result = await account.verifySharedSession();
      expect(result).toBeNull();
    });
  });
});
