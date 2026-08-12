const API_URL = `http://${window.location.hostname}:3000`;

// Tester le backend
const checkButton = document.getElementById("checkBackend");
const result = document.getElementById("result");

checkButton.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();

        result.textContent = data.message;
    } catch (error) {
        result.textContent = "Impossible de contacter le backend.";
        console.error(error);
    }
});

// Charger les tâches
async function loadTasks() {
    const taskList = document.getElementById("taskList");

    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        const tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");

            li.innerHTML = `
                <span>${task.title}</span>
                <button onclick="deleteTask(${task.id})">
                    Supprimer
                </button>
            `;

            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des tâches :", error);
    }
}

// Ajouter une tâche
document.getElementById("addTask").addEventListener("click", async () => {
    const input = document.getElementById("taskTitle");
    const title = input.value.trim();

    if (!title) {
        alert("Veuillez saisir une tâche.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout");
        }

        input.value = "";

        await loadTasks();
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter la tâche.");
    }
});

// Supprimer une tâche
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/api/tasks/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression");
        }

        await loadTasks();
    } catch (error) {
        console.error(error);
        alert("Impossible de supprimer la tâche.");
    }
}

// Charger les tâches au démarrage
loadTasks();
