import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, LogOut, Home, Truck, Settings, Users, FileText, 
  Map, Bell, Search, ChevronDown, X, User
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<{id: number, text: string, time: string}[]>([
    { id: 1, text: "Servisni nalog #234 čeka odobrenje", time: "prije 10 min" },
    { id: 2, text: "Vozilo XYZ123 treba redovni servis", time: "prije 2h" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check active route
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div 
        className={`bg-gradient-to-b from-indigo-800 to-indigo-900 text-white fixed md:relative z-30 h-full transition-all duration-300 ease-in-out 
          ${sidebarOpen ? 'w-64' : 'w-20'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-700">
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="flex justify-center items-center bg-white text-indigo-800 w-8 h-8 rounded-md mr-2">
                <Truck size={20} />
              </div>
              <h1 className="text-xl font-bold">Data Avioservis</h1>
            </div>
          )}
          <button 
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileMenuOpen(true);
            }}
            className="p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <nav className="flex-1 pt-5 px-3">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center p-3 rounded-md transition-colors
                  ${isActive('/dashboard') && !isActive('/dashboard/vozila-oprema') && !isActive('/dashboard/servisni-nalozi') && !isActive('/dashboard/firme') && !isActive('/dashboard/lokacije') && !isActive('/dashboard/korisnici') 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'}`}
              >
                <Home size={20} />
                {sidebarOpen && <span className="ml-3">Početna</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/vozila-oprema" 
                className={`flex items-center p-3 rounded-md transition-colors
                  ${isActive('/dashboard/vozila-oprema') 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'}`}
              >
                <Truck size={20} />
                {sidebarOpen && <span className="ml-3">Vozila/Oprema</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/servisni-nalozi" 
                className={`flex items-center p-3 rounded-md transition-colors
                  ${isActive('/dashboard/servisni-nalozi') 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'}`}
              >
                <FileText size={20} />
                {sidebarOpen && <span className="ml-3">Servisni Nalozi</span>}
              </Link>
            </li>
            
            {sidebarOpen && <div className="mt-6 mb-2 px-3 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Administracija
            </div>}
            
            <li>
              <Link 
                to="/dashboard/firme" 
                className={`flex items-center p-3 rounded-md transition-colors
                  ${isActive('/dashboard/firme') 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'}`}
              >
                <Settings size={20} />
                {sidebarOpen && <span className="ml-3">Firme</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/lokacije" 
                className={`flex items-center p-3 rounded-md transition-colors
                  ${isActive('/dashboard/lokacije') 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'}`}
              >
                <Map size={20} />
                {sidebarOpen && <span className="ml-3">Lokacije</span>}
              </Link>
            </li>
            {user?.uloga === 'admin' && (
              <li>
                <Link 
                  to="/dashboard/korisnici" 
                  className={`flex items-center p-3 rounded-md transition-colors
                    ${isActive('/dashboard/korisnici') 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-indigo-100 hover:bg-indigo-700'}`}
                >
                  <Users size={20} />
                  {sidebarOpen && <span className="ml-3">Korisnici</span>}
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-indigo-700 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center p-3 w-full rounded-md hover:bg-indigo-700 text-indigo-100"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Odjava</span>}
          </button>
        </div>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
            </div>
            
            <div className="flex-1 flex justify-end md:justify-between items-center">
              <div className="hidden md:block max-w-xs">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Pretraži..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (showUserMenu) setShowUserMenu(false);
                    }}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">Obavijesti</h3>
                        <span className="text-xs text-gray-500">{notifications.length} nove</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-500">
                            Nema novih obavijesti
                          </div>
                        ) : (
                          notifications.map(notification => (
                            <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                              <p className="text-sm text-gray-800">{notification.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-100 text-center">
                        <button className="text-xs text-indigo-600 font-medium hover:text-indigo-500">
                          Vidi sve obavijesti
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      if (showNotifications) setShowNotifications(false);
                    }}
                    className="flex items-center text-sm rounded-full focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                      {user?.ime?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:flex items-center ml-2">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.ime} {user?.prezime}
                      </span>
                      <ChevronDown size={16} className="ml-1 text-gray-400" />
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.ime} {user?.prezime}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{user?.email}</p>
                      </div>
                      <div className="px-2 py-2">
                        <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left rounded-md">
                          <User size={16} className="mr-2 text-gray-500" />
                          Moj profil
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left rounded-md"
                        >
                          <LogOut size={16} className="mr-2 text-gray-500" />
                          Odjava
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className={`flex-1 overflow-y-auto w-full ${
          isActive('/dashboard/vozila-oprema') || 
          isActive('/dashboard/servisni-nalozi') || 
          isActive('/dashboard/firme') || 
          isActive('/dashboard/lokacije') ||
          isActive('/dashboard/korisnici')
            ? 'p-0' 
            : 'p-6'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 