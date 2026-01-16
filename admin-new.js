// Données des médecins
const doctors = {
  psychologue: [
    {
      id: "psy-1",
      name: "Madame Lemaire",
      speciality: "Psychologue",
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
      id: "psy-2",
      name: "Monsieur André",
      speciality: "Psychologue",
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
      id: "psy-3",
      name: "Madame Honoré",
      speciality: "Psychologue",
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
      id: "psy-4",
      name: "Madame Garnier",
      speciality: "Psychologue",
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
};

const STORAGE_KEY = "medecin_horaires";
const STORAGE_DAY_KEY = "medecin_horaires_day";

let state = {
  currentDoctor: null,
  currentMonth: new Date(),
  selectedDate: null,
  dayHoraires: {},
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  loadCachedHoraires();
  initializeDoctorSelect();
  attachEventListeners();
});

// Charger les horaires en cache
function loadCachedHoraires() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
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

// Initialiser le sélecteur
function initializeDoctorSelect() {
  const select = document.getElementById("doctor-select");
  const allDoctors = [];

  for (const speciality in doctors) {
    doctors[speciality].forEach((doctor) => {
      allDoctors.push({ ...doctor, speciality });
    });
  }

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
  let selectedDoctor = null;
  for (const speciality in doctors) {
    selectedDoctor = doctors[speciality].find((d) => d.id === doctorId);
    if (selectedDoctor) break;
  }

  if (!selectedDoctor) return;

  state.currentDoctor = selectedDoctor;
  state.currentMonth = new Date();
  state.selectedDate = null;
  state.dayHoraires = {};

  document.getElementById("admin-panel").classList.remove("hidden");
  document.getElementById("no-selection").style.display = "none";

  document.getElementById("doctor-display-name").textContent =
    selectedDoctor.name;
  document.getElementById("doctor-speciality").textContent =
    selectedDoctor.speciality;

  document.getElementById("admin-horaires-section").style.display = "none";

  renderCalendar();
  renderRDVsList();
}

// Vider la sélection
function clearSelection() {
  state.currentDoctor = null;
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("no-selection").style.display = "block";
}

// Afficher le calendrier
function renderCalendar() {
  const year = state.currentMonth.getFullYear();
  const month = state.currentMonth.getMonth();

  const monthName = new Date(year, month).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  document.getElementById("admin-current-month").textContent =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const calendarDays = document.getElementById("admin-calendar-days");
  calendarDays.innerHTML = "";

  // Jours du mois précédent
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayEl = document.createElement("div");
    dayEl.className = "admin-calendar-day other-month";
    dayEl.textContent = daysInPrevMonth - i;
    calendarDays.appendChild(dayEl);
  }

  // Jours du mois actuel
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEl = document.createElement("div");
    dayEl.className = "admin-calendar-day";
    dayEl.textContent = day;

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      dayEl.classList.add("today");
    }

    dayEl.addEventListener("click", () => selectDate(date));

    if (
      state.selectedDate &&
      date.getDate() === state.selectedDate.getDate() &&
      date.getMonth() === state.selectedDate.getMonth() &&
      date.getFullYear() === state.selectedDate.getFullYear()
    ) {
      dayEl.classList.add("selected");
    }

    calendarDays.appendChild(dayEl);
  }

  // Jours du mois suivant
  const totalCells = calendarDays.children.length + daysInMonth - (firstDay - 1);
  const cellsNeeded = Math.ceil(totalCells / 7) * 7;
  for (let day = 1; day <= cellsNeeded - totalCells; day++) {
    const dayEl = document.createElement("div");
    dayEl.className = "admin-calendar-day other-month";
    dayEl.textContent = day;
    calendarDays.appendChild(dayEl);
  }
}

