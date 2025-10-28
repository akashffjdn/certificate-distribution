import  { useState } from 'react';
import { BarChart3, Download, Calendar, Award, FileText, Eye, TrendingUp, } from 'lucide-react';
import { mockCertificates, mockEvents, mockAwards, } from '../../data/mockData';

export default function ReportsDashboard() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Calculate statistics
  const totalCertificates = mockCertificates.length;
  const issuedCertificates = mockCertificates.filter(c => c.issue_status === 'issued').length;
  const revokedCertificates = mockCertificates.filter(c => c.issue_status === 'revoked').length;
  const totalEvents = mockEvents.length;
  const totalAwards = mockAwards.length;

  // Certificate distribution by status
  const certificatesByStatus = {
    draft: mockCertificates.filter(c => c.issue_status === 'draft').length,
    generated: mockCertificates.filter(c => c.issue_status === 'generated').length,
    issued: issuedCertificates,
    revoked: revokedCertificates
  };

  // Awards distribution
  const awardsByType = mockAwards.reduce((acc, award) => {
    acc[award.award_type] = (acc[award.award_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Events by category
  const eventsByCategory = mockEvents.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mock verification data
  const verificationStats = {
    totalHits: 1247,
    uniqueVerifications: 892,
    averagePerDay: 41
  };

  const reports = [
    {
      id: 'certificates-issued',
      title: 'Certificates Issued',
      description: 'Detailed report of all issued certificates by event, date, and department',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'award-distribution',
      title: 'Award Distribution',
      description: 'Analysis of winners vs participants across all competitions',
      icon: Award,
      color: 'bg-green-500'
    },
    {
      id: 'revocations',
      title: 'Certificate Revocations',
      description: 'Report on revoked certificates with reasons and trends',
      icon: BarChart3,
      color: 'bg-red-500'
    },
    {
      id: 'verification-hits',
      title: 'Verification Analytics',
      description: 'Monthly verification hits and authentication statistics',
      icon: Eye,
      color: 'bg-purple-500'
    }
  ];

  const handleExportReport = (reportId: string) => {
    console.log('Exporting report:', reportId);
    // In a real app, this would generate and download the report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track certificate issuance, awards distribution, and verification statistics.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="this-year">This year</option>
            <option value="all-time">All time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Certificates</p>
              <p className="text-3xl font-bold text-gray-900">{totalCertificates}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">+12%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issued Certificates</p>
              <p className="text-3xl font-bold text-gray-900">{issuedCertificates}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">+8%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">+3</span>
            <span className="text-sm text-gray-500 ml-2">this month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verifications</p>
              <p className="text-3xl font-bold text-gray-900">{verificationStats.totalHits}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600">{verificationStats.averagePerDay}/day</span>
            <span className="text-sm text-gray-500 ml-2">average</span>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate Status Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(certificatesByStatus).map(([status, count]) => {
              const percentage = totalCertificates > 0 ? (count / totalCertificates) * 100 : 0;
              const colors = {
                draft: 'bg-yellow-500',
                generated: 'bg-blue-500',
                issued: 'bg-green-500',
                revoked: 'bg-red-500'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[status as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Award Types Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Award Types Distribution</h3>
          <div className="space-y-3">
            {Object.entries(awardsByType).map(([type, count]) => {
              const percentage = totalAwards > 0 ? (count / totalAwards) * 100 : 0;
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Category</h3>
          <div className="space-y-3">
            {Object.entries(eventsByCategory).map(([category, count]) => {
              const percentage = totalEvents > 0 ? (count / totalEvents) * 100 : 0;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Verifications</span>
              <span className="text-lg font-semibold text-gray-900">{verificationStats.totalHits}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unique Certificates</span>
              <span className="text-lg font-semibold text-gray-900">{verificationStats.uniqueVerifications}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Daily Average</span>
              <span className="text-lg font-semibold text-gray-900">{verificationStats.averagePerDay}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+15% increase this month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{report.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(report.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </button>
                      <span className="text-gray-300">•</span>
                      <button
                        onClick={() => handleExportReport(report.id)}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}