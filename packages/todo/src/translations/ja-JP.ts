// Copyright (c) 2026 ObjectStack contributors. Apache-2.0 license.

import type { TranslationData } from '@objectstack/spec/system';

/**
 * 日本語 (ja-JP) — Todo App Translations
 *
 * Per-locale file: one file per language, following the `per_locale` convention.
 */
export const jaJP: TranslationData = {
  objects: {
    todo_task: {
      label: 'タスク',
      pluralLabel: 'タスク',
      description: '担当者に割り当てられた作業単位。',
      fields: {
        subject: { label: '件名' },
        description: { label: '説明' },
        status: {
          label: 'ステータス',
          options: { todo: '未着手', doing: '進行中', done: '完了', cancelled: 'キャンセル' },
        },
        priority: {
          label: '優先度',
          options: { low: '低', normal: '通常', high: '高', urgent: '緊急' },
        },
        assignee: { label: '担当者' },
        labels: { label: 'ラベル' },
        due_date: { label: '期限日' },
        started_at: { label: '開始日時' },
        completed_at: { label: '完了日時' },
        estimate_hours: { label: '見積（時間）' },
        is_overdue: { label: '期限超過' },
      },
      _views: {
        all_tasks: {
          label: 'すべてのタスク',
          description: 'すべてのタスクをステータスでグループ化',
        },
        task_board: { label: 'タスクボード', description: 'ステータス別のカンバンビュー' },
        my_open_tasks: {
          label: 'マイ未完了タスク',
          description: '自分に割り当てられた未完了タスク',
        },
        overdue_tasks: { label: '期限超過タスク', description: '期限を過ぎた未完了タスク' },
      },
    },

    todo_label: {
      label: 'ラベル',
      pluralLabel: 'ラベル',
      description: 'タスクを分類するカラータグ。',
      fields: {
        name: { label: '名前' },
        color: { label: '色' },
        description: { label: '説明' },
      },
    },
  },

  apps: {
    todo: {
      label: 'Todo',
      description: '軽量タスク管理ツール。',
      navigation: {
        nav_dashboard: { label: 'マイワーク' },
        nav_task: { label: 'タスク' },
        nav_label: { label: 'ラベル' },
      },
    },
  },

  messages: {
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.create': '作成',
    'common.search': '検索',
    'common.filter': 'フィルタ',
    'common.export': 'エクスポート',
    'common.back': '戻る',
    'common.confirm': '確認',
    'success.saved': 'タスクを保存しました',
    'success.assigned': 'タスクを割り当てました',
    'confirm.delete': 'このレコードを削除しますか？',
    'confirm.mark_done': '{count} 件のタスクを完了にしますか？',
    'confirm.reassign': '{count} 件のタスクを再割り当てしますか？',
    'error.required': 'この項目は必須です',
    'error.load_failed': 'データの読み込みに失敗しました',
  },

  validationMessages: {
    due_date_required_for_urgent: '緊急タスクには期限日が必要です',
    estimate_non_negative: '見積時間は0以上である必要があります',
  },

  dashboards: {
    my_work_dashboard: {
      label: 'マイワーク',
      description: '個人ランディングページ：未完了の作業、期限超過、週次スループット。',
      actions: {
        create_task: { label: '新規タスク' },
      },
      widgets: {
        my_open_tasks: {
          title: 'マイ未完了タスク',
          description: '自分に割り当てられた未完了または進行中のタスク',
        },
        my_overdue: { title: '期限超過', description: '期限を過ぎた自分の未完了タスク' },
        done_this_week: { title: '今週の完了', description: '今週の始めから完了したタスク' },
        recent_overdue_list: {
          title: '期限超過タスク',
          description: '古い順にソートされた期限超過タスク',
        },
      },
    },
  },
};
