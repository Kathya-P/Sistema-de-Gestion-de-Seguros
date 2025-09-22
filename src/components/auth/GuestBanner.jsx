import React from 'react';
import { Lock, Eye, Shield } from 'lucide-react';

const GuestBanner = ({ onLoginClick }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Navegando como invitado
            </h3>
            <p className="text-xs text-blue-700">
              Puedes ver la información pero necesitas iniciar sesión para realizar acciones
            </p>
          </div>
        </div>
        <button
          onClick={onLoginClick}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Shield className="w-4 h-4" />
          <span>Iniciar Sesión</span>
        </button>
      </div>
    </div>
  );
};

// Componente para botones bloqueados
export const ProtectedButton = ({ children, onClick, className, disabled, requiresAuth = true, permissions, ...props }) => {
  const isDisabled = disabled || (requiresAuth && !permissions?.isLoggedIn);
  
  const handleClick = (e) => {
    if (requiresAuth && !permissions?.isLoggedIn) {
      e.preventDefault();
      alert('Necesitas iniciar sesión para realizar esta acción');
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      {...props}
      className={`${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {requiresAuth && !permissions?.isLoggedIn && (
        <Lock className="w-4 h-4 mr-1" />
      )}
      {children}
    </button>
  );
};

export default GuestBanner;