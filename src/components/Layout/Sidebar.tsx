import { 
  Calendar, 
  Award, 
  FileText, 
  Users, 
  BarChart3, 
  Home,
  Download,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'certificates', label: 'My Certificates', icon: FileText },
    { id: 'profile', label: 'Profile', icon: Users }
  ];

  const staffMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'awards', label: 'Awards', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Download },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    // { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const menuItems = user?.role === 'staff' ? staffMenuItems : studentMenuItems;

  const handleItemClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CC</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Certificate</h2>
              <p className="text-sm text-gray-500">Management</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-900 mb-1">
              {user?.dept}
            </p>
            <p className="text-xs text-gray-500">
              ID: {user?.id_card_no}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}