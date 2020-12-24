export default `
import { mutationField, arg, nonNull } from '@nexus/schema'

#{exportTs}const #{Model}CreateOneMutation = mutationField('createOne#{Model}', {
  type: nonNull('#{Model}'),
  description:
    '创建 #{Model},参考 [create](https://www.prisma.io/docs/concepts/components/prisma-client/crud#create)',
  args: {
    data: nonNull(
      arg({
        type: '#{Model}CreateInput',
        description: '数据值'
      })
    ),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.#{model}.create({
      data,
      ...select
    })
  }
});
#{exportJs}
`;
