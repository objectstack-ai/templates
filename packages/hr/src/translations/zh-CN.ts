// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 简体中文 (zh-CN) — HR App Translations
 *
 * Per-locale file. Mirrors the keys defined in `en.ts`. Missing keys
 * fall back to `en` via `i18n.fallbackLocale` in `objectstack.config.ts`.
 */
export const zhCN: TranslationData = {
  objects: {
    hr_department: {
      label: '部门',
      pluralLabel: '部门',
      description: '组织架构节点，可通过上级字段嵌套。',
      fields: {
        name: { label: '名称' },
        code: { label: '编码' },
        parent: { label: '上级部门' },
        head: { label: '部门负责人' },
        description: { label: '描述' },
      },
    },

    hr_employee: {
      label: '员工',
      pluralLabel: '员工',
      description: '公司花名册中的成员。',
      fields: {
        full_name: { label: '姓名' },
        preferred_name: { label: '常用名' },
        work_email: { label: '工作邮箱' },
        phone: { label: '电话' },
        user: { label: '登录账号' },
        job_title: { label: '职位' },
        department: { label: '部门' },
        manager: { label: '直属上级' },
        location: { label: '工作地点' },
        status: {
          label: '状态',
          options: { active: '在职', on_leave: '休假中', terminated: '已离职' },
        },
        employment_type: {
          label: '用工类型',
          options: { full_time: '全职', part_time: '兼职', contractor: '外包', intern: '实习' },
        },
        hire_date: { label: '入职日期' },
        end_date: { label: '离职日期' },
        salary: { label: '薪资' },
        contract_type: { label: '合同类型' },
        national_id_last4: { label: '证件号后四位' },
        tenure_years: { label: '司龄（年）' },
        notes: { label: '内部备注' },
      },
      _views: {
        all_employees: { label: '全部员工', description: '按部门分组的所有员工' },
        active_employees: { label: '在职', description: '当前在职员工' },
        employees_on_leave: { label: '休假中', description: '当前正在休假的员工' },
      },
    },

    hr_time_off_request: {
      label: '请假申请',
      pluralLabel: '请假申请',
      description: '带薪或无薪假申请，将提交至员工的直属上级审批。',
      fields: {
        employee: { label: '员工' },
        leave_type: {
          label: '假期类型',
          options: {
            vacation: '年假',
            sick: '病假',
            personal: '事假',
            parental: '育儿假',
            bereavement: '丧假',
            unpaid: '无薪假',
          },
        },
        start_date: { label: '开始日期' },
        end_date: { label: '结束日期' },
        days: { label: '天数' },
        reason: { label: '原因' },
        status: {
          label: '状态',
          options: {
            draft: '草稿',
            submitted: '已提交',
            approved: '已批准',
            rejected: '已驳回',
            cancelled: '已取消',
          },
        },
        approver: { label: '审批人' },
        decided_at: { label: '审批时间' },
        decision_note: { label: '审批意见' },
        submitted_at: { label: '提交时间' },
      },
      _views: {
        all_time_off: { label: '全部申请', description: '按状态分组的所有申请' },
        time_off_pipeline: { label: '审批流水线', description: '按状态分列的看板视图' },
        pending_time_off: { label: '待审批', description: '已提交但尚未决策的申请' },
        approved_time_off: { label: '已批准', description: '按开始日期排序的已批准申请' },
      },
    },

    hr_document: {
      label: '员工档案',
      pluralLabel: '员工档案',
      description: '附加到员工记录的文档（合同、证件、证书）。',
      fields: {
        name: { label: '名称' },
        employee: { label: '员工' },
        doc_type: {
          label: '类型',
          options: {
            contract: '劳动合同',
            id: '身份证 / 护照扫描件',
            certification: '资质证书',
            visa: '签证 / 工作许可',
            other: '其他',
          },
        },
        issued_on: { label: '签发日期' },
        expires_at: { label: '到期日期' },
        is_expiring_soon: { label: '即将到期？' },
        is_expired: { label: '已过期？' },
        expiry_status: { label: '到期状态' },
        notes: { label: '备注' },
      },
      _views: {
        all_documents: { label: '全部档案', description: '按类型分组的所有档案' },
        expiring_documents: { label: '即将到期', description: '30 天内到期的档案' },
        expired_documents: { label: '已过期', description: '已超过到期日的档案' },
      },
    },
  },

  apps: {
    hr: {
      label: '人力资源',
      description: 'ObjectStack 上的员工花名册、请假与档案到期管理。',
      navigation: {
        nav_dashboard: { label: 'HR 看板' },
        nav_employee: { label: '员工' },
        nav_department: { label: '部门' },
        nav_time_off: { label: '请假' },
        nav_document: { label: '档案' },
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
    'success.time_off_submitted': '请假申请已提交，等待审批',
    'error.required': '此字段为必填项',
  },

  validationMessages: {
    terminated_requires_end_date: '离职员工必须填写离职日期。',
    manager_is_not_self: '员工不能将自己设为直属上级。',
    end_after_start: '结束日期不得早于开始日期。',
    submitted_requires_dates: '已提交的申请必须填写开始与结束日期。',
  },

  dashboards: {
    hr_admin_dashboard: {
      label: 'HR 看板',
      description: '一览待审批事项、近期入职与即将到期的档案。',
      actions: { create_employee: { label: '新增员工' } },
      widgets: {
        headcount: { title: '在职人数', description: '当前在职状态的员工总数' },
        on_leave: { title: '休假中人数', description: '当前正在休假的员工' },
        pending_time_off: { title: '待审批请假', description: '等待直属上级决策的请假申请' },
        expiring_docs: {
          title: '档案即将到期（30 天）',
          description: '到期日落在未来 30 天内的档案',
        },
        pending_time_off_table: { title: '待处理请假申请', description: '按提交时间从旧到新排序' },
        expiring_docs_table: { title: '即将到期的档案', description: '30 天内到期的档案' },
      },
    },
  },
};
