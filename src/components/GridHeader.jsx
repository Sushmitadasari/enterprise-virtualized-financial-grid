import React from "react";

export default function GridHeader({ onSort }) {
  return (
    <div className="grid-header">
      <div data-test-id="header-id">ID</div>
      <div data-test-id="header-date">Date</div>
      <div data-test-id="header-merchant">Merchant</div>
      <div data-test-id="header-category">Category</div>
      <div
        data-test-id="header-amount"
        onClick={() => onSort("amount")}
        style={{ cursor: "pointer" }}
      >
        Amount ⬍
      </div>
      <div data-test-id="header-status">Status</div>
      <div>Description</div>
    </div>
  );
}