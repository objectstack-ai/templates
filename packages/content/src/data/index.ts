// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import { defineDataset } from '@objectstack/spec/data';
import { cel } from '@objectstack/spec';
import { Competitor } from '../objects/content_competitor.object';
import { Channel } from '../objects/content_channel.object';
import { ContentTemplate } from '../objects/content_template.object';
import { Signal } from '../objects/content_signal.object';
import { Topic } from '../objects/content_topic.object';
import { Piece } from '../objects/content_piece.object';
import { Publication } from '../objects/content_publication.object';
import { Metric } from '../objects/content_metric.object';
import { Cta } from '../objects/content_cta.object';

/**
 * Seed data — realistic editorial workload covering the full template
 * surface. Datasets load in dependency order:
 *
 *   COMPETITORS  6   (independent)
 *   CHANNELS     5   (independent)
 *   TEMPLATES    3   (→ channel)
 *   SIGNALS     12   (→ competitor; mixed statuses)
 *   TOPICS       8   (→ signal optional; 4 sourced from a signal)
 *   PIECES      14   (→ topic, template, channels; all 8 lifecycle states)
 *   PUBLICATIONS 10  (→ piece, channel; for published+archived pieces)
 *   METRICS    ~60   (→ publication; 6 weekly snapshots per publication)
 *   CTAS        14   (→ piece; one per piece)
 *
 * `externalId` is the natural human-readable field (name / title / headline /
 * summary). Authors who fork the template can swap to a real key without
 * changing the seed call sites.
 */

const competitors = defineDataset(Competitor, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    {
      name: 'Helio Insights',
      category: 'direct',
      website: 'https://helio.example.com',
      rss_feed: 'https://helio.example.com/blog/rss.xml',
      notes: 'Strongest BOFU content; weak on industry analysis.',
    },
    {
      name: 'Northstar Labs',
      category: 'direct',
      website: 'https://northstar.example.com',
      rss_feed: 'https://northstar.example.com/feed',
      notes: 'Heavy launch cadence — they ship a feature post every Tuesday.',
    },
    {
      name: 'Cobalt Studio',
      category: 'indirect',
      website: 'https://cobalt.example.com',
      notes: 'Adjacent (design-tool space) but their growth playbook is worth tracking.',
    },
    {
      name: 'Pinegate Open',
      category: 'direct',
      website: 'https://pinegate.example.com',
      rss_feed: 'https://pinegate.example.com/blog/atom.xml',
      notes: 'Open-source-first; long, technical deep-dives.',
    },
    {
      name: 'Mercator Analytics',
      category: 'indirect',
      website: 'https://mercator.example.com',
      notes: 'Adjacent — analytics infra; great customer-story format we can borrow.',
    },
    {
      name: 'Salt River Media',
      category: 'creator',
      website: 'https://saltriver.example.com',
      notes: 'Not a competitor, but the gold standard for B2B newsletter craft.',
    },
  ],
});

const channels = defineDataset(Channel, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    {
      name: 'Company Blog',
      kind: 'blog',
      base_url: 'https://example.com/blog',
      default_cta_goal: 'signup',
      color: '#2563eb',
      active: true,
    },
    {
      name: 'Weekly Newsletter',
      kind: 'newsletter',
      base_url: 'https://example.com/newsletter',
      default_cta_goal: 'subscribe',
      color: '#16a34a',
      active: true,
    },
    {
      name: 'Build Notes Podcast',
      kind: 'podcast',
      base_url: 'https://example.com/podcast',
      default_cta_goal: 'subscribe',
      color: '#9333ea',
      active: true,
    },
    {
      name: 'YouTube — Engineering',
      kind: 'youtube',
      base_url: 'https://youtube.com/@example-eng',
      default_cta_goal: 'watch',
      color: '#dc2626',
      active: true,
    },
    {
      name: 'LinkedIn Company Page',
      kind: 'linkedin',
      base_url: 'https://linkedin.com/company/example',
      default_cta_goal: 'read',
      color: '#0a66c2',
      active: true,
    },
  ],
});

