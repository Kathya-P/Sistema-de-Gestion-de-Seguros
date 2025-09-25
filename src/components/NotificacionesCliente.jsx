import React, { useState, useEffect } from 'react';
import { 
  Bell,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';

const NotificacionesCliente = ({ currentUser }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (!currentUser?.name) return;

    const casosFraude = JSON.parse(localStorage.getItem('casosFraude') || '[]');
    
    // Buscar notificaciones para este cliente
    const notificacionesFraude = casosFraude
      .filter(caso => caso.cliente === currentUser.name && caso.comentarioAdmin)
      .map(caso => ({
        id: caso.numeroReclamo,
        tipo: caso.estado === 'Aprobado' ? 'aprobado' : 'rechazado',
        titulo: caso.estado === 'Aprobado' ? 'Reclamo Aprobado ✅' : 'Reclamo Rechazado ❌',
        mensaje: caso.comentarioAdmin,
        fecha: caso.fechaDecision || new Date().toISOString(),
        leida: false
      }))
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Más recientes primero
    
    setNotificaciones(notificacionesFraude);
  }, [currentUser]);

  if (notificaciones.length === 0) {
    return null; // No mostrar nada si no hay notificaciones
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center mb-4">
        <Bell className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900">Notificaciones</h3>
        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {notificaciones.length}
        </span>
      </div>
      
      <div className="space-y-4">
        {notificaciones.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-lg border-l-4 ${
              notif.tipo === 'aprobado' 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`mt-1 ${notif.tipo === 'aprobado' ? 'text-green-600' : 'text-red-600'}`}>
                {notif.tipo === 'aprobado' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{notif.titulo}</h4>
                  <span className="text-sm text-gray-500">
                    Caso: {notif.id}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {notif.mensaje}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(notif.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Información:</strong> Estas notificaciones muestran las decisiones tomadas por nuestros administradores sobre tus reclamos vehiculares.
        </p>
      </div>
    </div>
  );
};

export default NotificacionesCliente;