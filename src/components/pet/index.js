import React from 'react';
import { Link } from 'react-router-dom';
import {
  getCatImages,
  getDogImages
} from '../../api/petfinder';

const CACHE_KEY = 'petReplacementImagesV2';

const Pet = ({ animal }) => {
  const handleImageError = async (e) => {
    e.currentTarget.onerror = null;

    // No photo in the mock data = keep the teddy bear.
    if (!animal.photos?.length) {
      e.currentTarget.src = '/missing-animal.png';
      return;
    }

    // Use an image we've already assigned to this pet.
    const cachedImages = JSON.parse(
      localStorage.getItem(CACHE_KEY) || '{}'
    );

    if (cachedImages[animal.id]) {
      e.currentTarget.src = cachedImages[animal.id];
      return;
    }

    try {
      let replacementImage = null;

      if (animal.type.toLowerCase() === 'cat') {
        const images = await getCatImages(1);
        replacementImage = images[0];
      }

      if (animal.type.toLowerCase() === 'dog') {
        const images = await getDogImages(1);
        replacementImage = images[0];
      }

      if (replacementImage) {
        cachedImages[animal.id] = replacementImage;

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(cachedImages)
        );

        e.currentTarget.src = replacementImage;
      } else {
        e.currentTarget.src = '/missing-animal.png';
      }
    } catch (error) {
      e.currentTarget.src = '/missing-animal.png';
    }
  };

  const cachedImages = JSON.parse(
    localStorage.getItem(CACHE_KEY) || '{}'
  );

  const imageSource =
    cachedImages[animal.id] ||
    (animal.photos?.length
      ? animal.photos[0]?.medium
      : '/missing-animal.png');

  return (
    <Link
      to={`/${animal.type.toLowerCase()}/${animal.id}`}
      className="pet"
    >
      <article>
        <div className="pet-image-container">
          <img
            className="pet-image"
            src={imageSource}
            alt={animal.name}
            onError={handleImageError}
          />
        </div>

        <h3>{animal.name}</h3>
        <p>Breed: {animal.breeds.primary}</p>
        <p>Color: {animal.colors.primary}</p>
        <p>Gender: {animal.gender}</p>
      </article>
    </Link>
  );
};

export default Pet;