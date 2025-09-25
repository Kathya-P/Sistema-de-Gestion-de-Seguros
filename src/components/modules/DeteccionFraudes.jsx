import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Search, 
  TrendingUp,
  Clock,
  Flag,
  UserX,
  Download,
  Plus,
  BarChart3,
  X
} from 'lucide-react';

// Función para calcular el score de riesgo
const calcularScoreRiesgo = (accidente) => {
  let score = 0;
  const fechaActual = new Date();
  const fechaAccidente = new Date(accidente.fecha);
  const fechaReporte = new Date(accidente.fechaReporte);
  const diasDesdeSeguroContratado = Math.floor(
    (fechaAccidente - new Date(accidente.fechaContratacionSeguro)) / (1000 * 60 * 60 * 24)
  );

  // 1. Timing sospechoso (días entre accidente y reporte)
  const diasRetraso = Math.floor((fechaReporte - fechaAccidente) / (1000 * 60 * 60 * 24));
  if (diasRetraso > 2) {
    score += 20;
    console.log(`[Fraude] Retraso en reporte: ${diasRetraso} días (+20 puntos)`);
  }

  // 2. Cliente nuevo (menos de un mes)
  if (diasDesdeSeguroContratado < 30) {
    score += 15;
    console.log(`[Fraude] Cliente nuevo: ${diasDesdeSeguroContratado} días desde contratación (+15 puntos)`);
  }

  // 3. Monto elevado (>70% del valor del vehículo)
  const porcentajeValor = (accidente.montoReclamado / accidente.valorVehiculo) * 100;
  if (porcentajeValor > 70) {
    score += 25;
    console.log(`[Fraude] Monto elevado: ${porcentajeValor.toFixed(1)}% del valor del vehículo (+25 puntos)`);
  }

  // 4. Patrón del cliente y historial
  const todosAccidentes = JSON.parse(localStorage.getItem('accidentes') || '[]');
  const accidentesPrevios = todosAccidentes.filter(a => 
    a.clienteId === accidente.clienteId && a.id !== accidente.id
  );
  
  // 4.1 Accidentes recientes (últimos 3 meses)
  const accidentesRecientes = accidentesPrevios.filter(a => {
    const mesesDiferencia = (fechaAccidente - new Date(a.fechaHora || a.fechaReporte)) / (1000 * 60 * 60 * 24 * 30);
    return mesesDiferencia <= 3;
  });
  
  if (accidentesRecientes.length >= 1) {
    score += 20;
    console.log(`[Fraude] Accidente previo en últimos 3 meses (+20 puntos)`);
  }
  if (accidentesRecientes.length >= 2) {
    score += 20;
    console.log(`[Fraude] Múltiples accidentes previos en últimos 3 meses (+20 puntos)`);
  }

  // 5. Factores adicionales de riesgo
  if (!accidente.reportePolicial && accidente.montoReclamado > 1000) {
    score += 10;
    console.log(`[Fraude] Sin reporte policial en reclamo significativo (+10 puntos)`);
  }
  
  if (accidente.otrosVehiculos && !accidente.reportePolicial) {
    score += 15;
    console.log(`[Fraude] Accidente con otros vehículos sin reporte policial (+15 puntos)`);
  }

  return Math.min(100, score); // Asegurar que no exceda 100
};

// Función para clasificar el caso según el score
const clasificarCaso = (score) => {
  if (score <= 30) return 'Aprobación automática';
  if (score <= 60) return 'Revisión rápida';
  return 'Investigación obligatoria';
};

