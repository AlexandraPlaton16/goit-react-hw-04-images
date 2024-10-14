import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '45180979-107bff5819a4dc169e4529cb0';
const BASE_URL = 'https://pixabay.com/api/';

const options = {
  position: 'center-center',
  timeout: 4000,
  width: '750px',
  fontSize: '30px',
};

export async function pixabaySearch(query, page = 1, perPage = 12) {
  try {
    const response = await axios.get(
      `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${perPage}`
    );
    const { hits, totalHits } = response.data;
    console.log(response.data);
    if (!Array.isArray(hits)) {
      Notiflix.Notify.failure(
        'Invalid format, hits should be an array!',
        options
      );
      return { images: [], totalHits: 0 };
    }

    if (hits.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there is no content matching your request ',
        options
      );
      return {
        images: [],
        totalHits: 0,
      };
    }
    const formatedHits = hits.map(
      ({ id, tags, webformatURL, largeImageURL }) => ({
        id,
        tags,
        webformatURL,
        largeImageURL,
      })
    );
    return {
      images: formatedHits,
      totalHits,
    };
  } catch (error) {
    console.error('Pixabay Search Error:', error);
    Notiflix.Notify.failure(`Error: ${error.message}`, options);
    throw new Error(error.message);
  }
}
