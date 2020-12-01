export default `
#{import}

#{exportTs}const #{Model}UpsertOneMutation = mutationField('upsertOne#{Model}', {
  type: nonNull('#{Model}'),
  description:
    '更新或添加 #{Model},参见[upsert](https://www.prisma.io/docs/concepts/components/prisma-client/crud#upsert)',
  args: {
    where: nonNull(
      arg({
        type: '#{Model}WhereUniqueInput',
        description: '唯一值过滤条件'
      })
    ),
    create: nonNull(
      arg({
        type: '#{Model}CreateInput',
        description: '添加时的数据值'
      })
    ),
    update: nonNull(
      arg({
        type: '#{Model}UpdateInput',
        description: '更新已有数据时的数据值'
      })
    ),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.#{model}.upsert({
      ...args,
      ...select,
    })
  },
});
#{exportJs}
`;
