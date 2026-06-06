"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";

export function ReportFilterClient({ conductors }: { conductors: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [date, setDate] = useState(searchParams.get("date") || "");
  const [conductorId, setConductorId] = useState(searchParams.get("conductorId") || "all");

  // Sync state if url changes
  useEffect(() => {
    setDate(searchParams.get("date") || "");
    setConductorId(searchParams.get("conductorId") || "all");
  }, [searchParams]);

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (conductorId && conductorId !== "all") params.set("conductorId", conductorId);
    router.push(`/reports?${params.toString()}`);
  };

  const clearFilter = () => {
    setDate("");
    setConductorId("all");
    router.push(`/reports`);
  };

  const getDownloadUrl = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (conductorId && conductorId !== "all") params.set("conductorId", conductorId);
    return `/api/export/excel?${params.toString()}`;
  };

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
        <div className="flex flex-col gap-1.5 w-full md:w-48">
          <label className="text-xs font-semibold text-gray-500">Kondektur</label>
          <Select value={conductorId} onValueChange={(val) => setConductorId(val || "all")}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Semua Kondektur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kondektur</SelectItem>
              {conductors.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 w-full md:w-48">
          <label className="text-xs font-semibold text-gray-500">Tanggal Dinas</label>
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="bg-white"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto md:pt-5">
          <Button onClick={applyFilter} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto flex gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          {(date || conductorId !== "all") && (
            <Button onClick={clearFilter} variant="outline" className="w-full md:w-auto flex gap-2">
              <X className="w-4 h-4" /> Reset
            </Button>
          )}
        </div>
      </div>

      <div className="w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
        <a href={getDownloadUrl()} target="_blank" rel="noreferrer" className="block w-full">
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Excel
          </Button>
        </a>
      </div>
    </div>
  );
}
