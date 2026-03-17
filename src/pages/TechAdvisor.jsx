import { useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

// goal: building the tech advisor page so users can chat with the ai.
// the idea is that when the backend tool calling returns a ui_component flag, i mount the actual product card right in the chat feed.
const TechAdvisor = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { sender: 'advisor', text: "Hi! I'm your Tech Advisor. Tell me what you're looking for, and I'll check the warehouse.", type: 'text' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    useDocumentTitle('Tech Advisor');

    const sendMessage = async () => {
        if (!input.trim()) return;

        // logic: optimistically updating the ui with the user's prompt so it feels instant.
        setMessages((prev) => [...prev, { sender: 'user', text: input, type: 'text' }]);
        const currentPrompt = input;
        setInput("");
        setIsTyping(true);

        try {
            // logic: hitting my secure express proxy route instead of exposing an api key.
            const res = await fetch('/api/chat/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: currentPrompt })
            });

            const data = await res.json();


            // logic: intercepting backend 500 errors before spreading them into state.
            // if res.ok is false, data has a 'message' property, not 'text'. we map it correctly here to prevent blank cards.
            if (!res.ok) {
                setMessages((prev) => [...prev, { sender: 'advisor', text: data.message || "Internal server error.", type: 'text' }]);
                return;
            }

            ////////////TESTING
            // console.log('TESTING: advisor response received:', data);
            ////////////

            // logic: appending the advisor's response. spreading the data object pulls in the text, type and the mongodb productData perfectly.
            setMessages((prev) => [...prev, { sender: 'advisor', ...data }]);

        } catch (error) {
            console.error("failed to fetch advisor response:", error);
            setMessages((prev) => [...prev, { sender: 'advisor', text: "Connection error. Please try again.", type: 'text' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="main_container">
            <h1>GadgetShack Tech Advisor</h1>

            {/* logic: utilizing existing card classes for the chat feed to avoid inline css */}
            <div className="card tech-advisor-feed">
                {messages.map((msg, index) => (
                    <div key={index} className="formBox">
                        <p className={msg.sender === 'user' ? "price" : "in-stock-text"}>
                            <strong>{msg.sender === 'user' ? 'You: ' : 'Advisor: '}</strong> {msg.text}
                        </p>

                        {/* logic: generative ui mapping. if the backend flagged this as a ui_component, we render the live product card! */}
                        {/* this forces the model to only recommend products that actually exist in my store. */}
                        {msg.type === 'ui_component' && msg.productData && (
                            <div className="products_container">
                                <ProductCard product={msg.productData} />
                            </div>
                        )}

                        {msg.type === 'ui_component' && !msg.productData && (
                            <p className="out-of-stock-text">Item out of stock or not found in warehouse.</p>
                        )}
                    </div>
                ))}

                {isTyping && <p className="loading-text">Advisor is thinking...</p>}
            </div>

            <div className="formBox">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask for a gadget recommendation..."
                    required
                />
                <button className="btn" onClick={sendMessage} disabled={isTyping}>
                    {isTyping ? 'Searching...' : 'Ask Advisor'}
                </button>
            </div>
        </div>
    );
};

export default TechAdvisor;