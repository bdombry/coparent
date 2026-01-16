// Données des médecins (à synchroniser avec rdv.js)
const doctors = {
  psychologue: [
    {
      id: "psy-1",
      name: "Dr. Marie Dupont",
      speciality: "Psychologue",
      horaires: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
      ],
    },
    {
      id: "psy-2",
      name: "Dr. Jean Leblanc",
      speciality: "Psychologue",
      horaires: [
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "15:00",
        "16:00",
        "16:30",
      ],
    },
  ],
  gyneco: [
    {
      id: "gyn-1",
      name: "Madame Lemaire",
      speciality: "Gynécologue",
      horaires: [
        "07:00 – 08:00 Couple",
        "08:00 – 08:45 Grossesse",
        "09:00 – 10:00 Couple",
        "10:00 – 10:45 Grossesse",
        "12:00 – 13:00 Couple",
        "13:00 – 13:45 Grossesse",
        "14:00 – 15:00 Couple",
      ],
    },
    {
      id: "gyn-2",
      name: "Monsieur André",
      speciality: "Gynécologue",
      horaires: [
        "09:00 – 10:00 Couple",
        "10:00 – 10:45 Grossesse",
        "11:00 – 12:00 Couple",
        "13:30 – 14:30 Couple",
        "14:30 – 15:15 Grossesse",
        "15:30 – 16:30 Couple",
        "16:30 – 17:15 Grossesse",
        "17:15 – 18:00 Grossesse",
      ],
    },
    {
      id: "gyn-3",
      name: "Madame Honoré",
      speciality: "Gynécologue",
      horaires: [
        "11:00 – 12:00 Couple",
        "12:00 – 12:45 Grossesse",
        "13:00 – 14:00 Couple",
        "14:00 – 14:45 Grossesse",
        "15:00 – 16:00 Couple",
        "16:00 – 16:45 Grossesse",
        "17:00 – 18:00 Couple",
        "18:00 – 18:45 Grossesse",
      ],
    },
    {
      id: "gyn-4",
      name: "Madame Garnier",
      speciality: "Gynécologue",
      horaires: [
        "09:00 – 10:00 Couple",
        "10:00 – 10:45 Grossesse",
        "10:45 – 11:30 Grossesse",
        "13:30 – 14:30 Couple",
        "14:30 – 15:15 Grossesse",
        "15:30 – 16:30 Couple",
        "16:30 – 17:15 Grossesse",
        "17:30 – 18:30 Couple",
        "18:30 – 19:00 Edge case",
      ],
    },
  ],
  pediatre: [
    {
      id: "ped-1",
      name: "Dr. Nathalie Bonnet",
      speciality: "Pédiatre",
      horaires: [
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
      ],
    },
    {
      id: "ped-2",
      name: "Dr. Laurent Moreau",
      speciality: "Pédiatre",
      horaires: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
      ],
    },
  ],
};

// Clé de stockage localStorage
const STORAGE_KEY = "medecin_horaires";

let currentDoctor = null;
let currentHoraires = [];

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  initializeDoctorSelect();
  attachEventListeners();
  loadCachedHoraires();
});

// Initialiser le sélecteur de médecin
function initializeDoctorSelect() {
  const select = document.getElementById("doctor-select");

  // Aplatir la liste des médecins
  const allDoctors = [];
  for (const speciality in doctors) {
    doctors[speciality].forEach((doctor) => {
      allDoctors.push({
        ...doctor,
        speciality: speciality,
      });
    });
  }

  // Remplir le sélecteur
  allDoctors.forEach((doctor) => {
    const option = document.createElement("option");
    option.value = doctor.id;
    option.textContent = `${doctor.name} (${doctor.speciality})`;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    if (e.target.value) {
      selectDoctor(e.target.value);
    } else {
      clearSelection();
    }
  });
}

