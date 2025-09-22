import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, FileText } from 'lucide-react';

const Reportes = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#e6eef7'}}>
            <BarChart3 className="w-6 h-6" style={{color: '#1e3a72'}} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h2>
            <p className="text-gray-600">Análisis detallado del rendimiento del negocio</p>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
              <p className="text-2xl font-bold" style={{color: '#2d5016'}}>$124,500</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" style={{color: '#2d5016'}} />
                <span className="text-sm" style={{color: '#2d5016'}}>+12.5%</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8" style={{color: '#2d5016', opacity: 0.3}} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nuevos Clientes</p>
              <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>24</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" style={{color: '#2d5016'}} />
                <span className="text-sm" style={{color: '#2d5016'}}>+8.3%</span>
              </div>
            </div>
            <Users className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.3}} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pólizas Vendidas</p>
              <p className="text-2xl font-bold" style={{color: '#b7541a'}}>18</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="w-4 h-4 mr-1" style={{color: '#991b1b'}} />
                <span className="text-sm" style={{color: '#991b1b'}}>-2.1%</span>
              </div>
            </div>
            <FileText className="w-8 h-8" style={{color: '#b7541a', opacity: 0.3}} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Satisfacción</p>
              <p className="text-2xl font-bold" style={{color: '#2d5016'}}>94%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" style={{color: '#2d5016'}} />
                <span className="text-sm" style={{color: '#2d5016'}}>+3.2%</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8" style={{color: '#2d5016', opacity: 0.3}} />
          </div>
        </div>
      </div>

      {/* Gráfico placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento Mensual</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Gráfico de rendimiento</p>
            <p className="text-sm text-gray-400">Los datos se cargarán aquí</p>
          </div>
        </div>
      </div>

      {/* Reportes adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Productos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Seguro Vehicular</span>
              <span className="font-semibold" style={{color: '#1e3a72'}}>45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Seguro de Hogar</span>
              <span className="font-semibold" style={{color: '#1e3a72'}}>28%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Seguro de Vida</span>
              <span className="font-semibold" style={{color: '#1e3a72'}}>18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Seguro de Salud</span>
              <span className="font-semibold" style={{color: '#1e3a72'}}>9%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Primas Cobradas</span>
              <span className="font-semibold" style={{color: '#2d5016'}}>$89,200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Reclamos Pagados</span>
              <span className="font-semibold" style={{color: '#991b1b'}}>$34,800</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Gastos Operativos</span>
              <span className="font-semibold" style={{color: '#b7541a'}}>$28,500</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-medium">Ganancia Neta</span>
              <span className="font-bold text-lg" style={{color: '#2d5016'}}>$25,900</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;