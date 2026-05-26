// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type * as Automation from '@objectstack/spec/automation';
type Flow = Automation.Flow;

/**
 * Resource Conflict Detection — detects when a person is overallocated.
 *
 * Runs when a resource allocation is created/updated.
 * Checks if total allocated hours across all projects > 40 hours/week.
 */
export const ResourceConflictDetectionFlow: Flow = {
  name: 'pm_resource_conflict_detection',
  label: 'Resource Conflict Detection',
  description:
    'Alert project managers when a team member is overallocated across projects.',
  type: 'record_change',

  variables: [
    { name: 'resourceId', type: 'text', isInput: true, isOutput: false },
  ],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'pm_resource',
        triggerOn: 'create,update',
      },
    },
    {
      id: 'get_resource',
      type: 'get_record',
      label: 'Get Resource Record',
      config: {
        objectName: 'pm_resource',
        recordId: '{resourceId}',
      },
    },
    {
      id: 'query_person_allocations',
      type: 'query',
      label: 'Find All Allocations for This Person',
      config: {
        objectName: 'pm_resource',
        filter: 'person = {resource.person} AND (end_date IS NULL OR end_date >= TODAY())',
        filterDialect: 'objectql',
      },
    },
    {
      id: 'calculate_total',
      type: 'script',
      label: 'Calculate Total Allocated Hours',
      config: {
        actionType: 'invoke_function',
        functionName: 'pm.calculateTotalAllocation',
        inputs: {
          allocations: '{query_person_allocations.records}',
        },
        // Returns: { totalHours, isOverallocated, affectedProjects }
      },
    },
    {
      id: 'check_conflict',
      type: 'condition',
      label: 'Overallocated (> 40 hours)?',
      config: {
        condition: 'totalHours > 40',
        conditionDialect: 'cel',
      },
    },
    {
      id: 'update_project_ai',
      type: 'script',
      label: 'Update Affected Projects AI Field',
      config: {
        actionType: 'invoke_function',
        functionName: 'pm.updateProjectResourceBottleneck',
        inputs: {
          projectIds: '{affectedProjects}',
          message: 'Resource {resource.person.name} overallocated ({totalHours}h/week)',
        },
      },
    },
    {
      id: 'notify_pms',
      type: 'script',
      label: 'Notify Project Managers',
      config: {
        actionType: 'send_notification',
        to: '{affectedProjects[*].project_manager}',
        message: 'Resource conflict: {{resource.person.name}} is allocated {{totalHours}} hours/week across multiple projects.',
      },
    },
    {
      id: 'end',
      type: 'end',
      label: 'End',
    },
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'get_resource', type: 'default' },
    { id: 'e2', source: 'get_resource', target: 'query_person_allocations', type: 'default' },
    { id: 'e3', source: 'query_person_allocations', target: 'calculate_total', type: 'default' },
    { id: 'e4', source: 'calculate_total', target: 'check_conflict', type: 'default' },
    { id: 'e5', source: 'check_conflict', target: 'update_project_ai', type: 'true' },
    { id: 'e6', source: 'check_conflict', target: 'end', type: 'false' },
    { id: 'e7', source: 'update_project_ai', target: 'notify_pms', type: 'default' },
    { id: 'e8', source: 'notify_pms', target: 'end', type: 'default' },
  ],
};
