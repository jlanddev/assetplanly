'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdvisorSettings() {
  const router = useRouter();
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const logoInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    firm_name: '',
    website_url: '',
    bio: '',
    logo_url: '',
    photo_url: '',
    video_url: '',
    primary_color: '#1e3a5f',
    secondary_color: '#f97316',
    // Targeting conditions
    min_age: '',
    max_age: '',
    min_assets: '',
    max_assets: '',
    target_states: [],
    target_goals: []
  });

  const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const FINANCIAL_GOALS = [
    'Retirement Planning',
    'Investment Management',
    'Estate Planning',
    'Tax Planning',
    '401(k) Rollover',
    'Wealth Building',
    'Social Security',
    'Insurance Review',
    'College Savings',
    'Debt Management'
  ];

  const ASSET_RANGES = [
    { value: '100000', label: '$100,000' },
    { value: '250000', label: '$250,000' },
    { value: '500000', label: '$500,000' },
    { value: '1000000', label: '$1,000,000' },
    { value: '2500000', label: '$2,500,000' },
    { value: '5000000', label: '$5,000,000' },
    { value: '10000000', label: '$10,000,000+' },
  ];

  useEffect(() => {
    const session = localStorage.getItem('advisor_session');
    if (!session) {
      router.push('/advisor');
      return;
    }
    const advisorData = JSON.parse(session);
    setAdvisor(advisorData);
    fetchAdvisorDetails(advisorData.id);
  }, [router]);

  const fetchAdvisorDetails = async (advisorId) => {
    try {
      const response = await fetch(`/api/advisors/profile?advisorId=${advisorId}`);
      const data = await response.json();
      if (data && !data.error) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          firm_name: data.firm_name || '',
          website_url: data.website_url || '',
          bio: data.bio || '',
          logo_url: data.logo_url || '',
          photo_url: data.photo_url || '',
          video_url: data.video_url || '',
          primary_color: data.primary_color || '#1e3a5f',
          secondary_color: data.secondary_color || '#f97316',
          min_age: data.min_age || '',
          max_age: data.max_age || '',
          min_assets: data.min_assets || '',
          max_assets: data.max_assets || '',
          target_states: data.target_states || [],
          target_goals: data.target_goals || []
        });
      }
    } catch (error) {
      console.error('Error fetching advisor details:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleState = (state) => {
    setFormData(prev => ({
      ...prev,
      target_states: prev.target_states.includes(state)
        ? prev.target_states.filter(s => s !== state)
        : [...prev.target_states, state]
    }));
  };

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      target_goals: prev.target_goals.includes(goal)
        ? prev.target_goals.filter(g => g !== goal)
        : [...prev.target_goals, goal]
    }));
  };

  const selectAllStates = () => {
    setFormData(prev => ({ ...prev, target_states: [...US_STATES] }));
  };

  const clearAllStates = () => {
    setFormData(prev => ({ ...prev, target_states: [] }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // For now, we'll use a base64 data URL
    // In production, you'd upload to Supabase Storage or similar
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setFormData(prev => ({ ...prev, logo_url: reader.result }));
      } else if (type === 'photo') {
        setFormData(prev => ({ ...prev, photo_url: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/advisors/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advisorId: advisor.id,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        // Update local session with new name
        const session = JSON.parse(localStorage.getItem('advisor_session'));
        session.name = formData.name;
        localStorage.setItem('advisor_session', JSON.stringify(session));
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-[#334155] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/advisor/dashboard" className="text-[#64748b] hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-white">Profile & Branding</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Branding */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-[#1e293b] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Firm Name</label>
                  <input
                    type="text"
                    name="firm_name"
                    value={formData.firm_name}
                    onChange={handleChange}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">Website URL</label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://yourfirm.com"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell prospects about your experience and approach..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Branding */}
            <div className="bg-[#1e293b] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Branding</h2>
              <p className="text-[#64748b] text-sm mb-6">
                Customize how your profile appears to prospects. Your branding will be shown on the booking page when leads are matched to you.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Logo</label>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-[#334155] rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
                  >
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Logo" className="max-h-20 max-w-[250px] object-contain mx-auto" />
                    ) : (
                      <div className="text-[#64748b]">
                        <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Click to upload logo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Your Photo</label>
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="border-2 border-dashed border-[#334155] rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
                  >
                    {formData.photo_url ? (
                      <img src={formData.photo_url} alt="Photo" className="w-20 h-20 rounded-full mx-auto object-cover" />
                    ) : (
                      <div className="text-[#64748b]">
                        <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm">Click to upload photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'photo')}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Video URL */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-[#94a3b8] mb-2">Intro Video URL (YouTube/Vimeo)</label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Colors */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Primary Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Secondary Color</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Targeting */}
            <div className="bg-[#1e293b] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Lead Targeting</h2>
              <p className="text-[#64748b] text-sm mb-6">
                Set conditions for the types of leads you want to receive. Leads that match your criteria will see your branded experience.
              </p>

              {/* Age Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#94a3b8] mb-3">Client Age Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#64748b] mb-1">Minimum Age</label>
                    <input
                      type="number"
                      name="min_age"
                      value={formData.min_age}
                      onChange={handleChange}
                      placeholder="25"
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#64748b] mb-1">Maximum Age</label>
                    <input
                      type="number"
                      name="max_age"
                      value={formData.max_age}
                      onChange={handleChange}
                      placeholder="75"
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Asset Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#94a3b8] mb-3">Investable Assets Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#64748b] mb-1">Minimum</label>
                    <select
                      name="min_assets"
                      value={formData.min_assets}
                      onChange={handleChange}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">No minimum</option>
                      {ASSET_RANGES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#64748b] mb-1">Maximum</label>
                    <select
                      name="max_assets"
                      value={formData.max_assets}
                      onChange={handleChange}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">No maximum</option>
                      {ASSET_RANGES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Goals */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#94a3b8] mb-3">Financial Goals (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {FINANCIAL_GOALS.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        formData.target_goals.includes(goal)
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#334155]'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target States */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-[#94a3b8]">Target States</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllStates}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Select All
                    </button>
                    <span className="text-[#334155]">|</span>
                    <button
                      type="button"
                      onClick={clearAllStates}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto bg-[#0f172a] rounded-lg p-3">
                  {US_STATES.map(state => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => toggleState(state)}
                      className={`px-2 py-1.5 rounded text-xs font-medium transition ${
                        formData.target_states.includes(state)
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#64748b] mt-2">
                  {formData.target_states.length === 0 ? 'All states' : `${formData.target_states.length} states selected`}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div>
            <div className="bg-[#1e293b] rounded-xl p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
              <p className="text-[#64748b] text-sm mb-6">
                This is how your branded booking page will look to matched leads.
              </p>

              {/* Preview Card */}
              <div
                className="rounded-xl p-6 text-center"
                style={{ backgroundColor: formData.primary_color }}
              >
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo" className="max-h-14 max-w-[200px] object-contain mx-auto mb-4" />
                ) : (
                  <div className="text-white/50 text-sm mb-4">[Your Logo]</div>
                )}

                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Photo" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white/20" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white/50 text-xs">Photo</span>
                  </div>
                )}

                <h3 className="text-white font-bold text-lg">
                  {formData.name || 'Your Name'}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  {formData.firm_name || 'Your Firm'}
                </p>

                <button
                  className="px-6 py-3 rounded-lg font-semibold text-sm w-full"
                  style={{ backgroundColor: formData.secondary_color, color: '#fff' }}
                >
                  Schedule Consultation
                </button>
              </div>

              <div className="mt-4 p-4 bg-[#0f172a] rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Targeting Summary</h4>
                <div className="text-xs text-[#64748b] space-y-1">
                  <p>Age: {formData.min_age || 'Any'} - {formData.max_age || 'Any'}</p>
                  <p>Assets: {formData.min_assets ? `$${parseInt(formData.min_assets).toLocaleString()}` : 'Any'} - {formData.max_assets ? `$${parseInt(formData.max_assets).toLocaleString()}` : 'Any'}</p>
                  <p>States: {formData.target_states.length === 0 ? 'All' : `${formData.target_states.length} selected`}</p>
                  <p>Goals: {formData.target_goals.length === 0 ? 'All' : `${formData.target_goals.length} selected`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
