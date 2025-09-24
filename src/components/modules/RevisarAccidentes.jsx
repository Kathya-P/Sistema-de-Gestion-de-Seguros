import React, { useState, useEffect } from 'react';
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

const RevisarAccidentes = ({ permissions, polizas }) => {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterGravedad, setFilterGravedad] = useState('todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accidenteSeleccionado, setAccidenteSeleccionado] = useState(null);
  const [vehiculosAsegurados, setVehiculosAsegurados] = useState([]);
  const [accidentes, setAccidentes] = useState([]);

  // Actualizar la lista de vehículos asegurados cuando cambien las pólizas
  useEffect(() => {
    console.log('Polizas recibidas:', polizas);
    console.log('Permissions:', permissions);
    
    if (permissions?.isCliente && permissions?.getCurrentUser?.()) {
      const currentUser = permissions.getCurrentUser();
      console.log('Current user:', currentUser);

      const vehiculos = polizas
        .filter(poliza => {
          console.log('Evaluando póliza:', poliza);
          return poliza.cliente === currentUser.name && poliza.estado === 'Activa';
        })
        .map(poliza => ({
          id: poliza.id,
          marca: poliza.marca || poliza.vehiculo?.marca,
          modelo: poliza.modelo || poliza.vehiculo?.modelo,
          año: poliza.año || poliza.vehiculo?.año,
          placa: poliza.placa || poliza.vehiculo?.placa,
          polizaId: poliza.numeroPoliza || poliza.id
        }));
      
      console.log('Vehículos filtrados:', vehiculos);
      setVehiculosAsegurados(vehiculos);
    }
  }, [polizas, permissions]);

  const [nuevoAccidente, setNuevoAccidente] = useState({
    polizaId: '',
    vehiculoId: '',
    marca: '',
    modelo: '',
    año: '',
    placa: '',
    ubicacion: '',
    fecha: '',
    hora: '',
    descripcion: '',
    gravedad: 'Leve',
    tipoAccidente: '',
    hayHeridos: false,
    descripcionDaños: '',
    fotos: [],
    documentos: []
  });

  const ajustadores = [];

  const filteredAccidentes = accidentes.filter(accidente => {
    // Si es cliente, solo mostrar sus propios accidentes
    if (permissions?.isCliente) {
      const currentUser = permissions?.getCurrentUser?.();
      if (currentUser && accidente.cliente !== currentUser.name) {
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
    // Validaciones
    if (!nuevoAccidente.vehiculoId || !nuevoAccidente.fecha || !nuevoAccidente.hora || 
        !nuevoAccidente.ubicacion || !nuevoAccidente.tipoAccidente || !nuevoAccidente.descripcionDaños) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const nuevoId = accidentes.length > 0 ? Math.max(...accidentes.map(a => a.id)) + 1 : 1;
    const numeroReporte = `ACC-${String(nuevoId).padStart(3, '0')}`;
    const currentUser = permissions?.getCurrentUser?.();
    
    if (!currentUser) {
      alert('Error: No se pudo identificar al usuario');
      return;
    }

    const accidente = {
      id: nuevoId,
      numeroReporte,
      cliente: currentUser.name,
      polizaId: nuevoAccidente.polizaId,
      vehiculo: `${nuevoAccidente.marca} ${nuevoAccidente.modelo} ${nuevoAccidente.año}`,
      placa: nuevoAccidente.placa,
      ubicacion: nuevoAccidente.ubicacion,
      fecha: nuevoAccidente.fecha,
      hora: nuevoAccidente.hora,
      tipoAccidente: nuevoAccidente.tipoAccidente,
      hayHeridos: nuevoAccidente.hayHeridos,
      descripcionDaños: nuevoAccidente.descripcionDaños,
      estado: 'Reportado',
      gravedad: nuevoAccidente.gravedad,
      ajustador: null,
      fotos: nuevoAccidente.fotos,
      documentos: nuevoAccidente.documentos,
      montoEstimado: 0,
      fechaReporte: new Date().toISOString().split('T')[0],
      fechaAsignacion: null
    };

    setAccidentes(prev => [...prev, accidente]);
    setNuevoAccidente({
      polizaId: '',
      vehiculoId: '',
      marca: '',
      modelo: '',
      año: '',
      placa: '',
      ubicacion: '',
      fecha: '',
      hora: '',
      descripcion: '',
      gravedad: 'Leve',
      tipoAccidente: '',
      hayHeridos: false,
      descripcionDaños: '',
      fotos: [],
      documentos: []
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

  const handleVehiculoChange = (vehiculoId) => {
    const vehiculo = vehiculosAsegurados.find(v => v.id === vehiculoId);
    if (vehiculo) {
      setNuevoAccidente(prev => ({
        ...prev,
        vehiculoId: vehiculo.id,
        polizaId: vehiculo.polizaId,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        año: vehiculo.año,
        placa: vehiculo.placa
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNuevoAccidente(prev => ({
        ...prev,
        [type]: [...prev[type], ...files]
      }));
    }
  };

  const renderReporteForm = () => {
    if (activeTab !== 'nuevo') return null;

    if (vehiculosAsegurados.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay vehículos asegurados</h3>
            <p className="text-gray-500">
              Para reportar un accidente, primero debe tener una póliza activa para su vehículo.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Reportar Nuevo Accidente</h3>
        
        {/* Selector de Vehículo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Seleccione el Vehículo Asegurado
          </label>
          <select
            value={nuevoAccidente.vehiculoId}
            onChange={(e) => handleVehiculoChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculosAsegurados.map(vehiculo => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.año} - Placa: {vehiculo.placa}
              </option>
            ))}
          </select>
        </div>

        {nuevoAccidente.vehiculoId && (
          <>
            {/* Detalles del Accidente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha del Accidente
                </label>
                <input
                  type="date"
                  value={nuevoAccidente.fecha}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, fecha: e.target.value}))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hora del Accidente
                </label>
                <input
                  type="time"
                  value={nuevoAccidente.hora}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, hora: e.target.value}))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={nuevoAccidente.ubicacion}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, ubicacion: e.target.value}))}
                  placeholder="Dirección exacta del accidente"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Accidente
                </label>
                <select
                  value={nuevoAccidente.tipoAccidente}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, tipoAccidente: e.target.value}))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Seleccione el tipo</option>
                  <option value="Colisión">Colisión</option>
                  <option value="Volcadura">Volcadura</option>
                  <option value="Atropello">Atropello</option>
                  <option value="Choque con objeto fijo">Choque con objeto fijo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ¿Hay personas heridas?
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hayHeridos"
                    checked={nuevoAccidente.hayHeridos}
                    onChange={() => setNuevoAccidente(prev => ({...prev, hayHeridos: true}))}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Sí</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    name="hayHeridos"
                    checked={!nuevoAccidente.hayHeridos}
                    onChange={() => setNuevoAccidente(prev => ({...prev, hayHeridos: false}))}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción del Accidente
              </label>
              <textarea
                value={nuevoAccidente.descripcionDaños}
                onChange={(e) => setNuevoAccidente(prev => ({...prev, descripcionDaños: e.target.value}))}
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describa detalladamente lo ocurrido, incluyendo los daños al vehículo y/o a terceros"
                required
              />
            </div>

            {/* Evidencias */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fotos del Accidente
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Subir fotos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'fotos')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
                  </div>
                </div>
                {nuevoAccidente.fotos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{nuevoAccidente.fotos.length} fotos seleccionadas</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Documentos Adicionales
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Subir documentos</span>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, 'documentos')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX hasta 10MB</p>
                  </div>
                </div>
                {nuevoAccidente.documentos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{nuevoAccidente.documentos.length} documentos seleccionados</p>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab('lista')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReportarAccidente}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reportar Accidente
              </button>
            </div>
          </>
        )}
      </div>
    );
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