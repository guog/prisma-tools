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
            type: '#{Model}ScalarFieldEnum',
            description:
              '结果去重,参考[Distinct](https://www.prisma.io/docs/concepts/components/prisma-client/distinct)'
          })
        )
      )
    ),
    skip: nullable(
      arg({
        type: 'Int',
        description:
          '分页使用,跳过的行数,参考[Pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination)'
      })
    ),
    take: nullable(
      arg({
        type: 'Int',
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
  description:
    '查找多个,返回 #{Model} 数组,参考[FindMany](https://www.prisma.io/docs/concepts/components/prisma-client/crud#findmany)',
  deprecation: '已过时且不再支持,下一个主要版本可能移除,请使用 findMany#{Model} 代替',
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
            type: '#{Model}ScalarFieldEnum',
            description:
              '结果去重,参考[Distinct](https://www.prisma.io/docs/concepts/components/prisma-client/distinct)'
          })
        )
      )
    ),
    skip: nullable(
      arg({
        type: 'Int',
        description:
          '分页使用,跳过的行数,参考[Pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination)'
      })
    ),
    take: nullable(
      arg({
        type: 'Int',
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
