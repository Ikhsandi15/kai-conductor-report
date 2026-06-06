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
    create: { id: 2, name: "Admin KAI", email: "admin@kai.id", password: "admin123", role: "ADMIN" },
    update: { password: "admin123", name: "Admin KAI" }
  }).catch(() => {});

  // Auto-seed kereta jika kosong (untuk mempermudah deployment Docker)
  const trainCount = await prisma.train.count();
  if (trainCount === 0) {
    const DAOP5_TRAINS = [
      { number: "72", name: "Purwojaya (Gambir - Cilacap)" },
      { number: "71", name: "Purwojaya (Cilacap - Gambir)" },
      { number: "59", name: "Bima (Surabaya Gubeng - Gambir)" },
      { number: "60", name: "Bima (Gambir - Surabaya Gubeng)" },
      { number: "7", name: "Argo Lawu (Solo Balapan - Gambir)" },
      { number: "8", name: "Argo Lawu (Gambir - Solo Balapan)" },
      { number: "9", name: "Argo Dwipangga (Solo Balapan - Gambir)" },
      { number: "10", name: "Argo Dwipangga (Gambir - Solo Balapan)" },
      { number: "67", name: "Taksaka (Yogyakarta - Gambir)" },
      { number: "68", name: "Taksaka (Gambir - Yogyakarta)" },
      { number: "135", name: "Bogowonto (Lempuyangan - Pasar Senen)" },
      { number: "136", name: "Bogowonto (Pasar Senen - Lempuyangan)" },
      { number: "137", name: "Gajahwong (Lempuyangan - Pasar Senen)" },
      { number: "138", name: "Gajahwong (Pasar Senen - Lempuyangan)" },
      { number: "141", name: "Fajar Utama YK (Yogyakarta - Pasar Senen)" },
      { number: "142", name: "Fajar Utama YK (Pasar Senen - Yogyakarta)" },
      { number: "149", name: "Sawunggalih (Kutoarjo - Pasar Senen)" },
      { number: "150", name: "Sawunggalih (Pasar Senen - Kutoarjo)" }
    ];
    await Promise.all(
      DAOP5_TRAINS.map(t => prisma.train.upsert({
        where: { number: t.number },
        update: {},
        create: { number: t.number, name: t.name, isActive: true }
      }))
    ).catch(console.error);
  }

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
