import { useState, useMemo } from 'react'

export function usePagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = String(av).localeCompare(String(bv), 'fr', { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const paginated = useMemo(
    () => sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
    [sorted, safePage, pageSize],
  )

  const toggleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)))

  return {
    page: safePage,
    totalPages,
    sorted,
    paginated,
    sortKey,
    sortDir,
    toggleSort,
    goTo,
    setPage: goTo,
  }
}
