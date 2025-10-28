import { useState } from 'react';
import { Plus, Calendar, MapPin, Users, MoreVertical, CreditCard as Edit2, Archive, Trash2 } from 'lucide-react';
import type { CompetitionEvent } from '../../types';
import { mockEvents } from '../../data/mockData';
import CreateEventModal from './CreateEventModal';

export default function EventsList() {
  const [events, setEvents] = useState<CompetitionEvent[]>(mockEvents);
  const [showModal, setShowModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CompetitionEvent | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);

  const filteredEvents = events.filter(event => 
    filter === 'all' || event.status === filter
  );

  const handleFormSubmit = (eventData: Partial<CompetitionEvent>) => {
    if (eventToEdit) {
      // Logic to update an existing event
      setEvents(prev =>
        prev.map(event =>
          event.id === eventToEdit.id ? { ...event, ...eventData } : event
        )
      );
    } else {
      // Logic to create a new event
      const newEvent: CompetitionEvent = {
        id: Date.now().toString(),
        title: eventData.title!,
        level: eventData.level!,
        category: eventData.category!,
        discipline: eventData.discipline!,
        organizer: eventData.organizer!,
        date: eventData.date!,
        venue: eventData.venue,
        coordinator_name: eventData.coordinator_name,
        notes: eventData.notes,
        status: 'draft',
        created_by: '1', // Mock user ID
        created_at: new Date().toISOString()
      };
      setEvents(prev => [newEvent, ...prev]);
    }
    
    // Close modal and reset editing state
    setShowModal(false);
    setEventToEdit(null);
  };

  const openCreateModal = () => {
    setEventToEdit(null);
    setShowModal(true);
  };

  const openEditModal = (event: CompetitionEvent) => {
    setEventToEdit(event);
    setShowModal(true);
    setShowActionsFor(null);
  };

  const handleStatusUpdate = (eventId: string, newStatus: CompetitionEvent['status']) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );
    setShowActionsFor(null);
  };

  const handleDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setShowActionsFor(null);
  };

  const getStatusColor = (status: CompetitionEvent['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competition Events</h1>
          <p className="text-gray-600">Manage competition events and track their progress.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === status
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'All Events' : status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'all' ? ` (${events.length})` : ` (${events.filter(e => e.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No events yet' : `No ${filter} events`}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Create your first competition event to get started.' 
                : `No events with ${filter} status found.`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Competition Event
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.level}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {event.discipline}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {event.organizer}
                      </span>
                    </div>

                    {event.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        {event.notes}
                      </p>
                    )}
                  </div>

                  <div className="relative ml-4">
                    <button
                      onClick={() => setShowActionsFor(showActionsFor === event.id ? null : event.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {showActionsFor === event.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => openEditModal(event)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Event
                        </button>
                        
                        {event.status === 'draft' && (
                          <button
                            onClick={() => handleStatusUpdate(event.id, 'published')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Calendar className="w-4 h-4" />
                            Publish Event
                          </button>
                        )}
                        
                        {event.status === 'published' && (
                          <button
                            onClick={() => handleStatusUpdate(event.id, 'archived')}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                            Archive Event
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Event
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Modal (for both create and edit) */}
      {showModal && (
        <CreateEventModal
          onClose={() => {
            setShowModal(false);
            setEventToEdit(null);
          }}
          onSubmit={handleFormSubmit}
          eventToEdit={eventToEdit}
        />
      )}
    </div>
  );
}