export type SplitQuestionItem = {
  index: number;
  text: string;
};

export function detectMultipleQuestions(
  text: string,
): SplitQuestionItem[] | null {
  if (!text || !text.trim()) return null;

  const regex = /(?:^|\n)[ \t]*(\d{1,2})[.)][ \t]+/g;
  const matches: { index: number; start: number; end: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      index: parseInt(match[1], 10),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  if (matches.length < 2) return null;

  const isSequential = matches.every((m, i) => {
    if (i === 0) return true;
    return m.index === matches[i - 1].index + 1;
  });

  if (!isSequential) return null;

  const results: SplitQuestionItem[] = [];
  for (let i = 0; i < matches.length; i++) {
    const contentStart = matches[i].end;
    const contentEnd =
      i + 1 < matches.length ? matches[i + 1].start : text.length;
    const chunk = text.slice(contentStart, contentEnd).trim();
    if (chunk) {
      results.push({ index: matches[i].index, text: chunk });
    }
  }

  return results.length >= 2 ? results : null;
}
