export default `
import { queryField, arg, nonNull, nullable, list, intArg } from '@nexus/schema'

#{exportTs}const #{Model}FindCountQuery = queryField('findMany#{Model}Count', {
  type: nonNull('Int'),
  description:
    '统计符合条件的 #{Model}数据条数,参考 [count](https://www.prisma.io/docs/concepts/components/prisma-client/crud#count)',
  args: {
    where: nullable(
      arg({
        type: 'ActionWhereInput',
        description:
          '过滤条件,参考[Filtering](https://www.prisma.io/docs/concepts/components/prisma-client/filtering)'
      })
    ),

    orderBy: list(
      nonNull(
        arg({
          type: 'ActionOrderByInput',
          description:
            '排序规则,参考[Sorting](https://www.prisma.io/docs/concepts/components/prisma-client/sorting)'
        })
      )
    ),
    cursor: nullable(
      arg({
        type: 'ActionWhereUniqueInput',
        description:
          '分页使用,游标起始位置,参考[Cursor-based pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination)'
      })
    ),
    distinct: nullable(
      list(
        nonNull(
          arg({
            type: 'ActionDistinctFieldEnum',
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
  resolve(_parent, args, {prisma}) {
    return prisma.#{model}.count(args#{as})
  },
});
#{exportJs}
`;