// Sélectionner un médecin
function selectDoctor(doctorId) {
  // Trouver le médecin
  let selectedDoctor = null;
  for (const speciality in doctors) {
    selectedDoctor = doctors[speciality].find((d) => d.id === doctorId);
    if (selectedDoctor) break;
  }

  if (!selectedDoctor) return;

  currentDoctor = selectedDoctor;

  // Afficher le panneau
  document.getElementById("admin-panel").classList.remove("hidden");
  document.getElementById("no-selection").style.display = "none";

  // Mettre à jour les infos
  document.getElementById("doctor-display-name").textContent =
    selectedDoctor.name;
  document.getElementById("doctor-speciality").textContent =
    selectedDoctor.speciality;

  // Charger les horaires (du cache ou par défaut)
  loadHoraires();
}

// Vider la sélection
function clearSelection() {
  currentDoctor = null;
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("no-selection").style.display = "block";
  clearStatusMessage();
}

// Charger les horaires
function loadHoraires() {
  if (!currentDoctor) return;

  // Essayer de charger du cache
  const cached = getCachedHoraires(currentDoctor.id);
  if (cached) {
    currentHoraires = cached;
  } else {
    currentHoraires = [...currentDoctor.horaires];
  }

  renderHoraires();
  clearStatusMessage();
}

// Obtenir les horaires en cache
function getCachedHoraires(doctorId) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  const data = JSON.parse(stored);
  return data[doctorId] || null;
}

// Sauvegarder les horaires en cache
function setCachedHoraires(doctorId, horaires) {
  let data = {};
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    data = JSON.parse(stored);
  }

  data[doctorId] = horaires;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Afficher les horaires
function renderHoraires() {
  const list = document.getElementById("horaires-list");
  list.innerHTML = "";

  currentHoraires.forEach((horaire, index) => {
    const item = document.createElement("div");
    item.className = "horaire-item";
    item.innerHTML = `
      <span>${escapeHtml(horaire)}</span>
      <button class="horaire-remove" data-index="${index}" title="Supprimer">×</button>
    `;

    item.querySelector(".horaire-remove").addEventListener("click", () => {
      removeHoraire(index);
    });

    list.appendChild(item);
  });

  // Message si liste vide
  if (currentHoraires.length === 0) {
    const empty = document.createElement("p");
    empty.style.color = "#999";
    empty.style.fontStyle = "italic";
    empty.textContent = "Aucun horaire défini. Ajoutez-en un pour commencer.";
    list.appendChild(empty);
  }
}

// Ajouter un horaire
function addHoraire() {
  const input = document.getElementById("new-horaire");
  const value = input.value.trim();

  if (!value) {
    showStatus("Veuillez entrer un horaire", "error");
    return;
  }

  if (currentHoraires.includes(value)) {
    showStatus("Cet horaire existe déjà", "error");
    return;
  }

  currentHoraires.push(value);
  input.value = "";
  renderHoraires();
  showStatus("Horaire ajouté !", "success");
}

// Supprimer un horaire
function removeHoraire(index) {
  currentHoraires.splice(index, 1);
  renderHoraires();
  showStatus("Horaire supprimé", "success");
}

// Sauvegarder les modifications
function saveModifications() {
  if (!currentDoctor || currentHoraires.length === 0) {
    showStatus(
      "Veuillez définir au moins un horaire",
      "error"
    );
    return;
  }

  // Sauvegarder en cache
  setCachedHoraires(currentDoctor.id, currentHoraires);

  // Aussi sauvegarder dans l'objet doctors global (pour rdv.js)
  for (const speciality in doctors) {
    const doctor = doctors[speciality].find((d) => d.id === currentDoctor.id);
    if (doctor) {
      doctor.horaires = [...currentHoraires];
      break;
    }
  }

  showStatus("✓ Horaires enregistrés avec succès !", "success");
}

