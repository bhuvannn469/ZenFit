const { execSync } = require('child_process');

const patterns = [
  { name: 'Google API key (AIza...)', regex: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'GitHub token (ghp_)', regex: /ghp_[A-Za-z0-9]{20,}/ },
  { name: 'OpenAI style key (sk-)', regex: /sk-[A-Za-z0-9]{20,}/ },
  { name: 'Slack token', regex: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: 'Private key block', regex: /BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY/ },
];

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf8',
  }).trim();

  if (!output) {
    return [];
  }

  return output.split(/\r?\n/).filter(Boolean);
}

function getStagedContent(filePath) {
  try {
    return execSync(`git show :"${filePath}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

const stagedFiles = getStagedFiles();
const findings = [];

for (const file of stagedFiles) {
  const content = getStagedContent(file);
  if (!content) {
    continue;
  }

  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      findings.push({ file, pattern: pattern.name });
    }
  }
}

if (findings.length > 0) {
  console.error('Secret scan failed. Potential sensitive content detected in staged files:');
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.pattern}`);
  }
  console.error('Commit blocked. Move secrets to environment variables before committing.');
  process.exit(1);
}

console.log('Secret scan passed.');
