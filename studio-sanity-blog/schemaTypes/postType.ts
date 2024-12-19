import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug', // スラグは URL の一部として使われる短い識別子です。
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(), // 新規作成時のデフォルト値として、現在の日付と時間を自動入力します。
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image', // 画像ファイルをアップロードするフィールドです。
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})
