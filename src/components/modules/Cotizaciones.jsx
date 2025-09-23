import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  FileText, 
  Search, 
  Plus,
  Eye,
  Check,
  X,
  Edit,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Cotizaciones = ({ resultadoCotizacion, handleCalcular, permissions }) => {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [cotizaciones, setCotizaciones] = useState([
    {
      id: 1,
      numero: 'COT-001',
      cliente: 'María López',
      vehiculo: 'Honda Civic 2020',
      placa: 'ABC-123',
      tipoSeguro: 'Todo Riesgo',
      valorAsegurado: 25000,
      prima: 850,
      estado: 'Pendiente',
      fechaSolicitud: '2024-09-18',
      fechaVencimiento: '2024-10-18',
      cobertura: 'Cobertura Completa + Asistencia'
    },
    {
      id: 2,
      numero: 'COT-002',
      cliente: 'Carlos Rodríguez',
      vehiculo: 'Toyota Corolla 2019',
      placa: 'XYZ-789',
      tipoSeguro: 'Responsabilidad Civil',
      valorAsegurado: 20000,
      prima: 450,
      estado: 'Aprobada',
      fechaSolicitud: '2024-09-15',
      fechaVencimiento: '2024-10-15',
      cobertura: 'Daños a Terceros'
    },
    {
      id: 3,
      numero: 'COT-003',
      cliente: 'Ana Jiménez',
      vehiculo: 'Nissan Sentra 2021',
      placa: 'DEF-456',
      tipoSeguro: 'Seguro Básico',
      valorAsegurado: 22000,
      prima: 580,
      estado: 'Rechazada',
      fechaSolicitud: '2024-09-10',
      fechaVencimiento: '2024-10-10',
      cobertura: 'Robo y Daños Parciales'
    }
  ]);

  const [formData, setFormData] = useState({
    tipoSeguro: 'todo-riesgo',
    marca: '',
    modelo: '',
    año: '',
    placa: '',
    valorVehiculo: '',
    deducible: '50000',
    edad: '',
    historialSiniestros: 'sin-siniestros',
    añosLicencia: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCalcular(formData);
  };

  const handleApprove = (id) => {
    setCotizaciones(prev => prev.map(cot => 
      cot.id === id ? { ...cot, estado: 'Aprobada' } : cot
    ));
  };

  const handleReject = (id) => {
    setCotizaciones(prev => prev.map(cot => 
      cot.id === id ? { ...cot, estado: 'Rechazada' } : cot
    ));
  };

  const filteredCotizaciones = cotizaciones.filter(cot => {
    const matchesSearch = cot.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cot.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cot.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cot.placa.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Si es cliente, solo ver sus propias cotizaciones
    if (permissions?.userRole === 'cliente') {
      return matchesSearch && cot.cliente === 'María López'; // Simular usuario actual
    }
    
    return matchesSearch;
  });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Aprobada': return '#2d5016';
      case 'Pendiente': return '#b7541a';
      case 'Rechazada': return '#991b1b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Aprobada': return <CheckCircle className="w-4 h-4" />;
      case 'Pendiente': return <Clock className="w-4 h-4" />;
      case 'Rechazada': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#e6eef7'}}>
              <Calculator className="w-6 h-6" style={{color: '#1e3a72'}} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cotizaciones Vehiculares</h2>
              <p className="text-gray-600">
                {permissions?.isAdmin ? 'Gestiona todas las cotizaciones de seguros vehiculares' : 'Solicita y revisa tus cotizaciones de seguros para vehículos'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            {permissions?.canRequestCotizaciones && (
              <button 
                onClick={() => setActiveTab('crear')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Solicitar Cotización
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
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Cotizaciones
          </button>
          {permissions?.canRequestCotizaciones && (
            <button
              onClick={() => setActiveTab('crear')}
              className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'crear' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Solicitar Cotización
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
                  placeholder="Buscar por número, cliente, vehículo o placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Lista de cotizaciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cotización
                    </th>
                    {permissions?.isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Seguro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Asegurado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prima
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
                  {filteredCotizaciones.map((cotizacion) => (
                    <tr key={cotizacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{cotizacion.numero}</div>
                          <div className="text-sm text-gray-500">Solicitud: {cotizacion.fechaSolicitud}</div>
                        </div>
                      </td>
                      {permissions?.isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cotizacion.cliente}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cotizacion.tipoSeguro}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${cotizacion.valorAsegurado.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${cotizacion.prima}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{backgroundColor: getStatusColor(cotizacion.estado)}}
                        >
                          {getStatusIcon(cotizacion.estado)}
                          <span className="ml-1">{cotizacion.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {permissions?.isAdmin && cotizacion.estado === 'Pendiente' && (
                            <>
                              <button 
                                onClick={() => handleApprove(cotizacion.id)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(cotizacion.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button className="text-orange-600 hover:text-orange-900 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCotizaciones.length === 0 && (
              <div className="text-center py-12">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cotizaciones</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Intenta con un término de búsqueda diferente' : 
                   permissions?.isAdmin ? 'Las cotizaciones aparecerán aquí cuando los clientes las soliciten' : 
                   'Solicita tu primera cotización'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : permissions?.canRequestCotizaciones ? (
        /* Formulario de solicitud - Solo para clientes */
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Solicitar Cotización de Seguro Vehicular
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cobertura Vehicular
                </label>
                <select
                  name="tipoSeguro"
                  value={formData.tipoSeguro}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todo-riesgo">Todo Riesgo</option>
                  <option value="responsabilidad-civil">Responsabilidad Civil</option>
                  <option value="basico">Seguro Básico</option>
                  <option value="premium">Todo Riesgo Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca del Vehículo
                </label>
                <select
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione marca</option>
                  <option value="toyota">Toyota</option>
                  <option value="honda">Honda</option>
                  <option value="nissan">Nissan</option>
                  <option value="mazda">Mazda</option>
                  <option value="chevrolet">Chevrolet</option>
                  <option value="hyundai">Hyundai</option>
                  <option value="kia">Kia</option>
                  <option value="ford">Ford</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo del Vehículo
                </label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  placeholder="Ej: Corolla, Civic, Sentra"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año del Vehículo
                </label>
                <select
                  name="año"
                  value={formData.año}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione año</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                  <option value="2016">2016</option>
                  <option value="2015">2015</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placa del Vehículo
                </label>
                <input
                  type="text"
                  name="placa"
                  value={formData.placa}
                  onChange={handleInputChange}
                  placeholder="Ej: ABC-123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor del Vehículo
                </label>
                <input
                  type="number"
                  name="valorVehiculo"
                  value={formData.valorVehiculo}
                  onChange={handleInputChange}
                  placeholder="Valor comercial del vehículo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deducible
                </label>
                <select
                  name="deducible"
                  value={formData.deducible}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="30000">₡30,000</option>
                  <option value="50000">₡50,000</option>
                  <option value="75000">₡75,000</option>
                  <option value="100000">₡100,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad del Conductor Principal
                </label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  placeholder="Edad en años"
                  min="18"
                  max="80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Años con Licencia de Conducir
                </label>
                <select
                  name="añosLicencia"
                  value={formData.añosLicencia}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione experiencia</option>
                  <option value="menos-1">Menos de 1 año</option>
                  <option value="1-3">1 a 3 años</option>
                  <option value="4-7">4 a 7 años</option>
                  <option value="8-15">8 a 15 años</option>
                  <option value="mas-15">Más de 15 años</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Historial de Accidentes/Siniestros
              </label>
              <select
                name="historialSiniestros"
                value={formData.historialSiniestros}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sin-siniestros">Sin accidentes/siniestros</option>
                <option value="1-siniestro">1 accidente en los últimos 5 años</option>
                <option value="2-siniestros">2 accidentes en los últimos 5 años</option>
                <option value="mas-siniestros">Más de 2 accidentes</option>
              </select>
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Solicitar Cotización
              </button>
            </div>
          </form>

          {resultadoCotizacion && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Resultado de la Cotización</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-blue-700 font-medium">Prima Mensual:</span>
                  <span className="text-blue-900 ml-2">${resultadoCotizacion.primaMensual}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Prima Anual:</span>
                  <span className="text-blue-900 ml-2">${resultadoCotizacion.primaAnual}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Cotizaciones;