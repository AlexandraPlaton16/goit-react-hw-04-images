import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ image, onImageClick }) => {
  const handleClick = () => {
    onImageClick(image);
  };

  return (
    <div className={styles.ImageGalleryItem} onClick={handleClick}>
      <img
        src={image.webformatURL}
        alt={image.tags}
        className={styles.ImageGalleryItemImage}
      />
    </div>
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onImageClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
