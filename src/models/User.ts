import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "@/types";

export interface IUser extends Document {
  id: string;
  name: string;
  nameHi: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  departmentId: string | null;
  wardAssignments: number[];
  isActive: boolean;
  avatar: string;
  createdAt: string;
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameHi: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  departmentId: { type: String, default: null },
  wardAssignments: [{ type: Number }],
  isActive: { type: Boolean, default: true },
  avatar: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
