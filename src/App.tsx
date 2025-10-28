import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import StaffDashboard from './components/Dashboard/StaffDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import EventsList from './components/Events/EventsList';
import AwardsList from './components/Awards/AwardsList';
import CertificatesList from './components/Certificates/CertificatesList';
import TemplatesList from './components/Templates/TemplatesList';
import ReportsDashboard from './components/Reports/ReportsDashboard';
import VerificationPage from './components/Verification/VerificationPage';

function App() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          {/* <p className="text-gray-600">Loading...</p> */}
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    const isStaff = user.role === 'staff';

    switch (activeTab) {
      case 'dashboard':
        return isStaff ? <StaffDashboard /> : <StudentDashboard />;
      case 'events':
        return isStaff ? <EventsList /> : <StudentDashboard />;
      case 'awards':
        return isStaff ? <AwardsList /> : <StudentDashboard />;
      case 'certificates':
        return <CertificatesList />;
      case 'templates':
        return isStaff ? <TemplatesList /> : <StudentDashboard />;
      case 'reports':
        return isStaff ? <ReportsDashboard /> : <StudentDashboard />;
      case 'verification':
        return <VerificationPage />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-gray-600">This section is coming soon.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Card Number</label>
                <p className="mt-1 text-sm text-gray-900">{user.id_card_no}</p>
              </div>
              {user.reg_no && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <p className="mt-1 text-sm text-gray-900">{user.reg_no}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-sm text-gray-900">{user.dept}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;