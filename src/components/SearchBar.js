import React, { useState, useEffect, useRef } from "react";
import { getSearchSuggestions } from "../service/api";
import Icons from "./Icons";

const SearchBar = ({ value, onChange, onSubmit, placeholder = "For ex. House Plan", containerClassName = "mb-3" }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.trim().length < 2) {
        setSuggestions([]);
        setIsFetching(false);
        return;
      }
      try {
        setIsFetching(true);
        const res = await getSearchSuggestions(value);
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsFetching(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    if (onSubmit) {
      onSubmit(suggestion); // triggers search
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
      if (onSubmit) {
        onSubmit(value);
      }
    }
  };

  return (
    <div className={`position-relative w-100 ${containerClassName}`} ref={wrapperRef}>
      <div className="input-group">
        <span className="input-group-text bg-white">
          <Icons.Search />
        </span>
        <input
          type="text"
          className="form-control border-start-0 border-end-0 rounded-end-0 ps-0"
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (value && value.trim().length >= 2) setShowSuggestions(true);
          }}
          onKeyDown={handleInputKeyDown}
        />
        <span className="input-group-text p-0">
          <button
            type="button"
            className="btn btn-secondary rounded-start-0"
            onClick={() => {
              setShowSuggestions(false);
              if (onSubmit) onSubmit(value);
            }}
          >
            SEARCH
          </button>
        </span>
      </div>

      {showSuggestions && value && value.trim().length >= 2 && (
        <ul
          className="dropdown-menu show w-100 position-absolute"
          style={{ top: "100%", zIndex: 1050, marginTop: "0px", maxHeight: "300px", overflowY: "auto" }}
        >
          {isFetching ? (
            <li>
              <span className="dropdown-item text-muted disabled">Searching...</span>
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="dropdown-item text-truncate text-start"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              </li>
            ))
          ) : (
            <li>
              <span className="dropdown-item text-muted disabled">No suggestions found</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
