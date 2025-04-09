import React from "react";
import "../../../../styles/Sidebar.css"

const examTypes = [
  { value: "midterm", label: "Giữa kỳ" },
  { value: "final", label: "Cuối kỳ" },
];
const subjects = ["Giải tích", "Đại số", "Vật lý", "Hoá học"];

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

      {/* Môn học */}
      <div>
        <p><strong>Môn học</strong></p>
        <label className="label">
          <input
            type="checkbox"
            checked={isAllSelected("subjects")}
            onChange={() => toggleFilter("subjects", "All")}
          />
          Tất cả
        </label>
        {subjects.map((subj) => (
          <label key={subj} className="label">
            <input
              type="checkbox"
              checked={filters.subjects.has(subj)}
              onChange={() => toggleFilter("subjects", subj)}
            />
            {subj}
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterSidebar;