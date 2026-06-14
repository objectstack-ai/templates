// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 中文翻译 - AI 项目管理模板。
 *
 * 结构遵循 `TranslationData`：每个对象的 label/pluralLabel/description，
 * 字段标签与下拉选项位于 `objects.<obj>.fields.<field>`，列表视图标签位于
 * `objects.<obj>._views.<view>`，应用外壳位于 `apps.pm`。字段名与
 * `*.object.ts` 定义完全一致。
 */
export const zhCN: TranslationData = {
  objects: {
    pm_project: {
      label: '项目',
      pluralLabel: '项目',
      description: '有明确周期的项目，包含里程碑、资源与 AI 风险预测。',
      fields: {
        code: { label: '项目编号' },
        name: { label: '项目名称' },
        description: { label: '描述' },
        status: {
          label: '状态',
          options: {
            planning: '规划中',
            active: '进行中',
            at_risk: '存在风险',
            on_hold: '已暂停',
            completed: '已完成',
            cancelled: '已取消',
          },
        },
        priority: {
          label: '优先级',
          options: { low: '低', medium: '中', high: '高', critical: '紧急' },
        },
        project_type: {
          label: '类型',
          options: { internal: '内部', client: '客户', rnd: '研发', maintenance: '维护' },
        },
        health: {
          label: '健康度',
          options: { on_track: '正常', at_risk: '存在风险', off_track: '偏离轨道' },
        },
        start_date: { label: '开始日期' },
        planned_end_date: { label: '计划结束日期' },
        actual_end_date: { label: '实际结束日期' },
        ai_completion_probability: { label: 'AI 完成概率' },
        ai_delay_days: { label: 'AI 预测延期（天）' },
        ai_risk_score: { label: 'AI 风险评分' },
        ai_budget_variance_forecast: { label: 'AI 预算偏差 %' },
        ai_resource_bottleneck: { label: 'AI 资源瓶颈' },
        ai_recommended_action: { label: 'AI 推荐措施' },
        ai_last_prediction_at: { label: '最近一次 AI 预测' },
        planned_budget: { label: '计划预算' },
        actual_cost: { label: '实际成本' },
        project_manager: { label: '项目经理' },
        sponsor: { label: '发起人' },
        progress_percent: { label: '进度 %' },
      },
      _views: { all_projects: { label: '全部项目' } },
    },
    pm_milestone: {
      label: '里程碑',
      pluralLabel: '里程碑',
      description: '项目时间线上的关键交付点或决策节点。',
      fields: {
        name: { label: '里程碑名称' },
        description: { label: '描述' },
        project: { label: '所属项目' },
        status: {
          label: '状态',
          options: {
            not_started: '未开始',
            in_progress: '进行中',
            completed: '已完成',
            missed: '已错过',
          },
        },
        planned_date: { label: '计划日期' },
        actual_date: { label: '实际日期' },
        owner: { label: '负责人' },
        is_critical_path: { label: '关键路径' },
        deliverables: { label: '交付物' },
      },
      _views: { all_milestones: { label: '全部里程碑' } },
    },
    pm_risk: {
      label: '风险',
      pluralLabel: '风险',
      description: '可能影响项目交付的潜在威胁或不确定性。',
      fields: {
        risk_id: { label: '风险编号' },
        name: { label: '风险名称' },
        description: { label: '描述' },
        project: { label: '所属项目' },
        status: {
          label: '状态',
          options: {
            identified: '已识别',
            assessing: '评估中',
            mitigating: '缓解中',
            monitoring: '监控中',
            closed: '已关闭',
            realized: '已发生',
          },
        },
        category: {
          label: '类别',
          options: {
            technical: '技术',
            resource: '资源',
            schedule: '进度',
            budget: '预算',
            external: '外部',
            scope: '范围',
          },
        },
        impact: {
          label: '影响（人工）',
          options: { very_low: '极低', low: '低', medium: '中', high: '高', very_high: '极高' },
        },
        likelihood: {
          label: '可能性（人工）',
          options: { very_low: '极低', low: '低', medium: '中', high: '高', very_high: '极高' },
        },
        priority: { label: '风险优先级（影响 × 可能性）' },
        ai_impact_score: { label: 'AI 影响评分' },
        ai_likelihood: { label: 'AI 可能性' },
        ai_mitigation_suggestion: { label: 'AI 缓解建议' },
        ai_similar_risks: { label: 'AI 相似历史风险' },
        response_strategy: {
          label: '应对策略',
          options: { avoid: '规避', mitigate: '缓解', transfer: '转移', accept: '接受' },
        },
        mitigation_plan: { label: '缓解计划' },
        contingency_plan: { label: '应急计划' },
        owner: { label: '风险负责人' },
      },
      _views: { all_risks: { label: '全部风险' } },
    },
    pm_issue: {
      label: '问题',
      pluralLabel: '问题',
      description: '当前需要解决的问题。',
      fields: {
        issue_number: { label: '问题编号' },
        name: { label: '问题标题' },
        description: { label: '描述' },
        project: { label: '所属项目' },
        type: {
          label: '类型',
          options: { bug: '缺陷', blocker: '阻塞', task: '任务', question: '疑问', other: '其他' },
        },
        status: {
          label: '状态',
          options: {
            open: '待处理',
            in_progress: '处理中',
            blocked: '受阻',
            resolved: '已解决',
            closed: '已关闭',
          },
        },
        severity: {
          label: '严重程度',
          options: { low: '低', medium: '中', high: '高', critical: '紧急' },
        },
        assigned_to: { label: '分配给' },
        related_risk: { label: '关联风险' },
        resolution: { label: '解决方案' },
        reported_at: { label: '报告时间' },
        resolved_at: { label: '解决时间' },
      },
      _views: { all_issues: { label: '全部问题' } },
    },
    pm_resource: {
      label: '资源',
      pluralLabel: '资源',
      description: '分配给项目的团队成员或预算。',
      fields: {
        project: { label: '所属项目' },
        person: { label: '成员' },
        role: { label: '角色' },
        allocated_hours_per_week: { label: '每周分配工时' },
        start_date: { label: '分配开始' },
        end_date: { label: '分配结束' },
      },
    },
    pm_timesheet: {
      label: '工时',
      pluralLabel: '工时',
      description: '项目的每日工时记录。',
      fields: {
        project: { label: '所属项目' },
        person: { label: '成员' },
        work_date: { label: '工作日期' },
        hours: { label: '工时' },
        description: { label: '描述' },
        billable: { label: '可计费' },
      },
    },
  },

  apps: {
    pm: {
      label: 'AI 项目管理',
      description: '项目组合管理 —— AI 风险预测、延期预测与资源冲突检测。',
      navigation: {
        nav_projects: { label: '项目' },
        nav_milestones: { label: '里程碑' },
        nav_risks: { label: '风险' },
        nav_issues: { label: '问题' },
        nav_resources: { label: '资源' },
        nav_timesheets: { label: '工时' },
        nav_pmo_overview: { label: 'PMO 总览' },
        nav_pm_workbench: { label: '项目经理工作台' },
      },
    },
  },
};
