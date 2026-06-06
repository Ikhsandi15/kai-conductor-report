"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReport(data: {
  conductorId: number;
  trainNumber: string;
  dutyDate: Date;
  findings: Array<{
    carriageType: string;
    carriageNumber: string;
    description: string;
  }>;
}) {
  try {
    const report = await prisma.report.create({
      data: {
        conductorId: data.conductorId,
        trainNumber: data.trainNumber,
        dutyDate: data.dutyDate,
        findings: {
          create: data.findings.map(f => ({
            carriageType: f.carriageType,
            carriageNumber: f.carriageNumber,
            description: f.description,
          })),
        },
      },
    });

    revalidatePath("/reports");
    return { success: true, reportId: report.id };
  } catch (error: any) {
    console.error("Error submitting report:", error);
    return { success: false, error: "Gagal menyimpan laporan. Pastikan semua data terisi dengan benar." };
  }
}
