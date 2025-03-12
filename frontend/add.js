document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api";
    const flashcardForm = document.getElementById("flashcard-form");
    const flashcardList = document.getElementById("flashcard-list");
    const flashcardCount = document.getElementById("flashcard-count");
    const messageDiv = document.getElementById("flashcard-message");

    // Ładowanie fiszek
    async function loadFlashcards() {
        try {
            const response = await fetch(`${API_URL}/flashcards`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const flashcards = await response.json();
            flashcardList.innerHTML = flashcards.map(fc => `
                <div class="flashcard">
                    <strong>${fc.question}</strong> - ${fc.answer} <em>(${fc.category})</em>
                    <button onclick="deleteFlashcard('${fc._id}')">Usuń</button>
                </div>
            `).join("");
            flashcardCount.textContent = `Liczba fiszek: ${flashcards.length}`;
        } catch (err) {
            console.error("Błąd:", err);
            messageDiv.textContent = "Wystąpił błąd podczas ładowania fiszek.";
            messageDiv.style.color = "#E74C3C";
        }
    }

    // Dodawanie fiszki
    flashcardForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const flashcard = {
            question: document.getElementById("question").value,
            answer: document.getElementById("answer").value,
            category: document.getElementById("category").value
        };

        try {
            const response = await fetch(`${API_URL}/add-flashcard`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(flashcard)
            });

            if (response.status === 201) {
                messageDiv.textContent = "Dodano fiszkę!";
                messageDiv.style.color = "#27AE60";
                flashcardForm.reset();
                loadFlashcards();
            } else {
                const errorData = await response.json();
                messageDiv.textContent = "Wystąpił błąd: " + errorData.error;
                messageDiv.style.color = "#E74C3C";
            }
        } catch (err) {
            console.error("Błąd:", err);
            messageDiv.textContent = "Wystąpił błąd podczas dodawania fiszki.";
            messageDiv.style.color = "#E74C3C";
        }
    });

    // Usuwanie fiszki
    window.deleteFlashcard = async (id) => {
        try {
            await fetch(`${API_URL}/flashcards/${id}`, { method: "DELETE" });
            loadFlashcards();
        } catch (err) {
            console.error("Błąd:", err);
        }
    };

    // Załaduj fiszki po załadowaniu strony
    loadFlashcards();
});