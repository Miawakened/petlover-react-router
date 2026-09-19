import React, { useEffect, useState } from 'react';
import {
  getPetDetails,
  getCatImages,
  getDogImages
} from '../../api/petfinder';
import Hero from '../../components/hero';
import { useParams, Navigate } from 'react-router-dom';

const CACHE_KEY = 'petReplacementImagesV2';

const PetDetailsPage = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [replacementImage, setReplacementImage] = useState(null);

  const { id, type } = useParams();

  useEffect(() => {
    async function getPetsData() {
      try {
        const petsData = await getPetDetails(id);

        setData(petsData);
        setError(false);

        const cachedImages = JSON.parse(
          localStorage.getItem(CACHE_KEY) || '{}'
        );

        let image = cachedImages[id];

        if (!image) {
          if (type?.toLowerCase() === 'cat') {
            const images = await getCatImages(1);
            image = images[0];
          }

          if (type?.toLowerCase() === 'dog') {
            const images = await getDogImages(1);
            image = images[0];
          }

          if (image) {
            cachedImages[id] = image;

            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify(cachedImages)
            );
          }
        }

        setReplacementImage(image || null);
      } catch (e) {
        setError(true);
      }

      setLoading(false);
    }

    getPetsData();
  }, [id, type]);

  return (
    <div>
      {loading ? (
        <h3>Loading...</h3>
      ) : error ? (
        <div>
          <Navigate to="/pet-details-not-found" />
        </div>
      ) : (
        <main>
          <Hero
            image={
              replacementImage ||
              data.photos[1]?.full ||
              'https://i.imgur.com/aEcJUFK.png'
            }
            displayText={`Meet ${data.name}`}
          />

          <div className="pet-detail">
            <div className="pet-image-container">
              <img
                className="pet-image"
                src={
                  replacementImage ||
                  data.photos[0]?.medium ||
                  'https://i.imgur.com/aEcJUFK.png'
                }
                alt=""
              />
            </div>

            <div>
              <h1>{data.name}</h1>
              <h3>Breed: {data.breeds.primary}</h3>
              <p>Color: {data.colors.primary || 'Unknown'}</p>
              <p>Gender: {data.gender}</p>
              <h3>Description</h3>
              <p>{data.description}</p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default PetDetailsPage;