const templates = defineDataset(ContentTemplate, {
  mode: 'upsert',
  externalId: 'name',
  records: [
    {
      name: 'Long-Form Article',
      kind: 'long_form',
      target_channel: 'Company Blog',
      target_word_count: 1800,
      outline_markdown:
        '# {{title}}\n\n## Why this matters\n- One-line stakes\n- Why now\n\n## The core idea\n- 2-3 paragraphs\n\n## How it works\n- Walkthrough with example\n- Diagram (optional)\n\n## What to do about it\n- Practical takeaways\n\n## CTA\n',
      description: 'Default skeleton for blog deep-dives. ~1800 words, single CTA at the end.',
    },
    {
      name: 'Customer Story',
      kind: 'case_study',
      target_channel: 'Company Blog',
      target_word_count: 1200,
      outline_markdown:
        '# How {{customer}} achieved {{outcome}}\n\n## Background\n- Industry, size, status quo\n\n## The problem\n- 2-3 bullets\n\n## The approach\n- What they tried first\n- What changed\n\n## Results\n- Hard numbers in a table\n\n## CTA — talk to sales\n',
      description: 'Case-study format. Requires 1+ hard metric and 1 customer quote.',
    },
    {
      name: 'Weekly Newsletter Issue',
      kind: 'newsletter',
      target_channel: 'Weekly Newsletter',
      target_word_count: 700,
      outline_markdown:
        '## What we shipped\n- Feature 1 (link)\n- Feature 2 (link)\n\n## What we read\n- Link + 1-line take\n- Link + 1-line take\n\n## What we are working on\n- Brief peek behind the curtain\n\n## CTA — subscribe / share\n',
      description: 'Short, scannable. Three sections + CTA. Send Tuesdays.',
    },
  ],
});

const signals = defineDataset(Signal, {
  mode: 'upsert',
  externalId: 'headline',
  records: [
    {
      headline: 'Helio shipped a "self-serve onboarding" rewrite',
      source_kind: 'competitor_post',
      competitor: 'Helio Insights',
      source_url: 'https://helio.example.com/blog/self-serve-rewrite',
      captured_at: cel`daysAgo(2)`,
      status: 'captured',
      impact: 'high',
      summary: 'New flow drops the demo gate; emphasises 5-minute time-to-value.',
      recommended_topic_title: 'Why we kept the demo gate (and when we will drop it)',
    },
    {
      headline: 'Northstar launched a public Roadmap page',
      source_kind: 'competitor_post',
      competitor: 'Northstar Labs',
      source_url: 'https://northstar.example.com/roadmap',
      captured_at: cel`daysAgo(3)`,
      status: 'captured',
      impact: 'medium',
      recommended_topic_title: 'How we decide what makes the public roadmap',
    },
    {
      headline: 'Search trend: "metrics dashboard for marketing" up 40% MoM',
      source_kind: 'search_trend',
      source_url: 'https://trends.example.com/q/metrics-dashboard-marketing',
      captured_at: cel`daysAgo(5)`,
      status: 'captured',
      impact: 'high',
      recommended_topic_title: 'The marketing metrics dashboard we actually use',
    },
    {
      headline: 'Pinegate published a 6000-word piece on observability cost',
      source_kind: 'competitor_post',
      competitor: 'Pinegate Open',
      source_url: 'https://pinegate.example.com/blog/observability-cost',
      captured_at: cel`daysAgo(7)`,
      status: 'promoted',
      impact: 'high',
      summary:
        'Detailed breakdown of how their team cut o11y bill in half. Strong technical depth, links to runbooks.',
      recommended_topic_title: 'What it actually costs to run our analytics stack',
      promoted_at: cel`daysAgo(6)`,
    },
    {
      headline: 'Customer Slack: "wish your changelog was an RSS feed"',
      source_kind: 'social_thread',
      source_url: 'https://example.slack.com/archives/C0/p1700000000000000',
      captured_at: cel`daysAgo(10)`,
      status: 'promoted',
      impact: 'medium',
      summary:
        'Multiple +1s. Two paying customers chimed in. Cheap to ship as a small RSS endpoint.',
      recommended_topic_title: 'Introducing the changelog RSS feed',
      promoted_at: cel`daysAgo(9)`,
    },
    {
      headline: 'Sales call: ACME asked "do you have a SOC 2 walkthrough we can show legal?"',
      source_kind: 'customer_quote',
      captured_at: cel`daysAgo(12)`,
      status: 'promoted',
      impact: 'medium',
      summary: 'Third time this quarter. Write once, hand to every Enterprise prospect.',
      recommended_topic_title: 'How our SOC 2 program actually works (and where the report lives)',
      promoted_at: cel`daysAgo(11)`,
    },
    {
      headline: 'Cobalt rebranded their pricing page around "teams"',
      source_kind: 'competitor_post',
      competitor: 'Cobalt Studio',
      source_url: 'https://cobalt.example.com/pricing',
      captured_at: cel`daysAgo(14)`,
      status: 'ignored',
      impact: 'low',
    },
    {
      headline: 'Support ticket spike: people confused by region selector',
      source_kind: 'customer_quote',
      captured_at: cel`daysAgo(16)`,
      status: 'promoted',
      impact: 'high',
      summary: '12 tickets in two weeks. Clearer docs would defuse most.',
      recommended_topic_title: 'Picking the right region — a 3-minute guide',
      promoted_at: cel`daysAgo(15)`,
    },
    {
      headline: 'Mercator hired a former GitHub DevRel lead',
      source_kind: 'competitor_post',
      competitor: 'Mercator Analytics',
      captured_at: cel`daysAgo(18)`,
      status: 'ignored',
      impact: 'low',
      notes: 'Worth watching for content cadence shifts in 2 quarters, not actionable now.',
    },
    {
      headline: 'Search trend: brand name + "vs Helio" climbing',
      source_kind: 'search_trend',
      captured_at: cel`daysAgo(1)`,
      status: 'captured',
      impact: 'high',
      recommended_topic_title: 'Honest comparison: us vs Helio',
    },
    {
      headline: 'HN front page: "I built a launch-week tracker"',
      source_kind: 'social_thread',
      source_url: 'https://news.example.org/item?id=12345',
      captured_at: cel`daysAgo(4)`,
      status: 'captured',
      impact: 'low',
      recommended_topic_title: 'A short anatomy of a great launch week',
    },
    {
      headline: 'Salt River newsletter ran a great "anti-pattern" issue',
      source_kind: 'competitor_post',
      competitor: 'Salt River Media',
      source_url: 'https://saltriver.example.com/issues/87',
      captured_at: cel`daysAgo(6)`,
      status: 'captured',
      impact: 'medium',
      recommended_topic_title: 'Five anti-patterns we keep seeing in dashboards',
    },
  ],
});

