import { ReactNode } from "react";
import { SelectionToolbar } from "@/shared/components/ui/selection-toolbar";

type AdminPageLayoutProps = {
  title: string;
  description: string;
  headerActions?: ReactNode;
  selectedCount?: number;
  itemLabel?: string;
  onClearSelection?: () => void;
  bulkActions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
};

export function AdminPageLayout({
  title,
  description,
  headerActions,
  selectedCount = 0,
  itemLabel = "item",
  onClearSelection,
  bulkActions,
  filters,
  children,
}: AdminPageLayoutProps) {
  const showBulkActions = selectedCount > 0 && bulkActions && onClearSelection;

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      {/* Header Section */}
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-primary text-2xl font-medium tracking-tighter text-grey-900">
            {title}
          </h1>
          <p className="mt-1 font-secondary text-sm text-grey-500">
            {description}
          </p>
        </div>

        {headerActions && (
          <div className="flex shrink-0 items-center gap-3">
            {headerActions}
          </div>
        )}
      </div>

      {/* Toolbar Section (Switch between Bulk Actions & Filters) */}
      {showBulkActions ? (
        <SelectionToolbar
          count={selectedCount}
          itemLabel={itemLabel}
          onClear={onClearSelection!}
          actions={bulkActions}
        />
      ) : (
        filters && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {filters}
          </div>
        )
      )}

      {/* Table Section */}
      {children}
    </div>
  );
}
