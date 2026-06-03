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
  description: 'Alert project managers when a team member is overallocated across projects.',
  type: 'record_change',

  variables: [{ name: 'resourceId', type: 'text', isInput: true, isOutput: false }],

  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Start',
      config: {
        objectName: 'pm_resource',
        triggerType: 'record-after-update',
      },
    },
    {
      id: 'get_resource',
      type: 'get_record',
      label: 'Get Resource Record',
      config: {
        objectName: 'pm_resource',
        filter: { id: '{record.id}' },
        outputVariable: 'resource',
      },
    },
    {
      id: 'query_person_allocations',
      type: 'get_record',
      label: 'Find All Allocations for This Person',
      config: {
        objectName: 'pm_resource',
        // Active allocations for this person; end-date window is applied in the
        // calculation step below.
        filter: { person: '{resource.person}' },
        limit: 500,
        outputVariable: 'query_person_allocations',
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
      type: 'decision',
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
      type: 'notify',
      label: 'Notify Project Managers',
      config: {
        to: '{affectedProjects[*].project_manager}',
        message:
          'Resource conflict: {{resource.person.name}} is allocated {{totalHours}} hours/week across multiple projects.',
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
    {
      id: 'e5',
      source: 'check_conflict',
      target: 'update_project_ai',
      type: 'conditional',
      condition: 'totalHours > 40',
      label: 'Overallocated',
    },
    {
      id: 'e6',
      source: 'check_conflict',
      target: 'end',
      isDefault: true,
      label: 'Within capacity',
    },
    { id: 'e7', source: 'update_project_ai', target: 'notify_pms', type: 'default' },
    { id: 'e8', source: 'notify_pms', target: 'end', type: 'default' },
  ],
};
