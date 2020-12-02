export default `
import { queryField, arg, nonNull, nullable } from '@nexus/schema'

#{exportTs}const #{Model}FindUniqueQuery = queryField('findUnique#{Model}', {
  type: nullable('#{Model}'),
  description: '精确查找单个 #{Model},参考[findUnique](https://www.prisma.io/docs/concepts/components/prisma-client/crud#findunique)',
  args: {
    where: nonNull(
      arg({
        type: '#{Model}WhereUniqueInput',
        description: '唯一值过滤条件',
      }),
    )
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.#{model}.findUnique({
      where,
      ...select,
    })
  },
});

//Compatible with old API
#{exportTs}const #{model}Query = queryField('#{model}', {
  type: nullable('#{Model}'),
  description: 
    '精确查找单个 #{Model},参考[findUnique](https://www.prisma.io/docs/concepts/components/prisma-client/crud#findunique)',
  deprecation: '已过时且不再支持,下一个主要版本可能移除,请使用 findUnique#{Model} 代替',
  args: {
    where: nonNull(
      arg({
        type: '#{Model}WhereUniqueInput',
        description: '唯一值过滤条件',
      })
    )
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.#{model}.findUnique({
      where,
      ...select,
    })
  },
});

#{exportJs}
`;
