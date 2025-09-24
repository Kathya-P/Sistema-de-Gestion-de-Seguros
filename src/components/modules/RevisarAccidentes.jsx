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
  Download,
  X
} from 'lucide-react';
import { sessionManager } from '../../utils/sessionManager';

const RevisarAccidentes = ({ permissions, polizas, setActiveModule }) => {
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
    console.log('🔍 Datos recibidos en RevisarAccidentes:');
    console.log('   - Polizas:', polizas);
    console.log('   - Permissions:', permissions);
    
    // Obtener usuario actual directamente del sessionManager
    const currentUser = sessionManager.getCurrentUser();
    console.log('   - Usuario actual (sessionManager):', currentUser);
    
    if (permissions?.isCliente && currentUser) {
      console.log('   - Usuario cliente identificado:', currentUser);

      if (polizas && polizas.length > 0) {
        const vehiculos = polizas
          .filter(poliza => {
            console.log('   - Evaluando póliza:', {
              id: poliza.id,
              numeroPoliza: poliza.numeroPoliza,
              titular: poliza.titular,
              clienteId: poliza.clienteId,
              clienteName: poliza.clienteName,
              estado: poliza.estado,
              currentUserId: currentUser?.id,
              currentUserName: currentUser?.name
            });
            
            // Verificar múltiples formas de coincidencia
            const matchesById = poliza.clienteId === currentUser?.id;
            const matchesByName = poliza.titular === currentUser?.name || poliza.clienteName === currentUser?.name;
            const matchesByTitular = poliza.titular?.toLowerCase() === currentUser?.name?.toLowerCase();
            const isActive = poliza.estado === 'Activa';
            
            console.log('   - Coincidencias:', {
              matchesById,
              matchesByName,
              matchesByTitular,
              isActive,
              finalMatch: (matchesById || matchesByName || matchesByTitular) && isActive
            });
            
            return (matchesById || matchesByName || matchesByTitular) && isActive;
          })
          .map(poliza => ({
            id: poliza.id || poliza.numeroPoliza,
            marca: poliza.marca || poliza.vehiculo?.split(' ')[0] || 'N/A',
            modelo: poliza.modelo || poliza.vehiculo?.split(' ')[1] || 'N/A',
            año: poliza.año || poliza.vehiculo?.split(' ')[2] || 'N/A',
            placa: poliza.placa || 'N/A',
            polizaId: poliza.numeroPoliza || poliza.id,
            vehiculoCompleto: poliza.vehiculo
          }));
        
        console.log('   - Vehículos filtrados:', vehiculos);
        setVehiculosAsegurados(vehiculos);
      } else {
        console.log('   - No hay pólizas disponibles');
        setVehiculosAsegurados([]);
      }
    } else if (permissions?.isAdmin) {
      // Para administradores, mostrar todas las pólizas activas
      console.log('   - Usuario administrador, mostrando todas las pólizas activas');
      if (polizas && polizas.length > 0) {
        const vehiculos = polizas
          .filter(poliza => poliza.estado === 'Activa')
          .map(poliza => ({
            id: poliza.id || poliza.numeroPoliza,
            marca: poliza.marca || poliza.vehiculo?.split(' ')[0] || 'N/A',
            modelo: poliza.modelo || poliza.vehiculo?.split(' ')[1] || 'N/A',
            año: poliza.año || poliza.vehiculo?.split(' ')[2] || 'N/A',
            placa: poliza.placa || 'N/A',
            polizaId: poliza.numeroPoliza || poliza.id,
            vehiculoCompleto: poliza.vehiculo,
            titular: poliza.titular || poliza.clienteName
          }));
        setVehiculosAsegurados(vehiculos);
      }
    } else {
      console.log('   - Usuario sin permisos de cliente o usuario no identificado');
      setVehiculosAsegurados([]);
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

  // Cargar accidentes del localStorage al iniciar
  useEffect(() => {
    const accidentesGuardados = JSON.parse(localStorage.getItem('accidentes') || '[]');
    setAccidentes(accidentesGuardados);
    console.log('📋 Accidentes cargados desde localStorage:', accidentesGuardados);
  }, []);

  const filteredAccidentes = accidentes.filter(accidente => {
    // Si es cliente, solo mostrar sus propios accidentes
    if (permissions?.isCliente) {
      const currentUser = sessionManager.getCurrentUser();
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
    // Validaciones básicas
    if (!nuevoAccidente.vehiculoId || !nuevoAccidente.fecha || !nuevoAccidente.hora || 
        !nuevoAccidente.ubicacion || !nuevoAccidente.tipoAccidente || !nuevoAccidente.descripcionDaños) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Validación de fotos obligatorias
    if (!nuevoAccidente.fotos || nuevoAccidente.fotos.length === 0) {
      alert('⚠️ Es obligatorio subir al menos una foto del accidente para poder reportarlo.');
      return;
    }

    // Obtener accidentes existentes del localStorage
    const accidentesExistentes = JSON.parse(localStorage.getItem('accidentes') || '[]');
    const nuevoId = accidentesExistentes.length > 0 ? Math.max(...accidentesExistentes.map(a => a.id)) + 1 : 1;
    const numeroReporte = `ACC-${String(nuevoId).padStart(3, '0')}`;
    const currentUser = sessionManager.getCurrentUser();
    
    if (!currentUser) {
      alert('Error: No se pudo identificar al usuario');
      return;
    }

    const accidente = {
      id: nuevoId,
      numeroReporte,
      cliente: currentUser.name,
      clienteId: currentUser.id,
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
      fotos: nuevoAccidente.fotos.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        url: URL.createObjectURL(file) // Para vista previa
      })),
      documentos: nuevoAccidente.documentos.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      })),
      montoEstimado: 0,
      fechaReporte: new Date().toISOString().split('T')[0],
      fechaAsignacion: null
    };

    // Guardar en localStorage
    const nuevosAccidentes = [...accidentesExistentes, accidente];
    localStorage.setItem('accidentes', JSON.stringify(nuevosAccidentes));
    
    // Actualizar estados
    setAccidentes(nuevosAccidentes);
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
    alert(`✅ Accidente reportado exitosamente con número: ${numeroReporte}`);
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
    console.log('🚗 Vehículo seleccionado:', vehiculo);
    
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
    } else {
      // Limpiar campos si no se encontró el vehículo
      setNuevoAccidente(prev => ({
        ...prev,
        vehiculoId: '',
        polizaId: '',
        marca: '',
        modelo: '',
        año: '',
        placa: ''
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    console.log(`📁 Archivos seleccionados para ${type}:`, files);
    
    if (files.length > 0) {
      // Validar tamaño de archivos (10MB máximo por archivo)
      const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        alert(`Los siguientes archivos exceden el límite de 10MB:\n${invalidFiles.map(f => f.name).join('\n')}`);
        return;
      }

      // Validar tipos de archivo
      if (type === 'fotos') {
        const invalidTypes = files.filter(file => !file.type.startsWith('image/'));
        if (invalidTypes.length > 0) {
          alert(`Solo se permiten archivos de imagen.\nArchivos inválidos:\n${invalidTypes.map(f => f.name).join('\n')}`);
          return;
        }
      } else if (type === 'documentos') {
        const allowedTypes = [
          'application/pdf', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ];
        const invalidTypes = files.filter(file => !allowedTypes.includes(file.type));
        if (invalidTypes.length > 0) {
          alert(`Solo se permiten archivos PDF, DOC, DOCX o TXT.\nArchivos inválidos:\n${invalidTypes.map(f => f.name).join('\n')}`);
          return;
        }
      }

      // Agregar archivos al estado
      setNuevoAccidente(prev => {
        const newState = {
          ...prev,
          [type]: [...prev[type], ...files]
        };
        console.log(`📋 Estado actualizado para ${type}:`, newState[type]);
        return newState;
      });
      
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo si es necesario
      e.target.value = '';
    }
  };

  // Función para remover archivos
  const removeFile = (index, type) => {
    setNuevoAccidente(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  // Función para formatear el tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Función para renderizar el formulario de reporte (mejorado)
  const renderReporteForm = () => {
    if (activeTab !== 'reportar') return null;

    if (vehiculosAsegurados.length === 0) {
      return (
        <div className="space-y-6">
          {/* Información adicional para debugging si no hay vehículos */}
          {permissions?.isCliente && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">
                    Información de Depuración
                  </h3>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <p>• Total de pólizas recibidas: {polizas?.length || 0}</p>
                    <p>• Usuario actual: {sessionManager.getCurrentUser()?.name || 'No identificado'}</p>
                    <p>• ID del usuario: {sessionManager.getCurrentUser()?.id || 'No identificado'}</p>
                    <p>• Permisos isCliente: {permissions?.isCliente ? 'Sí' : 'No'}</p>
                    {polizas?.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Pólizas disponibles:</p>
                        {polizas.map((poliza, index) => (
                          <p key={index} className="ml-2">
                            - {poliza.numeroPoliza}: {poliza.titular || poliza.clienteName} ({poliza.estado}) - {poliza.vehiculo}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-3 text-xs px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded border border-yellow-300 transition-colors"
                  >
                    Recargar Página
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay vehículos asegurados</h3>
              <p className="text-gray-500 mb-4">
                Para reportar un accidente, primero debe tener una póliza activa para su vehículo.
              </p>
              {permissions?.canRequestQuote && (
                <button
                  onClick={() => setActiveModule?.('cotizaciones')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Solicitar Cotización
                </button>
              )}
            </div>
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
            Seleccione el Vehículo Asegurado <span className="text-red-500">*</span>
          </label>
          <select
            value={nuevoAccidente.vehiculoId}
            onChange={(e) => handleVehiculoChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculosAsegurados.map(vehiculo => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.vehiculoCompleto || `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`} - Placa: {vehiculo.placa} {vehiculo.titular ? `(${vehiculo.titular})` : ''} - Póliza: {vehiculo.polizaId}
              </option>
            ))}
          </select>
          {nuevoAccidente.vehiculoId && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Car className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Vehículo seleccionado: {nuevoAccidente.marca} {nuevoAccidente.modelo} {nuevoAccidente.año}
                  </p>
                  <p className="text-xs text-blue-700">
                    Placa: {nuevoAccidente.placa} | Póliza: {nuevoAccidente.polizaId}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {nuevoAccidente.vehiculoId && (
          <>
            {/* Detalles del Accidente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha del Accidente <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={nuevoAccidente.fecha}
                  onChange={(e) => setNuevoAccidente(prev => ({...prev, fecha: e.target.value}))}
                  max={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hora del Accidente <span className="text-red-500">*</span>
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
                  Ubicación <span className="text-red-500">*</span>
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
                  Tipo de Accidente <span className="text-red-500">*</span>
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
                  <option value="Robo/Hurto">Robo/Hurto</option>
                  <option value="Incendio">Incendio</option>
                  <option value="Fenómenos naturales">Fenómenos naturales</option>
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
                Gravedad del Accidente
              </label>
              <select
                value={nuevoAccidente.gravedad}
                onChange={(e) => setNuevoAccidente(prev => ({...prev, gravedad: e.target.value}))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Leve">Leve - Solo daños materiales menores</option>
                <option value="Moderado">Moderado - Daños considerables o heridos leves</option>
                <option value="Grave">Grave - Daños severos o heridos graves</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción del Accidente <span className="text-red-500">*</span>
              </label>
              <textarea
                value={nuevoAccidente.descripcionDaños}
                onChange={(e) => setNuevoAccidente(prev => ({...prev, descripcionDaños: e.target.value}))}
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describa detalladamente lo ocurrido, incluyendo los daños al vehículo y/o a terceros, condiciones climáticas, estado de la vía, etc."
                required
              />
            </div>

            {/* Evidencias */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fotos del Accidente <span className="text-red-500">* (Obligatorio)</span>
                </label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                  nuevoAccidente.fotos.length === 0 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}>
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Subir fotos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            console.log('🔍 Input de fotos cambiado:', e.target.files);
                            handleFileChange(e, 'fotos');
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG hasta 10MB cada una</p>
                    <p className="text-xs text-red-500 font-medium">⚠️ Mínimo 1 foto requerida para reportar el accidente</p>
                    <p className="text-xs text-gray-400">Se recomiendan fotos del vehículo, lugar del accidente y documentos</p>
                  </div>
                </div>
                
                {/* Vista previa de fotos */}
                {nuevoAccidente.fotos.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Fotos seleccionadas ({nuevoAccidente.fotos.length})
                      </h4>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        ✅ Requisito cumplido
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {nuevoAccidente.fotos.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover image-preview"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeFile(index, 'fotos')}
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                          onChange={(e) => {
                            console.log('🔍 Input de documentos cambiado:', e.target.files);
                            handleFileChange(e, 'documentos');
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX hasta 10MB</p>
                    <p className="text-xs text-gray-400">Parte policial, cotizaciones de reparación, etc.</p>
                  </div>
                </div>
                
                {/* Lista de documentos */}
                {nuevoAccidente.documentos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Documentos seleccionados ({nuevoAccidente.documentos.length})
                    </h4>
                    <div className="space-y-2">
                      {nuevoAccidente.documentos.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {file.type === 'application/pdf' ? (
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-red-600" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index, 'documentos')}
                            className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
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
      <style>
        {`
          .image-preview:hover {
            transform: scale(1.02);
            transition: transform 0.2s ease-in-out;
          }
          .file-upload-zone {
            transition: all 0.3s ease;
          }
          .file-upload-zone:hover {
            border-color: #3b82f6;
            background-color: #eff6ff;
          }
        `}
      </style>
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

      {/* Llamar al formulario mejorado */}
      {renderReporteForm()}

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
                  <h4 className="font-medium text-gray-900 mb-2">Fotos ({accidenteSeleccionado.fotos?.length || 0})</h4>
                  {accidenteSeleccionado.fotos && accidenteSeleccionado.fotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {accidenteSeleccionado.fotos.map((foto, index) => (
                        <div key={index} className="relative group">
                          {foto.url ? (
                            <img
                              src={foto.url}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                              onClick={() => window.open(foto.url, '_blank')}
                            />
                          ) : (
                            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Image className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-600">{foto.name || `Foto ${index + 1}`}</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay fotos disponibles</p>
                  )}
                  {permissions?.canUploadAccidentPhotos && (
                    <div className="mt-3">
                      <label className="inline-flex items-center px-3 py-2 bg-blue-50 border border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                        <Upload className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-700">Agregar foto</span>
                        <input type="file" accept="image/*" className="sr-only" />
                      </label>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Documentos ({accidenteSeleccionado.documentos?.length || 0})</h4>
                  {accidenteSeleccionado.documentos && accidenteSeleccionado.documentos.length > 0 ? (
                    <div className="space-y-2">
                      {accidenteSeleccionado.documentos.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {doc.type === 'application/pdf' ? (
                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-red-600" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                              {doc.size && <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>}
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Descargar">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay documentos disponibles</p>
                  )}
                  {permissions?.canUploadAccidentDocuments && (
                    <div className="mt-3">
                      <label className="inline-flex items-center px-3 py-2 bg-blue-50 border border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                        <Upload className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-700">Agregar documento</span>
                        <input type="file" accept=".pdf,.doc,.docx" className="sr-only" />
                      </label>
                    </div>
                  )}
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