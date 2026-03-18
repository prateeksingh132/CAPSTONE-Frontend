import ProductCard from '../components/ProductCard.jsx';
import { useGetProductsQuery } from '../features/apiSlice.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useState } from 'react';
import VoiceSearch from '../components/VoiceSearch.jsx';
import Loader from '../components/Loader.jsx';

// logic: this is my main inventory page. i am hooking it up to my rtk query api slice so it fetches data automatically.
const Shop = () => {

    // logic: firing my custom hook so the tab says GadgetShack | Catalog.
    useDocumentTitle('Catalog');

    // logic: adding local state to track the search keyword from the user or the microphone.
    const [keyword, setKeyword] = useState('');

    // logic: pulling the loading state, error, and actual data array straight from my redux cache.
    // logic: passing the keyword directly to my rtk query. 
    // when the keyword changes, rtk query automatically hits my backend fuzzy search controller
    const { data: products, isLoading, error } = useGetProductsQuery(keyword);

    ////////////TESTING
    // console.log('TESTING: shop page rendered. loading:', isLoading, 'products:', products);
    ////////////

    // checking laoding state and error if any 
    if (isLoading) return <Loader />;
    if (error) return <h2 className="loading-text" style={{ color: 'red' }}>Error fetching products. Check server connection.</h2>;

    ////////////TESTING
    // throw new Error("error boundary test!");
    ////////////

    return (
        <div className="main_container">
            <h1>Gadget Catalog</h1>

            {/* logic: adding my new voice search component and passing the state down. */}
            <VoiceSearch keyword={keyword} setKeyword={setKeyword} />

            <div className="products_container">
                {/* logic: checking if my fuzzy search returned empty. if empty, i am gonna display a messsage. */}
                {products?.length === 0 ? (
                    <h2 className="loading-text">No products found for "{keyword}"</h2>
                ) : (
                    // logic: mapping over the product array and generating a react component for each document
                    products?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Shop;