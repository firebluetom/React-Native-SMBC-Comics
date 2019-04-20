import { getImageDetailsAtUrl } from './getImageDetailsAtUrl';
import { DeviceEventEmitter } from 'react-native';

const arrayOfComics = [];
let index = 0;
let prefetchIndex = 0;
let buffer = 5;
let isUpdating = false;

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

const prefetchComics = async (amount = buffer) => {
    if (isUpdating) {
        return;
    } else {
        isUpdating = true;
        return await recursiveFetch(arrayOfComics[prefetchIndex].prev, amount);
    }
}

const recursiveFetch = async (url, amount) => {
    if (amount === 0) {
        isUpdating = false;
        DeviceEventEmitter.emit('refresh', { name: 'John', age: 23 });
        return;
    }

    const results = await getImageDetailsAtUrl(url);
    prefetchIndex++;
    
    // console.log(prefetchIndex, url);

    arrayOfComics[prefetchIndex] = results;

    // console.log(prefetchIndex, arrayOfComics[prefetchIndex]);
    return recursiveFetch(results.prev, amount - 1);
}

export {
    arrayOfComics,
    getInitialData,
    prefetchComics,
}