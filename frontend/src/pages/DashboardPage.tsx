import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Truck, FileText, Building2, MapPin, User, 
  ArrowUp, ArrowDown, Clock, CheckCircle, AlertTriangle,
  Calendar, TrendingUp, Wrench, BarChart3, Activity
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for the dashboard
  const stats = {
    vehiclesCount: 24,
    vehiclesChange: 2,
    activeServices: 5, 
    completedServices: 148,
    pendingServices: 3,
    companiesCount: 12,
    locationsCount: 7,
    usersCount: 4
  };
  
  const recentServices = [
    { id: 1, vehicle: 'Mercedes Actros', problem: 'Redovni servis', status: 'Dovršeno', date: '12.05.2023.', color: 'green' },
    { id: 2, vehicle: 'Iveco Daily', problem: 'Zamjena kočnica', status: 'U radu', date: '14.05.2023.', color: 'yellow' },
    { id: 3, vehicle: 'Volvo FH16', problem: 'Dijagnostika motora', status: 'Čeka odobrenje', date: '15.05.2023.', color: 'red' },
  ];
  
  // Function to determine the color based on percentage
  const getUsageColorClass = (percentage: number) => {
    if (percentage < 33) return 'bg-emerald-500';
    if (percentage < 66) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dobrodošli, {user?.ime}!</h1>
          <p className="text-gray-600 mt-1">Evo pregleda stanja vaših vozila i servisa</p>
        </div>
        <div className="text-sm text-gray-500">
          <span className="flex items-center">
            <Calendar size={16} className="mr-1.5" />
            {new Date().toLocaleDateString('hr-HR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Ukupno vozila/opreme</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.vehiclesCount}</h3>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Truck size={20} className="text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            {stats.vehiclesChange > 0 ? (
              <span className="text-green-600 flex items-center">
                <ArrowUp size={16} className="mr-1" /> +{stats.vehiclesChange} u zadnjih 30 dana
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <ArrowDown size={16} className="mr-1" /> {stats.vehiclesChange} u zadnjih 30 dana
              </span>
            )}
          </div>
        </div>
        
        <div className="card border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Aktivni servisi</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.activeServices}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm space-x-3">
            <span className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div> 
              <span className="text-gray-600">{stats.completedServices} završenih</span>
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div> 
              <span className="text-gray-600">{stats.pendingServices} na čekanju</span>
            </span>
          </div>
        </div>
        
        <div className="card border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Firme</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.companiesCount}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Building2 size={20} className="text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-12 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full ${i < stats.companiesCount ? 'bg-emerald-500' : 'bg-gray-200'}`}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="card border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Lokacije</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.locationsCount}</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <MapPin size={20} className="text-amber-600" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-12 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full ${i < stats.locationsCount ? 'bg-amber-500' : 'bg-gray-200'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent service orders */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Nedavni servisni nalozi</h2>
            <Link to="/dashboard/servisni-nalozi" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
              Vidi sve
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Vozilo</th>
                  <th className="px-4 py-2">Problem</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Datum</th>
                  <th className="px-4 py-2 text-right">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentServices.map(service => (
                  <tr key={service.id} className="text-sm text-gray-800">
                    <td className="px-4 py-3">{service.vehicle}</td>
                    <td className="px-4 py-3">{service.problem}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${service.color === 'green' ? 'bg-green-100 text-green-800' : 
                        service.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                        {service.color === 'green' && <CheckCircle size={12} className="mr-1" />}
                        {service.color === 'yellow' && <Clock size={12} className="mr-1" />}
                        {service.color === 'red' && <AlertTriangle size={12} className="mr-1" />}
                        {service.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{service.date}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Detalji</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Vehicle Status */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Status flote</h2>
            <Link to="/dashboard/vozila-oprema" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
              Detalji
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Ispravna vozila</span>
                <span className="text-green-600">72%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Potreban servis</span>
                <span className="text-yellow-600">18%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Van funkcije</span>
                <span className="text-red-600">10%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Nadolazeći servisi</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Truck size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Mercedes Actros</p>
                      <p className="text-xs text-gray-500">Zamjena ulja</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">23.05.2023</span>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Truck size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Volvo FH16</p>
                      <p className="text-xs text-gray-500">Redovni servis</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">28.05.2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link 
          to="/dashboard/vozila-oprema" 
          className="card p-5 hover:bg-indigo-50 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg mr-4 group-hover:bg-indigo-200 transition-colors">
              <Truck size={24} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Dodaj novo vozilo</h3>
              <p className="text-sm text-gray-500">Evidentirajte novu opremu</p>
            </div>
          </div>
          <TrendingUp size={18} className="text-indigo-600" />
        </Link>
        
        <Link 
          to="/dashboard/servisni-nalozi" 
          className="card p-5 hover:bg-blue-50 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Novi servisni nalog</h3>
              <p className="text-sm text-gray-500">Kreirajte novi nalog</p>
            </div>
          </div>
          <TrendingUp size={18} className="text-blue-600" />
        </Link>
        
        <Link 
          to="/dashboard/firme" 
          className="card p-5 hover:bg-emerald-50 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg mr-4 group-hover:bg-emerald-200 transition-colors">
              <Building2 size={24} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Dodaj novu firmu</h3>
              <p className="text-sm text-gray-500">Upravljajte poslovnim partnerima</p>
            </div>
          </div>
          <TrendingUp size={18} className="text-emerald-600" />
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage; 