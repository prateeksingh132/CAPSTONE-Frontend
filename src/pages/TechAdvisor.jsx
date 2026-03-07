import { useState } from 'react';
import { Link } from 'react-router-dom';

// logic: building the frontend interface for my tech advisor.
// the idea is that users can type a question and my node backend talks to openai securely.
// https://github.com/razak571/turboGPT
// https://github.com/deepankkartikey/AI-Coding-Assistant
// https://www.youtube.com/watch?v=wrHTcjSZQ1Y

const TechAdvisor = () => {
    const [prompt, setPrompt] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!prompt) return;

        // logic: save the user message to the page right away so the ui feels fast
        const userMsg = { role: 'user', text: prompt };
        setChatHistory(prev => [...prev, userMsg]);
        setPrompt('');
        setIsLoading(true);

        try {
            // logic: sending a fetch request to my backend
            const res = await fetch('/api/chat/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMsg.text })
            });

            if (res.ok) {
                const data = await res.json();

                ////////////TESTING
                // console.log('TESTING: received advisor response:', data);
                ////////////

                const advisorMsg = {
                    role: 'advisor',
                    text: data.reply,
                    // logic: grabbing the product id so i can render a link to it later
                    productId: data.recommendedProductId
                };
                setChatHistory(prev => [...prev, advisorMsg]);
            } else {
                const errorMsg = { role: 'advisor', text: 'i am having trouble connecting to my database right now. try again later.' };
                setChatHistory(prev => [...prev, errorMsg]);
            }
        } catch (error) {
            const errorMsg = { role: 'advisor', text: 'network error. check your connection.' };
            setChatHistory(prev => [...prev, errorMsg]);
        }
        setIsLoading(false);
    };

    return (
        <div className="main_container">
            <h1>Ask Our Tech Advisor</h1>

            {/* logic: checking if history is empty to show a nice greeting using my pulsing class */}
            {chatHistory.length === 0 && (
                <h2 className="loading-text">Hello! I am the GadgetShack Tech Advisor. What are you looking for today?</h2>
            )}

            <div className="products-grid">
                {/* logic: mapping over the chat array and rendering cards for the messages */}
                {chatHistory.map((msg, index) => (
                    <div key={index} className="card">
                        <h3 className={msg.role === 'user' ? 'price' : 'in-stock-text'}>
                            {msg.role === 'user' ? 'You:' : 'Advisor:'}
                        </h3>
                        <p>{msg.text}</p>

                        {/* logic: if the advisor recommended a specific product from my db, i m gonna show a direct button link to it */}
                        {msg.productId && msg.productId !== 'null' && (
                            <Link to={`/product/${msg.productId}`} className="btn">
                                View Recommended Product
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {isLoading && <p className="loading-text">Advisor is thinking...</p>}

            <div className="formBox">
                <form onSubmit={submitHandler}>
                    <input
                        type="text"
                        placeholder="e.g., I need a cheap laptop for school..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <button type="submit" className="btn" disabled={isLoading || !prompt}>
                        {isLoading ? 'Sending...' : 'Ask'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TechAdvisor;