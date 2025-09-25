import React from 'react';
import { 
  Shield, 
  CheckCircle, 
  Users, 
  FileText, 
  TrendingUp, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Car,
  Clock,
  DollarSign,
  AlertTriangle,
  Zap,
  Award
} from 'lucide-react';

const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <img 
                  src="/images/logo.png" 
                  alt="SecureTech Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#03045e' }}>SecureTech</h1>
                <p className="text-sm text-gray-600">Seguros vehiculares inteligentes</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onShowLogin}
                className="px-4 py-2 font-medium transition-colors hover:opacity-80"
                style={{ color: '#0077b6' }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onShowRegister}
                className="px-6 py-3 text-white rounded-lg transition-colors font-medium shadow-md hover:opacity-90"
                style={{ backgroundColor: '#03045e' }}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto principal */}
            <div>
              <h1 className="text-5xl font-bold mb-6" style={{ color: '#03045e' }}>
                Protege tu <span style={{ color: '#0077b6' }}>Vehículo</span> con la mejor cobertura
              </h1>
              <p className="text-xl mb-8" style={{ color: '#5a5a5a' }}>
                Sistema integral de gestión de seguros vehiculares. Cotiza, gestiona pólizas, 
                reporta accidentes y obtén asistencia 24/7 desde una plataforma moderna y confiable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={onShowRegister}
                  className="px-8 py-4 text-white rounded-lg transition-colors font-semibold text-lg shadow-lg flex items-center justify-center hover:opacity-90"
                  style={{ backgroundColor: '#03045e' }}
                >
                  <Car className="w-5 h-5 mr-2" />
                  Cotizar Ahora
                </button>
                <button
                  onClick={onShowLogin}
                  className="px-8 py-4 border-2 rounded-lg transition-colors font-semibold text-lg hover:bg-gray-50"
                  style={{ 
                    borderColor: '#0077b6',
                    color: '#0077b6'
                  }}
                >
                  Acceder al Portal
                </button>
              </div>

              {/* Características rápidas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" style={{ color: '#0077b6' }} />
                  <span style={{ color: '#03045e' }}>Cotización instantánea</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" style={{ color: '#03045e' }} />
                  <span style={{ color: '#03045e' }}>Atención 24/7</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" style={{ color: '#0077b6' }} />
                  <span style={{ color: '#03045e' }}>Cobertura total</span>
                </div>
              </div>
            </div>

            {/* Imagen relacionada con carros */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1883&q=80" 
                  alt="Automóviles modernos en concesionario"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/30 to-transparent"></div>
              </div>
              
              {/* Elementos flotantes con colores de la paleta */}
              <div className="absolute -top-4 -right-4 rounded-full p-3 shadow-lg" style={{ backgroundColor: '#03045e' }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-full p-3 shadow-lg" style={{ backgroundColor: '#0077b6' }}>
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              
              {/* Badge de confianza con paleta de colores */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md border" style={{ borderColor: '#0077b6' }}>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold" style={{ color: '#03045e' }}>Servicio Confiable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 text-center">
            <div>
              <div className="text-3xl font-bold" style={{ color: '#03045e' }}>+5,000</div>
              <div style={{ color: '#5a5a5a' }}>Vehículos Asegurados</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#03045e' }}>98%</div>
              <div style={{ color: '#5a5a5a' }}>Satisfacción del Cliente</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#03045e' }}>24h</div>
              <div style={{ color: '#5a5a5a' }}>Respuesta Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#03045e' }}>15 años</div>
              <div style={{ color: '#5a5a5a' }}>De Experiencia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir SecureTech?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La solución más completa para proteger tu vehículo con tecnología avanzada y servicio personalizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f0f8ff' }}>
                <Zap className="w-8 h-8" style={{ color: '#0077b6' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cotización Instantánea</h3>
              <p className="text-gray-600">
                Obtén tu cotización personalizada en segundos con nuestro sistema inteligente
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f0f8ff' }}>
                <Clock className="w-8 h-8" style={{ color: '#03045e' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Atención 24/7</h3>
              <p className="text-gray-600">
                Asistencia inmediata en caso de accidentes, grúas y emergencias las 24 horas
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f0f8ff' }}>
                <Shield className="w-8 h-8" style={{ color: '#0077b6' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cobertura Completa</h3>
              <p className="text-gray-600">
                Protección total: daños propios, terceros, robo, fenómenos naturales y más
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f0f8ff' }}>
                <FileText className="w-8 h-8" style={{ color: '#03045e' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reporte de Accidentes</h3>
              <p className="text-gray-600">
                Sistema digital para reportar siniestros con validación automática y seguimiento
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f0f8ff' }}>
                <Users className="w-8 h-8" style={{ color: '#0077b6' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión Digital</h3>
              <p className="text-gray-600">
                Administra todas tus pólizas, pagos y reclamos desde una plataforma unificada
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#f0f8ff' }}>
                <Award className="w-8 h-8" style={{ color: '#03045e' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Precios Competitivos</h3>
              <p className="text-gray-600">
                Las mejores tarifas del mercado con planes flexibles adaptados a tu presupuesto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <img 
                    src="/images/logo.png" 
                    alt="SecureTech Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SecureTech</h3>
                  <p className="text-gray-400">Seguros vehiculares inteligentes</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Especializados en seguros vehiculares con tecnología avanzada. 
                Protegemos tu vehículo y tu tranquilidad con la mejor cobertura del mercado.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">+503 2234-5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">info@securetech.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">San Salvador, El Salvador</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <div className="space-y-2">
                <button 
                  onClick={onShowLogin}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={onShowRegister}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Cotizar Seguro
                </button>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Asistencia Vial
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Términos y Condiciones
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 SecureTech. Todos los derechos reservados. Seguros vehiculares con tecnología avanzada.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;