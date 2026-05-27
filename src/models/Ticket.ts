import mongoose, { Schema, Document } from "mongoose";
import { TicketCategory, TicketStatus, TicketPriority, TicketSource } from "@/types";

export interface IStatusHistory {
  fromStatus: string | null;
  toStatus: string;
  changedBy: string;
  changedAt: string;
  note: string;
}

export interface IFeedback {
  ticketId: string;
  rating: number;
  comment: string;
  commentHi: string;
  submittedAt: string;
}

const StatusHistorySchema = new Schema({
  fromStatus: { type: String, default: null },
  toStatus: { type: String, required: true },
  changedBy: { type: String, required: true },
  changedAt: { type: String, required: true },
  note: { type: String, required: true },
}, { _id: false });

const FeedbackSchema = new Schema({
  ticketId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  commentHi: { type: String, required: true },
  submittedAt: { type: String, required: true },
}, { _id: false });

export interface ITicket extends Document {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  source: TicketSource;
  citizenName: string;
  citizenPhone: string;
  wardNumber: number;
  wardName: string;
  address: string;
  latitude: number;
  longitude: number;
  departmentId: string;
  assignedOfficerId: string | null;
  assignedFieldStaffId: string | null;
  slaTargetHours: number;
  slaBreached: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  escalatedAt: string | null;
  statusHistory: IStatusHistory[];
  attachments: string[];
  feedback: IFeedback | null;
  callMetadata?: {
    callSid: string;
    recordingSid: string;
    recordingUrl: string;
    transcript: string;
    processedAt: string;
  };
}

const TicketSchema = new Schema<ITicket>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  titleHi: { type: String, required: true },
  description: { type: String, required: true },
  descriptionHi: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  source: { type: String, required: true },
  citizenName: { type: String, required: true },
  citizenPhone: { type: String, required: true },
  wardNumber: { type: Number, required: true },
  wardName: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  departmentId: { type: String, required: true },
  assignedOfficerId: { type: String, default: null },
  assignedFieldStaffId: { type: String, default: null },
  slaTargetHours: { type: Number, default: 48 },
  slaBreached: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  resolvedAt: { type: String, default: null },
  closedAt: { type: String, default: null },
  escalatedAt: { type: String, default: null },
  statusHistory: [StatusHistorySchema],
  attachments: [{ type: String }],
  feedback: { type: FeedbackSchema, default: null },
  callMetadata: {
    callSid: { type: String },
    recordingSid: { type: String },
    recordingUrl: { type: String },
    transcript: { type: String },
    processedAt: { type: String },
  },
});

export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
