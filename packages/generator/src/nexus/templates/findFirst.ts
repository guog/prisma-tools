export default `
import { queryField, arg, nullable, list, nonNull, intArg } from '@nexus/schema'

#{exportTs}const #{Model}FindFirstQuery = queryField('findFirst#{Model}', {
  type: nullable('#{Model}'),
  description:
    '查找第一个符合条件的 #{Model},参考 [findFirst](https://www.prisma.io/docs/concepts/components/prisma-client/crud#findfirst)',
  args: {
    where: nullable(
      arg({
        type: '#{Model}WhereInput',
        description:
          '过滤条件,参考[Filtering](https://www.prisma.io/docs/concepts/components/prisma-client/filtering)'
      })
    ),
    orderBy: list(
      nonNull(
        arg({
          type: '#{Model}OrderByInput',
          description:
            '排序规则,参考[Sorting](https://www.prisma.io/docs/concepts/components/prisma-client/sorting)'
        })
      )
    ),
    cursor: nullable(
      arg({
        type: '#{Model}WhereUniqueInput',
        description:
          '分页使用,游标起始位置,参考[Cursor-based pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination)'
      })
    ),
    distinct: nullable(
      list(
        nonNull(
          arg({
            type: '#{Model}DistinctFieldEnum',
            description:
              '结果去重,参考[Distinct](https://www.prisma.io/docs/concepts/components/prisma-client/distinct)'
          })
        )
      )
    ),
    skip: nullable(
      intArg({
        description:
          '分页使用,跳过的行数,参考[Pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination)'
      })
    ),
    take: nullable(
      intArg({
        description:
          '分页使用,每页行数,参考[Pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination)'
      })
    )
  },
  resolve(_parent, args, {prisma, select}) {
    return prisma.#{model}.findFirst({
      ...args,
      ...select,
    })
  },
});
#{exportJs}
`;
