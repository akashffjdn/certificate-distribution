import React, { useState, useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import type { CompetitionAward, CompetitionEvent } from '../../types';
import { mockTemplates } from '../../data/mockData';
import PreviewTemplateModal from '../Templates/PreviewTemplateModal';

interface CreateAwardModalProps {
  onClose: () => void;
  onSubmit: (awardData: Partial<CompetitionAward>) => void;
  events: CompetitionEvent[];
  awardToEdit?: CompetitionAward | null;
  eventScope?: string;
}

export default function CreateAwardModal({ onClose, onSubmit, events, awardToEdit, eventScope }: CreateAwardModalProps) {
  const [formData, setFormData] = useState({
    event_id: '',
    award_type: 'First' as CompetitionAward['award_type'],
    position: '',
    team_or_solo: 'solo' as CompetitionAward['team_or_solo'],
    performance_details: '',
    template_id: ''
  });
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const isEditMode = !!awardToEdit;

  useEffect(() => {
    if (isEditMode && awardToEdit) {
      setFormData({
        event_id: awardToEdit.event_id,
        award_type: awardToEdit.award_type,
        position: awardToEdit.position ? String(awardToEdit.position) : '',
        team_or_solo: awardToEdit.team_or_solo,
        performance_details: awardToEdit.performance_details || '',
        template_id: awardToEdit.template_id || ''
      });
    } else if (eventScope) {
        setFormData(prev => ({...prev, event_id: eventScope}))
    }
  }, [awardToEdit, isEditMode, eventScope]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.template_id) {
        setError('Please select a certificate template for this award.');
        return;
    }
    setError('');
    onSubmit({
      ...formData,
      position: formData.position ? parseInt(formData.position) : undefined
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedEvent = events.find(e => e.id === formData.event_id);
  const relevantTemplates = mockTemplates.filter(t => t.scope === 'college' || t.scope === selectedEvent?.organizer.toLowerCase().replace(' dept', ''));

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? 'Edit Award' : 'Add New Award'}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="event_id" className="block text-sm font-medium text-gray-700 mb-2">
              Competition Event *
            </label>
            <select
              id="event_id"
              name="event_id"
              required
              value={formData.event_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isEditMode}
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="award_type" className="block text-sm font-medium text-gray-700 mb-2">
                Award Type *
              </label>
              <select
                id="award_type"
                name="award_type"
                required
                value={formData.award_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Winner">Winner</option>
                <option value="Runner-Up">Runner-Up</option>
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
                <option value="Participation">Participation</option>
                <option value="Special Mention">Special Mention</option>
              </select>
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Position/Rank
              </label>
              <input
                type="number"
                id="position"
                name="position"
                min="1"
                max="100"
                value={formData.position}
                onChange={handleChange}
                placeholder="1, 2, 3..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for non-ranked awards</p>
            </div>
          </div>

          <div>
            <label htmlFor="team_or_solo" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="team_or_solo"
              name="team_or_solo"
              required
              value={formData.team_or_solo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="solo">Individual/Solo</option>
              <option value="team">Team</option>
            </select>
          </div>

          <div>
            <label htmlFor="template_id" className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Template *
            </label>
            <div className="flex items-center gap-2">
            <select
              id="template_id"
              name="template_id"
              required
              value={formData.template_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <option value="">Select a template</option>
              {relevantTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
            {formData.template_id && (
                <button type='button' onClick={() => setShowPreview(true)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                    <Eye className="w-5 h-5 text-gray-600"/>
                </button>
            )}
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>

          <div>
            <label htmlFor="performance_details" className="block text-sm font-medium text-gray-700 mb-2">
              Performance Details
            </label>
            <textarea
              id="performance_details"
              name="performance_details"
              rows={3}
              value={formData.performance_details}
              onChange={handleChange}
              placeholder="Score, time, theme, or other performance details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditMode ? 'Save Changes' : 'Add Award'}
            </button>
          </div>
        </form>
      </div>
    </div>
    {showPreview && (
        <PreviewTemplateModal
            template={relevantTemplates.find(t => t.id === formData.template_id)}
            onClose={() => setShowPreview(false)}
        />
    )}
    </>
  );
}