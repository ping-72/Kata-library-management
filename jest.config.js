/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Library Management System Test Report",
        outputPath: "./test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
