export const getPets = async (type = '', query = '') => {
  const searchParams = new URLSearchParams({ type, query });
  const requestUrl = `/animals?${searchParams.toString()}`;

  const response = await fetch(requestUrl, {
    method: 'GET'
  });

  const json = await response.json();

  return json;
};

export const getPetDetails = async (id) => {
  const requestUrl = `/animals/${id}`;

  const response = await fetch(requestUrl, {
    method: 'GET'
  });

  const json = await response.json();

  return json;
};

export const getPetTypes = async () => {
  const requestUrl = `/types`;

  const response = await fetch(requestUrl, {
    method: 'GET'
  });

  const json = await response.json();

  return json;
};

export const getCatImages = async (limit = 20) => {
  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&order=RANDOM&limit=${limit}`,
    {
      headers: {
        'x-api-key': process.env.REACT_APP_CAT_API_KEY
      }
    }
  );

  const data = await response.json();

  return data.map((image) => image.url);
};

export const getDogImages = async (limit = 20) => {
  const response = await fetch(
    `https://pro-api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&order=RANDOM&limit=${limit}`,
    {
      headers: {
        'x-api-key': process.env.REACT_APP_DOG_API_KEY
      }
    }
  );

  const data = await response.json();

  return data.map((image) => image.url);
};