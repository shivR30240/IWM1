// === Enums & Literals ===

export type TicketStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory =
  | 'water_supply' | 'drainage' | 'roads' | 'electricity'
  | 'sanitation' | 'garbage_collection' | 'street_lights'
  | 'parks' | 'building_permits' | 'other';
export type TicketSource = 'voice_call' | 'web_portal' | 'whatsapp';
export type UserRole = 'super_admin' | 'department_head' | 'officer' | 'field_staff';

// === Core Models ===

export interface StatusChange {
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus;
  changedBy: string;
  changedAt: string;
  note: string;
}

export interface CitizenFeedback {
  ticketId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  commentHi: string;
  submittedAt: string;
}

export interface Ticket {
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
  statusHistory: StatusChange[];
  attachments: string[];
  feedback: CitizenFeedback | null;
}

export interface User {
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

export interface Department {
  id: string;
  name: string;
  nameHi: string;
  code: string;
  headOfficerId: string;
  categories: TicketCategory[];
  contactPhone: string;
  contactEmail: string;
  slaTargetHours: Record<TicketPriority, number>;
  staffCount: number;
}

// === API Types ===

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
  expiresAt: string;
}

export interface DecodedToken {
  userId: string;
  role: UserRole;
  departmentId: string | null;
  name: string;
  iat: number;
  exp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string };
}

export interface TicketFilterParams {
  status?: string;
  category?: string;
  priority?: string;
  departmentId?: string;
  wardNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  assignedTo?: string;
  slaBreached?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: string;
  pageSize?: string;
}

// === Stats Types ===

export interface OverviewStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  escalatedTickets: number;
  avgResolutionHours: number;
  slaCompliancePercent: number;
  citizenSatisfactionAvg: number;
  ticketsByCategory: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  ticketsByPriority: Record<string, number>;
}

export interface TrendPoint {
  date: string;
  created: number;
  resolved: number;
  escalated: number;
}

export interface HeatmapEntry {
  latitude: number;
  longitude: number;
  wardNumber: number;
  wardName: string;
  ticketCount: number;
  dominantCategory: string;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionHours: number;
  slaCompliancePercent: number;
}

// === Call Automation Types ===

export interface CallLog {
  id: string;
  callSid: string;
  recordingSid: string;
  recordingUrl: string;
  from: string;
  to: string;
  duration: number; // in seconds
  status: 'received' | 'recording' | 'processing' | 'completed' | 'failed';
  transcript: string | null;
  ticketId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CallStats {
  totalCalls: number;
  successfulConversions: number;
  failedConversions: number;
  conversionRate: number;
  avgCallDuration: number;
  totalTicketsCreated: number;
  callsByDate: Array<{
    date: string;
    calls: number;
    tickets: number;
  }>;
  callsByCategory: Record<string, number>;
  callsByWard: Record<string, number>;
}

export interface IVRConfig {
  greetingMessage: string;
  greetingMessageHi: string;
  languages: string[];
  maxRecordingDuration: number;
  speechTimeout: number;
  fallbackMessage: string;
  fallbackMessageHi: string;
  isActive: boolean;
  businessHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
}

export interface CallTicketMetadata {
  callSid: string;
  recordingSid: string;
  recordingUrl: string;
  transcript: string;
  processedAt: string;
}
