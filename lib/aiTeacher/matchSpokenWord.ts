function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

export function normalizeSpeechText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Loose match for A1 vocab — transcript rarely spells Luxembourgish perfectly. */
export function matchesSpokenWord(spoken: string, target: string): boolean {
  const spokenNorm = normalizeSpeechText(spoken);
  const targetNorm = normalizeSpeechText(target);
  if (!spokenNorm || !targetNorm) return false;

  if (spokenNorm.includes(targetNorm) || targetNorm.includes(spokenNorm)) {
    return true;
  }

  const spokenWords = spokenNorm.split(" ");
  for (const word of spokenWords) {
    if (word === targetNorm) return true;
    if (levenshtein(word, targetNorm) <= 1) return true;
  }

  const maxDistance = Math.max(1, Math.floor(targetNorm.length * 0.35));
  return levenshtein(spokenNorm, targetNorm) <= maxDistance;
}
