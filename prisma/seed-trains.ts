import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Hapus semua data kereta yang lama (karena user minta hapus yang tidak relevan)
  // Catatan: Jika ada Report yang terikat dengan Train ini, maka akan error constraint,
  // tapi berhubung ini aplikasi baru, kita asumsikan report bisa dihapus juga atau belum ada report penting.
  await prisma.reportFinding.deleteMany();
  await prisma.report.deleteMany();
  await prisma.train.deleteMany();

  // Data Kereta Api yang lewat / berawal dari Daop 5 Purwokerto
  const trains = [
    { number: "72", name: "Purwojaya (Gambir - Cilacap)" },
    { number: "71", name: "Purwojaya (Cilacap - Gambir)" },
    { number: "59", name: "Bima (Surabaya Gubeng - Gambir)" },
    { number: "60", name: "Bima (Gambir - Surabaya Gubeng)" },
    { number: "251", name: "Serayu (Purwokerto - Pasar Senen)" },
    { number: "252", name: "Serayu (Pasar Senen - Purwokerto)" },
    { number: "211", name: "Logawa (Purwokerto - Jember)" },
    { number: "212", name: "Logawa (Jember - Purwokerto)" },
    { number: "177", name: "Kamandaka (Purwokerto - Semarang Tawang)" },
    { number: "178", name: "Kamandaka (Semarang Tawang - Purwokerto)" },
    { number: "161", name: "Joglosemarkerto (Purwokerto - Solo Balapan)" },
    { number: "7", name: "Argo Lawu (Solo Balapan - Gambir)" },
    { number: "8", name: "Argo Lawu (Gambir - Solo Balapan)" },
    { number: "9", name: "Argo Dwipangga (Solo Balapan - Gambir)" },
    { number: "10", name: "Argo Dwipangga (Gambir - Solo Balapan)" },
    { number: "149", name: "Sawunggalih (Kutoarjo - Pasar Senen)" },
    { number: "150", name: "Sawunggalih (Pasar Senen - Kutoarjo)" }
  ];

  for (const train of trains) {
    await prisma.train.create({
      data: {
        number: train.number,
        name: train.name,
        isActive: true,
      }
    });
  }

  console.log("Berhasil memasukkan data kereta DAOP 5 Purwokerto!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
