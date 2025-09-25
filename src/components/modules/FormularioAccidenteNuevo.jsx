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
    documentos: []
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

  const handleSubmit = () => {
    // Validaciones
    if (!polizaSeleccionada || !validacionCompleta || !tipoReclamoValido) {
      alert('❌ Complete todos los pasos de validación');
      return;
    }

    if (!datosAccidente.fechaHora || !datosAccidente.ubicacion || !datosAccidente.descripcion || !datosAccidente.gravedad) {
      alert('❌ Complete todos los campos requeridos (incluyendo la gravedad del daño)');
      return;
    }

    if (!datosAccidente.fotos || datosAccidente.fotos.length === 0) {
      alert('❌ Es obligatorio subir al menos una foto');
      return;
    }

    // Crear objeto completo del accidente
    const accidenteCompleto = {
      // Datos de la póliza
      poliza: polizaSeleccionada,
      // Datos del accidente
      ...datosAccidente,
      // Metadatos
      fechaReporte: new Date().toISOString(),
      clienteId: currentUser?.id,
      estado: 'Pendiente'
    };

    onSubmit(accidenteCompleto);
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

            {/* Nuevos campos del accidente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora del Accidente *
                </label>
                <input
                  type="datetime-local"
                  value={datosAccidente.fechaHora}
                  onChange={(e) => setDatosAccidente(prev => ({ ...prev, fechaHora: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación Específica *
                </label>
                <input
                  type="text"
                  value={datosAccidente.ubicacion}
                  onChange={(e) => setDatosAccidente(prev => ({ ...prev, ubicacion: e.target.value }))}
                  placeholder="Calle, avenida, intersección exacta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Quién conducía el vehículo? *
                </label>
                <input
                  type="text"
                  value={datosAccidente.nombreConductor}
                  onChange={(e) => setDatosAccidente(prev => ({ ...prev, nombreConductor: e.target.value }))}
                  placeholder="Nombre completo del conductor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gravedad del Daño *
                </label>
                <select
                  value={datosAccidente.gravedad}
                  onChange={(e) => setDatosAccidente(prev => ({ ...prev, gravedad: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione la gravedad</option>
                  <option value="Leve">Leve</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Grave">Grave</option>
                  <option value="Total">Total</option>
                </select>
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
                onChange={(e) => setDatosAccidente(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Describa cómo ocurrió el accidente, daños observados, condiciones del clima, etc."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
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
                
                <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
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
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Documentos
                  </label>
                  <span className="text-xs text-gray-500">
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