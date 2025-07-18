module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^ordersApp/CartPage$": "<rootDir>/_mocks_/CartPage.js",
  },
  collectCoverage: true,                        // ✅ enable coverage
  coverageDirectory: "coverage",                // ✅ where to output the report
collectCoverageFrom: [
  "src/**/*.{ts,tsx}",
  "!src/**/*.d.ts",             // exclude type declaration files
  "!src/**/react-app-env.d.ts",
  "!src/setupTests.ts",
  "!src/reportWebVitals.ts",
  "!src/index.tsx",
  "!src/types/**",              // exclude all files in types/
  "!src/__mocks__/**",          // if any mocks
],
   // ✅ include source files
  coverageReporters: ["text", "lcov"], 
  // setupFiles: ['jest-fetch-mock'],
  
};
