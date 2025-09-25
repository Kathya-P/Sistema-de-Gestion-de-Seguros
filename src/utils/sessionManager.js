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
            address: 'San José, Costa Rica',
            role: 'Administrador',
            rol: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            username: 'maria.lopez',
            password: 'cliente123',
            name: 'María López',
            email: 'maria.lopez@securetech.com',
            phone: '2234-1111',
            address: 'Cartago, Costa Rica',
            role: 'Cliente',
            rol: 'cliente',
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
        address: userData.address || '',
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
    // Permisos básicos de CRUD - Admin puede todo, Cliente solo ver
    canCreate: currentUser && (userRole === 'admin'), // Solo admin puede crear
    canEdit: currentUser && (userRole === 'admin'), // Solo admin puede editar
    canDelete: currentUser && (userRole === 'admin'), // Solo admin puede eliminar
    canApprove: currentUser && (userRole === 'admin'), // Solo admin puede aprobar
    
    // Permisos por módulo
    canViewAllPolizas: currentUser && (userRole === 'admin'),
    canViewOwnPolizas: currentUser !== null, // Todos pueden ver sus propias pólizas
    
    canViewAllClientes: currentUser && (userRole === 'admin'),
    canViewClients: currentUser && (userRole === 'admin'), // Solo admin ve módulo clientes
    
    canViewAllReclamos: currentUser && (userRole === 'admin'),
    canViewOwnReclamos: currentUser !== null, // Todos pueden ver sus propios reclamos
    canProcessReclamos: currentUser && (userRole === 'admin'), // Admin puede procesar reclamos
    canAssignInvestigators: currentUser && (userRole === 'admin'), // Admin puede asignar investigadores
    canUploadDocuments: currentUser && (userRole === 'cliente'), // Clientes pueden subir documentos
    
    // Permisos de Fraudes - Solo administradores
    canViewFraudes: currentUser && (userRole === 'admin'), // Solo admin ve fraudes
    canInvestigateFraudes: currentUser && (userRole === 'admin'), // Solo admin investiga fraudes
    canMarkFraudulent: currentUser && (userRole === 'admin'), // Solo admin marca como fraudulento
    canBlockClients: currentUser && (userRole === 'admin'), // Solo admin bloquea clientes
    canViewAllFraudeCases: currentUser && (userRole === 'admin'), // Solo admin ve todos los casos
    canAssignFraudeInvestigators: currentUser && (userRole === 'admin'), // Solo admin asigna investigadores
    
    canProcessCotizaciones: currentUser && (userRole === 'admin'), // Admin puede aprobar/rechazar
    canRequestCotizaciones: currentUser && (userRole === 'cliente'), // Clientes pueden solicitar cotizaciones
    canModifyPrices: currentUser && (userRole === 'admin'), // Admin puede modificar precios
    canViewAllCotizaciones: currentUser && (userRole === 'admin'), // Admin ve todas las cotizaciones
    
    canViewAllAccidentes: currentUser && (userRole === 'admin'),
    canReportAccidentes: currentUser && (userRole === 'cliente'), // Solo clientes pueden reportar accidentes
    canViewOwnAccidentes: currentUser !== null, // Todos pueden ver sus propios accidentes
    canAssignAdjusters: currentUser && (userRole === 'admin'), // Solo admin asigna ajustadores
    canManageAccidentInvestigation: currentUser && (userRole === 'admin'), // Solo admin gestiona investigación
    canViewAllAccidentPhotos: currentUser && (userRole === 'admin'), // Solo admin ve todas las fotos
    canViewAllAccidentDocuments: currentUser && (userRole === 'admin'), // Solo admin ve todos los documentos
    canUploadAccidentPhotos: currentUser && (userRole === 'cliente'), // Solo clientes pueden subir fotos de sus accidentes
    canUploadAccidentDocuments: currentUser && (userRole === 'cliente'), // Solo clientes pueden subir documentos de sus accidentes
    
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