const topics = defineDataset(Topic, {
  mode: 'upsert',
  externalId: 'title',
  records: [
    {
      title: 'What it actually costs to run our analytics stack',
      brief:
        'Borrow Pinegate angle: real numbers, real runbook. Show 6-month bill, what we cut, what we kept.',
      pillar: 'thought_leadership',
      funnel_stage: 'mofu',
      priority: 'high',
      target_keyword: 'analytics infrastructure cost',
      visibility: 'team',
      source_signal: 'Pinegate published a 6000-word piece on observability cost',
      tags: 'infra, deep-dive',
    },
    {
      title: 'Introducing the changelog RSS feed',
      brief: 'Small launch post. Lead with the customer ask. Link to the actual feed at the end.',
      pillar: 'product_education',
      funnel_stage: 'tofu',
      priority: 'normal',
      target_keyword: 'changelog rss feed',
      visibility: 'team',
      source_signal: 'Customer Slack: "wish your changelog was an RSS feed"',
      tags: 'launch, small-wins',
    },
    {
      title: 'How our SOC 2 program actually works (and where the report lives)',
      brief: 'Sales-enabled deep-dive. Aimed at procurement / legal at Enterprise prospects.',
      pillar: 'product_education',
      funnel_stage: 'bofu',
      priority: 'high',
      target_keyword: 'soc 2 compliance',
      visibility: 'team',
      source_signal: 'Sales call: ACME asked "do you have a SOC 2 walkthrough we can show legal?"',
      tags: 'security, enterprise',
    },
    {
      title: 'Picking the right region — a 3-minute guide',
      brief: 'Short, scannable. Decision tree + one-line per region. Defuses the support spike.',
      pillar: 'product_education',
      funnel_stage: 'tofu',
      priority: 'high',
      target_keyword: 'choose region',
      visibility: 'team',
      source_signal: 'Support ticket spike: people confused by region selector',
      tags: 'docs, quick-win',
    },
    {
      title: 'The marketing metrics dashboard we actually use',
      brief:
        'Show the real screenshots. Inspired by the search trend. Position us as the dogfooding-honest team.',
      pillar: 'thought_leadership',
      funnel_stage: 'mofu',
      priority: 'normal',
      target_keyword: 'marketing metrics dashboard',
      visibility: 'team',
      tags: 'dogfooding, marketing-ops',
    },
    {
      title: 'How we run a launch week (no theatre, lots of links)',
      brief: 'Behind the curtain. Calendar, who owns what, the all-hands rehearsal.',
      pillar: 'community',
      funnel_stage: 'tofu',
      priority: 'normal',
      visibility: 'team',
      tags: 'culture, ops',
    },
    {
      title: 'Customer story: Northwind cut report time from 3 days to 4 hours',
      brief: 'Standard case-study format. Need 1 quote + 2 metrics from Northwind champion.',
      pillar: 'customer_story',
      funnel_stage: 'bofu',
      priority: 'high',
      visibility: 'team',
      tags: 'case-study, enterprise',
    },
    {
      title: 'Five anti-patterns we keep seeing in dashboards',
      brief:
        'Opinionated, screenshot-driven. Borrow tone from Salt River. Each anti-pattern gets a before/after.',
      pillar: 'industry_insight',
      funnel_stage: 'tofu',
      priority: 'normal',
      target_keyword: 'dashboard anti-patterns',
      visibility: 'team',
      tags: 'design, opinion',
    },
  ],
});

