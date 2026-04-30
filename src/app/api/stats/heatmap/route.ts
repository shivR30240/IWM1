import { getTicketsArray } from "@/lib/mock-data/store";
import { successResponse } from "@/lib/api-helpers/response";
import { INDORE_LOCATIONS } from "@/lib/mock-data/constants/indore-locations";

export async function GET() {
  const tickets = getTicketsArray();
  const wardMap: Record<number, { count: number; categories: Record<string, number> }> = {};

  for (const t of tickets) {
    if (!wardMap[t.wardNumber]) {
      wardMap[t.wardNumber] = { count: 0, categories: {} };
    }
    wardMap[t.wardNumber].count++;
    wardMap[t.wardNumber].categories[t.category] = (wardMap[t.wardNumber].categories[t.category] || 0) + 1;
  }

  const heatmapData = Object.entries(wardMap).map(([ward, data]) => {
    const loc = INDORE_LOCATIONS.find(l => l.wardNumber === Number(ward));
    const dominantCategory = Object.entries(data.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "other";

    return {
      latitude: loc?.latitude || 22.7196,
      longitude: loc?.longitude || 75.8577,
      wardNumber: Number(ward),
      wardName: loc?.wardName || `Ward ${ward}`,
      ticketCount: data.count,
      dominantCategory,
    };
  });

  return successResponse(heatmapData);
}
