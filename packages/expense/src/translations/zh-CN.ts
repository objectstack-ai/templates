// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 简体中文 (zh-CN) — 报销应用翻译
 */
export const zhCN: TranslationData = {
  objects: {
    expense_category: {
      label: '费用类别',
      pluralLabel: '费用类别',
      description: '用于费用明细的入账与统计的费用类型。',
      fields: {
        name: { label: '名称' },
        code: { label: '编码' },
        gl_account: { label: '总账科目' },
        per_txn_limit: { label: '单笔限额' },
        active: { label: '启用' },
        description: { label: '备注' },
      },
      _views: {
        all_categories: { label: '全部类别', description: '所有费用类别' },
      },
    },

    expense_report: {
      label: '报销单',
      pluralLabel: '报销单',
      description: '员工提交的报销申请，汇总多条费用明细。',
      fields: {
        title: { label: '标题' },
        report_number: { label: '单据编号' },
        requester: { label: '报销人' },
        purpose: { label: '事由' },
        status: {
          label: '状态',
          options: {
            draft: '草稿',
            submitted: '已提交',
            approved: '已批准',
            rejected: '已驳回',
            reimbursed: '已打款',
          },
        },
        period_start: { label: '起始日期' },
        period_end: { label: '截止日期' },
        cost_center: { label: '成本中心' },
        currency: {
          label: '币种',
          options: { usd: '美元', eur: '欧元', gbp: '英镑', cny: '人民币' },
        },
        total_amount: { label: '总金额' },
        approval_required: { label: '需要审批' },
        submitted_at: { label: '提交时间' },
        approved_at: { label: '批准时间' },
        reimbursed_at: { label: '打款时间' },
        payment_method: {
          label: '付款方式',
          options: { bank_transfer: '银行转账', payroll: '随薪发放', cash: '现金', check: '支票' },
        },
        payment_reference: { label: '付款凭证号' },
        notes: { label: '内部备注' },
      },
      _views: {
        all_reports: { label: '全部报销单', description: '按状态分组的所有报销单' },
        report_pipeline: { label: '报销看板', description: '按状态分组的看板' },
        my_reports: { label: '我的报销', description: '本人作为报销人的单据' },
        awaiting_approval: { label: '待审批', description: '已提交、等待处理的报销单' },
        awaiting_reimbursement: { label: '待打款', description: '已批准、等待付款的报销单' },
      },
    },

    expense_line: {
      label: '费用明细',
      pluralLabel: '费用明细',
      description: '报销单上的单条费用条目。',
      fields: {
        expense_report: { label: '报销单' },
        expense_date: { label: '日期' },
        category: { label: '类别' },
        description: { label: '说明' },
        merchant: { label: '商户' },
        amount: { label: '金额' },
        payment_source: {
          label: '支付方式',
          options: { personal_card: '个人卡', cash: '现金', personal_other: '个人 — 其他' },
        },
        needs_receipt: { label: '需要票据' },
        receipt_attached: { label: '已附票据' },
        notes: { label: '备注' },
      },
      _views: {
        all_lines: { label: '全部明细', description: '按类别分组的所有费用明细' },
      },
    },
  },

  apps: {
    expense: {
      label: '报销',
      description: '跑在 ObjectStack 上的员工费用报销。',
      navigation: {
        nav_dashboard: { label: '概览' },
        nav_report: { label: '报销单' },
        nav_line: { label: '费用明细' },
        nav_category: { label: '费用类别' },
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
    'success.saved': '保存成功',
    'success.submitted': '报销单已提交审批',
    'success.reimbursed': '报销单已标记为已打款',
    'error.required': '此字段为必填项',
  },

  validationMessages: {
    submitted_requires_amount: '提交的报销单至少要有一条费用明细（总金额大于 0）。',
    submitted_requires_purpose: '提交的报销单必须填写事由。',
    reimbursed_requires_method: '标记为已打款的报销单必须记录付款方式。',
    receipt_required_over_threshold: '金额达到 75 及以上的费用必须附上票据。',
  },

  dashboards: {
    expenses_overview_dashboard: {
      label: '费用概览',
      description: '待审批报销单、应付员工金额，以及支出趋势。',
      actions: { create_report: { label: '新建报销单' } },
      widgets: {
        awaiting_approval: { title: '待审批', description: '已提交、等待处理的报销单' },
        awaiting_reimbursement: { title: '待打款', description: '已批准、等待付款的报销单' },
        owed_amount: { title: '应付员工金额（$）', description: '已批准但未付款的报销单总额' },
        reimbursed_total: { title: '已打款（$）', description: '累计已打款金额' },
        pending_reports_table: { title: '待审批报销单', description: '按金额排序的已提交报销单' },
        to_reimburse_table: { title: '已批准 — 待打款', description: '已批准、等待付款的报销单' },
        spend_by_category: { title: '按类别支出', description: '按类别分组的明细金额' },
        spend_by_month: { title: '按月已打款', description: '近 12 个月的已打款金额' },
      },
    },
  },
};
