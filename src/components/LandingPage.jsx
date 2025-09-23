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
  MapPin
} from 'lucide-react';

const LandingPage = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SecureTech</h1>
                <p className="text-sm text-gray-600">Tu seguridad es nuestra prioridad</p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onShowLogin}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onShowRegister}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
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
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Protege lo que más <span className="text-blue-600">Importa</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema integral de gestión de seguros que te brinda tranquilidad y seguridad. 
              Gestiona tus pólizas, reclamos y cotizaciones desde una plataforma moderna y confiable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onShowRegister}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg flex items-center"
              >
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={onShowLogin}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
              >
                Acceder al Portal
              </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">+10,000</div>
                <div className="text-gray-600">Clientes Satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-gray-600">Tiempo de Actividad</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-600">Soporte Disponible</div>
              </div>
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
              Ofrecemos la mejor experiencia en gestión de seguros con tecnología de vanguardia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguridad Garantizada</h3>
              <p className="text-gray-600">
                Tus datos están protegidos con los más altos estándares de seguridad y encriptación
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proceso Simplificado</h3>
              <p className="text-gray-600">
                Gestiona pólizas, reclamos y cotizaciones de manera fácil e intuitiva
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Atención Personalizada</h3>
              <p className="text-gray-600">
                Equipo de expertos disponible para ayudarte en cada paso del proceso
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentación Digital</h3>
              <p className="text-gray-600">
                Accede a todas tus pólizas y documentos desde cualquier lugar
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reportes Avanzados</h3>
              <p className="text-gray-600">
                Analítica detallada para tomar mejores decisiones sobre tus seguros
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calidad Premium</h3>
              <p className="text-gray-600">
                Servicio de primera clase respaldado por años de experiencia
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
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SecureTech</h3>
                  <p className="text-gray-400">Tu seguridad es nuestra prioridad</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Líderes en tecnología de seguros, brindando soluciones innovadoras 
                y confiables para proteger lo que más valoras.
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
                  Registrarse
                </button>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Soporte
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Términos y Condiciones
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 SecureTech. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;