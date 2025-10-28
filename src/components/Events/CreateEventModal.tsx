import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CompetitionEvent } from '../../types';

interface CreateEventModalProps {
  onClose: () => void;
  onSubmit: (eventData: Partial<CompetitionEvent>) => void;
  eventToEdit?: CompetitionEvent | null; // Make it possible to pass an event to edit
}

export default function CreateEventModal({ onClose, onSubmit, eventToEdit }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    level: 'Intra-College' as CompetitionEvent['level'],
    category: 'Technical' as CompetitionEvent['category'],
    discipline: '',
    organizer: '',
    date: '',
    venue: '',
    coordinator_name: '',
    notes: ''
  });

  const isEditMode = !!eventToEdit;

  useEffect(() => {
    // If an event is passed, populate the form with its data
    if (isEditMode) {
      setFormData({
        title: eventToEdit.title,
        level: eventToEdit.level,
        category: eventToEdit.category,
        discipline: eventToEdit.discipline,
        organizer: eventToEdit.organizer,
        date: eventToEdit.date,
        venue: eventToEdit.venue || '',
        coordinator_name: eventToEdit.coordinator_name || '',
        notes: eventToEdit.notes || ''
      });
    }
  }, [eventToEdit, isEditMode]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Competition Event' : 'Create New Competition Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                id="level"
                name="level"
                required
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Intra-College">Intra-College</option>
                <option value="Inter-College">Inter-College</option>
                <option value="State">State</option>
                <option value="National">National</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Technical">Technical</option>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="discipline" className="block text-sm font-medium text-gray-700 mb-2">
                Discipline *
              </label>
              <input
                type="text"
                id="discipline"
                name="discipline"
                required
                value={formData.discipline}
                onChange={handleChange}
                placeholder="e.g., Web Development, Football, Dance"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
                Organizer *
              </label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                required
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Department/Club/External"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Event venue"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="coordinator_name" className="block text-sm font-medium text-gray-700 mb-2">
                Coordinator/Guide Name
              </label>
              <input
                type="text"
                id="coordinator_name"
                name="coordinator_name"
                value={formData.coordinator_name}
                onChange={handleChange}
                placeholder="Coordinator or guide name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about the event"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
              {isEditMode ? 'Save Changes' : 'Save as Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}