"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const TicketMap = dynamic(() => import("@/components/maps/TicketMap"), { ssr: false, loading: () => <div className="h-[600px] animate-pulse rounded-lg bg-gray-200" /> });

export default function MapPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold flex items-center gap-2">
        <MapPin className="h-6 w-6 text-[var(--color-primary)]" /> Ticket Map
      </h1>
      <Card padding={false} className="overflow-hidden">
        <div className="h-[600px]">
          <TicketMap />
        </div>
      </Card>
    </div>
  );
}
