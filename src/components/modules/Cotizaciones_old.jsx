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
      tipoSeguro: 'Vehicular',
      valorAsegurado: 25000,
      prima: 850,
      estado: 'Pendiente',
      fechaSolicitud: '2024-09-18',
      fechaVencimiento: '2024-10-18'
    },
    {
      id: 2,
      numero: 'COT-002',
      cliente: 'Carlos Rodríguez',
      tipoSeguro: 'Hogar',
      valorAsegurado: 180000,
      prima: 1200,
      estado: 'Aprobada',
      fechaSolicitud: '2024-09-15',
      fechaVencimiento: '2024-10-15'
    },
    {
      id: 3,
      numero: 'COT-003',
      cliente: 'Ana Jiménez',
      tipoSeguro: 'Vida',
      valorAsegurado: 100000,
      prima: 450,
      estado: 'Rechazada',
      fechaSolicitud: '2024-09-10',
      fechaVencimiento: '2024-10-10'
    }
  ]);

  const [formData, setFormData] = useState({
    tipoSeguro: 'vehicular',
    valorAsegurado: '',
    deducible: '1000',
    edad: '',
    historialSiniestros: 'sin-siniestros'
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
                         cot.tipoSeguro.toLowerCase().includes(searchTerm.toLowerCase());
    
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
              <h2 className="text-2xl font-bold text-gray-900">Cotizaciones</h2>
              <p className="text-gray-600">Genera cotizaciones personalizadas para tus clientes</p>
            </div>
          </div>
          {permissions?.canCreate && (
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cotización
            </button>
          )}
          {permissions?.canRequestCotizaciones && !permissions?.canCreate && (
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Solicitar Cotización
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de cotización */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculadora de Prima</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Seguro
              </label>
              <select 
                name="tipoSeguro"
                value={formData.tipoSeguro}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="vehicular">Seguro Vehicular</option>
                <option value="hogar">Seguro de Hogar</option>
                <option value="vida">Seguro de Vida</option>
                <option value="salud">Seguro de Salud</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Asegurado ($)
              </label>
              <input
                type="number"
                name="valorAsegurado"
                value={formData.valorAsegurado}
                onChange={handleInputChange}
                placeholder="Ej: 25000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deducible ($)
              </label>
              <select 
                name="deducible"
                value={formData.deducible}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="2500">$2,500</option>
                <option value="5000">$5,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad del Asegurado
              </label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                placeholder="Ej: 35"
                min="18"
                max="100"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Historial de Siniestros
              </label>
              <select 
                name="historialSiniestros"
                value={formData.historialSiniestros}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sin-siniestros">Sin siniestros</option>
                <option value="1-siniestro">1 siniestro en 5 años</option>
                <option value="2-siniestros">2-3 siniestros en 5 años</option>
                <option value="muchos-siniestros">Más de 3 siniestros</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors duration-200"
              style={{backgroundColor: '#1e3a72'}}
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              Calcular Prima
            </button>
          </form>
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultado de la Cotización</h3>
          
          {resultadoCotizacion ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Prima Anual</p>
                    <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>
                      ${resultadoCotizacion.primaAnual}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Prima Mensual</p>
                    <p className="text-2xl font-bold" style={{color: '#b7541a'}}>
                      ${resultadoCotizacion.primaMensual}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Detalles de Cobertura</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor Asegurado:</span>
                    <span className="font-medium">${resultadoCotizacion.cobertura}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deducible:</span>
                    <span className="font-medium">${resultadoCotizacion.deducible}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <button className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Generar Propuesta
                </button>
                <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Enviar por Email
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-2">Complete el formulario para ver la cotización</p>
              <p className="text-sm text-gray-400">Ingrese todos los datos requeridos y haga clic en "Calcular Prima"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cotizaciones;