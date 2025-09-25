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
  Plus,
  BarChart3,
  X,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  User,
  Brain,
  DollarSign,
  Users
} from 'lucide-react';

// Función para calcular el score de riesgo
const calcularScoreRiesgo = (accidente) => {
  let score = 0;
  let justificaciones = [];
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
    justificaciones.push(`Retraso en reporte: ${diasRetraso} días después del accidente (+20 puntos)`);
    console.log(`[Fraude] Retraso en reporte: ${diasRetraso} días (+20 puntos)`);
  }

  // 2. Cliente nuevo (menos de un mes)
  if (diasDesdeSeguroContratado < 30) {
    score += 15;
    justificaciones.push(`Cliente nuevo: Solo ${diasDesdeSeguroContratado} días desde la contratación del seguro (+15 puntos)`);
    console.log(`[Fraude] Cliente nuevo: ${diasDesdeSeguroContratado} días desde contratación (+15 puntos)`);
  }

  // 3. Monto elevado (>70% del valor del vehículo)
  const porcentajeValor = (accidente.montoReclamado / accidente.valorVehiculo) * 100;
  if (porcentajeValor > 70) {
    score += 25;
    justificaciones.push(`Monto elevado: ${porcentajeValor.toFixed(1)}% del valor del vehículo (+25 puntos)`);
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
    justificaciones.push(`Historial reciente: ${accidentesRecientes.length} accidente(s) en los últimos 3 meses (+20 puntos)`);
    console.log(`[Fraude] Accidente previo en últimos 3 meses (+20 puntos)`);
  }
  if (accidentesRecientes.length >= 2) {
    score += 20;
    justificaciones.push(`Patrón sospechoso: Múltiples accidentes en poco tiempo (+20 puntos)`);
    console.log(`[Fraude] Múltiples accidentes previos en últimos 3 meses (+20 puntos)`);
  }

  // 5. Factores adicionales de riesgo
  if (!accidente.reportePolicial && accidente.montoReclamado > 1000) {
    score += 10;
    justificaciones.push(`Sin reporte policial: Reclamo de $${accidente.montoReclamado.toLocaleString()} sin respaldo oficial (+10 puntos)`);
    console.log(`[Fraude] Sin reporte policial en reclamo significativo (+10 puntos)`);
  }
  
  if (accidente.otrosVehiculos && !accidente.reportePolicial) {
    score += 15;
    justificaciones.push(`Inconsistencia: Accidente con otros vehículos pero sin reporte policial (+15 puntos)`);
    console.log(`[Fraude] Accidente con otros vehículos sin reporte policial (+15 puntos)`);
  }

  // Si no hay factores de riesgo, agregar nota positiva
  if (justificaciones.length === 0) {
    justificaciones.push(`Perfil de riesgo bajo: No se detectaron patrones sospechosos`);
  }

  return { 
    score: Math.min(100, score), // Asegurar que no exceda 100
    justificaciones: justificaciones
  };
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
  
  // Estados para la decisión administrativa
  const [decisionAdmin, setDecisionAdmin] = useState('');
  const [comentarioAdmin, setComentarioAdmin] = useState('');
  const [mostrarFormularioDecision, setMostrarFormularioDecision] = useState(false);
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
        
        // **PRIMERO intentar cargar casos existentes de localStorage**
        const casosExistentes = JSON.parse(localStorage.getItem('casosFraude') || '[]');
        const clientesExistentes = JSON.parse(localStorage.getItem('clientesBloqueados') || '[]');
        
        if (casosExistentes.length > 0) {
          // Si hay casos guardados, usarlos
          setCasosFraude(casosExistentes);
          setClientesBloqueados(clientesExistentes);
          setLoading(false);
          return;
        }
        
        // Si no hay casos guardados, generar nuevos desde accidentes
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
          
          const resultado = calcularScoreRiesgo(casoFraude);
          const clasificacion = clasificarCaso(resultado.score);
          
          return {
            ...casoFraude,
            scoreRiesgo: resultado.score,
            justificaciones: resultado.justificaciones,
            clasificacion: clasificacion,
            vehiculo: accidente.vehiculo,
            placa: accidente.placa,
            polizaId: accidente.polizaId,
            descripcion: accidente.descripcion,
            ubicacion: accidente.ubicacion,
            hubeLesionados: accidente.hubeLesionados,
            otrosVehiculos: accidente.otrosVehiculos,
            reportePolicial: accidente.reportePolicial
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

        // **GUARDAR los casos en localStorage para persistencia**
        localStorage.setItem('casosFraude', JSON.stringify(casosConScore));
        localStorage.setItem('clientesBloqueados', JSON.stringify(clientesBloqueados));
          
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

  // Función para procesar decisión administrativa
  const procesarDecisionAdmin = async (casoId, decision, comentario) => {
    try {
      // Actualizar el caso en localStorage
      const casosActuales = JSON.parse(localStorage.getItem('casosFraude') || '[]');
      const casosActualizados = casosActuales.map(caso => {
        if (caso.numeroReclamo === casoId || caso.id === casoId) {
          return {
            ...caso,
            decisionAdmin: decision,
            comentarioAdmin: comentario,
            fechaDecision: new Date().toISOString(),
            estado: decision === 'aprobado' ? 'Aprobado' : 'Rechazado - Fraude confirmado',
            procesadoPor: 'Administrador'
          };
        }
        return caso;
      });
      
      localStorage.setItem('casosFraude', JSON.stringify(casosActualizados));
      
      // Actualizar el estado local
      setCasosFraude(casosActualizados);
      
      // TAMBIÉN actualizar en accidentes
      const accidentes = JSON.parse(localStorage.getItem('accidentes') || '[]');
      const accidentesActualizados = accidentes.map(acc => {
        if (acc.numeroReporte === casoId || acc.id === casoId) {
          return {
            ...acc,
            estado: decision === 'aprobado' ? 'Aprobado' : 'Rechazado por fraude',
            estadoFraude: decision === 'aprobado' ? 'Aprobado' : 'Rechazado - Fraude',
            comentarioFraude: comentario,
            fechaDecisionFraude: new Date().toISOString(),
            procesadoPor: 'Administrador'
          };
        }
        return acc;
      });
      localStorage.setItem('accidentes', JSON.stringify(accidentesActualizados));
      
      // Cerrar modal y limpiar formulario
      setMostrarFormularioDecision(false);
      setDecisionAdmin('');
      setComentarioAdmin('');
      setShowDetalles(false);
      
      // Mostrar mensaje que recibirá el cliente
      alert(
        `${decision === 'aprobado' ? 'Reclamo APROBADO' : 'Reclamo RECHAZADO'}\n\nMensaje enviado al cliente:\n"${comentario}"\n\nEstado actualizado en ambas secciones.`
      );
      
      return true;
    } catch (error) {
      console.error('Error al procesar decisión:', error);
      return false;
    }
  };

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

      {/* Modal de Detalles */}
      {showDetalles && casoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full m-4 max-h-[85vh] overflow-y-auto shadow-2xl border-2" style={{borderColor: '#03045e'}}>
            {/* Header del Modal */}
            <div className="p-6 border-b border-gray-200" style={{backgroundColor: '#03045e'}}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
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
            <div className="p-6 space-y-8">
              {/* Información Básica */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4" style={{color: '#03045e'}}>
                    <User className="inline w-5 h-5 mr-2" />
                    Información del Cliente
                  </h4>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <p><strong>Cliente:</strong> {casoSeleccionado.cliente}</p>
                    <p><strong>Vehículo:</strong> {casoSeleccionado.vehiculo} ({casoSeleccionado.placa})</p>
                    <p><strong>Monto Reclamado:</strong> ${casoSeleccionado.montoReclamado.toLocaleString()}</p>
                    <p><strong>Valor del Vehículo:</strong> ${casoSeleccionado.valorVehiculo.toLocaleString()}</p>
                    <p><strong>Localización:</strong> {casoSeleccionado.localizacion}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4" style={{color: '#03045e'}}>
                    <TrendingUp className="inline w-5 h-5 mr-2" />
                    Score de Riesgo
                  </h4>
                  <div className="text-center">
                    <div className={`inline-flex items-center px-6 py-4 rounded-xl ${
                      casoSeleccionado.scoreRiesgo >= 70 ? 'bg-red-100 text-red-800' :
                      casoSeleccionado.scoreRiesgo >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      <div className="text-3xl font-bold mr-2">{casoSeleccionado.scoreRiesgo}</div>
                      <div className="text-sm font-semibold">/ 100</div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {casoSeleccionado.scoreRiesgo >= 70 ? 'Riesgo Alto' :
                       casoSeleccionado.scoreRiesgo >= 40 ? 'Riesgo Medio' : 'Riesgo Bajo'}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          casoSeleccionado.scoreRiesgo >= 70 ? 'bg-red-500' :
                          casoSeleccionado.scoreRiesgo >= 40 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{width: casoSeleccionado.scoreRiesgo + '%'}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Justificaciones del Score */}
              {casoSeleccionado.justificaciones && (
                <div>
                  <h4 className="font-semibold mb-4" style={{color: '#03045e'}}>
                    <FileText className="inline w-5 h-5 mr-2" />
                    Justificación del Score
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {casoSeleccionado.justificaciones.map((justificacion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{justificacion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Factores de Riesgo */}
              <div>
                <h4 className="font-semibold mb-4" style={{color: '#03045e'}}>
                  <AlertTriangle className="inline w-5 h-5 mr-2" />
                  Factores de Riesgo Detectados
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {/* Días desde contratación */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tiempo desde contratación:</span>
                    <span className={`font-semibold ${Math.floor((new Date(casoSeleccionado.fecha) - new Date(casoSeleccionado.fechaContratacionSeguro)) / (1000 * 60 * 60 * 24)) < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                      {Math.floor((new Date(casoSeleccionado.fecha) - new Date(casoSeleccionado.fechaContratacionSeguro)) / (1000 * 60 * 60 * 24))} días
                    </span>
                  </div>
                  {/* Días hasta reporte */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Demora en reporte:</span>
                    <span className={`font-semibold ${Math.floor((new Date(casoSeleccionado.fechaReporte) - new Date(casoSeleccionado.fecha)) / (1000 * 60 * 60 * 24)) > 2 ? 'text-red-600' : 'text-gray-900'}`}>
                      {Math.floor((new Date(casoSeleccionado.fechaReporte) - new Date(casoSeleccionado.fecha)) / (1000 * 60 * 60 * 24))} días
                    </span>
                  </div>
                  {/* Indicadores adicionales */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lesionados:</span>
                    <span className={`font-semibold ${casoSeleccionado.hubeLesionados ? 'text-red-600' : 'text-green-600'}`}>
                      {casoSeleccionado.hubeLesionados ? '⚠️ Sí' : '✅ No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Otros vehículos:</span>
                    <span className={`font-semibold ${casoSeleccionado.otrosVehiculos && !casoSeleccionado.reportePolicial ? 'text-red-600' : 'text-gray-900'}`}>
                      {casoSeleccionado.otrosVehiculos ? '⚠️ Sí' : '✅ No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reporte policial:</span>
                    <span className={`font-semibold ${!casoSeleccionado.reportePolicial ? 'text-red-600' : 'text-green-600'}`}>
                      {casoSeleccionado.reportePolicial ? '✅ Sí' : '⚠️ No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decisión del Sistema */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-3" style={{color: '#03045e'}}>
                  <Brain className="inline w-5 h-5 mr-2" />
                  Decisión del Sistema
                </h4>
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    casoSeleccionado.scoreRiesgo >= 70 ? 'bg-red-100 text-red-800' :
                    casoSeleccionado.scoreRiesgo >= 40 ? 'bg-yellow-100 text-yellow-800' :
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

              {/* Decisión Administrativa */}
              {!mostrarFormularioDecision ? (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        setMostrarFormularioDecision(true);
                        setDecisionAdmin('aprobado');
                      }}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Aprobar Reclamo
                    </button>
                    <button
                      onClick={() => {
                        setMostrarFormularioDecision(true);
                        setDecisionAdmin('rechazado');
                      }}
                      className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Rechazar Reclamo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold mb-4" style={{color: '#03045e'}}>
                    <MessageSquare className="inline w-5 h-5 mr-2" />
                    {decisionAdmin === 'aprobado' ? 'Aprobar Reclamo' : 'Rechazar Reclamo'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentario para el cliente:
                      </label>
                      <textarea
                        value={comentarioAdmin}
                        onChange={(e) => setComentarioAdmin(e.target.value)}
                        placeholder={decisionAdmin === 'aprobado' ? 
                          "Reclamo aprobado. Su solicitud ha sido procesada exitosamente..." :
                          "Lamentamos informarle que su reclamo no puede ser procesado en este momento..."
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setMostrarFormularioDecision(false);
                          setDecisionAdmin('');
                          setComentarioAdmin('');
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => procesarDecisionAdmin(casoSeleccionado.numeroReclamo, decisionAdmin, comentarioAdmin)}
                        disabled={!comentarioAdmin.trim()}
                        className={`px-6 py-2 text-white rounded-lg transition-colors ${
                          decisionAdmin === 'aprobado' 
                            ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                            : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                        }`}
                      >
                        Confirmar {decisionAdmin === 'aprobado' ? 'Aprobación' : 'Rechazo'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeteccionFraudes;