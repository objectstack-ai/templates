// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 简体中文 (zh-CN) — 采购应用翻译
 */
export const zhCN: TranslationData = {
  objects: {
    procurement_vendor: {
      label: '供应商',
      pluralLabel: '供应商',
      description: '向其下达采购订单的供应商主数据。',
      fields: {
        name: { label: '法定名称' },
        vendor_code: { label: '供应商编号' },
        category: {
          label: '类别',
          options: {
            saas: '软件 / SaaS', hardware: '硬件', services: '专业服务',
            marketing: '市场营销', facilities: '行政设施', other: '其他',
          },
        },
        status: {
          label: '状态',
          options: { active: '生效', onboarding: '入驻中', suspended: '已暂停', archived: '已归档' },
        },
        default_payment_terms: {
          label: '默认付款条款',
          options: { net_15: '15 天', net_30: '30 天', net_45: '45 天', net_60: '60 天', upfront: '预付' },
        },
        country: { label: '国家/地区' },
        website: { label: '网站' },
        primary_contact_name: { label: '主要联系人' },
        primary_contact_email: { label: '主要联系人邮箱' },
        notes: { label: '备注' },
      },
    },

    procurement_request: {
      label: '采购申请',
      pluralLabel: '采购申请',
      description: '员工的采购需求。批准后将转换为采购订单。',
      fields: {
        title: { label: '标题' },
        request_number: { label: '申请单号' },
        requester: { label: '申请人' },
        vendor: { label: '建议供应商' },
        category: { label: '类别' },
        status: {
          label: '状态',
          options: {
            draft: '草稿', submitted: '已提交', approved: '已批准',
            rejected: '已驳回', converted: '已转为订单',
          },
        },
        justification: { label: '业务理由' },
        estimated_amount: { label: '预估金额' },
        needed_by: { label: '需求日期' },
        cost_center: { label: '成本中心' },
        approval_required: { label: '需要审批' },
        converted_po: { label: '关联采购订单' },
        notes: { label: '内部备注' },
      },
      _views: {
        all_requests: { label: '全部申请' },
        request_pipeline: { label: '申请流水线' },
        my_requests: { label: '我的申请' },
        awaiting_approval: { label: '待审批' },
      },
    },

    procurement_order: {
      label: '采购订单',
      pluralLabel: '采购订单',
      description: '对供应商的正式承诺。来源于已批准的采购申请。',
      fields: {
        po_number: { label: '订单号' },
        vendor: { label: '供应商' },
        source_request: { label: '来源申请' },
        status: {
          label: '状态',
          options: {
            draft: '草稿', sent: '已发送', partial: '部分到货',
            received: '已收货', closed: '已关闭', cancelled: '已取消',
          },
        },
        owner: { label: '采购员' },
        total_amount: { label: '订单金额' },
        received_amount: { label: '已收货金额' },
        payment_terms: { label: '付款条款' },
        is_fully_received: { label: '已全部收货' },
        order_date: { label: '下单日期' },
        expected_delivery: { label: '预计到货' },
        actual_delivery: { label: '实际到货' },
        is_delivery_overdue: { label: '到货逾期' },
        lines: { label: '订单行' },
        notes: { label: '内部备注' },
      },
      _views: {
        all_orders: { label: '全部订单' },
        order_pipeline: { label: '订单流水线' },
        open_orders: { label: '在途订单' },
        overdue_orders: { label: '逾期订单' },
      },
    },

    procurement_receipt: {
      label: '收货单',
      pluralLabel: '收货单',
      description: '针对采购订单的一次收货记录。',
      fields: {
        receipt_number: { label: '收货单号' },
        purchase_order: { label: '采购订单' },
        received_at: { label: '收货时间' },
        received_by: { label: '收货人' },
        quality: {
          label: '检验结果',
          options: { accepted: '合格', partial: '部分合格', rejected: '不合格' },
        },
        received_value: { label: '收货金额' },
        notes: { label: '备注' },
      },
    },
  },

  apps: {
    procurement: {
      label: '采购',
      description: '基于 ObjectStack 的从申请到付款全流程采购管理。',
      navigation: {
        nav_dashboard: { label: '采购看板' },
        nav_request: { label: '采购申请' },
        nav_order: { label: '采购订单' },
        nav_receipt: { label: '收货单' },
        nav_vendor: { label: '供应商' },
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
    'success.po_created': '已根据采购申请创建采购订单',
    'error.required': '此字段必填',
  },

  validationMessages: {
    submitted_requires_amount: '提交的采购申请必须填写预估金额。',
    submitted_requires_justification: '提交的采购申请必须填写业务理由。',
    sent_requires_order_date: '已发送的采购订单必须有下单日期。',
    received_not_exceed_total: '收货金额不能超过订单金额。',
    rejected_has_zero_value: '不合格的收货单收货金额必须为 0。',
  },

  dashboards: {
    spend_at_a_glance_dashboard: {
      label: '采购看板',
      description: '在途采购订单、月度承诺、待审批申请。',
      actions: { create_request: { label: '新建采购申请' } },
      widgets: {
        awaiting_approval: { title: '待审批申请' },
        open_pos: { title: '在途采购订单' },
        overdue_pos: { title: '逾期到货' },
        open_commitment: { title: '在途承诺金额' },
        pending_requests_table: { title: '待审批申请' },
        open_pos_table: { title: '在途采购订单' },
      },
    },
  },
};
