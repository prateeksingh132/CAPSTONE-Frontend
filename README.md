# Capstone project:


## Project: GadgetShack (React Client Layer)

**Brief Description:** "Gadgetshack" is an electronics e-commerce website. i decided to continue with my "gadgetshack" theme from my previous sba 320 project. in sba 320, i built a react frontend but i had to use a public api (dummyjson.com) to kinda simulate a database. for this final capstone, i completely decoupled the architecture. i connected this react single page application (spa) directly to my own custom node/express backend. 

my goal was to build a highly reactive storefront. i really wanted to move away from messy `useEffect` fetch loops and standard windows browser alerts. in this capstone frontend, i focused on state caching using redux, global ui notifications using toast and cool interactive features like native voice search and a dedicated ai tech advisor page.

#### Capstone Backend Link:

https://github.com/prateeksingh132/CAPSTONE-Backend.git

### Technology Used

* **Vite and React:** i used vite instead of create-react-app.
* **React Router DOM:** i used this to handle all the page navigation so the browser never has to do a hard refresh.
* **Redux Toolkit (RTK Query):** i used this to manage my "server state" and automatically cache my api requests to the backend.
* **Context API and useReducer:** i used this to manage my "client state", specifically to handle the shopping cart logic without overcomplicating my redux usage.
* **Recharts:** a charting library i used to display the dynamic sales graph on the admin dashboard.
* **Web Speech API:** a native browser api built into the window object that i used to build my voice-to-text search bar without needing any external npm packages.
* **CSS:** i completely overhauled the styling to give the app a clean, white shadowy rainbow look. my goal was to give it clear clean look and have a smooth feel, with a nice tactile button inset press effect.

### Features and Requirement List

i checked the capstone requirement list and implemented them one by one. here is the detailed logic for each:

1. **hybrid state management (redux + context):**

    *  this was a huge architectural upgrade from sba 320. instead of putting everything into one massive state, i split it up.
    *  for my public product inventory, i used redux rtk query (`apiSlice.js`). it automatically handles caching the database and creating `isLoading` flags, so i didn't have to write messy `useEffect` loops for my catalog.
    *  however, for my secure routes (like Auth, Checkout, and Admin Analytics), i manually created standard asynchronous `fetch()` requests. this allowed me to securely pass and manage the `httpOnly` cookies to my backend proxy without overcomplicating the redux store.
    *  for the shopping cart, i built a `CartContext.jsx` using `useReducer`. i added a `useEffect` that listens for changes and stringifies the cart into `localStorage` so it doesn't empty out if the user refreshes.

2. **native voice search:**

    * i built a `VoiceSearch.jsx` component that connects directly with the user's microphone using `window.webkitSpeechRecognition`.
    * when a user speaks, the browser generates a transcript. i ran into a bug where it would sometimes add a random period at the end of the sentence, which would break my database search. so i used a regex `.replace(/\.$/, '')` to strip it off.
    * once the string is clean, it updates my local `keyword` state, which instantly triggers my rtk query hook to hit the backend fuzzy search and re-render the products.

3.  **generative ai ui (tech advisor):**
    *  i built a tech advisor chat page mapped to the `/advisor` route.
    *  it manages a `chatHistory` array. when the user asks a question, my backend proxy queries openai and returns a json object.
    *  i also implemented dynamic ui mapping. when the backend sends back the payload, it includes a `productId`. my react component checks if `msg.productId && msg.productId !== 'null'`. if it finds a valid database id, it renders a direct react router `<Link>` button right inside the chat interface so the user can go straight to that product's details page.


4. **routing and protection (route guards):**

    * i used react-router-dom to build my navigation, but i didn't want just anyone accessing the checkout or admin dashboard. so, i created `<PrivateRoute>` and `<AdminRoute>` wrapper components in `RouteGuards.jsx`.
    * the idea is that these guards check `localStorage` for the user's role. if a standard user tries to type `/admin` in the url bar, the guard intercepts the render cycle and uses the `<Navigate />` component to instantly bounce them back to the login page before the dashboard even tries to load.
    *  i also created a custom `NotFound.jsx` page and mapped it to the `*` wildcard route so bad urls show a nice error screen instead of a blank white page.


