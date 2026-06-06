"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { submitReport } from "@/actions/report";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle } from "lucide-react";

const CARRIAGE_TYPES = [
  { id: "Eksekutif", prefix: "Eks", max: 9 },
  { id: "Ekonomi", prefix: "Eko", max: 9 },
  { id: "Ekonomi Premium", prefix: "Prem", max: 6 },
  { id: "Bisnis", prefix: "Bis", max: 5 },
  { id: "Luxury", prefix: "Lux", max: 3 },
  { id: "Kereta Makan", options: ["M1", "M2", "KM"] },
  { id: "Pembangkit", options: ["P"] },
  { id: "Lainnya", options: ["Bagasi", "Lainnya"] },
];

const getCarriageNumbers = (typeId: string) => {
  const type = CARRIAGE_TYPES.find(t => t.id === typeId);
  if (!type) return [];
  if (type.options) return type.options;
  
  const nums = [];
  for (let i = 1; i <= type.max!; i++) {
    nums.push(`${type.prefix}-${i}`);
  }
  return nums;
};

export function ReportFormClient({ trains, currentUserId }: { trains: any[], currentUserId: number }) {
  const [loading, setLoading] = useState(false);
  const [trainNumber, setTrainNumber] = useState("");
  
  const [findings, setFindings] = useState([
    { carriageType: "", carriageNumber: "", description: "" }
  ]);

  // Load draft dari localStorage saat komponen dimount
  useEffect(() => {
    const saved = localStorage.getItem('draft_report');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.trainNumber) setTrainNumber(parsed.trainNumber);
        if (parsed.findings && parsed.findings.length > 0) setFindings(parsed.findings);
      } catch (e) {
        console.error("Gagal load draft", e);
      }
    }
  }, []);

  // Simpan draft otomatis setiap kali data berubah
  useEffect(() => {
    // Jangan simpan kalau masih bener-bener kosong dari awal (cegah over-write draft yg baru diload)
    localStorage.setItem('draft_report', JSON.stringify({
      trainNumber,
      findings
    }));
  }, [trainNumber, findings]);

  const addFinding = () => {
    setFindings([...findings, { carriageType: "", carriageNumber: "", description: "" }]);
  };

  const removeFinding = (index: number) => {
    if (findings.length > 1) {
      setFindings(findings.filter((_, i) => i !== index));
    }
  };

  const updateFinding = (index: number, field: string, value: string) => {
    const newFindings = [...findings];
    newFindings[index] = { ...newFindings[index], [field]: value };
    
    // Reset carriageNumber jika carriageType berubah
    if (field === 'carriageType') {
      newFindings[index].carriageNumber = "";
    }
    
    setFindings(newFindings);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!trainNumber) {
      alert("Pilih Kereta!");
      setLoading(false);
      return;
    }

    // Validasi findings
    const validFindings = findings.filter(f => f.carriageType && f.carriageNumber && f.description);
    if (validFindings.length === 0) {
      alert("Harap masukkan setidaknya satu temuan lengkap.");
      setLoading(false);
      return;
    }

    const res = await submitReport({
      conductorId: currentUserId,
      trainNumber: trainNumber,
      dutyDate: new Date(), // Otomatis hari ini
      findings: validFindings
    });

    if (res.success) {
      alert("Laporan berhasil disubmit!");
      // Reset form dan hapus draft
      localStorage.removeItem('draft_report');
      setTrainNumber("");
      setFindings([{ carriageType: "", carriageNumber: "", description: "" }]);
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-sm border border-gray-100 bg-white/80 backdrop-blur-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Informasi Dinas</CardTitle>
          <CardDescription>Pilih kereta (Tanggal dinas otomatis tercatat hari ini).</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Kereta Api</label>
            <Select value={trainNumber} onValueChange={(val) => setTrainNumber(val || "")}>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Pilih Kereta" />
              </SelectTrigger>
              <SelectContent>
                {trains.map(t => (
                  <SelectItem key={t.number} value={t.number}>
                    {`${t.number} - ${t.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-gray-100 bg-white/80 backdrop-blur-md rounded-2xl border-t-4 border-t-blue-500">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Daftar Temuan / Kerusakan</CardTitle>
            <CardDescription>Catat semua temuan fasilitas kereta di sini.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addFinding} className="gap-2 rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 border-blue-200">
            <PlusCircle className="w-4 h-4" /> Tambah Baris
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {findings.map((finding, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-5 border border-gray-100 rounded-xl bg-white shadow-sm relative group transition-all hover:shadow-md">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500">Tipe Kelas</label>
                <Select 
                  value={finding.carriageType} 
                  onValueChange={(val) => updateFinding(index, 'carriageType', val || "")}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Pilih Tipe Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARRIAGE_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-gray-500">No. Gerbong</label>
                <Select 
                  value={finding.carriageNumber} 
                  onValueChange={(val) => updateFinding(index, 'carriageNumber', val || "")}
                  disabled={!finding.carriageType}
                >
                  <SelectTrigger className="bg-white disabled:bg-gray-100 disabled:opacity-50">
                    <SelectValue placeholder="Pilih Gerbong" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCarriageNumbers(finding.carriageType).map(num => (
                      <SelectItem key={num} value={num}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-[2] space-y-1">
                <label className="text-xs font-semibold text-gray-500">Deskripsi Temuan</label>
                <Input 
                  placeholder="Kursi 12A rusak tidak bisa direbahkan..." 
                  value={finding.description}
                  onChange={(e) => updateFinding(index, 'description', e.target.value)}
                  className="bg-white"
                />
              </div>
              {findings.length > 1 && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="absolute -right-2 -top-2 bg-white md:bg-transparent shadow-sm md:shadow-none md:relative md:right-0 md:top-0 md:mt-5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full border md:border-none"
                  onClick={() => removeFinding(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end pt-4 pb-10">
        <Button type="submit" size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 shadow-md hover:shadow-lg transition-all" disabled={loading}>
          {loading ? "Mensubmit Laporan..." : "Submit Laporan Dinas"}
        </Button>
      </div>
    </form>
  );
}
