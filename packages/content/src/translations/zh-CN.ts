// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/** Simplified Chinese (zh-CN) — Content App Translations. */
export const zhCN: TranslationData = {
  objects: {
    content_competitor: {
      label: '竞品',
      pluralLabel: '竞品',
      description: '我们持续关注其内容产出的同类品牌。',
      fields: {
        name: { label: '名称' },
        category: {
          label: '类别',
          options: {
            direct: '直接竞品',
            indirect: '间接 / 关联',
            big_co: '大厂参考',
            creator: '独立创作者',
            analyst: '行业分析师',
          },
        },
        website: { label: '官网' },
        rss_feed: { label: 'RSS / Feed URL' },
        notes: { label: '备注' },
      },
      _views: {
        all_competitors: { label: '全部竞品', description: '我们跟踪的所有竞品' },
      },
    },

    content_channel: {
      label: '渠道',
      pluralLabel: '渠道',
      description: '发布载体——博客、Newsletter、播客、视频、社交、合作渠道。',
      fields: {
        name: { label: '名称' },
        kind: {
          label: '类型',
          options: {
            blog: '博客',
            newsletter: 'Newsletter',
            linkedin: 'LinkedIn',
            twitter_x: 'X (Twitter)',
            youtube: 'YouTube',
            podcast: '播客',
            other: '其他',
          },
        },
        base_url: { label: '入口 URL' },
        default_cta_goal: {
          label: '默认 CTA 目标',
          options: {
            signup: '注册',
            demo: '预约 Demo',
            subscribe: '订阅',
            read: '阅读更多',
            watch: '观看',
          },
        },
        color: { label: '展示色' },
        active: { label: '启用' },
      },
      _views: {
        all_channels: { label: '全部渠道', description: '所有发布载体' },
      },
    },

    content_template: {
      label: '模板',
      pluralLabel: '模板',
      description: '与内容形式绑定的可复用大纲。',
      fields: {
        name: { label: '名称' },
        kind: {
          label: '形式',
          options: {
            long_form: '长文',
            listicle: '清单文',
            case_study: '案例研究',
            newsletter: 'Newsletter',
            thread: '社交长推',
            video_script: '视频脚本',
          },
        },
        target_channel: { label: '目标渠道' },
        target_word_count: { label: '目标字数' },
        outline_markdown: { label: '大纲 (Markdown)' },
        description: { label: '描述' },
      },
      _views: {
        all_templates: { label: '全部模板', description: '可复用的内容骨架' },
      },
    },

    content_signal: {
      label: '信号',
      pluralLabel: '信号',
      description: '收件箱中的竞争与市场观察。',
      fields: {
        headline: { label: '标题' },
        source_kind: {
          label: '来源类型',
          options: {
            competitor_post: '竞品文章',
            customer_quote: '客户原话',
            search_trend: '搜索趋势',
            social_thread: '社交讨论',
            analyst: '分析师报告',
            other: '其他',
          },
        },
        competitor: { label: '竞品' },
        source_url: { label: '来源 URL' },
        captured_at: { label: '采集时间' },
        status: {
          label: '状态',
          options: { captured: '已采集', promoted: '已晋升', ignored: '已忽略' },
        },
        impact: {
          label: '影响度',
          options: { low: '低', medium: '中', high: '高', critical: '紧急' },
        },
        summary: { label: '摘要' },
        recommended_topic_title: { label: '建议选题标题' },
        promoted_at: { label: '晋升时间' },
        promoted_topic: { label: '晋升为选题' },
        notes: { label: '备注' },
      },
      _views: {
        all_signals: { label: '全部信号', description: '所有已采集的信号' },
        my_triage_queue: { label: '我的待处理', description: '等待你决策的已采集信号' },
        recently_promoted: { label: '近期已晋升', description: '过去 30 天内晋升的信号' },
      },
    },

    content_topic: {
      label: '选题',
      pluralLabel: '选题',
      description: '一条 backlog 想法,带 brief 与内容支柱,可衍生若干内容。',
      fields: {
        title: { label: '标题' },
        brief: { label: 'Brief' },
        pillar: {
          label: '内容支柱',
          options: {
            product_education: '产品教育',
            industry_insight: '行业洞察',
            customer_story: '客户故事',
            thought_leadership: '思想领导力',
            community: '社区 / DevRel',
          },
        },
        funnel_stage: {
          label: '漏斗阶段',
          options: { tofu: '认知 (TOFU)', mofu: '考虑 (MOFU)', bofu: '决策 (BOFU)' },
        },
        priority: {
          label: '优先级',
          options: { low: '低', normal: '中', high: '高' },
        },
        target_keyword: { label: '目标关键词' },
        visibility: {
          label: '可见性',
          options: { team: '团队', private: '私密' },
        },
        owner: { label: '负责人' },
        source_signal: { label: '来源信号' },
        tags: { label: '标签' },
      },
      _views: {
        all_topics: { label: '全部选题', description: '所有 backlog 中的选题' },
      },
    },

    content_piece: {
      label: '内容',
      pluralLabel: '内容',
      description: '一篇可交付物:文章、Newsletter、播客集、视频。',
      fields: {
        title: { label: '标题' },
        slug: { label: 'Slug' },
        topic: { label: '选题' },
        template: { label: '模板' },
        status: {
          label: '状态',
          options: {
            backlog: 'Backlog',
            drafting: '撰写中',
            in_review: '审核中',
            approved: '已通过',
            scheduled: '已排期',
            published: '已发布',
            archived: '已归档',
            cancelled: '已取消',
          },
        },
        format: {
          label: '形式',
          options: {
            long_form: '长文',
            listicle: '清单文',
            case_study: '案例研究',
            newsletter: 'Newsletter',
            thread: '社交长推',
            video_script: '视频脚本',
          },
        },
        assignee: { label: '执行人' },
        editor: { label: '编辑' },
        target_channels: { label: '目标渠道' },
        publish_at: { label: '发布时间' },
        word_count_target: { label: '目标字数' },
        summary: { label: '摘要' },
        body_outline: { label: '大纲' },
        body_draft: { label: '草稿' },
        submitted_at: { label: '提交时间' },
        approved_at: { label: '通过时间' },
        published_at: { label: '发布时间' },
        archived_at: { label: '归档时间' },
        total_views: { label: '累计浏览' },
        total_clicks: { label: '累计点击' },
        total_signups: { label: '累计注册' },
        total_revenue: { label: '累计收入' },
        is_overdue: { label: '已逾期?' },
        is_top_performer: { label: '热门?' },
        tags: { label: '标签' },
      },
      _views: {
        all_pieces: { label: '全部内容', description: '所有内容,按状态分组' },
        piece_board: { label: '管道', description: '按状态分组的看板' },
        my_drafts: { label: '我的草稿', description: '分配给你且尚未进入审核的内容' },
        in_review_queue: { label: '审核中', description: '等待编辑通过的内容' },
        editorial_calendar: { label: '日历', description: '按发布日展示的内容' },
        scheduled_pieces: { label: '已排期', description: '已通过且有排期时间的内容' },
        published_pieces: { label: '近 30 天已发布', description: '过去 30 天内发布的内容' },
        top_performers: { label: '热门内容', description: '按总浏览排序的已发布内容' },
      },
    },

    content_publication: {
      label: '发布记录',
      pluralLabel: '发布记录',
      description: '一篇内容 × 一个渠道——实际在哪里、什么时候发出。',
      fields: {
        piece: { label: '内容' },
        channel: { label: '渠道' },
        public_url: { label: '公开 URL' },
        published_at: { label: '发布时间' },
        external_id: { label: '外部 ID' },
        total_views: { label: '累计浏览' },
        total_clicks: { label: '累计点击' },
        total_signups: { label: '累计注册' },
        total_revenue: { label: '累计收入' },
        last_metric_at: { label: '最近度量时间' },
        notes: { label: '备注' },
      },
      _views: {
        all_publications: { label: '全部发布', description: '所有发布记录,最新在前' },
        this_week_publications: { label: '本周', description: '本周内的发布记录' },
        by_channel_publications: { label: '按渠道', description: '按渠道分组的发布记录' },
      },
    },

    content_metric: {
      label: '度量快照',
      pluralLabel: '度量快照',
      description: '某一时间段、某条发布记录的表现数值快照。',
      fields: {
        publication: { label: '发布记录' },
        period_start: { label: '周期开始' },
        period_end: { label: '周期结束' },
        views: { label: '浏览' },
        clicks: { label: '点击' },
        signups: { label: '注册' },
        revenue: { label: '归因收入' },
        source: {
          label: '来源',
          options: {
            analytics: '分析平台',
            product: '产品后台',
            revenue: '收入系统',
            native: '渠道原生',
            manual: '手动录入',
          },
        },
        note: { label: '备注' },
      },
    },

    content_cta: {
      label: 'CTA',
      pluralLabel: 'CTA',
      description: '内容上的一种 CTA 变体。',
      fields: {
        piece: { label: '内容' },
        label_text: { label: '按钮文案' },
        goal: {
          label: '目标',
          options: {
            signup: '注册',
            demo: '预约 Demo',
            subscribe: '订阅',
            read: '阅读更多',
            watch: '观看',
          },
        },
        destination_url: { label: '落地 URL' },
        variant: { label: '变体标记' },
        is_primary: { label: '主 CTA' },
      },
    },
  },

  apps: {
    content: {
      label: '内容运营',
      description: 'ObjectStack 上的内容营销引擎。',
      navigation: {
        nav_today: { label: '今日工作台' },
        nav_calendar: { label: '编辑日历' },
        nav_roi: { label: '渠道 ROI' },
        nav_piece: { label: '内容' },
        nav_topic: { label: '选题' },
        nav_signal: { label: '信号' },
        nav_publication: { label: '发布记录' },
        nav_competitor: { label: '竞品' },
        nav_channel: { label: '渠道' },
        nav_template: { label: '模板' },
      },
    },
  },

  messages: {
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.create': '新建',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.export': '导出',
    'common.back': '返回',
    'common.confirm': '确认',
    'success.saved': '内容已保存',
    'success.published': '内容已发布',
    'success.promoted': '信号已晋升为选题',
    'success.summarized': '信号已生成摘要',
    'success.outline_drafted': '大纲已生成',
    'success.cta_suggested': '已推荐 CTA 变体',
    'success.metric_recorded': '度量快照已记录',
    'confirm.delete': '确定删除该记录吗?',
    'confirm.publish_now': '现在将「{title}」发布到 {channel_count} 个渠道?',
    'error.required': '该字段为必填项',
    'error.load_failed': '数据加载失败',
    'error.publish_failed': '发布失败 — 请查看日志',
    'error.ai_failed': 'AI 调用失败 — 请查看日志',
  },

  validationMessages: {
    scheduled_requires_publish_at: '状态「已排期」需要填写发布时间。',
    in_review_requires_assignee: '状态「审核中」需要执行人。',
    metric_period_order: '周期结束时间不能早于周期开始时间。',
  },

  dashboards: {
    today_workbench_dashboard: {
      label: '今日工作台',
      description: '每位作者的入口:你欠的、与等你的。',
      actions: {
        new_piece: { label: '新建内容' },
        capture_signal: { label: '记录信号' },
      },
      widgets: {
        my_drafts_in_flight: { title: '我的进行中草稿', description: '分配给你的撰写中内容' },
        my_pieces_in_review: { title: '我的审核中内容', description: '你已提交并处于审核中的内容' },
        scheduled_this_week: { title: '本周即将发布', description: '发布日在本周内的已排期内容' },
        published_last_7d: { title: '近 7 天已发布', description: '过去 7 天内发布的内容' },
        my_pieces_table: { title: '近期我的内容', description: '你进行中的内容,按最近活动排序' },
        signals_to_triage: { title: '待处理信号', description: '尚未晋升或忽略的已采集信号' },
      },
    },
    editorial_calendar_dashboard: {
      label: '编辑日历',
      description: 'Lead 视角:本周 / 本月的空档、撞期、待审。',
      actions: {
        new_piece: { label: '新建内容' },
      },
      widgets: {
        pieces_scheduled: { title: '已排期', description: '状态为已排期的内容' },
        pieces_in_review: { title: '待审核', description: '审核中的内容' },
        pieces_published_30d: { title: '近 30 天已发布', description: '过去 30 天内发布的内容' },
        pieces_overdue: { title: '已逾期', description: '发布时间已过但尚未发布的内容' },
        calendar_main: { title: '即将发布的内容', description: '发布时间在未来 30 天内的内容' },
        publications_by_channel: {
          title: '渠道分布(近期)',
          description: '按渠道统计的近期发布记录',
        },
      },
    },
    roi_by_channel_dashboard: {
      label: '渠道 ROI',
      description: '高管视角:每条渠道的内容投入回报。',
      actions: {},
      widgets: {
        total_views_90d: { title: '累计浏览', description: '所有发布渠道的浏览总和' },
        total_clicks_90d: { title: '累计点击', description: '所有发布渠道的点击总和' },
        total_signups_90d: { title: '累计注册', description: '所有发布渠道的注册总和' },
        total_revenue_90d: { title: '累计收入', description: '所有发布渠道的归因收入总和' },
        views_by_channel_bar: { title: '各渠道浏览', description: '按渠道汇总的浏览数' },
        signups_trend: { title: '注册趋势(近 90 天)', description: '每日注册数,近 90 天' },
        top_publications: {
          title: 'Top 发布(近 90 天)',
          description: '近 90 天收入最高的发布记录',
        },
      },
    },
  },
};
