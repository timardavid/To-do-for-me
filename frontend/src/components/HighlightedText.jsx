export default function HighlightedText({ text, query }) {
  if (!query) return text;

  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts = [];
  let i = 0;

  while (true) {
    const idx = lower.indexOf(q, i);
    if (idx === -1) {
      parts.push(text.slice(i));
      break;
    }
    if (idx > i) parts.push(text.slice(i, idx));
    parts.push(
      <mark key={idx} className="search-hl">
        {text.slice(idx, idx + query.length)}
      </mark>
    );
    i = idx + query.length;
  }

  return parts;
}
