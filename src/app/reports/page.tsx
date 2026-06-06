import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ReportFilterClient } from "./ReportFilterClient";

export default async function DashboardPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const dateMode = typeof searchParams.dateMode === 'string' ? searchParams.dateMode : undefined;
  const startDate = typeof searchParams.startDate === 'string' ? searchParams.startDate : undefined;
  const endDate = typeof searchParams.endDate === 'string' ? searchParams.endDate : undefined;
  const conductorIdParam = typeof searchParams.conductorId === 'string' ? searchParams.conductorId : undefined;

  const where: any = {};
  if (conductorIdParam) {
    where.conductorId = parseInt(conductorIdParam, 10);
  }
  
  if (dateMode === "today") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);
    where.dutyDate = { gte: today, lte: endToday };
  } else if (dateMode === "range" && (startDate || endDate)) {
    where.dutyDate = {};
    if (startDate) {
      const gte = new Date(startDate);
      gte.setHours(0, 0, 0, 0);
      where.dutyDate.gte = gte;
    }
    if (endDate) {
      const lte = new Date(endDate);
      lte.setHours(23, 59, 59, 999);
      where.dutyDate.lte = lte;
    }
  }

  const reports = await prisma.report.findMany({
    where,
    include: {
      conductor: true,
      train: true,
      findings: true,
    },
    orderBy: { dutyDate: "desc" },
  });

  const conductors = await prisma.user.findMany({
    where: { role: "CONDUCTOR" },
    select: { id: true, name: true }
  });

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Laporan</h1>
          <p className="text-gray-500">Rekapitulasi seluruh laporan akhir dinas kondektur</p>
        </div>
      </div>

      <ReportFilterClient conductors={conductors} />

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Tanggal Dinas</TableHead>
              <TableHead>Kondektur</TableHead>
              <TableHead>Kereta Api</TableHead>
              <TableHead className="text-center">Total Temuan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                  Belum ada data laporan yang masuk.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {format(new Date(report.dutyDate), "dd MMMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell>{report.conductor?.name || "Tidak Diketahui"}</TableCell>
                  <TableCell>{report.train?.number} - {report.train?.name}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center bg-red-100 text-red-700 font-bold w-6 h-6 rounded-full text-xs">
                      {report.findings.length}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {report.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
