"use client";

import { useState } from "react";
import { createTrain, toggleTrainStatus } from "@/actions/train";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TrainClient({ initialTrains }: { initialTrains: any[] }) {
  const [trains, setTrains] = useState(initialTrains);
  const [loading, setLoading] = useState(false);

  async function handleAdd(formData: FormData) {
    setLoading(true);
    const number = formData.get("number") as string;
    const name = formData.get("name") as string;
    
    if (!number || !name) {
      alert("Mohon isi nomor dan nama kereta!");
      setLoading(false);
      return;
    }

    const res = await createTrain({ number, name });
    if (res.success && res.data) {
      setTrains([...trains, res.data].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  const handleToggleStatus = async (number: string, currentStatus: boolean) => {
    // Optimistic update
    setTrains(trains.map(t => t.number === number ? { ...t, isActive: !currentStatus } : t));
    
    const res = await toggleTrainStatus(number, currentStatus);
    if (!res.success) {
      // Revert on error
      alert(res.error);
      setTrains(trains.map(t => t.number === number ? { ...t, isActive: currentStatus } : t));
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="col-span-1 h-fit shadow-md border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle>Tambah Kereta Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleAdd} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nomor KA</label>
              <Input name="number" placeholder="Contoh: 1" required className="bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nama Kereta</label>
              <Input name="name" placeholder="Contoh: Argo Bromo Anggrek" required className="bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle>Daftar Kereta Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Nomor KA</TableHead>
                  <TableHead>Nama Kereta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trains.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Belum ada data kereta yang terdaftar.
                    </TableCell>
                  </TableRow>
                )}
                {trains.map((train) => (
                  <TableRow key={train.number} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-semibold text-gray-700">{train.number}</TableCell>
                    <TableCell>{train.name}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${train.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {train.isActive ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={train.isActive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}
                        onClick={() => handleToggleStatus(train.number, train.isActive)}
                      >
                        {train.isActive ? 'Non-Aktifkan' : 'Aktifkan'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
