// ==========================================
// 1. VARIABILI GLOBALI
// ==========================================
const micButton = document.getElementById('micButton');
const outputDiv = document.getElementById('output');
let recognition;
const SILENCE_TIMEOUT_MS = 3000; // 3 secondi di timeout

// ==========================================
// 2. INIZIALIZZAZIONE E CONTROLLO BROWSER
// ==========================================
if (!('webkitSpeechRecognition' in window)) {
    outputDiv.textContent = "Errore: Browser non supportato. Usa Chrome o Edge.";
    micButton.disabled = true;
} else {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'it-IT';
    recognition.interimResults = false; // Solo risultati finali
    recognition.continuous = false; // Ferma l'ascolto dopo la prima frase

    // ==========================================
    // 3. GESTIONE EVENTI
    // ==========================================
    let silenceTimer;

    // Avvia l'ascolto con timer di sicurezza
    micButton.addEventListener('click', () => {
        outputDiv.textContent = "In ascolto... parla ora!";
        recognition.start();
        
        silenceTimer = setTimeout(() => {
            recognition.stop();
            outputDiv.textContent += "\nMicrofono disattivato (nessuna voce rilevata).";
        }, SILENCE_TIMEOUT_MS);
    });

    // Risultato riconosciuto
    recognition.onresult = (event) => {
        clearTimeout(silenceTimer); // Cancella il timer
        const transcript = event.results[0][0].transcript;
        outputDiv.textContent = `Tu: "${transcript}"`;
    };

    // Microfono rilasciato (nativo)
    recognition.onspeechend = () => {
        recognition.stop();
    };

    // Gestione errori
    recognition.onerror = (event) => {
        clearTimeout(silenceTimer);
        if (event.error === "no-speech") {
            outputDiv.textContent = "Nessuna voce rilevata. Riprova.";
        } else {
            outputDiv.textContent = "Errore: " + event.error;
        }
    };
}