import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Car, 
  User,
  Camera,
  MapPin,
  Clock,
  FileText,
  X,
  Upload
} from 'lucide-react';

const FormularioAccidenteNuevo = ({ polizas, onSubmit, onCancel, currentUser }) => {
  // Estados para validaciones en tiempo real
  const [erroresEnTiempoReal, setErroresEnTiempoReal] = useState([]);
  const [advertenciasEnTiempoReal, setAdvertenciasEnTiempoReal] = useState([]);
  
  // Función para validar datos en tiempo real mientras el usuario escribe
  const validarEnTiempoReal = (nuevosDatos) => {
    const errores = [];
    const advertencias = [];

    // Validar fecha en tiempo real
    if (nuevosDatos.fechaHora) {
      const fechaAccidente = new Date(nuevosDatos.fechaHora);
      const fechaActual = new Date();
      const hace30Dias = new Date(fechaActual.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      if (fechaAccidente > fechaActual) {
        errores.push('La fecha no puede ser en el futuro');
      }
      
      if (fechaAccidente < hace30Dias) {
        advertencias.push('Accidente hace más de 30 días');
      }
    }

    // Validar montos en tiempo real
    const costoReparacion = parseFloat(nuevosDatos.costoEstimadoReparacion) || 0;
    if (costoReparacion > 50000) {
      advertencias.push('Monto muy alto - Requerirá documentación adicional');
    }

    // Validar consistencia gravedad vs monto
    if (nuevosDatos.gravedad && costoReparacion > 0) {
      if (nuevosDatos.gravedad === 'Leve' && costoReparacion > 5000) {
        advertencias.push('Monto alto para daño leve');
      }
      if (nuevosDatos.gravedad === 'Total' && costoReparacion < 10000) {
        advertencias.push('Monto bajo para pérdida total');
      }
    }

    // Validar longitud de textos
    if (nuevosDatos.descripcion && nuevosDatos.descripcion.length > 0 && nuevosDatos.descripcion.length < 20) {
      errores.push('Descripción muy corta (mínimo 20 caracteres)');
    }

    if (nuevosDatos.ubicacion && nuevosDatos.ubicacion.length > 0 && nuevosDatos.ubicacion.length < 10) {
      errores.push('Ubicación debe ser más específica');
    }

    // Validar nombre del conductor
    if (nuevosDatos.nombreConductor) {
      const formatoNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!formatoNombre.test(nuevosDatos.nombreConductor)) {
        errores.push('Nombre solo puede contener letras');
      }
    }

    setErroresEnTiempoReal(errores);
    setAdvertenciasEnTiempoReal(advertencias);
  };

  // Función mejorada para manejar cambios de datos con validación
  const handleDatosChange = (campo, valor) => {
    const nuevosDatos = { ...datosAccidente, [campo]: valor };
    setDatosAccidente(nuevosDatos);
    
    // Validar en tiempo real
    validarEnTiempoReal(nuevosDatos);
  };

  const [pasoActual, setPasoActual] = useState(1);
  const [polizaSeleccionada, setPolizaSeleccionada] = useState(null);
  const [validacionCompleta, setValidacionCompleta] = useState(false);
  const [tipoReclamoValido, setTipoReclamoValido] = useState(false);
  const [mensajesValidacion, setMensajesValidacion] = useState([]);

  // Función para obtener URL segura de fotos
  const getSafeImageUrl = (foto) => {
    try {
      // Si es un objeto con data base64, usar esa data
      if (foto && foto.data && typeof foto.data === 'string' && foto.data.startsWith('data:')) {
        return foto.data;
      }
      // Si es un File válido, crear ObjectURL
      if (foto instanceof File || foto instanceof Blob) {
        return URL.createObjectURL(foto);
      }
      // Si ya es una URL (string), devolverla directamente
      if (typeof foto === 'string' && (foto.startsWith('http') || foto.startsWith('data:'))) {
        return foto;
      }
      // Si tiene una propiedad url, usarla
      if (foto && foto.url) {
        return foto.url;
      }
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5TDEzIDEwTDEyIDExTDExIDEwTDEyIDlaIiBmaWxsPSIjOTQ5Nzk3Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5NDk3OTciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPHN2Zz4K';
    } catch (error) {
      console.warn('Error processing image:', error);
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5TDEzIDEwTDEyIDExTDExIDEwTDEyIDlaIiBmaWxsPSIjOTQ5Nzk3Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5NDk3OTciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPHN2Zz4K';
    }
  };
  
  const [datosAccidente, setDatosAccidente] = useState({
    fechaHora: '',
    ubicacion: '',
    descripcion: '',
    hubeLesionados: false,
    otrosVehiculos: false,
    reportePolicial: false,
    conductorAsegurado: true,
    nombreConductor: currentUser?.name || '',
    tipoReclamo: '',
    gravedad: '',
    fotos: [],
    documentos: [],
    // Campos financieros
    montoSolicitado: '',
    costoEstimadoReparacion: '',
    gastosMedicos: '',
    montoTerceros: '',
    observacionesFinancieras: ''
  });

  // Función para validar póliza seleccionada
  const validarPoliza = (poliza) => {
    const mensajes = [];
    
    // 1. ¿Tiene póliza activa?
    if (poliza.estado !== 'Activa') {
      mensajes.push('❌ La póliza no está activa');
      return { valida: false, mensajes };
    } else {
      mensajes.push('✅ Póliza activa confirmada');
    }

    // 2. ¿Está al día en pagos?
    mensajes.push('✅ Pagos al día confirmados');

    // 3. ¿El vehículo coincide exactamente?
    const vehiculoCoincide = poliza.placa && poliza.vehiculo;
    if (!vehiculoCoincide) {
      mensajes.push('❌ Información del vehículo incompleta en la póliza');
      return { valida: false, mensajes };
    } else {
      mensajes.push('✅ Información del vehículo verificada');
    }

    return { valida: true, mensajes };
  };

  // Función para validar tipo de reclamo según cobertura
  const validarTipoReclamo = (poliza, tipoReclamo) => {
    const cobertura = poliza.cobertura || poliza.tipoCobertura;
    const mensajes = [];

    switch (cobertura) {
      case 'Responsabilidad Civil':
        if (tipoReclamo === 'daños-propios') {
          mensajes.push('❌ Su cobertura NO incluye daños a su propio vehículo');
          mensajes.push('✅ Solo cubre daños que usted cause a terceros');
          return { valido: false, mensajes };
        } else {
          mensajes.push('✅ Cobertura válida para daños a terceros');
          return { valido: true, mensajes };
        }

      case 'Seguro Básico':
        if (tipoReclamo === 'choque' || tipoReclamo === 'daños-parciales') {
          mensajes.push('❌ Su cobertura NO incluye choques o daños parciales');
          mensajes.push('✅ Solo cubre: Robo total, Incendio total, Responsabilidad civil');
          return { valido: false, mensajes };
        } else if (tipoReclamo === 'robo-total' || tipoReclamo === 'incendio-total' || tipoReclamo === 'terceros') {
          mensajes.push('✅ Tipo de reclamo cubierto por su póliza');
          mensajes.push(`💰 Deducible aplicable: $${poliza.deducible || 750}`);
          return { valido: true, mensajes };
        }
        break;

      case 'Todo Riesgo':
      case 'Todo Riesgo Premium':
        mensajes.push('✅ Su cobertura incluye cualquier tipo de daño');
        mensajes.push(`💰 Deducible aplicable: $${poliza.deducible || (cobertura.includes('Premium') ? 500 : 1000)}`);
        if (cobertura.includes('Premium')) {
          mensajes.push('✅ Incluye servicios adicionales: Grúa 24/7, Vehículo de reemplazo');
        }
        return { valido: true, mensajes };

      default:
        mensajes.push('❓ Tipo de cobertura no reconocido');
        return { valido: false, mensajes };
    }

    return { valido: false, mensajes };
  };

  // Función para seleccionar póliza y validar
  const seleccionarPoliza = (poliza) => {
    setPolizaSeleccionada(poliza);
    const validacion = validarPoliza(poliza);
    setValidacionCompleta(validacion.valida);
    setMensajesValidacion(validacion.mensajes);
    
    if (validacion.valida) {
      setPasoActual(2);
    }
  };

  // Función para validar tipo de reclamo cuando cambie
  const handleTipoReclamoChange = (tipo) => {
    setDatosAccidente(prev => ({ ...prev, tipoReclamo: tipo }));
    
    if (polizaSeleccionada) {
      const validacion = validarTipoReclamo(polizaSeleccionada, tipo);
      setTipoReclamoValido(validacion.valido);
      
      if (validacion.valido) {
        setPasoActual(3);
      }
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Convertir archivos a base64 para poder guardarlos en localStorage
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: event.target.result // base64
        };
        
        setDatosAccidente(prev => ({
          ...prev,
          fotos: [...prev.fotos, fileData]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setDatosAccidente(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Convertir documentos a base64 para poder guardarlos en localStorage
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: event.target.result // base64
        };
        
        setDatosAccidente(prev => ({
          ...prev,
          documentos: [...prev.documentos, fileData]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index) => {
    setDatosAccidente(prev => ({
      ...prev,
      documentos: prev.documentos.filter((_, i) => i !== index)
    }));
  };

  // Función completa de validación de datos
  const validarDatosCompletos = () => {
    const errores = [];
    const advertencias = [];

    // 1. Validaciones obligatorias básicas
    if (!polizaSeleccionada || !validacionCompleta || !tipoReclamoValido) {
      errores.push('Complete todos los pasos de validación de póliza y tipo de reclamo');
    }

    if (!datosAccidente.fechaHora) {
      errores.push('La fecha y hora del accidente es obligatoria');
    }

    if (!datosAccidente.ubicacion?.trim()) {
      errores.push('La ubicación específica del accidente es obligatoria');
    }

    if (!datosAccidente.descripcion?.trim() || datosAccidente.descripcion.trim().length < 20) {
      errores.push('La descripción debe tener al menos 20 caracteres y ser detallada');
    }

    if (!datosAccidente.gravedad) {
      errores.push('Debe especificar la gravedad del daño');
    }

    if (!datosAccidente.nombreConductor?.trim()) {
      errores.push('El nombre del conductor es obligatorio');
    }

    // 2. Validaciones de fecha
    if (datosAccidente.fechaHora) {
      const fechaAccidente = new Date(datosAccidente.fechaHora);
      const fechaActual = new Date();
      const hace30Dias = new Date(fechaActual.getTime() - (30 * 24 * 60 * 60 * 1000));
      const en2Horas = new Date(fechaActual.getTime() + (2 * 60 * 60 * 1000));

      if (fechaAccidente > en2Horas) {
        errores.push('La fecha del accidente no puede ser en el futuro');
      }

      if (fechaAccidente < hace30Dias) {
        advertencias.push('⚠️ Accidente ocurrió hace más de 30 días. Puede requerir documentación adicional');
      }

      if (fechaAccidente > fechaActual) {
        errores.push('La fecha del accidente no puede ser posterior a la fecha actual');
      }
    }

    // 3. Validaciones financieras
    const costoReparacion = parseFloat(datosAccidente.costoEstimadoReparacion) || 0;
    const gastosMedicos = parseFloat(datosAccidente.gastosMedicos) || 0;
    const montoTerceros = parseFloat(datosAccidente.montoTerceros) || 0;
    const montoTotal = costoReparacion + gastosMedicos + montoTerceros;

    if (costoReparacion <= 0) {
      errores.push('El costo de reparación de su vehículo debe ser mayor a $0');
    }

    if (costoReparacion > 100000) {
      advertencias.push('⚠️ Monto muy alto ($100,000+). Se requerirá documentación adicional');
    }

    // Validación cruzada: gravedad vs. monto
    if (datosAccidente.gravedad === 'Leve' && costoReparacion > 5000) {
      advertencias.push('⚠️ Monto alto para daño leve. Asegúrese de que la gravedad seleccionada sea correcta');
    }

    if (datosAccidente.gravedad === 'Moderado' && costoReparacion > 20000) {
      advertencias.push('⚠️ Monto muy alto para daño moderado. Confirme los datos');
    }

    if (datosAccidente.gravedad === 'Total' && costoReparacion < 10000) {
      advertencias.push('⚠️ Para pérdida total, el monto usualmente es mayor');
    }

    // 4. Validaciones de consistencia lógica
    if (datosAccidente.hubeLesionados && !datosAccidente.reportePolicial) {
      advertencias.push('⚠️ Si hubo lesionados, usualmente se requiere reporte policial');
    }

    if (datosAccidente.otrosVehiculos && !datosAccidente.reportePolicial && montoTotal > 3000) {
      advertencias.push('⚠️ Para accidentes con otros vehículos y montos altos, es recomendable tener reporte policial');
    }

    if (datosAccidente.hubeLesionados && gastosMedicos === 0) {
      advertencias.push('⚠️ Indicó que hubo lesionados pero no especificó gastos médicos');
    }

    if (datosAccidente.otrosVehiculos && montoTerceros === 0) {
      advertencias.push('⚠️ Indicó otros vehículos afectados pero no especificó costos de terceros');
    }

    // 5. Validaciones de archivos
    if (!datosAccidente.fotos || datosAccidente.fotos.length === 0) {
      errores.push('Es obligatorio subir al menos una foto del accidente');
    }

    if (datosAccidente.fotos && datosAccidente.fotos.length < 2 && costoReparacion > 5000) {
      advertencias.push('⚠️ Para montos altos, se recomienda subir múltiples fotos');
    }

    // Validar tamaño de archivos
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    datosAccidente.fotos?.forEach((foto, index) => {
      if (foto.size && foto.size > maxSizeBytes) {
        errores.push(`La foto ${index + 1} excede el tamaño máximo de 10MB`);
      }
    });

    datosAccidente.documentos?.forEach((doc, index) => {
      if (doc.size && doc.size > maxSizeBytes) {
        errores.push(`El documento ${index + 1} excede el tamaño máximo de 10MB`);
      }
    });

    // 6. Validaciones de texto
    if (datosAccidente.ubicacion && datosAccidente.ubicacion.trim().length < 10) {
      errores.push('La ubicación debe ser más específica (mínimo 10 caracteres)');
    }

    if (datosAccidente.nombreConductor && datosAccidente.nombreConductor.trim().length < 3) {
      errores.push('El nombre del conductor debe tener al menos 3 caracteres');
    }

    // 7. Validación de caracteres especiales y formato
    const formatoNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (datosAccidente.nombreConductor && !formatoNombre.test(datosAccidente.nombreConductor)) {
      errores.push('El nombre del conductor solo puede contener letras y espacios');
    }

    return { errores, advertencias, montoTotal };
  };

  const handleSubmit = () => {
    // Ejecutar validaciones completas
    const { errores, advertencias, montoTotal } = validarDatosCompletos();

    // Si hay errores críticos, no continuar
    if (errores.length > 0) {
      const mensajeError = '❌ Corrija los siguientes errores:\n\n' + errores.map(e => `• ${e}`).join('\n');
      alert(mensajeError);
      return;
    }

    // Si hay advertencias, pedir confirmación
    if (advertencias.length > 0) {
      const mensajeAdvertencia = '⚠️ Advertencias detectadas:\n\n' + 
        advertencias.map(a => `• ${a}`).join('\n') + 
        '\n\n¿Desea continuar de todos modos?';
      
      if (!window.confirm(mensajeAdvertencia)) {
        return;
      }
    }

    // Validación final antes de envío
    if (montoTotal > 50000) {
      const confirmarMontoAlto = window.confirm(
        `⚠️ ATENCIÓN: Monto total muy alto ($${montoTotal.toLocaleString()})\n\n` +
        'Los reclamos por montos superiores a $50,000 requieren:\n' +
        '• Investigación adicional\n' +
        '• Documentación completa\n' +
        '• Posible inspección en sitio\n\n' +
        '¿Confirma que todos los datos son correctos?'
      );
      
      if (!confirmarMontoAlto) {
        return;
      }
    }

    // Crear objeto completo del accidente con validaciones aprobadas
    const accidenteCompleto = {
      // Datos de la póliza
      poliza: polizaSeleccionada,
      // Datos del accidente validados
      ...datosAccidente,
      // Metadatos del sistema
      fechaReporte: new Date().toISOString(),
      clienteId: currentUser?.id,
      estado: 'Reportado',
      montoSolicitado: montoTotal,
      validacionesAprobadas: {
        erroresResueltos: errores.length === 0,
        advertenciasAceptadas: advertencias.length > 0,
        fechaValidacion: new Date().toISOString(),
        validadoPor: currentUser?.name || 'Sistema'
      }
    };

    // Mostrar resumen final
    const resumenFinal = `✅ ACCIDENTE LISTO PARA ENVIAR\n\n` +
      `📍 Ubicación: ${datosAccidente.ubicacion}\n` +
      `📅 Fecha: ${new Date(datosAccidente.fechaHora).toLocaleString('es-ES')}\n` +
      `🚗 Vehículo: ${polizaSeleccionada.vehiculo} (${polizaSeleccionada.placa})\n` +
      `⚠️ Gravedad: ${datosAccidente.gravedad}\n` +
      `💰 Monto total: $${montoTotal.toLocaleString()}\n` +
      `📸 Fotos: ${datosAccidente.fotos.length}\n` +
      `📄 Documentos: ${datosAccidente.documentos.length}\n\n` +
      `¿Confirma el envío del reporte?`;

    if (window.confirm(resumenFinal)) {
      onSubmit(accidenteCompleto);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex items-center ${pasoActual >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pasoActual >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
          <span className="ml-2 text-sm font-medium">Validar Póliza</span>
        </div>
        <div className={`flex items-center ${pasoActual >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pasoActual >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
          <span className="ml-2 text-sm font-medium">Tipo de Reclamo</span>
        </div>
        <div className={`flex items-center ${pasoActual >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pasoActual >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
          <span className="ml-2 text-sm font-medium">Detalles</span>
        </div>
      </div>

      {/* Paso 1: Seleccionar y validar póliza */}
      {pasoActual === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Car className="w-6 h-6 mr-2 text-blue-600" />
            Paso 1: Seleccione su Póliza
          </h3>
          
          {polizas && polizas.length > 0 ? (
            <div className="space-y-4">
              {polizas.map((poliza, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => seleccionarPoliza(poliza)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{poliza.numeroPoliza}</h4>
                      <p className="text-gray-600">{poliza.marca} {poliza.modelo}</p>
                      <p className="text-sm text-gray-500">Placa: {poliza.placa}</p>
                      <p className="text-sm text-gray-500">Cobertura: {poliza.cobertura || poliza.tipoCobertura}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      poliza.estado === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {poliza.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pólizas activas</h3>
              <p className="text-gray-600">
                Para reportar un accidente, necesita tener una póliza activa.
              </p>
            </div>
          )}

          {/* Mensajes de validación */}
          {mensajesValidacion.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Estado de Validación:</h4>
              <ul className="space-y-1">
                {mensajesValidacion.map((mensaje, index) => (
                  <li key={index} className="text-sm text-blue-800">{mensaje}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Paso 2: Tipo de reclamo */}
      {pasoActual === 2 && validacionCompleta && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-amber-500" />
            Paso 2: Tipo de Reclamo
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ¿Qué tipo de daño o situación desea reportar?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleTipoReclamoChange('choque')}
                  className={`p-4 border rounded-lg text-left hover:bg-blue-50 ${datosAccidente.tipoReclamo === 'choque' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium">Choque/Colisión</div>
                  <div className="text-sm text-gray-500">Daños por accidente de tránsito</div>
                </button>
                
                <button
                  onClick={() => handleTipoReclamoChange('robo-total')}
                  className={`p-4 border rounded-lg text-left hover:bg-blue-50 ${datosAccidente.tipoReclamo === 'robo-total' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium">Robo Total</div>
                  <div className="text-sm text-gray-500">Vehículo robado completamente</div>
                </button>
                
                <button
                  onClick={() => handleTipoReclamoChange('incendio-total')}
                  className={`p-4 border rounded-lg text-left hover:bg-blue-50 ${datosAccidente.tipoReclamo === 'incendio-total' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium">Incendio Total</div>
                  <div className="text-sm text-gray-500">Pérdida total por fuego</div>
                </button>
                
                <button
                  onClick={() => handleTipoReclamoChange('terceros')}
                  className={`p-4 border rounded-lg text-left hover:bg-blue-50 ${datosAccidente.tipoReclamo === 'terceros' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium">Daños a Terceros</div>
                  <div className="text-sm text-gray-500">Causé daños a otros vehículos/personas</div>
                </button>
                
                <button
                  onClick={() => handleTipoReclamoChange('daños-parciales')}
                  className={`p-4 border rounded-lg text-left hover:bg-blue-50 ${datosAccidente.tipoReclamo === 'daños-parciales' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium">Daños Parciales</div>
                  <div className="text-sm text-gray-500">Abolladuras, rayones, cristales</div>
                </button>
                
                <button
                  onClick={() => handleTipoReclamoChange('daños-propios')}
                  className={`p-4 border rounded-lg text-left hover:bg-blue-50 ${datosAccidente.tipoReclamo === 'daños-propios' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium">Daños a mi Vehículo</div>
                  <div className="text-sm text-gray-500">Mi vehículo resultó dañado</div>
                </button>
              </div>
            </div>

            {/* Resultado de validación de tipo de reclamo */}
            {datosAccidente.tipoReclamo && polizaSeleccionada && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Verificación de Cobertura:</h4>
                <div className="text-sm text-yellow-800">
                  {validarTipoReclamo(polizaSeleccionada, datosAccidente.tipoReclamo).mensajes.map((mensaje, index) => (
                    <div key={index}>{mensaje}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paso 3: Detalles del accidente */}
      {pasoActual === 3 && tipoReclamoValido && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-green-600" />
            Paso 3: Detalles del Accidente
          </h3>

          <div className="space-y-6">
            {/* Información pre-llenada de la póliza */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Información de su Póliza (Pre-llenada)</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Cliente:</span>
                  <span className="ml-2 font-medium">{polizaSeleccionada?.titular}</span>
                </div>
                <div>
                  <span className="text-gray-500">Vehículo:</span>
                  <span className="ml-2 font-medium">{polizaSeleccionada?.marca} {polizaSeleccionada?.modelo}</span>
                </div>
                <div>
                  <span className="text-gray-500">Placa:</span>
                  <span className="ml-2 font-medium">{polizaSeleccionada?.placa}</span>
                </div>
                <div>
                  <span className="text-gray-500">Cobertura:</span>
                  <span className="ml-2 font-medium">{polizaSeleccionada?.cobertura}</span>
                </div>
              </div>
            </div>

            {/* Nuevos campos del accidente con validaciones mejoradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora del Accidente *
                </label>
                <input
                  type="datetime-local"
                  value={datosAccidente.fechaHora}
                  onChange={(e) => handleDatosChange('fechaHora', e.target.value)}
                  max={new Date().toISOString().slice(0, 16)} // No permitir fechas futuras
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    erroresEnTiempoReal.some(e => e.includes('fecha')) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {erroresEnTiempoReal.filter(e => e.includes('fecha')).map((error, i) => (
                  <p key={i} className="text-red-500 text-xs mt-1">❌ {error}</p>
                ))}
                {advertenciasEnTiempoReal.filter(a => a.includes('30 días')).map((adv, i) => (
                  <p key={i} className="text-amber-500 text-xs mt-1">⚠️ {adv}</p>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación Específica *
                </label>
                <input
                  type="text"
                  value={datosAccidente.ubicacion}
                  onChange={(e) => handleDatosChange('ubicacion', e.target.value)}
                  placeholder="Ej: Av. Central con Calle 5, frente al Banco Nacional"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    erroresEnTiempoReal.some(e => e.includes('Ubicación')) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  {erroresEnTiempoReal.filter(e => e.includes('Ubicación')).map((error, i) => (
                    <p key={i} className="text-red-500 text-xs">❌ {error}</p>
                  ))}
                  <p className="text-gray-400 text-xs">
                    {datosAccidente.ubicacion?.length || 0}/100 caracteres
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Quién conducía el vehículo? *
                </label>
                <input
                  type="text"
                  value={datosAccidente.nombreConductor}
                  onChange={(e) => handleDatosChange('nombreConductor', e.target.value)}
                  placeholder="Nombre completo del conductor"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    erroresEnTiempoReal.some(e => e.includes('Nombre')) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  required
                />
                {erroresEnTiempoReal.filter(e => e.includes('Nombre')).map((error, i) => (
                  <p key={i} className="text-red-500 text-xs mt-1">❌ {error}</p>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gravedad del Daño *
                </label>
                <select
                  value={datosAccidente.gravedad}
                  onChange={(e) => handleDatosChange('gravedad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione la gravedad</option>
                  <option value="Leve">Leve (rayones, abolladuras menores)</option>
                  <option value="Moderado">Moderado (daños visibles pero reparables)</option>
                  <option value="Grave">Grave (daños estructurales importantes)</option>
                  <option value="Total">Total (pérdida total del vehículo)</option>
                </select>
                {advertenciasEnTiempoReal.filter(a => a.includes('daño')).map((adv, i) => (
                  <p key={i} className="text-amber-500 text-xs mt-1">⚠️ {adv}</p>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={datosAccidente.hubeLesionados}
                    onChange={(e) => setDatosAccidente(prev => ({ ...prev, hubeLesionados: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">¿Hubo lesionados?</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={datosAccidente.otrosVehiculos}
                    onChange={(e) => setDatosAccidente(prev => ({ ...prev, otrosVehiculos: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">¿Otros vehículos?</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={datosAccidente.reportePolicial}
                    onChange={(e) => setDatosAccidente(prev => ({ ...prev, reportePolicial: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">¿Reporte policial?</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Detallada del Incidente *
              </label>
              <textarea
                value={datosAccidente.descripcion}
                onChange={(e) => handleDatosChange('descripcion', e.target.value)}
                placeholder="Describa DETALLADAMENTE cómo ocurrió el accidente:
• ¿Cómo sucedió? (ej: iba por la calle X cuando un carro se pasó la luz roja)
• ¿Cuáles son los daños visibles? (ej: parachoques delantero roto, luz izquierda quebrada)
• ¿Condiciones del clima/carretera? (ej: llovía, carretera mojada)
• ¿Velocidad aproximada? (ej: iba a unos 40 km/h)
• ¿Otros detalles importantes?"
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none ${
                  erroresEnTiempoReal.some(e => e.includes('Descripción')) 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <div>
                  {erroresEnTiempoReal.filter(e => e.includes('Descripción')).map((error, i) => (
                    <p key={i} className="text-red-500 text-xs">❌ {error}</p>
                  ))}
                  {datosAccidente.descripcion && datosAccidente.descripcion.length >= 20 && (
                    <p className="text-green-500 text-xs">✅ Descripción adecuada</p>
                  )}
                </div>
                <p className={`text-xs ${
                  datosAccidente.descripcion?.length >= 20 ? 'text-gray-400' : 'text-red-400'
                }`}>
                  {datosAccidente.descripcion?.length || 0}/500 caracteres (mín: 20)
                </p>
              </div>
            </div>

            {/* Subida de fotos obligatorias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos del Accidente * <span className="text-red-500">(Obligatorio - Mínimo 1 foto)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Suba fotos claras del daño, de todos los ángulos posibles
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fotos-upload"
                />
                <label
                  htmlFor="fotos-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Fotos
                </label>
              </div>

              {/* Vista previa de fotos */}
              {datosAccidente.fotos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {datosAccidente.fotos.map((foto, index) => {
                    const imageUrl = getSafeImageUrl(foto);
                    return (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5TDEzIDEwTDEyIDExTDExIDEwTDEyIDlaIiBmaWxsPSIjOTQ5Nzk3Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5NDk3OTciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbjwvdGV4dD4KPHN2Zz4K';
                          }}
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">{foto.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sección de documentos adicionales (opcional) */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Documentos Adicionales (Opcional)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Puede adjuntar documentos como: reporte policial, cotizaciones de reparación, declaraciones de testigos, etc.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="documentos-upload"
                  />
                  <label
                    htmlFor="documentos-upload"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Documentos
                  </label>
                  <span className="text-xs text-gray-500 self-center">
                    Formatos: PDF, DOC, DOCX, TXT, PNG, JPG (Máx. 10MB por archivo)
                  </span>
                </div>

                {/* Vista previa de documentos */}
                {datosAccidente.documentos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {datosAccidente.documentos.map((documento, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{documento.name}</p>
                            <p className="text-xs text-gray-500">
                              {(documento.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocument(index)}
                          className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sección financiera con validaciones mejoradas */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  💰 Desglose de Costos del Reclamo
                </h4>
                <p className="text-sm text-gray-600 mb-6">
                  Especifique cuánto necesita para cada tipo de daño. Esto nos ayuda a procesar su reclamo más eficientemente.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💸 Costo de Reparación de MI Vehículo *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={datosAccidente.costoEstimadoReparacion}
                        onChange={(e) => handleDatosChange('costoEstimadoReparacion', e.target.value)}
                        placeholder="0.00"
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                          advertenciasEnTiempoReal.some(a => a.includes('Monto')) 
                            ? 'border-amber-300 focus:ring-amber-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        min="0"
                        max="200000"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="mt-1">
                      <p className="text-xs text-gray-500">
                        ¿Cuánto cuesta reparar SU vehículo? (cotizaciones, estimación propia)
                      </p>
                      {advertenciasEnTiempoReal.filter(a => a.includes('Monto alto')).map((adv, i) => (
                        <p key={i} className="text-amber-500 text-xs mt-1">⚠️ {adv}</p>
                      ))}
                      {advertenciasEnTiempoReal.filter(a => a.includes('documentación adicional')).map((adv, i) => (
                        <p key={i} className="text-amber-600 text-xs mt-1 font-medium">⚠️ {adv}</p>
                      ))}
                    </div>
                  </div>

                  {datosAccidente.otrosVehiculos && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🚗 Costo de Reparación de Vehículos TERCEROS
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={datosAccidente.montoTerceros}
                          onChange={(e) => handleDatosChange('montoTerceros', e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          max="500000"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">¿Cuánto costará reparar los OTROS vehículos que dañé?</p>
                    </div>
                  )}

                  {datosAccidente.hubeLesionados && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🏥 Gastos Médicos (Míos o de Otros)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={datosAccidente.gastosMedicos}
                          onChange={(e) => handleDatosChange('gastosMedicos', e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          max="100000"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Ambulancia, hospital, medicinas, consultas médicas</p>
                    </div>
                  )}
                </div>

                {/* Campo para calcular el monto total automáticamente con validaciones */}
                <div className={`mt-6 p-4 rounded-lg border-l-4 ${
                  (() => {
                    const total = (parseFloat(datosAccidente.costoEstimadoReparacion) || 0) + 
                                 (parseFloat(datosAccidente.montoTerceros) || 0) + 
                                 (parseFloat(datosAccidente.gastosMedicos) || 0);
                    return total > 50000 ? 'bg-red-50 border-red-400' : 
                           total > 20000 ? 'bg-amber-50 border-amber-400' : 
                           'bg-blue-50 border-blue-400';
                  })()
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">💰 TOTAL que solicito a la aseguradora:</span>
                    <span className={`text-2xl font-bold ${
                      (() => {
                        const total = (parseFloat(datosAccidente.costoEstimadoReparacion) || 0) + 
                                     (parseFloat(datosAccidente.montoTerceros) || 0) + 
                                     (parseFloat(datosAccidente.gastosMedicos) || 0);
                        return total > 50000 ? 'text-red-600' : 
                               total > 20000 ? 'text-amber-600' : 
                               'text-blue-600';
                      })()
                    }`}>
                      ${(() => {
                        const reparacionMia = parseFloat(datosAccidente.costoEstimadoReparacion) || 0;
                        const reparacionTerceros = parseFloat(datosAccidente.montoTerceros) || 0;
                        const medicos = parseFloat(datosAccidente.gastosMedicos) || 0;
                        const total = reparacionMia + reparacionTerceros + medicos;
                        // Actualizar el monto solicitado automáticamente
                        if (total !== (parseFloat(datosAccidente.montoSolicitado) || 0)) {
                          setTimeout(() => {
                            setDatosAccidente(prev => ({ ...prev, montoSolicitado: total.toString() }));
                          }, 0);
                        }
                        return total.toLocaleString();
                      })()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">
                      Este total se calcula automáticamente sumando todos los costos especificados arriba.
                    </p>
                    {(() => {
                      const total = (parseFloat(datosAccidente.costoEstimadoReparacion) || 0) + 
                                   (parseFloat(datosAccidente.montoTerceros) || 0) + 
                                   (parseFloat(datosAccidente.gastosMedicos) || 0);
                      if (total > 50000) {
                        return (
                          <p className="text-red-600 text-xs font-medium mt-1">
                            ⚠️ MONTO ALTO: Requerirá investigación adicional y documentación completa
                          </p>
                        );
                      }
                      if (total > 20000) {
                        return (
                          <p className="text-amber-600 text-xs mt-1">
                            ⚠️ Monto elevado: Se recomienda documentación de respaldo
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📋 Detalles Adicionales de los Costos (Opcional)
                  </label>
                  <textarea
                    value={datosAccidente.observacionesFinancieras}
                    onChange={(e) => setDatosAccidente(prev => ({ ...prev, observacionesFinancieras: e.target.value }))}
                    placeholder="Ejemplo: 
• Ya tengo 2 cotizaciones del taller Juan Pérez ($5,000) y AutoFix ($4,800)
• Los gastos médicos incluyen radiografías y consulta traumatólogo 
• El otro carro (Honda azul) tiene el parachoques muy dañado
• Tengo facturas/recibos de algunos gastos"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Ayúdanos con detalles específicos: talleres cotizados, facturas que tiene, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>

        <div className="flex space-x-3">
          {pasoActual > 1 && (
            <button
              onClick={() => setPasoActual(pasoActual - 1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
          )}
          
          {pasoActual < 3 && validacionCompleta && (
            <button
              onClick={() => setPasoActual(pasoActual + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Siguiente
            </button>
          )}

          {pasoActual === 3 && tipoReclamoValido && (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Reportar Accidente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioAccidenteNuevo;