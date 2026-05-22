import { logger } from "@assessment-ai/logger";

export interface InjectionDetectionResult {
  isDetected: boolean;
  riskScore: number; // 0-100
  detectedPatterns: string[];
  severity: "low" | "medium" | "high";
}

const INJECTION_PATTERNS = [
  // Instruction override attempts
  {
    pattern:
      /ignore\s+(?:previous|prior|above|past)\s+(?:instructions?|prompts?|messages?|guidelines?|rules?)/gi,
    severity: "high",
    name: "ignore_instructions",
  },
  {
    pattern: /system\s+prompt/gi,
    severity: "high",
    name: "system_prompt_reference",
  },
  {
    pattern:
      /(?:act|pretend|roleplay)\s+as\s+(?:a\s+)?(?:hacker|admin|developer|system)/gi,
    severity: "high",
    name: "privilege_escalation",
  },
  {
    pattern:
      /override\s+(?:instructions?|settings?|rules?|restrictions?|filters?)/gi,
    severity: "high",
    name: "override_attempt",
  },
  {
    pattern:
      /(?:disregard|forget|clear|reset|remove)\s+(?:instructions?|prompts?|guidelines?|rules?|context)/gi,
    severity: "high",
    name: "disregard_attempt",
  },
  {
    pattern: /new\s+(?:instructions?|prompts?|rules?|guidelines?|context)/gi,
    severity: "medium",
    name: "new_instructions",
  },
  {
    pattern: /jailbreak|DAN|do\s+anything\s+now/gi,
    severity: "high",
    name: "jailbreak_attempt",
  },
  {
    pattern: /bypass\s+(?:safety|restrictions?|filters?|guidelines?)/gi,
    severity: "high",
    name: "bypass_attempt",
  },
  {
    pattern:
      /(?:what\s+is|reveal|show|tell\s+me)\s+(?:your\s+)?(?:system\s+)?prompt/gi,
    severity: "medium",
    name: "prompt_extraction",
  },
  {
    pattern: /you\s+are\s+now\s+(?:operating|running)?\s+as/gi,
    severity: "high",
    name: "role_override",
  },
  {
    pattern: /developer\s+(?:mode|message|instruction)/gi,
    severity: "medium",
    name: "developer_mode",
  },
  {
    pattern: /hidden\s+(?:instructions?|messages?|context)/gi,
    severity: "medium",
    name: "hidden_context",
  },
];

/**
 * Detect prompt injection attempts in text
 * Returns detection results with severity classification
 */
export function detectPromptInjection(
  text: string,
  traceId?: string,
): InjectionDetectionResult {
  const detectedPatterns: {
    pattern: string;
    severity: "low" | "medium" | "high";
  }[] = [];
  let highSeverityCount = 0;
  let mediumSeverityCount = 0;

  for (const { pattern, severity, name } of INJECTION_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      detectedPatterns.push({ pattern: name, severity: severity as "low" | "medium" | "high" });

      if (severity === "high") {
        highSeverityCount += matches.length;
      } else if (severity === "medium") {
        mediumSeverityCount += matches.length;
      }
    }
  }

  // Calculate risk score
  let riskScore = 0;
  if (highSeverityCount > 0) {
    riskScore = Math.min(100, 30 + highSeverityCount * 20);
  } else if (mediumSeverityCount > 0) {
    riskScore = Math.min(100, 10 + mediumSeverityCount * 5);
  }

  // Determine severity level
  let severity: "low" | "medium" | "high" = "low";
  if (riskScore >= 70) {
    severity = "high";
  } else if (riskScore >= 40) {
    severity = "medium";
  }

  const isDetected = detectedPatterns.length > 0;

  if (isDetected) {
    logger.warn(
      {
        detectedPatterns: detectedPatterns.map((p) => p.pattern),
        riskScore,
        severity,
        traceId,
      },
      "Potential prompt injection detected",
    );
  }

  return {
    isDetected,
    riskScore,
    detectedPatterns: detectedPatterns.map((p) => p.pattern),
    severity,
  };
}

/**
 * Calculate injection risk score (0-100)
 * Higher score = higher risk
 */
export function calculateInjectionRiskScore(text: string): number {
  const result = detectPromptInjection(text);
  return result.riskScore;
}

/**
 * Check if text contains high-risk injection attempts
 */
export function hasHighRiskInjection(text: string): boolean {
  const result = detectPromptInjection(text);
  return result.severity === "high";
}
