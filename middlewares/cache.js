import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

export const getOrSet = async (key, fetchFunction) => {
  if (cache.has(key)) {
    console.log(`Cache hit for key: ${key}`);
    return cache.get(key);
  } else {
    console.log(`Cache miss for key: ${key}`);
    const result = await fetchFunction();
    cache.set(key, result);
    return result;
  }
};
//commit

export const del = (key) => {
  cache.del(key);
  console.log(`Cache deleted for key: ${key}`);
};
