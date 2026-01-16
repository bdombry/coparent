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

// État du formulaire
let rdvState = {
  speciality: null,
  doctor: null,
  doctorId: null,
  rdvType: null,
  rdvNature: null,
  date: null,
  time: null,
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  // Charger les horaires depuis le cache avant d'initialiser
  loadCachedHoraires();

  // Afficher le premier bloc
  document.getElementById("step-speciality").classList.add("active");

  attachSpecialityListeners();
  attachDoctorListeners();
  attachRdvTypeListeners();
  attachRdvNatureListeners();
  attachDateListener();
  attachTimeListeners();
  attachResetListener();
});

// ETAPE 1: Choix spécialité
function attachSpecialityListeners() {
  document.querySelectorAll("[data-speciality]").forEach((el) => {
    el.addEventListener("click", function () {
      const speciality = this.dataset.speciality;
      selectSpeciality(speciality);
    });
  });
}

function selectSpeciality(speciality) {
  rdvState.speciality = speciality;

  document.querySelectorAll("[data-speciality]").forEach((el) => {
    el.classList.remove("selected");
  });
  document
    .querySelector(`[data-speciality="${speciality}"]`)
    .classList.add("selected");

  showStep("step-doctor");
  displayDoctors(speciality);
}

function displayDoctors(speciality) {
  const specialityNames = {
    psychologue: "Psychologue",
    gyneco: "Gynécologue",
    pediatre: "Pédiatre",
  };

  document.getElementById("speciality-name").textContent =
    specialityNames[speciality];

  const doctorsList = document.getElementById("doctors-list");
  doctorsList.innerHTML = "";

  doctors[speciality].forEach((doctor) => {
    const div = document.createElement("div");
    div.className = "rdv-doctor";
    div.dataset.doctorId = doctor.id;
    div.innerHTML = `
      <h3>${doctor.name}</h3>
      <p>${doctor.speciality}</p>
      <p style="font-size: 12px; color: #999;">Disponible tous les jours</p>
    `;
    div.addEventListener("click", () => selectDoctor(doctor));
    doctorsList.appendChild(div);
  });
}

// ETAPE 2: Choix médecin
function attachDoctorListeners() {
  document.getElementById("doctors-list").addEventListener("click", () => {});
}

function selectDoctor(doctor) {
  rdvState.doctor = doctor.name;
  rdvState.doctorId = doctor.id;

  document.querySelectorAll(".rdv-doctor").forEach((el) => {
    el.classList.remove("selected");
  });
  document
    .querySelector(`[data-doctor-id="${doctor.id}"]`)
    .classList.add("selected");

  document.getElementById("doctor-name-1").textContent = doctor.name;

  const doctorEl = document.querySelector(`[data-doctor-id="${doctor.id}"]`);
  if (doctorEl) doctorEl.classList.add("selected");

  setTimeout(() => {
    showStep("step-rdv-type");
  }, 300);
}

// ETAPE 3: Choix type RDV
function attachRdvTypeListeners() {
  document.querySelectorAll("[data-rdv-type]").forEach((el) => {
    el.addEventListener("click", function () {
      const rdvType = this.dataset.rdvType;
      selectRdvType(rdvType);
    });
  });
}

function selectRdvType(rdvType) {
  rdvState.rdvType = rdvType;

  document.querySelectorAll("[data-rdv-type]").forEach((el) => {
    el.classList.remove("selected");
  });
  document
    .querySelector(`[data-rdv-type="${rdvType}"]`)
    .classList.add("selected");

  document.getElementById("doctor-name-2").textContent = rdvState.doctor;

  setTimeout(() => {
    showStep("step-rdv-nature");
  }, 300);
}

// ETAPE 4: Choix nature RDV
function attachRdvNatureListeners() {
  document.querySelectorAll("[data-rdv-nature]").forEach((el) => {
    el.addEventListener("click", function () {
      const rdvNature = this.dataset.rdvNature;
      selectRdvNature(rdvNature);
    });
  });
}

