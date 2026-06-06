import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Pastikan user Budi Kondektur dan Mas Tiko ada untuk testing NextAuth
  await prisma.user.upsert({
    where: { email: "budi@kai.id" },
    create: { id: 1, name: "Budi Kondektur", email: "budi@kai.id", password: "kondektur123", role: "CONDUCTOR" },
    update: { password: "kondektur123" }
  }).catch(() => {});

  await prisma.user.upsert({
    where: { email: "admin@kai.id" },
    create: { id: 2, name: "Mas Tiko (Admin)", email: "admin@kai.id", password: "admin123", role: "ADMIN" },
    update: { password: "admin123" }
  }).catch(() => {});

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-blue-800 mb-6">
        Selamat Datang di Sistem Laporan Dinas KAI
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-10">
        Aplikasi ini digunakan untuk mendigitalisasi pelaporan dinas kondektur, 
        mencatat temuan fasilitas, dan merekapitulasi data secara otomatis.
      </p>
      <div className="flex gap-4">
        <Link href="/reports/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Buat Laporan Baru</Button>
        </Link>
        <Link href="/reports">
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Lihat Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