const pieces = defineDataset(Piece, {
  mode: 'upsert',
  externalId: 'title',
  records: [
    {
      title: 'Honest comparison: us vs Helio',
      slug: 'us-vs-helio',
      topic: 'What it actually costs to run our analytics stack',
      template: 'Long-Form Article',
      status: 'backlog',
      format: 'long_form',
      target_channels: ['Company Blog'],
      summary: 'Side-by-side feature comparison with honest "they win here" sections.',
      tags: 'comparison, seo',
    },
    {
      title: 'A short anatomy of a great launch week',
      slug: 'anatomy-launch-week',
      topic: 'How we run a launch week (no theatre, lots of links)',
      template: 'Long-Form Article',
      status: 'backlog',
      format: 'long_form',
      target_channels: ['Company Blog'],
      tags: 'ops, culture',
    },
    {
      title: 'Five anti-patterns we keep seeing in dashboards',
      slug: 'dashboard-anti-patterns',
      topic: 'Five anti-patterns we keep seeing in dashboards',
      template: 'Long-Form Article',
      status: 'backlog',
      format: 'listicle',
      target_channels: ['Company Blog', 'Weekly Newsletter'],
      tags: 'design, opinion',
    },
    {
      title: 'The marketing metrics dashboard we actually use',
      slug: 'marketing-metrics-dashboard',
      topic: 'The marketing metrics dashboard we actually use',
      template: 'Long-Form Article',
      status: 'drafting',
      format: 'long_form',
      target_channels: ['Company Blog'],
      word_count_target: 1800,
      body_outline:
        '# The marketing metrics dashboard we actually use\n\n## What we track\n## What we stopped tracking\n## The dashboard itself\n## CTA',
      summary: 'Real screenshots. Dogfooding-honest. Aimed at MOFU SaaS marketers.',
      tags: 'dogfooding, marketing-ops',
    },
    {
      title: 'Picking the right region — a 3-minute guide',
      slug: 'choose-region',
      topic: 'Picking the right region — a 3-minute guide',
      template: 'Long-Form Article',
      status: 'drafting',
      format: 'long_form',
      target_channels: ['Company Blog'],
      word_count_target: 600,
      body_outline:
        '# Picking the right region\n\n## A 30-second decision tree\n## One-line per region\n## What changes if you guess wrong\n## CTA',
      tags: 'docs, quick-win',
    },
    {
      title: 'Customer story: Northwind cut report time from 3 days to 4 hours',
      slug: 'northwind-case',
      topic: 'Customer story: Northwind cut report time from 3 days to 4 hours',
      template: 'Customer Story',
      status: 'drafting',
      format: 'case_study',
      target_channels: ['Company Blog', 'LinkedIn Company Page'],
      word_count_target: 1200,
      tags: 'case-study, enterprise',
    },
    {
      title: 'How our SOC 2 program actually works (and where the report lives)',
      slug: 'soc2-program',
      topic: 'How our SOC 2 program actually works (and where the report lives)',
      template: 'Long-Form Article',
      status: 'in_review',
      format: 'long_form',
      target_channels: ['Company Blog'],
      word_count_target: 1500,
      body_outline:
        '# How our SOC 2 program actually works\n\n## What SOC 2 actually requires\n## How we operationalised it\n## Where to find our report\n## CTA — book a security review',
      submitted_at: cel`daysAgo(2)`,
      summary: 'Sales-enabled deep-dive — aimed at procurement / legal at Enterprise prospects.',
      tags: 'security, enterprise',
    },
    {
      title: 'What it actually costs to run our analytics stack',
      slug: 'analytics-stack-cost',
      topic: 'What it actually costs to run our analytics stack',
      template: 'Long-Form Article',
      status: 'in_review',
      format: 'long_form',
      target_channels: ['Company Blog', 'Weekly Newsletter'],
      word_count_target: 2200,
      submitted_at: cel`daysAgo(1)`,
      summary: 'Real numbers, real runbook. Six-month bill, what we cut, what we kept.',
      tags: 'infra, deep-dive',
    },
    {
      title: 'Introducing the changelog RSS feed',
      slug: 'changelog-rss',
      topic: 'Introducing the changelog RSS feed',
      template: 'Long-Form Article',
      status: 'approved',
      format: 'long_form',
      target_channels: ['Company Blog'],
      word_count_target: 500,
      submitted_at: cel`daysAgo(4)`,
      approved_at: cel`daysAgo(2)`,
      tags: 'launch, small-wins',
    },
    {
      title: 'Weekly: Issue #42 — Two ways to think about region selection',
      slug: 'newsletter-42',
      topic: 'Picking the right region — a 3-minute guide',
      template: 'Weekly Newsletter Issue',
      status: 'scheduled',
      format: 'newsletter',
      target_channels: ['Weekly Newsletter'],
      publish_at: cel`daysFromNow(2)`,
      submitted_at: cel`daysAgo(5)`,
      approved_at: cel`daysAgo(3)`,
      word_count_target: 700,
      tags: 'newsletter',
    },
    {
      title: 'Weekly: Issue #43 — What we shipped this week',
      slug: 'newsletter-43',
      topic: 'How we run a launch week (no theatre, lots of links)',
      template: 'Weekly Newsletter Issue',
      status: 'scheduled',
      format: 'newsletter',
      target_channels: ['Weekly Newsletter'],
      publish_at: cel`daysFromNow(9)`,
      submitted_at: cel`daysAgo(2)`,
      approved_at: cel`daysAgo(1)`,
      word_count_target: 700,
      tags: 'newsletter',
    },
    {
      title: 'Why we kept the demo gate (and when we will drop it)',
      slug: 'demo-gate',
      topic: 'What it actually costs to run our analytics stack',
      template: 'Long-Form Article',
      status: 'published',
      format: 'long_form',
      target_channels: ['Company Blog', 'LinkedIn Company Page'],
      publish_at: cel`daysAgo(8)`,
      submitted_at: cel`daysAgo(14)`,
      approved_at: cel`daysAgo(10)`,
      published_at: cel`daysAgo(8)`,
      word_count_target: 1600,
      summary: 'Inspired by Helio rewrite. Honest about why our funnel is different.',
      tags: 'growth, opinion',
    },
    {
      title: 'How we decide what makes the public roadmap',
      slug: 'public-roadmap-criteria',
      topic: 'How we run a launch week (no theatre, lots of links)',
      template: 'Long-Form Article',
      status: 'published',
      format: 'long_form',
      target_channels: ['Company Blog'],
      publish_at: cel`daysAgo(22)`,
      submitted_at: cel`daysAgo(28)`,
      approved_at: cel`daysAgo(24)`,
      published_at: cel`daysAgo(22)`,
      word_count_target: 1400,
      tags: 'ops, process',
    },
    {
      title: 'Q3 2025 metrics: what worked, what didn\u2019t',
      slug: 'q3-2025-metrics',
      topic: 'The marketing metrics dashboard we actually use',
      template: 'Long-Form Article',
      status: 'archived',
      format: 'long_form',
      target_channels: ['Company Blog'],
      publish_at: cel`daysAgo(160)`,
      submitted_at: cel`daysAgo(170)`,
      approved_at: cel`daysAgo(165)`,
      published_at: cel`daysAgo(160)`,
      archived_at: cel`daysAgo(30)`,
      word_count_target: 2000,
      summary: 'Snapshot of last quarter. Archived after refresh.',
      tags: 'metrics, historical',
    },
  ],
});

