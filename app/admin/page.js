'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Advisor form state
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [advisorForm, setAdvisorForm] = useState({ name: '', email: '', phone: '', firmName: '', password: '' });
  const [editingAdvisor, setEditingAdvisor] = useState(null);

  // Assign modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningLead, setAssigningLead] = useState(null);

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
      fetchAdvisors();
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

  const fetchAdvisors = async () => {
    try {
      const response = await fetch('/api/advisors');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAdvisors(data);
      }
    } catch (error) {
      console.error('Error fetching advisors:', error);
    }
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

  const assignLeadToAdvisor = async (leadId, advisorId) => {
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, assigned_advisor_id: advisorId })
      });
      setShowAssignModal(false);
      setAssigningLead(null);
      fetchLeads();
    } catch (error) {
      console.error('Error assigning lead:', error);
    }
  };

  const scheduleLead = async () => {
    if (!selectedLead || !scheduleDate || !scheduleTime) return;
    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, scheduled_at: scheduledAt, status: 'scheduled', notes })
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

  const saveAdvisor = async () => {
    try {
      const method = editingAdvisor ? 'PATCH' : 'POST';
      const body = editingAdvisor
        ? { id: editingAdvisor.id, ...advisorForm }
        : advisorForm;

      await fetch('/api/advisors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setShowAdvisorModal(false);
      setAdvisorForm({ name: '', email: '', phone: '', firmName: '', password: '' });
      setEditingAdvisor(null);
      fetchAdvisors();
    } catch (error) {
      console.error('Error saving advisor:', error);
    }
  };

  const toggleAdvisorActive = async (advisor) => {
    try {
      await fetch('/api/advisors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: advisor.id, is_active: !advisor.is_active })
      });
      fetchAdvisors();
    } catch (error) {
      console.error('Error toggling advisor:', error);
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'ppc': return 'bg-blue-100 text-blue-800';
      case 'facebook': return 'bg-purple-100 text-purple-800';
      case 'organic': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  // Filter leads based on active tab
  const getFilteredLeads = () => {
    switch (activeTab) {
      case 'ppc': return leads.filter(l => l.source === 'ppc');
      case 'facebook': return leads.filter(l => l.source === 'facebook');
      case 'unassigned': return leads.filter(l => !l.assigned_advisor_id);
      case 'calendar': return leads.filter(l => l.scheduled_at);
      default: return leads;
    }
  };

  const getAdvisorName = (advisorId) => {
    const advisor = advisors.find(a => a.id === advisorId);
    return advisor?.name || 'Unassigned';
  };

  // Stats
  const stats = {
    total: leads.length,
    ppc: leads.filter(l => l.source === 'ppc').length,
    facebook: leads.filter(l => l.source === 'facebook').length,
    unassigned: leads.filter(l => !l.assigned_advisor_id).length,
    scheduled: leads.filter(l => l.scheduled_at).length
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
            <button type="submit" className="w-full btn-primary">Login</button>
          </form>
        </div>
      </div>
    );
  }

  const filteredLeads = getFilteredLeads();

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--gray-200)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="AssetPlanly" width={140} height={32} className="h-8 w-auto" />
            <span className="text-sm text-gray-500 font-medium">Admin</span>
          </div>
          <button
            onClick={() => { localStorage.removeItem('admin_auth'); setIsAuthenticated(false); }}
            className="text-sm text-[var(--gray-500)] hover:text-[var(--gray-700)]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-[var(--gray-200)]">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 -mb-px">
            {[
              { id: 'all', label: 'All Leads', count: stats.total },
              { id: 'ppc', label: 'PPC Inflow', count: stats.ppc },
              { id: 'facebook', label: 'Facebook Inflow', count: stats.facebook },
              { id: 'unassigned', label: 'Unassigned', count: stats.unassigned },
              { id: 'calendar', label: 'Calendar', count: stats.scheduled },
              { id: 'advisors', label: 'Advisors', count: advisors.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[var(--blue-600)] text-[var(--blue-600)]'
                    : 'border-transparent text-[var(--gray-500)] hover:text-[var(--gray-700)]'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-[var(--blue-100)] text-[var(--blue-700)]' : 'bg-[var(--gray-100)] text-[var(--gray-600)]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12 text-[var(--gray-500)]">Loading...</div>
        ) : activeTab === 'advisors' ? (
          /* Advisors Tab */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[var(--gray-900)]">Manage Advisors</h2>
              <button
                onClick={() => { setShowAdvisorModal(true); setEditingAdvisor(null); setAdvisorForm({ name: '', email: '', phone: '', firmName: '', password: '' }); }}
                className="btn-primary"
              >
                + Add Advisor
              </button>
            </div>

            {advisors.length === 0 ? (
              <div className="bg-white rounded-lg border border-[var(--gray-200)] p-12 text-center text-[var(--gray-500)]">
                No advisors yet. Add your first advisor to start round-robin distribution.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {advisors.map(advisor => (
                  <div key={advisor.id} className={`bg-white rounded-lg border p-5 ${advisor.is_active ? 'border-[var(--gray-200)]' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-[var(--gray-900)]">{advisor.name}</h3>
                        <p className="text-sm text-[var(--gray-500)]">{advisor.firm_name || 'No firm'}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${advisor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {advisor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--gray-600)] mb-4">
                      <p>{advisor.email}</p>
                      <p>{advisor.phone || '-'}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--gray-100)]">
                      <span className="text-sm text-[var(--gray-500)]">
                        {advisor.leads_assigned_count || 0} leads assigned
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingAdvisor(advisor); setAdvisorForm({ name: advisor.name, email: advisor.email, phone: advisor.phone || '', firmName: advisor.firm_name || '', password: '' }); setShowAdvisorModal(true); }}
                          className="text-sm text-[var(--blue-600)] hover:text-[var(--blue-700)]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleAdvisorActive(advisor)}
                          className={`text-sm ${advisor.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                        >
                          {advisor.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'calendar' ? (
          /* Calendar View */
          <div className="bg-white rounded-lg border border-[var(--gray-200)] p-6">
            <h2 className="font-semibold text-[var(--gray-900)] mb-6">Scheduled Calls</h2>
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-[var(--gray-500)]">No calls scheduled yet.</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(
                  filteredLeads.reduce((acc, lead) => {
                    const date = new Date(lead.scheduled_at).toLocaleDateString();
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(lead);
                    return acc;
                  }, {})
                )
                  .sort(([a], [b]) => new Date(a) - new Date(b))
                  .map(([date, dateLeads]) => (
                    <div key={date} className="border border-[var(--gray-200)] rounded-lg overflow-hidden">
                      <div className="bg-[var(--gray-50)] px-4 py-2 font-medium text-[var(--gray-900)]">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="divide-y divide-[var(--gray-100)]">
                        {dateLeads.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at)).map(lead => (
                          <div key={lead.id} className="px-4 py-3 flex justify-between items-center">
                            <div>
                              <span className="font-medium text-[var(--blue-600)]">
                                {new Date(lead.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </span>
                              <span className="mx-2 text-[var(--gray-400)]">—</span>
                              <span className="text-[var(--gray-900)]">{lead.name}</span>
                              <span className="text-[var(--gray-500)] ml-2">({lead.company || 'No company'})</span>
                            </div>
                            <div className="text-sm text-[var(--gray-500)]">{lead.phone}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          /* Lead Cards View */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[var(--gray-900)]">
                {activeTab === 'all' && 'All Leads'}
                {activeTab === 'ppc' && 'PPC Inflow'}
                {activeTab === 'facebook' && 'Facebook Inflow'}
                {activeTab === 'unassigned' && 'Unassigned Leads'}
              </h2>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="bg-white rounded-lg border border-[var(--gray-200)] p-12 text-center text-[var(--gray-500)]">
                No leads in this category yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.map(lead => (
                  <div key={lead.id} className="bg-white rounded-lg border border-[var(--gray-200)] p-5 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-[var(--gray-900)]">{lead.name}</h3>
                        <p className="text-sm text-[var(--gray-500)]">{lead.company || 'No company'}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSourceColor(lead.source)}`}>
                          {lead.source || 'direct'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="text-sm text-[var(--gray-600)] mb-4 space-y-1">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {lead.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {lead.phone}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="text-xs text-[var(--gray-500)] mb-4 space-y-1">
                      <p>Leads wanted: {lead.leads_per_month || '-'}/mo</p>
                      <p>Assigned to: {getAdvisorName(lead.assigned_advisor_id)}</p>
                      {lead.scheduled_at && (
                        <p className="text-[var(--blue-600)]">Scheduled: {formatDate(lead.scheduled_at)}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-[var(--gray-100)]">
                      <button
                        onClick={() => { setAssigningLead(lead); setShowAssignModal(true); }}
                        className="flex-1 text-sm px-3 py-2 bg-[var(--gray-100)] text-[var(--gray-700)] rounded-lg hover:bg-[var(--gray-200)] transition"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="flex-1 text-sm px-3 py-2 bg-[var(--blue-600)] text-white rounded-lg hover:bg-[var(--blue-700)] transition"
                      >
                        Schedule
                      </button>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="text-sm border border-[var(--gray-300)] rounded-lg px-2 py-1"
                      >
                        <option value="new">New</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
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
                <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Time</label>
                <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)] resize-none"
                  placeholder="Any notes about this call..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelectedLead(null)} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={scheduleLead} className="flex-1 btn-primary">Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advisor Modal */}
      {showAdvisorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">
              {editingAdvisor ? 'Edit Advisor' : 'Add New Advisor'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Name *</label>
                <input type="text" value={advisorForm.name} onChange={(e) => setAdvisorForm({...advisorForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Email *</label>
                <input type="email" value={advisorForm.email} onChange={(e) => setAdvisorForm({...advisorForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Phone</label>
                <input type="tel" value={advisorForm.phone} onChange={(e) => setAdvisorForm({...advisorForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Firm Name</label>
                <input type="text" value={advisorForm.firmName} onChange={(e) => setAdvisorForm({...advisorForm, firmName: e.target.value})}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                  Password {editingAdvisor ? '(leave blank to keep current)' : '*'}
                </label>
                <input type="password" value={advisorForm.password} onChange={(e) => setAdvisorForm({...advisorForm, password: e.target.value})}
                  className="w-full px-4 py-2 border border-[var(--gray-300)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--blue-500)]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAdvisorModal(false); setEditingAdvisor(null); }} className="flex-1 btn-secondary">Cancel</button>
                <button onClick={saveAdvisor} className="flex-1 btn-primary">
                  {editingAdvisor ? 'Save Changes' : 'Add Advisor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && assigningLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">
              Assign Lead: {assigningLead.name}
            </h3>
            {advisors.length === 0 ? (
              <p className="text-[var(--gray-500)] mb-4">No advisors available. Add an advisor first.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {advisors.filter(a => a.is_active).map(advisor => (
                  <button
                    key={advisor.id}
                    onClick={() => assignLeadToAdvisor(assigningLead.id, advisor.id)}
                    className={`w-full p-3 text-left border rounded-lg transition ${
                      assigningLead.assigned_advisor_id === advisor.id
                        ? 'border-[var(--blue-600)] bg-[var(--blue-50)]'
                        : 'border-[var(--gray-200)] hover:border-[var(--blue-600)]'
                    }`}
                  >
                    <div className="font-medium text-[var(--gray-900)]">{advisor.name}</div>
                    <div className="text-sm text-[var(--gray-500)]">{advisor.leads_assigned_count || 0} leads assigned</div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => { setShowAssignModal(false); setAssigningLead(null); }} className="w-full btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