function selectRdvNature(rdvNature) {
  rdvState.rdvNature = rdvNature;

  document.querySelectorAll("[data-rdv-nature]").forEach((el) => {
    el.classList.remove("selected");
  });
  document
    .querySelector(`[data-rdv-nature="${rdvNature}"]`)
    .classList.add("selected");

  document.getElementById("doctor-name-3").textContent = rdvState.doctor;

  setTimeout(() => {
    showStep("step-date");
  }, 300);
}

// ETAPE 5: Choix date
function attachDateListener() {
  document.getElementById("rdv-date").addEventListener("change", function () {
    rdvState.date = this.value;
    document.getElementById("doctor-name-4").textContent = rdvState.doctor;
    displayTimes();
    setTimeout(() => {
      showStep("step-time");
    }, 300);
  });
}

// ETAPE 6: Choix heure
function attachTimeListeners() {
  // Dynamique
}

function displayTimes() {
  const doctor = getDoctorObject();
  const timesList = document.getElementById("times-list");
  timesList.innerHTML = "";

  doctor.horaires.forEach((horaire) => {
    const div = document.createElement("div");
    div.className = "rdv-time";
    div.textContent = horaire;
    div.addEventListener("click", () => selectTime(horaire, div));
    timesList.appendChild(div);
  });
}

function selectTime(time, element) {
  rdvState.time = time;

  document.querySelectorAll(".rdv-time").forEach((el) => {
    el.classList.remove("selected");
  });
  element.classList.add("selected");

  setTimeout(() => {
    showConfirmation();
  }, 300);
}

// Fonction utilitaire pour récupérer l'objet du médecin
function getDoctorObject() {
  const spec = rdvState.speciality;
  return doctors[spec].find((d) => d.id === rdvState.doctorId);
}

// CONFIRMATION
function showConfirmation() {
  const rdvTypeText =
    rdvState.rdvType === "couple"
      ? "Rendez-vous en couple"
      : "Rendez-vous femme enceinte seule";
  const rdvNatureText =
    rdvState.rdvNature === "premiere"
      ? "Premier rendez-vous"
      : "Rendez-vous de suivi";

  const dateObj = new Date(rdvState.date);
  const dateFormatted = dateObj.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const details = document.getElementById("confirmation-details");
  details.innerHTML = `
    <p><strong>Médecin :</strong> ${rdvState.doctor}</p>
    <p><strong>Type :</strong> ${rdvTypeText}</p>
    <p><strong>Nature :</strong> ${rdvNatureText}</p>
    <p><strong>Date :</strong> ${dateFormatted}</p>
    <p><strong>Heure :</strong> ${rdvState.time}</p>
  `;

  showStep("step-confirmation");
}

// Réinitialisation
function attachResetListener() {
  document.querySelector(".rdv-btn-reset").addEventListener("click", () => {
    rdvState = {
      speciality: null,
      doctor: null,
      doctorId: null,
      rdvType: null,
      rdvNature: null,
      date: null,
      time: null,
    };

    document
      .querySelectorAll("[data-speciality]")
      .forEach((el) => el.classList.remove("selected"));
    document
      .querySelectorAll(".rdv-doctor")
      .forEach((el) => el.classList.remove("selected"));
    document
      .querySelectorAll("[data-rdv-type]")
      .forEach((el) => el.classList.remove("selected"));
    document
      .querySelectorAll("[data-rdv-nature]")
      .forEach((el) => el.classList.remove("selected"));
    document
      .querySelectorAll(".rdv-time")
      .forEach((el) => el.classList.remove("selected"));

    // Réinitialiser les étapes
    document.querySelectorAll(".rdv-step").forEach((step) => {
      step.classList.remove("active");
    });

    // Afficher uniquement la première étape
    document.getElementById("step-speciality").classList.add("active");

    document
      .getElementById("step-speciality")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Utilitaires
function showStep(stepId) {
  const step = document.getElementById(stepId);

  // Ajouter la classe active pour le style
  document.querySelectorAll(".rdv-step").forEach((s) => {
    s.classList.remove("active");
  });
  step.classList.add("active");

  // Scroll vers l'étape
  step.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Charger les horaires en cache
function loadCachedHoraires() {
  const STORAGE_KEY = "medecin_horaires";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Mettre à jour les horaires des médecins avec les versions en cache
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
