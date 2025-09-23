import React, { useState } from 'react';
import { 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User,
  Camera,
  FileText,
  Eye,
  Edit,
  Upload,
  Plus,
  Search,
  Filter,
  Calendar,
  UserCheck,
  Image,
  Download
} from 'lucide-react';

const RevisarAccidentes = ({ permissions }) => {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterGravedad, setFilterGravedad] = useState('todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accidenteSeleccionado, setAccidenteSeleccionado] = useState(null);

  const [accidentes, setAccidentes] = useState([
    {
      id: 1,
      numeroReporte: 'ACC-001',
      cliente: 'Juan Pérez',
      vehiculo: 'Toyota Corolla 2020',
      placa: 'ABC-123',
      ubicacion: 'Av. Principal con Calle 5',
      fecha: '2024-09-18',
      hora: '14:30',
      estado: 'En investigación',
      gravedad: 'Leve',
      ajustador: 'Carlos Ramírez',
      descripcion: 'Colisión menor en intersección, daños en parachoques delantero',
      fotos: ['foto1.jpg', 'foto2.jpg'],
      documentos: ['reporte_policial.pdf', 'declaracion.pdf'],
      montoEstimado: 15000,
      fechaAsignacion: '2024-09-19'
    },
    {
      id: 2,
      numeroReporte: 'ACC-002',
      cliente: 'María González',
      vehiculo: 'Honda Civic 2019',
      placa: 'XYZ-789',
      ubicacion: 'Autopista Norte Km 15',
      fecha: '2024-09-16',
      hora: '09:15',
      estado: 'Completado',
      gravedad: 'Moderado',
      ajustador: 'Ana Martínez',
      descripcion: 'Accidente de tráfico con vehículo detenido, daños significativos',
      fotos: ['foto3.jpg', 'foto4.jpg', 'foto5.jpg'],
      documentos: ['reporte_final.pdf', 'peritaje.pdf'],
      montoEstimado: 35000,
      fechaAsignacion: '2024-09-16',
      fechaCompletado: '2024-09-20'
    },
    {
      id: 3,
      numeroReporte: 'ACC-003',
      cliente: 'Roberto Silva',
      vehiculo: 'Nissan Sentra 2021',
      placa: 'DEF-456',
      ubicacion: 'Centro Comercial Plaza Mayor',
      fecha: '2024-09-22',
      hora: '16:45',
      estado: 'Reportado',
      gravedad: 'Grave',
      ajustador: null,
      descripcion: 'Colisión múltiple en estacionamiento con heridos',
      fotos: ['foto6.jpg'],
      documentos: ['reporte_inicial.pdf'],
      montoEstimado: 85000,
      fechaAsignacion: null
    }
  ]);

  const [nuevoAccidente, setNuevoAccidente] = useState({
    vehiculo: '',
    placa: '',
    ubicacion: '',
    fecha: '',
    hora: '',
    descripcion: '',
    gravedad: 'Leve'
  });

  const ajustadores = [
    { id: 1, nombre: 'Carlos Ramírez', especialidad: 'Daños menores' },
    { id: 2, nombre: 'Ana Martínez', especialidad: 'Accidentes graves' },
    { id: 3, nombre: 'Pedro López', especialidad: 'Investigación especializada' },
    { id: 4, nombre: 'Carmen Vega', especialidad: 'Peritaje técnico' }
  ];

  const filteredAccidentes = accidentes.filter(accidente => {
    // Si es cliente, solo mostrar sus propios accidentes
    if (permissions?.isCliente) {
      const currentUser = permissions?.getCurrentUser?.() || { name: 'Juan Pérez' }; // Por ahora hardcoded
      if (accidente.cliente !== currentUser.name) {
        return false;
      }
    }

    const matchesSearch = accidente.numeroReporte.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accidente.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accidente.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accidente.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'todos' || accidente.estado === filterEstado;
    const matchesGravedad = filterGravedad === 'todos' || accidente.gravedad === filterGravedad;
    return matchesSearch && matchesEstado && matchesGravedad;
  });

  const handleReportarAccidente = () => {
    const nuevoId = Math.max(...accidentes.map(a => a.id)) + 1;
    const numeroReporte = `ACC-${String(nuevoId).padStart(3, '0')}`;
    const currentUser = permissions?.getCurrentUser?.() || { name: 'Juan Pérez' };
    
    const accidente = {
      id: nuevoId,
      numeroReporte,
      cliente: currentUser.name,
      ...nuevoAccidente,
      estado: 'Reportado',
      ajustador: null,
      fotos: [],
      documentos: [],
      montoEstimado: 0,
      fechaAsignacion: null
    };

    setAccidentes(prev => [...prev, accidente]);
    setNuevoAccidente({
      vehiculo: '',
      placa: '',
      ubicacion: '',
      fecha: '',
      hora: '',
      descripcion: '',
      gravedad: 'Leve'
    });
    setActiveTab('lista');
  };

  const handleAsignarAjustador = (accidenteId, ajustadorNombre) => {
    setAccidentes(prev => prev.map(acc => 
      acc.id === accidenteId 
        ? { 
            ...acc, 
            ajustador: ajustadorNombre,
            estado: acc.estado === 'Reportado' ? 'En investigación' : acc.estado,
            fechaAsignacion: new Date().toISOString().split('T')[0]
          } 
        : acc
    ));
  };

  const handleCambiarEstado = (accidenteId, nuevoEstado) => {
    setAccidentes(prev => prev.map(acc => 
      acc.id === accidenteId 
        ? { 
            ...acc, 
            estado: nuevoEstado,
            fechaCompletado: nuevoEstado === 'Completado' ? new Date().toISOString().split('T')[0] : acc.fechaCompletado
          } 
        : acc
    ));
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Reportado': return '#6b7280';
      case 'En investigación': return '#f59e0b';
      case 'Completado': return '#10b981';
      case 'Cerrado': return '#374151';
      default: return '#6b7280';
    }
  };

  const getGravedadColor = (gravedad) => {
    switch (gravedad) {
      case 'Leve': return '#10b981';
      case 'Moderado': return '#f59e0b';
      case 'Grave': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'Reportado': return <AlertTriangle className="w-4 h-4" />;
      case 'En investigación': return <Clock className="w-4 h-4" />;
      case 'Completado': return <CheckCircle className="w-4 h-4" />;
      case 'Cerrado': return <FileText className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Métricas
  const metricas = {
    total: filteredAccidentes.length,
    reportados: filteredAccidentes.filter(a => a.estado === 'Reportado').length,
    enInvestigacion: filteredAccidentes.filter(a => a.estado === 'En investigación').length,
    completados: filteredAccidentes.filter(a => a.estado === 'Completado').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#eff6ff'}}>
              <Car className="w-6 h-6" style={{color: '#1e40af'}} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Revisión de Accidentes</h2>
              <p className="text-gray-600">
                {permissions?.isAdmin ? 'Gestión y seguimiento de todos los reportes de accidentes' : 'Reporte y seguimiento de sus accidentes'}
              </p>
            </div>
          </div>
          {permissions?.canReportAccidentes && (
            <button 
              onClick={() => setActiveTab('reportar')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Reportar Accidente
            </button>
          )}
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número, cliente, vehículo o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="Reportado">Reportado</option>
            <option value="En investigación">En investigación</option>
            <option value="Completado">Completado</option>
            <option value="Cerrado">Cerrado</option>
          </select>
          <select
            value={filterGravedad}
            onChange={(e) => setFilterGravedad(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todas las gravedades</option>
            <option value="Leve">Leve</option>
            <option value="Moderado">Moderado</option>
            <option value="Grave">Grave</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mt-6">
          <button
            onClick={() => setActiveTab('lista')}
            className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'lista' 
                ? 'border-blue-600 text-blue-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Accidentes
          </button>
          {permissions?.canReportAccidentes && (
            <button
              onClick={() => setActiveTab('reportar')}
              className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'reportar' 
                  ? 'border-blue-600 text-blue-700' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reportar Accidente
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Accidentes</p>
              <p className="text-2xl font-bold text-gray-900">{metricas.total}</p>
            </div>
            <Car className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Investigación</p>
              <p className="text-2xl font-bold" style={{color: '#d97706'}}>
                {metricas.enInvestigacion}
              </p>
            </div>
            <Clock className="w-8 h-8" style={{color: '#d97706', opacity: 0.3}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold" style={{color: '#059669'}}>
                {metricas.completados}
              </p>
            </div>
            <CheckCircle className="w-8 h-8" style={{color: '#059669', opacity: 0.3}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reportados</p>
              <p className="text-2xl font-bold" style={{color: '#dc2626'}}>
                {metricas.reportados}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8" style={{color: '#dc2626', opacity: 0.3}} />
          </div>
        </div>
      </div>

      {activeTab === 'lista' && (
        <div className="space-y-6">
          {/* Lista de accidentes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Accidentes ({filteredAccidentes.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gravedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ajustador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccidentes.map((accidente) => (
                    <tr key={accidente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{accidente.numeroReporte}</div>
                          <div className="text-sm text-gray-500">{accidente.fecha} {accidente.hora}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{accidente.cliente}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{accidente.vehiculo}</div>
                          <div className="text-sm text-gray-500">{accidente.placa}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{accidente.ubicacion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{backgroundColor: getEstadoColor(accidente.estado)}}
                        >
                          {getEstadoIcon(accidente.estado)}
                          <span className="ml-1">{accidente.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{backgroundColor: getGravedadColor(accidente.gravedad)}}
                        >
                          {accidente.gravedad}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {accidente.ajustador || 'No asignado'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setAccidenteSeleccionado(accidente);
                              setMostrarModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {permissions?.isAdmin && !accidente.ajustador && (
                            <select
                              onChange={(e) => handleAsignarAjustador(accidente.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              defaultValue=""
                            >
                              <option value="" disabled>Asignar</option>
                              {ajustadores.map(adj => (
                                <option key={adj.id} value={adj.nombre}>{adj.nombre}</option>
                              ))}
                            </select>
                          )}
                          {permissions?.isAdmin && accidente.estado === 'En investigación' && (
                            <button
                              onClick={() => handleCambiarEstado(accidente.id, 'Completado')}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title="Marcar completado"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reportar' && permissions?.canReportAccidentes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Reportar Nuevo Accidente</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleReportarAccidente(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehículo</label>
                <input
                  type="text"
                  value={nuevoAccidente.vehiculo}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, vehiculo: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Toyota Corolla 2020"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                <input
                  type="text"
                  value={nuevoAccidente.placa}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, placa: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: ABC-123"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={nuevoAccidente.fecha}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, fecha: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  value={nuevoAccidente.hora}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, hora: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input
                  type="text"
                  value={nuevoAccidente.ubicacion}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, ubicacion: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Av. Principal con Calle 5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gravedad</label>
                <select
                  value={nuevoAccidente.gravedad}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, gravedad: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Leve">Leve</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Grave">Grave</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Accidente</label>
                <textarea
                  value={nuevoAccidente.descripcion}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, descripcion: e.target.value}))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describa detalladamente lo ocurrido..."
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('lista')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reportar Accidente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de detalles */}
      {mostrarModal && accidenteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Detalles del Accidente - {accidenteSeleccionado.numeroReporte}
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Cliente:</span> {accidenteSeleccionado.cliente}</p>
                    <p><span className="font-medium">Vehículo:</span> {accidenteSeleccionado.vehiculo}</p>
                    <p><span className="font-medium">Placa:</span> {accidenteSeleccionado.placa}</p>
                    <p><span className="font-medium">Fecha:</span> {accidenteSeleccionado.fecha} {accidenteSeleccionado.hora}</p>
                    <p><span className="font-medium">Ubicación:</span> {accidenteSeleccionado.ubicacion}</p>
                    <p><span className="font-medium">Ajustador:</span> {accidenteSeleccionado.ajustador || 'No asignado'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-700">{accidenteSeleccionado.descripcion}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Fotos ({accidenteSeleccionado.fotos.length})</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {accidenteSeleccionado.fotos.map((foto, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                        <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">{foto}</p>
                      </div>
                    ))}
                    {permissions?.canUploadAccidentPhotos && (
                      <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-100">
                        <Upload className="w-8 h-8 text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-blue-600">Subir foto</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Documentos ({accidenteSeleccionado.documentos.length})</h4>
                  <div className="space-y-2">
                    {accidenteSeleccionado.documentos.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{doc}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {permissions?.canUploadAccidentDocuments && (
                      <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-3 text-center cursor-pointer hover:bg-blue-100">
                        <Upload className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-sm text-blue-600">Subir documento</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisarAccidentes;