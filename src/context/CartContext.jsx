import { createContext, useReducer, useContext, useEffect } from 'react';

///// referring from sba 320
// logic: creating the context object here so i can share the cart state globally across the app.
const CartContext = createContext();

// logic: setting up the initial state. 
// the idea is that i am checking localstorage first, so if the user refreshes the page, their cart doesnt just randomly empty out.
const initialState = {
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
};

// logic: i am gonna use usereducer to handle actions for the cart, similar to sba 320
// https://react.dev/learn/updating-arrays-in-state

const cartReducer = (state, action) => {

    ////////////TESTING
    // console.log('TESTING: cart action payload: ', action.payload);
    ////////////

    switch (action.type) {
        case 'ADD_TO_CART':
            const item = action.payload;
            // logic: checking if the item is already in the cart so we dont get duplicates, i just wanna update the quantity if it exists.
            const existItem = state.cartItems.find(x => x._id === item._id);

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x => x._id === existItem._id ? item : x)
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                };
            }
        case 'REMOVE_FROM_CART':
            // logic: using filter to just remove the item that matches the id the user clicked delete on.
            return {
                ...state,
                // filtering the array to keep everything except the item with the matching id
                cartItems: state.cartItems.filter(x => x._id !== action.payload)
            };
        case 'CLEAR_CART':
            // logic: i am gonna add a clear cart action so when i checkout, the cart empties out completely.
            return {
                ...state,
                cartItems: []
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    // logic: passing my custom initialization function to usereducer instead of the hardcoded initialstate
    const [state, dispatch] = useReducer(cartReducer, initialState);

    ////////////TESTING
    // console.log('TESTING: cart provider initialized with state: ', state);
    ////////////

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }, [state.cartItems]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// logic: making a custom hook so i dont have to import usecontext and cartcontext in every single file. i can just call useCart().
export const useCart = () => {
    return useContext(CartContext);
};