// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * Español (es-ES) — Todo App Translations
 *
 * Per-locale file: one file per language, following the `per_locale` convention.
 */
export const esES: TranslationData = {
  objects: {
    todo_task: {
      label: 'Tarea',
      pluralLabel: 'Tareas',
      description: 'Una unidad de trabajo asignada a una persona.',
      fields: {
        subject: { label: 'Asunto' },
        description: { label: 'Descripción' },
        status: {
          label: 'Estado',
          options: { todo: 'Pendiente', doing: 'En curso', done: 'Completada', cancelled: 'Cancelada' },
        },
        priority: {
          label: 'Prioridad',
          options: { low: 'Baja', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },
        },
        assignee: { label: 'Responsable' },
        labels: { label: 'Etiquetas' },
        due_date: { label: 'Fecha de vencimiento' },
        started_at: { label: 'Inicio' },
        completed_at: { label: 'Finalización' },
        estimate_hours: { label: 'Estimación (h)' },
        approval_status: {
          label: 'Aprobación',
          options: {
            not_required: 'No requerida',
            pending: 'Pendiente',
            approved: 'Aprobada',
            rejected: 'Rechazada',
          },
        },
        is_overdue: { label: '¿Vencida?' },
      },
      _views: {
        all_tasks: { label: 'Todas las tareas', description: 'Todas las tareas, agrupadas por estado' },
        task_board: { label: 'Tablero de tareas', description: 'Vista kanban agrupada por estado' },
        my_open_tasks: { label: 'Mis tareas abiertas', description: 'Tareas abiertas asignadas a ti' },
        overdue_tasks: { label: 'Tareas vencidas', description: 'Tareas abiertas pasadas de su fecha límite' },
      },
    },

    todo_label: {
      label: 'Etiqueta',
      pluralLabel: 'Etiquetas',
      description: 'Etiqueta de color para categorizar tareas.',
      fields: {
        name: { label: 'Nombre' },
        color: { label: 'Color' },
        description: { label: 'Descripción' },
      },
    },
  },

  apps: {
    todo: {
      label: 'Todo',
      description: 'Gestor ligero de tareas con aprobaciones y paneles.',
      navigation: {
        group_work: { label: 'Trabajo' },
        group_admin: { label: 'Administración' },
        group_reports: { label: 'Informes' },
        group_approvals: { label: 'Aprobaciones' },
        nav_dashboard: { label: 'Mi trabajo' },
        nav_task: { label: 'Tareas' },
        nav_label: { label: 'Etiquetas' },
        nav_overdue: { label: 'Vencidas por responsable' },
        nav_throughput: { label: 'Productividad' },
        nav_approval_requests: { label: 'Mis aprobaciones' },
        nav_approval_processes: { label: 'Procesos' },
      },
    },
  },

  messages: {
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.create': 'Crear',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.back': 'Atrás',
    'common.confirm': 'Confirmar',
    'nav.work': 'Trabajo',
    'nav.admin': 'Administración',
    'nav.reports': 'Informes',
    'nav.approvals': 'Aprobaciones',
    'success.saved': 'Tarea guardada correctamente',
    'success.assigned': 'Tarea asignada correctamente',
    'confirm.delete': '¿Seguro que quieres eliminar este registro?',
    'confirm.mark_done': '¿Marcar {count} tarea(s) como completada(s)?',
    'confirm.reassign': '¿Reasignar {count} tarea(s)?',
    'error.required': 'Este campo es obligatorio',
    'error.load_failed': 'No se pudieron cargar los datos',
  },

  validationMessages: {
    due_date_required_for_urgent: 'Las tareas urgentes deben tener fecha de vencimiento',
    estimate_non_negative: 'Las horas estimadas no pueden ser negativas',
  },

  dashboards: {
    my_work_dashboard: {
      label: 'Mi trabajo',
      description: 'Página personal: trabajo abierto, vencidos y productividad semanal.',
      actions: {
        create_task: { label: 'Nueva tarea' },
      },
      widgets: {
        my_open_tasks: { title: 'Mis tareas abiertas', description: 'Tareas asignadas a ti que siguen pendientes o en curso' },
        my_overdue: { title: 'Vencidas', description: 'Tus tareas abiertas pasadas de fecha' },
        done_this_week: { title: 'Completadas esta semana', description: 'Tareas completadas desde el inicio de la semana' },
        recent_overdue_list: { title: 'Tareas vencidas', description: 'Tus tareas vencidas ordenadas de más antigua a más reciente' },
      },
    },
  },
};
