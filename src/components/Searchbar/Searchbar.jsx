import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './Searchbar.module.css';

const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleChange = e => setQuery(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <header className={styles.Searchbar}>
      <form className={styles.SearchForm} onSubmit={handleSubmit}>
        <button type="submit" className={styles.SearchFormButton}>
          <FaSearch style={{ fontSize: '20px' }} />
        </button>
        <input
          className={styles.SearchFormInput}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

export default Searchbar;
