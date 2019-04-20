import { getImageDetailsAtUrl } from './getImageDetailsAtUrl';

const arrayOfComics = [];
let index = 0;
let prefetchIndex = 0;
let buffer = 5;

export const getIndex = () => index;
export const setIndex = (idx) => { 
    index = idx; 
    
    if (index + buffer > arrayOfComics.length ) {
        prefetchComics(buffer);
    }

    return Promise.resolve(); 
};

const getInitialData = async () => {
    const url = 'https://www.smbc-comics.com';

    const results = await getImageDetailsAtUrl(url);

    arrayOfComics.push(results);
}

const getComicAtIndex = (index) => {
    return arrayOfComics[index];
}

const prefetchComics = (amount = buffer) => {
    recursiveFetch(arrayOfComics[prefetchIndex].prev, amount);
}

const recursiveFetch = async (url, amount) => {
    if (amount === 0) {
        return;
    }
    const results = await getImageDetailsAtUrl(url);
    prefetchIndex++;
    arrayOfComics[prefetchIndex] = results;

    // console.log(prefetchIndex, arrayOfComics[prefetchIndex]);
    recursiveFetch(results.prev, amount - 1);
}

export {
    arrayOfComics,
    getInitialData,
    prefetchComics,
}