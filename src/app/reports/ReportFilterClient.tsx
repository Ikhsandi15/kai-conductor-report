"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export function ReportFilterClient({ conductors }: { conductors: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateMode, setDateMode] = useState(searchParams.get("dateMode") || "all");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [conductorId, setConductorId] = useState(searchParams.get("conductorId") || "all");

  // Sync state if url changes
  useEffect(() => {
    setDateMode(searchParams.get("dateMode") || "all");
    setStartDate(searchParams.get("startDate") || "");
    setEndDate(searchParams.get("endDate") || "");
    setConductorId(searchParams.get("conductorId") || "all");
  }, [searchParams]);

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (dateMode && dateMode !== "all") params.set("dateMode", dateMode);
    if (dateMode === "range") {
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
    }
    if (conductorId && conductorId !== "all") params.set("conductorId", conductorId);
    router.push(`/reports?${params.toString()}`);
  };

  const clearFilter = () => {
    setDateMode("all");
    setStartDate("");
    setEndDate("");
    setConductorId("all");
    router.push(`/reports`);
  };

  const getDownloadUrl = () => {
    const params = new URLSearchParams();
    if (dateMode && dateMode !== "all") params.set("dateMode", dateMode);
    if (dateMode === "range") {
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
    }
    if (conductorId && conductorId !== "all") params.set("conductorId", conductorId);
    return `/api/export/excel?${params.toString()}`;
  };

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm flex flex-col items-start gap-4">
      <div className="flex flex-col md:flex-row items-start gap-4 w-full flex-wrap">
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
          <label className="text-xs font-semibold text-gray-500">Waktu Dinas</label>
          <Select value={dateMode} onValueChange={(val) => setDateMode(val || "all")}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Pilih Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Waktu</SelectItem>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="range">Rentang Tanggal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {dateMode === "range" && (
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-1.5 w-full md:w-40">
              <label className="text-xs font-semibold text-gray-500">Dari Tanggal</label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full md:w-40">
              <label className="text-xs font-semibold text-gray-500">Sampai Tanggal</label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-white"
                min={startDate}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 w-full md:w-auto md:pt-5">
          <Button onClick={applyFilter} className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none flex justify-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          {(dateMode !== "all" || conductorId !== "all") && (
            <Button onClick={clearFilter} variant="outline" className="flex-1 md:flex-none flex justify-center gap-2">
              <X className="w-4 h-4" /> Reset
            </Button>
          )}
        </div>
      </div>

      <div className="w-full border-t pt-4 flex justify-end">
        <a href={getDownloadUrl()} target="_blank" rel="noreferrer" className="block w-full md:w-auto">
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Excel
          </Button>
        </a>
      </div>
    </div>
  );
}
