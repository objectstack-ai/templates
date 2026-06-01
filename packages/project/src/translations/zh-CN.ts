// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 中文翻译 - 项目管理模板。
 *
 * 结构遵循 `TranslationData`：字段标签放在 `objects.<obj>.fields.<field>`，
 * 复数标签使用 `pluralLabel`，应用外壳在 `apps.<app>` 下翻译。
 */
export const zhCN: TranslationData = {
  objects: {
    pm_project: {
      label: '项目',
      pluralLabel: '项目',
      fields: {
        code: { label: '项目编号' },
        name: { label: '项目名称' },
        description: { label: '描述' },
        status: { label: '状态' },
        priority: { label: '优先级' },
        health: { label: '健康度' },
        start_date: { label: '开始日期' },
        target_end_date: { label: '目标结束日期' },
        actual_end_date: { label: '实际结束日期' },
        progress_percent: { label: '进度 %' },
        ai_completion_probability: { label: 'AI 完成概率 %' },
        ai_delay_days: { label: 'AI 预测延期天数' },
        ai_risk_score: { label: 'AI 风险评分' },
        ai_budget_variance_percent: { label: 'AI 预算偏差 %' },
        ai_resource_bottleneck: { label: 'AI 资源瓶颈' },
        ai_recommended_action: { label: 'AI 推荐措施' },
        planned_budget: { label: '计划预算' },
        actual_cost: { label: '实际成本' },
        forecast_cost: { label: '预测成本' },
        project_manager: { label: '项目经理' },
        sponsor: { label: '发起人' },
        team_size: { label: '团队规模' },
      },
    },
    pm_milestone: {
      label: '里程碑',
      pluralLabel: '里程碑',
      fields: {
        name: { label: '里程碑名称' },
        description: { label: '描述' },
        project: { label: '所属项目' },
        status: { label: '状态' },
        due_date: { label: '截止日期' },
        completed_at: { label: '完成时间' },
        is_critical_path: { label: '关键路径' },
        deliverables: { label: '交付物' },
      },
    },
    pm_risk: {
      label: '风险',
      pluralLabel: '风险',
      fields: {
        risk_id: { label: '风险 ID' },
        name: { label: '风险名称' },
        description: { label: '描述' },
        project: { label: '所属项目' },
        category: { label: '类别' },
        status: { label: '状态' },
        impact: { label: '影响' },
        likelihood: { label: '可能性' },
        priority: { label: '优先级' },
        ai_impact_score: { label: 'AI 影响评分' },
        ai_likelihood: { label: 'AI 可能性' },
        ai_mitigation_suggestion: { label: 'AI 缓解建议' },
        ai_similar_risks: { label: 'AI 相似风险' },
        response_strategy: { label: '应对策略' },
        response_plan: { label: '应对计划' },
        response_owner: { label: '负责人' },
        response_cost: { label: '应对成本' },
      },
    },
    pm_issue: {
      label: '问题',
      pluralLabel: '问题',
      fields: {
        issue_number: { label: '问题编号' },
        name: { label: '问题名称' },
        description: { label: '描述' },
        project: { label: '所属项目' },
        type: { label: '类型' },
        status: { label: '状态' },
        priority: { label: '优先级' },
        reported_by: { label: '报告人' },
        assigned_to: { label: '分配给' },
        reported_at: { label: '报告时间' },
        resolved_at: { label: '解决时间' },
        resolution: { label: '解决方案' },
      },
    },
    pm_resource: { label: '资源', pluralLabel: '资源' },
    pm_timesheet: { label: '工时', pluralLabel: '工时' },
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
      },
    },
  },
};
