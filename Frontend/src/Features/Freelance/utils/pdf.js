const toPdfSafe = (value) =>
  Array.from(String(value))
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 && code <= 126;
    })
    .join("")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");

const sanitizeFileName = (value) =>
  String(value || "lancerflow-document")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "lancerflow-document";

const wrapLine = (line, limit = 92) => {
  const words = line.split(/\s+/);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > limit) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines.length ? lines : [""];
};

export function downloadTextAsPdf({ title, content, fileName }) {
  if (!content) return;

  const pageHeight = 792;
  const top = 750;
  const bottom = 50;
  const lineHeight = 14;
  const maxLines = Math.floor((top - bottom) / lineHeight);
  const lines = [
    title || "LancerFlow Document",
    "",
    ...String(content)
      .split("\n")
      .flatMap((line) => wrapLine(line))
  ];
  const pages = [];

  for (let i = 0; i < lines.length; i += maxLines) {
    pages.push(lines.slice(i, i + maxLines));
  }

  const objects = [];
  const pageRefs = [];

  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  pages.forEach((pageLines, index) => {
    const pageObjectNumber = 4 + index * 2;
    const contentObjectNumber = pageObjectNumber + 1;
    pageRefs.push(`${pageObjectNumber} 0 R`);

    const stream = pageLines
      .map((line, lineIndex) => {
        const size = index === 0 && lineIndex === 0 ? 16 : 11;
        const y = top - lineIndex * lineHeight;
        return `BT /F1 ${size} Tf 54 ${y} Td (${toPdfSafe(line)}) Tj ET`;
      })
      .join("\n");

    objects[pageObjectNumber - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`;
    objects[contentObjectNumber - 1] = `<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`;
  });

  objects[1] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pages.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(fileName)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
