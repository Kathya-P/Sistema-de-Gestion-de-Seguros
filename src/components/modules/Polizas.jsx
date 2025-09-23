import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle,
  Users,
  Clock,
  Car,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

const Polizas = ({ polizas, setPolizas, permissions, setActiveModule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [activeTab, setActiveTab] = useState('polizas');
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [polizasReales, setPolizasReales] = useState([]); // Solo pólizas reales del localStorage
  
  // Obtener usuario actual
  const currentUser = permissions?.currentUser || JSON.parse(localStorage.getItem('seguros_session_data') || '{}').user;

  // Cargar solicitudes pendientes y pólizas reales del localStorage
  useEffect(() => {
    // Cargar cotizaciones pendientes de aprobación
    const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    setSolicitudesPendientes(cotizaciones.filter(cot => cot.estado === 'pendiente'));
    
    // Cargar SOLO las pólizas reales del localStorage (creadas desde cotizaciones aprobadas)
    const polizasGuardadas = JSON.parse(localStorage.getItem('polizas') || '[]');
    setPolizasReales(polizasGuardadas);
  }, []);

  // Actualizar pólizas cuando cambie la pestaña activa (para refrescar datos)
  useEffect(() => {
    if (activeTab === 'polizas') {
      const polizasGuardadas = JSON.parse(localStorage.getItem('polizas') || '[]');
      setPolizasReales(polizasGuardadas);
    }
  }, [activeTab]);

  // Filtrar pólizas según permisos del usuario
  const getFilteredPolizas = () => {
    let polizasFiltradas = polizasReales; // Usar pólizas reales en lugar de props
    
    // Si es cliente, solo mostrar sus propias pólizas
    if (permissions?.isCliente && currentUser) {
      polizasFiltradas = polizasReales.filter(poliza => 
        poliza.clienteId === currentUser.id || 
        poliza.titular === currentUser.name
      );
    }

    return polizasFiltradas.filter(poliza => {
      const matchesSearch = poliza.titular.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poliza.numeroPoliza.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poliza.vehiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poliza.placa?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'todas' || poliza.estado === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredPolizas = getFilteredPolizas();

  // Aprobar solicitud de cotización y convertir en póliza
  const aprobarSolicitud = (solicitud) => {
    const numeroPoliza = `POL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const nuevaPoliza = {
      numeroPoliza: numeroPoliza,
      titular: solicitud.nombreCompleto,
      clienteId: solicitud.clienteId || solicitud.userId, // Asegurar ID del cliente
      clienteName: solicitud.clienteName || solicitud.nombreCompleto, // Nombre del cliente
      tipoSeguro: solicitud.cobertura,
      vehiculo: `${solicitud.marca} ${solicitud.modelo} ${solicitud.año}`,
      placa: solicitud.placa,
      prima: parseFloat(solicitud.primaMensual.replace(/,/g, '')),
      vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: 'Activa',
      telefono: solicitud.telefono,
      cobertura: solicitud.cobertura,
      deducible: solicitud.deducible || 750,
      fechaCreacion: new Date().toISOString().split('T')[0],
      solicitudId: solicitud.id
    };

    // Guardar póliza en localStorage
    const polizasExistentes = JSON.parse(localStorage.getItem('polizas') || '[]');
    const nuevasPolizas = [...polizasExistentes, nuevaPoliza];
    localStorage.setItem('polizas', JSON.stringify(nuevasPolizas));
    
    // Actualizar estado local y también el estado principal de App.js
    setPolizasReales(nuevasPolizas);
    setPolizas(nuevasPolizas); // Actualizar también el estado principal

    // Actualizar estado de la cotización en localStorage
    const todasCotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacionesNuevas = todasCotizaciones.map(cot => 
      cot.id === solicitud.id ? {...cot, estado: 'aprobada', numeroPoliza: numeroPoliza} : cot
    );
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesNuevas));
    
    // Actualizar estado local
    setSolicitudesPendientes(prev => prev.filter(s => s.id !== solicitud.id));
    
    alert(`✅ Póliza ${numeroPoliza} creada exitosamente`);
  };

  // Rechazar solicitud
  const rechazarSolicitud = (solicitudId, motivo = '') => {
    // Actualizar localStorage
    const todasCotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacionesNuevas = todasCotizaciones.map(cot => 
      cot.id === solicitudId ? {...cot, estado: 'rechazada', motivoRechazo: motivo} : cot
    );
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesNuevas));
    
    // Actualizar estado local
    setSolicitudesPendientes(prev => prev.filter(s => s.id !== solicitudId));
    alert('❌ Solicitud rechazada');
  };

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
      case 'Pendiente': return <Clock className="w-4 h-4" />;
      case 'Vencida': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderSolicitudesPendientes = () => (
    <div className="space-y-4">
      {solicitudesPendientes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-2">No hay solicitudes pendientes</p>
          <p className="text-sm text-gray-400">Las nuevas solicitudes de cotización aparecerán aquí</p>
        </div>
      ) : (
        solicitudesPendientes.map((solicitud) => (
          <div key={solicitud.id} className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg mr-3" style={{backgroundColor: '#fef3e8'}}>
                    <Car className="w-5 h-5" style={{color: '#b7541a'}} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{solicitud.nombreCompleto}</h3>
                    <p className="text-sm text-gray-500">{solicitud.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Vehículo</p>
                    <p className="font-medium">{solicitud.marca} {solicitud.modelo} {solicitud.año}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placa</p>
                    <p className="font-medium">{solicitud.placa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cobertura</p>
                    <p className="font-medium">{solicitud.cobertura}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prima Mensual</p>
                    <p className="font-medium text-green-600">${solicitud.primaMensual}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Valor del vehículo:</span>
                    <span className="ml-2 font-medium">₡{solicitud.valorVehiculo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Edad conductor:</span>
                    <span className="ml-2 font-medium">{solicitud.edadConductor} años</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Años con licencia:</span>
                    <span className="ml-2 font-medium">{solicitud.añosLicencia} años</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => aprobarSolicitud(solicitud)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Aprobar
                </button>
                <button
                  onClick={() => rechazarSolicitud(solicitud.id)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

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
              <h2 className="text-2xl font-bold text-gray-900">
                {permissions?.isAdmin ? 'Gestión de Pólizas Vehiculares' : 'Mis Pólizas Vehiculares'}
              </h2>
              <p className="text-gray-600">
                {permissions?.isAdmin 
                  ? 'Administra pólizas y solicitudes de cotización' 
                  : 'Consulta tus pólizas activas'}
              </p>
            </div>
          </div>
        </div>

        {/* Pestañas para Admin */}
        {permissions?.isAdmin && (
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('polizas')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'polizas'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Pólizas Activas ({filteredPolizas.length})
            </button>
            <button
              onClick={() => setActiveTab('solicitudes')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'solicitudes'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Solicitudes Pendientes ({solicitudesPendientes.length})
            </button>
          </div>
        )}

        {/* Filtros solo para la pestaña de pólizas */}
        {activeTab === 'polizas' && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por titular, número de póliza, vehículo o placa..."
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
        )}
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'solicitudes' && permissions?.isAdmin ? (
        renderSolicitudesPendientes()
      ) : (
        <>
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {permissions?.isAdmin ? 'Total Pólizas' : 'Mis Pólizas'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{filteredPolizas.length}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activas</p>
                  <p className="text-2xl font-bold" style={{color: '#2d5016'}}>
                    {filteredPolizas.filter(p => p.estado === 'Activa').length}
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
                    {filteredPolizas.filter(p => p.estado === 'Pendiente').length}
                  </p>
                </div>
                <Clock className="w-8 h-8" style={{color: '#b7541a'}} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vencidas</p>
                  <p className="text-2xl font-bold" style={{color: '#991b1b'}}>
                    {filteredPolizas.filter(p => p.estado === 'Vencida').length}
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
                {permissions?.isAdmin ? `Pólizas (${filteredPolizas.length})` : `Mis Pólizas (${filteredPolizas.length})`}
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
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobertura
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
                        <div className="flex items-center">
                          <Car className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {poliza.vehiculo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {poliza.placa}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{poliza.cobertura || poliza.tipoSeguro}</span>
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
                          <button 
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {permissions?.isAdmin && (
                            <button 
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Editar póliza"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
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
                <p className="text-gray-500 mb-2">
                  {permissions?.isCliente ? 'No tienes pólizas activas' : 'No se encontraron pólizas'}
                </p>
                <p className="text-sm text-gray-400">
                  {permissions?.isCliente 
                    ? 'Solicita una cotización para obtener tu primera póliza vehicular'
                    : searchTerm 
                      ? 'Intenta con un término de búsqueda diferente' 
                      : 'Las nuevas pólizas aparecerán aquí'
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Información adicional para clientes */}
      {permissions?.isCliente && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">¿Necesitas un nuevo seguro vehicular?</h4>
              <p className="text-blue-800 mb-4">
                Solicita una cotización personalizada y nuestros expertos te contactarán para crear tu póliza.
              </p>
              <button 
                onClick={() => setActiveModule('cotizaciones')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Polizas;