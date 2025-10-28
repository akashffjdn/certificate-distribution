import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Trash2, User, Upload } from 'lucide-react';
import type { CompetitionAwardRecipient, User as UserType, CompetitionEvent } from '../../types';
import { mockRecipients } from '../../data/mockData';

interface ManageRecipientsModalProps {
  awardId: string;
  onClose: () => void;
  event?: CompetitionEvent;
  awardType?: 'team' | 'solo';
}

// Mock users for search, expanded for better filtering
const mockUsers: UserType[] = [
  { id: '2', role: 'student', id_card_no: 'CS2101', reg_no: '21CS001', name: 'Arjun Patel', dept: 'Computer Science', program: 'B.Tech CS', year: 3, email: 'arjun.patel@college.edu', status: 'active', created_at: '2024-01-01T00:00:00Z' },
  { id: '3', role: 'student', id_card_no: 'EC2102', reg_no: '21EC015', name: 'Sneha Reddy', dept: 'Electronics', program: 'B.Tech ECE', year: 3, email: 'sneha.reddy@college.edu', status: 'active', created_at: '2024-01-01T00:00:00Z' },
  { id: '4', role: 'student', id_card_no: 'ME2103', reg_no: '21ME025', name: 'Rahul Kumar', dept: 'Mechanical', program: 'B.Tech ME', year: 3, email: 'rahul.kumar@college.edu', status: 'active', created_at: '2024-01-01T00:00:00Z' },
  { id: '5', role: 'student', id_card_no: 'CS2205', reg_no: '22CS011', name: 'Priya Singh', dept: 'Computer Science', program: 'B.Tech CS', year: 2, email: 'priya.singh@college.edu', status: 'active', created_at: '2024-01-01T00:00:00Z' },
  { id: '6', role: 'student', id_card_no: 'CE2301', reg_no: '23CE001', name: 'Ankit Sharma', dept: 'Civil', program: 'B.Tech Civil', year: 1, email: 'ankit.sharma@college.edu', status: 'active', created_at: '2024-01-01T00:00:00Z' },
];

export default function ManageRecipientsModal({ awardId, onClose, event, awardType = 'solo' }: ManageRecipientsModalProps) {
  const [recipients, setRecipients] = useState<CompetitionAwardRecipient[]>(mockRecipients.filter(r => r.award_id === awardId));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [departmentFilter, setDepartmentFilter] = useState<string>(event?.organizer.replace(' Dept', '') || 'all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const departmentMatch = departmentFilter === 'all' || user.dept === departmentFilter;
      const yearMatch = yearFilter === 'all' || user.year === parseInt(yearFilter);
      const searchMatch = searchQuery.trim().length < 2 || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.reg_no && user.reg_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const isAlreadyRecipient = recipients.some(r => r.student_id === user.id);
      
      return departmentMatch && yearMatch && searchMatch && !isAlreadyRecipient;
    });
  }, [searchQuery, departmentFilter, yearFilter, recipients]);

  const handleAddRecipients = () => {
    if (awardType === 'solo' && selectedStudents.size > 1) {
      alert('Only one recipient can be assigned to a solo award.');
      return;
    }

    const newRecipients: CompetitionAwardRecipient[] = Array.from(selectedStudents).map(studentId => {
      const student = mockUsers.find(u => u.id === studentId);
      return {
        id: Date.now().toString() + studentId,
        award_id: awardId,
        student_id: studentId,
        added_by: '1', // Mock staff ID
        added_at: new Date().toISOString(),
        student
      };
    });
    
    setRecipients(prev => [...prev, ...newRecipients]);
    setSelectedStudents(new Set());
  };

  const handleRemoveRecipient = (recipientId: string) => {
    if (confirm('Are you sure you want to remove this student from the award?')) {
      setRecipients(prev => prev.filter(r => r.id !== recipientId));
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(studentId)) {
        newSelection.delete(studentId);
      } else {
        if (awardType === 'solo') {
          return new Set([studentId]);
        }
        newSelection.add(studentId);
      }
      return newSelection;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Award Recipients</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Reg No, or Email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <select 
                value={departmentFilter} 
                onChange={e => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
             <div>
              <select 
                value={yearFilter} 
                onChange={e => setYearFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
          
          {/* Student Selection Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-y-auto max-h-64">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{awardType === 'team' ? 'Select' : ''}</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((student) => (
                    <tr key={student.id} onClick={() => toggleStudentSelection(student.id)} className={`cursor-pointer ${selectedStudents.has(student.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type={awardType === 'team' ? 'checkbox' : 'radio'}
                          checked={selectedStudents.has(student.id)} 
                          onChange={() => {}}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {student.reg_no} • {student.year} Year
                        <div>
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                           {student.dept}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                   {filteredUsers.length === 0 && (
                    <tr>
                        <td colSpan={3} className="text-center py-8 text-gray-500">
                            No students match the current filters.
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{selectedStudents.size} student(s) selected.</p>
              </div>
              <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                      <Upload className="w-4 h-4"/>
                      Batch Upload (CSV)
                  </button>
                  <button onClick={handleAddRecipients} disabled={selectedStudents.size === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    <Plus className="w-4 h-4 inline-block mr-2"/>
                    Add Recipient(s)
                  </button>
              </div>
            </div>
          </div>
          
          {/* Current Recipients */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Recipients ({recipients.length})</h3>
            {recipients.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recipients added yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recipients.map((recipient) => {
                  const student = mockUsers.find(u => u.id === recipient.student_id);
                  if (!student) return null;
                  return (
                    <div key={recipient.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{student.name} <span className="text-xs text-gray-500">({student.reg_no})</span></p>
                        <p className="text-xs text-gray-500">{student.program} - Year {student.year}</p>
                      </div>
                      <button onClick={() => handleRemoveRecipient(recipient.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}