import { defineConfig } from "vitest/config";

// Root config runs only the interview exercises (challenges/ and live/).
// Each app has its own vitest config.
export default defineConfig({
  test: {
    include: ["challenges/**/*.test.ts", "live/**/*.test.ts"],
  },
});
