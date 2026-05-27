'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Phone, Ticket, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { CallStats } from '@/types';

export default function CallStatsPage() {
  const [stats, setStats] = useState<CallStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCallStats = async () => {
    try {
      const response = await fetch('/api/call/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching call stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCallStats();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-12">Loading call statistics...</div>;
  }

  if (!stats) {
    return <div className="flex items-center justify-center p-12">Failed to load statistics</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-hind)] text-2xl font-bold flex items-center gap-2">
          <Phone className="h-6 w-6 text-[var(--color-primary)]" /> Call Statistics & Analytics
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">
          Monitor voice call performance and ticket conversions
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Total Calls</p>
              <p className="text-3xl font-bold mt-2">{stats.totalCalls}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Tickets Created</p>
              <p className="text-3xl font-bold mt-2">{stats.totalTicketsCreated}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Ticket className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Success Rate</p>
              <p className="text-3xl font-bold mt-2">{stats.conversionRate.toFixed(1)}%</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Avg Duration</p>
              <p className="text-3xl font-bold mt-2">{Math.round(stats.avgCallDuration)}s</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Failed Calls */}
      <Card>
        <CardTitle>Call Conversion Summary</CardTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Successful Conversions</p>
              <p className="text-2xl font-bold text-green-700">{stats.successfulConversions}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium">Failed Conversions</p>
              <p className="text-2xl font-bold text-red-700">{stats.failedConversions}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Calls by Category */}
      <Card>
        <CardTitle>Calls by Complaint Category</CardTitle>
        <div className="mt-4 space-y-3">
          {Object.entries(stats.callsByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => (
              <div key={category} className="flex items-center gap-4">
                <div className="w-40 text-sm font-medium capitalize">
                  {category.replace('_', ' ')}
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                      style={{
                        width: `${(count / stats.totalCalls) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-bold">{count}</div>
              </div>
            ))}
        </div>
      </Card>

      {/* Calls by Ward */}
      <Card>
        <CardTitle>Calls by Ward</CardTitle>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(stats.callsByWard)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12)
            .map(([ward, count]) => (
              <div key={ward} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium">{ward}</span>
                <span className="text-sm font-bold text-[var(--color-primary)]">{count}</span>
              </div>
            ))}
        </div>
      </Card>

      {/* 30-Day Trend */}
      <Card>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" /> 30-Day Call Trend
        </CardTitle>
        <div className="mt-4">
          <div className="flex items-end gap-1 h-40">
            {stats.callsByDate.map((day, index) => {
              const maxCalls = Math.max(...stats.callsByDate.map(d => d.calls));
              const height = (day.calls / maxCalls) * 100;
              
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1"
                  title={`${day.date}: ${day.calls} calls, ${day.tickets} tickets`}
                >
                  <div
                    className="w-full bg-[var(--color-primary)] rounded-t transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  {index % 5 === 0 && (
                    <span className="text-xs text-[var(--color-muted-foreground)] rotate-45 origin-top-left">
                      {new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-xs text-[var(--color-muted-foreground)]">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
