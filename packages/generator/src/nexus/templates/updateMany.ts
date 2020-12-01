export default `
#{import}

#{exportTs}const #{Model}UpdateManyMutation = mutationField('updateMany#{Model}', {
  type: nonNull('BatchPayload'),
  description:
    '批量更新 #{Model},参考 [updateMany](https://www.prisma.io/docs/concepts/components/prisma-client/crud#updatemany)',
  args: {
    where: nullable(
      arg({
        type: '#{Model}WhereInput',,
        description: '过滤条件',
      })
    ),
    data: nonNull(
      arg({
        type: '#{Model}UpdateManyMutationInput',,
        description: '数据值'
      })
    ),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.#{model}.updateMany(args)
  },
});
#{exportJs}
`;
