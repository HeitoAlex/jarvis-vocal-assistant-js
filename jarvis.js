// ==========================================
// 1. VARIABILI GLOBALI
// ==========================================
const micButton = document.getElementById('micButton');
const outputDiv = document.getElementById('output');
let recognition;
const SILENCE_TIMEOUT_MS = 3000; // 3 secondi di timeout
let synth = window.speechSynthesis;

// Dizionario romanesco (traduttore automatico)
const romanDictionary = {
    "il": "er", "lo": "'o", "la": "'a", 
    "per": "pe'", "ciao": "aò", "grazie": "grazie ar cazzo", 
    "andare": "annà", "fare": "fà", "vai": "và", 
    "scusa": "scusame", "per favore": "pe' piacere"
};

// Risposte preimpostate in romanesco
const romanResponses = {
    "che ore sono": "Mo' te 'o dico... so' e {ora}",
    "accendi la luce": "Ma accennila te... (pause) vabbè pe' stavorta faccio io",
    "cerca *": "Mo' cerco '{query}'... ma nun sarebbe meglio annà a fa' na passeggiata?",
    "default": "Nun ho capito, c'hai detto?",
    "forza roma": "Sempre Maggicaaaa!"
}; 

// ===== FUNZIONI =====
function toRomanesco(text) {
    let romanText = text.toLowerCase();
    Object.entries(romanDictionary).forEach(([key, val]) => {
        romanText = romanText.replace(new RegExp(`\\b${key}\\b`, 'gi'), val);
    });
    return romanText;
}

function getRomanResponse(command, params = {}) {
    let response = romanResponses[command] || romanResponses.default;
    Object.entries(params).forEach(([key, val]) => {
        response = response.replace(`{${key}}`, val);
    });
    return response;
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const voice = voices.find(v => v.lang === 'it-IT') || voices[0];
    
    if (voice) {
        utterance.voice = voice;
        utterance.pitch = 0.8;  // Tono grave
        utterance.rate = 0.9;   // Parlata lenta
        utterance.volume = 0.8; // Voce "sottotono"
    }
    
    synth.speak(utterance);
}

// ===== INIZIALIZZAZIONE =====
if (!('webkitSpeechRecognition' in window)) {
    outputDiv.textContent = "Browser non supportato. Usa Chrome o Edge.";
    micButton.disabled = true;
} else {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'it-IT';
    recognition.interimResults = false;
    recognition.continuous = false;

    // ===== EVENTI =====
    let silenceTimer;
    micButton.addEventListener('click', () => {
        outputDiv.textContent = "In ascolto... parla ora!";
        recognition.start();
        
        silenceTimer = setTimeout(() => {
            recognition.stop();
            outputDiv.textContent += "\nNun ho sentito niente...";
        }, SILENCE_TIMEOUT_MS);
    });

    recognition.onresult = (event) => {
        clearTimeout(silenceTimer);
        const transcript = event.results[0][0].transcript.toLowerCase();
        outputDiv.textContent = `Tu: "${transcript}"`;
        
        // Risposta ibrida
        let response;
        if (romanResponses[transcript]) {
            const ora = new Date().getHours() + " e " + new Date().getMinutes();
            response = getRomanResponse(transcript, { ora, query: transcript.split('cerca ')[1] });
        } else {
            response = toRomanesco("Hai detto: " + transcript);
        }
        
        outputDiv.textContent += `\nJarvis: "${response}"`;
        speak(response);
    };

    recognition.onspeechend = () => recognition.stop();
    recognition.onerror = (event) => {
        clearTimeout(silenceTimer);
        outputDiv.textContent = event.error === "no-speech" 
            ? "Nun ho sentito niente..." 
            : "Errore: " + event.error;
    };
}