const publications = defineDataset(Publication, {
  mode: 'upsert',
  externalId: 'public_url',
  records: [
    {
      piece: 'Why we kept the demo gate (and when we will drop it)',
      channel: 'Company Blog',
      public_url: 'https://example.com/blog/demo-gate',
      published_at: cel`daysAgo(8)`,
      total_views: 4820,
      total_clicks: 312,
      total_signups: 48,
      total_revenue: 12000,
      last_metric_at: cel`daysAgo(1)`,
    },
    {
      piece: 'Why we kept the demo gate (and when we will drop it)',
      channel: 'LinkedIn Company Page',
      public_url: 'https://linkedin.com/company/example/posts/demo-gate',
      published_at: cel`daysAgo(8)`,
      total_views: 9100,
      total_clicks: 240,
      total_signups: 22,
      total_revenue: 4400,
      last_metric_at: cel`daysAgo(1)`,
    },
    {
      piece: 'How we decide what makes the public roadmap',
      channel: 'Company Blog',
      public_url: 'https://example.com/blog/public-roadmap-criteria',
      published_at: cel`daysAgo(22)`,
      total_views: 3140,
      total_clicks: 195,
      total_signups: 21,
      total_revenue: 5800,
      last_metric_at: cel`daysAgo(1)`,
    },
    {
      piece: 'Q3 2025 metrics: what worked, what didn\u2019t',
      channel: 'Company Blog',
      public_url: 'https://example.com/blog/q3-2025-metrics',
      published_at: cel`daysAgo(160)`,
      total_views: 11200,
      total_clicks: 730,
      total_signups: 110,
      total_revenue: 26500,
      last_metric_at: cel`daysAgo(35)`,
    },
  ],
});

