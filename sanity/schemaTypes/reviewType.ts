
import { defineType, defineField } from 'sanity';

export const reviewType = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
      validation: (Rule) => Rule.required(),
      description: 'The product this review is for.',
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The unique ID of the user who wrote the review.',
    }),
    defineField({
      name: 'reviewer',
      title: 'Reviewer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The public name of the person who wrote the review.',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) =>
        Rule.required().min(1).max(5).integer().warning('Rating must be an integer between 1 and 5.'),
      description: 'The star rating (1-5).',
      options: {
        list: [
          { title: '1 Star', value: 1 },
          { title: '2 Stars', value: 2 },
          { title: '3 Stars', value: 3 },
          { title: '4 Stars', value: 4 },
          { title: '5 Stars', value: 5 },
        ],
      },
    }),
    defineField({
      name: 'reviewTitle',
      title: 'Review Title',
      type: 'string',
      description: 'The short title of the review.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reviewText',
      title: 'Review Description',
      type: 'text',
      description: 'The detailed text of the review.',
      rows: 5,
    }),
    defineField({
      name: 'reviewImage',
      title: 'Review Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'An optional image uploaded by the reviewer.',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
      initialValue: () => (new Date()).toISOString(),
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'reviewer',
      subtitle: 'product.name',
      media: 'reviewImage',
      rating: 'rating',
    },
    prepare({ title, subtitle, media, rating }) {
      return {
        title: `${title} - ${'⭐️'.repeat(rating)}`,
        subtitle: subtitle ? `Review for: ${subtitle}` : 'No product selected',
        media,
      };
    },
  },
});