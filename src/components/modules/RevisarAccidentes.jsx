import React from 'react';
import { Car, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';

const RevisarAccidentes = () => {
  const accidentes = [
    {
      id: 1,
      numeroReporte: 'ACC-001',
      vehiculo: 'Toyota Corolla 2020',
      ubicacion: 'Av. Principal con Calle 5',
      fecha: '2024-09-18',
      estado: 'En revisión',
      gravedad: 'Leve'
    },
    {
      id: 2,
      numeroReporte: 'ACC-002',
      vehiculo: 'Honda Civic 2019',
      ubicacion: 'Autopista Norte Km 15',
      fecha: '2024-09-16',
      estado: 'Completado',
      gravedad: 'Moderado'
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado': return '#2d5016';
      case 'En revisión': return '#b7541a';
      default: return '#6b7280';
    }
  };

  const getGravedadColor = (gravedad) => {
    switch (gravedad) {
      case 'Leve': return '#2d5016';
      case 'Moderado': return '#b7541a';
      case 'Grave': return '#991b1b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#fef3e8'}}>
            <Car className="w-6 h-6" style={{color: '#b7541a'}} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Revisión de Accidentes</h2>
            <p className="text-gray-600">Gestión y seguimiento de reportes de accidentes</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Accidentes</p>
              <p className="text-2xl font-bold text-gray-900">{accidentes.length}</p>
            </div>
            <Car className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Revisión</p>
              <p className="text-2xl font-bold" style={{color: '#b7541a'}}>
                {accidentes.filter(a => a.estado === 'En revisión').length}
              </p>
            </div>
            <Clock className="w-8 h-8" style={{color: '#b7541a'}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold" style={{color: '#2d5016'}}>
                {accidentes.filter(a => a.estado === 'Completado').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8" style={{color: '#2d5016'}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Lista de accidentes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Reportes de Accidentes</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {accidentes.map((accidente) => (
            <div key={accidente.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg" style={{backgroundColor: '#fef3e8'}}>
                    <Car className="w-5 h-5" style={{color: '#b7541a'}} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{accidente.numeroReporte}</h4>
                    <p className="text-sm text-gray-600">{accidente.vehiculo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {accidente.ubicacion}
                    </div>
                    <p className="text-sm text-gray-500">{accidente.fecha}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{backgroundColor: getEstadoColor(accidente.estado)}}
                    >
                      {accidente.estado}
                    </span>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{backgroundColor: getGravedadColor(accidente.gravedad)}}
                    >
                      {accidente.gravedad}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevisarAccidentes;