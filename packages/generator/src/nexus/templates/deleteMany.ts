export default `
import { mutationField, arg, nonNull, nullable } from '@nexus/schema'

#{exportTs}const #{Model}DeleteManyMutation = mutationField('deleteMany#{Model}', {
  type: nonNull('BatchPayload'),
  description:
    '批量删除 #{Model},参考 [deleteMany](https://www.prisma.io/docs/concepts/components/prisma-client/crud#deletemany)',
  args: {
    where: nullable(
      arg({
        type: '#{Model}WhereInput',
        description: '过滤条件',
      })
    )
  },
  resolve: async (_parent, { where }, { prisma }) => {
    #{onDelete}
    return prisma.#{model}.deleteMany({ where })
  },
});
#{exportJs}
`;
