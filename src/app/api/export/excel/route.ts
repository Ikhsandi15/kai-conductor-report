import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const conductorIdParam = searchParams.get("conductorId");

    const where: any = {};
    if (conductorIdParam) {
      where.conductorId = parseInt(conductorIdParam, 10);
    }
    if (dateParam) {
      const startOfDay = new Date(dateParam);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateParam);
      endOfDay.setHours(23, 59, 59, 999);
      where.dutyDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Ambil data berdasarkan filter
    const reports = await prisma.report.findMany({
      where,
      include: {
        conductor: true,
        train: true,
        findings: true,
      },
      orderBy: { dutyDate: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rekap Laporan Akhir Dinas");

    // Styling Header
    worksheet.columns = [
      { header: "Tanggal Dinas", key: "dutyDate", width: 20 },
      { header: "Nama Kondektur", key: "conductor", width: 25 },
      { header: "No. KA", key: "trainNumber", width: 10 },
      { header: "Nama Kereta", key: "trainName", width: 25 },
      { header: "Tipe Kereta", key: "carriageType", width: 15 },
      { header: "No. Gerbong", key: "carriageNumber", width: 15 },
      { header: "Deskripsi Temuan", key: "description", width: 40 },
    ];

    // Format Header Row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF004B91' }, // Biru KAI
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Insert Data
    reports.forEach((report) => {
      const formattedDate = format(new Date(report.dutyDate), "dd MMMM yyyy", { locale: id });
      
      // Jika tidak ada temuan, tetap tampilkan baris laporan
      if (report.findings.length === 0) {
        worksheet.addRow({
          dutyDate: formattedDate,
          conductor: report.conductor?.name || "-",
          trainNumber: report.train?.number || "-",
          trainName: report.train?.name || "-",
          carriageType: "-",
          carriageNumber: "-",
          description: "TIDAK ADA TEMUAN",
        });
      } else {
        // Jika ada temuan, pecah menjadi beberapa baris sesuai jumlah temuan
        report.findings.forEach((finding) => {
          worksheet.addRow({
            dutyDate: formattedDate,
            conductor: report.conductor?.name || "-",
            trainNumber: report.train?.number || "-",
            trainName: report.train?.name || "-",
            carriageType: finding.carriageType,
            carriageNumber: finding.carriageNumber,
            description: finding.description,
          });
        });
      }
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="Rekap_Laporan_Kondektur_${format(new Date(), "yyyyMMdd")}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error generating excel:", error);
    return new Response("Gagal generate Excel", { status: 500 });
  }
}
