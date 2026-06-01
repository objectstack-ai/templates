// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

export const en: TranslationData = {
  objects: {
    helpdesk_ticket: {
      label: 'Ticket',
      pluralLabel: 'Tickets',
      description: 'A customer support request. AI-triaged, SLA-tracked, threaded with messages.',
      fields: {
        ticket_number: { label: 'Ticket #' },
        name: { label: 'Subject' },
        description: { label: 'Description' },
        channel: {
          label: 'Channel',
          options: { email: 'Email', web: 'Web Form', chat: 'Chat', phone: 'Phone', api: 'API' },
        },
        status: {
          label: 'Status',
          options: {
            new: 'New', triaged: 'Triaged', in_progress: 'In Progress',
            waiting_customer: 'Waiting Customer', resolved: 'Resolved',
            closed: 'Closed', escalated: 'Escalated',
          },
        },
        priority: {
          label: 'Priority',
          options: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' },
        },
        customer: { label: 'Customer' },
        team: { label: 'Team' },
        assignee: { label: 'Assignee' },
        sla_policy: { label: 'SLA Policy' },
        ai_summary: { label: 'AI Summary' },
        ai_category: {
          label: 'AI Category',
          options: {
            bug: 'Bug / Defect', how_to: 'How-to', billing: 'Account / Billing',
            feature_request: 'Feature Request', outage: 'Outage',
            feedback: 'Feedback', other: 'Other',
          },
        },
        ai_intent: { label: 'AI Intent' },
        ai_sentiment: {
          label: 'AI Sentiment',
          options: { positive: 'Positive', neutral: 'Neutral', frustrated: 'Frustrated', angry: 'Angry' },
        },
        ai_priority_suggestion: { label: 'AI Suggested Priority' },
        ai_language: { label: 'AI Detected Language' },
        ai_suggested_reply: { label: 'AI Suggested Reply' },
        ai_suggested_kb_ids: { label: 'AI Suggested KB Articles' },
        ai_confidence: { label: 'AI Confidence' },
        ai_triage_at: { label: 'AI Triaged At' },
        first_response_due_at: { label: 'First Response Due' },
        resolution_due_at: { label: 'Resolution Due' },
        first_response_at: { label: 'First Response At' },
        resolved_at: { label: 'Resolved At' },
        is_first_response_breached: { label: 'First Response Breached' },
        is_resolution_breached: { label: 'Resolution Breached' },
        csat_score: { label: 'CSAT (1–5)' },
        csat_comment: { label: 'CSAT Comment' },
        tags: { label: 'Tags' },
        internal_notes: { label: 'Internal Notes' },
      },
      _views: {
        all_tickets: { label: 'All Tickets', description: 'Every ticket, grouped by status' },
        ticket_pipeline: { label: 'Ticket Pipeline', description: 'Kanban grouped by status' },
        open_tickets: { label: 'Open Tickets', description: 'Anything not closed or resolved' },
        breaching_tickets: { label: 'Breaching SLA', description: 'Past resolution_due_at and still open' },
        angry_tickets: { label: 'Angry Customers', description: 'AI detected angry sentiment' },
        my_queue: { label: 'My Queue', description: 'Tickets assigned to me' },
      },
    },
    helpdesk_customer: {
      label: 'Customer', pluralLabel: 'Customers',
      description: 'A person who files tickets.',
      fields: {
        name: { label: 'Name' }, email: { label: 'Email' }, company: { label: 'Company' },
        tier: { label: 'Tier', options: { free: 'Free', pro: 'Pro', business: 'Business', enterprise: 'Enterprise' } },
        locale: { label: 'Preferred Locale' }, portal_user: { label: 'Portal User' },
        timezone: { label: 'Timezone' }, notes: { label: 'Notes' },
      },
    },
    helpdesk_team: {
      label: 'Team', pluralLabel: 'Teams',
      description: 'A support team / queue.',
      fields: {
        name: { label: 'Name' }, code: { label: 'Code' },
        specialty: {
          label: 'Specialty',
          options: { tier1: 'Tier 1 — General', tier2: 'Tier 2 — Technical', billing: 'Billing', account: 'Account Management', trust: 'Trust & Safety' },
        },
        manager: { label: 'Manager' }, is_active: { label: 'Active' }, business_hours: { label: 'Business Hours' },
      },
    },
    helpdesk_kb_article: {
      label: 'KB Article', pluralLabel: 'KB Articles',
      description: 'Knowledge base article. Published articles are eligible for AI recall.',
      fields: {
        name: { label: 'Title' }, slug: { label: 'Slug' }, body: { label: 'Body' },
        category: {
          label: 'Category',
          options: { getting_started: 'Getting Started', billing: 'Account & Billing', how_to: 'How-to', troubleshooting: 'Troubleshooting', api: 'API & Integrations', known_issues: 'Known Issues' },
        },
        status: { label: 'Status', options: { draft: 'Draft', review: 'In Review', published: 'Published', archived: 'Archived' } },
        tags: { label: 'Tags' }, locale: { label: 'Locale' }, author: { label: 'Author' },
        helpful_count: { label: 'Helpful Votes' }, unhelpful_count: { label: 'Unhelpful Votes' },
        published_at: { label: 'Published At' },
      },
    },
    helpdesk_message: {
      label: 'Message', pluralLabel: 'Messages',
      description: 'One message in a ticket thread.',
      fields: {
        name: { label: 'Snippet' }, ticket: { label: 'Ticket' },
        direction: { label: 'Direction', options: { inbound: 'Inbound', outbound: 'Outbound', internal_note: 'Internal Note' } },
        author_user: { label: 'Author (User)' }, author_customer: { label: 'Author (Customer)' },
        body: { label: 'Body' }, is_ai_drafted: { label: 'AI Drafted' }, sent_at: { label: 'Sent At' },
      },
    },
    helpdesk_sla_policy: {
      label: 'SLA Policy', pluralLabel: 'SLA Policies',
      description: 'Response and resolution targets, by priority.',
      fields: {
        name: { label: 'Name' },
        applies_to_tier: { label: 'Applies To Tier', options: { free: 'Free', pro: 'Pro', business: 'Business', enterprise: 'Enterprise' } },
        is_default: { label: 'Default' },
        first_response_low_minutes: { label: 'First Response — Low (min)' },
        first_response_normal_minutes: { label: 'First Response — Normal (min)' },
        first_response_high_minutes: { label: 'First Response — High (min)' },
        first_response_urgent_minutes: { label: 'First Response — Urgent (min)' },
        resolution_low_minutes: { label: 'Resolution — Low (min)' },
        resolution_normal_minutes: { label: 'Resolution — Normal (min)' },
        resolution_high_minutes: { label: 'Resolution — High (min)' },
        resolution_urgent_minutes: { label: 'Resolution — Urgent (min)' },
        notes: { label: 'Notes' },
      },
    },
  },
  apps: {
    helpdesk: {
      label: 'AI Helpdesk',
      description: 'AI-first customer support on ObjectStack.',
      navigation: {
        nav_workbench: { label: 'My Workbench' },
        nav_manager: { label: 'Manager Overview' },
        nav_tickets: { label: 'Tickets' },
        nav_messages: { label: 'Messages' },
        nav_customers: { label: 'Customers' },
        nav_kb: { label: 'Knowledge Base' },
        nav_teams: { label: 'Teams' },
        nav_sla: { label: 'SLA Policies' },
      },
    },
  },
  dashboards: {
    agent_workbench_dashboard: {
      label: 'Agent Workbench',
      description: 'Your queue at a glance. Breaches, angry customers, AI-ready replies.',
      widgets: {
        my_open: { title: 'My Open Tickets' },
        breaching_resolution: { title: 'SLA Breaching' },
        angry: { title: 'Angry Customers' },
        awaiting_triage: { title: 'Awaiting Triage' },
        my_queue_table: { title: 'My Queue (Priority Sorted)' },
        breaching_table: { title: 'SLA Breaches' },
      },
    },
    manager_overview_dashboard: {
      label: 'Support Manager Overview',
      widgets: {
        total_open: { title: 'Open Tickets' },
        breaching_overview: { title: 'SLA Breaching' },
        escalated: { title: 'Escalated' },
        avg_csat: { title: 'Avg CSAT' },
        tickets_by_status: { title: 'Tickets by Status' },
        tickets_by_sentiment: { title: 'Sentiment Distribution' },
        tickets_by_category: { title: 'AI Category Mix' },
        tickets_by_channel: { title: 'Volume by Channel' },
        recent_escalated: { title: 'Recently Escalated' },
        resolutions_by_day: { title: 'Resolutions by Day (last 30 days)' },
      },
    },
  },
};
