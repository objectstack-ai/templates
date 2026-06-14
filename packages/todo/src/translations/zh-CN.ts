// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 简体中文 (zh-CN) — Todo App Translations
 *
 * Per-locale file: one file per language, following the `per_locale` convention.
 */
export const zhCN: TranslationData = {
  objects: {
    todo_task: {
      label: '任务',
      pluralLabel: '任务',
      description: '分配给具体人员的工作单元。',
      fields: {
        subject: { label: '主题' },
        description: { label: '描述' },
        status: {
          label: '状态',
          options: { todo: '待办', doing: '进行中', done: '已完成', cancelled: '已取消' },
        },
        priority: {
          label: '优先级',
          options: { low: '低', normal: '普通', high: '高', urgent: '紧急' },
        },
        assignee: { label: '负责人' },
        labels: { label: '标签' },
        due_date: { label: '截止日期' },
        started_at: { label: '开始时间' },
        completed_at: { label: '完成时间' },
        estimate_hours: { label: '预估工时（小时）' },
        is_overdue: { label: '是否逾期' },
      },
      _views: {
        all_tasks: { label: '全部任务', description: '所有任务，按状态分组' },
        task_board: { label: '任务看板', description: '按状态分组的看板视图' },
        my_open_tasks: { label: '我的待办', description: '分配给我且未完成的任务' },
        overdue_tasks: { label: '逾期任务', description: '已超过截止日期且仍未完成的任务' },
      },
    },

    todo_label: {
      label: '标签',
      pluralLabel: '标签',
      description: '用于对任务进行分类的颜色标签。',
      fields: {
        name: { label: '名称' },
        color: { label: '颜色' },
        description: { label: '描述' },
      },
    },
  },

  apps: {
    todo: {
      label: '待办',
      description: '轻量级任务跟踪应用。',
      navigation: {
        nav_dashboard: { label: '我的工作台' },
        nav_task: { label: '任务' },
        nav_label: { label: '标签' },
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
    'success.saved': '任务已保存',
    'success.assigned': '任务已分配',
    'confirm.delete': '确定删除这条记录吗？',
    'confirm.mark_done': '将 {count} 个任务标记为完成？',
    'confirm.reassign': '重新分配 {count} 个任务？',
    'error.required': '此项为必填',
    'error.load_failed': '数据加载失败',
  },

  validationMessages: {
    due_date_required_for_urgent: '紧急任务必须填写截止日期',
    estimate_non_negative: '预估工时不能为负数',
  },

  dashboards: {
    my_work_dashboard: {
      label: '我的工作台',
      description: '个人主页：进行中的任务、逾期项与本周完成趋势。',
      actions: {
        create_task: { label: '新建任务' },
      },
      widgets: {
        my_open_tasks: { title: '我的进行中任务', description: '分配给你的待办或进行中任务' },
        my_overdue: { title: '逾期', description: '已超过截止日期的进行中任务' },
        done_this_week: { title: '本周完成', description: '本周以来你完成的任务' },
      },
    },
  },
};