5.  **admin dashboard:**
    *  for the admin panel, i wanted to show analytics using visual graphs unlike previous projects. so i used the `recharts` library.
    *  my react component uses a `useEffect` to fire a secure `fetch('/api/admin/sales')` request to grab the aggregated daily sales array from my backend. 
    *  i feed that data directly into a `<BarChart>`, mapping the `<XAxis>` to the date strings.
    *  i also wrapped it in a `<ResponsiveContainer>` which ensures the graph resizes perfectly whether the page is open on a desktop or a phone.


6. **dynamic mongoose map rendering:**

    * in my backend, my product specs use a mongoose map bcuz products can have different specs. for example, a gaming laptop has ram and a gpu but a drone has flight time and a camera resolution.
    * to render this on the frontend without hardcoding the fields like "cpu" or "ram", i used `Object.entries(product.specs).map()` on my `ProductDetailsPage.jsx`. this loops through the database keys and values and builds a specs list regardless of whether the product is a laptop or a microphone.


### View and client interaction

my goal for the view was to make the app look good, fast, secure and feel like a real production store. i wanted to completely move away from basic alerts and messy dom shifts from previous projects.

*   **general ui upgrades:**

    * **global toast notifications:** instead of using browser `alert()` popups like previous projects, i built a custom `ToastContext.jsx`. now, when a user adds an item or checks out, a css-animated popup slides into the top right corner and automatically disappears after 3 seconds using a `setTimeout` cleanup function.

    *  **error boundaries and fallback recovery:** if a react component throws an error, the whole screen usually turns white and crashes. to fix this, i built a class-based `<ErrorBoundary>` component using the `componentDidCatch` lifecycle method. if the ui breaks, it catches the crash and shows a nice "Something went wrong" fallback ui. the main part is that i added a button with `onClick={() => this.setState({ hasError: false })}` so the user can attempt to reload the app state without forcing a hard browser refresh.

    *  **manual redirection delays:** in my checkout and admin dashboard flows, instead of instantly moving the user, i implemented a `setTimeout` wrapping my `navigate()` functions. this gives the user 2 seconds to actually read the success/error toast messages before they are forcefully routed away.

    * **dynamic page titles:** i wrote a custom `useDocumentTitle.js` hook that automatically changes the browser tab text depending on what page or product the user is currently viewing.

    * **css pulsing loaders:** instead of static "loading..." text, i used a `@keyframes pulseEffect` in my css on a `.loading-text` class to make the loading states feel smooth.


### How to use the application

here is a detailed step-by-step guide on how to install and test the frontend react application locally. the idea is that since this is a decoupled app, you must have the backend node server running on port 3000 at the same time, otherwise all the rtk query api calls will fail and just show loading errors on the screen.

**installation and startup:**

   * note: you must have the backend server already running on port 3000 in a separate terminal window before starting the frontend, otherwise the api calls will fail.
   * clone the frontend repository and open your terminal.
   * run `npm install` to grab all the dependencies (vite, react-router-dom, redux toolkit, recharts, etc).
   * run `npm run dev` to start the vite development server.
   * click the local link in your terminal (usually `http://localhost:5173`) to open the app in your browser. my `vite.config.js` is already set up to proxy `/api` requests to port 3000, so you shouldn't get any weird cors errors.



#### step-by-step page walkthrough

1. **the home page (`/`):** 
    * **landing page:** this is the landing page. 
    * **hero carousel:** you can see a hero banner with an auto-playing image carousel. i used a `setInterval` combined with `useEffect` to automatically cycle through the hero images every 4 seconds.

2. **the shop catalog (`/shop`):** 
    * **catalog display:** this page displays the whole catalog mapped from the rtk query cache.
    * **voice search:** you can click the mic on the `VoiceSearch` component to speak a term. my script strips trailing periods with `.replace(/\.$/, '')`, updates the state and instantly filters the items on the screen.

