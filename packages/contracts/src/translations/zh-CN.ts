// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 简体中文 (zh-CN) — 合同应用翻译
 *
 * 对应 en.ts 的逐键翻译。若新增字段/视图/小部件，请同时在 en.ts 和此文件
 * 中维护，否则中文界面会回退到英文。
 */
export const zhCN: TranslationData = {
  objects: {
    contracts_contract: {
      label: '合同',
      pluralLabel: '合同',
      description:
        '与单一交易对手签署（或谈判中）的协议。在「文件」标签中上传签署版 PDF，然后调用 extract_terms 自动填充元数据。',
      fields: {
        title: { label: '标题' },
        contract_number: { label: '合同编号' },
        party: { label: '交易对手' },
        contract_type: {
          label: '类型',
          options: {
            nda: '保密协议 (NDA)',
            msa: '主服务协议 (MSA)',
            sow: '工作说明 (SOW)',
            dpa: '数据处理协议 (DPA)',
            vendor: '供应商 / 订阅',
            employment: '劳动合同',
            lease: '租赁',
            other: '其他',
          },
        },
        status: {
          label: '状态',
          options: {
            draft: '草稿',
            in_review: '审核中',
            signed: '已签署',
            active: '生效中',
            expired: '已到期',
            terminated: '已终止',
            cancelled: '已作废',
          },
        },
        owner: { label: '内部负责人' },
        total_value: { label: '合同金额' },
        currency: {
          label: '币种',
          options: { USD: '美元', EUR: '欧元', GBP: '英镑', CNY: '人民币', JPY: '日元' },
        },
        payment_terms: {
          label: '付款条件',
          options: {
            net_30: '30 天结算',
            net_45: '45 天结算',
            net_60: '60 天结算',
            net_90: '90 天结算',
            upfront: '预付',
            milestone: '按里程碑',
            other: '其他',
          },
        },
        effective_date: { label: '生效日期' },
        end_date: { label: '到期日期' },
        signed_date: { label: '签署日期' },
        auto_renew: { label: '自动续约' },
        renewal_notice_days: { label: '续约通知期 (天)' },
        renewal_decision: {
          label: '续约决定',
          options: {
            pending: '待定',
            renew: '续约',
            renegotiate: '重新谈判',
            terminate: '到期终止',
          },
        },
        renewal_decision_due: { label: '决定截止日' },
        is_expiring_soon: { label: '60 天内到期' },
        is_auto_renewing_soon: { label: '30 天内自动续约' },
        approval_required: { label: '需审批' },
        approver: { label: '审批人' },
        approved_at: { label: '审批时间' },
        extracted_clauses: { label: 'AI 抽取条款' },
        extraction_confidence: { label: '抽取置信度' },
        extracted_at: { label: '抽取时间' },
        tags: { label: '标签' },
        notes: { label: '内部备注' },
      },
      _views: {
        all_contracts: { label: '全部合同', description: '所有合同，按状态分组' },
        contract_pipeline: { label: '合同管道', description: '按状态分组的看板视图' },
        my_contracts: { label: '我负责的合同', description: '由我负责且尚未关闭的合同' },
        expiring_contracts: { label: '即将到期', description: '60 天内到期的生效合同' },
        pending_approval_contracts: { label: '待审批', description: '审核中等待审批的合同' },
      },
    },

    contracts_party: {
      label: '交易对手',
      pluralLabel: '交易对手',
      description: '在一个或多个合同中作为对方的法律主体。',
      fields: {
        legal_name: { label: '法定名称' },
        party_type: {
          label: '类型',
          options: {
            vendor: '供应商',
            customer: '客户',
            employee: '员工',
            landlord: '房东',
            partner: '合作伙伴',
            other: '其他',
          },
        },
        country: { label: '国家/地区' },
        website: { label: '官网' },
        primary_contact_name: { label: '主要联系人' },
        primary_contact_email: { label: '主要联系人邮箱' },
        notes: { label: '备注' },
      },
    },

    contracts_obligation: {
      label: '义务',
      pluralLabel: '义务',
      description: '挂接在合同上的、带到期日的承诺事项。',
      fields: {
        summary: { label: '摘要' },
        contract: { label: '所属合同' },
        obligor: {
          label: '责任方',
          options: { us: '我方', counterparty: '对方' },
        },
        kind: {
          label: '类型',
          options: {
            payment: '付款',
            deliverable: '交付物',
            report: '报告 / 披露',
            notice: '通知',
            other: '其他',
          },
        },
        status: {
          label: '状态',
          options: { open: '待办', done: '已完成', waived: '已豁免' },
        },
        due_date: { label: '到期日' },
        amount: { label: '金额' },
        assignee: { label: '负责人' },
        completed_at: { label: '完成时间' },
        is_overdue: { label: '是否逾期' },
        notes: { label: '备注' },
      },
      _views: {
        all_obligations: { label: '全部义务', description: '所有义务，按状态分组' },
        my_open_obligations: { label: '我的待办义务', description: '分配给我的待办义务' },
        overdue_obligations: { label: '逾期义务', description: '已过到期日的待办义务' },
      },
    },
  },

  apps: {
    contracts: {
      label: '合同管理',
      description: '基于 ObjectStack 的签后合同生命周期管理。',
      navigation: {
        nav_dashboard: { label: '续约风险' },
        nav_contract: { label: '合同' },
        nav_party: { label: '交易对手' },
        nav_obligation: { label: '义务' },
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
    'success.saved': '合同保存成功',
    'success.extracted': '已抽取合同条款并应用',
    'confirm.delete': '确定要删除此记录吗？',
    'confirm.reassign_owner': '是否将 {count} 份合同重新分配负责人？',
    'error.required': '此项为必填',
    'error.load_failed': '加载数据失败',
    'error.extraction_failed': 'AI 抽取失败 — 请查看日志',
  },

  validationMessages: {
    end_date_after_effective_date: '到期日不得早于生效日。',
    signed_requires_signed_date: '状态为「已签署」时必须填写签署日期。',
    payment_requires_amount: '付款类义务必须填写金额。',
  },

  dashboards: {
    renewals_at_risk_dashboard: {
      label: '续约风险',
      description: '即将到期的合同、近期签署的合同，以及生效合同的总金额敞口。',
      actions: {
        create_contract: { label: '新建合同' },
      },
      widgets: {
        expiring_60: { title: '60 天内到期', description: '到期日在 60 天内的生效合同' },
        auto_renewing_30: { title: '30 天内自动续约', description: '30 天内将自动续约的生效合同' },
        pending_approval: { title: '待审批', description: '审核中、金额超过审批阈值的合同' },
        active_total_value: { title: '生效合同总金额', description: '所有生效合同金额之和' },
        expiring_table: {
          title: '即将到期的合同 (60 天内)',
          description: '按到期日升序排列的生效合同',
        },
        pending_obligations: { title: '待办义务', description: '所有按到期日排序的待办义务' },
        signed_by_month: { title: '按月签约数（近 12 个月）' },
        exposure_by_counterparty: { title: '按交易对手的在效敞口' },
      },
    },
  },
};
