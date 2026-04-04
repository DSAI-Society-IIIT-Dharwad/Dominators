import { Finding, ScannerResult, RiskScore } from './types.ts';
import { parseYaml, getMetadata } from './utils.ts';
import { securityRules } from './rules.ts';

/**
 * Main scanner engine.
 */
export const scanManifest = (yamlContent: string): ScannerResult => {
  const findings: Finding[] = [];
  const resources = parseYaml(yamlContent);

  for (const resource of resources) {
    const metadata = getMetadata(resource);

    for (const rule of securityRules) {
      // Skip if rule has resourceType filter and it doesn't match
      if (rule.resourceTypes && !rule.resourceTypes.includes(metadata.kind)) {
        continue;
      }

      try {
        if (rule.check(resource)) {
          findings.push({
            id: rule.id,
            severity: rule.severity,
            message: rule.description,
            resource: metadata,
            recommendation: rule.recommendation
          });
        }
      } catch (e) {
        console.error(`Rule execution error for ${rule.id}:`, e);
      }
    }
  }

  return { findings };
};

/**
 * Calculate risk score and level based on findings.
 * Scoring: HIGH = -20, MEDIUM = -10, LOW = -5
 */
export const calculateRiskScore = (findings: Finding[]): RiskScore => {
  let score = 100;

  for (const finding of findings) {
    if (finding.severity === 'HIGH') score -= 20;
    else if (finding.severity === 'MEDIUM') score -= 10;
    else if (finding.severity === 'LOW') score -= 5;
  }

  // Ensure score is within 0-100
  score = Math.max(0, score);

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (score < 40) riskLevel = 'HIGH';
  else if (score < 75) riskLevel = 'MEDIUM';

  return { score, riskLevel };
};
