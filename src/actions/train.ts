"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTrains() {
  try {
    return await prisma.train.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching trains:", error);
    return [];
  }
}

export async function createTrain(data: { number: string; name: string }) {
  try {
    const train = await prisma.train.create({
      data: {
        number: data.number,
        name: data.name,
        isActive: true,
      },
    });
    revalidatePath("/trains");
    return { success: true, data: train };
  } catch (error: any) {
    console.error("Error creating train:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Nomor kereta sudah terdaftar." };
    }
    return { success: false, error: "Gagal menyimpan kereta." };
  }
}

export async function toggleTrainStatus(number: string, currentStatus: boolean) {
  try {
    await prisma.train.update({
      where: { number },
      data: { isActive: !currentStatus }
    });
    revalidatePath("/trains");
    return { success: true };
  } catch (error) {
    console.error("Error toggling train status:", error);
    return { success: false, error: "Gagal mengupdate status kereta." };
  }
}
