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
  BarChart3
} from 'lucide-react';

const DeteccionFraudes = ({ permissions }) => {
  const [activeTab, setActiveTab] = useState('casos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiesgo, setFilterRiesgo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        // Reemplazar con tus endpoints reales de API
        const responsesCasos = await fetch('/api/fraudes/casos');
        const responsesBlocked = await fetch('/api/fraudes/clientesBloqueados');
        
        if (!responsesCasos.ok || !responsesBlocked.ok) {
          throw new Error('Error al cargar los datos');
        }
        
        const casosFraudeData = await responsesCasos.json();
        const clientesBloqueadosData = await responsesBlocked.json();
        
        setCasosFraude(casosFraudeData);
        setClientesBloqueados(clientesBloqueadosData);
        
        // Calcular métricas
        const casosActivos = casosFraudeData.filter(caso => caso.estado === 'En investigación').length;
        const fraudesConfirmados = casosFraudeData.filter(caso => caso.estado === 'Confirmado fraude').length;
        const montoPrevenido = casosFraudeData
          .filter(caso => caso.estado === 'Confirmado fraude')
          .reduce((total, caso) => total + (caso.montoReclamado || 0), 0);

        setMetricas({
          casosActivos,
          fraudesConfirmados,
          clientesBloqueados: clientesBloqueadosData.length,
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#fef3f2'}}>
              <Shield className="w-6 h-6" style={{color: '#dc2626'}} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detección de Fraudes</h2>
              <p className="text-gray-600">Sistema de prevención y detección de actividades fraudulentas</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Reporte de Fraudes
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Caso
            </button>
          </div>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, número de reclamo o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRiesgo}
            onChange={(e) => setFilterRiesgo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
        <div className="flex space-x-4 border-b border-gray-200 mt-6">
          <button
            onClick={() => setActiveTab('casos')}
            className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'casos' 
                ? 'border-red-600 text-red-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Casos de Fraude
          </button>
          <button
            onClick={() => setActiveTab('bloqueados')}
            className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'bloqueados' 
                ? 'border-red-600 text-red-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Clientes Bloqueados
          </button>
          <button
            onClick={() => setActiveTab('reportes')}
            className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'reportes' 
                ? 'border-red-600 text-red-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Reportes y Análisis
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          caso.riesgo === 'Alto' ? 'bg-red-100 text-red-800' :
                          caso.riesgo === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {caso.riesgo}
                        </span>
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
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
    </div>
  );
};

export default DeteccionFraudes;