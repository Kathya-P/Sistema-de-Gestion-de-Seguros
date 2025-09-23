// Sistema de gestión de sesiones para desarrollo
// En producción esto se haría con una base de datos real

const SESSION_FILE_KEY = 'seguros_session_data';
const USERS_FILE_KEY = 'seguros_users_data';

export const sessionManager = {
  // Guardar sesión en localStorage (simula archivo txt)
  saveSession: (userData) => {
    try {
      const sessionData = {
        user: userData,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        sessionId: generateSessionId()
      };
      
      localStorage.setItem(SESSION_FILE_KEY, JSON.stringify(sessionData));
      console.log('📝 Sesión guardada:', sessionData);
      return true;
    } catch (error) {
      console.error('Error guardando sesión:', error);
      return false;
    }
  },

  // Recuperar sesión
  getSession: () => {
    try {
      const sessionData = localStorage.getItem(SESSION_FILE_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      
      // Verificar si la sesión ha expirado
      if (new Date() > new Date(session.expiresAt)) {
        sessionManager.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error leyendo sesión:', error);
      return null;
    }
  },

  // Verificar si hay sesión activa
  isSessionActive: () => {
    const session = sessionManager.getSession();
    return session !== null;
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const session = sessionManager.getSession();
    return session ? session.user : null;
  },

  // Limpiar sesión (logout)
  clearSession: () => {
    try {
      localStorage.removeItem(SESSION_FILE_KEY);
      console.log('🗑️ Sesión eliminada');
      return true;
    } catch (error) {
      console.error('Error eliminando sesión:', error);
      return false;
    }
  },

  // Limpiar todos los datos (útil para reset completo)
  clearAllData: () => {
    try {
      localStorage.removeItem(SESSION_FILE_KEY);
      localStorage.removeItem(USERS_FILE_KEY);
      console.log('🔄 Todos los datos eliminados - Sistema reiniciado');
      return true;
    } catch (error) {
      console.error('Error eliminando datos:', error);
      return false;
    }
  },

  // Actualizar tiempo de sesión
  refreshSession: () => {
    const session = sessionManager.getSession();
    if (session) {
      session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(SESSION_FILE_KEY, JSON.stringify(session));
    }
  }
};

// Sistema de gestión de usuarios
export const userManager = {
  // Obtener todos los usuarios registrados
  getAllUsers: () => {
    try {
      const usersData = localStorage.getItem(USERS_FILE_KEY);
      if (!usersData) {
        // Si no hay usuarios, crear los usuarios por defecto
        const defaultUsers = [
          {
            id: 1,
            username: 'admin',
            password: 'admin123',
            name: 'Administrador',
            email: 'admin@securetech.com',
            phone: '2234-0000',
            role: 'Administrador',
            rol: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            username: 'maria.lopez',
            password: 'agente123',
            name: 'María López',
            email: 'maria.lopez@securetech.com',
            phone: '2234-1111',
            role: 'Cliente',
            rol: 'agente',
            createdAt: new Date().toISOString()
          }
        ];
        userManager.saveUsers(defaultUsers);
        return defaultUsers;
      }
      return JSON.parse(usersData);
    } catch (error) {
      console.error('Error leyendo usuarios:', error);
      return [];
    }
  },

  // Guardar usuarios
  saveUsers: (users) => {
    try {
      localStorage.setItem(USERS_FILE_KEY, JSON.stringify(users));
      console.log('👥 Usuarios guardados:', users.length);
      return true;
    } catch (error) {
      console.error('Error guardando usuarios:', error);
      return false;
    }
  },

  // Registrar nuevo usuario
  registerUser: (userData) => {
    try {
      const users = userManager.getAllUsers();
      
      // Verificar si el usuario ya existe
      const existingUser = users.find(u => u.username === userData.username || u.email === userData.email);
      if (existingUser) {
        console.log('❌ Usuario ya existe:', userData.username);
        return false;
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        username: userData.username,
        password: userData.password,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role === 'admin' ? 'Administrador' : 
              userData.role === 'agente' ? 'Cliente' : 'Cliente',
        rol: userData.role,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      userManager.saveUsers(users);
      console.log('✅ Usuario registrado:', newUser);
      return true;
    } catch (error) {
      console.error('Error registrando usuario:', error);
      return false;
    }
  },

  // Autenticar usuario
  authenticateUser: (username, password) => {
    const users = userManager.getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
  }
};

// Generar ID único de sesión
function generateSessionId() {
  return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Hook para verificar permisos
export const usePermissions = () => {
  const currentUser = sessionManager.getCurrentUser();
  const userRole = currentUser ? currentUser.rol : 'guest';
  
  return {
    // Permisos básicos de CRUD
    canCreate: currentUser && (userRole === 'admin' || userRole === 'agente'),
    canEdit: currentUser && (userRole === 'admin' || userRole === 'agente'),
    canDelete: currentUser && (userRole === 'admin'),
    canApprove: currentUser && (userRole === 'admin' || userRole === 'agente'),
    
    // Permisos por módulo
    canViewAllPolizas: currentUser && (userRole === 'admin' || userRole === 'agente'),
    canViewOwnPolizas: currentUser !== null, // Todos pueden ver sus propias pólizas
    
    canViewAllClientes: currentUser && (userRole === 'admin' || userRole === 'agente'),
    canViewClients: currentUser && (userRole === 'admin' || userRole === 'agente'), // Solo admin y agente ven módulo clientes
    
    canViewAllReclamos: currentUser && (userRole === 'admin' || userRole === 'agente'),
    canViewOwnReclamos: currentUser !== null, // Todos pueden ver sus propios reclamos
    
    canViewFraudes: currentUser && (userRole === 'admin' || userRole === 'agente'), // Solo admin y agente
    canViewReports: currentUser && (userRole === 'admin' || userRole === 'agente'), // Solo admin y agente
    
    canProcessCotizaciones: currentUser && (userRole === 'admin' || userRole === 'agente'),
    canRequestCotizaciones: currentUser !== null, // Todos pueden solicitar cotizaciones
    
    canViewAllAccidentes: currentUser && (userRole === 'admin' || userRole === 'agente'),
    canReportAccidentes: currentUser !== null, // Todos pueden reportar accidentes
    
    canManageUsers: currentUser && (userRole === 'admin'), // Solo admin
    canViewOwnData: currentUser !== null, // Todos los usuarios logueados pueden ver sus propios datos
    
    // Estado general
    isLoggedIn: currentUser !== null,
    userRole: userRole,
    isAdmin: userRole === 'admin',
    isAgente: userRole === 'agente', 
    isCliente: userRole === 'cliente'
  };
};