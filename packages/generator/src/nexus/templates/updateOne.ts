export default `
import { mutationField, arg, nonNull } from '@nexus/schema'

#{exportTs}const #{Model}UpdateOneMutation = mutationField('updateOne#{Model}', {
  type: nonNull('#{Model}'),
  description:
    '更新 #{Model},参考[update](https://www.prisma.io/docs/concepts/components/prisma-client/crud#update)',
  args: {
    where: nonNull(
      arg({
        type: '#{Model}WhereUniqueInput',
        description: '唯一值过滤条件',
      })
    ),
    data: nonNull(
      arg({
        type: '#{Model}UpdateInput',
        description: '数据值',
      })
    ),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.#{model}.update({
      where,
      data,
      ...select,
    })
  },
});
#{exportJs}
`;
