import { useId } from "react";

import "./SearchInput.css";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  id,
  label = "Search",
  placeholder = "Search...",
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="search-input">
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="5.5" />
        <path d="m12.5 12.5 4 4" />
      </svg>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={`Clear ${label.toLowerCase()}`}
        >
          Clear
        </button>
      )}
    </div>
  );
}
