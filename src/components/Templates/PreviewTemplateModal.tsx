import { X, Download, Check } from 'lucide-react';
import type { Template } from '../../types';

interface PreviewTemplateModalProps {
  template: Template | undefined;
  onClose: () => void;
}

export default function PreviewTemplateModal({ template, onClose }: PreviewTemplateModalProps) {
  if (!template) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Template Not Found</h2>
          <p className="text-gray-600 mb-4">The requested template could not be found.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Sample data for preview
  const sampleData = {
    student_name: 'Arjun Patel',
    register_no: '21CS001',
    id_card_no: 'CS2101',
    department: 'Computer Science',
    program: 'B.Tech Computer Science',
    year: '3',
    event_name: 'Annual Web Development Competition',
    event_level: 'Inter-College',
    category: 'Technical',
    discipline: 'Web Development',
    organizer: 'Computer Science Dept',
    event_date: 'March 15, 2024',
    venue: 'CS Lab Complex',
    coordinator_name: 'Dr. Priya Sharma',
    award_type: 'First',
    position: '1',
    team_or_solo: 'solo',
    performance_details: 'Built innovative e-commerce platform with 95% performance score',
    issue_date: 'March 17, 2024',
    certificate_id: 'CERT-2024-001',
    verify_link: 'https://college.edu/verify/CERT-2024-001',
    principal_name: 'Dr. Rajesh Kumar',
    hod_name: 'Dr. Priya Sharma',
    college_name: 'ABC Engineering College',
    college_address: '123 College Street, City, State - 123456'
  };

  const replaceFields = (text: string) => {
    let result = text;
    Object.entries(sampleData).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    return result;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{template.title}</h2>
            <p className="text-sm text-gray-500">Template Preview with Sample Data</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {/* Handle download */}}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-2 font-medium">{template.certificate_type}</span>
            </div>
            <div>
              <span className="text-gray-500">Scope:</span>
              <span className="ml-2 font-medium capitalize">{template.scope}</span>
            </div>
            <div>
              <span className="text-gray-500">Format:</span>
              <span className="ml-2 font-medium">{template.file_type}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                template.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {template.approved ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Approved
                  </>
                ) : (
                  'Pending Approval'
                )}
              </span>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg" style={{ aspectRatio: '8.5/11' }}>
            <div className="relative h-full flex flex-col">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <span className="text-6xl font-bold text-gray-400 -rotate-45">PREVIEW</span>
              </div>
              
              {/* Certificate Content */}
              <div className="relative z-10 flex flex-col">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">CC</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {replaceFields(template.fields_json.title)}
                  </h1>
                  <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                </div>

                {/* Body */}
                <div className="text-center mb-8 px-4">
                  <p className="text-lg leading-relaxed text-gray-800">
                    {replaceFields(template.fields_json.body)}
                  </p>
                </div>

                {/* Footer Text */}
                <div className="text-center mb-8">
                  <p className="text-base text-gray-700">
                    {replaceFields(template.fields_json.footer)}
                  </p>
                </div>

                {/* Signature Section */}
                <div className="mt-auto pt-8">
                  {/* Digital Signatures Section */}
                  {template.fields_json.signatures && template.fields_json.signatures.length > 0 && (
                    <div className="flex justify-between items-end mb-6 px-8">
                      {template.fields_json.signatures.map((signature: any) => (
                        <div key={signature.role} className="text-center">
                          <div className="w-24 h-12 mb-2 flex items-center justify-center">
                            <img
                              src={signature.data}
                              alt={`${signature.role} signature`}
                              className="max-h-10 max-w-20 object-contain"
                            />
                          </div>
                          <div className="w-24 h-0.5 bg-gray-400 mb-1"></div>
                          <p className="text-sm font-medium capitalize">{signature.role}</p>
                          {/* {signature.role === 'principal' && (
                            <p className="text-xs text-gray-600">(Seal)</p>
                          )} */}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Default Signature Placeholders if no signatures configured */}
                  {(!template.fields_json.signatures || template.fields_json.signatures.length === 0) && (
                    <div className="flex justify-between items-end px-8">
                      <div className="text-center">
                        <div className="w-24 h-0.5 bg-gray-400 mb-2"></div>
                        <p className="text-sm font-medium">HOD</p>
                        <p className="text-xs text-gray-600">{sampleData.hod_name}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-24 h-0.5 bg-gray-400 mb-2"></div>
                        <p className="text-sm font-medium">Coordinator</p>
                        <p className="text-xs text-gray-600">{sampleData.coordinator_name}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-24 h-0.5 bg-gray-400 mb-2"></div>
                        <p className="text-sm font-medium">Principal</p>
                        <p className="text-xs text-gray-600">{sampleData.principal_name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Verification */}
                <div className="text-center mt-8 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Verification: Scan QR or visit {sampleData.verify_link}
                  </p>
                  <p className="text-xs text-gray-500">
                    Certificate ID: {sampleData.certificate_id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Field Mapping */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Field Mappings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {Object.entries(sampleData).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <code className="bg-white px-2 py-1 rounded border text-blue-600">
                    {`{${key}}`}
                  </code>
                  <span className="text-gray-600">→</span>
                  <span className="text-gray-800 truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}