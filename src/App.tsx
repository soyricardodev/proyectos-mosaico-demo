import { useState } from 'react'

import { ProjectMosaic } from './components/project-mosaic'
import Dashboard from './components/dashboard'
import { Button } from './components/ui/button'

export interface Tab {
  i: string
  title: string
  description: string
  versions: {
    id: string
    content: string
    isDefault: boolean
  }[]
  currentVersion: string
  w: number
  h: number
}

const initialTabs = [
  {
    i: 'observacion',
    title: 'Observación del problema',
    description: 'Identificación inicial del problema que se va a abordar.\n\n-Situación actual.\n\n-Evidencias que muestran la existencia del problema (datos,observaciones)\n\n-Contexto y entorno donde se presenta el problema.',
    versions: [
      { id: 'v1', content: 'Versión inicial de la observación del problema.', isDefault: true },
      { id: 'v2', content: 'Observación actualizada después de la reunión con el equipo.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'analisis',
    title: 'Análisis de causa raíz',
    description: 'Identificación de las causas fundamentales del problema.\n\n-Métodos utilizados para el análisis (Diagrama de Ishikawa, los 5 porqués etc).\n\n-Descripción de las causas identificadas.\n\n-Evidencias que soportan cada causa.',
    versions: [
      { id: 'v1', content: 'Primera iteración del análisis de causa raíz.', isDefault: true },
      { id: 'v2', content: 'Análisis refinado con datos adicionales.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,

  },
  {
    i: 'planteamiento',
    title: 'Planteamiento del problema',
    description: 'Formulación clara y precisa del problema a resolver.\n\n-Declaración del problema en términos específicos y medibles.\n\n-Impacto del problema en la organización o contexto.\n\n-Justificación de la necesidad de resolver el problema.',
    versions: [
      { id: 'v1', content: 'Planteamiento inicial del problema.', isDefault: true },
      { id: 'v2', content: 'Planteamiento revisado basado en el feedback del cliente.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'objetivo',
    title: 'Objetivo del Proyecto',
    description: 'Definición de lo que se espera lograr con el proyecto.\n\n-Objetivo general.\n\n-Objetivos específicos.\n\n-Metas cuantitativas y cualitativas.',
    versions: [
      { id: 'v1', content: 'Objetivo preliminar del proyecto.', isDefault: true },
      { id: 'v2', content: 'Objetivo ajustado después de la revisión del alcance.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'alcance',
    title: 'Alcance',
    description: 'Delimitación de lo que incluye y no incluye el proyecto.\n\n-Descripción de las actividades y entregables del proyecto.\n\n-Limitaciones y exclusiones.\n\n-Criterios de éxito del proyecto.',
    versions: [
      { id: 'v1', content: 'Alcance inicial del proyecto.', isDefault: true },
      { id: 'v2', content: 'Alcance revisado después de la evaluación de recursos.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'alternativas',
    title: 'Alternativas de Solución',
    description: 'Identificación y evaluación de diferentes formas de resolver el problema.\n\n-Descripción de cada alternativa considerada.\n\n-Ventajas y desventajas de cada alternativa.\n\n-Criterios utilizados para evaluar las alternativas.',
    versions: [
      { id: 'v1', content: 'Lista inicial de alternativas de solución.', isDefault: true },
      { id: 'v2', content: 'Alternativas actualizadas después de la evaluación de factibilidad.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'solucion',
    title: 'Solución a Desarrollar',
    description: 'Selección y descripción de la solución elegida.\n\n-Justificación de la elección de la solución.\n\n-Descripción detallada de la solución propuesta.\n\n-Recursos necesarios para implementar la solución.',
    versions: [
      { id: 'v1', content: 'Propuesta inicial de solución.', isDefault: true },
      { id: 'v2', content: 'Solución refinada basada en los comentarios del equipo técnico.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'diseno',
    title: 'Diseño',
    description: 'Planificación detallada de cómo se implementará la solución.\n\n-Plan de diseño (esquemas, diagramas, modelos).\n\n-Especificaciones técnicas.\n\n-Gantt de diseño.',
    versions: [
      { id: 'v1', content: 'Bosquejo inicial del diseño.', isDefault: true },
      { id: 'v2', content: 'Diseño detallado con especificaciones técnicas.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'construccion',
    title: 'Construcción',
    description: 'Proceso de creación y desarrollo de la solución.\n\n-Descripción de las actividades de construcción.\n\n-Recursos y materiales utilizados.\n\n-Control de calidad y pruebas realizadas.',
    versions: [
      { id: 'v1', content: 'Plan preliminar de construcción.', isDefault: true },
      { id: 'v2', content: 'Plan de construcción actualizado con cronograma detallado.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'seguimiento',
    title: 'Seguimiento',
    description: 'Monitoreo y control del progreso del proyecto.\n\n-Indicadores de desempeño.\n\n-Informes de seguimiento.\n\n-Reuniones de revisión y ajuste del plan.',
    versions: [
      { id: 'v1', content: 'Plan inicial de seguimiento.', isDefault: true },
      { id: 'v2', content: 'Plan de seguimiento actualizado con nuevos indicadores.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'implementacion',
    title: 'Implementación',
    description: 'Ejecución de la solución en el entorno real.\n\n-Plan de implementación.\n\n-Actividades y responsables.\n\n-Gestión de riesgos y contingencias.',
    versions: [
      { id: 'v1', content: 'Plan inicial de implementación.', isDefault: true },
      { id: 'v2', content: 'Plan de implementación revisado con feedback del equipo.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
  {
    i: 'adopcion',
    title: 'Adopción',
    description: 'Integración de la solución en las operaciones regulares.\n\n-Plan de adopción y capacitación.\n\n-Estrategias de comunicación y cambio.\n\n-Evaluación de la adopción y ajustes necesarios.',
    versions: [
      { id: 'v1', content: 'Estrategia inicial de adopción.', isDefault: true },
      { id: 'v2', content: 'Estrategia de adopción actualizada con lecciones aprendidas.', isDefault: false },
    ],
    currentVersion: 'v1',
    w: 2,
    h: 2,
  },
] satisfies Tab[]

function App() {
  const [isDynamic, setIsDynamic] = useState(true)

  return (
    <div className='flex flex-col'>
      <header className='w-full flex items-center justify-between p-4'>
        <strong className='text-xl font-bold'>
          Demo de Mosaicos para proyectos
        </strong>

        <ul className='flex items-center space-x-2'>
          <li>
            <Button onClick={() => setIsDynamic(!isDynamic)}>
              Cambiar a {!isDynamic ? 'Mosaico estático' : 'Mosaico dinámico'}
            </Button>
          </li>
        </ul>
      </header>


      {isDynamic ? (
        <ProjectMosaic initialTabs={initialTabs} />
      ) : (
        <Dashboard initialTabs={initialTabs} />
      )}
    </div>
  )
}

export default App
