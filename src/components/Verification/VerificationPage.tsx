import { useState } from 'react';
import { Search, Shield, CheckCircle, XCircle, Calendar, Award, User, Building } from 'lucide-react';
import { mockCertificates, mockEvents, mockAwards } from '../../data/mockData';

export default function VerificationPage() {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setIsLoading(true);
    setError('');
    setVerificationResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const certificate = mockCertificates.find(c => c.certificate_id === certificateId);
    
    if (!certificate) {
      setError('Certificate not found. Please check the ID and try again.');
      setIsLoading(false);
      return;
    }

    const award = mockAwards.find(a => a.id === certificate.award_id);
    const event = award ? mockEvents.find(e => e.id === award.event_id) : null;

    setVerificationResult({
      certificate,
      award,
      event,
      student: {
        name: certificate.student_id === '2' ? 'Arjun Patel' : 'Sneha Reddy',
        reg_no: certificate.student_id === '2' ? '21CS001' : '21EC015',
        dept: certificate.student_id === '2' ? 'Computer Science' : 'Electronics'
      }
    });
    setIsLoading(false);
  };

  const handleReset = () => {
    setCertificateId('');
    setVerificationResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
            <p className="text-sm text-gray-500">Verify the authenticity of competition certificates</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter the certificate ID to verify its authenticity and view details. 
          You can find the certificate ID on the certificate document or from the QR code.
        </p>
      </div>

      {/* Verification Form */}
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
                Certificate ID
              </label>
              <input
                type="text"
                id="certificateId"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter certificate ID (e.g., CERT-2024-001)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Verify
                  </>
                )}
              </button>
              
              {(verificationResult || error) && (
                <button
                  onClick={handleReset}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Status Header */}
            <div className={`p-6 ${
              verificationResult.certificate.issue_status === 'issued'
                ? 'bg-green-50 border-b border-green-200'
                : verificationResult.certificate.issue_status === 'revoked'
                ? 'bg-red-50 border-b border-red-200'
                : 'bg-yellow-50 border-b border-yellow-200'
            }`}>
              <div className="flex items-center gap-3">
                {verificationResult.certificate.issue_status === 'issued' ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : verificationResult.certificate.issue_status === 'revoked' ? (
                  <XCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <Shield className="w-8 h-8 text-yellow-600" />
                )}
                <div>
                  <h2 className={`text-xl font-bold ${
                    verificationResult.certificate.issue_status === 'issued'
                      ? 'text-green-900'
                      : verificationResult.certificate.issue_status === 'revoked'
                      ? 'text-red-900'
                      : 'text-yellow-900'
                  }`}>
                    {verificationResult.certificate.issue_status === 'issued'
                      ? 'Certificate Verified ✓'
                      : verificationResult.certificate.issue_status === 'revoked'
                      ? 'Certificate Revoked'
                      : 'Certificate In Process'
                    }
                  </h2>
                  <p className={`text-sm ${
                    verificationResult.certificate.issue_status === 'issued'
                      ? 'text-green-700'
                      : verificationResult.certificate.issue_status === 'revoked'
                      ? 'text-red-700'
                      : 'text-yellow-700'
                  }`}>
                    {verificationResult.certificate.issue_status === 'issued'
                      ? 'This certificate is authentic and valid'
                      : verificationResult.certificate.issue_status === 'revoked'
                      ? 'This certificate has been revoked and is no longer valid'
                      : 'This certificate is still being processed'
                    }
                  </p>
                </div>
              </div>

              {verificationResult.certificate.issue_status === 'revoked' && verificationResult.certificate.revoke_reason && (
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Reason for revocation:</strong> {verificationResult.certificate.revoke_reason}
                  </p>
                </div>
              )}
            </div>

            {/* Certificate Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <User className="w-5 h-5" />
                    Student Information
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-2 font-medium">{verificationResult.student.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Registration No:</span>
                      <span className="ml-2 font-medium">{verificationResult.student.reg_no}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Department:</span>
                      <span className="ml-2 font-medium">{verificationResult.student.dept}</span>
                    </div>
                  </div>
                </div>

                {/* Award Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Award className="w-5 h-5" />
                    Award Information
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Award Type:</span>
                      <span className="ml-2 font-medium">{verificationResult.award.award_type}</span>
                    </div>
                    {verificationResult.award.position && (
                      <div>
                        <span className="text-gray-500">Position:</span>
                        <span className="ml-2 font-medium">#{verificationResult.award.position}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium">{verificationResult.award.team_or_solo}</span>
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Calendar className="w-5 h-5" />
                    Event Information
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Event:</span>
                      <span className="ml-2 font-medium">{verificationResult.event.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-medium">{new Date(verificationResult.event.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Level:</span>
                      <span className="ml-2 font-medium">{verificationResult.event.level}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Organizer:</span>
                      <span className="ml-2 font-medium">{verificationResult.event.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* Certificate Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Building className="w-5 h-5" />
                    Certificate Details
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Certificate ID:</span>
                      <span className="ml-2 font-medium">{verificationResult.certificate.certificate_id}</span>
                    </div>
                    {verificationResult.certificate.issued_at && (
                      <div>
                        <span className="text-gray-500">Issue Date:</span>
                        <span className="ml-2 font-medium">
                          {new Date(verificationResult.certificate.issued_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 font-medium ${
                        verificationResult.certificate.issue_status === 'issued'
                          ? 'text-green-600'
                          : verificationResult.certificate.issue_status === 'revoked'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}>
                        {verificationResult.certificate.issue_status.charAt(0).toUpperCase() + verificationResult.certificate.issue_status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                For queries regarding this certificate, contact{' '}
                <a href="mailto:office@college.edu" className="text-blue-600 hover:underline">
                  office@college.edu
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Certificates */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Demo Certificate IDs</h3>
          <p className="text-sm text-gray-600 mb-4">
            Try these sample certificate IDs to see the verification system in action:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mockCertificates.map((cert) => (
              <button
                key={cert.id}
                onClick={() => setCertificateId(cert.certificate_id)}
                className="p-3 bg-white rounded border border-gray-200 text-left hover:border-blue-300 transition-colors"
              >
                <p className="font-mono text-sm">{cert.certificate_id}</p>
                <p className={`text-xs mt-1 ${
                  cert.issue_status === 'issued' ? 'text-green-600' :
                  cert.issue_status === 'revoked' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {cert.issue_status}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}