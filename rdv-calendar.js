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

let state = {
  selectedDoctor: null,
  selectedDate: null,
  selectedTime: null,
  currentMonth: new Date(),
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  loadCachedHoraires();
  renderDoctorsList();
  attachEventListeners();
  showStep("step-doctor");
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

// Afficher la liste des médecins
function renderDoctorsList() {
  const grid = document.getElementById("doctors-grid");
  grid.innerHTML = "";

  // Aplatir la liste
  const allDoctors = [];
  for (const speciality in doctors) {
    doctors[speciality].forEach((doctor) => {
      allDoctors.push({
        ...doctor,
        speciality: speciality,
      });
    });
  }

  allDoctors.forEach((doctor) => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML = `
      <h3>${doctor.name}</h3>
      <p>${doctor.speciality}</p>
    `;

    card.addEventListener("click", () => selectDoctor(doctor));
    grid.appendChild(card);
  });
}

// Sélectionner un médecin
function selectDoctor(doctor) {
  state.selectedDoctor = doctor;
  state.selectedDate = null;
  state.selectedTime = null;
  state.currentMonth = new Date();

  // Mettre à jour l'affichage
  document.querySelectorAll(".doctor-card").forEach((card) => {
    card.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");

  document.getElementById("selected-doctor-name").textContent = doctor.name;
  document.getElementById("selected-doctor-speciality").textContent =
    doctor.speciality;

  renderCalendar();
  showStep("step-calendar");
}

// Afficher le calendrier
function renderCalendar() {
  const year = state.currentMonth.getFullYear();
  const month = state.currentMonth.getMonth();

  // Mettre à jour le titre
  const monthName = new Date(year, month).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  document.getElementById("current-month").textContent =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Premier jour du mois et nombre de jours
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const calendarDays = document.getElementById("calendar-days");
  calendarDays.innerHTML = "";

  // Jours du mois précédent
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dayEl = document.createElement("div");
    dayEl.className = "calendar-day other-month";
    dayEl.textContent = day;
    calendarDays.appendChild(dayEl);
  }

  // Jours du mois actuel
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEl = document.createElement("div");
    dayEl.className = "calendar-day";
    dayEl.textContent = day;

    // Vérifier si c'est aujourd'hui
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      dayEl.classList.add("today");
    }

    // Désactiver les jours passés
    if (date < today) {
      dayEl.classList.add("disabled");
    } else {
      dayEl.addEventListener("click", () => selectDate(date));
    }

    // Mettre en surbrillance le jour sélectionné
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
    dayEl.className = "calendar-day other-month";
    dayEl.textContent = day;
    calendarDays.appendChild(dayEl);
  }
}

// Sélectionner une date
function selectDate(date) {
  state.selectedDate = date;
  state.selectedTime = null;
  renderCalendar();
  renderTimes();
  showStep("step-times");
}

// Afficher les horaires disponibles
function renderTimes() {
  const dateStr = state.selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("selected-date-display").textContent =
    dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const timesGrid = document.getElementById("times-grid");
  timesGrid.innerHTML = "";

  state.selectedDoctor.horaires.forEach((time) => {
    const slot = document.createElement("div");
    slot.className = "time-slot";
    slot.textContent = time;

    if (state.selectedTime === time) {
      slot.classList.add("selected");
    }

    slot.addEventListener("click", () => selectTime(time));
    timesGrid.appendChild(slot);
  });
}

// Sélectionner une heure
function selectTime(time) {
  state.selectedTime = time;
  renderTimes();
  showConfirmation();
}

// Afficher la confirmation
function showConfirmation() {
  const dateStr = state.selectedDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const details = document.getElementById("confirmation-details");
  details.innerHTML = `
    <p><strong>Médecin :</strong> ${state.selectedDoctor.name}</p>
    <p><strong>Spécialité :</strong> ${state.selectedDoctor.speciality}</p>
    <p><strong>Date :</strong> ${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</p>
    <p><strong>Heure :</strong> ${state.selectedTime}</p>
  `;

  // Sauvegarder le RDV
  saveRDV();

  showStep("step-confirmation");
}

// Sauvegarder le RDV
function saveRDV() {
  const RDVS_STORAGE_KEY = "patient_rdvs";
  
  const rdv = {
    id: Date.now().toString(),
    doctorId: state.selectedDoctor.id,
    doctorName: state.selectedDoctor.name,
    doctorSpeciality: state.selectedDoctor.speciality,
    date: state.selectedDate.toISOString().split("T")[0],
    time: state.selectedTime,
    createdAt: new Date().toISOString(),
  };

  let rdvs = [];
  const stored = localStorage.getItem(RDVS_STORAGE_KEY);
  if (stored) {
    try {
      rdvs = JSON.parse(stored);
    } catch (e) {}
  }

  rdvs.push(rdv);
  localStorage.setItem(RDVS_STORAGE_KEY, JSON.stringify(rdvs));
}

// Afficher une étape
function showStep(stepId) {
  document.querySelectorAll(".rdv-step").forEach((step) => {
    step.classList.remove("active");
  });

  const step = document.getElementById(stepId);
  step.classList.add("active");
  step.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Attacher les event listeners
function attachEventListeners() {
  document.getElementById("prev-month").addEventListener("click", () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById("back-to-calendar").addEventListener("click", () => {
    showStep("step-calendar");
  });

  document.getElementById("btn-new-rdv").addEventListener("click", () => {
    state.selectedDoctor = null;
    state.selectedDate = null;
    state.selectedTime = null;
    state.currentMonth = new Date();

    document.querySelectorAll(".doctor-card").forEach((card) => {
      card.classList.remove("selected");
    });

    renderDoctorsList();
    showStep("step-doctor");
  });
}
