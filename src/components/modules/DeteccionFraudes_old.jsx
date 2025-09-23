import React from 'react';
import { Shield, AlertTriangle, Eye, Search, Filter } from 'lucide-react';

const DeteccionFraudes = ({ permissions }) => {
  const fraudesDetectados = [
    {
      id: 1,
      tipo: 'Reclamo sospechoso',
      riesgo: 'Alto',
      descripcion: 'Múltiples reclamos en periodo corto',
      fecha: '2024-09-15'
    },
    {
      id: 2,
      tipo: 'Documentación irregular',
      riesgo: 'Medio',
      descripcion: 'Inconsistencias en la documentación',
      fecha: '2024-09-10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#f0f7ff'}}>
            <Shield className="w-6 h-6" style={{color: '#1e3a72'}} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detección de Fraudes</h2>
            <p className="text-gray-600">Sistema inteligente de detección y prevención de fraudes</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Casos Detectados</p>
              <p className="text-2xl font-bold" style={{color: '#991b1b'}}>{fraudesDetectados.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8" style={{color: '#991b1b', opacity: 0.3}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Riesgo Alto</p>
              <p className="text-2xl font-bold" style={{color: '#991b1b'}}>1</p>
            </div>
            <Shield className="w-8 h-8" style={{color: '#991b1b', opacity: 0.3}} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Investigación</p>
              <p className="text-2xl font-bold" style={{color: '#b7541a'}}>2</p>
            </div>
            <Eye className="w-8 h-8" style={{color: '#b7541a', opacity: 0.3}} />
          </div>
        </div>
      </div>

      {/* Lista de casos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Casos Detectados</h3>
        <div className="space-y-4">
          {fraudesDetectados.map((caso) => (
            <div key={caso.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle 
                    className="w-5 h-5 mr-3" 
                    style={{color: caso.riesgo === 'Alto' ? '#991b1b' : '#b7541a'}}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{caso.tipo}</h4>
                    <p className="text-sm text-gray-600">{caso.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{backgroundColor: caso.riesgo === 'Alto' ? '#991b1b' : '#b7541a'}}
                  >
                    {caso.riesgo}
                  </span>
                  <span className="text-sm text-gray-500">{caso.fecha}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeteccionFraudes;