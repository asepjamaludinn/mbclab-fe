import jsPDF from "jspdf";

export function generateTpReceiptPdf(
  studentName: string,
  studentNim: string,
  moduleTitle: string,
  deadlineIso: string | null,
  isInter: boolean,
  questions: { id: string; content: string; contentEn: string | null }[],
  studentVariantTarget: "ODD" | "EVEN",
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;
  const lineHeight = 6;

  const printText = (
    text: string,
    align: "left" | "center" = "left",
    isBold = false,
  ) => {
    doc.setFont("courier", isBold ? "bold" : "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      if (align === "center") {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, (pageWidth - textWidth) / 2, y);
      } else {
        doc.text(line, margin, y);
      }
      y += lineHeight;
    });
  };

  const printKeyValue = (key: string, value: string) => {
    doc.setFont("courier", "normal");
    doc.setFontSize(11);

    const paddedKey = (key + "                    ").substring(0, 18);
    const prefix = `${paddedKey}: `;

    const prefixWidth = doc.getTextWidth(prefix);
    const valueWidth = contentWidth - prefixWidth;
    const lines = doc.splitTextToSize(value, valueWidth);

    lines.forEach((line: string, i: number) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      if (i === 0) {
        doc.text(prefix + line, margin, y);
      } else {
        doc.text(line, margin + prefixWidth, y);
      }
      y += lineHeight;
    });
  };

  const divider = "==================================================";
  const dashDivider = "--------------------------------------------------";
  const starDivider = "**************************************************";

  const lblName = isInter ? "NAME" : "NAMA";
  const lblNim = isInter ? "STUDENT ID" : "NIM";
  const lblModule = isInter ? "Module" : "Modul";
  const lblDate = isInter ? "Deadline Date" : "Tgl Deadline";
  const lblTime = isInter ? "Time" : "Jam";
  const lblType = isInter ? "Type" : "Tipe";
  const lblVersion = isInter ? "Version" : "Versi";
  const valVersion = isInter ? "International" : "Reguler";
  const lblVariant = isInter ? "Variant" : "Variasi";
  const valVariant =
    studentVariantTarget === "EVEN"
      ? isInter
        ? "Even"
        : "Genap"
      : isInter
        ? "Odd"
        : "Ganjil";
  const lblRules = isInter ? "Rules" : "Ketentuan";
  const valRules = isInter
    ? "Must be handwritten and scanned/photographed"
    : "Wajib ditulis tangan lalu di scan/foto";
  const txtThanks = isInter ? "THANK YOU" : "TERIMA KASIH";
  const txtLuck = isInter ? "Good Luck" : "Selamat Mengerjakan";
  const localeDate = isInter ? "en-GB" : "id-ID";

  printText(divider, "center");
  printText("MBC LABORATORY", "center", true);
  printText("TULT 11.12", "center");
  printText(divider, "center");
  y += 5;

  printKeyValue(lblName, studentName);
  printKeyValue(lblNim, studentNim);
  printText(dashDivider, "center");
  y += 2;

  printKeyValue(lblModule, moduleTitle);

  let deadlineStr = "-";
  let timeStr = "-";
  if (deadlineIso) {
    const d = new Date(deadlineIso);
    deadlineStr = d.toLocaleDateString(localeDate, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    timeStr =
      d.toLocaleTimeString(localeDate, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + (isInter ? "" : " WIB");
  }

  printKeyValue(lblDate, deadlineStr);
  printKeyValue(lblTime, timeStr);
  printKeyValue(lblType, "TP");
  printKeyValue(lblVersion, valVersion);
  printKeyValue(lblVariant, valVariant);
  printKeyValue(lblRules, valRules);
  y += 2;

  printText(dashDivider, "center");
  y += 5;

  questions.forEach((q, idx) => {
    const text = `${idx + 1}. ${isInter && q.contentEn ? q.contentEn : q.content}`;
    printText(text, "left");
    y += 3;
  });

  y += 5;
  printText(starDivider, "center");
  printText(txtThanks, "center", true);
  printText(txtLuck, "center");
  printText(starDivider, "center");

  const safeNim = studentNim || "NIM";
  const safeModul = moduleTitle
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  doc.save(`Soal_TP_${safeNim}_${safeModul}.pdf`);
}
