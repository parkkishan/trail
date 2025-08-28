import './App.css'
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter, BarChart3, TrendingUp, Users, Clock, Edit, Trash2, Eye, Calendar, Building, MapPin, DollarSign, BookmarkPlus, X, Menu } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const JobTracker = () => {
  const [applications, setApplications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    status: 'applied',
    applicationDate: '',
    notes: '',
    jobType: 'full-time',
    remote: false
  });

  const statusColors = {
    applied: { bg: 'bg-blue-500', text: 'text-blue-100', border: 'border-blue-400' },
    interview: { bg: 'bg-yellow-500', text: 'text-yellow-100', border: 'border-yellow-400' },
    offer: { bg: 'bg-green-500', text: 'text-green-100', border: 'border-green-400' },
    rejected: { bg: 'bg-red-500', text: 'text-red-100', border: 'border-red-400' }
  };

  const pieColors = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444'];

  // Load applications from localStorage on component mount
  useEffect(() => {
    const loadApplications = () => {
      try {
        const stored = localStorage.getItem('jobApplications');
        if (stored && stored !== 'undefined' && stored !== 'null') {
          const parsedData = JSON.parse(stored);
          if (Array.isArray(parsedData)) {
            setApplications(parsedData);
          }
        }
      } catch (error) {
        console.error('Error loading applications from localStorage:', error);
        setApplications([]);
      }
    };

    loadApplications();
  }, []);

  // Save applications to localStorage whenever applications change
  useEffect(() => {
    if (applications.length >= 0) {
      try {
        localStorage.setItem('jobApplications', JSON.stringify(applications));
      } catch (error) {
        console.error('Error saving applications to localStorage:', error);
      }
    }
  }, [applications]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode && selectedApp) {
      setApplications(prev => prev.map(app => 
        app.id === selectedApp.id ? { ...formData, id: selectedApp.id } : app
      ));
      setEditMode(false);
      setSelectedApp(null);
    } else {
      const newApp = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setApplications(prev => [...prev, newApp]);
    }
    setFormData({
      company: '', position: '', location: '', salary: '', status: 'applied',
      applicationDate: '', notes: '', jobType: 'full-time', remote: false
    });
    setShowAddModal(false);
    setSidebarOpen(false);
  };

  const handleEdit = (app) => {
    setFormData(app);
    setSelectedApp(app);
    setEditMode(true);
    setShowAddModal(true);
    setSidebarOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  const handleView = (app) => {
    setSelectedApp(app);
    setShowViewModal(true);
    setSidebarOpen(false);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStats = () => {
    const total = applications.length;
    const applied = applications.filter(app => app.status === 'applied').length;
    const interviews = applications.filter(app => app.status === 'interview').length;
    const offers = applications.filter(app => app.status === 'offer').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;

    return { total, applied, interviews, offers, rejected };
  };

  const getChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = applications.filter(app => 
        app.applicationDate === dateStr
      ).length;
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: count
      });
    }
    return last7Days;
  };

  const getPieData = () => {
    const stats = getStats();
    return [
      { name: 'Applied', value: stats.applied, color: '#8B5CF6' },
      { name: 'Interview', value: stats.interviews, color: '#F59E0B' },
      { name: 'Offer', value: stats.offers, color: '#10B981' },
      { name: 'Rejected', value: stats.rejected, color: '#EF4444' }
    ].filter(item => item.value > 0);
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-purple-800">
      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 glass-effect z-40 lg:hidden animate-fadeIn"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Enhanced Responsive Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-[280px] xs:w-[320px] sm:w-80 lg:w-72 glass-effect border-r border-purple-500/20 
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-all duration-300
          h-[100dvh] lg:min-h-screen overflow-y-auto
          flex flex-col
        `}>
          <div className="flex items-center justify-between lg:justify-center gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center" style={{  marginTop: '3rem' }}>
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <h1 className="text-1 lg:text-sm font-bold text-white" style={{ fontSize: '1.25rem', marginTop: '3rem' }}>O R B I T</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'applications', label: 'Applications', icon: BookmarkPlus },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm lg:text-base ${
                    activeView === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full min-h-screen-without-nav">
          {/* Mobile Header */}
          <div className="sticky top-0 z-40 lg:hidden glass-effect border-b border-purple-500/20 safe-bottom">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-700/50 text-white hover:bg-gray-700 transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-semibold text-white">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-9xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {activeView === 'dashboard' && 'Dashboard'}
                  {activeView === 'applications' && 'Applications'}
                  {activeView === 'analytics' && 'Analytics'}
                </h2>
                <p className="text-purple-200 text-sm lg:text-base">Track your job and Internship applications efficiently</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg text-sm lg:text-base"
              >
                <PlusCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                Add Application
              </button>
            </div>

            {/* Responsive Dashboard View */}
            {activeView === 'dashboard' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Fluid Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-4 lg:gap-6">
                  {[
                    { label: 'Total Applications', value: stats.total, icon: BookmarkPlus, color: 'from-purple-500 to-purple-600' },
                    { label: 'Applied', value: stats.applied, icon: Clock, color: 'from-blue-500 to-blue-600' },
                    { label: 'Interviews', value: stats.interviews, icon: Users, color: 'from-yellow-500 to-yellow-600' },
                    { label: 'Offers', value: stats.offers, icon: TrendingUp, color: 'from-green-500 to-green-600' }
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 sm:p-4 lg:p-15 transition-all duration-300 hover:border-purple-400/40">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-300 text-xs lg:text-sm">{stat.label}</p>
                            <p className="text-xl lg:text-3xl font-bold text-white mt-1 lg:mt-2">{stat.value}</p>
                          </div>
                          <div className={`w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Responsive Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 sm:p-4 lg:p-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4">
                      Applications Over Time
                    </h3>
                    <div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #8B5CF6',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '14px'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="applications"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 sm:p-4 lg:p-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4">Status Distribution</h3>
                    <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={100}
                            dataKey="value"
                          >
                            {getPieData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #8B5CF6',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '14px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications View */}
            {activeView === 'applications' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Improved search and filter layout */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 lg:py-3 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 lg:py-3 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                  >
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Fluid Applications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {filteredApplications.map(app => (
                    <div key={app.id} className="bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:border-purple-400/40">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-semibold text-white mb-1 truncate">{app.company}</h3>
                          <p className="text-purple-200 text-sm lg:text-base truncate">{app.position}</p>
                        </div>
                        <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status].bg} ${statusColors[app.status].text} ml-2 whitespace-nowrap`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                          <span className="text-xs lg:text-sm truncate">{app.location}</span>
                        </div>
                        {app.salary && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                            <span className="text-xs lg:text-sm truncate">{app.salary}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                          <span className="text-xs lg:text-sm">{new Date(app.applicationDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(app)}
                          className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 py-2 px-2 lg:px-3 rounded-lg transition-all flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm"
                        >
                          <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => handleEdit(app)}
                          className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-200 py-2 px-2 lg:px-3 rounded-lg transition-all flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm"
                        >
                          <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-200 py-2 px-2 lg:px-3 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredApplications.length === 0 && (
                  <div className="text-center py-12">
                    <BookmarkPlus className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No applications found</p>
                    <p className="text-gray-500">Start tracking your job applications!</p>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Analytics View */}
            {activeView === 'analytics' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Responsive analytics grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 sm:p-4 lg:p-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4">Application Trends</h3>
                    <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: '1px solid #8B5CF6',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '14px'
                            }}
                          />
                          <Bar dataKey="applications" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 sm:p-4 lg:p-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-4">Success Rate</h3>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                          {stats.total > 0 ? Math.round((stats.offers / stats.total) * 100) : 0}%
                        </div>
                        <p className="text-gray-400">Offer Rate</p>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Interview Rate', value: stats.total > 0 ? Math.round(((stats.interviews + stats.offers) / stats.total) * 100) : 0, color: 'bg-yellow-500' },
                          { label: 'Rejection Rate', value: stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0, color: 'bg-red-500' }
                        ].map((metric, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm text-gray-300 mb-1">
                              <span>{metric.label}</span>
                              <span>{metric.value}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`${metric.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${metric.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals with improved animations */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 glass-effect z-50 flex items-center justify-center p-4 animate-fadeIn safe-bottom">
          <div className="bg-gray-800 rounded-xl border border-purple-500/20 w-full max-w-lg max-h-[90dvh] overflow-y-auto animate-slideIn">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-white">
                  {editMode ? 'Edit Application' : 'Add New Application'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditMode(false);
                    setSelectedApp(null);
                    setFormData({
                      company: '', position: '', location: '', salary: '', status: 'applied',
                      applicationDate: '', notes: '', jobType: 'full-time', remote: false
                    });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-2 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                    placeholder="Google, Microsoft, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-2 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                    placeholder="Software Engineer, Product Manager, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                    placeholder="San Francisco, Remote, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full px-4 py-2 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                    placeholder="$120,000, $80k-$100k, etc."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-2 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                    <select
                      value={formData.jobType}
                      onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value }))}
                      className="w-full px-4 py-2 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Application Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.applicationDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationDate: e.target.value }))}
                    className="w-full px-4 py-2 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-2 lg:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-sm lg:text-base resize-none"
                    rows="3"
                    placeholder="Additional notes about the application..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={formData.remote}
                    onChange={(e) => setFormData(prev => ({ ...prev, remote: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="remote" className="ml-2 text-sm text-gray-300">Remote Position</label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditMode(false);
                      setSelectedApp(null);
                      setFormData({
                        company: '', position: '', location: '', salary: '', status: 'applied',
                        applicationDate: '', notes: '', jobType: 'full-time', remote: false
                      });
                    }}
                    className="flex-1 px-6 py-2 lg:py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm lg:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 lg:py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all text-sm lg:text-base"
                  >
                    {editMode ? 'Update' : 'Add'} Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal with animations */}
      {showViewModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-gray-800 rounded-xl border border-purple-500/20 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideIn">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg lg:text-xl font-semibold text-white">Application Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-white truncate">{selectedApp.company}</h4>
                    <p className="text-purple-200 truncate">{selectedApp.position}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedApp.status].bg} ${statusColors[selectedApp.status].text} ml-2 whitespace-nowrap`}>
                    {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <p className="text-white">{selectedApp.location || 'Not specified'}</p>
                  </div>

                  {selectedApp.salary && (
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-300 mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">Salary</span>
                      </div>
                      <p className="text-white">{selectedApp.salary}</p>
                    </div>
                  )}

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">Job Type</span>
                    </div>
                    <p className="text-white capitalize">{selectedApp.jobType}</p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Application Date</span>
                    </div>
                    <p className="text-white">{new Date(selectedApp.applicationDate).toLocaleDateString()}</p>
                  </div>

                  {selectedApp.remote && (
                    <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                      <p className="text-green-200 font-medium">🌐 Remote Position</p>
                    </div>
                  )}

                  {selectedApp.notes && (
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="text-gray-300 mb-2 font-medium">Notes</div>
                      <p className="text-white whitespace-pre-wrap text-sm">{selectedApp.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedApp);
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 lg:py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-2 lg:py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm lg:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTracker;