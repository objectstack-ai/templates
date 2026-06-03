// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 简体中文 (zh-CN) — 合规应用翻译
 */
export const zhCN: TranslationData = {
  objects: {
    compliance_framework: {
      label: '合规框架',
      pluralLabel: '合规框架',
      description: '正在认证或贯标的合规标准。',
      fields: {
        short_name: { label: '简称' },
        full_name: { label: '全称' },
        family: {
          label: '类别',
          options: {
            soc2: 'SOC 2',
            iso27001: 'ISO 27001 / 27002',
            hipaa: 'HIPAA',
            gdpr: 'GDPR',
            pci: 'PCI DSS',
            nist_csf: 'NIST CSF',
            custom: '自定义',
          },
        },
        version: { label: '版本' },
        status: {
          label: '状态',
          options: { active: '生效', adopted: '已采用', retired: '已退役' },
        },
        next_audit_date: { label: '下次审计日期' },
        auditor: { label: '外部审计方' },
        description: { label: '描述' },
      },
    },

    compliance_control: {
      label: '控制项',
      pluralLabel: '控制项',
      description: '单个控制要求，需要佐证材料并定期评估。',
      fields: {
        code: { label: '控制项编号' },
        title: { label: '标题' },
        framework: { label: '所属框架' },
        category: {
          label: '分类',
          options: {
            access: '访问控制',
            change: '变更管理',
            risk: '风险管理',
            vendor: '供应商管理',
            incident: '事件响应',
            data: '数据保护',
            physical: '物理安全',
            other: '其他',
          },
        },
        criticality: { label: '重要等级', options: { high: '高', medium: '中', low: '低' } },
        last_status: {
          label: '最近测试结果',
          options: { not_tested: '未测试', passed: '通过', partial: '部分通过', failed: '未通过' },
        },
        description: { label: '描述' },
        owner: { label: '控制项负责人' },
        review_frequency_days: { label: '复评频率（天）' },
        last_assessed_at: { label: '最近评估时间' },
        is_overdue_for_review: { label: '复评逾期' },
        notes: { label: '备注' },
      },
      _views: {
        all_controls: { label: '全部控制项' },
        control_board: { label: '控制项看板' },
        my_controls: { label: '我的控制项' },
        failing_controls: { label: '未通过控制项' },
        overdue_controls: { label: '复评逾期' },
      },
    },

    compliance_evidence: {
      label: '佐证材料',
      pluralLabel: '佐证材料',
      description: '支持一项或多项控制项的证据。',
      fields: {
        title: { label: '标题' },
        control: { label: '主控制项' },
        evidence_type: {
          label: '类型',
          options: {
            policy: '制度文件',
            screenshot: '截图',
            log: '日志导出',
            config: '配置导出',
            training: '培训记录',
            pentest: '渗透测试报告',
            audit_letter: '外部审计函',
            other: '其他',
          },
        },
        status: {
          label: '状态',
          options: {
            pending: '待收集',
            submitted: '已提交',
            approved: '已批准',
            rejected: '已驳回',
            expired: '已过期',
          },
        },
        description: { label: '描述' },
        collected_on: { label: '收集日期' },
        expires_on: { label: '到期日期' },
        is_expiring_soon: { label: '30 天内到期' },
        is_expired: { label: '已过期' },
        collected_by: { label: '收集人' },
        approved_by: { label: '批准人' },
        source_url: { label: '来源链接' },
        notes: { label: '备注' },
      },
      _views: {
        all_evidence: { label: '全部佐证' },
        pending_evidence: { label: '待审核' },
        expiring_evidence: { label: '30 天内到期' },
      },
    },

    compliance_assessment: {
      label: '评估',
      pluralLabel: '评估',
      description: '对单个控制项的一次定期测试。',
      fields: {
        title: { label: '标题' },
        control: { label: '控制项' },
        cycle: { label: '评估周期' },
        assessed_at: { label: '评估时间' },
        assessor: { label: '评估人' },
        status: {
          label: '状态',
          options: {
            planned: '已计划',
            in_progress: '进行中',
            passed: '通过',
            partial: '部分通过',
            failed: '未通过',
          },
        },
        finding: { label: '审计发现' },
        remediation_plan: { label: '整改计划' },
        remediation_due: { label: '整改截止' },
      },
      _views: {
        all_assessments: { label: '全部评估' },
        failed_assessments: { label: '未通过评估' },
        in_progress_assessments: { label: '进行中' },
      },
    },
  },

  apps: {
    compliance: {
      label: '合规',
      description: '基于 ObjectStack 的合规态势与佐证管理。',
      navigation: {
        nav_dashboard: { label: '合规态势' },
        nav_framework: { label: '合规框架' },
        nav_control: { label: '控制项' },
        nav_evidence: { label: '佐证材料' },
        nav_assessment: { label: '评估' },
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
    'error.required': '此字段必填',
  },

  validationMessages: {
    review_frequency_positive: '复评频率必须为正数。',
    submitted_requires_collected_on: '已提交的佐证必须填写收集日期。',
    expires_after_collected: '到期日期不能早于收集日期。',
    failed_requires_remediation: '未通过或部分通过的评估必须填写整改计划。',
    completed_requires_assessor: '已完成的评估必须填写评估人。',
  },

  dashboards: {
    control_posture_dashboard: {
      label: '合规态势',
      description: '通过率、未通过控制项、即将过期的佐证以及进行中的评估。',
      actions: { create_assessment: { label: '新建评估' } },
      widgets: {
        passing_controls: { title: '通过的控制项' },
        failing_controls: { title: '未通过或部分通过' },
        expiring_evidence: { title: '30 天内到期佐证' },
        in_progress_assessments: { title: '进行中评估' },
        failing_table: { title: '需整改的控制项' },
        expiring_evidence_table: { title: '即将到期的佐证' },
      },
    },
  },
};
