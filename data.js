// Analytics Blueprints, Architectural Metrics, and Achievement Mapping
const ACHIEVEMENTS_REGISTRY = [
    { id: "badge-first-pass", name: "System Init", criteria: "Pass your initial interview stage.", icon: "🚀" },
    { id: "badge-perfect-mcq", name: "Flawless Compiler", criteria: "Achieve 100% accuracy inside multiple-choice sections.", icon: "⚡" },
    { id: "badge-hard-conquered", name: "JVM Masterpiece", criteria: "Pass an interview marked with Hard difficulty settings.", icon: "👑" },
    { id: "badge-speed-runner", name: "High Throughput", criteria: "Submit answers with over 50% allotted timeframe remaining.", icon: "⏱️" }
];

const WEIGHTS_MATRIX = {
    MCQ: 2,
    TF: 1,
    CODE_ANALYSIS: 4,
    SCENARIO: 4,
    CODING: 10
};

const CATEGORIES_MAP = [
    "JVM Basics",
    "String Internals",
    "Java Fundamentals",
    "Spring Boot Core",
    "Spring Data JPA",
    "Architectural Isolation"
];