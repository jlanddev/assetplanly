'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdvisorDashboard() {
  const router = useRouter();
  const [advisor, setAdvisor] = useState(null);
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('leads');
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    qualified: 'all',
    campaign: 'all',
    search: ''
  });

  // Campaign form
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ name: '', description: '', budget: '' });
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('advisor_session');
    if (!session) {
      router.push('/advisor');
      return;
    }
    setAdvisor(JSON.parse(session));
  }, [router]);

  useEffect(() => {
    if (advisor) {
      fetchLeads();
      fetchCampaigns();
    }
  }, [advisor]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/advisors/leads?advisorId=${advisor.id}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
    setLoading(false);
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`/api/advisors/campaigns?advisorId=${advisor.id}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const updateLead = async (leadId, updates) => {
    try {
      await fetch('/api/advisors/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, advisorId: advisor.id, ...updates })
      });
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const addNote = async () => {
    if (!noteText.trim() || !selectedLead) return;
    setSavingNote(true);
    try {
      const currentNotes = selectedLead.advisor_notes || [];
      const newNote = {
        id: Date.now(),
        text: noteText,
        created_at: new Date().toISOString(),
        author: advisor.name
      };
      await updateLead(selectedLead.id, {
        advisor_notes: [...currentNotes, newNote]
      });
      setNoteText('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
    setSavingNote(false);
  };

  const saveCampaign = async () => {
    try {
      const method = editingCampaign ? 'PATCH' : 'POST';
      const body = editingCampaign
        ? { id: editingCampaign.id, advisorId: advisor.id, ...campaignForm }
        : { advisorId: advisor.id, ...campaignForm };

      await fetch('/api/advisors/campaigns', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      setShowCampaignModal(false);
      setCampaignForm({ name: '', description: '', budget: '' });
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('advisor_session');
    router.push('/advisor');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  // Filter leads
  const getFilteredLeads = () => {
    return leads.filter(lead => {
      if (filters.status !== 'all' && lead.status !== filters.status) return false;
      if (filters.qualified === 'qualified' && lead.is_qualified !== true) return false;
      if (filters.qualified === 'not_qualified' && lead.is_qualified !== false) return false;
      if (filters.qualified === 'pending' && lead.is_qualified !== null) return false;
      if (filters.campaign !== 'all' && lead.campaign_id !== filters.campaign) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          lead.name?.toLowerCase().includes(search) ||
          lead.email?.toLowerCase().includes(search) ||
          lead.company?.toLowerCase().includes(search) ||
          lead.phone?.includes(search)
        );
      }
      return true;
    });
  };

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.is_qualified === true).length,
    notQualified: leads.filter(l => l.is_qualified === false).length,
    pending: leads.filter(l => l.is_qualified === null || l.is_qualified === undefined).length
  };

  if (!advisor) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredLeads = getFilteredLeads();

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col">
        <div className="p-5 border-b border-[#334155]">
          <Link href="/">
            <Image src="/logo.png" alt="AssetPlanly" width={140} height={32} className="h-8 w-auto brightness-0 invert" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveView('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              activeView === 'leads'
                ? 'bg-blue-600 text-white'
                : 'text-[#94a3b8] hover:bg-[#334155] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Leads
          </button>

          <button
            onClick={() => setActiveView('campaigns')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              activeView === 'campaigns'
                ? 'bg-blue-600 text-white'
                : 'text-[#94a3b8] hover:bg-[#334155] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Campaigns
          </button>

          <button
            onClick={() => setActiveView('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              activeView === 'stats'
                ? 'bg-blue-600 text-white'
                : 'text-[#94a3b8] hover:bg-[#334155] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
        </nav>

        <div className="p-4 border-t border-[#334155]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {advisor.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{advisor.name}</div>
              <div className="text-[#64748b] text-sm truncate">{advisor.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-[#64748b] hover:text-white py-2 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#1e293b] border-b border-[#334155] px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {activeView === 'leads' && 'Lead Management'}
                {activeView === 'campaigns' && 'Campaigns'}
                {activeView === 'stats' && 'Analytics'}
              </h1>
              <p className="text-[#64748b] text-sm mt-1">
                {activeView === 'leads' && `${filteredLeads.length} leads`}
                {activeView === 'campaigns' && `${campaigns.length} campaigns`}
                {activeView === 'stats' && 'Performance overview'}
              </p>
            </div>

            {activeView === 'leads' && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-5 h-5 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="bg-[#0f172a] border border-[#334155] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 w-64"
                  />
                </div>
              </div>
            )}

            {activeView === 'campaigns' && (
              <button
                onClick={() => { setShowCampaignModal(true); setEditingCampaign(null); setCampaignForm({ name: '', description: '', budget: '' }); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Campaign
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : activeView === 'leads' ? (
            <div className="flex gap-6">
              {/* Leads List */}
              <div className={`${selectedLead ? 'w-1/2' : 'w-full'} transition-all`}>
                {/* Filters */}
                <div className="bg-[#1e293b] rounded-xl p-4 mb-6 flex flex-wrap gap-3">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="closed">Closed</option>
                  </select>

                  <select
                    value={filters.qualified}
                    onChange={(e) => setFilters({ ...filters, qualified: e.target.value })}
                    className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Qualification</option>
                    <option value="qualified">Qualified</option>
                    <option value="not_qualified">Not Qualified</option>
                    <option value="pending">Pending Review</option>
                  </select>

                  <select
                    value={filters.campaign}
                    onChange={(e) => setFilters({ ...filters, campaign: e.target.value })}
                    className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Campaigns</option>
                    {campaigns.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  {(filters.status !== 'all' || filters.qualified !== 'all' || filters.campaign !== 'all' || filters.search) && (
                    <button
                      onClick={() => setFilters({ status: 'all', qualified: 'all', campaign: 'all', search: '' })}
                      className="text-[#64748b] hover:text-white px-3 py-2 transition"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#1e293b] rounded-xl p-4">
                    <div className="text-[#64748b] text-sm">Total Leads</div>
                    <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
                  </div>
                  <div className="bg-[#1e293b] rounded-xl p-4">
                    <div className="text-[#64748b] text-sm">Qualified</div>
                    <div className="text-2xl font-bold text-green-400 mt-1">{stats.qualified}</div>
                  </div>
                  <div className="bg-[#1e293b] rounded-xl p-4">
                    <div className="text-[#64748b] text-sm">Pending Review</div>
                    <div className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</div>
                  </div>
                </div>

                {/* Leads Table */}
                {filteredLeads.length === 0 ? (
                  <div className="bg-[#1e293b] rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-[#64748b]">No leads match your filters</p>
                  </div>
                ) : (
                  <div className="bg-[#1e293b] rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#334155]">
                          <th className="text-left text-[#64748b] text-sm font-medium px-4 py-3">Lead</th>
                          <th className="text-left text-[#64748b] text-sm font-medium px-4 py-3">Status</th>
                          <th className="text-left text-[#64748b] text-sm font-medium px-4 py-3">Qualified</th>
                          <th className="text-left text-[#64748b] text-sm font-medium px-4 py-3">Date</th>
                          <th className="text-left text-[#64748b] text-sm font-medium px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map(lead => (
                          <tr
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className={`border-b border-[#334155] cursor-pointer transition ${
                              selectedLead?.id === lead.id
                                ? 'bg-blue-600/20'
                                : 'hover:bg-[#334155]/50'
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="font-medium text-white">{lead.name}</div>
                              <div className="text-[#64748b] text-sm">{lead.email}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                                lead.status === 'scheduled' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {lead.is_qualified === true && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                                  Qualified
                                </span>
                              )}
                              {lead.is_qualified === false && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                                  Not Qualified
                                </span>
                              )}
                              {(lead.is_qualified === null || lead.is_qualified === undefined) && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-500/20 text-gray-400">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-[#94a3b8] text-sm">
                              {formatDate(lead.created_at)}
                            </td>
                            <td className="px-4 py-3">
                              <svg className="w-5 h-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Lead Detail Panel */}
              {selectedLead && (
                <div className="w-1/2 bg-[#1e293b] rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-[#334155] flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedLead.name}</h2>
                      <p className="text-[#64748b]">{selectedLead.company || 'No company'}</p>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="text-[#64748b] hover:text-white p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto">
                    {/* Contact Info */}
                    <div>
                      <h3 className="text-sm font-medium text-[#64748b] mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-3 text-white hover:text-blue-400 transition">
                          <svg className="w-5 h-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {selectedLead.email}
                        </a>
                        <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-3 text-white hover:text-blue-400 transition">
                          <svg className="w-5 h-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {selectedLead.phone}
                        </a>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition text-center"
                      >
                        Call Now
                      </a>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="flex-1 bg-[#334155] hover:bg-[#475569] text-white px-4 py-2.5 rounded-lg font-medium transition text-center"
                      >
                        Send Email
                      </a>
                    </div>

                    {/* Status & Qualification */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#64748b] mb-2">Status</label>
                        <select
                          value={selectedLead.status}
                          onChange={(e) => updateLead(selectedLead.id, { status: e.target.value })}
                          className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#64748b] mb-2">Qualification</label>
                        <select
                          value={selectedLead.is_qualified === true ? 'qualified' : selectedLead.is_qualified === false ? 'not_qualified' : 'pending'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateLead(selectedLead.id, {
                              is_qualified: val === 'qualified' ? true : val === 'not_qualified' ? false : null
                            });
                          }}
                          className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="pending">Pending Review</option>
                          <option value="qualified">Qualified</option>
                          <option value="not_qualified">Not Qualified</option>
                        </select>
                      </div>
                    </div>

                    {/* Lead Details */}
                    <div>
                      <h3 className="text-sm font-medium text-[#64748b] mb-3">Lead Details</h3>
                      <div className="bg-[#0f172a] rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Leads wanted</span>
                          <span className="text-white">{selectedLead.leads_per_month || '-'}/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Source</span>
                          <span className="text-white capitalize">{selectedLead.source || 'Direct'}</span>
                        </div>
                        {selectedLead.scheduled_at && (
                          <div className="flex justify-between">
                            <span className="text-[#64748b]">Scheduled</span>
                            <span className="text-blue-400">{formatDateTime(selectedLead.scheduled_at)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Received</span>
                          <span className="text-white">{formatDateTime(selectedLead.created_at)}</span>
                        </div>
                        {selectedLead.notes && (
                          <div className="pt-2 border-t border-[#334155]">
                            <span className="text-[#64748b] text-sm">Initial notes:</span>
                            <p className="text-white mt-1">{selectedLead.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div>
                      <h3 className="text-sm font-medium text-[#64748b] mb-3">Notes</h3>
                      <div className="space-y-3 mb-4">
                        {(!selectedLead.advisor_notes || selectedLead.advisor_notes.length === 0) ? (
                          <p className="text-[#64748b] text-sm">No notes yet</p>
                        ) : (
                          selectedLead.advisor_notes.map((note, idx) => (
                            <div key={note.id || idx} className="bg-[#0f172a] rounded-lg p-3">
                              <p className="text-white text-sm">{note.text}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-[#64748b] text-xs">{note.author}</span>
                                <span className="text-[#64748b] text-xs">{formatDateTime(note.created_at)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500"
                          onKeyDown={(e) => e.key === 'Enter' && addNote()}
                        />
                        <button
                          onClick={addNote}
                          disabled={!noteText.trim() || savingNote}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          {savingNote ? '...' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeView === 'campaigns' ? (
            /* Campaigns View */
            <div>
              {campaigns.length === 0 ? (
                <div className="bg-[#1e293b] rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-2">No campaigns yet</h3>
                  <p className="text-[#64748b] mb-4">Create your first campaign to start tracking lead sources</p>
                  <button
                    onClick={() => setShowCampaignModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    Create Campaign
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {campaigns.map(campaign => {
                    const campaignLeads = leads.filter(l => l.campaign_id === campaign.id);
                    const qualified = campaignLeads.filter(l => l.is_qualified === true).length;
                    return (
                      <div key={campaign.id} className="bg-[#1e293b] rounded-xl p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-white">{campaign.name}</h3>
                            <p className="text-[#64748b] text-sm mt-1">{campaign.description || 'No description'}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            campaign.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {campaign.is_active ? 'Active' : 'Paused'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">{campaignLeads.length}</div>
                            <div className="text-[#64748b] text-xs">Leads</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-green-400">{qualified}</div>
                            <div className="text-[#64748b] text-xs">Qualified</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">
                              {campaignLeads.length > 0 ? Math.round((qualified / campaignLeads.length) * 100) : 0}%
                            </div>
                            <div className="text-[#64748b] text-xs">Rate</div>
                          </div>
                        </div>

                        {campaign.budget && (
                          <div className="text-sm text-[#64748b] mb-4">
                            Budget: ${parseFloat(campaign.budget).toLocaleString()}
                          </div>
                        )}

                        <div className="flex gap-2 pt-3 border-t border-[#334155]">
                          <button
                            onClick={() => {
                              setFilters({ ...filters, campaign: campaign.id });
                              setActiveView('leads');
                            }}
                            className="flex-1 text-sm px-3 py-2 bg-[#334155] text-white rounded-lg hover:bg-[#475569] transition"
                          >
                            View Leads
                          </button>
                          <button
                            onClick={() => {
                              setEditingCampaign(campaign);
                              setCampaignForm({
                                name: campaign.name,
                                description: campaign.description || '',
                                budget: campaign.budget || ''
                              });
                              setShowCampaignModal(true);
                            }}
                            className="text-sm px-3 py-2 text-[#64748b] hover:text-white transition"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Analytics View */
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#1e293b] rounded-xl p-5">
                  <div className="text-[#64748b] text-sm">Total Leads</div>
                  <div className="text-3xl font-bold text-white mt-2">{stats.total}</div>
                </div>
                <div className="bg-[#1e293b] rounded-xl p-5">
                  <div className="text-[#64748b] text-sm">Qualified</div>
                  <div className="text-3xl font-bold text-green-400 mt-2">{stats.qualified}</div>
                  <div className="text-[#64748b] text-sm mt-1">
                    {stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0}% rate
                  </div>
                </div>
                <div className="bg-[#1e293b] rounded-xl p-5">
                  <div className="text-[#64748b] text-sm">Not Qualified</div>
                  <div className="text-3xl font-bold text-red-400 mt-2">{stats.notQualified}</div>
                </div>
                <div className="bg-[#1e293b] rounded-xl p-5">
                  <div className="text-[#64748b] text-sm">Pending Review</div>
                  <div className="text-3xl font-bold text-yellow-400 mt-2">{stats.pending}</div>
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Lead Status Breakdown</h3>
                <div className="space-y-3">
                  {['new', 'contacted', 'scheduled', 'closed'].map(status => {
                    const count = leads.filter(l => l.status === status).length;
                    const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center gap-4">
                        <div className="w-24 text-[#94a3b8] capitalize">{status}</div>
                        <div className="flex-1 bg-[#0f172a] rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              status === 'new' ? 'bg-blue-500' :
                              status === 'contacted' ? 'bg-yellow-500' :
                              status === 'scheduled' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="w-12 text-right text-white">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {campaigns.length > 0 && (
                <div className="bg-[#1e293b] rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Campaign Performance</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#334155]">
                        <th className="text-left text-[#64748b] text-sm font-medium pb-3">Campaign</th>
                        <th className="text-right text-[#64748b] text-sm font-medium pb-3">Leads</th>
                        <th className="text-right text-[#64748b] text-sm font-medium pb-3">Qualified</th>
                        <th className="text-right text-[#64748b] text-sm font-medium pb-3">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(campaign => {
                        const campaignLeads = leads.filter(l => l.campaign_id === campaign.id);
                        const qualified = campaignLeads.filter(l => l.is_qualified === true).length;
                        return (
                          <tr key={campaign.id} className="border-b border-[#334155]">
                            <td className="py-3 text-white">{campaign.name}</td>
                            <td className="py-3 text-right text-white">{campaignLeads.length}</td>
                            <td className="py-3 text-right text-green-400">{qualified}</td>
                            <td className="py-3 text-right text-white">
                              {campaignLeads.length > 0 ? Math.round((qualified / campaignLeads.length) * 100) : 0}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="bg-[#1e293b] rounded-xl p-6 w-full max-w-md border border-[#334155]">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  placeholder="e.g., Facebook Ads Q1"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">Description</label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  placeholder="Campaign details..."
                  rows={3}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">Budget</label>
                <input
                  type="number"
                  value={campaignForm.budget}
                  onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                  placeholder="5000"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowCampaignModal(false); setEditingCampaign(null); }}
                  className="flex-1 bg-[#334155] hover:bg-[#475569] text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCampaign}
                  disabled={!campaignForm.name}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  {editingCampaign ? 'Save Changes' : 'Create Campaign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