// 6 weekly snapshots per recent publication, 3 monthly snapshots for the
// archived one. Each row is one period; the publication_rollup flow keeps
// totals in sync (the publication.total_* above is a starting denormal).
const metrics = defineDataset(Metric, {
  mode: 'upsert',
  externalId: 'note',
  records: [
    // demo-gate / Company Blog — 6 weekly rolls (weeks ago: 1..6)
    ...[1, 2, 3, 4, 5, 6].map((w) => ({
      publication: 'https://example.com/blog/demo-gate',
      period_start: cel`daysAgo(${7 * w})`,
      period_end: cel`daysAgo(${7 * (w - 1)})`,
      views: Math.round(900 - w * 80),
      clicks: Math.round(70 - w * 5),
      signups: Math.round(11 - w),
      revenue: Math.round(2800 - w * 250),
      source: 'analytics' as const,
      note: `demo-gate/blog w-${w}`,
    })),

    // demo-gate / LinkedIn — 6 weekly
    ...[1, 2, 3, 4, 5, 6].map((w) => ({
      publication: 'https://linkedin.com/company/example/posts/demo-gate',
      period_start: cel`daysAgo(${7 * w})`,
      period_end: cel`daysAgo(${7 * (w - 1)})`,
      views: Math.round(1800 - w * 150),
      clicks: Math.round(50 - w * 4),
      signups: Math.round(5 - Math.floor(w / 2)),
      revenue: Math.round(1000 - w * 80),
      source: 'native' as const,
      note: `demo-gate/li w-${w}`,
    })),

    // public-roadmap-criteria / blog — 6 weekly (weeks 1..6 relative to today)
    ...[1, 2, 3, 4, 5, 6].map((w) => ({
      publication: 'https://example.com/blog/public-roadmap-criteria',
      period_start: cel`daysAgo(${7 * w})`,
      period_end: cel`daysAgo(${7 * (w - 1)})`,
      views: Math.round(620 - w * 50),
      clicks: Math.round(40 - w * 3),
      signups: Math.round(5 - Math.floor(w / 2)),
      revenue: Math.round(1300 - w * 120),
      source: 'analytics' as const,
      note: `roadmap/blog w-${w}`,
    })),

    // q3-2025-metrics / blog — 3 monthly (months ago: 1, 2, 3)
    ...[1, 2, 3].map((m) => ({
      publication: 'https://example.com/blog/q3-2025-metrics',
      period_start: cel`daysAgo(${30 * m})`,
      period_end: cel`daysAgo(${30 * (m - 1)})`,
      views: Math.round(1800 - m * 200),
      clicks: Math.round(120 - m * 15),
      signups: Math.round(18 - m * 2),
      revenue: Math.round(4500 - m * 500),
      source: 'analytics' as const,
      note: `q3metrics/blog m-${m}`,
    })),
  ],
});

