import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  DollarSign,
  Calendar
} from 'lucide-react';

const Reclamos = ({ reclamos, setReclamos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const filteredReclamos = reclamos.filter(reclamo => {
    const matchesSearch = reclamo.titular.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamo.numeroReclamo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamo.poliza.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || reclamo.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Aprobado': return '#2d5016';
      case 'En revisión': return '#b7541a';
      case 'Rechazado': return '#991b1b';
      case 'Documentos pendientes': return '#1e3a72';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Aprobado': return <CheckCircle className="w-4 h-4" />;
      case 'En revisión': return <Clock className="w-4 h-4" />;
      case 'Rechazado': return <XCircle className="w-4 h-4" />;
      case 'Documentos pendientes': return <FileText className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#fef3e8'}}>
              <AlertTriangle className="w-6 h-6" style={{color: '#b7541a'}} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Reclamos</h2>
              <p className="text-gray-600">Procesa y gestiona todos los reclamos de seguros</p>
            </div>
          </div>
          <button className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-orange-700 transition-colors" style={{backgroundColor: '#b7541a'}}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Reclamo
          </button>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por titular, número de reclamo o póliza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="todos">Todos los reclamos</option>
              <option value="En revisión">En revisión</option>
              <option value="Aprobado">Aprobados</option>
              <option value="Rechazado">Rechazados</option>
              <option value="Documentos pendientes">Documentos pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reclamos</p>
              <p className="text-2xl font-bold text-gray-900">{reclamos.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Revisión</p>
              <p className="text-2xl font-bold" style={{color: '#b7541a'}}>
                {reclamos.filter(r => r.estado === 'En revisión').length}
              </p>
            </div>
            <Clock className="w-8 h-8" style={{color: '#b7541a'}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-2xl font-bold" style={{color: '#2d5016'}}>
                {reclamos.filter(r => r.estado === 'Aprobado').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8" style={{color: '#2d5016'}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monto Total</p>
              <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>
                ${reclamos.reduce((total, r) => total + r.montoReclamado, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8" style={{color: '#1e3a72'}} />
          </div>
        </div>
      </div>

      {/* Lista de reclamos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Reclamos ({filteredReclamos.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reclamo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Incidente
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
              {filteredReclamos.map((reclamo, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reclamo.numeroReclamo}
                        </div>
                        <div className="text-sm text-gray-500">
                          Póliza: {reclamo.poliza}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {reclamo.titular}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{reclamo.tipoReclamo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${reclamo.montoReclamado.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {reclamo.fechaIncidente}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{backgroundColor: getStatusColor(reclamo.estado)}}
                    >
                      {getStatusIcon(reclamo.estado)}
                      <span className="ml-1">{reclamo.estado}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReclamos.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-2">No se encontraron reclamos</p>
            <p className="text-sm text-gray-400">
              {searchTerm ? 'Intenta con un término de búsqueda diferente' : 'No hay reclamos registrados'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reclamos;