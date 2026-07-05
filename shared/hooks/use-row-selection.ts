"use client";

import { useEffect, useMemo, useState } from "react";

export function useRowSelection<T>(items: T[], getId: (item: T) => string) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedIds((prev) => {
      const validIds = new Set(items.map(getId));
      const next = new Set([...prev].filter((id) => validIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [items]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(getId(item))),
    [items, selectedIds, getId],
  );

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleList = (list: T[]) => {
    const listIds = list.map(getId);
    const allSelected = listIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        listIds.forEach((id) => next.delete(id));
      } else {
        listIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const isListAllSelected = (list: T[]) =>
    list.length > 0 && list.every((item) => selectedIds.has(getId(item)));

  const isListSomeSelected = (list: T[]) =>
    list.some((item) => selectedIds.has(getId(item))) &&
    !isListAllSelected(list);

  return {
    selectedIds,
    selectedItems,
    toggleRow,
    toggleList,
    clearSelection,
    isListAllSelected,
    isListSomeSelected,
  };
}
