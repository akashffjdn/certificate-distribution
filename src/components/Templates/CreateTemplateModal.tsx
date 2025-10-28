import React, { useState } from 'react';
import { X, Info, Settings } from 'lucide-react';
import type { Template } from '../../types';
import SignatureManager from './SignatureManager';

interface CreateTemplateModalProps {
  onClose: () => void;
  onSubmit: (templateData: Partial<Template>) => void;
}

export default function CreateTemplateModal({ onClose, onSubmit }: CreateTemplateModalProps) {
  const [activeTab, setActiveTab] = useState<'template' | 'signatures' | 'settings'>('template');
  const [formData, setFormData] = useState({
    title: '',
    scope: 'college' as Template['scope'],
    file_type: '.pdf' as Template['file_type'],
    template_title: 'COMPETITION ACHIEVEMENT CERTIFICATE',
    template_body: 'This is to certify that {student_name} (Reg No {register_no}), {program}, {department}, has secured {award_type} (Rank {position}) in {event_name} ({discipline}) held on {event_date} at {venue}, organized by {organizer}.\n\nIssued on {issue_date}.',
    template_footer: 'Verification: Scan QR or visit {verify_link} (ID: {certificate_id})',
    visibility: 'college' as 'department' | 'college',
    field_validation: true,
    allow_edits_after_approval: false,
    enable_signatures: true
  });
  
  const [signatures, setSignatures] = useState<any[]>([]);

  const availableFields = [
    // Student fields
    '{student_name}', '{register_no}', '{id_card_no}', '{department}', '{program}', '{year}',
    // Event fields
    '{event_name}', '{event_level}', '{category}', '{discipline}', '{organizer}', '{event_date}', '{venue}', '{coordinator_name}',
    // Award fields
    '{award_type}', '{position}', '{team_or_solo}', '{performance_details}',
    // System fields
    '{issue_date}', '{certificate_id}', '{qr_code}', '{verify_link}', '{principal_name}', '{hod_name}', '{college_name}', '{college_address}'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fields_json = {
      title: formData.template_title,
      body: formData.template_body,
      footer: formData.template_footer,
      signatures: signatures,
      settings: {
        visibility: formData.visibility,
        field_validation: formData.field_validation,
        allow_edits_after_approval: formData.allow_edits_after_approval,
        enable_signatures: formData.enable_signatures
      }
    };
    
    onSubmit({
      title: formData.title,
      scope: formData.scope,
      file_type: formData.file_type,
      fields_json
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const insertField = (field: string, targetField: 'template_title' | 'template_body' | 'template_footer') => {
    setFormData(prev => ({
      ...prev,
      [targetField]: prev[targetField] + field
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Certificate Template</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'template', label: 'Template', icon: null },
              { id: 'signatures', label: 'E-Signatures', icon: null },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {activeTab === 'template' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Competition Achievement - Standard"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-2">
                    Scope *
                  </label>
                  <select
                    id="scope"
                    name="scope"
                    required
                    value={formData.scope}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="dept">Department</option>
                    <option value="college">College</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="file_type" className="block text-sm font-medium text-gray-700 mb-2">
                  File Type *
                </label>
                <select
                  id="file_type"
                  name="file_type"
                  required
                  value={formData.file_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value=".pdf">PDF (.pdf)</option>
                  <option value=".docx">Word Document (.docx)</option>
                  <option value=".png">PNG Image (.png)</option>
                </select>
              </div>

              {/* Available Fields Reference */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Available Fields</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {availableFields.map((field) => (
                        <code key={field} className="bg-white px-2 py-1 rounded text-blue-800 border border-blue-200">
                          {field}
                        </code>
                      ))}
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                      Click on any field below to insert these placeholders into your template.
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Content */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="template_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    id="template_title"
                    name="template_title"
                    required
                    value={formData.template_title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {['{college_name}', '{certificate_id}'].map((field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => insertField(field, 'template_title')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="template_body" className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Body *
                  </label>
                  <textarea
                    id="template_body"
                    name="template_body"
                    required
                    rows={6}
                    value={formData.template_body}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {['{student_name}', '{register_no}', '{program}', '{department}', '{award_type}', '{position}', '{event_name}', '{discipline}', '{event_date}', '{venue}', '{organizer}', '{issue_date}'].map((field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => insertField(field, 'template_body')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="template_footer" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Footer
                  </label>
                  <textarea
                    id="template_footer"
                    name="template_footer"
                    rows={2}
                    value={formData.template_footer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {['{verify_link}', '{certificate_id}', '{qr_code}'].map((field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => insertField(field, 'template_footer')}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'signatures' && (
            <SignatureManager
              signatures={signatures}
              onSignaturesChange={setSignatures}
            />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Template Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                      Template Visibility
                    </label>
                    <select
                      id="visibility"
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="department">Department-Specific</option>
                      <option value="college">College-Wide</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Department-specific templates are only visible to the creating department
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="field_validation"
                        name="field_validation"
                        checked={formData.field_validation}
                        onChange={(e) => setFormData(prev => ({ ...prev, field_validation: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="field_validation" className="ml-2 block text-sm text-gray-900">
                        Enable Field Validation
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">
                      Require all placeholder fields to be filled when generating certificates
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enable_signatures"
                        name="enable_signatures"
                        checked={formData.enable_signatures}
                        onChange={(e) => setFormData(prev => ({ ...prev, enable_signatures: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enable_signatures" className="ml-2 block text-sm text-gray-900">
                        Enable Digital Signatures
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">
                      Include digital signatures in the certificate footer
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allow_edits_after_approval"
                        name="allow_edits_after_approval"
                        checked={formData.allow_edits_after_approval}
                        onChange={(e) => setFormData(prev => ({ ...prev, allow_edits_after_approval: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allow_edits_after_approval" className="ml-2 block text-sm text-gray-900">
                        Allow Edits After Approval
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">
                      Template can be modified even after it's approved
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {activeTab === 'template' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Template Preview</h4>
            <div className="bg-white rounded border p-4 text-sm">
              <div className="text-center font-bold text-lg mb-4">
                {formData.template_title}
              </div>
              <div className="mb-4 leading-relaxed">
                {formData.template_body}
              </div>
              
              {/* Signature Section */}
              {formData.enable_signatures && signatures.length > 0 && (
                <div className="flex justify-between items-center mt-8 mb-4 px-4">
                  {['principal', 'hod', 'coordinator'].map((role) => {
                    const signature = signatures.find(sig => sig.role === role);
                    return (
                      <div key={role} className="text-center">
                        <div className="w-20 h-8 bg-gray-100 rounded mb-1 flex items-center justify-center text-xs">
                          {signature ? '✓ Signed' : role.toUpperCase()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {formData.template_footer && (
                <div className="text-sm text-gray-600 border-t pt-2">
                  {formData.template_footer}
                </div>
              )}
            </div>
          </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {activeTab !== 'template' && (
              <button
                type="button"
                onClick={() => setActiveTab('template')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Template
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}