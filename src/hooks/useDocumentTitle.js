import { useEffect } from 'react';

// logic: i am making a custom hook to dynamically change the browser tab title.
// generally we see the default tab title, as localhost:5173.... 
const useDocumentTitle = (title) => {
    useEffect(() => {
        document.title = `GadgetShack | ${title}`;

        ////////////TESTING
        // console.log(`TESTING: browser tab title updated to: ${title}`);
        ////////////
    }, [title]);
};

export default useDocumentTitle;