// Sélectionner une date
function selectDate(date) {
  state.selectedDate = date;

  const dateStr = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("selected-day-display").textContent =
    dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  renderCalendar();
  renderDayHoraires();

  document.getElementById("admin-horaires-section").style.display = "block";
  document.getElementById("admin-horaires-section").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Afficher les horaires du jour sélectionné
function renderDayHoraires() {
  const dateKey = state.selectedDate.toISOString().split("T")[0];

  // Charger les horaires du jour depuis le cache
  const stored = localStorage.getItem(STORAGE_DAY_KEY);
  let dayData = {};

  if (stored) {
    try {
      dayData = JSON.parse(stored);
    } catch (e) {
      console.error("Erreur lecture cache jour:", e);
    }
  }

  const doctorDayKey = `${state.currentDoctor.id}_${dateKey}`;
  state.dayHoraires = dayData[doctorDayKey]
    ? [...dayData[doctorDayKey]]
    : [...state.currentDoctor.horaires];

  renderHorairesList();
  clearDayStatusMessage();
}

// Afficher la liste des horaires
function renderHorairesList() {
  const list = document.getElementById("day-horaires-list");
  list.innerHTML = "";

  state.dayHoraires.forEach((horaire, index) => {
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

  if (state.dayHoraires.length === 0) {
    const empty = document.createElement("p");
    empty.style.color = "#999";
    empty.style.fontStyle = "italic";
    empty.textContent = "Aucun horaire défini pour ce jour.";
    list.appendChild(empty);
  }
}

// Ajouter un horaire
function addHoraire() {
  const input = document.getElementById("new-day-horaire");
  const value = input.value.trim();

  if (!value) {
    showDayStatus("Veuillez entrer un horaire", "error");
    return;
  }

  if (state.dayHoraires.includes(value)) {
    showDayStatus("Cet horaire existe déjà", "error");
    return;
  }

  state.dayHoraires.push(value);
  input.value = "";
  renderHorairesList();
  showDayStatus("Horaire ajouté !", "success");
}

// Supprimer un horaire
function removeHoraire(index) {
  state.dayHoraires.splice(index, 1);
  renderHorairesList();
  showDayStatus("Horaire supprimé", "success");
}

// Sauvegarder les horaires du jour
function saveDayHoraires() {
  if (!state.currentDoctor || !state.selectedDate || state.dayHoraires.length === 0) {
    showDayStatus("Veuillez définir au moins un horaire", "error");
    return;
  }

  const dateKey = state.selectedDate.toISOString().split("T")[0];
  const doctorDayKey = `${state.currentDoctor.id}_${dateKey}`;

  let dayData = {};
  const stored = localStorage.getItem(STORAGE_DAY_KEY);
  if (stored) {
    try {
      dayData = JSON.parse(stored);
    } catch (e) {}
  }

  dayData[doctorDayKey] = state.dayHoraires;
  localStorage.setItem(STORAGE_DAY_KEY, JSON.stringify(dayData));

  showDayStatus("✓ Horaires du jour enregistrés !", "success");
}

// Réinitialiser les horaires du jour
function resetDayHoraires() {
  if (
    confirm(
      "Êtes-vous sûr de vouloir réinitialiser les horaires de ce jour ? Cette action est irréversible."
    )
  ) {
    const dateKey = state.selectedDate.toISOString().split("T")[0];
    const doctorDayKey = `${state.currentDoctor.id}_${dateKey}`;

    let dayData = {};
    const stored = localStorage.getItem(STORAGE_DAY_KEY);
    if (stored) {
      try {
        dayData = JSON.parse(stored);
      } catch (e) {}
    }

    delete dayData[doctorDayKey];
    localStorage.setItem(STORAGE_DAY_KEY, JSON.stringify(dayData));

    state.dayHoraires = [...state.currentDoctor.horaires];
    renderHorairesList();
    showDayStatus(
      "✓ Horaires du jour réinitialisés aux valeurs par défaut !",
      "success"
    );
  }
}

// Afficher un message
function showDayStatus(message, type) {
  const element = document.getElementById("day-status-message");
  element.textContent = message;
  element.className = `status-message ${type}`;

  setTimeout(() => {
    clearDayStatusMessage();
  }, 5000);
}

// Effacer le message
function clearDayStatusMessage() {
  const element = document.getElementById("day-status-message");
  element.className = "status-message";
  element.textContent = "";
}

// Attacher les event listeners
function attachEventListeners() {
  document.getElementById("admin-prev-month").addEventListener("click", () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("admin-next-month").addEventListener("click", () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById("add-day-horaire-btn").addEventListener("click", addHoraire);

  document
    .getElementById("new-day-horaire")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addHoraire();
      }
    });

  document
    .getElementById("save-day-horaires-btn")
    .addEventListener("click", saveDayHoraires);
  document
    .getElementById("reset-day-horaires-btn")
    .addEventListener("click", resetDayHoraires);

  document
    .getElementById("back-to-calendar-btn")
    .addEventListener("click", () => {
      document.getElementById("admin-horaires-section").style.display = "none";
      state.selectedDate = null;
      renderCalendar();
    });
}

// Afficher les RDV du médecin
function renderRDVsList() {
  const RDVS_STORAGE_KEY = "patient_rdvs";
  const stored = localStorage.getItem(RDVS_STORAGE_KEY);
  let allRdvs = [];

  if (stored) {
    try {
      allRdvs = JSON.parse(stored);
    } catch (e) {}
  }

  // Filtrer les RDV pour ce médecin et trier par date
  const doctorRdvs = allRdvs
    .filter((rdv) => rdv.doctorId === state.currentDoctor.id)
    .sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));

  const rdvsList = document.getElementById("rdvs-list");
  rdvsList.innerHTML = "";

  if (doctorRdvs.length === 0) {
    rdvsList.innerHTML = '<div class="rdvs-empty">Aucun rendez-vous pris</div>';
    return;
  }

  doctorRdvs.forEach((rdv) => {
    const dateObj = new Date(rdv.date + "T00:00:00");
    const dateStr = dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const item = document.createElement("div");
    item.className = "rdv-item";
    item.innerHTML = `
      <div class="rdv-item-info">
        <div class="rdv-item-date">${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} à ${rdv.time}</div>
        <div class="rdv-item-details">Patient RDV #${rdv.id.slice(-6)}</div>
      </div>
      <div class="rdv-item-actions">
        <button class="btn-cancel-rdv" data-rdv-id="${rdv.id}" title="Annuler ce RDV">✕ Annuler</button>
      </div>
    `;

    item
      .querySelector(".btn-cancel-rdv")
      .addEventListener("click", () => {
        cancelRDV(rdv.id);
      });

    rdvsList.appendChild(item);
  });
}

// Annuler un RDV
function cancelRDV(rdvId) {
  if (confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
    const RDVS_STORAGE_KEY = "patient_rdvs";
    let allRdvs = [];
    const stored = localStorage.getItem(RDVS_STORAGE_KEY);

    if (stored) {
      try {
        allRdvs = JSON.parse(stored);
      } catch (e) {}
    }

    allRdvs = allRdvs.filter((rdv) => rdv.id !== rdvId);
    localStorage.setItem(RDVS_STORAGE_KEY, JSON.stringify(allRdvs));

    renderRDVsList();
    showDayStatus("✓ Rendez-vous annulé", "success");
  }
}

// Échapper HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
