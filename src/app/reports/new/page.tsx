import { getTrains } from "@/actions/train";
import { ReportFormClient } from "./ReportFormClient";

export default async function NewReportPage() {
  // Ambil data kereta yang aktif
  const trains = await getTrains();
  const activeTrains = trains.filter(t => t.isActive);

  // TODO: Ganti dengan session user dari NextAuth
  const mockUserId = 1; 

  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Laporan Dinas</h1>
        <p className="text-gray-500 mt-2">Formulir pelaporan temuan fasilitas dan pelayanan kereta api</p>
      </div>
      
      <ReportFormClient trains={activeTrains} currentUserId={mockUserId} />
    </div>
  );
}
