'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [notes, setNotes] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'calendar'

  // Simple password check (set your admin password)
  const ADMIN_PASSWORD = 'assetplanly2026';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Wrong password');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/leads');
      const data = await response.json();
      if (Array.isArray(data)) {
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
    setLoading(false);
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const scheduleLead = async () => {
    if (!selectedLead || !scheduleDate || !scheduleTime) return;

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();

    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          scheduled_at: scheduledAt,
          status: 'scheduled',
          notes: notes
        })
      });
      setSelectedLead(null);
      setScheduleDate('');
      setScheduleTime('');
      setNotes('');
      fetchLeads();
    } catch (error) {
      console.error('Error scheduling lead:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Get scheduled leads for calendar
  const getScheduledLeads = () => {
    return leads.filter(l => l.scheduled_at);
  };

  // Group by date for calendar view
  const getLeadsByDate = () => {
    const scheduled = getScheduledLeads();
    const grouped = {};
    scheduled.forEach(lead => {
      const date = new Date(lead.scheduled_at).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(lead);
    });
    return grouped;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[var(--gray-200)] w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[var(--gray-900)] mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-lg mb-4 outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
            />
            <button type="submit" className="w-full btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--gray-200)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-[var(--gray-900)]">AssetPlanly Admin</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'list' ? 'bg-[var(--blue-600)] text-white' : 'bg-[var(--gray-100)] text-[var(--gray-700)]'}`}
            >
              Leads
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'calendar' ? 'bg-[var(--blue-600)] text-white' : 'bg-[var(--gray-100)] text-[var(--gray-700)]'}`}
            >
              Calendar
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('admin_auth');
                setIsAuthenticated(false);
              }}
              className="text-sm text-[var(--gray-500)] hover:text-[var(--gray-700)]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12 text-[var(--gray-500)]">Loading...</div>
        ) : view === 'list' ? (
          /* Leads List View */
          <div className="bg-white rounded-lg border border-[var(--gray-200)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--gray-200)]">
              <h2 className="font-semibold text-[var(--gray-900)]">Advisor Leads ({leads.length})</h2>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 text-center text-[var(--gray-500)]">
                No leads yet. They&apos;ll appear here when advisors book calls.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--gray-50)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-500)] uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-500)] uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-500)] uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-500)] uppercase">Leads/Mo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-500)] uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-500)] uppercase">Scheduled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-500)] uppercase">Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-500)] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--gray-200)]">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[var(--gray-50)]">
                        <td className="px-6 py-4">
                          <div className="font-medium text-[var(--gray-900)]">{lead.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-[var(--gray-900)]">{lead.email}</div>
                          <div className="text-sm text-[var(--gray-500)]">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--gray-700)]">{lead.company || '-'}</td>
                        <td className="px-6 py-4 text-sm text-[var(--gray-700)]">{lead.leads_per_month || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--gray-700)]">
                          {formatDate(lead.scheduled_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--gray-500)]">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="text-sm text-[var(--blue-600)] hover:text-[var(--blue-700)]"
                            >
                              Schedule
                            </button>
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className="text-sm border border-[var(--gray-300)] rounded px-2 py-1"
                            >
                              <option value="new">New</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-white rounded-lg border border-[var(--gray-200)] p-6">
            <h2 className="font-semibold text-[var(--gray-900)] mb-6">Scheduled Calls</h2>

            {getScheduledLeads().length === 0 ? (
              <div className="text-center py-12 text-[var(--gray-500)]">
                No calls scheduled yet.
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(getLeadsByDate())
                  .sort(([a], [b]) => new Date(a) - new Date(b))
                  .map(([date, dateLeads]) => (
                    <div key={date} className="border border-[var(--gray-200)] rounded-lg overflow-hidden">
                      <div className="bg-[var(--gray-50)] px-4 py-2 font-medium text-[var(--gray-900)]">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="divide-y divide-[var(--gray-100)]">
                        {dateLeads
                          .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
                          .map(lead => (
                            <div key={lead.id} className="px-4 py-3 flex justify-between items-center">
                              <div>
                                <span className="font-medium text-[var(--blue-600)]">
                                  {new Date(lead.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </span>
                                <span className="mx-2 text-[var(--gray-400)]">—</span>
                                <span className="text-[var(--gray-900)]">{lead.name}</span>
                                <span className="text-[var(--gray-500)] ml-2">({lead.company || 'No company'})</span>
                              </div>
                              <div className="text-sm text-[var(--gray-500)]">
                                {lead.phone}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Schedule Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">
              Schedule Call with {selectedLead.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)] resize-none"
                  placeholder="Any notes about this call..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleLead}
                  className="flex-1 btn-primary"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
