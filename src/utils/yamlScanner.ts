import yaml from 'js-yaml';

export interface ScanIssue {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  path: string;
  message: string;
  fix: string;
  line?: number;
}

export const scanYaml = (yamlString: string): ScanIssue[] => {
  const issues: ScanIssue[] = [];
  let parsed: any;

  try {
    parsed = yaml.load(yamlString);
  } catch (e) {
    console.error('YAML Parsing Error:', e);
    return [];
  }

  if (!parsed || typeof parsed !== 'object') return [];

  const traverse = (obj: any, path: string = '') => {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      const value = obj[key];

      // 1. Detect Privileged Container
      if (key === 'privileged' && value === true) {
        issues.push({
          id: `priv-${currentPath}`,
          type: 'Privileged Container',
          severity: 'critical',
          path: currentPath,
          message: 'Container has full root access to host (privileged: true).',
          fix: 'Set privileged: false in the securityContext.',
        });
      }

      // 2. Detect Hardcoded Secrets (Key Match)
      const sensitiveKeys = ['password', 'passwd', 'secret', 'token'];
      if (typeof value === 'string' && sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        if (value.length > 3) { // Avoid false positives on empty/short placeholders
          issues.push({
            id: `sec-${currentPath}`,
            type: 'Hardcoded Secret',
            severity: 'critical',
            path: currentPath,
            message: `Sensitive key "${key}" contains a hardcoded value.`,
            fix: 'Use Environment Variables or Kubernetes Secrets.',
          });
        }
      }

      // 3. Detect API Key Exposure (Pattern Match)
      if (typeof value === 'string') {
        const patterns = [
          { name: 'Stripe Secret Key', regex: /^sk_[a-zA-Z0-9_]+$/, severity: 'critical' as const },
          { name: 'Google Cloud API Key', regex: /^AIza[a-zA-Z0-9_-]{35}$/, severity: 'critical' as const },
          { name: 'Generic API Key', regex: /^[a-zA-Z0-9-]{32,128}$/, severity: 'high' as const },
        ];

        for (const p of patterns) {
          if (p.regex.test(value)) {
            issues.push({
              id: `api-${currentPath}`,
              type: 'Exposed API Key',
              severity: p.severity,
              path: currentPath,
              message: `Detected ${p.name} pattern in value.`,
              fix: 'Rotate this key immediately and move to a secret manager.',
            });
            break; // One path discovery for API key suffices
          }
        }
        
        // Additional generic check for long sensitive keys
        const apiKeys = ['api', 'key', 'token'];
        if (apiKeys.some(ak => key.toLowerCase().includes(ak)) && value.length > 20) {
            // Check if already caught by patterns
            if (!issues.some(i => i.id === `api-${currentPath}`)) {
                issues.push({
                    id: `api-gen-${currentPath}`,
                    type: 'Exposed API Key',
                    severity: 'critical',
                    path: currentPath,
                    message: `Key "${key}" contains a long sensitive string.`,
                    fix: 'Rotate this key and move to Kubernetes Secrets.',
                });
            }
        }
      }

      // Recursive step
      if (Array.isArray(value)) {
        value.forEach((item, index) => traverse(item, `${currentPath}[${index}]`));
      } else if (typeof value === 'object') {
        traverse(value, currentPath);
      }
    }
  };

  traverse(parsed);

  // Debugging support: Log all detected issues
  if (issues.length > 0) {
    console.log('--- SCAN RESULTS ---');
    issues.forEach(i => console.log(`[${i.severity.toUpperCase()}] ${i.type} at ${i.path}: ${i.message}`));
    console.log('--------------------');
  }

  return issues;
};
