import { format, formatDistanceToNow } from "date-fns";

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "dd MMM yyyy");
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
}

export function formatTimeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function hoursFromNow(date: Date): number {
  return Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60));
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
