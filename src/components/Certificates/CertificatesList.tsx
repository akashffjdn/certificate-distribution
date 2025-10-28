import { useState } from 'react';
import { Download, Eye, Share2, MoreVertical, Award, Clock, Check, X } from 'lucide-react';
import type { Certificate } from '../../types';
import { mockCertificates, mockEvents, mockAwards } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function CertificatesList() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [filter, setFilter] = useState<'all' | 'draft' | 'generated' | 'issued' | 'revoked'>('all');
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);

  const isStaff = user?.role === 'staff';
  
  // Filter certificates based on user role
  const userCertificates = isStaff 
    ? certificates 
    : certificates.filter(cert => cert.student_id === user?.id);
    
  const filteredCertificates = userCertificates.filter(cert => 
    filter === 'all' || cert.issue_status === filter
  );

  const getStatusIcon = (status: Certificate['issue_status']) => {
    switch (status) {
      case 'issued':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'generated':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'revoked':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Certificate['issue_status']) => {
    switch (status) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'generated':
        return 'bg-yellow-100 text-yellow-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (certificateId: string) => {
    console.log('Downloading certificate:', certificateId);
    // In a real app, this would download the actual PDF
  };

  const handleVerify = (certificateId: string) => {
    window.open(`/verify/${certificateId}`, '_blank');
  };

  const handleShare = (certificateId: string) => {
    const verifyUrl = `${window.location.origin}/verify/${certificateId}`;
    navigator.clipboard.writeText(verifyUrl);
    // Show success message
  };

  const handleIssue = (certificateId: string) => {
    setCertificates(prev => 
      prev.map(cert => 
        cert.id === certificateId 
          ? { ...cert, issue_status: 'issued', issued_at: new Date().toISOString() }
          : cert
      )
    );
    setShowActionsFor(null);
  };

  const handleRevoke = (certificateId: string) => {
    const reason = prompt('Enter revocation reason:');
    if (reason) {
      setCertificates(prev => 
        prev.map(cert => 
          cert.id === certificateId 
            ? { ...cert, issue_status: 'revoked', revoke_reason: reason }
            : cert
        )
      );
    }
    setShowActionsFor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isStaff ? 'All Certificates' : 'My Certificates'}
        </h1>
        <p className="text-gray-600">
          {isStaff 
            ? 'Manage and track certificate issuance across all students.' 
            : 'View and download your competition certificates.'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'draft', 'generated', 'issued', 'revoked'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === status
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'All Certificates' : status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'all' 
              ? ` (${userCertificates.length})` 
              : ` (${userCertificates.filter(c => c.issue_status === status).length})`
            }
          </button>
        ))}
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCertificates.length === 0 ? (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No certificates found' : `No ${filter} certificates`}
              </h3>
              <p className="text-gray-500">
                {isStaff 
                  ? 'Certificates will appear here once generated and issued to students.'
                  : 'Your certificates will appear here once issued by staff.'
                }
              </p>
            </div>
          </div>
        ) : (
          filteredCertificates.map((certificate) => {
            const award = mockAwards.find(a => a.id === certificate.award_id);
            const event = award ? mockEvents.find(e => e.id === award.event_id) : null;
            
            return (
              <div key={certificate.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(certificate.issue_status)}
                      <h3 className="font-semibold text-gray-900">
                        Competition – {event?.title || 'Unknown Event'}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Certificate ID: {certificate.certificate_id}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(certificate.issue_status)}`}>
                      {certificate.issue_status}
                    </span>
                    
                    {isStaff && (
                      <div className="relative">
                        <button
                          onClick={() => setShowActionsFor(showActionsFor === certificate.id ? null : certificate.id)}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        {showActionsFor === certificate.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            {certificate.issue_status === 'generated' && (
                              <button
                                onClick={() => handleIssue(certificate.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                                Issue Now
                              </button>
                            )}
                            
                            {certificate.issue_status === 'issued' && (
                              <button
                                onClick={() => handleRevoke(certificate.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Revoke
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rank/Position:</span>
                    <span className="font-medium">
                      {award?.position ? `#${award.position}` : award?.award_type}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Event Date:</span>
                    <span className="font-medium">
                      {event?.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Issue Date:</span>
                    <span className="font-medium">
                      {certificate.issued_at 
                        ? new Date(certificate.issued_at).toLocaleDateString() 
                        : 'Pending'
                      }
                    </span>
                  </div>

                  {certificate.revoke_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">
                        <strong>Revoked:</strong> {certificate.revoke_reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {certificate.issue_status === 'issued' && (
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDownload(certificate.certificate_id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleVerify(certificate.certificate_id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Verify
                    </button>
                    <button
                      onClick={() => handleShare(certificate.certificate_id)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {certificate.issue_status === 'generated' && !isStaff && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-700">
                        Certificate is being processed. You'll be notified once it's ready.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}