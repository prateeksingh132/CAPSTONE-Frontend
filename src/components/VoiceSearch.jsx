import { useState } from 'react';

// logic: i am building a voice search component using the native browser web speech api. 
// https://github.com/JamesBrill/react-speech-recognition
// https://github.com/Ashutoshsarangi/react-voice-navigator
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
// https://stackoverflow.com/questions/64181012/web-speech-api-speechrecognition-not-defined-when-using-react-js

const VoiceSearch = ({ keyword, setKeyword }) => {
    const [isListening, setIsListening] = useState(false);

    const startVoiceSearch = (e) => {
        e.preventDefault();

        // logic: using the native speech recognition api from the window object.
        // i have to check for the webkit prefix bcuz google chrome and safari use it.
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('your browser does not support voice search. try google chrome.');
            return;
        }

        const recognition = new SpeechRecognition();

        // logic: i just want it to capture one single phrase and stop, not listen forever in the background.
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);

            ////////////TESTING
            // console.log('TESTING: microphone activated, listening for user search query...');
            ////////////
        };

        recognition.onresult = (event) => {
            // logic: extracting the text from the speech event payload.
            const transcript = event.results[0][0].transcript;

            // logic: voice dictation sometimes adds weird trailing periods. i am using a quick regex to strip them off so my backend fuzzy search works perfectly.
            const cleanTranscript = transcript.replace(/\.$/, '');

            // logic: setting the cleaned text as my search keyword to trigger the rtk query fetch.
            setKeyword(cleanTranscript);
            setIsListening(false);

            ////////////TESTING
            // console.log('TESTING: voice search captured:', cleanTranscript);
            ////////////
        };

        recognition.onerror = (event) => {
            console.error('speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        // logic: physically turning the mic on
        recognition.start();
    };

    return (
        <div className="formBox">
            <input
                type="text"
                placeholder="Search gadgets (e.g., 'laptop')..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button
                className="btn"
                onClick={startVoiceSearch}
            >
                {isListening ? 'Listening...' : '🎤 Voice Search'}
            </button>
        </div>
    );
};

export default VoiceSearch;