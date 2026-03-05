import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// logic: in sba 320, i just used normal fetch inside useEffect, which meant i had to manually track isloading and error states and my app made redundant network requests every time i changed a page. 
// by implementing redux here (rtk query), my app can save the mongodb products inventory in the browsers memory. i am also not using the dummyjson api for the time being, i want to be able to connect my react app directly to my own backend.
// goal: set up rtk query to handle my api calls instead of using basic fetch and useeffect.
// https://github.com/bradtraversy/proshop-v2
// https://github.com/ed-roh/fullstack-admin

export const apiSlice = createApi({
    reducerPath: 'api',
    // logic: leaving base url empty bcuz my vite proxy automatically handles routing anything with '/api' to port 3000.
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    endpoints: (builder) => ({
        getProducts: builder.query({
            // logic: pointing this to my actual mongodb backend route completely replace the need for dummyjson api i used in sba 320.
            // also passing an optional keyword parameter so my fuzzy search controller actually works later.
            query: (keyword = '') => `/api/products?keyword=${keyword}`,
        }),
        getProductById: builder.query({
            query: (id) => `/api/products/${id}`,
        }),
    }),
});

// logic: rtk query automatically generates these custom hooks for me based on the endpoint names.
export const { useGetProductsQuery, useGetProductByIdQuery } = apiSlice;