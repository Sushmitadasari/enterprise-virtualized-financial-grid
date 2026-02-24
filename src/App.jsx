import { useState, useEffect } from "react";
import VirtualGrid from "./components/VirtualGrid";
import GridHeader from "./components/GridHeader";
import { useDebounce } from "./hooks/useDebounce";
import "./styles.css";

function App() {
  /* ===============================
     1️⃣ CORE STATE
  =============================== */

  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null);
  const [pinnedColumns, setPinnedColumns] = useState(new Set());

  /* ===============================
     2️⃣ FILTER STATE
  =============================== */

  const [merchantFilter, setMerchantFilter] = useState("");
  const debouncedMerchant = useDebounce(merchantFilter, 300);

  /* ===============================
     3️⃣ LOAD DATA
  =============================== */

  useEffect(() => {
    fetch("/transactions.json")
      .then((res) => res.json())
      .then((data) => {
        setRawData(data);
        setFilteredData(data);
      });
  }, []);

  /* ===============================
     4️⃣ APPLY FILTERING (DEBOUNCED)
  =============================== */

  useEffect(() => {
    if (!rawData.length) return;

    const filtered = rawData.filter((row) =>
      row.merchant
        .toLowerCase()
        .includes(debouncedMerchant.toLowerCase())
    );

    setFilteredData(filtered);
  }, [debouncedMerchant, rawData]);

  /* ===============================
     5️⃣ SORTING
  =============================== */

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
    setSortConfig({ key, direction });
  };

  /* ===============================
     6️⃣ ROW SELECTION
  =============================== */

  const handleRowClick = (id, event) => {
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
  };

  /* ===============================
     7️⃣ COLUMN PINNING
  =============================== */

  const togglePin = (column) => {
    setPinnedColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) newSet.delete(column);
      else newSet.add(column);
      return newSet;
    });
  };

  /* ===============================
     8️⃣ RENDER
  =============================== */

  return (
    <div>
      <h1>Enterprise Virtualized Financial Grid</h1>

      {/* Filter Input */}
      <input
        data-test-id="filter-merchant"
        placeholder="Filter Merchant"
        value={merchantFilter}
        onChange={(e) => setMerchantFilter(e.target.value)}
      />

      <div data-test-id="filter-count">
        Showing {filteredData.length} of {rawData.length} rows
      </div>

      {/* Quick Filters */}
      <button
        data-test-id="quick-filter-Completed"
        onClick={() =>
          setFilteredData(rawData.filter((r) => r.status === "Completed"))
        }
      >
        Completed
      </button>

      <button
        data-test-id="quick-filter-Pending"
        onClick={() =>
          setFilteredData(rawData.filter((r) => r.status === "Pending"))
        }
      >
        Pending
      </button>

      {/* Header */}
      <GridHeader onSort={handleSort} togglePin={togglePin} />

      {/* Grid */}
      <VirtualGrid
        data={filteredData}
        selectedRows={selectedRows}
        handleRowClick={handleRowClick}
        pinnedColumns={pinnedColumns}
        editingCell={editingCell}
        setEditingCell={setEditingCell}
      />
    </div>
  );
}

export default App;