import React from "react";

export default function GridRow({
  row,
  rowIndex,
  selectedRows,
  handleRowClick,
  pinnedColumns,
  editingCell,
  setEditingCell,
  updateCellValue
}) {
  const isEditing =
    editingCell &&
    editingCell.rowIndex === rowIndex &&
    editingCell.key === "merchant";

  return (
    <div
      className="grid-row"
      data-test-id={`virtual-row-${row.id}`}
      data-selected={selectedRows.has(row.id) ? "true" : undefined}
      onClick={(e) => handleRowClick(row.id, e)}
    >
      {/* ID */}
      <div
        className={`grid-cell ${
          pinnedColumns.has("id") ? "pinned-column" : ""
        }`}
      >
        {row.id}
      </div>

      {/* Date */}
      <div
        className={`grid-cell ${
          pinnedColumns.has("date") ? "pinned-column-second" : ""
        }`}
      >
        {row.date}
      </div>

      {/* Merchant (Editable) */}
      <div
        className="grid-cell"
        data-test-id={`cell-${rowIndex}-merchant`}
        onDoubleClick={() =>
          setEditingCell({ rowIndex, key: "merchant" })
        }
      >
        {isEditing ? (
          <input
            autoFocus
            defaultValue={row.merchant}
            onBlur={(e) =>
              updateCellValue(rowIndex, "merchant", e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateCellValue(rowIndex, "merchant", e.target.value);
              }
            }}
          />
        ) : (
          row.merchant
        )}
      </div>

      {/* Category */}
      <div className="grid-cell">{row.category}</div>

      {/* Amount */}
      <div className="grid-cell">{row.amount}</div>

      {/* Status */}
      <div className="grid-cell">{row.status}</div>

      {/* Description */}
      <div className="grid-cell">{row.description}</div>
    </div>
  );
}