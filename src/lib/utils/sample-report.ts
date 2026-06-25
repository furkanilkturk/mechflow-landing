import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// A self-contained, branded sample report — mirrors the real MechFlow export
// (Slate & Rust Orange identity) so the landing can demo "Reports in one click".
export function generateSampleReport() {
	const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();

	const slate900: [number, number, number] = [15, 23, 42];
	const rust: [number, number, number] = [194, 65, 12];
	const slate800: [number, number, number] = [30, 41, 59];
	const borderGray: [number, number, number] = [241, 245, 249];
	const textGray: [number, number, number] = [100, 116, 139];

	// ── Header ──────────────────────────────────────────────────────────────
	doc.setFillColor(...rust);
	doc.rect(15, 10, 2, 10, 'F'); // brand stripe

	doc.setTextColor(...slate900);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(14);
	doc.text('MECHFLOW', 20, 15);

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8.5);
	doc.setTextColor(...textGray);
	doc.text('Industrial Machine Operations', 20, 19);

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(10.5);
	doc.setTextColor(...rust);
	doc.text('FLEET REPORT', pageWidth - 15, 14, { align: 'right' });

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(8);
	doc.setTextColor(...textGray);
	doc.text('TIME FRAME: LAST 30 DAYS', 15, 27);
	doc.text(`GENERATED: ${new Date().toLocaleString()}`, pageWidth - 15, 27, { align: 'right' });

	doc.setDrawColor(...borderGray);
	doc.setLineWidth(0.4);
	doc.line(15, 29, pageWidth - 15, 29);

	// ── KPI cards ───────────────────────────────────────────────────────────
	const kpis = [
		['FLEET', '1,284'],
		['IN TRANSIT', '37'],
		['ON SITE', '11 countries'],
		['UPTIME', '99.98%']
	];
	const cardW = (pageWidth - 30 - 3 * 4) / 4;
	let cx = 15;
	const cy = 36;
	for (const [label, value] of kpis) {
		doc.setDrawColor(...borderGray);
		doc.setLineWidth(0.3);
		doc.rect(cx, cy, cardW, 18);
		doc.setFontSize(7);
		doc.setTextColor(...textGray);
		doc.text(label, cx + 3, cy + 6);
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(12);
		doc.setTextColor(...slate800);
		doc.text(value, cx + 3, cy + 13);
		doc.setFont('helvetica', 'normal');
		cx += cardW + 4;
	}

	// ── Machine table ───────────────────────────────────────────────────────
	autoTable(doc, {
		startY: 62,
		head: [['SERIAL', 'MACHINE', 'CUSTOMER', 'COUNTRY', 'STAGE']],
		body: [
			['SN-98240', 'Mersan Stenter Pro 3000', 'Dokuma Tekstil', 'Türkiye', 'Assembly'],
			['SN-98255', 'Mersan Compactor X2', 'Anand Mills', 'India', 'Testing'],
			['SN-98261', 'Mersan Dryer Line 8', 'Nile Weave Co.', 'Egypt', 'Ready for Shipment'],
			['SN-98274', 'Mersan Stenter Pro 3000', 'Dhaka Fabrics', 'Bangladesh', 'Awaiting Installation'],
			['SN-98290', 'Mersan Coating Unit 5', 'São Paulo Têxtil', 'Brazil', 'Order Created'],
			['SN-98301', 'Mersan Compactor X2', 'Shanghai Knit', 'China', 'Installed']
		],
		theme: 'grid',
		headStyles: { fillColor: slate900, textColor: [255, 255, 255], fontSize: 8, halign: 'left' },
		bodyStyles: { fontSize: 8, textColor: slate800 },
		alternateRowStyles: { fillColor: [248, 250, 252] },
		styles: { cellPadding: 2.5, lineColor: borderGray, lineWidth: 0.2 },
		margin: { left: 15, right: 15 }
	});

	// ── Footer ──────────────────────────────────────────────────────────────
	doc.setDrawColor(...borderGray);
	doc.setLineWidth(0.4);
	doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
	doc.setFontSize(8);
	doc.setTextColor(...textGray);
	doc.text('Sample report · mechflow.com', 15, pageHeight - 10);
	doc.text('Page 1', pageWidth - 15, pageHeight - 10, { align: 'right' });

	doc.save('MechFlow_Sample_Fleet_Report.pdf');
}
