import { useState } from 'react';
import { Plus, Download, Eye, MoreVertical, Check, X, Upload } from 'lucide-react';
import type { Template } from '../../types';
import { mockTemplates } from '../../data/mockData';
import CreateTemplateModal from './CreateTemplateModal';
import PreviewTemplateModal from './PreviewTemplateModal';

export default function TemplatesList() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);

  const filteredTemplates = templates.filter(template => {
    if (filter === 'approved') return template.approved;
    if (filter === 'pending') return !template.approved;
    return true;
  });

  const handleCreateTemplate = (templateData: Partial<Template>) => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      title: templateData.title!,
      certificate_type: 'Competition',
      scope: templateData.scope!,
      file_type: templateData.file_type!,
      fields_json: templateData.fields_json!,
      uploaded_by: '1', // Mock user ID
      approved: false,
      created_at: new Date().toISOString()
    };
    
    setTemplates(prev => [newTemplate, ...prev]);
    setShowCreateModal(false);
  };

  const handleApprove = (templateId: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === templateId ? { ...template, approved: true } : template
      )
    );
    setShowActionsFor(null);
  };

  const handleReject = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      setShowActionsFor(null);
    }
  };

  const getStatusColor = (approved: boolean) => {
    return approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getFileTypeIcon = (fileType: Template['file_type']) => {
    switch (fileType) {
      case '.pdf':
        return '📄';
      case '.docx':
        return '📝';
      case '.png':
        return '🖼️';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificate Templates</h1>
          <p className="text-gray-600">Manage certificate templates for different types of competitions.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Template Wording Example */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Standard Template Format</h3>
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">COMPETITION ACHIEVEMENT CERTIFICATE</h2>
          </div>
          <div className="text-gray-700 leading-relaxed">
            <p className="mb-4">
              This is to certify that <strong>{'{student_name}'}</strong> (Reg No <strong>{'{register_no}'}</strong>), 
              <strong>{'{program}'}</strong>, <strong>{'{department}'}</strong>, has secured <strong>{'{award_type}'}</strong> 
              (Rank <strong>{'{position}'}</strong>) in <strong>{'{event_name}'}</strong> (<strong>{'{discipline}'}</strong>) 
              held on <strong>{'{event_date}'}</strong> at <strong>{'{venue}'}</strong>, organized by <strong>{'{organizer}'}</strong>.
            </p>
            <p className="mb-4">Issued on <strong>{'{issue_date}'}</strong>.</p>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-sm text-gray-600">
            <span><strong>HOD</strong></span>
            <span><strong>Coordinator/Guide</strong></span>
            <span><strong>Principal</strong> (Seal)</span>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500">
            Verification: Scan QR or visit <strong>{'{verify_link}'}</strong> (ID: <strong>{'{certificate_id}'}</strong>)
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'approved', 'pending'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === status
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'All Templates' : status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'all' 
              ? ` (${templates.length})` 
              : status === 'approved'
              ? ` (${templates.filter(t => t.approved).length})`
              : ` (${templates.filter(t => !t.approved).length})`
            }
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.length === 0 ? (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No templates yet' : `No ${filter} templates`}
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? 'Create your first certificate template to get started.'
                  : `No templates with ${filter} status found.`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create First Template
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getFileTypeIcon(template.file_type)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(template.approved)}`}>
                      {template.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Type:</span>
                      <span className="ml-2">{template.certificate_type}</span>
                    </div>
                    <div>
                      <span className="font-medium">Scope:</span>
                      <span className="ml-2 capitalize">{template.scope}</span>
                    </div>
                    <div>
                      <span className="font-medium">Format:</span>
                      <span className="ml-2">{template.file_type}</span>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <span className="ml-2">{new Date(template.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Fields:</span> {Object.keys(template.fields_json).length} placeholders configured
                    </p>
                    {template.fields_json.signatures && template.fields_json.signatures.length > 0 && (
                      <div>
                        <span className="font-medium">Signatures:</span> {template.fields_json.signatures.length} digital signature{template.fields_json.signatures.length !== 1 ? 's' : ''} configured
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative ml-4">
                  <button
                    onClick={() => setShowActionsFor(showActionsFor === template.id ? null : template.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showActionsFor === template.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => setShowPreviewModal(template.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview Template
                      </button>
                      
                      <button
                        onClick={() => {/* Handle download */}}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      
                      {!template.approved && (
                        <button
                          onClick={() => handleApprove(template.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleReject(template.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowPreviewModal(template.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                
                {template.approved && (
                  <button
                    onClick={() => {/* Handle use template */}}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTemplate}
        />
      )}

      {/* Preview Template Modal */}
      {showPreviewModal && (
        <PreviewTemplateModal
          template={templates.find(t => t.id === showPreviewModal)}
          onClose={() => setShowPreviewModal(null)}
        />
      )}
    </div>
  );
}