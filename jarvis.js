// Recupera gli elementi dalla pagina
const micButton = document.getElementById('micButton');
const outputDiv = document.getElementById('output');

// Verifica se il browser supporta l'API
if(!('webkitSpeechRecognition' in window)) {
    outputDiv.textContent = "Errore: Browser non supportato. Usa Chrome o Edge.";
    micButton.disabled = true; // Disabilita il bottone
} else {
    outputDiv.textContent = "Pronto all'uso! Clicca il microfono 🎤"
};


// Aggiunge un listener per il click sul bottone
micButton.addEventListener('click', () => {
    outputDiv.textContent = "Bottone cliccato!"
});