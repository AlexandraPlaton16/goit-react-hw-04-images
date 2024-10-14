import React, { useState, useEffect, useCallback } from 'react';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Scroll from './Scroll/Scroll';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import { pixabaySearch } from './service/pixabayAPI';
import Notiflix from 'notiflix';

const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const fetchImages = useCallback(
    async (isNewQuery = false) => {
      if (!query) {
        Notiflix.Notify.info('Please enter a search query!', {
          position: 'center-center',
          timeout: 3000,
          width: '450px',
        });
        return;
      }

      setIsLoading(true);

      try {
        const { images: newImages, totalHits } = await pixabaySearch(
          query,
          isNewQuery ? 1 : page
        );

        if (!newImages.length && isNewQuery) {
          Notiflix.Notify.info('No result found for your query', {
            position: 'center-center',
            timeout: 3000,
            width: '450px',
          });
        }

        setImages(prevImages =>
          isNewQuery ? newImages : [...prevImages, ...newImages]
        );
        setPage(prevPage => (isNewQuery ? 2 : prevPage + 1));
        setIsLastPage(images.length + newImages.length >= totalHits);

        if (!isNewQuery) {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }
      } catch (error) {
        Notiflix.Notify.failure(`Failed to fetch images: ${error.message}`, {
          position: 'center-center',
          timeout: 3000,
          width: '450px',
        });
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [query, page, images.length]
  );

  useEffect(() => {
    if (!query) return;
    fetchImages(true);
  }, [query, fetchImages]);

  const handleSubmit = newQuery => {
    if (query !== newQuery.trim()) {
      setQuery(newQuery.trim());
      setImages([]);
      setPage(1);
      setIsLastPage(false);
      setError(null);
    }
  };

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <Searchbar onSubmit={handleSubmit} />
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {isLoading && <Loader />}
      {!isLoading && images.length > 0 && !isLastPage && (
        <Button onClick={() => fetchImages(false)} />
      )}
      {showModal && <Modal image={selectedImage} onClose={handleModalClose} />}
      <Scroll />
    </>
  );
};

export default App;
