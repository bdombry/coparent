# Le Parcours des Parents

Une application de gestion de rendez-vous pour un cabinet de psychologie, permettant aux patients de réserver des consultations et aux praticiens de gérer leur agenda.

## 🎯 Fonctionnalités

### Pour les patients
- **Prise de rendez-vous intuitive** : Interface calendrier pour sélectionner un psychologue, une date et un créneau horaire
- **Consultation de psychologues** : Voir les disponibilités de nos 4 psychologues
- **Stockage persistant** : Les rendez-vous sont sauvegardés en cache navigateur

### Pour l'administration
- **Gestion de l'agenda** : Sélectionner un psychologue et ajuster les horaires par jour
- **Consultations disponibles** : Deux types de consultation - Couple ou Grossesse
- **Vue des rendez-vous** : Affichage complet des rendez-vous pris par jour
- **Annulation de rendez-vous** : Possibilité d'annuler un rendez-vous depuis le panel admin
- **Stockage des horaires** : Les horaires sont mémorisés en cache navigateur

## 📄 Pages principales

### index.html
Page d'accueil du site avec navigation vers les autres sections.

### rdv.html
Interface de prise de rendez-vous pour les patients.
- Sélection du psychologue
- Calendrier avec visualisation du mois
- Sélection des créneaux disponibles
- Confirmation et sauvegarde du rendez-vous

### admin.html
Panel d'administration pour les psychologues.
- Gestion des horaires par jour
- Visualisation des rendez-vous pris
- Annulation des rendez-vous

## 👨‍⚕️ Équipe médicale

Le cabinet accueille 4 psychologues :

1. **Madame Lemaire** - 7h-15h (pause 11h-12h) - 7 créneaux
2. **Monsieur André** - 9h-18h (pause 12h-13h30) - 8 créneaux
3. **Madame Honoré** - 11h-19h (sans pause) - 8 créneaux
4. **Madame Garnier** - 9h-19h (pause 11h30-13h30) - 9 créneaux

## 💾 Stockage des données

Les données sont stockées localement dans le cache navigateur (localStorage) :

- **medecin_horaires** : Horaires globaux des psychologues
- **medecin_horaires_day** : Horaires spécifiques par jour (overrides)
- **patient_rdvs** : Liste des rendez-vous pris par les patients

## 🛠️ Technologie

- **HTML5** : Structure sémantique
- **CSS3** : Design responsive (Flexbox, Grid)
- **JavaScript (ES6+)** : Logique applicative, gestion du DOM
- **localStorage API** : Persistance des données côté client

## 🎨 Design

- **Palette de couleurs** :
  - Violet (#4d1494) : Actions principales
  - Vert/Teal (#68e2bd) : Navigation RDV
  - Orange (#f59e0b) : Navigation Admin
  - Beige (#f7f7f1) : Fond

## 📱 Responsive

L'application est entièrement responsive et optimisée pour :
- Mobile (< 768px)
- Tablette (768px - 1024px)
- Desktop (> 1024px)

## 🚀 Utilisation

1. Ouvrir `index.html` dans un navigateur
2. Cliquer sur "Prise de RDV" pour réserver une consultation
3. Cliquer sur "Admin" pour gérer les horaires et voir les rendez-vous

## 📝 Structure des fichiers

```
coparent/
├── index.html           # Page d'accueil
├── rdv.html             # Interface de prise de RDV
├── admin.html           # Panel d'administration
├── rdv.js               # Données des psychologues et logique RDV
├── admin-new.js         # Logique du panel admin
├── rdv-calendar.js      # Interface calendrier RDV
├── rdv.css              # Styles RDV
├── admin.css            # Styles admin
├── styles.css           # Styles globaux
├── rdv-calendar.css     # Styles calendrier
└── image/               # Dossier des images
```

## ✅ Fonctionnalités implémentées

- ✅ Système de réservation de rendez-vous
- ✅ Gestion des horaires par jour
- ✅ Affichage du calendrier du mois
- ✅ Persistance des données en localStorage
- ✅ Annulation de rendez-vous
- ✅ Interface responsive
- ✅ Navigation cohérente entre pages

---

**Dernière mise à jour** : Janvier 2026
