document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("flashcard-form");
    const list = document.getElementById("flashcard-list");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const question = document.getElementById("question").value;
        const answer = document.getElementById("answer").value;
        const category = document.getElementById("category").value;

        await fetch("http://localhost:5000/flashcards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, answer, category })
        });

        form.reset();
        loadFlashcards();
    });

    async function loadFlashcards() {
        const res = await fetch("http://localhost:5000/flashcards");
        const flashcards = await res.json();
        list.innerHTML = flashcards.map(fc => `
            <li>
                <strong>${fc.question}</strong> - ${fc.answer}
                <button onclick="deleteFlashcard('${fc._id}')">Delete</button>
            </li>
        `).join("");
    }

    window.deleteFlashcard = async (id) => {
        await fetch(`http://localhost:5000/flashcards/${id}`, { method: "DELETE" });
        loadFlashcards();
    };

    loadFlashcards();
});
