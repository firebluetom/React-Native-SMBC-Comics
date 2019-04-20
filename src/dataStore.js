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
        DeviceEventEmitter.emit('refresh');
        return;
    }

    const results = await getImageDetailsAtUrl(url);
    prefetchIndex++;

    arrayOfComics[prefetchIndex] = results;

    return recursiveFetch(results.prev, amount - 1);
}


// Get Initial Data
getInitialData().then(() => {
    DeviceEventEmitter.emit('refresh', { name: 'John', age: 23 });
    prefetchComics();
});

export {
    arrayOfComics,
    getInitialData,
    prefetchComics,
}