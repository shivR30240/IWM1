'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Phone, Play, Ticket, Search, Filter } from 'lucide-react';
import { CallLog } from '@/types';
import Link from 'next/link';

export default function CallLogsPage() {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchCallLogs();
  }, [page, statusFilter]);

  const fetchCallLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
      });
      
      if (statusFilter) {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/call/logs?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setLogs(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: CallLog['status']) => {
    const colors = {
      received: 'bg-gray-100 text-gray-700',
      recording: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold flex items-center gap-2">
            <Phone className="h-6 w-6 text-[var(--color-primary)]" /> Call Logs
          </h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            View and manage all incoming voice calls
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            <span className="text-sm font-medium">Filter by status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </Card>

      {/* Call Logs Table */}
      <Card>
        <CardTitle>Recent Calls</CardTitle>
        
        {loading ? (
          <div className="py-12 text-center">Loading call logs...</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-muted-foreground)]">
            No call logs found
          </div>
        ) : (
          <>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Date & Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">From</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Ticket ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-[var(--color-border)] hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{formatDate(log.createdAt)}</td>
                      <td className="py-3 px-4 text-sm font-mono">{log.from}</td>
                      <td className="py-3 px-4 text-sm">{formatDuration(log.duration)}</td>
                      <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                      <td className="py-3 px-4">
                        {log.ticketId ? (
                          <Link
                            href={`/dashboard/tickets/${log.ticketId}`}
                            className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1"
                          >
                            <Ticket className="h-3 w-3" />
                            {log.ticketId}
                          </Link>
                        ) : (
                          <span className="text-sm text-[var(--color-muted-foreground)]">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg hover:bg-gray-100"
                            title="Play Recording"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          {log.transcript && (
                            <button
                              className="px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
                              title="View Transcript"
                            >
                              View Transcript
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between px-4 py-3">
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Showing page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
