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
  Calendar,
  Check,
  X,
  User,
  Upload,
  Paperclip,
  Users
} from 'lucide-react';

const Reclamos = ({ reclamos: reclamosFromProps, setReclamos, permissions }) => {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [reclamos, updateReclamos] = useState(reclamosFromProps || [
    {
      id: 1,
      numeroReclamo: 'REC-001',
      cliente: 'María López',
      poliza: 'POL-2024-001',
      tipoReclamo: 'Accidente vehicular',
      fechaIncidente: '2024-09-15',
      fechaReclamo: '2024-09-16',
      montoReclamado: 15000,
      estado: 'En proceso',
      investigador: null,
      documentos: ['Parte policial', 'Fotos del vehículo'],
      descripcion: 'Colisión en intersección durante lluvia'
    },
    {
      id: 2,
      numeroReclamo: 'REC-002',
      cliente: 'Carlos Rodríguez',
      poliza: 'POL-2024-002',
      tipoReclamo: 'Robo de hogar',
      fechaIncidente: '2024-09-10',
      fechaReclamo: '2024-09-11',
      montoReclamado: 8500,
      estado: 'Aprobado',
      investigador: 'Ana García',
      documentos: ['Denuncia policial', 'Lista de objetos'],
      descripcion: 'Robo durante ausencia de propietarios'
    },
    {
      id: 3,
      numeroReclamo: 'REC-003',
      cliente: 'Luis Martínez',
      poliza: 'POL-2024-003',
      tipoReclamo: 'Daños por tormenta',
      fechaIncidente: '2024-09-08',
      fechaReclamo: '2024-09-09',
      montoReclamado: 12000,
      estado: 'Rechazado',
      investigador: 'Pedro Vega',
      documentos: ['Fotos de daños', 'Reporte meteorológico'],
      descripcion: 'Daños en techo por granizo'
    }
  ]);

  const [newReclamo, setNewReclamo] = useState({
    tipoReclamo: '',
    poliza: '',
    fechaIncidente: '',
    montoReclamado: '',
    descripcion: '',
    documentos: []
  });

  const investigadores = ['Ana García', 'Pedro Vega', 'Carmen López', 'Diego Herrera'];

  const filteredReclamos = reclamos.filter(reclamo => {
    const matchesSearch = (reclamo.cliente || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reclamo.numeroReclamo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reclamo.poliza || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (reclamo.tipoReclamo || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || reclamo.estado === filterStatus;
    
    // Si es cliente, solo ver sus propios reclamos
    if (permissions?.userRole === 'cliente') {
      return matchesSearch && matchesFilter && reclamo.cliente === 'María López'; // Simular usuario actual
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id) => {
    updateReclamos(prev => prev.map(reclamo => 
      reclamo.id === id ? { ...reclamo, estado: 'Aprobado' } : reclamo
    ));
  };

  const handleReject = (id) => {
    updateReclamos(prev => prev.map(reclamo => 
      reclamo.id === id ? { ...reclamo, estado: 'Rechazado' } : reclamo
    ));
  };

  const handleAssignInvestigator = (id, investigator) => {
    updateReclamos(prev => prev.map(reclamo => 
      reclamo.id === id ? { ...reclamo, investigador: investigator, estado: 'En investigación' } : reclamo
    ));
  };

  const handleSubmitReclamo = (e) => {
    e.preventDefault();
    const nuevoReclamo = {
      id: Date.now(),
      numeroReclamo: `REC-${String(reclamos.length + 1).padStart(3, '0')}`,
      cliente: 'María López', // Usuario actual
      poliza: newReclamo.poliza,
      tipoReclamo: newReclamo.tipoReclamo,
      fechaIncidente: newReclamo.fechaIncidente,
      fechaReclamo: new Date().toISOString().split('T')[0],
      montoReclamado: parseFloat(newReclamo.montoReclamado),
      estado: 'Pendiente',
      investigador: null,
      documentos: newReclamo.documentos,
      descripcion: newReclamo.descripcion
    };
    
    updateReclamos(prev => [...prev, nuevoReclamo]);
    setNewReclamo({
      tipoReclamo: '',
      poliza: '',
      fechaIncidente: '',
      montoReclamado: '',
      descripcion: '',
      documentos: []
    });
    setActiveTab('lista');
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Aprobado': return '#2d5016';
      case 'En proceso': 
      case 'En investigación': return '#b7541a';
      case 'Pendiente': return '#6b7280';
      case 'Rechazado': return '#991b1b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Aprobado': return <CheckCircle className="w-4 h-4" />;
      case 'En proceso': 
      case 'En investigación': return <Clock className="w-4 h-4" />;
      case 'Pendiente': return <FileText className="w-4 h-4" />;
      case 'Rechazado': return <XCircle className="w-4 h-4" />;
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
              <h2 className="text-2xl font-bold text-gray-900">Reclamos</h2>
              <p className="text-gray-600">
                {permissions?.isAdmin ? 'Gestiona y procesa todos los reclamos' : 'Gestiona tus reclamos de seguros'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            {(permissions?.isLoggedIn && permissions?.userRole === 'cliente') && (
              <button 
                onClick={() => setActiveTab('crear')}
                className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-orange-700 transition-colors" 
                style={{backgroundColor: '#b7541a'}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Reclamo
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('lista')}
            className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'lista' 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Reclamos
          </button>
          {permissions?.userRole === 'cliente' && (
            <button
              onClick={() => setActiveTab('crear')}
              className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'crear' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Crear Reclamo
            </button>
          )}
        </div>
      </div>

      {activeTab === 'lista' ? (
        <div className="space-y-6">
          {/* Búsqueda y filtros */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente, póliza o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="En investigación">En investigación</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de reclamos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reclamo
                    </th>
                    {permissions?.isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo / Póliza
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto Reclamado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    {permissions?.isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Investigador
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReclamos.map((reclamo) => (
                    <tr key={reclamo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{reclamo.numeroReclamo}</div>
                          <div className="text-sm text-gray-500">Incidente: {reclamo.fechaIncidente}</div>
                        </div>
                      </td>
                      {permissions?.isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{reclamo.cliente}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{reclamo.tipoReclamo}</div>
                          <div className="text-sm text-gray-500">{reclamo.poliza}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${reclamo.montoReclamado.toLocaleString()}</div>
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
                      {permissions?.isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {reclamo.investigador ? (
                            <div className="text-sm text-gray-900">{reclamo.investigador}</div>
                          ) : (
                            <select
                              onChange={(e) => handleAssignInvestigator(reclamo.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                              defaultValue=""
                            >
                              <option value="">Asignar investigador</option>
                              {investigadores.map(inv => (
                                <option key={inv} value={inv}>{inv}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {permissions?.isAdmin && (reclamo.estado === 'Pendiente' || reclamo.estado === 'En proceso') && (
                            <>
                              <button 
                                onClick={() => handleApprove(reclamo.id)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(reclamo.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {permissions?.userRole === 'cliente' && reclamo.estado === 'Pendiente' && (
                            <button className="text-orange-600 hover:text-orange-900 transition-colors">
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReclamos.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reclamos</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Intenta con un término de búsqueda diferente' : 
                   permissions?.isAdmin ? 'Los reclamos aparecerán aquí cuando los clientes los presenten' : 
                   'Presenta tu primer reclamo cuando necesites hacer una reclamación'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : permissions?.userRole === 'cliente' ? (
        /* Formulario de nuevo reclamo - Solo para clientes */
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Presentar Nuevo Reclamo
          </h3>
          
          <form onSubmit={handleSubmitReclamo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Póliza de Seguro
                </label>
                <select
                  value={newReclamo.poliza}
                  onChange={(e) => setNewReclamo({...newReclamo, poliza: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona tu póliza</option>
                  <option value="POL-2024-001">POL-2024-001 - Seguro Vehicular</option>
                  <option value="POL-2024-002">POL-2024-002 - Seguro de Hogar</option>
                  <option value="POL-2024-003">POL-2024-003 - Seguro de Vida</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Reclamo
                </label>
                <select
                  value={newReclamo.tipoReclamo}
                  onChange={(e) => setNewReclamo({...newReclamo, tipoReclamo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona el tipo</option>
                  <option value="Accidente vehicular">Accidente vehicular</option>
                  <option value="Robo de vehículo">Robo de vehículo</option>
                  <option value="Daños por tormenta">Daños por tormenta</option>
                  <option value="Robo de hogar">Robo de hogar</option>
                  <option value="Incendio">Incendio</option>
                  <option value="Gastos médicos">Gastos médicos</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha del Incidente
                </label>
                <input
                  type="date"
                  value={newReclamo.fechaIncidente}
                  onChange={(e) => setNewReclamo({...newReclamo, fechaIncidente: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Reclamado
                </label>
                <input
                  type="number"
                  value={newReclamo.montoReclamado}
                  onChange={(e) => setNewReclamo({...newReclamo, montoReclamado: e.target.value})}
                  placeholder="Ingrese el monto en dólares"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del Incidente
              </label>
              <textarea
                value={newReclamo.descripcion}
                onChange={(e) => setNewReclamo({...newReclamo, descripcion: e.target.value})}
                placeholder="Describe detalladamente lo que ocurrió..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documentos de Soporte
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                <p className="text-sm text-gray-400">Formatos permitidos: PDF, JPG, PNG (máx. 10MB)</p>
                <input type="file" multiple className="hidden" />
                <button type="button" className="mt-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Seleccionar Archivos
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab('lista')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-lg hover:bg-orange-700 transition-colors"
                style={{backgroundColor: '#b7541a'}}
              >
                Presentar Reclamo
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Reclamos;