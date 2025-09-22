import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  FileText
} from 'lucide-react';

const Clientes = ({ clientes, setClientes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.numeroDocumento.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#f0fdf4'}}>
              <Users className="w-6 h-6" style={{color: '#2d5016'}} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
              <p className="text-gray-600">Administra la información de todos los clientes</p>
            </div>
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </button>
        </div>

        {/* Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold" style={{color: '#2d5016'}}>{clientes.length}</p>
            </div>
            <Users className="w-8 h-8" style={{color: '#2d5016', opacity: 0.3}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Pólizas Activas</p>
              <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>
                {clientes.filter(c => c.polizasActivas > 0).length}
              </p>
            </div>
            <FileText className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.3}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Registros este mes</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Clientes ({filteredClientes.length})
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {filteredClientes.map((cliente) => (
            <div key={cliente.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: '#f0fdf4'}}>
                    <Users className="w-5 h-5" style={{color: '#2d5016'}} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{cliente.nombre}</h4>
                    <p className="text-sm text-gray-500">{cliente.tipoDocumento}: {cliente.numeroDocumento}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="text-blue-600 hover:text-blue-900 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{cliente.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{cliente.telefono}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{cliente.direccion}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Pólizas activas:</span>
                  <span className="font-semibold" style={{color: '#2d5016'}}>{cliente.polizasActivas}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-2">No se encontraron clientes</p>
            <p className="text-sm text-gray-400">
              {searchTerm ? 'Intenta con un término de búsqueda diferente' : 'Comienza registrando un nuevo cliente'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;