// Réinitialiser aux horaires par défaut
function resetHoraires() {
  if (!currentDoctor) return;

  if (
    confirm(
      "Êtes-vous sûr de vouloir réinitialiser aux horaires par défaut ? Cette action est irréversible."
    )
  ) {
    // Trouver l'objet original
    let original = null;
    for (const speciality in doctors) {
      // Récupérer une copie par défaut
      const doctorIndex = doctors[speciality].findIndex(
        (d) => d.id === currentDoctor.id
      );
      if (doctorIndex !== -1) {
        // Revenir à la version initiale (première charge)
        original = doctors[speciality][doctorIndex];
        break;
      }
    }

    if (original) {
      // Trouver la valeur par défaut dans le code initial
      const defaultHoraires = getDefaultHoraires(currentDoctor.id);
      currentHoraires = [...defaultHoraires];

      // Supprimer du cache
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        delete data[currentDoctor.id];
        if (Object.keys(data).length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      renderHoraires();
      showStatus("✓ Horaires réinitialisés aux valeurs par défaut !", "success");
    }
  }
}

// Obtenir les horaires par défaut
function getDefaultHoraires(doctorId) {
  const defaults = {
    "psy-1": [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
    ],
    "psy-2": [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "14:00",
      "15:00",
      "16:00",
      "16:30",
    ],
    "gyn-1": [
      "07:00 – 08:00 Couple",
      "08:00 – 08:45 Grossesse",
      "09:00 – 10:00 Couple",
      "10:00 – 10:45 Grossesse",
      "12:00 – 13:00 Couple",
      "13:00 – 13:45 Grossesse",
      "14:00 – 15:00 Couple",
    ],
    "gyn-2": [
      "09:00 – 10:00 Couple",
      "10:00 – 10:45 Grossesse",
      "11:00 – 12:00 Couple",
      "13:30 – 14:30 Couple",
      "14:30 – 15:15 Grossesse",
      "15:30 – 16:30 Couple",
      "16:30 – 17:15 Grossesse",
      "17:15 – 18:00 Grossesse",
    ],
    "gyn-3": [
      "11:00 – 12:00 Couple",
      "12:00 – 12:45 Grossesse",
      "13:00 – 14:00 Couple",
      "14:00 – 14:45 Grossesse",
      "15:00 – 16:00 Couple",
      "16:00 – 16:45 Grossesse",
      "17:00 – 18:00 Couple",
      "18:00 – 18:45 Grossesse",
    ],
    "gyn-4": [
      "09:00 – 10:00 Couple",
      "10:00 – 10:45 Grossesse",
      "10:45 – 11:30 Grossesse",
      "13:30 – 14:30 Couple",
      "14:30 – 15:15 Grossesse",
      "15:30 – 16:30 Couple",
      "16:30 – 17:15 Grossesse",
      "17:30 – 18:30 Couple",
      "18:30 – 19:00 Edge case",
    ],
    "ped-1": [
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
    ],
    "ped-2": [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
    ],
  };

  return defaults[doctorId] || [];
}

// Afficher un message de statut
function showStatus(message, type) {
  const element = document.getElementById("status-message");
  element.textContent = message;
  element.className = `status-message ${type}`;

  // Effacer après 5 secondes
  setTimeout(() => {
    clearStatusMessage();
  }, 5000);
}

// Effacer le message de statut
function clearStatusMessage() {
  const element = document.getElementById("status-message");
  element.className = "status-message";
  element.textContent = "";
}

// Attacher les event listeners
function attachEventListeners() {
  document
    .getElementById("add-horaire-btn")
    .addEventListener("click", addHoraire);

  document
    .getElementById("new-horaire")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addHoraire();
      }
    });

  document.getElementById("save-btn").addEventListener("click", saveModifications);
  document.getElementById("reset-btn").addEventListener("click", resetHoraires);
}

// Charger les horaires en cache au démarrage
function loadCachedHoraires() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Mettre à jour les objets doctors avec les versions en cache
      for (const doctorId in data) {
        for (const speciality in doctors) {
          const doctor = doctors[speciality].find((d) => d.id === doctorId);
          if (doctor) {
            doctor.horaires = data[doctorId];
            break;
          }
        }
      }
    } catch (e) {
      console.error("Erreur lors du chargement du cache:", e);
    }
  }
}

// Utilitaire pour échapper les caractères HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
