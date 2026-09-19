import React, { useEffect, useState } from 'react';
import {
  getPets,
  getCatImages,
  getDogImages
} from '../../api/petfinder';
import Hero from '../../components/hero';
import { useParams, Link } from 'react-router-dom';

const CACHE_KEY = 'petReplacementImagesV2';

const HomePage = () => {
  const [data, setData] = useState(null);
  const { type } = useParams();

  useEffect(() => {
    async function getPetsData() {
      const petsData = await getPets(type);

      const cachedImages = JSON.parse(
        localStorage.getItem(CACHE_KEY) || '{}'
      );

      const cats = petsData.filter(
        (animal) =>
          animal.photos?.length &&
          animal.type.toLowerCase() === 'cat' &&
          !cachedImages[animal.id]
      );

      const dogs = petsData.filter(
        (animal) =>
          animal.photos?.length &&
          animal.type.toLowerCase() === 'dog' &&
          !cachedImages[animal.id]
      );

      const [catImages, dogImages] = await Promise.all([
        cats.length ? getCatImages(cats.length) : [],
        dogs.length ? getDogImages(dogs.length) : []
      ]);

      let catIndex = 0;
      let dogIndex = 0;

      const petsWithImages = petsData.map((animal) => {
        if (!animal.photos?.length) {
          return {
            ...animal,
            imageUrl: null
          };
        }

        if (cachedImages[animal.id]) {
          return {
            ...animal,
            imageUrl: cachedImages[animal.id]
          };
        }

        let replacementImage = null;

        if (animal.type.toLowerCase() === 'cat') {
          replacementImage = catImages[catIndex++];
        }

        if (animal.type.toLowerCase() === 'dog') {
          replacementImage = dogImages[dogIndex++];
        }

        if (replacementImage) {
          cachedImages[animal.id] = replacementImage;
        }

        return {
          ...animal,
          imageUrl: replacementImage
        };
      });

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(cachedImages)
      );

      setData(petsWithImages);
    }

    getPetsData();
  }, [type]);

  if (!data) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="page">
      <Hero />

      <h3>
        <span className="pet-type-label">
          {type ? `${type}s` : 'Pets'}
        </span>{' '}
        available for adoption near you
      </h3>

      {data.length ? (
        <div className="grid">
          {data.map((animal) => (
            <Link
              key={animal.id}
              to={`/${animal.type.toLowerCase()}/${animal.id}`}
              className="pet"
            >
              <article>
                <div className="pet-image-container">
                  <img
                    className="pet-image"
                    src={
                      animal.imageUrl ||
                      (animal.photos?.length
                        ? animal.photos[0]?.medium
                        : '/missing-animal.png')
                    }
                    alt={animal.name}
                  />
                </div>

                <h3>{animal.name}</h3>
                <p>Breed: {animal.breeds.primary}</p>
                <p>Color: {animal.colors.primary}</p>
                <p>Gender: {animal.gender}</p>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <p className="prompt">
          No {type}s available for adoption now.
        </p>
      )}
    </div>
  );
};

export default HomePage;