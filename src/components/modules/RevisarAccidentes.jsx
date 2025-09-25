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
  Image,
  Download,
  X
} from 'lucide-react';
import FormularioAccidenteNuevo from './FormularioAccidenteNuevo';
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
  const [comentarioAdmin, setComentarioAdmin] = useState('');
  const [mostrarAcciones, setMostrarAcciones] = useState(false);
  
  const currentUser = sessionManager.getCurrentUser();

  // Función para obtener URL segura de fotos
  const getSafeImageUrl = (foto) => {
    try {
      // Si es un objeto con data base64, usar esa data
      if (foto && foto.data && typeof foto.data === 'string' && foto.data.startsWith('data:')) {
        return foto.data;
      }
      // Si ya es una URL (string), devolverla directamente
      if (typeof foto === 'string' && (foto.startsWith('http') || foto.startsWith('data:'))) {
        return foto;
      }
      // Si tiene una propiedad url, usarla
      if (foto && foto.url) {
        return foto.url;
      }
      // Si es un File válido, crear ObjectURL
      if (foto instanceof File || foto instanceof Blob) {
        return URL.createObjectURL(foto);
      }
      // Si no es válido, retornar placeholder
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5TDEzIDEwTDEyIDExTDExIDEwTDEyIDlaIiBmaWxsPSIjOTQ5Nzk3Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5NDk3OTciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPHN2Zz4K';
    } catch (error) {
      console.warn('Error processing image:', error);
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5TDEzIDEwTDEyIDExTDExIDEwTDEyIDlaIiBmaWxsPSIjOTQ5Nzk3Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5NDk3OTciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPHN2Zz4K';
    }
  };

  // Funciones para acciones del admin
  const handleAceptarAccidente = () => {
    if (!comentarioAdmin.trim()) {
      alert('Por favor, agregue un comentario antes de proceder.');
      return;
    }

    const accidentesActualizados = accidentes.map(acc => 
      acc.id === accidenteSeleccionado.id 
        ? {
            ...acc,
            estado: 'En investigación',
            enviadoADeteccionFraudes: true,
            comentariosAdmin: [
              ...(acc.comentariosAdmin || []),
              {
                id: Date.now(),
                fecha: new Date().toISOString(),
                administrador: currentUser.name,
                comentario: comentarioAdmin,
                accion: 'Aceptado y enviado a detección de fraudes'
              }
            ],
            fechaEnvioFraudes: new Date().toISOString()
          }
        : acc
    );

    localStorage.setItem('accidentes', JSON.stringify(accidentesActualizados));
    setAccidentes(accidentesActualizados);
    setAccidenteSeleccionado(accidentesActualizados.find(acc => acc.id === accidenteSeleccionado.id));
    setComentarioAdmin('');
    setMostrarAcciones(false);
    alert('✅ Accidente aceptado y enviado a detección de fraudes correctamente.');
  };

  const handleRechazarAccidente = () => {
    if (!comentarioAdmin.trim()) {
      alert('Por favor, agregue un comentario explicando el motivo del rechazo.');
      return;
    }

    const accidentesActualizados = accidentes.map(acc => 
      acc.id === accidenteSeleccionado.id 
        ? {
            ...acc,
            estado: 'Rechazado',
            comentariosAdmin: [
              ...(acc.comentariosAdmin || []),
              {
                id: Date.now(),
                fecha: new Date().toISOString(),
                administrador: currentUser.name,
                comentario: comentarioAdmin,
                accion: 'Rechazado'
              }
            ],
            fechaRechazo: new Date().toISOString()
          }
        : acc
    );

    localStorage.setItem('accidentes', JSON.stringify(accidentesActualizados));
    setAccidentes(accidentesActualizados);
    setAccidenteSeleccionado(accidentesActualizados.find(acc => acc.id === accidenteSeleccionado.id));
    setComentarioAdmin('');
    setMostrarAcciones(false);
    alert('❌ Accidente rechazado. Se notificará al cliente.');
  };

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🚗 RevisarAccidentes - Cargando datos iniciales...');
    console.log('   - Permisos recibidos:', permissions);
    console.log('   - Pólizas recibidas:', polizas?.length || 0);
    
    // Cargar accidentes del localStorage
    const accidentesGuardados = JSON.parse(localStorage.getItem('accidentes') || '[]');
    console.log('   - Accidentes cargados:', accidentesGuardados.length);
    setAccidentes(accidentesGuardados);

    // Obtener usuario actual directamente del sessionManager
    const currentUser = sessionManager.getCurrentUser();
    console.log('   - Usuario actual (sessionManager):', currentUser);
    
    if (permissions?.isCliente && currentUser) {
      console.log('   - Usuario cliente identificado:', currentUser);

      if (polizas && polizas.length > 0) {
        const vehiculos = polizas
          .filter(poliza => {
            console.log('   - Evaluando póliza:', {
              numero: poliza.numeroPoliza,
              cliente: poliza.titular || poliza.clienteName,
              clienteId: poliza.clienteId,
              currentUserId: currentUser?.id,
              currentUserName: currentUser?.name
            });
            
            const matchesById = poliza.clienteId === currentUser?.id;
            const matchesByName = poliza.titular === currentUser?.name || poliza.clienteName === currentUser?.name;
            const matchesByTitular = poliza.titular?.toLowerCase() === currentUser?.name?.toLowerCase();
            
            return poliza.estado === 'Activa' && (matchesById || matchesByName || matchesByTitular);
          })
          .map(poliza => ({
            id: `${poliza.numeroPoliza}-${poliza.vehiculo}`,
            polizaId: poliza.numeroPoliza,
            vehiculoCompleto: poliza.vehiculo,
            marca: poliza.vehiculo?.split(' ')[0] || '',
            modelo: poliza.vehiculo?.split(' ')[1] || '',
            año: poliza.vehiculo?.split(' ')[2] || '',
            placa: poliza.placa || 'No especificada',
            titular: poliza.titular || poliza.clienteName
          }));

        console.log('   - Vehículos asegurados encontrados:', vehiculos);
        setVehiculosAsegurados(vehiculos);
      }
    } else if (permissions?.isAdmin && polizas) {
      // Administrador puede ver todos los vehículos asegurados
      const todosVehiculos = polizas
        .filter(poliza => poliza.estado === 'Activa')
        .map(poliza => ({
          id: `${poliza.numeroPoliza}-${poliza.vehiculo}`,
          polizaId: poliza.numeroPoliza,
          vehiculoCompleto: poliza.vehiculo,
          marca: poliza.vehiculo?.split(' ')[0] || '',
          modelo: poliza.vehiculo?.split(' ')[1] || '',
          año: poliza.vehiculo?.split(' ')[2] || '',
          placa: poliza.placa || 'No especificada',
          titular: poliza.titular || poliza.clienteName
        }));

      console.log('   - Admin: Todos los vehículos asegurados:', todosVehiculos.length);
      setVehiculosAsegurados(todosVehiculos);
    }
  }, [permissions, polizas]);

  // Función para manejar la eliminación de accidentes (solo admin)
  const handleEliminarAccidente = (id) => {
    if (!permissions?.isAdmin) return;
    
    if (window.confirm('¿Está seguro de que desea eliminar este accidente?')) {
      const currentUser = sessionManager.getCurrentUser();
      const accidente = accidentes.find(acc => acc.id === id);
      if (currentUser && accidente && accidente.cliente !== currentUser.name) {
        alert('No tiene permisos para eliminar accidentes de otros clientes');
        return;
      }
      
      const nuevosAccidentes = accidentes.filter(acc => acc.id !== id);
      setAccidentes(nuevosAccidentes);
      localStorage.setItem('accidentes', JSON.stringify(nuevosAccidentes));
      alert('Accidente eliminado exitosamente');
    }
  };

  // Función para manejar cambios de estado
  const handleCambiarEstado = (id, nuevoEstado) => {
    const currentUser = sessionManager.getCurrentUser();
    if (!permissions?.canChangeAccidentStatus) return;

    const accidentesActualizados = accidentes.map(acc => 
      acc.id === id 
        ? { 
            ...acc, 
            estado: nuevoEstado,
            fechaActualizacion: new Date().toISOString().split('T')[0],
            actualizadoPor: currentUser?.name || 'Sistema'
          } 
        : acc
    );
    
    setAccidentes(accidentesActualizados);
    localStorage.setItem('accidentes', JSON.stringify(accidentesActualizados));
    alert(`Estado del accidente actualizado a: ${nuevoEstado}`);
  };

  // Función para renderizar el formulario de reporte mejorado
  const renderReporteForm = () => {
    if (activeTab !== 'reportar') return null;

    const currentUser = sessionManager.getCurrentUser();

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

    // Usar el FormularioAccidenteNuevo con sistema de 3 pasos
    return (
      <FormularioAccidenteNuevo
        polizas={polizas}
        currentUser={currentUser}
        onSubmit={(datosAccidente) => {
          // Crear el accidente usando los datos del formulario mejorado
          const accidentesExistentes = JSON.parse(localStorage.getItem('accidentes') || '[]');
          const numeroReporte = `ACC-${Date.now()}`;
          
          const accidente = {
            id: Date.now(),
            numeroReporte,
            // Datos de la póliza
            cliente: datosAccidente.poliza?.titular || datosAccidente.nombreConductor,
            vehiculo: datosAccidente.poliza?.vehiculo,
            placa: datosAccidente.poliza?.placa,
            polizaId: datosAccidente.poliza?.poliza,
            cobertura: datosAccidente.poliza?.cobertura,
            // Datos del accidente
            fechaHora: datosAccidente.fechaHora,
            ubicacion: datosAccidente.ubicacion,
            descripcion: datosAccidente.descripcion,
            nombreConductor: datosAccidente.nombreConductor,
            gravedad: datosAccidente.gravedad,
            hubeLesionados: datosAccidente.hubeLesionados,
            otrosVehiculos: datosAccidente.otrosVehiculos,
            reportePolicial: datosAccidente.reportePolicial,
            fotos: datosAccidente.fotos,
            documentos: datosAccidente.documentos,
            tipoReclamo: datosAccidente.tipoReclamo,
            // Metadatos
            estado: 'Reportado',
            fechaReporte: new Date().toISOString().split('T')[0],
            fechaAsignacion: null,
            montoEstimado: 0,
            ajustador: null,
            clienteId: currentUser?.id
          };

          const nuevosAccidentes = [...accidentesExistentes, accidente];
          localStorage.setItem('accidentes', JSON.stringify(nuevosAccidentes));
          
          setAccidentes(nuevosAccidentes);
          setActiveTab('lista');
          alert(`✅ Accidente reportado exitosamente con número: ${numeroReporte}`);
        }}
        onCancel={() => setActiveTab('lista')}
      />
    );
  };

  // Función para manejar envío a detección de fraudes
  const handleAceptarYEnviarAFraudes = (accidenteId) => {
    // Buscar el accidente
    const accidente = accidentes.find(acc => acc.id === accidenteId);
    if (!accidente) return;

    // Actualizar estado del accidente a "En investigación"
    const accidentesActualizados = accidentes.map(acc => 
      acc.id === accidenteId 
        ? { 
            ...acc, 
            estado: 'En investigación',
            fechaEnvioFraudes: new Date().toISOString().split('T')[0],
            aceptadoPorAdmin: true,
            enviadoADeteccionFraudes: true
          } 
        : acc
    );
    
    setAccidentes(accidentesActualizados);
    localStorage.setItem('accidentes', JSON.stringify(accidentesActualizados));
    
    alert('✅ Accidente enviado a Detección de Fraudes para investigación');
  };

  // Filtros
  const filteredAccidentes = accidentes.filter(accidente => {
    const matchesSearch = searchTerm === '' || 
      accidente.numeroReporte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accidente.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accidente.vehiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accidente.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === 'todos' || accidente.estado === filterEstado;
    const matchesGravedad = filterGravedad === 'todos' || accidente.gravedad === filterGravedad;

    // Filtro adicional para clientes - solo sus propios accidentes
    const currentUser = sessionManager.getCurrentUser();
    if (permissions?.isCliente && currentUser) {
      return matchesSearch && matchesEstado && matchesGravedad && 
             (accidente.clienteId === currentUser.id || accidente.cliente === currentUser.name);
    }

    return matchesSearch && matchesEstado && matchesGravedad;
  });

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

        {/* Navegación de pestañas */}
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('lista')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'lista' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Accidentes ({metricas.total})
          </button>
          {permissions?.canReportAccidentes && (
            <button
              onClick={() => setActiveTab('reportar')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'reportar' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reportar Accidente
            </button>
          )}
        </div>

        {/* Búsqueda y filtros - Solo mostrar en pestaña lista */}
        {activeTab === 'lista' && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
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
              <option value="Rechazado">Rechazado</option>
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
        )}
      </div>

      {/* Métricas - Solo mostrar en pestaña lista */}
      {activeTab === 'lista' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Reportados</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.reportados}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">En Investigación</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.enInvestigacion}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.completados}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de accidentes */}
      {activeTab === 'lista' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Lista de Accidentes ({filteredAccidentes.length})
            </h3>
            
            {filteredAccidentes.length === 0 ? (
              <div className="text-center py-12">
                <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron accidentes</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterEstado !== 'todos' || filterGravedad !== 'todos' 
                    ? 'No hay accidentes que coincidan con los filtros aplicados.'
                    : 'No hay accidentes reportados aún.'
                  }
                </p>
                {permissions?.canReportAccidentes && (
                  <button
                    onClick={() => setActiveTab('reportar')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reportar Primer Accidente
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accidente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente/Vehículo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha/Ubicación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gravedad
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAccidentes.map((accidente) => (
                      <tr key={accidente.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Car className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {accidente.numeroReporte}
                              </div>
                              <div className="text-sm text-gray-500">
                                {accidente.gravedad ? `Gravedad: ${accidente.gravedad}` : (accidente.tipoAccidente || 'No especificado')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {accidente.cliente || accidente.nombreConductor || 'Cliente no especificado'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {accidente.vehiculo} - {accidente.placa}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {accidente.fechaHora ? 
                              new Date(accidente.fechaHora).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) :
                              `${accidente.fecha} ${accidente.hora && `- ${accidente.hora}`}`
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {accidente.ubicacion || 'Ubicación no especificada'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            accidente.estado === 'Reportado' ? 'bg-yellow-100 text-yellow-800' :
                            accidente.estado === 'En investigación' ? 'bg-orange-100 text-orange-800' :
                            accidente.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                            accidente.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {accidente.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            accidente.gravedad === 'Leve' ? 'bg-green-100 text-green-800' :
                            accidente.gravedad === 'Moderado' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {accidente.gravedad || 'No especificada'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center space-x-2">
                            {/* Indicador de comentarios del admin (admin siempre, cliente solo si rechazado) */}
                            {accidente.comentariosAdmin && accidente.comentariosAdmin.length > 0 && 
                             (permissions?.isAdmin || accidente.estado === 'Rechazado') && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                {accidente.comentariosAdmin.length}
                              </span>
                            )}
                            
                            {/* Indicador de enviado a fraudes (solo admin) */}
                            {permissions?.isAdmin && accidente.enviadoADeteccionFraudes && (
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                🔍 Fraudes
                              </span>
                            )}

                            <button
                              onClick={() => {
                                setAccidenteSeleccionado(accidente);
                                setMostrarModal(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center"
                              title="Ver detalles"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver
                            </button>
                            {permissions?.canChangeAccidentStatus && accidente.estado === 'Reportado' && (
                              <button
                                onClick={() => handleCambiarEstado(accidente.id, 'En investigación')}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center"
                                title="Investigar"
                              >
                                <Search className="w-3 h-3 mr-1" />
                                Investigar
                              </button>
                            )}
                            {permissions?.isAdmin && accidente.estado === 'En investigación' && !accidente.enviadoADeteccionFraudes && (
                              <button
                                onClick={() => handleAceptarYEnviarAFraudes(accidente.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center"
                                title="Enviar a Detección de Fraudes"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                Enviar a Fraudes
                              </button>
                            )}
                            {permissions?.isAdmin && accidente.enviadoADeteccionFraudes && (
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                En Detección Fraudes
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formulario de reporte */}
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
                    <p><strong>Cliente:</strong> {accidenteSeleccionado.cliente || accidenteSeleccionado.nombreConductor || 'No especificado'}</p>
                    <p><strong>Vehículo:</strong> {accidenteSeleccionado.vehiculo}</p>
                    <p><strong>Placa:</strong> {accidenteSeleccionado.placa}</p>
                    <p><strong>Póliza:</strong> {accidenteSeleccionado.polizaId}</p>
                    <p><strong>Fecha y Hora:</strong> {accidenteSeleccionado.fechaHora || `${accidenteSeleccionado.fecha} ${accidenteSeleccionado.hora}`}</p>
                    <p><strong>Ubicación:</strong> {accidenteSeleccionado.ubicacion}</p>
                    <p><strong>Conductor:</strong> {accidenteSeleccionado.nombreConductor || 'No especificado'}</p>
                    <p><strong>Estado:</strong> <span className={`font-medium ${
                      accidenteSeleccionado.estado === 'Reportado' ? 'text-yellow-600' :
                      accidenteSeleccionado.estado === 'En investigación' ? 'text-orange-600' :
                      accidenteSeleccionado.estado === 'Completado' ? 'text-green-600' :
                      accidenteSeleccionado.estado === 'Rechazado' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>{accidenteSeleccionado.estado}</span></p>
                    <p><strong>Gravedad:</strong> <span className={`font-medium ${
                      accidenteSeleccionado.gravedad === 'Leve' ? 'text-green-600' :
                      accidenteSeleccionado.gravedad === 'Moderado' ? 'text-yellow-600' :
                      accidenteSeleccionado.gravedad === 'Grave' ? 'text-orange-600' :
                      accidenteSeleccionado.gravedad === 'Total' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>{accidenteSeleccionado.gravedad || 'No especificada'}</span></p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detalles Adicionales</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Hubo lesionados:</strong> {accidenteSeleccionado.hubeLesionados ? 'Sí' : 'No'}</p>
                    <p><strong>Otros vehículos:</strong> {accidenteSeleccionado.otrosVehiculos ? 'Sí' : 'No'}</p>
                    <p><strong>Reporte policial:</strong> {accidenteSeleccionado.reportePolicial ? 'Sí' : 'No'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-700">
                    {accidenteSeleccionado.descripcionDaños || accidenteSeleccionado.descripcion || 'No hay descripción disponible'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Fotos del Accidente</h4>
                  {accidenteSeleccionado.fotos && accidenteSeleccionado.fotos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {accidenteSeleccionado.fotos.map((foto, index) => {
                        const imageUrl = getSafeImageUrl(foto);
                        return (
                          <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => {
                                if (imageUrl && imageUrl !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5TDEzIDEwTDEyIDExTDExIDEwTDEyIDlaIiBmaWxsPSIjOTQ5Nzk3Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5NDk3OTciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPHN2Zz4K') {
                                  window.open(imageUrl, '_blank');
                                }
                              }}
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5TDEzIDEwTDEyIDExTDExIDEwTDEyIDlaIiBmaWxsPSIjOTQ5Nzk3Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5NDk3OTciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPHN2Zz4K';
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay fotos disponibles</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Documentos</h4>
                  {accidenteSeleccionado.documentos && accidenteSeleccionado.documentos.length > 0 ? (
                    <div className="space-y-2">
                      {accidenteSeleccionado.documentos.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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
                              {doc.size && <p className="text-xs text-gray-500">{(doc.size / 1024 / 1024).toFixed(2)} MB</p>}
                            </div>
                          </div>
                          <button 
                            className="text-blue-600 hover:text-blue-800 transition-colors" 
                            title="Descargar"
                            onClick={() => {
                              if (doc.data) {
                                const link = document.createElement('a');
                                link.href = doc.data;
                                link.download = doc.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay documentos disponibles</p>
                  )}
                </div>
              </div>
            </div>

            {/* Comentarios del Admin (admin siempre, cliente solo si fue rechazado) */}
            {accidenteSeleccionado.comentariosAdmin && accidenteSeleccionado.comentariosAdmin.length > 0 && 
             (permissions?.isAdmin || accidenteSeleccionado.estado === 'Rechazado') && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Historial de Comentarios del Admin</h4>
                <div className="space-y-3">
                  {accidenteSeleccionado.comentariosAdmin.map((comentario) => (
                    <div key={comentario.id} className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-blue-900">{comentario.administrador}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            comentario.accion === 'Aceptado y enviado a detección de fraudes' ? 'bg-green-100 text-green-800' :
                            comentario.accion === 'Rechazado' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {comentario.accion}
                          </span>
                        </div>
                        <span className="text-xs text-blue-600">
                          {new Date(comentario.fecha).toLocaleString('es-ES')}
                        </span>
                      </div>
                      <p className="text-blue-800">{comentario.comentario}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones del Admin */}
            {permissions?.isAdmin && !['Rechazado', 'En investigación'].includes(accidenteSeleccionado.estado) && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-900">Acciones de Administrador</h4>
                  <button
                    onClick={() => setMostrarAcciones(!mostrarAcciones)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {mostrarAcciones ? 'Ocultar Acciones' : 'Gestionar Accidente'}
                  </button>
                </div>

                {mostrarAcciones && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentario/Observaciones *
                      </label>
                      <textarea
                        value={comentarioAdmin}
                        onChange={(e) => setComentarioAdmin(e.target.value)}
                        placeholder="Agregue sus comentarios u observaciones sobre este accidente..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleAceptarAccidente}
                        disabled={!comentarioAdmin.trim()}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aceptar y Enviar a Fraudes
                      </button>

                      <button
                        onClick={handleRechazarAccidente}
                        disabled={!comentarioAdmin.trim()}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rechazar Solicitud
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">
                      * El comentario es obligatorio y será visible para el cliente (especifique motivos)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Botón cerrar */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setMostrarModal(false);
                  setMostrarAcciones(false);
                  setComentarioAdmin('');
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisarAccidentes;