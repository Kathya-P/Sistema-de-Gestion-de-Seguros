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
  FileText,
  Trash2
} from 'lucide-react';

const Clientes = ({ clientes, setClientes, permissions, onClientesUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleVerDetalles = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  const handleEliminar = (cliente) => {
    setSelectedCliente(cliente);
    setShowDeleteConfirm(true);
  };

  const confirmarEliminacion = () => {
    if (!selectedCliente) return;

    try {
      // Eliminar el cliente de la lista local
      const nuevosClientes = clientes.filter(c => c.id !== selectedCliente.id);
      setClientes(nuevosClientes);
      
      // Eliminar el usuario del localStorage usando la clave correcta
      const users = JSON.parse(localStorage.getItem('seguros_users_data') || '[]');
      const updatedUsers = users.filter(user => user.id !== selectedCliente.id);
      localStorage.setItem('seguros_users_data', JSON.stringify(updatedUsers));
      
      // Eliminar las pólizas asociadas al cliente del localStorage
      const polizas = JSON.parse(localStorage.getItem('polizas') || '[]');
      const polizasActualizadas = polizas.filter(poliza => {
        // Verificar que poliza.cliente existe y no es undefined antes de usar toLowerCase
        if (!poliza.cliente) return true;
        return poliza.cliente.toLowerCase() !== selectedCliente.nombre.toLowerCase();
      });
      localStorage.setItem('polizas', JSON.stringify(polizasActualizadas));

      // Actualizar la lista de clientes
      if (onClientesUpdated) {
        onClientesUpdated();
      }
      
      setShowDeleteConfirm(false);
      setSelectedCliente(null);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      // Manejar el error apropiadamente, tal vez mostrar un mensaje al usuario
      setShowDeleteConfirm(false);
      setSelectedCliente(null);
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-3xl font-bold" style={{color: '#2d5016'}}>{clientes.length}</p>
              <p className="text-xs text-gray-500 mt-1">Usuarios registrados</p>
            </div>
            <div className="p-3 rounded-full" style={{backgroundColor: '#f0fdf4'}}>
              <Users className="w-8 h-8" style={{color: '#2d5016'}} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Activos</p>
              <p className="text-3xl font-bold" style={{color: '#1e3a72'}}>
                {clientes.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Perfiles verificados</p>
            </div>
            <div className="p-3 rounded-full" style={{backgroundColor: '#eff6ff'}}>
              <FileText className="w-8 h-8" style={{color: '#1e3a72'}} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nuevos este mes</p>
              <p className="text-3xl font-bold text-gray-900">
                {clientes.filter(c => {
                  if (!c.fechaRegistro) return false;
                  const fechaRegistro = new Date(c.fechaRegistro);
                  const ahora = new Date();
                  return fechaRegistro.getMonth() === ahora.getMonth() && 
                         fechaRegistro.getFullYear() === ahora.getFullYear();
                }).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Registrados recientemente</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {filteredClientes.map((cliente) => (
            <div key={cliente.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{cliente.nombre}</h4>
                    <p className="text-sm text-gray-500 font-medium">Usuario: {cliente.numeroDocumento}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-full"
                    onClick={() => handleVerDetalles(cliente)}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {permissions?.canDelete && (
                    <button 
                      className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-full"
                      onClick={() => handleEliminar(cliente)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Estado:</span>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                    ✓ Verificado
                  </span>
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

      {/* Modal de Detalles */}
      {showModal && selectedCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border-2" style={{borderColor: '#03045e'}}>
            <div className="px-6 pt-6 pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Detalles del Cliente
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Nombre completo:</p>
                        <p className="font-medium">{selectedCliente.nombre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Nombre de usuario:</p>
                        <p className="font-medium">{selectedCliente.numeroDocumento}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Correo electrónico:</p>
                        <p className="font-medium">{selectedCliente.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Teléfono:</p>
                        <p className="font-medium">{selectedCliente.telefono || 'No proporcionado'}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Fecha de registro:</p>
                          <p className="font-medium">
                            {selectedCliente.fechaRegistro 
                              ? new Date(selectedCliente.fechaRegistro).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'No disponible'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">ID de cliente:</p>
                          <p className="font-medium text-gray-600">#{String(selectedCliente.id).slice(-6)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && selectedCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border-2 border-red-300">
            <div className="px-6 pt-6 pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Eliminar Cliente
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Está seguro que desea eliminar al cliente {selectedCliente.nombre}? Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={confirmarEliminacion}
              >
                Eliminar
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;