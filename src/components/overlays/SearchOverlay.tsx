// src/components/SearchOverlay.tsx
import React, { useState } from 'react';
import './Modal.css';

const SearchOverlay: React.FC<{
  onClose: () => void;
  onSearch: (query: string) => void;
}> = ({ onClose, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="tg-absolute tg-left-0 tg-top-0">
      <button type="button" onClick={onClose}>
        Close
      </button>
      <h2>Search</h2>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Type to search..."
      />
    </div>
  );
};

export default SearchOverlay;
