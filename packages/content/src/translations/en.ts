// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * English (en) — Content App Translations.
 * Per-locale file. Covers all 9 objects, view labels, dashboard
 * widgets, navigation, and common UI messages.
 */
export const en: TranslationData = {
  objects: {
    content_competitor: {
      label: 'Competitor',
      pluralLabel: 'Competitors',
      description: 'A peer brand whose content output we monitor.',
      fields: {
        name: { label: 'Name' },
        category: {
          label: 'Category',
          options: {
            direct: 'Direct Competitor',
            indirect: 'Indirect / Adjacent',
            big_co: 'Big-Co Reference',
            creator: 'Creator / Newsletter',
            analyst: 'Industry Analyst',
          },
        },
        website: { label: 'Website' },
        rss_feed: { label: 'RSS / Feed URL' },
        notes: { label: 'Notes' },
      },
      _views: {
        all_competitors: { label: 'All Competitors', description: 'Every competitor we track' },
      },
    },

    content_channel: {
      label: 'Channel',
      pluralLabel: 'Channels',
      description: 'A publication surface — blog, newsletter, podcast, video, social, partner.',
      fields: {
        name: { label: 'Name' },
        kind: {
          label: 'Kind',
          options: {
            blog: 'Blog',
            newsletter: 'Newsletter',
            linkedin: 'LinkedIn',
            twitter_x: 'X (Twitter)',
            youtube: 'YouTube',
            podcast: 'Podcast',
            other: 'Other',
          },
        },
        base_url: { label: 'Base URL' },
        default_cta_goal: {
          label: 'Default CTA Goal',
          options: {
            signup: 'Sign up',
            demo: 'Book demo',
            subscribe: 'Subscribe',
            read: 'Read more',
            watch: 'Watch',
          },
        },
        color: { label: 'Display Color' },
        active: { label: 'Active' },
      },
      _views: {
        all_channels: { label: 'All Channels', description: 'All publication surfaces' },
      },
    },

    content_template: {
      label: 'Template',
      pluralLabel: 'Templates',
      description: 'A reusable outline skeleton tied to a content format.',
      fields: {
        name: { label: 'Name' },
        kind: {
          label: 'Format',
          options: {
            long_form: 'Long-form Article',
            listicle: 'Listicle',
            case_study: 'Case Study',
            newsletter: 'Newsletter Issue',
            thread: 'Social Thread',
            video_script: 'Video Script',
          },
        },
        target_channel: { label: 'Target Channel' },
        target_word_count: { label: 'Target Word Count' },
        outline_markdown: { label: 'Outline (Markdown)' },
        description: { label: 'Description' },
      },
      _views: {
        all_templates: { label: 'All Templates', description: 'Reusable content skeletons' },
      },
    },

    content_signal: {
      label: 'Signal',
      pluralLabel: 'Signals',
      description: 'A captured competitive / market observation in the inbox.',
      fields: {
        headline: { label: 'Headline' },
        source_kind: {
          label: 'Source',
          options: {
            competitor_post: 'Competitor Post',
            customer_quote: 'Customer Quote',
            search_trend: 'Search Trend',
            social_thread: 'Social Thread',
            analyst: 'Analyst Report',
            other: 'Other',
          },
        },
        competitor: { label: 'Competitor' },
        source_url: { label: 'Source URL' },
        captured_at: { label: 'Captured At' },
        status: {
          label: 'Status',
          options: { captured: 'Captured', promoted: 'Promoted', ignored: 'Ignored' },
        },
        impact: {
          label: 'Impact',
          options: { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' },
        },
        summary: { label: 'Summary' },
        recommended_topic_title: { label: 'Recommended Topic Title' },
        promoted_at: { label: 'Promoted At' },
        promoted_topic: { label: 'Promoted Into Topic' },
        notes: { label: 'Notes' },
      },
      _views: {
        all_signals: { label: 'All Signals', description: 'Every captured signal' },
        my_triage_queue: {
          label: 'My Triage',
          description: 'Captured signals awaiting your decision',
        },
        recently_promoted: {
          label: 'Recently Promoted',
          description: 'Signals promoted in the last 30 days',
        },
      },
    },

    content_topic: {
      label: 'Topic',
      pluralLabel: 'Topics',
      description: 'A backlog idea: brief + pillar, becomes one or more pieces.',
      fields: {
        title: { label: 'Title' },
        brief: { label: 'Brief' },
        pillar: {
          label: 'Content Pillar',
          options: {
            product_education: 'Product Education',
            industry_insight: 'Industry Insight',
            customer_story: 'Customer Story',
            thought_leadership: 'Thought Leadership',
            community: 'Community / DevRel',
          },
        },
        funnel_stage: {
          label: 'Funnel Stage',
          options: {
            tofu: 'Awareness (TOFU)',
            mofu: 'Consideration (MOFU)',
            bofu: 'Decision (BOFU)',
          },
        },
        priority: {
          label: 'Priority',
          options: { low: 'Low', normal: 'Normal', high: 'High' },
        },
        target_keyword: { label: 'Target Keyword' },
        visibility: {
          label: 'Visibility',
          options: { team: 'Team', private: 'Private' },
        },
        owner: { label: 'Owner' },
        source_signal: { label: 'Source Signal' },
        tags: { label: 'Tags' },
      },
      _views: {
        all_topics: { label: 'All Topics', description: 'Every topic in the backlog' },
      },
    },

    content_piece: {
      label: 'Piece',
      pluralLabel: 'Pieces',
      description: 'A single deliverable: article, newsletter issue, episode, video.',
      fields: {
        title: { label: 'Title' },
        slug: { label: 'Slug' },
        topic: { label: 'Topic' },
        template: { label: 'Template' },
        status: {
          label: 'Status',
          options: {
            backlog: 'Backlog',
            drafting: 'Drafting',
            in_review: 'In Review',
            approved: 'Approved',
            scheduled: 'Scheduled',
            published: 'Published',
            archived: 'Archived',
            cancelled: 'Cancelled',
          },
        },
        format: {
          label: 'Format',
          options: {
            long_form: 'Long-form Article',
            listicle: 'Listicle',
            case_study: 'Case Study',
            newsletter: 'Newsletter Issue',
            thread: 'Social Thread',
            video_script: 'Video Script',
          },
        },
        assignee: { label: 'Writer' },
        editor: { label: 'Editor' },
        target_channels: { label: 'Target Channels' },
        publish_at: { label: 'Publish At' },
        word_count_target: { label: 'Word Count Target' },
        summary: { label: 'Summary' },
        body_outline: { label: 'Outline' },
        body_draft: { label: 'Draft' },
        seo_title: { label: 'SEO Title' },
        meta_description: { label: 'Meta Description' },
        primary_keyword: { label: 'Primary Keyword' },
        submitted_at: { label: 'Submitted At' },
        approved_at: { label: 'Approved At' },
        published_at: { label: 'Published At' },
        archived_at: { label: 'Archived At' },
        total_views: { label: 'Total Views' },
        total_clicks: { label: 'Total Clicks' },
        total_signups: { label: 'Total Signups' },
        total_revenue: { label: 'Total Revenue' },
        is_overdue: { label: 'Overdue?' },
        is_top_performer: { label: 'Top Performer?' },
        tags: { label: 'Tags' },
      },
      _views: {
        all_pieces: { label: 'All Pieces', description: 'Every piece grouped by status' },
        piece_board: { label: 'Pipeline', description: 'Kanban grouped by status' },
        my_drafts: {
          label: 'My Drafts',
          description: 'Pieces assigned to you and not yet in review',
        },
        in_review_queue: { label: 'In Review', description: 'Pieces awaiting editorial sign-off' },
        editorial_calendar: { label: 'Calendar', description: 'Pieces by publish date' },
        scheduled_pieces: {
          label: 'Scheduled',
          description: 'Approved pieces with a scheduled time',
        },
        published_pieces: {
          label: 'Published (30d)',
          description: 'Pieces that went live in the last 30 days',
        },
        top_performers: {
          label: 'Top Performers',
          description: 'Published pieces sorted by total views',
        },
      },
    },

    content_publication: {
      label: 'Publication',
      pluralLabel: 'Publications',
      description: 'One piece × one channel — when and where it actually went out.',
      fields: {
        piece: { label: 'Piece' },
        channel: { label: 'Channel' },
        public_url: { label: 'Public URL' },
        published_at: { label: 'Published At' },
        external_id: { label: 'External ID' },
        total_views: { label: 'Total Views' },
        total_clicks: { label: 'Total Clicks' },
        total_signups: { label: 'Total Signups' },
        total_revenue: { label: 'Total Revenue' },
        last_metric_at: { label: 'Last Metric At' },
        notes: { label: 'Notes' },
      },
      _views: {
        all_publications: {
          label: 'All Publications',
          description: 'Every publication, latest first',
        },
        this_week_publications: {
          label: 'This Week',
          description: 'Publications in the current week',
        },
        by_channel_publications: {
          label: 'By Channel',
          description: 'Publications grouped by channel',
        },
      },
    },

    content_metric: {
      label: 'Metric Snapshot',
      pluralLabel: 'Metric Snapshots',
      description: 'A point-in-time row of performance numbers for one publication.',
      fields: {
        publication: { label: 'Publication' },
        period_start: { label: 'Period Start' },
        period_end: { label: 'Period End' },
        views: { label: 'Views' },
        clicks: { label: 'Clicks' },
        signups: { label: 'Signups' },
        revenue: { label: 'Attributed Revenue' },
        source: {
          label: 'Source',
          options: {
            analytics: 'Analytics',
            product: 'Product',
            revenue: 'Revenue',
            native: 'Native Platform',
            manual: 'Manual Entry',
          },
        },
        note: { label: 'Note' },
      },
    },

    content_cta: {
      label: 'CTA',
      pluralLabel: 'CTAs',
      description: 'A call-to-action variant on a content piece.',
      fields: {
        piece: { label: 'Piece' },
        label_text: { label: 'Button Copy' },
        goal: {
          label: 'Goal',
          options: {
            signup: 'Sign up',
            demo: 'Book demo',
            subscribe: 'Subscribe',
            read: 'Read more',
            watch: 'Watch',
          },
        },
        destination_url: { label: 'Destination URL' },
        variant: { label: 'Variant Tag' },
        is_primary: { label: 'Primary' },
      },
    },
  },

  apps: {
    content: {
      label: 'Content',
      description: 'Content marketing engine on ObjectStack.',
      navigation: {
        nav_today: { label: "Today's Workbench" },
        nav_calendar: { label: 'Editorial Calendar' },
        nav_roi: { label: 'ROI by Channel' },
        nav_piece: { label: 'Pieces' },
        nav_topic: { label: 'Topics' },
        nav_signal: { label: 'Signals' },
        nav_publication: { label: 'Publications' },
        nav_competitor: { label: 'Competitors' },
        nav_channel: { label: 'Channels' },
        nav_template: { label: 'Templates' },
      },
    },
  },

  messages: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.back': 'Back',
    'common.confirm': 'Confirm',
    'success.saved': 'Piece saved',
    'success.published': 'Piece published',
    'success.promoted': 'Signal promoted to topic',
    'success.summarized': 'Signal summarised',
    'success.outline_drafted': 'Outline drafted',
    'success.cta_suggested': 'CTA variants suggested',
    'success.metric_recorded': 'Metric snapshot recorded',
    'confirm.delete': 'Delete this record?',
    'confirm.publish_now': 'Publish "{title}" to {channel_count} channel(s) now?',
    'error.required': 'This field is required',
    'error.load_failed': 'Failed to load data',
    'error.publish_failed': 'Publish failed — see logs',
    'error.ai_failed': 'AI request failed — see logs',
  },

  validationMessages: {
    scheduled_requires_publish_at: 'Status "scheduled" requires a Publish At timestamp.',
    in_review_requires_assignee: 'Status "in review" requires an assignee.',
    metric_period_order: 'period_end must be on or after period_start.',
  },

  dashboards: {
    today_workbench_dashboard: {
      label: "Today's Workbench",
      description: 'Per-contributor landing: what you owe and what is waiting on you.',
      actions: {
        new_piece: { label: 'New Piece' },
        capture_signal: { label: 'Capture Signal' },
      },
      widgets: {
        my_drafts_in_flight: {
          title: 'My Drafts In Flight',
          description: 'Pieces assigned to you in drafting status',
        },
        my_pieces_in_review: {
          title: 'My Pieces In Review',
          description: 'Pieces you submitted that are in review',
        },
        scheduled_this_week: {
          title: 'Publishing This Week',
          description: 'Scheduled pieces with publish date this week',
        },
        published_last_7d: {
          title: 'Published (Last 7d)',
          description: 'Pieces published in the last 7 days',
        },
        my_pieces_table: {
          title: 'My Recent Pieces',
          description: 'Your in-flight pieces, latest activity first',
        },
        signals_to_triage: {
          title: 'Signals to Triage',
          description: 'Captured signals not yet promoted or ignored',
        },
      },
    },
    editorial_calendar_dashboard: {
      label: 'Editorial Calendar',
      description: 'Lead view of the week / month ahead: gaps, overlaps, approvals waiting.',
      actions: {
        new_piece: { label: 'New Piece' },
      },
      widgets: {
        pieces_scheduled: { title: 'Scheduled', description: 'Pieces in scheduled status' },
        pieces_in_review: { title: 'Awaiting Review', description: 'Pieces in review' },
        pieces_published_30d: {
          title: 'Published (30d)',
          description: 'Pieces published in the last 30 days',
        },
        pieces_overdue: {
          title: 'Overdue',
          description: 'Pieces where publish_at has passed without going live',
        },
        calendar_main: {
          title: 'Upcoming Pieces',
          description: 'Pieces with publish_at in the next 30 days',
        },
        publications_by_channel: {
          title: 'Channel Mix (Recent)',
          description: 'Distribution of recent publications by channel',
        },
      },
    },
    roi_by_channel_dashboard: {
      label: 'ROI by Channel',
      description: 'Exec view of return on content investment per channel.',
      actions: {},
      widgets: {
        total_views_90d: {
          title: 'Total Views',
          description: 'Sum of total_views across all publications',
        },
        total_clicks_90d: {
          title: 'Total Clicks',
          description: 'Sum of total_clicks across all publications',
        },
        total_signups_90d: {
          title: 'Total Signups',
          description: 'Sum of total_signups across all publications',
        },
        total_revenue_90d: {
          title: 'Attributed Revenue',
          description: 'Sum of attributed_revenue across all publications',
        },
        views_by_channel_bar: {
          title: 'Views by Channel',
          description: 'Per-channel sum of views across recent publications',
        },
        signups_trend: { title: 'Signups Trend (90d)', description: 'Daily signups, last 90 days' },
        top_publications: {
          title: 'Top Publications (90d)',
          description: 'Highest-revenue publications in the last 90 days',
        },
      },
    },
  },
};
