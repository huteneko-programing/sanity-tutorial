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
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: '記事の短い説明文や抜粋を入力してください',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'estimatedReadingTime',
      title: 'Estimated Reading Time',
      type: 'number',
      description: '記事を読むのに必要な推定時間（分）',
      validation: (rule) => rule.min(1).max(60),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true, // 画像のトリミングポイントを設定可能にします
      },
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'image',
    },
    prepare(selection) {
      const {title, author, media} = selection
      return {
        title,
        subtitle: author && `by ${author}`,
        media,
      }
    },
  },
})
