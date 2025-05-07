import React from "react";
import "../../../../styles/Sidebar.css"

const examTypes = [
  { value: "midterm", label: "Giữa kỳ" },
  { value: "final", label: "Cuối kỳ" },
];
const grades = [10, 11, 12];

function FilterSidebar({ filters, setFilters }) {
  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      if (value === "All") {
        return { ...prev, [type]: new Set() };
      } else {
        const newSet = new Set(prev[type]);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
        return { ...prev, [type]: newSet };
      }
    });
  };

  const isAllSelected = (type) => filters[type].size === 0;

  return (
    <div className="sidebar">
      <h3>Bộ lọc</h3>

      {/* Loại kỳ thi */}
      <div>
        <p><strong>Loại kỳ thi</strong></p>
        <label className="label">
          <input
            type="checkbox"
            checked={isAllSelected("examTypes")}
            onChange={() => toggleFilter("examTypes", "All")}
          />
          Tất cả
        </label>
        {examTypes.map(({ value, label }) => (
          <label key={value} className="label">
            <input
              type="checkbox"
              checked={filters.examTypes.has(value)}
              onChange={() => toggleFilter("examTypes", value)}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Khối lớp */}
      <div>
        <p><strong>Khối lớp</strong></p>
        <label className="label">
          <input
            type="checkbox"
            checked={isAllSelected("grades")}
            onChange={() => toggleFilter("grades", "All")}
          />
          Tất cả
        </label>
        {grades.map((grade) => (
          <label key={grade} className="label">
            <input
              type="checkbox"
              checked={filters.grades.has(grade)}
              onChange={() => toggleFilter("grades", grade)}
            />
            Lớp {grade}
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterSidebar;
