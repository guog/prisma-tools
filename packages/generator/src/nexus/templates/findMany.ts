export default `
import { queryField, arg, nonNull, nullable, list, intArg } from '@nexus/schema'

#{exportTs}const #{Model}FindManyQuery = queryField('findMany#{Model}', {
  type: nonNull(list(nonNull('#{Model}'))),
  description:
    '查找多个,返回 #{Model} 数组,参考[FindMany](https://www.prisma.io/docs/concepts/components/prisma-client/crud#findmany)',
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
    return prisma.#{model}.findMany({
      ...args,
      ...select,
    })
  },
});

// Compatible with old API
#{exportTs}const #{ModelCapitalPluralize}Query = queryField('#{modelLowerPluralize}', {
  type: nonNull(list(nonNull('#{Model}'))),
  deprecation: '已弃用,请使用 findMany#{Model}',
  description:
    '查找多个,返回 #{Model} 数组,参考[FindMany](https://www.prisma.io/docs/concepts/components/prisma-client/crud#findmany)',
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
    return prisma.#{model}.findMany({
      ...args,
      ...select,
    })
  },
});

#{exportJs}
`;
