import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle,
  Users,
  Clock,
  Car,
  Check,
  X,
  AlertCircle,
  Trash2,
  PauseCircle,
  RefreshCw,
  Download,
  User,
  Shield,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import jsPDF from 'jspdf';

const Polizas = ({ polizas, setPolizas, permissions, setActiveModule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');
  const [activeTab, setActiveTab] = useState('polizas');
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [polizasReales, setPolizasReales] = useState([]); // Solo pólizas reales del localStorage
  const [polizaSeleccionada, setPolizaSeleccionada] = useState(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  
  // Obtener usuario actual
  const currentUser = permissions?.currentUser || JSON.parse(localStorage.getItem('seguros_session_data') || '{}').user;

  // Cargar solicitudes pendientes y pólizas reales del localStorage
  useEffect(() => {
    // Cargar cotizaciones pendientes de aprobación
    const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    setSolicitudesPendientes(cotizaciones.filter(cot => cot.estado === 'pendiente'));
    
    // Cargar SOLO las pólizas reales del localStorage (creadas desde cotizaciones aprobadas)
    const polizasGuardadas = JSON.parse(localStorage.getItem('polizas') || '[]');
    setPolizasReales(polizasGuardadas);
  }, []);

  // Actualizar pólizas cuando cambie la pestaña activa (para refrescar datos)
  useEffect(() => {
    if (activeTab === 'polizas') {
      const polizasGuardadas = JSON.parse(localStorage.getItem('polizas') || '[]');
      setPolizasReales(polizasGuardadas);
    }
  }, [activeTab]);

  // Filtrar pólizas según permisos del usuario
  const getFilteredPolizas = () => {
    let polizasFiltradas = polizasReales; // Usar pólizas reales en lugar de props
    
    // Si es cliente, solo mostrar sus propias pólizas (TODAS, sin importar el estado)
    if (permissions?.isCliente && currentUser) {
      polizasFiltradas = polizasReales.filter(poliza => 
        poliza.clienteId === currentUser.id || poliza.titular === currentUser.name
      );
    }

    return polizasFiltradas.filter(poliza => {
      const matchesSearch = poliza.titular.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poliza.numeroPoliza.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poliza.vehiculo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           poliza.placa?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'todas' || poliza.estado === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredPolizas = getFilteredPolizas();

  // Aprobar solicitud de cotización y convertir en póliza
  const aprobarSolicitud = (solicitud) => {
    const numeroPoliza = `POL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const nuevaPoliza = {
      numeroPoliza: numeroPoliza,
      titular: solicitud.nombreCompleto,
      clienteId: solicitud.clienteId || solicitud.userId, // Asegurar ID del cliente
      clienteName: solicitud.clienteName || solicitud.nombreCompleto, // Nombre del cliente
      tipoSeguro: solicitud.cobertura,
      vehiculo: `${solicitud.marca} ${solicitud.modelo} ${solicitud.año}`,
      placa: solicitud.placa,
      prima: parseFloat(solicitud.primaMensual.replace(/,/g, '')),
      vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: 'Activa',
      telefono: solicitud.telefono,
      cobertura: solicitud.cobertura,
      deducible: solicitud.deducible || 750,
      fechaCreacion: new Date().toISOString().split('T')[0],
      solicitudId: solicitud.id
    };

    // Guardar póliza en localStorage
    const polizasExistentes = JSON.parse(localStorage.getItem('polizas') || '[]');
    const nuevasPolizas = [...polizasExistentes, nuevaPoliza];
    localStorage.setItem('polizas', JSON.stringify(nuevasPolizas));
    
    // Actualizar estado local y también el estado principal de App.js
    setPolizasReales(nuevasPolizas);
    setPolizas(nuevasPolizas); // Actualizar también el estado principal

    // Actualizar estado de la cotización en localStorage
    const todasCotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacionesNuevas = todasCotizaciones.map(cot => 
      cot.id === solicitud.id ? {...cot, estado: 'aprobada', numeroPoliza: numeroPoliza} : cot
    );
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesNuevas));
    
    // Actualizar estado local
    setSolicitudesPendientes(prev => prev.filter(s => s.id !== solicitud.id));
    
    alert(`✅ Póliza ${numeroPoliza} creada exitosamente`);
  };

  // Rechazar solicitud
  const rechazarSolicitud = (solicitudId, motivo = '') => {
    // Actualizar localStorage
    const todasCotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacionesNuevas = todasCotizaciones.map(cot => 
      cot.id === solicitudId ? {...cot, estado: 'rechazada', motivoRechazo: motivo} : cot
    );
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesNuevas));
    
    // Actualizar estado local
    setSolicitudesPendientes(prev => prev.filter(s => s.id !== solicitudId));
    alert('❌ Solicitud rechazada');
  };

  // Funciones de acción para administradores
  const verDetallePoliza = (poliza) => {
    // Buscar la cotización original para obtener datos adicionales
    const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacionOriginal = cotizaciones.find(cot => cot.id === poliza.solicitudId);
    
    console.log('Póliza original:', poliza);
    console.log('Cotización encontrada:', cotizacionOriginal);
    console.log('Todas las cotizaciones:', cotizaciones);
    console.log('Buscando solicitudId:', poliza.solicitudId);
    
    if (cotizacionOriginal) {
      console.log('Datos específicos de la cotización:');
      console.log('- edadConductor:', cotizacionOriginal.edadConductor);
      console.log('- edad:', cotizacionOriginal.edad);
      console.log('- valorVehiculo:', cotizacionOriginal.valorVehiculo);
      console.log('- añosLicencia:', cotizacionOriginal.añosLicencia);
      console.log('- email:', cotizacionOriginal.email);
      console.log('- historialSiniestros:', cotizacionOriginal.historialSiniestros);
    } else {
      console.log('❌ No se encontró cotización para solicitudId:', poliza.solicitudId);
    }
    
    // Crear mapeo de texto para años de licencia
    const añosLicenciaTexto = {
      'menos-1': 'Menos de 1 año',
      '1-3': '1-3 años',
      '4-7': '4-7 años', 
      '8-15': '8-15 años',
      'mas-15': 'Más de 15 años'
    };
    
    // Crear objeto con todos los datos disponibles
    const polizaCompleta = {
      ...poliza,
      valorVehiculo: cotizacionOriginal?.valorVehiculo || 'No especificado',
      valorVehiculoNumerico: cotizacionOriginal?.valorVehiculo ? 
        parseInt(cotizacionOriginal.valorVehiculo.toString().replace(/,/g, '')) : 0, // Remover comas si existen
      email: cotizacionOriginal?.email || 'No especificado',
      edad: cotizacionOriginal?.edadConductor || cotizacionOriginal?.edad || 'No especificado', // Buscar tanto edadConductor como edad
      añosLicencia: cotizacionOriginal?.añosLicencia || 'No especificado',
      añosLicenciaTexto: añosLicenciaTexto[cotizacionOriginal?.añosLicencia] || cotizacionOriginal?.añosLicencia || 'No especificado',
      historialSiniestros: cotizacionOriginal?.historialSiniestros || 'No especificado'
    };
    
    console.log('Póliza completa con datos:', polizaCompleta);
    
    setPolizaSeleccionada(polizaCompleta);
    setMostrarModalDetalle(true);
  };

  const editarPoliza = (poliza) => {
    const nuevaPrima = window.prompt(`Editar prima mensual para ${poliza.numeroPoliza}:`, poliza.prima);
    if (nuevaPrima && !isNaN(nuevaPrima)) {
      const polizasActualizadas = polizasReales.map(p => 
        p.numeroPoliza === poliza.numeroPoliza ? {...p, prima: parseFloat(nuevaPrima)} : p
      );
      localStorage.setItem('polizas', JSON.stringify(polizasActualizadas));
      setPolizasReales(polizasActualizadas);
      alert(`✅ Prima actualizada para póliza ${poliza.numeroPoliza}`);
    }
  };

  const suspenderPoliza = (poliza) => {
    if (window.confirm(`¿Suspender la póliza ${poliza.numeroPoliza}?`)) {
      const polizasActualizadas = polizasReales.map(p => 
        p.numeroPoliza === poliza.numeroPoliza ? {...p, estado: 'Suspendida'} : p
      );
      localStorage.setItem('polizas', JSON.stringify(polizasActualizadas));
      setPolizasReales(polizasActualizadas);
      alert(`⏸️ Póliza ${poliza.numeroPoliza} suspendida`);
    }
  };

  const reactivarPoliza = (poliza) => {
    if (window.confirm(`¿Reactivar la póliza ${poliza.numeroPoliza}?`)) {
      const polizasActualizadas = polizasReales.map(p => 
        p.numeroPoliza === poliza.numeroPoliza ? {...p, estado: 'Activa'} : p
      );
      localStorage.setItem('polizas', JSON.stringify(polizasActualizadas));
      setPolizasReales(polizasActualizadas);
      alert(`🔄 Póliza ${poliza.numeroPoliza} reactivada`);
    }
  };

  const eliminarPoliza = (poliza) => {
    if (window.confirm(`⚠️ ¿Está seguro de eliminar la póliza ${poliza.numeroPoliza}?\n\nEsta acción no se puede deshacer.`)) {
      const polizasActualizadas = polizasReales.filter(p => p.numeroPoliza !== poliza.numeroPoliza);
      localStorage.setItem('polizas', JSON.stringify(polizasActualizadas));
      setPolizasReales(polizasActualizadas);
      alert(`🗑️ Póliza ${poliza.numeroPoliza} eliminada`);
    }
  };

  const descargarPoliza = (poliza) => {
    // Buscar datos adicionales de la cotización original
    const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacionOriginal = cotizaciones.find(cot => cot.id === poliza.solicitudId);
    
    const doc = new jsPDF();
    
    // Configuración de colores y fuentes
    const primaryColor = [30, 58, 114]; // #1e3a72
    const accentColor = [230, 238, 247]; // #e6eef7
    const textColor = [51, 51, 51]; // #333333
    
    // Encabezado con fondo azul
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Logo/Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SEGUROS VEHICULARES', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('CERTIFICADO DE PÓLIZA COMPLETO', 105, 30, { align: 'center' });
    
    // Información de la póliza
    doc.setTextColor(...textColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`PÓLIZA N° ${poliza.numeroPoliza}`, 20, 60);
    
    // Fecha de emisión
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, 150, 60);
    
    // Línea separadora
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 70, 190, 70);
    
    // Información del asegurado
    let yPos = 85;
    doc.setFillColor(...accentColor);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL ASEGURADO', 25, yPos);
    
    yPos += 15;
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.setFont('helvetica', 'bold');
    doc.text('Titular:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(poliza.titular, 55, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Teléfono:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(poliza.telefono || cotizacionOriginal?.telefono || 'No especificado', 55, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(cotizacionOriginal?.email || 'No especificado', 55, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Edad:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(cotizacionOriginal?.edadConductor ? `${cotizacionOriginal.edadConductor} años` : 'No especificado', 55, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Años de licencia:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    const añosLicenciaTexto = {
      'menos-1': 'Menos de 1 año',
      '1-3': '1-3 años',
      '4-7': '4-7 años', 
      '8-15': '8-15 años',
      'mas-15': 'Más de 15 años'
    };
    doc.text(añosLicenciaTexto[cotizacionOriginal?.añosLicencia] || cotizacionOriginal?.añosLicencia || 'No especificado', 75, yPos);
    
    // Información del vehículo
    yPos += 20;
    doc.setFillColor(...accentColor);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL VEHÍCULO', 25, yPos);
    
    yPos += 15;
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.setFont('helvetica', 'bold');
    doc.text('Vehículo:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(poliza.vehiculo, 55, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Placa:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(poliza.placa, 55, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Valor asegurado:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    const valorVehiculo = cotizacionOriginal?.valorVehiculo || 'No especificado';
    if (valorVehiculo !== 'No especificado') {
      // Remover comas si existen y formatear
      const valorNumerico = parseInt(valorVehiculo.toString().replace(/,/g, ''));
      doc.text(`$${valorNumerico.toLocaleString('es-ES')}`, 75, yPos);
    } else {
      doc.text(valorVehiculo, 75, yPos);
    }
    
    // Información de la cobertura
    yPos += 20;
    doc.setFillColor(...accentColor);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLES DE LA COBERTURA', 25, yPos);
    
    yPos += 15;
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.setFont('helvetica', 'bold');
    doc.text('Tipo de Cobertura:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    const tipoSeguroTexto = {
      'todo-riesgo': 'Todo Riesgo',
      'premium': 'Premium',
      'responsabilidad-civil': 'Responsabilidad Civil',
      'basico': 'Básico'
    };
    doc.text(tipoSeguroTexto[poliza.cobertura] || poliza.cobertura || poliza.tipoSeguro, 75, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Prima Mensual:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${typeof poliza.prima === 'number' ? poliza.prima.toLocaleString('es-ES') : poliza.prima}`, 75, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Prima Anual:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    const primaAnual = (typeof poliza.prima === 'number' ? poliza.prima * 12 : parseFloat(poliza.prima) * 12) || 0;
    doc.text(`$${primaAnual.toLocaleString('es-ES')}`, 75, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Deducible:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${(poliza.deducible || cotizacionOriginal?.deducible || '750').toLocaleString('es-ES')}`, 75, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Estado:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(poliza.estado, 75, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha de inicio:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(poliza.fechaCreacion, 75, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha de vencimiento:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(poliza.vencimiento, 75, yPos);
    
    // Historial de siniestros (si está disponible)
    if (cotizacionOriginal?.historialSiniestros) {
      yPos += 20;
      doc.setFillColor(...accentColor);
      doc.rect(20, yPos - 5, 170, 8, 'F');
      doc.setTextColor(...primaryColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN ADICIONAL', 25, yPos);
      
      yPos += 15;
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      doc.setFont('helvetica', 'bold');
      doc.text('Historial de siniestros:', 25, yPos);
      doc.setFont('helvetica', 'normal');
      const historialTexto = {
        'sin-siniestros': 'Sin siniestros',
        '1-siniestro': '1 siniestro',
        '2-siniestros': '2 siniestros', 
        'muchos-siniestros': 'Múltiples siniestros'
      };
      doc.text(historialTexto[cotizacionOriginal.historialSiniestros] || cotizacionOriginal.historialSiniestros, 95, yPos);
    }
    
    // Nota al pie
    yPos += 30;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, yPos - 5, 170, 25, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Este documento certifica la cobertura de seguro vehicular según los términos', 25, yPos);
    doc.text('y condiciones establecidos en la póliza. Válido únicamente con firma digital.', 25, yPos + 5);
    doc.text(`Documento generado automáticamente el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, 25, yPos + 10);
    doc.text(`ID de solicitud: ${poliza.solicitudId || 'N/A'} | Cliente ID: ${poliza.clienteId || 'N/A'}`, 25, yPos + 15);
    
    // Pie de página
    doc.setFillColor(...primaryColor);
    doc.rect(0, 270, 210, 27, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SEGUROS VEHICULARES - Sistema de Gestión', 105, 285, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Tel: (503) 2245-7890 | Email: info@segurosvehiculares.com', 105, 292, { align: 'center' });
    
    // Descargar el PDF
    doc.save(`Poliza_${poliza.numeroPoliza}_Completa.pdf`);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Activa': return '#2d5016';
      case 'Pendiente': return '#b7541a';
      case 'Vencida': return '#991b1b';
      case 'Suspendida': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'Activa': return <CheckCircle className="w-4 h-4" />;
      case 'Pendiente': return <Clock className="w-4 h-4" />;
      case 'Vencida': return <XCircle className="w-4 h-4" />;
      case 'Suspendida': return <PauseCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderSolicitudesPendientes = () => (
    <div className="space-y-4">
      {solicitudesPendientes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 mb-2">No hay solicitudes pendientes</p>
          <p className="text-sm text-gray-400">Las nuevas solicitudes de cotización aparecerán aquí</p>
        </div>
      ) : (
        solicitudesPendientes.map((solicitud) => (
          <div key={solicitud.id} className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg mr-3" style={{backgroundColor: '#fef3e8'}}>
                    <Car className="w-5 h-5" style={{color: '#b7541a'}} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{solicitud.nombreCompleto}</h3>
                    <p className="text-sm text-gray-500">{solicitud.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Vehículo</p>
                    <p className="font-medium">{solicitud.marca} {solicitud.modelo} {solicitud.año}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Placa</p>
                    <p className="font-medium">{solicitud.placa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cobertura</p>
                    <p className="font-medium">{solicitud.cobertura}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prima Mensual</p>
                    <p className="font-medium text-green-600">${solicitud.primaMensual}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Valor del vehículo:</span>
                    <span className="ml-2 font-medium">₡{solicitud.valorVehiculo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Edad conductor:</span>
                    <span className="ml-2 font-medium">{solicitud.edadConductor} años</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Años con licencia:</span>
                    <span className="ml-2 font-medium">{solicitud.añosLicencia} años</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => aprobarSolicitud(solicitud)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Aprobar
                </button>
                <button
                  onClick={() => rechazarSolicitud(solicitud.id)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#e6eef7'}}>
              <FileText className="w-6 h-6" style={{color: '#1e3a72'}} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {permissions?.isAdmin ? 'Gestión de Pólizas Vehiculares' : 'Mis Pólizas Vehiculares'}
              </h2>
              <p className="text-gray-600">
                {permissions?.isAdmin 
                  ? 'Administra pólizas y solicitudes de cotización' 
                  : 'Consulta tus pólizas activas'}
              </p>
            </div>
          </div>
        </div>

        {/* Pestañas para Admin */}
        {permissions?.isAdmin && (
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('polizas')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'polizas'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Pólizas Activas ({filteredPolizas.length})
            </button>
            <button
              onClick={() => setActiveTab('solicitudes')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'solicitudes'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Solicitudes Pendientes ({solicitudesPendientes.length})
            </button>
          </div>
        )}

        {/* Filtros solo para la pestaña de pólizas */}
        {activeTab === 'polizas' && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por titular, número de póliza, vehículo o placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* Filtro por estado solo para administradores */}
            {permissions?.isAdmin && (
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                >
                  <option value="todas">Todas las pólizas</option>
                  <option value="Activa">Activas</option>
                  <option value="Pendiente">Pendientes</option>
                  <option value="Suspendida">Suspendidas</option>
                  <option value="Vencida">Vencidas</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'solicitudes' && permissions?.isAdmin ? (
        renderSolicitudesPendientes()
      ) : (
        <>
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {permissions?.isAdmin ? 'Total Pólizas' : 'Mis Pólizas'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{filteredPolizas.length}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activas</p>
                  <p className="text-2xl font-bold" style={{color: '#2d5016'}}>
                    {filteredPolizas.filter(p => p.estado === 'Activa').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8" style={{color: '#2d5016'}} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold" style={{color: '#b7541a'}}>
                    {filteredPolizas.filter(p => p.estado === 'Pendiente').length}
                  </p>
                </div>
                <Clock className="w-8 h-8" style={{color: '#b7541a'}} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vencidas</p>
                  <p className="text-2xl font-bold" style={{color: '#991b1b'}}>
                    {filteredPolizas.filter(p => p.estado === 'Vencida').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8" style={{color: '#991b1b'}} />
              </div>
            </div>
          </div>

          {/* Lista de pólizas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {permissions?.isAdmin ? `Pólizas (${filteredPolizas.length})` : `Mis Pólizas (${filteredPolizas.length})`}
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Póliza
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titular
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobertura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prima
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPolizas.map((poliza, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {poliza.numeroPoliza}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {poliza.titular}
                            </div>
                            <div className="text-sm text-gray-500">
                              {poliza.telefono}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {poliza.vehiculo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {poliza.placa}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{poliza.cobertura || poliza.tipoSeguro}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${poliza.prima}</div>
                        <div className="text-sm text-gray-500">mensual</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {poliza.vencimiento}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{backgroundColor: getStatusColor(poliza.estado)}}
                        >
                          {getStatusIcon(poliza.estado)}
                          <span className="ml-1">{poliza.estado}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => verDetallePoliza(poliza)}
                            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {permissions?.isAdmin && (
                            <>
                              <button 
                                onClick={() => editarPoliza(poliza)}
                                className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                                title="Editar póliza"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              <button 
                                onClick={() => descargarPoliza(poliza)}
                                className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
                                title="Descargar póliza"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              
                              {poliza.estado === 'Activa' ? (
                                <button 
                                  onClick={() => suspenderPoliza(poliza)}
                                  className="p-1 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded transition-colors"
                                  title="Suspender póliza"
                                >
                                  <PauseCircle className="w-4 h-4" />
                                </button>
                              ) : poliza.estado === 'Suspendida' ? (
                                <button 
                                  onClick={() => reactivarPoliza(poliza)}
                                  className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                                  title="Reactivar póliza"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              ) : null}
                              
                              <button 
                                onClick={() => eliminarPoliza(poliza)}
                                className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar póliza"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPolizas.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">
                  {permissions?.isCliente ? 'No tienes pólizas activas' : 'No se encontraron pólizas'}
                </p>
                <p className="text-sm text-gray-400">
                  {permissions?.isCliente 
                    ? 'Solicita una cotización para obtener tu primera póliza vehicular'
                    : searchTerm 
                      ? 'Intenta con un término de búsqueda diferente' 
                      : 'Las nuevas pólizas aparecerán aquí'
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Información adicional para clientes */}
      {permissions?.isCliente && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">¿Necesitas un nuevo seguro vehicular?</h4>
              <p className="text-blue-800 mb-4">
                Solicita una cotización personalizada y nuestros expertos te contactarán para crear tu póliza.
              </p>
              <button 
                onClick={() => setActiveModule('cotizaciones')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle de póliza */}
      {mostrarModalDetalle && polizaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalle Completo de Póliza
                  </h2>
                  <p className="text-gray-600 mt-1">N° {polizaSeleccionada.numeroPoliza}</p>
                </div>
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    setPolizaSeleccionada(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Información del asegurado */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información del Asegurado
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Titular:</label>
                      <p className="text-gray-900">{polizaSeleccionada.titular}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Teléfono:</label>
                      <p className="text-gray-900">{polizaSeleccionada.telefono || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email:</label>
                      <p className="text-gray-900">{polizaSeleccionada.email || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Edad:</label>
                      <p className="text-gray-900">{polizaSeleccionada.edad ? `${polizaSeleccionada.edad} años` : 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Años de licencia:</label>
                      <p className="text-gray-900">{polizaSeleccionada.añosLicenciaTexto || (() => {
                        const añosLicenciaTexto = {
                          'menos-1': 'Menos de 1 año',
                          '1-3': '1-3 años',
                          '4-7': '4-7 años', 
                          '8-15': '8-15 años',
                          'mas-15': 'Más de 15 años'
                        };
                        return añosLicenciaTexto[polizaSeleccionada.añosLicencia] || polizaSeleccionada.añosLicencia || 'No especificado';
                      })()}</p>
                    </div>
                  </div>
                </div>

                {/* Información del vehículo */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Información del Vehículo
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Vehículo:</label>
                      <p className="text-gray-900">{polizaSeleccionada.vehiculo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Placa:</label>
                      <p className="text-gray-900">{polizaSeleccionada.placa}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Valor asegurado:</label>
                      <p className="text-gray-900 text-lg font-semibold">
                        {polizaSeleccionada.valorVehiculoNumerico && polizaSeleccionada.valorVehiculoNumerico > 0 ? 
                          `$${polizaSeleccionada.valorVehiculoNumerico.toLocaleString('es-ES')}` : 
                          (polizaSeleccionada.valorVehiculo && polizaSeleccionada.valorVehiculo !== 'No especificado' ? 
                            `$${polizaSeleccionada.valorVehiculo}` : 
                            'No especificado'
                          )
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detalles de la cobertura */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Detalles de la Cobertura
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tipo de cobertura:</label>
                      <p className="text-gray-900">{polizaSeleccionada.cobertura || polizaSeleccionada.tipoSeguro}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Prima mensual:</label>
                      <p className="text-gray-900 text-lg font-semibold">${polizaSeleccionada.prima}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Prima anual:</label>
                      <p className="text-gray-900">${(parseFloat(polizaSeleccionada.prima) * 12).toLocaleString('es-ES')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Deducible:</label>
                      <p className="text-gray-900">${polizaSeleccionada.deducible || '750'}</p>
                    </div>
                  </div>
                </div>

                {/* Estado y fechas */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Estado y Fechas
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Estado actual:</label>
                      <div className="flex items-center mt-1">
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{backgroundColor: getStatusColor(polizaSeleccionada.estado)}}
                        >
                          {getStatusIcon(polizaSeleccionada.estado)}
                          <span className="ml-1">{polizaSeleccionada.estado}</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha de inicio:</label>
                      <p className="text-gray-900">{polizaSeleccionada.fechaCreacion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha de vencimiento:</label>
                      <p className="text-gray-900">{polizaSeleccionada.vencimiento}</p>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                {polizaSeleccionada.historialSiniestros && polizaSeleccionada.historialSiniestros !== 'No especificado' && (
                  <div className="md:col-span-2 bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Información Adicional
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Historial de siniestros:</label>
                        <p className="text-gray-900">{(() => {
                          const historialTexto = {
                            'sin-siniestros': 'Sin siniestros',
                            '1-siniestro': '1 siniestro',
                            '2-siniestros': '2 siniestros', 
                            'muchos-siniestros': 'Múltiples siniestros'
                          };
                          return historialTexto[polizaSeleccionada.historialSiniestros] || polizaSeleccionada.historialSiniestros;
                        })()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">ID de solicitud:</label>
                        <p className="text-gray-900">{polizaSeleccionada.solicitudId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Cliente ID:</label>
                        <p className="text-gray-900">{polizaSeleccionada.clienteId}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => descargarPoliza(polizaSeleccionada)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF Completo
                </button>
                <button
                  onClick={() => {
                    setMostrarModalDetalle(false);
                    setPolizaSeleccionada(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Polizas;