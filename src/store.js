import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/apiSlice.js';

// logic: building the global redux store to hold my rtk query cache.
// https://github.com/bradtraversy/proshop-v2

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    // logic: now i have to add the api middleware so the caching, polling, and refetching can actually works behind the scenes.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

////////////TESTING
// console.log("TESTING: redux store configured...");
////////////