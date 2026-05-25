// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Department } from '../objects/hr_department.object';
import { Employee } from '../objects/hr_employee.object';
import { TimeOffRequest } from '../objects/hr_time_off_request.object';
import { EmployeeDocument } from '../objects/hr_document.object';

/**
 * Seed data — a small fictional company demonstrating the full template:
 *
 *   • 4 departments (one nested under Engineering)
 *   • 7 employees with a reporting chain across statuses
 *   • 6 time-off requests covering every lifecycle state
 *   • 5 documents: valid / expiring soon (within 30d) / expired
 */

const departments = defineDataset(Department, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    { name: 'Engineering', code: 'ENG', description: 'Builds and runs the product.' },
    { name: 'Platform', code: 'ENG-PLAT', parent: 'Engineering', description: 'Infrastructure and developer experience.' },
    { name: 'Marketing', code: 'MKT', description: 'Brand, content, and growth.' },
    { name: 'People Ops', code: 'PPL', description: 'HR, recruiting, and culture.' },
  ],
});

const employees = defineDataset(Employee, {
  mode: 'upsert',
  externalId: 'work_email',
  records: [
    {
      full_name: 'Amelia Ortega',
      preferred_name: 'Amelia',
      work_email: 'amelia.ortega@acme.example.com',
      phone: '+1 415 555 0101',
      job_title: 'VP Engineering',
      department: 'Engineering',
      location: 'San Francisco',
      status: 'active',
      employment_type: 'full_time',
      hire_date: cel`daysAgo(1500)`,
      salary: 240000,
      contract_type: 'Standard',
      national_id_last4: '4821',
    },
    {
      full_name: 'James Wu',
      work_email: 'james.wu@acme.example.com',
      job_title: 'Staff Engineer',
      department: 'Platform',
      manager: 'amelia.ortega@acme.example.com',
      location: 'Remote',
      status: 'active',
      employment_type: 'full_time',
      hire_date: cel`daysAgo(820)`,
      salary: 195000,
      contract_type: 'Standard',
      national_id_last4: '7702',
    },
    {
      full_name: 'Sara Lin',
      work_email: 'sara.lin@acme.example.com',
      job_title: 'Senior Engineer',
      department: 'Platform',
      manager: 'james.wu@acme.example.com',
      location: 'New York',
      status: 'on_leave',
      employment_type: 'full_time',
      hire_date: cel`daysAgo(540)`,
      salary: 170000,
      contract_type: 'Standard',
      national_id_last4: '3198',
    },
    {
      full_name: 'Kenji Sato',
      work_email: 'kenji.sato@acme.example.com',
      job_title: 'Engineer',
      department: 'Engineering',
      manager: 'amelia.ortega@acme.example.com',
      location: 'Tokyo',
      status: 'active',
      employment_type: 'full_time',
      hire_date: cel`daysAgo(80)`, // recent joiner
      salary: 140000,
      contract_type: 'Standard',
      national_id_last4: '0455',
    },
    {
      full_name: 'Priya Patel',
      work_email: 'priya.patel@acme.example.com',
      job_title: 'Head of Marketing',
      department: 'Marketing',
      location: 'London',
      status: 'active',
      employment_type: 'full_time',
      hire_date: cel`daysAgo(1100)`,
      salary: 185000,
      contract_type: 'Standard',
      national_id_last4: '6633',
    },
    {
      full_name: 'Marco Rossi',
      work_email: 'marco.rossi@acme.example.com',
      job_title: 'Marketing Contractor',
      department: 'Marketing',
      manager: 'priya.patel@acme.example.com',
      location: 'Milan',
      status: 'active',
      employment_type: 'contractor',
      hire_date: cel`daysAgo(60)`,
      contract_type: 'Fixed-term 12mo',
    },
    {
      full_name: 'Hannah Becker',
      work_email: 'hannah.becker@acme.example.com',
      job_title: 'People Ops Lead',
      department: 'People Ops',
      location: 'Berlin',
      status: 'active',
      employment_type: 'full_time',
      hire_date: cel`daysAgo(620)`,
      salary: 165000,
      contract_type: 'Standard',
      national_id_last4: '9981',
    },
  ],
});

const timeOff = defineDataset(TimeOffRequest, {
  mode: 'upsert',
  externalId: 'employee',
  records: [
    {
      employee: 'james.wu@acme.example.com',
      leave_type: 'vacation',
      start_date: cel`daysFromNow(20)`,
      end_date: cel`daysFromNow(27)`,
      status: 'submitted',
      reason: 'Family trip — booked flights already.',
    },
    {
      employee: 'kenji.sato@acme.example.com',
      leave_type: 'personal',
      start_date: cel`daysFromNow(40)`,
      end_date: cel`daysFromNow(41)`,
      status: 'draft',
    },
    {
      employee: 'sara.lin@acme.example.com',
      leave_type: 'sick',
      start_date: cel`daysAgo(5)`,
      end_date: cel`daysFromNow(9)`,
      status: 'approved',
      approver: 'james.wu@acme.example.com',
      decision_note: 'Get well soon.',
    },
    {
      employee: 'marco.rossi@acme.example.com',
      leave_type: 'unpaid',
      start_date: cel`daysFromNow(70)`,
      end_date: cel`daysFromNow(85)`,
      status: 'rejected',
      approver: 'priya.patel@acme.example.com',
      decision_note: 'Conflicts with Q3 campaign launch — please rebook.',
    },
    {
      employee: 'priya.patel@acme.example.com',
      leave_type: 'vacation',
      start_date: cel`daysAgo(40)`,
      end_date: cel`daysAgo(34)`,
      status: 'approved',
      approver: 'amelia.ortega@acme.example.com',
    },
    {
      employee: 'hannah.becker@acme.example.com',
      leave_type: 'vacation',
      start_date: cel`daysFromNow(90)`,
      end_date: cel`daysFromNow(100)`,
      status: 'cancelled',
    },
  ],
});

const documents = defineDataset(EmployeeDocument, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    {
      name: 'Amelia Ortega — Employment Contract',
      employee: 'amelia.ortega@acme.example.com',
      doc_type: 'contract',
      issued_on: cel`daysAgo(1500)`,
    },
    {
      name: 'Kenji Sato — Work Visa',
      employee: 'kenji.sato@acme.example.com',
      doc_type: 'visa',
      issued_on: cel`daysAgo(80)`,
      expires_at: cel`daysFromNow(15)`, // expiring soon → triggers reminder flow
    },
    {
      name: 'Sara Lin — AWS Certification',
      employee: 'sara.lin@acme.example.com',
      doc_type: 'certification',
      issued_on: cel`daysAgo(400)`,
      expires_at: cel`daysFromNow(365)`,
    },
    {
      name: 'Marco Rossi — Fixed-term Agreement',
      employee: 'marco.rossi@acme.example.com',
      doc_type: 'contract',
      issued_on: cel`daysAgo(60)`,
      expires_at: cel`daysFromNow(305)`,
    },
    {
      name: 'Priya Patel — Right to Work',
      employee: 'priya.patel@acme.example.com',
      doc_type: 'id',
      issued_on: cel`daysAgo(800)`,
      expires_at: cel`daysAgo(10)`, // already expired
    },
  ],
});

export const HrSeedData = [departments, employees, timeOff, documents];