const DeteccionFraudes = ({ permissions }) => {
  const [activeTab, setActiveTab] = useState('casos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiesgo, setFilterRiesgo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetalles, setShowDetalles] = useState(false);
  const [casoSeleccionado, setCasoSeleccionado] = useState(null);

  const [casosFraude, setCasosFraude] = useState([]);

  const [clientesBloqueados, setClientesBloqueados] = useState([]);

  const filteredCasos = casosFraude.filter(caso => {
    const matchesSearch = caso.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caso.numeroReclamo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caso.tipoFraude.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRiesgo = filterRiesgo === 'todos' || caso.riesgo === filterRiesgo;
    const matchesEstado = filterEstado === 'todos' || caso.estado === filterEstado;
    return matchesSearch && matchesRiesgo && matchesEstado;
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar accidentes enviados a detección de fraudes
        const accidentes = JSON.parse(localStorage.getItem('accidentes') || '[]');
        const accidentesEnFraudes = accidentes.filter(acc => acc.enviadoADeteccionFraudes);
        
        // Procesar cada caso y calcular su score
        const casosConScore = accidentesEnFraudes.map(accidente => {
          // Convertir el accidente al formato para análisis de fraude
          const casoFraude = {
            id: accidente.id,
            cliente: accidente.cliente,
            numeroReclamo: accidente.numeroReporte,
            fecha: new Date(accidente.fechaHora || accidente.fechaReporte),
            fechaReporte: new Date(accidente.fechaReporte),
            fechaContratacionSeguro: new Date(accidente.poliza?.fechaContratacion || Date.now()),
            montoReclamado: accidente.montoSolicitado || accidente.montoEstimado || 0,
            valorVehiculo: accidente.poliza?.valorVehiculo || 0,
            clienteId: accidente.clienteId,
            estado: 'En investigación',
            tipoFraude: 'En análisis'
          };
          
          const score = calcularScoreRiesgo(casoFraude);
          const clasificacion = clasificarCaso(score);
          
          return {
            ...casoFraude,
            scoreRiesgo: score,
            clasificacion: clasificacion,
            vehiculo: accidente.vehiculo,
            placa: accidente.placa,
            polizaId: accidente.polizaId,
            descripcion: accidente.descripcion,
            ubicacion: accidente.ubicacion,
            hubeLesionados: accidente.hubeLesionados,
            otrosVehiculos: accidente.otrosVehiculos,
            reportePolicial: accidente.reportePolicial,
            investigador: accidente.ajustador || 'Sin asignar'
          };
        });
        
        // Obtener clientes bloqueados (aquellos con score > 60)
        const clientesBloqueados = casosConScore
          .filter(caso => caso.scoreRiesgo > 60)
          .map(caso => ({
            id: caso.clienteId,
            nombre: caso.cliente,
            motivoBloqueo: 'Alto riesgo de fraude',
            fechaBloqueo: new Date().toISOString().split('T')[0],
            reclamosAfectados: 1,
            montoTotal: caso.montoReclamado
          }));
          
        setCasosFraude(casosConScore);
        setClientesBloqueados(clientesBloqueados);

        // Actualizar localStorage con los resultados del análisis
        localStorage.setItem('casosFraude', JSON.stringify(casosConScore));
        localStorage.setItem('clientesBloqueados', JSON.stringify(clientesBloqueados));
        
        // Calcular métricas
        const casosActivos = casosConScore.filter(caso => caso.estado === 'En investigación').length;
        const fraudesConfirmados = casosConScore.filter(caso => caso.estado === 'Confirmado fraude').length;
        const montoPrevenido = casosConScore
          .filter(caso => caso.estado === 'Confirmado fraude')
          .reduce((total, caso) => total + (caso.montoReclamado || 0), 0);

        setMetricas({
          casosActivos,
          fraudesConfirmados,
          clientesBloqueados: clientesBloqueados.length,
          montoPrevenido
        });
      } catch (error) {
        setError('Error al cargar los datos: ' + error.message);
        console.error('Error al cargar datos de fraude:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const [metricas, setMetricas] = useState({
    casosActivos: 0,
    fraudesConfirmados: 0,
    clientesBloqueados: 0,
    montoPrevenido: 0
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-grow">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#fef3f2'}}>
              <Shield className="w-6 h-6" style={{color: '#dc2626'}} />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-900">Detección de Fraudes</h2>
              <p className="text-gray-600">Sistema de prevención y detección de actividades fraudulentas</p>
            </div>
          </div>
          {permissions.isAdmin && (
            <button
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Reporte de Fraudes
            </button>
          )}
        </div>
        
        {/* Búsqueda y Filtros */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-grow relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por cliente, número de reclamo o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRiesgo}
            onChange={(e) => setFilterRiesgo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="todos">Todos los riesgos</option>
            <option value="Alto">Alto riesgo</option>
            <option value="Medio">Medio riesgo</option>
            <option value="Bajo">Bajo riesgo</option>
          </select>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En investigación">En investigación</option>
            <option value="Confirmado fraude">Confirmado fraude</option>
            <option value="Falsa alarma">Falsa alarma</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-200 mt-6 px-1">
          <button
            onClick={() => setActiveTab('casos')}
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'casos' 
                ? 'border-red-600 text-red-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Casos de Fraude
          </button>
          <button
            onClick={() => setActiveTab('bloqueados')}
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'bloqueados' 
                ? 'border-red-600 text-red-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Clientes Bloqueados
          </button>
          <button
            onClick={() => setActiveTab('reportes')}
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'reportes' 
                ? 'border-red-600 text-red-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Reportes y Análisis
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="mt-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos Activos</p>
                <p className="text-2xl font-bold" style={{color: '#d97706'}}>
                  {metricas.casosActivos}
                </p>
              </div>
              <Clock className="w-8 h-8" style={{color: '#d97706', opacity: 0.3}} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fraudes Confirmados</p>
                <p className="text-2xl font-bold" style={{color: '#dc2626'}}>
                  {metricas.fraudesConfirmados}
                </p>
              </div>
              <Flag className="w-8 h-8" style={{color: '#dc2626', opacity: 0.3}} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Bloqueados</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.clientesBloqueados}</p>
              </div>
              <UserX className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monto Prevenido</p>
                <p className="text-2xl font-bold" style={{color: '#059669'}}>
                  ${metricas.montoPrevenido.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8" style={{color: '#059669', opacity: 0.3}} />
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'casos' && (
        <div className="space-y-6">
          {/* Lista de casos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Casos de Fraude ({filteredCasos.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {filteredCasos.map((caso) => (
                  <div key={caso.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: '#fef3f2'}}>
                          <Shield className="w-5 h-5" style={{color: '#dc2626'}} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{caso.cliente}</h4>
                          <p className="text-sm text-gray-500">{caso.numeroReclamo} - {caso.tipoFraude}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          caso.scoreRiesgo > 60 ? 'bg-red-100 text-red-800' :
                          caso.scoreRiesgo > 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Score de Riesgo: {caso.scoreRiesgo}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          caso.clasificacion === 'Investigación obligatoria' ? 'bg-red-100 text-red-800' :
                          caso.clasificacion === 'Revisión rápida' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {caso.clasificacion}
                        </span>
                        <button 
                          onClick={() => {
                            setCasoSeleccionado(caso);
                            setShowDetalles(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Ver detalles del análisis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <span className={`font-semibold ${
                          caso.estado === 'Confirmado fraude' ? 'text-red-600' :
                          caso.estado === 'En investigación' ? 'text-yellow-600' :
                          caso.estado === 'Falsa alarma' ? 'text-green-600' :
                          'text-gray-600'
                        }`}>
                          {caso.estado}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Investigador:</span>
                        <span className="font-semibold text-gray-900">{caso.investigador}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-500">Monto reclamado:</span>
                        <span className="font-semibold" style={{color: '#dc2626'}}>${caso.montoReclamado.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCasos.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-2">No se encontraron casos de fraude</p>
                  <p className="text-sm text-gray-400">
                    {searchTerm ? 'Intenta con un término de búsqueda diferente' : 'No hay casos registrados'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bloqueados' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Clientes Bloqueados por Fraude</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {clientesBloqueados.map((cliente) => (
                <div key={cliente.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: '#fef3f2'}}>
                        <UserX className="w-5 h-5" style={{color: '#dc2626'}} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{cliente.nombre}</h4>
                        <p className="text-sm text-gray-500">{cliente.cedula}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Motivo:</span>
                      <span className="font-semibold text-red-600">{cliente.motivoBloqueo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Fecha de bloqueo:</span>
                      <span className="font-semibold text-gray-900">{cliente.fechaBloqueo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Reclamos afectados:</span>
                      <span className="font-semibold text-gray-900">{cliente.reclamosAfectados}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-500">Monto total:</span>
                      <span className="font-semibold" style={{color: '#dc2626'}}>${cliente.montoTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {clientesBloqueados.length === 0 && (
              <div className="text-center py-12">
                <UserX className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">No hay clientes bloqueados</p>
                <p className="text-sm text-gray-400">
                  Los clientes bloqueados por fraude aparecerán aquí
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reportes' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Reportes y Análisis de Fraudes</h3>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-500 mb-2">Reportes en Desarrollo</h4>
            <p className="text-gray-400">
              Los reportes detallados y análisis estadísticos estarán disponibles próximamente
            </p>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {showDetalles && casoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full mx-4 overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-25 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Análisis de Riesgo
                    </h3>
                    <p className="text-blue-100">ID: {casoSeleccionado.numeroReclamo}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetalles(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {/* Score y Clasificación */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Score de Riesgo</h4>
                    <p className="text-gray-500">Evaluación automática del caso</p>
                  </div>
                  <div className={`
                    px-4 py-2 rounded-full font-medium
                    ${casoSeleccionado.scoreRiesgo > 60 ? 'bg-red-100 text-red-800' :
                      casoSeleccionado.scoreRiesgo > 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}
                  `}>
                    {casoSeleccionado.scoreRiesgo}/100 puntos
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      casoSeleccionado.scoreRiesgo > 60 ? 'bg-red-500' :
                      casoSeleccionado.scoreRiesgo > 30 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{width: casoSeleccionado.scoreRiesgo + '%'}}
                  ></div>
                </div>
              </div>

              {/* Grid de Información */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Información del Reclamo</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cliente:</span>
                      <span className="font-medium">{casoSeleccionado.cliente}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vehículo:</span>
                      <span className="font-medium">{casoSeleccionado.vehiculo} ({casoSeleccionado.placa})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monto Reclamado:</span>
                      <span className="font-medium">${casoSeleccionado.montoReclamado.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valor del Vehículo:</span>
                      <span className="font-medium">${casoSeleccionado.valorVehiculo.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Factores de Riesgo</h4>
                  <div className="space-y-2">
                    {/* Días desde contratación */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tiempo desde contratación:</span>
                      <span className={`font-medium ${Math.floor((new Date(casoSeleccionado.fecha) - new Date(casoSeleccionado.fechaContratacionSeguro)) / (1000 * 60 * 60 * 24)) < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                        {Math.floor((new Date(casoSeleccionado.fecha) - new Date(casoSeleccionado.fechaContratacionSeguro)) / (1000 * 60 * 60 * 24))} días
                      </span>
                    </div>
                    {/* Días hasta reporte */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Demora en reporte:</span>
                      <span className={`font-medium ${Math.floor((new Date(casoSeleccionado.fechaReporte) - new Date(casoSeleccionado.fecha)) / (1000 * 60 * 60 * 24)) > 2 ? 'text-red-600' : 'text-gray-900'}`}>
                        {Math.floor((new Date(casoSeleccionado.fechaReporte) - new Date(casoSeleccionado.fecha)) / (1000 * 60 * 60 * 24))} días
                      </span>
                    </div>
                    {/* Indicadores adicionales */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Lesionados:</span>
                      <span className={`font-medium ${casoSeleccionado.hubeLesionados ? 'text-red-600' : 'text-green-600'}`}>
                        {casoSeleccionado.hubeLesionados ? '⚠️ Sí' : '✅ No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Otros vehículos:</span>
                      <span className={`font-medium ${casoSeleccionado.otrosVehiculos && !casoSeleccionado.reportePolicial ? 'text-red-600' : 'text-gray-900'}`}>
                        {casoSeleccionado.otrosVehiculos ? '⚠️ Sí' : '✅ No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Reporte policial:</span>
                      <span className={`font-medium ${!casoSeleccionado.reportePolicial ? 'text-red-600' : 'text-green-600'}`}>
                        {casoSeleccionado.reportePolicial ? '✅ Sí' : '⚠️ No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decisión Automática */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Decisión del Sistema</h4>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    casoSeleccionado.scoreRiesgo > 60 ? 'bg-red-100 text-red-800' :
                    casoSeleccionado.scoreRiesgo > 30 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {casoSeleccionado.clasificacion}
                  </span>
                  <p className="text-gray-600 text-sm">
                    {casoSeleccionado.scoreRiesgo <= 30 ? 'Se procederá con el pago del reclamo' :
                     casoSeleccionado.scoreRiesgo <= 60 ? 'Se requiere revisión documental' :
                     'Caso bloqueado - Alto riesgo de fraude'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeteccionFraudes;