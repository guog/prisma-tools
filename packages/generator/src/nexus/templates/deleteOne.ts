export default `
import { mutationField, arg, nonNull } from '@nexus/schema'

#{exportTs}const #{Model}DeleteOneMutation = mutationField('deleteOne#{Model}', {
  type: '#{Model}',
  description:
    '删除 #{Model},参考 [delete](https://www.prisma.io/docs/concepts/components/prisma-client/crud#delete)',
  args: {
    where: nonNull(
      arg({
        type: '#{Model}WhereUniqueInput',
        description: '唯一值过滤条件'
      })
    )
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    #{onDelete}
    return prisma.#{model}.delete({
      where,
      ...select,
    })
  },
});
#{exportJs}
`;
