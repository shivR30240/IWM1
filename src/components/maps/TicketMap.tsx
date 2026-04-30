"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Ticket } from "@/types";
import { Badge, getStatusVariant, getPriorityVariant } from "@/components/ui/Badge";
import Link from "next/link";

// Fix Leaflet default marker icon
const defaultIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="width:24px;height:24px;background:#004d7a;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const priorityColors: Record<string, string> = {
  critical: "#e15759",
  high: "#ff9800",
  medium: "#f28e2b",
  low: "#2e7d32",
};

function getMarkerIcon(priority: string) {
  const color = priorityColors[priority] || "#004d7a";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:20px;height:20px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function TicketMap() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetch("/api/tickets?pageSize=100")
      .then(r => r.json())
      .then(data => { if (data.success) setTickets(data.data); });
  }, []);

  return (
    <MapContainer
      center={[22.7196, 75.8577]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {tickets.map(ticket => (
        <Marker
          key={ticket.id}
          position={[ticket.latitude, ticket.longitude]}
          icon={getMarkerIcon(ticket.priority)}
        >
          <Popup>
            <div className="min-w-[200px]">
              <p className="font-bold text-sm">{ticket.id}</p>
              <p className="text-xs capitalize mt-1">{ticket.category.replace(/_/g, " ")}</p>
              <p className="text-xs text-gray-600 mt-1">{ticket.wardName}</p>
              <div className="mt-2 flex gap-1">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ticket.priority === "critical" || ticket.priority === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {ticket.priority}
                </span>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {ticket.status.replace(/_/g, " ")}
                </span>
              </div>
              <a href={`/dashboard/department/tickets/${ticket.id}`} className="text-xs text-blue-600 hover:underline mt-2 block">
                View Details →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
