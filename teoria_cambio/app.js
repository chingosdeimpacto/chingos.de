import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Download, Save, Eye, Plus, Trash2, Target, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

const TheoryOfChangeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [theoryData, setTheoryData] = useState({
    problemDefinition: '',
    longTermGoal: '',
    assumptions: [],
    outcomes: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: []
    },
    activities: [],
    inputs: [],
    indicators: [],
    risks: [],
    stakeholders: []
  });

  const [newItem, setNewItem] = useState('');

  const steps = [
    {
      title: "Definición del Problema",
      icon: Target,
      description: "Identifica y describe claramente el problema que buscas resolver"
    },
    {
      title: "Meta a Largo Plazo",
      icon: TrendingUp,
      description: "Define el cambio final que quieres lograr"
    },
    {
      title: "Actores Clave",
      icon: Users,
      description: "Identifica los stakeholders y beneficiarios"
    },
    {
      title: "Resultados Esperados",
      icon: CheckCircle,
      description: "Define outcomes de corto, mediano y largo plazo"
    },
    {
      title: "Actividades e Insumos",
      icon: Clock,
      description: "Planifica las acciones y recursos necesarios"
    },
    {
      title: "Supuestos y Riesgos",
      icon: Target,
      description: "Identifica las condiciones críticas para el éxito"
    },
    {
      title: "Indicadores",
      icon: Target,
      description: "Define cómo medirás el progreso y el impacto"
    },
    {
      title: "Visualización Final",
      icon: Eye,
      description: "Revisa tu teoría de cambio completa"
    }
  ];

  const addItem = (field, subField = null, customText = null) => {
    const textToAdd = customText || newItem;
    if (!textToAdd.trim()) return;

    setTheoryData(prev => {
      const newData = { ...prev };
      if (subField) {
        newData[field][subField] = [...newData[field][subField], textToAdd.trim()];
      } else {
        newData[field] = [...newData[field], textToAdd.trim()];
      }
      return newData;
    });
    if (!customText) setNewItem('');
  };

  const removeItem = (field, index, subField = null) => {
    setTheoryData(prev => {
      const newData = { ...prev };
      if (subField) {
        newData[field][subField] = newData[field][subField].filter((_, i) => i !== index);
      } else {
        newData[field] = newData[field].filter((_, i) => i !== index);
      }
      return newData;
    });
  };

  // Función para descargar como imagen PNG
  const downloadAsImage = () => {
    try {
      // Crear canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Configurar canvas con dimensiones más grandes
      canvas.width = 1400;
      canvas.height = 2000;

      // Fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Variables de posición
      let y = 60;
      const margin = 50;
      const lineHeight = 25;
      const sectionSpacing = 40;

      // Función para escribir texto con word wrap
      const writeText = (text, x, startY, maxWidth, fontSize = 14, color = '#000000', isBold = false) => {
        ctx.fillStyle = color;
        ctx.font = `${isBold ? 'bold ' : ''}${fontSize}px Arial, sans-serif`;

        if (!text || text.trim() === '') {
          ctx.fillText('No definido', x, startY);
          return startY + lineHeight;
        }

        const words = text.split(' ');
        let line = '';
        let currentY = startY;

        for (let word of words) {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line.trim(), x, currentY);
            currentY += lineHeight;
            line = word + ' ';
          } else {
            line = testLine;
          }
        }

        if (line.trim() !== '') {
          ctx.fillText(line.trim(), x, currentY);
          currentY += lineHeight;
        }

        return currentY;
      };

      // Función para escribir lista
      const writeList = (items, x, startY, maxWidth, fontSize = 14) => {
        let currentY = startY;

        if (!items || items.length === 0) {
          ctx.fillStyle = '#666666';
          ctx.font = `${fontSize}px Arial, sans-serif`;
          ctx.fillText('• No definidos', x, currentY);
          return currentY + lineHeight;
        }

        for (let item of items) {
          if (item && item.trim() !== '') {
            currentY = writeText(`• ${item}`, x, currentY, maxWidth, fontSize, '#333333');
          }
        }

        return currentY;
      };

      // Título principal
      y = writeText('TEORÍA DE CAMBIO', margin, y, canvas.width - 2 * margin, 32, '#1f2937', true);
      y += sectionSpacing;

      // Línea separadora
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(canvas.width - margin, y);
      ctx.stroke();
      y += sectionSpacing;

      // Problema identificado
      y = writeText('PROBLEMA IDENTIFICADO', margin, y, canvas.width - 2 * margin, 18, '#dc2626', true);
      y += 10;
      y = writeText(theoryData.problemDefinition, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Meta a largo plazo
      y = writeText('META A LARGO PLAZO', margin, y, canvas.width - 2 * margin, 18, '#059669', true);
      y += 10;
      y = writeText(theoryData.longTermGoal, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Stakeholders
      y = writeText('STAKEHOLDERS', margin, y, canvas.width - 2 * margin, 18, '#2563eb', true);
      y += 10;
      y = writeList(theoryData.stakeholders, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Actividades
      y = writeText('ACTIVIDADES PRINCIPALES', margin, y, canvas.width - 2 * margin, 18, '#7c3aed', true);
      y += 10;
      y = writeList(theoryData.activities, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Insumos
      y = writeText('INSUMOS Y RECURSOS', margin, y, canvas.width - 2 * margin, 18, '#f59e0b', true);
      y += 10;
      y = writeList(theoryData.inputs, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Resultados corto plazo
      y = writeText('RESULTADOS A CORTO PLAZO', margin, y, canvas.width - 2 * margin, 18, '#10b981', true);
      y += 10;
      y = writeList(theoryData.outcomes.shortTerm, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Resultados mediano plazo
      y = writeText('RESULTADOS A MEDIANO PLAZO', margin, y, canvas.width - 2 * margin, 18, '#34d399', true);
      y += 10;
      y = writeList(theoryData.outcomes.mediumTerm, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Resultados largo plazo
      y = writeText('RESULTADOS A LARGO PLAZO', margin, y, canvas.width - 2 * margin, 18, '#6ee7b7', true);
      y += 10;
      y = writeList(theoryData.outcomes.longTerm, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Supuestos
      y = writeText('SUPUESTOS CRÍTICOS', margin, y, canvas.width - 2 * margin, 18, '#eab308', true);
      y += 10;
      y = writeList(theoryData.assumptions, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Riesgos
      y = writeText('RIESGOS POTENCIALES', margin, y, canvas.width - 2 * margin, 18, '#ef4444', true);
      y += 10;
      y = writeList(theoryData.risks, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing;

      // Indicadores
      y = writeText('INDICADORES', margin, y, canvas.width - 2 * margin, 18, '#6b7280', true);
      y += 10;
      y = writeList(theoryData.indicators, margin + 20, y, canvas.width - 2 * margin - 20);
      y += sectionSpacing * 2;

      // Footer
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(canvas.width - margin, y);
      ctx.stroke();
      y += 30;

      y = writeText('Creado por Chingos de impacto® 2025', margin, y, canvas.width - 2 * margin, 12, '#9ca3af');

      // Convertir canvas a imagen y descargar
      const link = document.createElement('a');
      link.download = 'teoria-de-cambio.png';
      link.href = canvas.toDataURL('image/png');

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Imagen generada exitosamente');

    } catch (error) {
      console.error('Error al generar la imagen:', error);

      // Fallback: copiar texto al clipboard
      const content = `TEORÍA DE CAMBIO

PROBLEMA IDENTIFICADO:
${theoryData.problemDefinition || 'No definido'}

META A LARGO PLAZO:
${theoryData.longTermGoal || 'No definida'}

STAKEHOLDERS:
${theoryData.stakeholders.length > 0 ? theoryData.stakeholders.map(item => `• ${item}`).join('\n') : '• No definidos'}

ACTIVIDADES PRINCIPALES:
${theoryData.activities.length > 0 ? theoryData.activities.map(item => `• ${item}`).join('\n') : '• No definidas'}

INSUMOS Y RECURSOS:
${theoryData.inputs.length > 0 ? theoryData.inputs.map(item => `• ${item}`).join('\n') : '• No definidos'}

RESULTADOS A CORTO PLAZO:
${theoryData.outcomes.shortTerm.length > 0 ? theoryData.outcomes.shortTerm.map(item => `• ${item}`).join('\n') : '• No definidos'}

RESULTADOS A MEDIANO PLAZO:
${theoryData.outcomes.mediumTerm.length > 0 ? theoryData.outcomes.mediumTerm.map(item => `• ${item}`).join('\n') : '• No definidos'}

RESULTADOS A LARGO PLAZO:
${theoryData.outcomes.longTerm.length > 0 ? theoryData.outcomes.longTerm.map(item => `• ${item}`).join('\n') : '• No definidos'}

SUPUESTOS CRÍTICOS:
${theoryData.assumptions.length > 0 ? theoryData.assumptions.map(item => `• ${item}`).join('\n') : '• No definidos'}

RIESGOS POTENCIALES:
${theoryData.risks.length > 0 ? theoryData.risks.map(item => `• ${item}`).join('\n') : '• No definidos'}

INDICADORES:
${theoryData.indicators.length > 0 ? theoryData.indicators.map(item => `• ${item}`).join('\n') : '• No definidos'}

Creado por Chingos de impacto® 2025`;

      // Intentar copiar al clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content).then(() => {
          alert('No se pudo generar la imagen, pero el contenido se ha copiado al portapapeles. Puedes pegarlo en cualquier documento.');
        }).catch(() => {
          alert('Error al generar la imagen. Por favor, intenta de nuevo o usa una versión más reciente del navegador.');
        });
      } else {
        alert('Error al generar la imagen. Por favor, intenta de nuevo o usa una versión más reciente del navegador.');
      }
    }
  };

  const ListManager = ({ items, field, subField = null, placeholder, title }) => {
    const [localInput, setLocalInput] = useState('');

    const handleAddItem = () => {
      if (!localInput.trim()) return;
      addItem(field, subField, localInput);
      setLocalInput('');
    };

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">{title}</h4>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              {editingItem === `${field}-${subField}-${index}` ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(field, index, e.target.value, subField)}
                  onBlur={() => setEditingItem(null)}
                  onKeyPress={(e) => e.key === 'Enter' && setEditingItem(null)}
                  className="flex-1 p-2 border rounded"
                  autoFocus
                />
              ) : (
                <span className="flex-1">{item}</span>
              )}
              <button
                onClick={() => setEditingItem(`${field}-${subField}-${index}`)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => removeItem(field, index, subField)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Definición del Problema</h3>
              <p className="text-gray-600 mb-4">
                Describe claramente el problema social, ambiental o de desarrollo que tu proyecto busca resolver.
                Sé específico sobre quién se ve afectado y por qué es importante abordar este problema.
              </p>
              <textarea
                value={theoryData.problemDefinition}
                onChange={(e) => setTheoryData(prev => ({ ...prev, problemDefinition: e.target.value }))}
                placeholder="Ejemplo: La falta de acceso a educación de calidad en comunidades rurales limita las oportunidades de desarrollo económico y perpetúa los ciclos de pobreza..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Meta a Largo Plazo</h3>
              <p className="text-gray-600 mb-4">
                Define el cambio final y sostenible que quieres lograr. Esta meta debe ser ambiciosa pero alcanzable,
                y debe abordar directamente el problema que identificaste.
              </p>
              <textarea
                value={theoryData.longTermGoal}
                onChange={(e) => setTheoryData(prev => ({ ...prev, longTermGoal: e.target.value }))}
                placeholder="Ejemplo: Las comunidades rurales tienen acceso equitativo a educación de calidad que les permite desarrollar capacidades para mejorar sus condiciones de vida y contribuir al desarrollo sostenible de sus regiones..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Actores Clave</h3>
            <p className="text-gray-600 mb-6">
              Identifica a todos los stakeholders relevantes: beneficiarios directos e indirectos,
              implementadores, financiadores, y otros actores que pueden influir en el éxito del proyecto.
            </p>
            <ListManager
              items={theoryData.stakeholders}
              field="stakeholders"
              placeholder="Ej: Estudiantes de comunidades rurales, maestros locales, autoridades educativas..."
              title="Stakeholders y Beneficiarios"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Resultados Esperados</h3>
            <p className="text-gray-600 mb-6">
              Define los cambios que esperas ver en diferentes horizontes temporales.
              Cada nivel debe construir sobre el anterior hacia tu meta final.
            </p>
            <div className="grid gap-6">
              <ListManager
                items={theoryData.outcomes.shortTerm}
                field="outcomes"
                subField="shortTerm"
                placeholder="Ej: Maestros capacitados en nuevas metodologías pedagógicas"
                title="Resultados a Corto Plazo (6-12 meses)"
              />
              <ListManager
                items={theoryData.outcomes.mediumTerm}
                field="outcomes"
                subField="mediumTerm"
                placeholder="Ej: Mejora en los indicadores de aprendizaje de los estudiantes"
                title="Resultados a Mediano Plazo (1-3 años)"
              />
              <ListManager
                items={theoryData.outcomes.longTerm}
                field="outcomes"
                subField="longTerm"
                placeholder="Ej: Aumento en las oportunidades de empleo y emprendimiento local"
                title="Resultados a Largo Plazo (3+ años)"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Actividades e Insumos</h3>
            <p className="text-gray-600 mb-6">
              Planifica las acciones concretas que realizarás y los recursos que necesitarás
              para lograr los resultados esperados.
            </p>
            <div className="grid gap-6">
              <ListManager
                items={theoryData.activities}
                field="activities"
                placeholder="Ej: Talleres de capacitación docente, desarrollo de materiales educativos"
                title="Actividades Principales"
              />
              <ListManager
                items={theoryData.inputs}
                field="inputs"
                placeholder="Ej: Presupuesto para capacitaciones, equipos tecnológicos, personal especializado"
                title="Insumos y Recursos Necesarios"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Supuestos y Riesgos</h3>
            <p className="text-gray-600 mb-6">
              Identifica las condiciones externas que deben cumplirse para que tu teoría funcione,
              así como los riesgos que podrían afectar el logro de los resultados.
            </p>
            <div className="grid gap-6">
              <ListManager
                items={theoryData.assumptions}
                field="assumptions"
                placeholder="Ej: Las autoridades locales apoyan la iniciativa educativa"
                title="Supuestos Críticos"
              />
              <ListManager
                items={theoryData.risks}
                field="risks"
                placeholder="Ej: Cambios en políticas educativas nacionales que afecten el proyecto"
                title="Riesgos Potenciales"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Indicadores de Medición</h3>
            <p className="text-gray-600 mb-6">
              Define cómo medirás el progreso hacia cada resultado.
              Los indicadores deben ser específicos, medibles y relevantes.
            </p>
            <ListManager
              items={theoryData.indicators}
              field="indicators"
              placeholder="Ej: % de mejora en pruebas de comprensión lectora, número de maestros certificados"
              title="Indicadores de Impacto y Resultado"
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Tu Teoría de Cambio</h3>
            <div id="theory-summary" className="bg-gray-50 p-6 rounded-lg space-y-6">

              <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-semibold text-red-700 mb-2">Problema Identificado</h4>
                <p className="text-gray-700">{theoryData.problemDefinition || 'No definido'}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-700 mb-2">Meta a Largo Plazo</h4>
                <p className="text-gray-700">{theoryData.longTermGoal || 'No definida'}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-700 mb-2">Stakeholders</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {theoryData.stakeholders.length > 0 ? theoryData.stakeholders.map((item, i) => (
                      <li key={i}>• {item}</li>
                    )) : <li>No definidos</li>}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-700 mb-2">Actividades Clave</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {theoryData.activities.length > 0 ? theoryData.activities.map((item, i) => (
                      <li key={i}>• {item}</li>
                    )) : <li>No definidas</li>}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-700 mb-2">Cadena de Resultados</h4>
                <div className="grid md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Corto Plazo</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {theoryData.outcomes.shortTerm.length > 0 ? theoryData.outcomes.shortTerm.map((item, i) => (
                        <li key={i}>• {item}</li>
                      )) : <li>No definidos</li>}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Mediano Plazo</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {theoryData.outcomes.mediumTerm.length > 0 ? theoryData.outcomes.mediumTerm.map((item, i) => (
                        <li key={i}>• {item}</li>
                      )) : <li>No definidos</li>}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-gray-600 mb-2">Largo Plazo</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {theoryData.outcomes.longTerm.length > 0 ? theoryData.outcomes.longTerm.map((item, i) => (
                        <li key={i}>• {item}</li>
                      )) : <li>No definidos</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-700 mb-2">Insumos y Recursos</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {theoryData.inputs.length > 0 ? theoryData.inputs.map((item, i) => (
                      <li key={i}>• {item}</li>
                    )) : <li>No definidos</li>}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border-l-4 border-pink-500">
                  <h4 className="font-semibold text-pink-700 mb-2">Supuestos Críticos</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {theoryData.assumptions.length > 0 ? theoryData.assumptions.map((item, i) => (
                      <li key={i}>• {item}</li>
                    )) : <li>No definidos</li>}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-red-400">
                  <h4 className="font-semibold text-red-600 mb-2">Riesgos Potenciales</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {theoryData.risks.length > 0 ? theoryData.risks.map((item, i) => (
                      <li key={i}>• {item}</li>
                    )) : <li>No definidos</li>}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border-l-4 border-gray-500">
                  <h4 className="font-semibold text-gray-700 mb-2">Indicadores Clave</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {theoryData.indicators.length > 0 ? theoryData.indicators.map((item, i) => (
                      <li key={i}>• {item}</li>
                    )) : <li>No definidos</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={downloadAsImage}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium transition-colors"
              >
                <Download size={20} />
                Descargar PNG
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generador de Teoría de Cambio</h1>
          <p className="text-gray-600">Herramienta interactiva para desarrollar tu teoría de cambio paso a paso</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      : isCompleted
                      ? 'bg-green-100 text-green-700 border-2 border-green-200'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium whitespace-nowrap">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8 min-h-96">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-800 mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
          </div>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>

          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
              currentStep === steps.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Creado por{' '}
          <a
            href="https://www.instagram.com/chingosdeimpacto/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Chingos de impacto®
          </a>{' '}
          2025.
        </p>
      </footer>
    </div>
  );
};

export default TheoryOfChangeGenerator;
