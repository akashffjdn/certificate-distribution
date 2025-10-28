import React from 'react';
import { Award, Download, Eye, Share2, Calendar, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockCertificates, mockEvents, mockAwards, mockRecipients } from '../../data/mockData';

export default function StudentDashboard() {
  const { user } = useAuth();
  
  // Get student's certificates
  const studentCertificates = mockCertificates.filter(cert => cert.student_id === user?.id);
  const issuedCertificates = studentCertificates.filter(cert => cert.issue_status === 'issued');
  const pendingCertificates = studentCertificates.filter(cert => cert.issue_status === 'generated');

  // Get student's awards
  const studentAwards = mockRecipients
    .filter(recipient => recipient.student_id === user?.id)
    .map(recipient => {
      const award = mockAwards.find(a => a.id === recipient.award_id);
      const event = award ? mockEvents.find(e => e.id === award.event_id) : null;
      return { recipient, award, event };
    })
    .filter(item => item.award && item.event);

  const stats = [
    {
      name: 'Certificates Earned',
      value: issuedCertificates.length,
      icon: Award,
      color: 'bg-blue-500'
    },
    {
      name: 'Competitions Participated',
      value: studentAwards.length,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Awards Won',
      value: studentAwards.filter(item => item.award?.award_type !== 'Participation').length,
      icon: Trophy,
      color: 'bg-yellow-500'
    },
    {
      name: 'Pending Certificates',
      value: pendingCertificates.length,
      icon: Download,
      color: 'bg-purple-500'
    }
  ];

  const handleDownload = (certificateId: string) => {
    // In a real app, this would download the actual PDF
    console.log('Downloading certificate:', certificateId);
  };

  const handleVerify = (certificateId: string) => {
    // Open verification page in new tab
    window.open(`/verify/${certificateId}`, '_blank');
  };

  const handleShare = (certificateId: string) => {
    // Copy verification link to clipboard
    const verifyUrl = `${window.location.origin}/verify/${certificateId}`;
    navigator.clipboard.writeText(verifyUrl);
    // In a real app, show success toast
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Track your achievements and download your certificates.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Certificates */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Certificates</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
          
          {studentCertificates.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No certificates yet</p>
              <p className="text-sm text-gray-400">Your certificates will appear here once issued</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentCertificates.slice(0, 3).map((certificate) => {
                const award = mockAwards.find(a => a.id === certificate.award_id);
                const event = award ? mockEvents.find(e => e.id === award.event_id) : null;
                
                return (
                  <div key={certificate.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          Competition – {event?.title || 'Unknown Event'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Issued: {certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString() : 'Pending'} • 
                          ID: {certificate.certificate_id} • 
                          Rank: {award?.position ? `#${award.position}` : award?.award_type}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        certificate.issue_status === 'issued' ? 'bg-green-100 text-green-800' :
                        certificate.issue_status === 'generated' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {certificate.issue_status}
                      </span>
                    </div>
                    
                    {certificate.issue_status === 'issued' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(certificate.certificate_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </button>
                        <button
                          onClick={() => handleVerify(certificate.certificate_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Verify Online
                        </button>
                        <button
                          onClick={() => handleShare(certificate.certificate_id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          Share Link
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Achievements</h2>
          </div>
          
          {studentAwards.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No achievements yet</p>
              <p className="text-sm text-gray-400">Participate in competitions to earn awards</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentAwards.slice(0, 4).map((item) => (
                <div key={item.recipient.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.award!.award_type === 'First' || item.award!.position === 1 ? 'bg-yellow-100' :
                    item.award!.award_type === 'Second' || item.award!.position === 2 ? 'bg-gray-100' :
                    item.award!.award_type === 'Third' || item.award!.position === 3 ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    <Trophy className={`w-5 h-5 ${
                      item.award!.award_type === 'First' || item.award!.position === 1 ? 'text-yellow-600' :
                      item.award!.award_type === 'Second' || item.award!.position === 2 ? 'text-gray-600' :
                      item.award!.award_type === 'Third' || item.award!.position === 3 ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.event!.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.award!.award_type} {item.award!.position && `(Position ${item.award!.position})`} • {new Date(item.event!.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Student Details</p>
            <p className="text-sm text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">Reg No: {user?.reg_no}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Department</p>
            <p className="text-sm text-gray-900">{user?.dept}</p>
            <p className="text-xs text-gray-500">{user?.program}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Contact</p>
            <p className="text-sm text-gray-900">{user?.email}</p>
            <p className="text-xs text-gray-500">{user?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}