import { useState, useEffect, useCallback } from "react";
import VirtualGrid from "./components/VirtualGrid";
import GridHeader from "./components/GridHeader";
import { useDebounce } from "./hooks/useDebounce";
import "./styles.css";

function App() {
  /* =====================================================
     1️⃣ CORE STATE
  ===================================================== */

  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null);
  const [pinnedColumns, setPinnedColumns] = useState(new Set());

  /* =====================================================
     2️⃣ FILTER STATE
  ===================================================== */

  const [merchantFilter, setMerchantFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const debouncedMerchant = useDebounce(merchantFilter, 300);

  /* =====================================================
     3️⃣ LOAD DATA
  ===================================================== */

  useEffect(() => {
    fetch("/transactions.json")
      .then((res) => res.json())
      .then((data) => {
        setRawData(data);
        setFilteredData(data);
      })
      .catch(() => {
        console.error("Failed to load transactions.json");
      });
  }, []);

  /* =====================================================
     4️⃣ APPLY FILTERING (Merchant + Status Combined)
  ===================================================== */

  useEffect(() => {
    if (!rawData.length) return;

    let updated = rawData;

    // Merchant filter
    if (debouncedMerchant) {
      updated = updated.filter((row) =>
        row.merchant
          .toLowerCase()
          .includes(debouncedMerchant.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      updated = updated.filter((row) => row.status === statusFilter);
    }

    // Apply sorting again if active
    if (sortConfig) {
      const { key, direction } = sortConfig;

      updated = [...updated].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(updated);
  }, [debouncedMerchant, statusFilter, rawData, sortConfig]);

  /* =====================================================
     5️⃣ SORTING
  ===================================================== */

  const handleSort = useCallback((key) => {
    let direction = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  }, [sortConfig]);

  /* =====================================================
     6️⃣ ROW SELECTION (Single + Ctrl/Cmd)
  ===================================================== */

  const handleRowClick = useCallback((id, event) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);

      if (event.metaKey || event.ctrlKey) {
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
      } else {
        newSet.clear();
        newSet.add(id);
      }

      return newSet;
    });
  }, []);

  /* =====================================================
     7️⃣ COLUMN PINNING
  ===================================================== */

  const togglePin = useCallback((column) => {
    setPinnedColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) newSet.delete(column);
      else newSet.add(column);
      return newSet;
    });
  }, []);

  /* =====================================================
     8️⃣ CELL EDITING
  ===================================================== */

  const updateCellValue = (rowIndex, key, value) => {
    setFilteredData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [key]: value
      };
      return updated;
    });

    setRawData((prev) => {
      const updated = [...prev];
      const globalIndex = prev.findIndex(
        (r) => r.id === filteredData[rowIndex].id
      );
      if (globalIndex !== -1) {
        updated[globalIndex] = {
          ...updated[globalIndex],
          [key]: value
        };
      }
      return updated;
    });

    setEditingCell(null);
  };

  /* =====================================================
     9️⃣ RENDER
  ===================================================== */

  return (
  <div className="app-container">
    <h1>Enterprise Virtualized Financial Grid</h1>

    <div className="controls-bar">
      <input
        data-test-id="filter-merchant"
        placeholder="Filter Merchant"
        value={merchantFilter}
        onChange={(e) => setMerchantFilter(e.target.value)}
      />

      <button
        data-test-id="quick-filter-Completed"
        onClick={() => setStatusFilter("Completed")}
      >
        Completed
      </button>

      <button
        data-test-id="quick-filter-Pending"
        onClick={() => setStatusFilter("Pending")}
      >
        Pending
      </button>

      <button onClick={() => setStatusFilter(null)}>
        Clear
      </button>
    </div>

    <div data-test-id="filter-count" className="filter-count">
      Showing {filteredData.length} of {rawData.length} rows
    </div>

    <GridHeader
      onSort={handleSort}
      togglePin={togglePin}
      pinnedColumns={pinnedColumns}
    />

    <VirtualGrid
      data={filteredData}
      selectedRows={selectedRows}
      handleRowClick={handleRowClick}
      pinnedColumns={pinnedColumns}
      editingCell={editingCell}
      setEditingCell={setEditingCell}
      updateCellValue={updateCellValue}
    />
  </div>
);
}

export default App;