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
    tipoDano: '',
    fotos: []
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
    setDatosAccidente(prev => ({
      ...prev,
      fotos: [...prev.fotos, ...files]
    }));
  };

  const removeFile = (index) => {
    setDatosAccidente(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    // Validaciones
    if (!polizaSeleccionada || !validacionCompleta || !tipoReclamoValido) {
      alert('❌ Complete todos los pasos de validación');
      return;
    }

    if (!datosAccidente.fechaHora || !datosAccidente.ubicacion || !datosAccidente.descripcion || !datosAccidente.tipoDano) {
      alert('❌ Complete todos los campos requeridos (incluyendo el tipo de daño)');
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
                  Tipo de Daño/Accidente *
                </label>
                <select
                  value={datosAccidente.tipoDano}
                  onChange={(e) => setDatosAccidente(prev => ({ ...prev, tipoDano: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione el tipo de daño</option>
                  <option value="Colisión frontal">Colisión frontal</option>
                  <option value="Colisión trasera">Colisión trasera</option>
                  <option value="Colisión lateral">Colisión lateral</option>
                  <option value="Volcadura">Volcadura</option>
                  <option value="Daños por granizo">Daños por granizo</option>
                  <option value="Daños por inundación">Daños por inundación</option>
                  <option value="Robo total">Robo total</option>
                  <option value="Robo parcial">Robo parcial</option>
                  <option value="Vandalismo">Vandalismo</option>
                  <option value="Incendio">Incendio</option>
                  <option value="Cristales rotos">Cristales rotos</option>
                  <option value="Daños menores">Daños menores</option>
                  <option value="Otro">Otro</option>
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
                  {datosAccidente.fotos.map((foto, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(foto)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{foto.name}</p>
                    </div>
                  ))}
                </div>
              )}
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