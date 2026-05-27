import mongoose, { Schema, Document } from "mongoose";
import { TicketCategory } from "@/types";

export interface IDepartment extends Document {
  id: string;
  name: string;
  nameHi: string;
  code: string;
  headOfficerId: string;
  categories: TicketCategory[];
  contactPhone: string;
  contactEmail: string;
  slaTargetHours: Record<string, number>;
  staffCount: number;
}

const DepartmentSchema = new Schema<IDepartment>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameHi: { type: String, required: true },
  code: { type: String, required: true },
  headOfficerId: { type: String, required: true },
  categories: [{ type: String }],
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  slaTargetHours: {
    low: { type: Number, default: 72 },
    medium: { type: Number, default: 48 },
    high: { type: Number, default: 24 },
    critical: { type: Number, default: 12 },
  },
  staffCount: { type: Number, default: 0 },
});

export const Department = mongoose.models.Department || mongoose.model<IDepartment>("Department", DepartmentSchema);