const ctas = defineDataset(Cta, {
  mode: 'upsert',
  externalId: 'variant',
  records: [
    // One CTA per piece — variant tag includes the piece slug so externalId is unique.
    {
      piece: 'Honest comparison: us vs Helio',
      label_text: 'Start free trial',
      goal: 'signup',
      destination_url: 'https://example.com/signup?utm_content=us-vs-helio',
      variant: 'us-vs-helio-default',
      is_primary: true,
    },
    {
      piece: 'A short anatomy of a great launch week',
      label_text: 'Subscribe for launch recaps',
      goal: 'subscribe',
      destination_url: 'https://example.com/newsletter?utm_content=launch-week',
      variant: 'launch-week-default',
      is_primary: true,
    },
    {
      piece: 'Five anti-patterns we keep seeing in dashboards',
      label_text: 'Audit your dashboard',
      goal: 'demo',
      destination_url: 'https://example.com/audit?utm_content=anti-patterns',
      variant: 'anti-patterns-default',
      is_primary: true,
    },
    {
      piece: 'The marketing metrics dashboard we actually use',
      label_text: 'See the template',
      goal: 'read',
      destination_url: 'https://example.com/templates/metrics?utm_content=mkt-dash',
      variant: 'mkt-dash-default',
      is_primary: true,
    },
    {
      piece: 'Picking the right region — a 3-minute guide',
      label_text: 'Open docs',
      goal: 'read',
      destination_url: 'https://docs.example.com/regions?utm_content=region-guide',
      variant: 'region-guide-default',
      is_primary: true,
    },
    {
      piece: 'Customer story: Northwind cut report time from 3 days to 4 hours',
      label_text: 'Book a demo',
      goal: 'demo',
      destination_url: 'https://example.com/demo?utm_content=northwind',
      variant: 'northwind-default',
      is_primary: true,
    },
    {
      piece: 'How our SOC 2 program actually works (and where the report lives)',
      label_text: 'Book a security review',
      goal: 'demo',
      destination_url: 'https://example.com/security-review?utm_content=soc2',
      variant: 'soc2-default',
      is_primary: true,
    },
    {
      piece: 'What it actually costs to run our analytics stack',
      label_text: 'Get the cost calculator',
      goal: 'signup',
      destination_url: 'https://example.com/cost-calculator?utm_content=stack-cost',
      variant: 'stack-cost-default',
      is_primary: true,
    },
    {
      piece: 'Introducing the changelog RSS feed',
      label_text: 'Add the feed',
      goal: 'subscribe',
      destination_url: 'https://example.com/changelog.xml',
      variant: 'changelog-default',
      is_primary: true,
    },
    {
      piece: 'Weekly: Issue #42 — Two ways to think about region selection',
      label_text: 'Read the full guide',
      goal: 'read',
      destination_url: 'https://example.com/blog/choose-region',
      variant: 'newsletter-42-default',
      is_primary: true,
    },
    {
      piece: 'Weekly: Issue #43 — What we shipped this week',
      label_text: 'See the changelog',
      goal: 'read',
      destination_url: 'https://example.com/changelog',
      variant: 'newsletter-43-default',
      is_primary: true,
    },
    {
      piece: 'Why we kept the demo gate (and when we will drop it)',
      label_text: 'Start free trial',
      goal: 'signup',
      destination_url: 'https://example.com/signup?utm_content=demo-gate',
      variant: 'demo-gate-default',
      is_primary: true,
    },
    {
      piece: 'How we decide what makes the public roadmap',
      label_text: 'See the roadmap',
      goal: 'read',
      destination_url: 'https://example.com/roadmap?utm_content=criteria-post',
      variant: 'roadmap-default',
      is_primary: true,
    },
    {
      piece: 'Q3 2025 metrics: what worked, what didn\u2019t',
      label_text: 'Subscribe to Q4 recap',
      goal: 'subscribe',
      destination_url: 'https://example.com/newsletter?utm_content=q3-recap',
      variant: 'q3-default',
      is_primary: true,
    },
  ],
});

/** All seed datasets, loaded in dependency order. */
export const ContentSeedData = [
  competitors,
  channels,
  templates,
  signals,
  topics,
  pieces,
  publications,
  metrics,
  ctas,
];
