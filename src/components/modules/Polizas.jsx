import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus, 
  CheckCircle, 
  XCircle,
  Users,
  Calendar
} from 'lucide-react';

const Polizas = ({ polizas, setPolizas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');

  const filteredPolizas = polizas.filter(poliza => {
    const matchesSearch = poliza.titular.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poliza.numeroPoliza.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todas' || poliza.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Activa': return '#2d5016';
      case 'Pendiente': return '#b7541a';
      case 'Vencida': return '#991b1b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Activa': return <CheckCircle className="w-4 h-4" />;
      case 'Pendiente': return <Calendar className="w-4 h-4" />;
      case 'Vencida': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#e6eef7'}}>
              <FileText className="w-6 h-6" style={{color: '#1e3a72'}} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Pólizas</h2>
              <p className="text-gray-600">Administra todas las pólizas de seguros activas</p>
            </div>
          </div>
          <button className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors" style={{backgroundColor: '#1e3a72'}}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Póliza
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por titular o número de póliza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
            >
              <option value="todas">Todas las pólizas</option>
              <option value="Activa">Activas</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Vencida">Vencidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pólizas</p>
              <p className="text-2xl font-bold text-gray-900">{polizas.length}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activas</p>
              <p className="text-2xl font-bold" style={{color: '#2d5016'}}>
                {polizas.filter(p => p.estado === 'Activa').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8" style={{color: '#2d5016'}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold" style={{color: '#b7541a'}}>
                {polizas.filter(p => p.estado === 'Pendiente').length}
              </p>
            </div>
            <Calendar className="w-8 h-8" style={{color: '#b7541a'}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vencidas</p>
              <p className="text-2xl font-bold" style={{color: '#991b1b'}}>
                {polizas.filter(p => p.estado === 'Vencida').length}
              </p>
            </div>
            <XCircle className="w-8 h-8" style={{color: '#991b1b'}} />
          </div>
        </div>
      </div>

      {/* Lista de pólizas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Pólizas ({filteredPolizas.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Póliza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolizas.map((poliza, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {poliza.numeroPoliza}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {poliza.titular}
                        </div>
                        <div className="text-sm text-gray-500">
                          {poliza.telefono}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{poliza.tipoSeguro}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${poliza.prima}</div>
                    <div className="text-sm text-gray-500">mensual</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {poliza.vencimiento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{backgroundColor: getStatusColor(poliza.estado)}}
                    >
                      {getStatusIcon(poliza.estado)}
                      <span className="ml-1">{poliza.estado}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPolizas.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-2">No se encontraron pólizas</p>
            <p className="text-sm text-gray-400">
              {searchTerm ? 'Intenta con un término de búsqueda diferente' : 'Comienza creando una nueva póliza'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Polizas;