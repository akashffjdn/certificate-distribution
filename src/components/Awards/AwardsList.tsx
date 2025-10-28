import React, { useState } from 'react';
import { Plus, Trophy, Users, MoreVertical, Edit2, Check, Clock, Trash2 } from 'lucide-react';
import type { CompetitionAward, CompetitionEvent } from '../../types';
import { mockAwards, mockEvents, mockRecipients } from '../../data/mockData';
import CreateAwardModal from './CreateAwardModal';
import ManageRecipientsModal from './ManageRecipientsModal';

export default function AwardsList() {
  const [awards, setAwards] = useState<CompetitionAward[]>(mockAwards);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);
  const [awardToEdit, setAwardToEdit] = useState<CompetitionAward | null>(null);

  const events = mockEvents.filter(e => e.status === 'published');
  const filteredAwards = selectedEvent === 'all' 
    ? awards 
    : awards.filter(award => award.event_id === selectedEvent);

  const getAwardRecipients = (awardId: string) => {
    return mockRecipients.filter(r => r.award_id === awardId);
  };

  const getStatusColor = (status: CompetitionAward['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: CompetitionAward['status']) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'ready':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const handleCreateAward = (awardData: Partial<CompetitionAward>) => {
    const newAward: CompetitionAward = {
      id: Date.now().toString(),
      event_id: awardData.event_id!,
      award_type: awardData.award_type!,
      position: awardData.position,
      team_or_solo: awardData.team_or_solo!,
      performance_details: awardData.performance_details,
      status: 'draft',
      created_at: new Date().toISOString(),
      template_id: awardData.template_id,
    };
    
    setAwards(prev => [newAward, ...prev]);
    setShowCreateModal(false);
  };
  
  const handleEditAward = (awardData: Partial<CompetitionAward>) => {
      setAwards(prev => prev.map(award => award.id === awardToEdit?.id ? {...award, ...awardData} : award));
      setShowCreateModal(false);
      setAwardToEdit(null);
  }

  const handleStatusUpdate = (awardId: string, newStatus: CompetitionAward['status']) => {
    setAwards(prev => 
      prev.map(award => 
        award.id === awardId ? { ...award, status: newStatus } : award
      )
    );
    setShowActionsFor(null);
  };

  const handleDelete = (awardId: string) => {
    if (confirm('Are you sure you want to delete this award? This action cannot be undone.')) {
      setAwards(prev => prev.filter(award => award.id !== awardId));
      setShowActionsFor(null);
    }
  };

  const openEditModal = (award: CompetitionAward) => {
      setAwardToEdit(award);
      setShowCreateModal(true);
      setShowActionsFor(null);
  }
  
  const selectedAwardForModal = awards.find(a => a.id === showRecipientsModal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competition Awards</h1>
          <p className="text-gray-600">Manage awards and recipients for competition events.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Award
        </button>
      </div>

      {/* Event Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Events ({awards.length})</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title} ({awards.filter(a => a.event_id === event.id).length})
            </option>
          ))}
        </select>
      </div>

      {/* Awards List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredAwards.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedEvent === 'all' ? 'No awards yet' : 'No awards for this event'}
            </h3>
            <p className="text-gray-500 mb-4">
              {selectedEvent === 'all' 
                ? 'Create your first award to get started.' 
                : 'Add awards for this event to track winners and participants.'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Award
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAwards.map((award) => {
              const event = events.find(e => e.id === award.event_id);
              const recipients = getAwardRecipients(award.id);
              
              return (
                <div key={award.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(award.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {award.award_type}
                          {award.position && ` (Position ${award.position})`}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(award.status)}`}>
                          {award.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Event:</span>
                          <span className="ml-2">{event?.title || 'Unknown Event'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>
                          <span className="ml-2 capitalize">{award.team_or_solo}</span>
                        </div>
                        <div>
                          <span className="font-medium">Recipients:</span>
                          <span className="ml-2">{recipients.length} student{recipients.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {award.performance_details && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Performance Details:</span> {award.performance_details}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowRecipientsModal(award.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <Users className="w-4 h-4" />
                          Manage Recipients ({recipients.length})
                        </button>
                        
                        {award.status === 'draft' && recipients.length > 0 && (
                          <button
                            onClick={() => handleStatusUpdate(award.id, 'ready')}
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                          >
                            Mark Ready
                          </button>
                        )}
                        
                        {award.status === 'ready' && (
                          <button
                            onClick={() => handleStatusUpdate(award.id, 'approved')}
                            className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                          >
                            Approve Award
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() => setShowActionsFor(showActionsFor === award.id ? null : award.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {showActionsFor === award.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={() => openEditModal(award)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit Award
                          </button>
                          
                          <button
                            onClick={() => handleDelete(award.id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Award
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Award Modal */}
      {showCreateModal && (
        <CreateAwardModal
          onClose={() => {setShowCreateModal(false); setAwardToEdit(null)}}
          onSubmit={awardToEdit ? handleEditAward : handleCreateAward}
          events={events}
          awardToEdit={awardToEdit}
          eventScope={selectedEvent !== 'all' ? selectedEvent : ''}
        />
      )}

      {/* Manage Recipients Modal */}
      {showRecipientsModal && (
        <ManageRecipientsModal
          awardId={showRecipientsModal}
          onClose={() => setShowRecipientsModal(null)}
          event={events.find(e => e.id === selectedAwardForModal?.event_id)}
          awardType={selectedAwardForModal?.team_or_solo}
        />
      )}
    </div>
  );
}