3. **product details (`/product/:id`):** 
    * **url parameters:** you click a product card and `useParams` grabs the id straight from the url to fetch the exact item.
    * **dynamic specs:** you can see the dynamic specs and click "add to cart". (quantity adjustments are handled directly in the cart page).
    * **stock validation:** the "add to cart" button physically disables itself if the item's stock hits zero.
    * **full crud functionality:** if the user is logged in as an admin, a special controls box renders with buttons to delete the product or quickly restock it, this enables my application all four crud routes to the backend:
        * **get (read):** fetching the catalog and individual product details using rtk query.
        * **post (create):** submitting a new order at checkout and securely logging in.
        * **put (update):** using the "quick restock" button on this page to instantly update the inventory count to 100.
        * **delete (delete):** using the "delete product" button on this page to permanently remove an item from the db.
    * **customer reviews:** you can scroll to the bottom of the page to see customer feedback. my code maps over the populated reviews array sent from the backend and dynamically renders the username, rating and comment.

4. **the shopping cart (`/cart`):**
    * **review items:** you can reviews your items here. you can adjust quantities using the + and - buttons.
    * **cart mapping:** the `Cart.jsx` component maps over the context array and calculates the subtotal.
    * **quantity logic:** i added logic to prevent you from dropping the quantity below 1 or exceeding the available `item.stock`. the subtotal mathematically updates in real-time.
    * **checkout guard:** you then can click "proceed to checkout". if you aren't logged in, my route guard intercepts it and opens the login screen.

5. **auth and admin (`/login`, `/admin`):**
    * **frontend validation:** on the register page, i added a check `if (password !== confirmPassword)`, to catch typos before even bothering to hit the backend.
    * **authentication:** when you log in, the frontend fires a manual `fetch` request to the backend, which sets a secure `httpOnly` cookie. the frontend gets the user profile back and saves your role to `localStorage`.
    * **admin dashboard:** the navbar checks this profile and conditionally renders the "Dashboard" link only if you have admin privileges. clicking it loads the recharts sales graph.

6. **the checkout (`/checkout`):** 
    * **confirm cart:** you will be pushed back here after logging in. you can confirm your cart.
    * **secure payload:** when you hit place order, my code maps your cart array into a secure payload (sending only product ids and quantities, no prices).
    * **manual fetch submission:** the frontend fires an asynchronous `fetch` request to the backend. on success, it fires a toast, the context api completely empties the cart and a `setTimeout` gives you a few seconds to see the success message before redirecting you home.

7. **tech advisor (`/advisor`):** 
    * **chat interface:** you can navigate to the chat page anytime, type a prompt, see a loading state ("Advisor is thinking...") and get a response containing a direct link to a recommended gadget.
    * **loading state:** when you type a prompt into the chat, the `isLoading` state disables the submit button while the ai thinks.
    * **generative ui:** it then renders the text and the direct links if a product is recommended.

8. **order history (`/order-history`):** 
    * **secure fetching:** you can navigate to this secure page to view your past purchases. it fires a manual fetch request to securely grab only your specific orders from the database.
    * **order receipts:** you can see your past receipts rendered dynamically as my code maps over the embedded `orderItems` array.
    * **snapshot usage:** you will see the snapshot historical price displayed next to the item name. so even if the prices changes later, this snapshot remains same.




# Testing

I have created (and used during code creation) test points (log statement) at multiple places in the code, I have not removed them. They are commented at the time of submission and can be uncommented for future debugging and code check. These code checks looks something like:

////////////TESTING
//console.log('TESTING: hero carousel rendered');
////////////


# References

* https://github.com/ed-roh/fullstack-admin
* https://stackoverflow.com/questions/68970499/how-to-get-http-only-cookie-in-react
* https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
* https://github.com/bradtraversy/proshop-v2
* https://github.com/joshu1024/Analytics-Dashboard---MERN
* https://github.com/MudassarNazir956/React_Admin_Dashboard
* https://github.com/betheashvin/mern-secure-auth
* https://github.com/piyush-eon/React-shopping-cart-context-with-reducer
* https://github.com/razak571/turboGPT
* https://github.com/deepankkartikey/AI-Coding-Assistant
* https://github.com/JamesBrill/react-speech-recognition
* https://github.com/Ashutoshsarangi/react-voice-navigator
* https://www.youtube.com/watch?v=HptuMAUaNGk
* https://www.youtube.com/watch?v=wrHTcjSZQ1Y
* https://www.youtube.com/watch?v=_FuDMEgIy7I
* https://stackoverflow.com/questions/64677212/how-to-configure-proxy-in-vite

