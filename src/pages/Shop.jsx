import ProductCard from '../components/ProductCard.jsx';
import { useGetProductsQuery } from '../features/apiSlice.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

// logic: this is my main inventory page. i am hooking it up to my rtk query api slice so it fetches data automatically.
const Shop = () => {

    // logic: firing my custom hook so the tab says GadgetShack | Catalog.
    useDocumentTitle('Catalog');

    // logic: pulling the loading state, error, and actual data array straight from my redux cache. 
    const { data: products, isLoading, error } = useGetProductsQuery('');

    ////////////TESTING
    // console.log('TESTING: shop page rendered. loading:', isLoading, 'products:', products);
    ////////////

    // checking laoding state and error if any 
    if (isLoading) return <h2 className="loading-text">Loading catalog...</h2>;
    if (error) return <h2 className="loading-text" style={{color: 'red'}}>Error fetching products. Check server connection.</h2>;

    return (
        <div className="main_container">
            <h1>Gadget Catalog</h1>

            <div className="products_container">
                {/* logic: mapping over the product array and generating a react component for each document. */}
                {products?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Shop;