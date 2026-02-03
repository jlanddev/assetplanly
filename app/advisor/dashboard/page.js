'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdvisorDashboard() {
  const router = useRouter();
  const [advisor, setAdvisor] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('calendar');
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState({
    workingHours: { start: '09:00', end: '17:00' },
    workingDays: [1, 2, 3, 4, 5], // Mon-Fri
    blockedSlots: [] // Array of { date: '2024-01-15', slots: ['09:00', '10:00'] }
  });
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);

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
    const parsed = JSON.parse(session);
    setAdvisor(parsed);
    setIsAdminView(parsed.isAdminImpersonation === true);
  }, [router]);

  useEffect(() => {
    if (advisor) {
      fetchLeads();
      fetchCampaigns();
      fetchAvailability();
    }
  }, [advisor]);

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`/api/advisors/availability?advisorId=${advisor.id}`);
      const data = await response.json();
      if (data && !data.error) {
        setAvailability({
          workingHours: data.working_hours || { start: '09:00', end: '17:00' },
          workingDays: data.working_days || [1, 2, 3, 4, 5],
          blockedSlots: data.blocked_slots || []
        });
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const saveAvailability = async () => {
    setSavingAvailability(true);
    try {
      await fetch('/api/advisors/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advisorId: advisor.id,
          working_hours: availability.workingHours,
          working_days: availability.workingDays,
          blocked_slots: availability.blockedSlots
        })
      });
      setShowAvailabilityModal(false);
    } catch (error) {
      console.error('Error saving availability:', error);
    }
    setSavingAvailability(false);
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return leads.filter(lead => {
      if (!lead.scheduled_at) return false;
      const leadDate = new Date(lead.scheduled_at).toISOString().split('T')[0];
      return leadDate === dateStr;
    }).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  };

  const getTodayAppointments = () => {
    const today = new Date();
    return getAppointmentsForDate(today);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasAppointments = (date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleBlockedSlot = (date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    setAvailability(prev => {
      const existing = prev.blockedSlots.find(s => s.date === dateStr);
      if (existing) {
        if (existing.slots.includes(time)) {
          // Remove the slot
          const newSlots = existing.slots.filter(s => s !== time);
          if (newSlots.length === 0) {
            return {
              ...prev,
              blockedSlots: prev.blockedSlots.filter(s => s.date !== dateStr)
            };
          }
          return {
            ...prev,
            blockedSlots: prev.blockedSlots.map(s =>
              s.date === dateStr ? { ...s, slots: newSlots } : s
            )
          };
        } else {
          // Add the slot
          return {
            ...prev,
            blockedSlots: prev.blockedSlots.map(s =>
              s.date === dateStr ? { ...s, slots: [...s.slots, time] } : s
            )
          };
        }
      } else {
        // Create new entry
        return {
          ...prev,
          blockedSlots: [...prev.blockedSlots, { date: dateStr, slots: [time] }]
        };
      }
    });
  };

  const isSlotBlocked = (date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    const entry = availability.blockedSlots.find(s => s.date === dateStr);
    return entry?.slots.includes(time) || false;
  };

  const generateTimeSlots = () => {
    const slots = [];
    const [startHour] = availability.workingHours.start.split(':').map(Number);
    const [endHour] = availability.workingHours.end.split(':').map(Number);
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      slots.push({ time, display: displayTime });
    }
    return slots;
  };

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

  const deleteLead = async (leadId) => {
    if (!confirm('Are you sure you want to remove this lead? This cannot be undone.')) return;
    try {
      const response = await fetch('/api/advisors/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, advisorId: advisor.id })
      });
      if (response.ok) {
        setSelectedLead(null);
        fetchLeads();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
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

  // Parse notes field into array of key-value pairs
  const parseNotes = (notes) => {
    if (!notes) return [];
    return notes.split(' | ').map(item => {
      const colonIndex = item.indexOf(':');
      if (colonIndex === -1) return { key: 'Note', value: item };
      return {
        key: item.substring(0, colonIndex).trim(),
        value: item.substring(colonIndex + 1).trim()
      };
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
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Admin Impersonation Banner */}
      {isAdminView && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-4">
          <span>Viewing as: {advisor.name}</span>
          <button
            onClick={() => {
              localStorage.removeItem('advisor_session');
              window.close();
            }}
            className="bg-black/20 hover:bg-black/30 px-3 py-1 rounded text-xs font-semibold transition"
          >
            Exit Admin View
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-[#334155]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">AssetPlanly</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveView('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              activeView === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'text-[#94a3b8] hover:bg-[#334155] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendar
          </button>

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

          <Link
            href="/advisor/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition text-[#94a3b8] hover:bg-[#334155] hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
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
        <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[#1e293b] border-b border-[#334155] px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {activeView === 'calendar' && 'Calendar & Schedule'}
                {activeView === 'leads' && 'Lead Management'}
                {activeView === 'campaigns' && 'Campaigns'}
                {activeView === 'stats' && 'Analytics'}
              </h1>
              <p className="text-[#64748b] text-sm mt-1">
                {activeView === 'calendar' && `${getTodayAppointments().length} appointments today`}
                {activeView === 'leads' && `${filteredLeads.length} leads`}
                {activeView === 'campaigns' && `${campaigns.length} campaigns`}
                {activeView === 'stats' && 'Performance overview'}
              </p>
            </div>

            {activeView === 'calendar' && (
              <button
                onClick={() => setShowAvailabilityModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Set Availability
              </button>
            )}

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
          ) : activeView === 'calendar' ? (
            /* Calendar View */
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-[#1e293b] rounded-xl p-6">
                  {/* Calendar Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-white">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2 text-[#64748b] hover:text-white hover:bg-[#334155] rounded-lg transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentMonth(new Date())}
                        className="px-3 py-1 text-sm text-[#64748b] hover:text-white hover:bg-[#334155] rounded-lg transition"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-2 text-[#64748b] hover:text-white hover:bg-[#334155] rounded-lg transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-[#64748b] py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentMonth).map((date, idx) => (
                      <button
                        key={idx}
                        onClick={() => date && setSelectedDate(date)}
                        disabled={!date}
                        className={`aspect-square p-1 rounded-lg text-sm transition relative ${
                          !date ? 'cursor-default' :
                          isSelected(date) ? 'bg-blue-600 text-white' :
                          isToday(date) ? 'bg-blue-600/20 text-blue-400' :
                          'text-white hover:bg-[#334155]'
                        }`}
                      >
                        {date && (
                          <>
                            <span>{date.getDate()}</span>
                            {hasAppointments(date) && (
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                {getAppointmentsForDate(date).slice(0, 3).map((_, i) => (
                                  <div key={i} className="w-1 h-1 rounded-full bg-green-400" />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Date Appointments */}
                <div className="bg-[#1e293b] rounded-xl p-6 mt-6">
                  <h3 className="text-white font-semibold mb-4">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>
                  {getAppointmentsForDate(selectedDate).length === 0 ? (
                    <p className="text-[#64748b] text-sm">No appointments scheduled</p>
                  ) : (
                    <div className="space-y-3">
                      {getAppointmentsForDate(selectedDate).map(lead => (
                        <div
                          key={lead.id}
                          onClick={() => { setSelectedLead(lead); setActiveView('leads'); }}
                          className="flex items-center gap-4 bg-[#0f172a] rounded-lg p-4 cursor-pointer hover:bg-[#334155]/50 transition"
                        >
                          <div className="text-blue-400 font-medium text-sm w-20">
                            {formatTime(lead.scheduled_at)}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium">{lead.name}</div>
                            <div className="text-[#64748b] text-sm">{lead.email}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            lead.is_qualified === true ? 'bg-green-500/20 text-green-400' :
                            lead.is_qualified === false ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {lead.is_qualified === true ? 'Qualified' : lead.is_qualified === false ? 'Not Qualified' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Block Time Slots */}
                  <div className="mt-6 pt-6 border-t border-[#334155]">
                    <h4 className="text-sm font-medium text-[#94a3b8] mb-3">Block Time Slots</h4>
                    <div className="flex flex-wrap gap-2">
                      {generateTimeSlots().map(slot => {
                        const blocked = isSlotBlocked(selectedDate, slot.time);
                        const hasAppt = getAppointmentsForDate(selectedDate).some(l => {
                          const apptHour = new Date(l.scheduled_at).getHours();
                          const slotHour = parseInt(slot.time.split(':')[0]);
                          return apptHour === slotHour;
                        });
                        return (
                          <button
                            key={slot.time}
                            onClick={() => toggleBlockedSlot(selectedDate, slot.time)}
                            disabled={hasAppt}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                              hasAppt ? 'bg-green-500/20 text-green-400 cursor-not-allowed' :
                              blocked ? 'bg-red-500/20 text-red-400' :
                              'bg-[#0f172a] text-[#94a3b8] hover:bg-[#334155]'
                            }`}
                          >
                            {slot.display}
                            {blocked && ' (blocked)'}
                            {hasAppt && ' (booked)'}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={saveAvailability}
                      disabled={savingAvailability}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      {savingAvailability ? 'Saving...' : 'Save Blocked Times'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Daily Rundown Sidebar */}
              <div className="space-y-6">
                {/* Today's Rundown */}
                <div className="bg-[#1e293b] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="text-white font-semibold">Daily Rundown</h3>
                  </div>
                  <p className="text-[#64748b] text-sm mb-4">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>

                  {getTodayAppointments().length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-[#64748b] text-sm">No meetings scheduled today</p>
                      <p className="text-[#475569] text-xs mt-1">Enjoy your free day!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getTodayAppointments().map((lead, idx) => (
                        <div key={lead.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                              {idx + 1}
                            </div>
                            {idx < getTodayAppointments().length - 1 && (
                              <div className="w-0.5 h-full bg-[#334155] my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="text-blue-400 text-sm font-medium">
                              {formatTime(lead.scheduled_at)}
                            </div>
                            <div className="text-white font-medium mt-1">{lead.name}</div>
                            <div className="text-[#64748b] text-sm">{lead.phone}</div>
                            {lead.message && (
                              <p className="text-[#94a3b8] text-xs mt-2 line-clamp-2">{lead.message}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="bg-[#1e293b] rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">This Week</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748b] text-sm">Total Appointments</span>
                      <span className="text-white font-semibold">
                        {leads.filter(l => {
                          if (!l.scheduled_at) return false;
                          const d = new Date(l.scheduled_at);
                          const now = new Date();
                          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                          const weekEnd = new Date(weekStart);
                          weekEnd.setDate(weekEnd.getDate() + 7);
                          return d >= weekStart && d < weekEnd;
                        }).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748b] text-sm">New Leads</span>
                      <span className="text-green-400 font-semibold">{stats.new}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748b] text-sm">Pending Review</span>
                      <span className="text-yellow-400 font-semibold">{stats.pending}</span>
                    </div>
                  </div>
                </div>

                {/* Working Hours Summary */}
                <div className="bg-[#1e293b] rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Your Availability</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Working Hours</span>
                      <span className="text-white">
                        {new Date(`2000-01-01T${availability.workingHours.start}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(`2000-01-01T${availability.workingHours.end}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Working Days</span>
                      <span className="text-white">
                        {availability.workingDays.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAvailabilityModal(true)}
                    className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                  >
                    Edit Availability Settings
                  </button>
                </div>
              </div>
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
                      </div>
                    </div>

                    {/* Questionnaire Answers */}
                    {selectedLead.notes && parseNotes(selectedLead.notes).length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-[#64748b] mb-3">Questionnaire Answers</h3>
                        <div className="bg-[#0f172a] rounded-lg p-4 space-y-3">
                          {parseNotes(selectedLead.notes).map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                              <span className="text-[#94a3b8] text-xs font-medium uppercase">{item.key}</span>
                              <span className="text-white text-sm">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meeting Goals */}
                    {selectedLead.message && (
                      <div>
                        <h3 className="text-sm font-medium text-[#64748b] mb-3">Meeting Goals</h3>
                        <div className="bg-[#0f172a] rounded-lg p-4">
                          <p className="text-white text-sm">{selectedLead.message}</p>
                        </div>
                      </div>
                    )}

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

                    {/* Delete Lead */}
                    <div className="pt-4 border-t border-[#334155]">
                      <button
                        onClick={() => deleteLead(selectedLead.id)}
                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2.5 rounded-lg text-sm font-medium transition"
                      >
                        Remove Lead
                      </button>
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

      {/* Availability Settings Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="bg-[#1e293b] rounded-xl p-6 w-full max-w-lg border border-[#334155]">
            <h3 className="text-lg font-semibold text-white mb-4">Availability Settings</h3>
            <p className="text-[#64748b] text-sm mb-6">
              Set your working hours and days. Prospects will only be able to book times when you're available.
            </p>

            <div className="space-y-6">
              {/* Working Hours */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-3">Working Hours</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#64748b] mb-1">Start Time</label>
                    <select
                      value={availability.workingHours.start}
                      onChange={(e) => setAvailability(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, start: e.target.value }
                      }))}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const time = `${i.toString().padStart(2, '0')}:00`;
                        const display = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                        return <option key={time} value={time}>{display}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#64748b] mb-1">End Time</label>
                    <select
                      value={availability.workingHours.end}
                      onChange={(e) => setAvailability(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, end: e.target.value }
                      }))}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const time = `${i.toString().padStart(2, '0')}:00`;
                        const display = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                        return <option key={time} value={time}>{display}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Working Days */}
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-3">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setAvailability(prev => ({
                          ...prev,
                          workingDays: prev.workingDays.includes(idx)
                            ? prev.workingDays.filter(d => d !== idx)
                            : [...prev.workingDays, idx].sort()
                        }));
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        availability.workingDays.includes(idx)
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#334155]'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-[#0f172a] rounded-lg p-4">
                <p className="text-[#64748b] text-sm">
                  <strong className="text-[#94a3b8]">Tip:</strong> You can block specific time slots on specific dates using the calendar view. This is useful for vacation days, appointments, or other commitments.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="flex-1 bg-[#334155] hover:bg-[#475569] text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { saveAvailability(); setShowAvailabilityModal(false); }}
                  disabled={savingAvailability}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  {savingAvailability ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
