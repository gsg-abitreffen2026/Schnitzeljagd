"use strict";

const GAME_CONFIG = Object.freeze({
  // Schnell austauschbar: einfach diese ISO-Zeit anpassen.
  startAtISO: "2026-04-25T10:00:00+02:00",
  storageKey: "schnitzeljagd-progress-v2",
  geolocation: {
    enableHighAccuracy: true,
    timeout: 12000,
    maximumAge: 0,
  },
});

const TEST_MODE = new URLSearchParams(window.location.search).get("test") === "1";

const PLAYLIST = Object.freeze({
  A: [
    {
      song: "All The Small Things",
      artist: "blink-182",
      url: "https://open.spotify.com/search/blink-182%20All%20The%20Small%20Things",
    },
    {
      song: "Bohemian Rhapsody",
      artist: "Queen",
      url: "https://open.spotify.com/search/Queen%20Bohemian%20Rhapsody",
    },
    {
      song: "Everybody",
      artist: "Backstreet Boys",
      url: "https://open.spotify.com/search/Backstreet%20Boys%20Everybody",
    },
    {
      song: "Are You Gonna Be My Girl",
      artist: "Jet",
      url: "https://open.spotify.com/search/Jet%20Are%20You%20Gonna%20Be%20My%20Girl",
    },
    {
      song: "Californication",
      artist: "Red Hot Chili Peppers",
      url: "https://open.spotify.com/search/Red%20Hot%20Chili%20Peppers%20Californication",
    },
    {
      song: "Fallen Leaves",
      artist: "Billy Talent",
      url: "https://open.spotify.com/search/Billy%20Talent%20Fallen%20Leaves",
    },
    {
      song: "Basket Case",
      artist: "Green Day",
      url: "https://open.spotify.com/search/Green%20Day%20Basket%20Case",
    },
    {
      song: "Smells Like Teen Spirit",
      artist: "Nirvana",
      url: "https://open.spotify.com/search/Nirvana%20Smells%20Like%20Teen%20Spirit",
    },
  ],
  B: [
    {
      song: "Don't Stop Me Now",
      artist: "Queen",
      url: "https://open.spotify.com/search/Queen%20Don%27t%20Stop%20Me%20Now",
    },
    {
      song: "Mr Brightside",
      artist: "The Killers",
      url: "https://open.spotify.com/search/The%20Killers%20Mr%20Brightside",
    },
    {
      song: "You Give Love A Bad Name",
      artist: "Bon Jovi",
      url: "https://open.spotify.com/search/Bon%20Jovi%20You%20Give%20Love%20A%20Bad%20Name",
    },
    {
      song: "Teenage Dirtbag",
      artist: "Wheatus",
      url: "https://open.spotify.com/search/Wheatus%20Teenage%20Dirtbag",
    },
    {
      song: "Pretty Fly (For A White Guy)",
      artist: "The Offspring",
      url: "https://open.spotify.com/search/The%20Offspring%20Pretty%20Fly%20For%20A%20White%20Guy",
    },
    {
      song: "Hey Ya!",
      artist: "Outkast",
      url: "https://open.spotify.com/search/Outkast%20Hey%20Ya",
    },
    {
      song: "Thunderstruck",
      artist: "AC/DC",
      url: "https://open.spotify.com/search/ACDC%20Thunderstruck",
    },
  ],
});

const HINTS = Object.freeze([
  "Habt immer die Zeit im Blick",
  "Achtet auf die letzte Ziffer",
  "Bildet eine Reihe",
  "Da fehlt noch ein Punkt",
  "Und? Wohin geht's?",
]);

const STATION_ONE_ID = "clara-zetkin";
const STATION_ONE_STEPS = Object.freeze([
  {
    question: "Wie heisst der Song?",
    answers: ["numb"],
    wrongMessage: "Falsch.\n\nAlle trinken einen Schluck 🍺",
    successMessage: "Richtig!\n\nDer Song ist \"Numb\" von Linkin Park.",
  },
  {
    question:
      "2004 entstand ein beruehmter Remix dieses Songs\nzusammen mit einem bekannten Rapper.\n\nWie heisst der urspruengliche Song dieses Rappers?",
    answers: ["encore"],
    wrongMessage: "Falsch.\n\nAlle trinken einen Schluck 🍷",
    successMessage:
      "Richtig!\n\nDer Remix heisst \"Numb / Encore\"\nvon Linkin Park und Jay-Z.",
  },
  {
    question: "Was bedeutet \"Encore\" auf Deutsch?",
    answers: ["noch einmal", "nochmal", "noch mal", "nocheinmal"],
    wrongMessage: "Falsch.\n\nAlle trinken einen Schluck 🍺",
    successMessage:
      "Ihr habt das erste Loesungswort gefunden.\nLoesungswort:\nNoch einmal",
  },
]);

const STATION_TWO_ID = "kemnater-hof";
const STATION_TWO_STEPS = Object.freeze([
  {
    question: "Wie heisst der Song?",
    answers: ["hurra"],
    wrongMessage: "Falsch.\n\nAlle trinken einen Schluck 🍺",
    successMessage: "Richtig!\n\nDer Song ist \"Hurra\" von Die Ärzte.",
  },
  {
    question: "Wann war laut dem Song alles besser?",
    answers: ["fruher", "frueher", "wie fruher", "wie frueher"],
    wrongMessage: "Falsch.\n\nAlle trinken einen Schluck 🍺",
    successMessage: "Richtig!\nLösungswort\nWie früher",
  },
]);

const STATION_TWO_TIPS = Object.freeze([
  "Es geht um einen deutschen Punk-Song.",
  "Der Song ist von der Band \"Die Ärzte\".",
]);

const STATION_THREE_ID = "rossert";
const STATION_THREE_TARGET_COUNT = 10;
const STATION_FOUR_ID = "ruiter-krankenhaus";
const STATION_FOUR_ANSWERS = Object.freeze(["wonderwall", "wonder wall", "wonder-wall"]);
const STATION_FOUR_TIPS = Object.freeze([
  "\"Superstition\"\n\nDies ist ein Song des gesuchten Interpreten.",
  "Gesucht ist ein Song der Band Pink Floyd.",
]);
const STATION_FIVE_ID = "riederstrasse";
const STATION_FIVE_COORD_TARGET = Object.freeze({
  lat: 48.746512,
  lng: 9.243954,
});
const STATION_FIVE_HUTTE_ANSWERS = Object.freeze([
  "hütte",
  "huette",
  "hutte",
  "die hütte",
  "die huette",
  "huette im garten",
]);
const STATION_FIVE_SENTENCE_ORDER = Object.freeze([
  "Noch einmal",
  "Wonderwall",
  "wie früher",
  "in der",
  "Hütte",
]);
const STATION_ONE_HISTORY_LABELS = Object.freeze(["Numb", "Encore", "Noch einmal"]);
const STATION_TWO_HISTORY_LABELS = Object.freeze(["Hurra", "Früher"]);
const STATION_FOUR_HISTORY_LABEL = "Wonderwall";
const STATION_FIVE_HISTORY_LABEL = "Hütte";

const STATIONS = Object.freeze([
  {
    id: "clara-zetkin",
    title: "Station 1 - Blockfloete",
    locationName: "Clara Zetkin Haus",
    address: "48 44'44.3\"N 9 12'17.7\"E",
    routeHint: "Startpunkt um 10:00. Dort startet euer Blockfloeten-Spiel.",
    target: { lat: 48.745639, lng: 9.204917 },
    radius: 100,
    fallback: "Wenn GPS spinnt: Geht zum Haupteingang.",
    story: "Ihr habt eine Blockfloete.\n\nSpielt die folgenden Noten.\nErkennt ihr den Song?",
    prompt: "Wie heisst der Song?",
    answers: ["numb"],
    tip: "Noten anzeigen hilft beim Einstieg.",
    nextStageText: "Naechstes Ziel: Kemnater Hof.",
  },
  {
    id: "kemnater-hof",
    title: "Station 2 - Emoji-Raetsel",
    locationName: "Kemnater Hof",
    address: "48 43'52.5\"N 9 13'34.7\"E",
    routeHint: "Bleibt auf dem Weg, bis ihr den Hofbereich seht.",
    target: { lat: 48.73125, lng: 9.226306 },
    radius: 100,
    fallback: "Wenn GPS spinnt: Geht zum markanten Hofschild.",
    story:
      "Station 2\n\nErkennt ihr den Song?\n\nDie Emojis stellen den Songtitel dar.",
    prompt: "Wie heisst der Song?",
    answers: ["hurra"],
    tip: "Emoji-Raetsel mit Punkband.",
    nextStageText: "Geht zum naechsten Ort:\n\nGrillplatz Rossert",
  },
  {
    id: "rossert",
    title: "Station 3 - Hitster Challenge",
    locationName: "Grillplatz Rossert",
    address: "48 43'20.3\"N 9 14'25.7\"E",
    routeHint: "Richtung Waldkante halten, dort findet ihr den Punkt.",
    target: { lat: 48.722306, lng: 9.240472 },
    radius: 100,
    fallback: "Wenn GPS spinnt: Geht zu den Baenken am markanten Punkt.",
    story: "Station 3\n\nZeit fuer ein kleines Spiel.",
    prompt: "Regeln:\n\nSpielt Hitster.\n\nIhr muesst 10 Songs korrekt auf der Timeline einordnen.",
    answers: ["in der"],
    tip: "",
    nextStageText: "Geht zum naechsten Ort:\n\nKrankenhaus Ruit",
  },
  {
    id: STATION_FOUR_ID,
    title: "Station 4 - Wort-Raetsel",
    locationName: "Krankenhaus Ruit",
    address: "48 44'23.3\"N 9 15'09.8\"E",
    routeHint: "Geht zum Eingangsbereich des Krankenhauses.",
    target: { lat: 48.739806, lng: 9.252722 },
    radius: 100,
    fallback: "Wenn GPS spinnt: Geht direkt zum Eingang mit Schild.",
    story:
      "Station 4\n\nGesucht wird ein Songtitel,\nder sich aus zwei Woertern zusammensetzt:\n\nEin blinder Musiker\n+\nrebellierende Schueler",
    prompt: "Welcher Songtitel entsteht aus den beiden Hinweisen?",
    answers: STATION_FOUR_ANSWERS,
    tip: "",
    nextStageText: "Geht zum naechsten Ort:\n\nRiederstrasse",
  },
  {
    id: STATION_FIVE_ID,
    title: "Station 5 - Finale",
    locationName: "Riederstrasse",
    address: "48 45'11.6\"N 9 14'39.3\"E",
    routeHint: "Geht zur markanten Stelle an der Strasse.",
    target: { lat: 48.753222, lng: 9.24425 },
    radius: 100,
    fallback: "Wenn GPS spinnt: Geht zum markantesten Punkt vor Ort.",
    story:
      "Finale\n\nSchaut euch die Playlist genau an.\n\nSonglaenge -> Sekunden -> letzte Ziffer\nBildet daraus eine Reihe.\nDa fehlt noch ein Punkt.\nUnd? Wohin geht's?",
    prompt: "",
    answers: STATION_FIVE_HUTTE_ANSWERS,
    tip: "",
    nextStageText: "Finalziel freigeschaltet: Huette.",
  },
]);

const FINAL_DESTINATION = Object.freeze({
  locationName: "Huette",
  address: "48 44'47.4\"N 9 14'38.2\"E",
  routeHint: "Nach der Aufloesung in der Riederstrasse geht es zur Huette.",
  target: { lat: 48.746512, lng: 9.243954 },
  radius: 150,
  fallback: "Wenn GPS spinnt: Geht zum markantesten Punkt an der Huette.",
});

const DEFAULT_PROGRESS = Object.freeze({
  currentStationIndex: 0,
  hintsUnlocked: 0,
  attemptsByStation: {},
  stepByStation: {},
  tipCountByStation: {},
  stageStatus: "locked",
  finalLegUnlocked: false,
  finished: false,
});

const FEHLERSPRUECHE = Object.freeze([
  "Knapp daneben, der Fuchs grinst schon.",
  "Nicht schlecht geraten, aber noch nicht der Jackpot.",
  "Fast wie ein Ohrwurm, aber nicht ganz der richtige.",
  "Der Wald sagt: Noch ein Versuch.",
]);

let progress = loadProgress();
let transient = {
  gpsStatus: "idle",
  distanceMeters: null,
  permissionMessage: "",
  tipVisible: false,
  playlistCollapsed: false,
  emergencyByStation: {},
  stationFeedbackById: {},
  answerHistoryByStation: {},
  stationFiveCoordsFeedback: "",
  popupOpen: false,
  popupTitle: "",
  popupMessage: "",
  popupOnClose: null,
  stationFiveBoard: {
    bankWords: [],
    lineWords: [],
    locked: false,
    dragWord: "",
    dragFrom: "",
  },
};

const el = {
  heroCard: byId("heroCard"),
  heroStripText: byId("heroStripText"),
  modeTitle: byId("modeTitle"),
  modeSubtitle: byId("modeSubtitle"),
  testModeBadge: byId("testModeBadge"),
  countdownCard: byId("countdownCard"),
  countdownValue: byId("countdownValue"),
  startAtText: byId("startAtText"),
  playlistToggleBtn: byId("playlistToggleBtn"),
  playlistBody: byId("playlistBody"),
  playlistA: byId("playlistA"),
  playlistB: byId("playlistB"),
  hintList: byId("hintList"),
  startCardTitle: byId("startCardTitle"),
  startCard: byId("startCard"),
  lockText: byId("lockText"),
  nextTargetText: byId("nextTargetText"),
  gpsStatus: byId("gpsStatus"),
  distanceText: byId("distanceText"),
  gpsFallback: byId("gpsFallback"),
  permissionHelp: byId("permissionHelp"),
  challengeCard: byId("challengeCard"),
  challengeTitle: byId("challengeTitle"),
  challengeStory: byId("challengeStory"),
  answerHistory: byId("answerHistory"),
  emojiHint: byId("emojiHint"),
  challengePrompt: byId("challengePrompt"),
  hitsterPanel: byId("hitsterPanel"),
  hitsterProgress: byId("hitsterProgress"),
  stationFivePanel: byId("stationFivePanel"),
  coordLatInput: byId("coordLatInput"),
  coordLngInput: byId("coordLngInput"),
  checkCoordsBtn: byId("checkCoordsBtn"),
  coordsFeedback: byId("coordsFeedback"),
  stationFiveQuestion: byId("stationFiveQuestion"),
  sentenceBuilder: byId("sentenceBuilder"),
  wordBank: byId("wordBank"),
  sentenceLine: byId("sentenceLine"),
  sentenceHint: byId("sentenceHint"),
  answerLabel: byId("answerLabel"),
  answerInput: byId("answerInput"),
  checkAnswerBtn: byId("checkAnswerBtn"),
  hitsterCorrectBtn: byId("hitsterCorrectBtn"),
  hitsterWrongBtn: byId("hitsterWrongBtn"),
  notesBtn: byId("notesBtn"),
  notesModal: byId("notesModal"),
  closeNotesBtn: byId("closeNotesBtn"),
  feedbackModal: byId("feedbackModal"),
  feedbackTitle: byId("feedbackTitle"),
  feedbackMessage: byId("feedbackMessage"),
  feedbackContinueBtn: byId("feedbackContinueBtn"),
  showHintBtn: byId("showHintBtn"),
  tipText: byId("tipText"),
  feedbackText: byId("feedbackText"),
  unlockHintBtn: byId("unlockHintBtn"),
  nextStageBtn: byId("nextStageBtn"),
  emergencyBtn: byId("emergencyBtn"),
  emergencyBox: byId("emergencyBox"),
  finalCard: byId("finalCard"),
  stickyBar: byId("stickyBar"),
  startChallengeBtn: byId("startChallengeBtn"),
  ctaHint: byId("ctaHint"),
};

init();

function init() {
  transient.playlistCollapsed = !isPreStart();
  renderTestModeBadge();
  renderPlaylist();
  renderPlaylistCollapse();
  bindEvents();
  normalizeProgress();
  renderHints();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  updateUI();
  registerServiceWorker();
}

function bindEvents() {
  el.startChallengeBtn.addEventListener("click", onStartChallenge);
  if (el.playlistToggleBtn) {
    el.playlistToggleBtn.addEventListener("click", onTogglePlaylist);
  }
  el.checkAnswerBtn.addEventListener("click", onCheckAnswer);
  if (el.checkCoordsBtn) {
    el.checkCoordsBtn.addEventListener("click", onCheckStationFiveCoordinates);
  }
  if (el.hitsterCorrectBtn) {
    el.hitsterCorrectBtn.addEventListener("click", onHitsterCorrect);
  }
  if (el.hitsterWrongBtn) {
    el.hitsterWrongBtn.addEventListener("click", onHitsterWrong);
  }
  if (el.notesBtn) {
    el.notesBtn.addEventListener("click", openNotesModal);
  }
  if (el.closeNotesBtn) {
    el.closeNotesBtn.addEventListener("click", closeNotesModal);
  }
  if (el.notesModal) {
    el.notesModal.addEventListener("click", onNotesModalBackdropClick);
  }
  if (el.feedbackContinueBtn) {
    el.feedbackContinueBtn.addEventListener("click", closeFeedbackPopup);
  }
  if (el.feedbackModal) {
    el.feedbackModal.addEventListener("click", onFeedbackModalBackdropClick);
  }
  el.showHintBtn.addEventListener("click", onToggleTip);
  el.unlockHintBtn.addEventListener("click", onUnlockHint);
  el.nextStageBtn.addEventListener("click", onNextStage);
  el.emergencyBtn.addEventListener("click", onEmergency);
  if (el.coordLatInput) {
    el.coordLatInput.addEventListener("keydown", onStationFiveCoordKeyDown);
  }
  if (el.coordLngInput) {
    el.coordLngInput.addEventListener("keydown", onStationFiveCoordKeyDown);
  }

  el.answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onCheckAnswer();
    }
  });
}

function onTogglePlaylist() {
  transient.playlistCollapsed = !transient.playlistCollapsed;
  renderPlaylistCollapse();
}

function renderPlaylistCollapse() {
  if (!el.playlistBody || !el.playlistToggleBtn) {
    return;
  }
  el.playlistBody.classList.toggle("hidden", transient.playlistCollapsed);
  el.playlistToggleBtn.textContent = transient.playlistCollapsed
    ? "Playlist anzeigen"
    : "Playlist ausblenden";
}

function openFeedbackPopup(title, message, onClose = null) {
  if (!el.feedbackModal || !el.feedbackTitle || !el.feedbackMessage) {
    if (typeof onClose === "function") {
      onClose();
    }
    return;
  }
  transient.popupTitle = title;
  transient.popupMessage = message;
  transient.popupOnClose = typeof onClose === "function" ? onClose : null;
  transient.popupOpen = true;
  el.feedbackTitle.textContent = title;
  el.feedbackMessage.textContent = message;
  el.feedbackModal.classList.remove("hidden");
}

function closeFeedbackPopup() {
  if (!transient.popupOpen) {
    return;
  }
  transient.popupOpen = false;
  if (el.feedbackModal) {
    el.feedbackModal.classList.add("hidden");
  }
  const cb = transient.popupOnClose;
  transient.popupOnClose = null;
  if (typeof cb === "function") {
    cb();
  } else {
    updateUI();
  }
}

function onFeedbackModalBackdropClick(event) {
  if (event.target === el.feedbackModal) {
    closeFeedbackPopup();
  }
}

function setHeroCompact(compact) {
  if (!el.heroCard || !el.heroStripText || !el.modeTitle || !el.modeSubtitle || !el.countdownCard) {
    return;
  }
  el.heroCard.classList.toggle("hero-compact", compact);
  el.heroStripText.classList.toggle("hidden", !compact);
  el.modeTitle.classList.toggle("hidden", compact);
  el.modeSubtitle.classList.toggle("hidden", compact);
  el.countdownCard.classList.toggle("hidden", compact);
}

function addAnswerHistory(stationId, answerLabel) {
  if (!transient.answerHistoryByStation[stationId]) {
    transient.answerHistoryByStation[stationId] = [];
  }
  const list = transient.answerHistoryByStation[stationId];
  list.push(answerLabel);
}

function renderAnswerHistory(stationId) {
  if (!el.answerHistory) {
    return;
  }
  const entries = transient.answerHistoryByStation[stationId] || [];
  if (entries.length === 0) {
    el.answerHistory.classList.add("hidden");
    el.answerHistory.textContent = "";
    return;
  }
  el.answerHistory.classList.remove("hidden");
  el.answerHistory.textContent = entries
    .map((answer, index) => `Antwort ${index + 1}: ${answer}`)
    .join("\n");
}

function completeCurrentStationAndAdvance() {
  const station = getCurrentStation();
  transient.tipVisible = false;
  transient.distanceMeters = null;
  transient.gpsStatus = "idle";
  transient.permissionMessage = "";
  transient.stationFiveCoordsFeedback = "";
  if (station) {
    delete transient.stationFeedbackById[station.id];
  }
  if (el.coordLatInput) {
    el.coordLatInput.value = "";
  }
  if (el.coordLngInput) {
    el.coordLngInput.value = "";
  }

  if (progress.currentStationIndex >= STATIONS.length - 1) {
    progress.currentStationIndex = STATIONS.length;
    progress.stageStatus = "locked";
    progress.finalLegUnlocked = true;
    progress.finished = false;
  } else {
    progress.currentStationIndex += 1;
    progress.stageStatus = "locked";
  }
  saveProgress();
  updateUI();
}

function onStartChallenge() {
  if (isPreStart() || progress.finished) {
    return;
  }

  const finalLeg = isFinalLegActive();

  if (
    !finalLeg &&
    (progress.stageStatus === "solved_needs_hint" || progress.stageStatus === "solved_ready_next")
  ) {
    completeCurrentStationAndAdvance();
    return;
  }

  const station = finalLeg ? null : getCurrentStation();
  const targetConfig = finalLeg ? FINAL_DESTINATION : station;
  if (!targetConfig) {
    return;
  }

  transient.permissionMessage = "";

  if (TEST_MODE) {
    transient.gpsStatus = "ok";
    transient.distanceMeters = 0;

    if (finalLeg) {
      progress.finished = true;
      progress.finalLegUnlocked = false;
      progress.stageStatus = "locked";
      transient.permissionMessage = "Testmodus: Finalziel ohne GPS-Pruefung abgeschlossen.";
    } else {
      if (progress.stageStatus === "locked") {
        progress.stageStatus = "active";
      }
      transient.permissionMessage = "Testmodus: GPS-Pruefung uebersprungen. Challenge ist aktiv.";
      transient.playlistCollapsed = true;
      renderPlaylistCollapse();
    }

    saveProgress();
    updateUI();
    return;
  }

  if (!navigator.geolocation) {
    transient.gpsStatus = "far";
    transient.distanceMeters = null;
    transient.permissionMessage =
      "Euer Browser unterstuetzt kein GPS. Nutzt ein Smartphone mit aktuellem Browser und HTTPS/localhost.";
    updateUI();
    return;
  }

  const originalLabel = el.startChallengeBtn.textContent;
  el.startChallengeBtn.disabled = true;
  el.startChallengeBtn.textContent = "Standort wird geprueft...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const dist = haversineMeters(
        latitude,
        longitude,
        targetConfig.target.lat,
        targetConfig.target.lng,
      );

      transient.distanceMeters = Math.round(dist);
      transient.gpsStatus = classifyDistance(dist, targetConfig.radius);

      if (dist <= targetConfig.radius) {
        if (finalLeg) {
          progress.finished = true;
          progress.finalLegUnlocked = false;
          progress.stageStatus = "locked";
          saveProgress();
          transient.permissionMessage = "Finalziel erreicht. Starker Abschluss.";
        } else {
          if (progress.stageStatus === "locked") {
            progress.stageStatus = "active";
          }
          saveProgress();
          transient.permissionMessage = "Im Radius. Challenge ist freigeschaltet.";
          transient.playlistCollapsed = true;
          renderPlaylistCollapse();
        }
      } else {
        if (!finalLeg) {
          progress.stageStatus = "locked";
        }
        saveProgress();
        transient.permissionMessage = finalLeg
          ? "Noch nicht am Finalziel. Geht naeher an die Huette und prueft erneut."
          : "Noch zu weit weg. Geht naeher an den Zielpunkt und tippt erneut auf Challenge starten.";
      }

      // Standortdaten werden absichtlich nicht gespeichert.
      updateUI();
      el.startChallengeBtn.disabled = false;
      el.startChallengeBtn.textContent = originalLabel;
    },
    (error) => {
      transient.gpsStatus = "far";
      transient.distanceMeters = null;
      transient.permissionMessage = geoErrorToMessage(error);
      updateUI();
      el.startChallengeBtn.disabled = false;
      el.startChallengeBtn.textContent = originalLabel;
    },
    GAME_CONFIG.geolocation,
  );
}

function onCheckAnswer() {
  if (progress.stageStatus !== "active") {
    return;
  }

  const station = getCurrentStation();
  if (!station) {
    return;
  }

  const rawInput = el.answerInput.value.trim();
  if (!rawInput) {
    el.feedbackText.textContent =
      station.id === STATION_ONE_ID ||
      station.id === STATION_TWO_ID ||
      station.id === STATION_FOUR_ID ||
      station.id === STATION_FIVE_ID
        ? "Bitte erst eine Antwort eingeben."
        : "Bitte erst ein Loesungswort eingeben.";
    return;
  }

  if (station.id === STATION_ONE_ID) {
    onCheckAnswerStationOne(rawInput);
    return;
  }

  if (station.id === STATION_TWO_ID) {
    onCheckAnswerStationTwo(rawInput);
    return;
  }

  if (station.id === STATION_THREE_ID) {
    return;
  }

  if (station.id === STATION_FOUR_ID) {
    onCheckAnswerStationFour(rawInput);
    return;
  }

  if (station.id === STATION_FIVE_ID) {
    onCheckAnswerStationFive(rawInput);
    return;
  }

  const candidate = normalizeText(rawInput);
  const correct = station.answers.map(normalizeText).includes(candidate);

  if (correct) {
    progress.stageStatus = "solved_needs_hint";
    saveProgress();
    transient.tipVisible = false;
    el.feedbackText.textContent = "Richtig! Stark gespielt.";
    updateUI();
    return;
  }

  const tries = incrementAttempts(station.id);
  saveProgress();
  el.feedbackText.textContent = `${pickFailureMessage()} (Versuch ${tries})`;
  updateUI();
}

function onCheckAnswerStationOne(rawInput) {
  const step = getStationOneStep();
  const stepConfig = STATION_ONE_STEPS[step];
  if (!stepConfig) {
    return;
  }

  const candidate = normalizeText(rawInput);
  const correct = stepConfig.answers.map(normalizeText).includes(candidate);

  if (!correct) {
    incrementAttempts(STATION_ONE_ID);
    saveProgress();
    const wrongText = stepConfig.wrongMessage.replace(/^Falsch\.\n\n/, "");
    openFeedbackPopup("Falsch", wrongText);
    return;
  }

  addAnswerHistory(STATION_ONE_ID, STATION_ONE_HISTORY_LABELS[Math.min(step, STATION_ONE_HISTORY_LABELS.length - 1)]);
  el.answerInput.value = "";

  if (step < STATION_ONE_STEPS.length - 1) {
    progress.stepByStation[STATION_ONE_ID] = step + 1;
    saveProgress();
    openFeedbackPopup("Richtig!", stepConfig.successMessage);
    return;
  }

  progress.stepByStation[STATION_ONE_ID] = STATION_ONE_STEPS.length;
  if (progress.hintsUnlocked < 2) {
    progress.hintsUnlocked = 2;
  }
  transient.tipVisible = false;
  saveProgress();
  renderHints();
  openFeedbackPopup("Richtig!", stepConfig.successMessage, completeCurrentStationAndAdvance);
}

function onCheckAnswerStationTwo(rawInput) {
  const step = getStationTwoStep();
  const stepConfig = STATION_TWO_STEPS[step];
  if (!stepConfig) {
    return;
  }

  const candidate = normalizeText(rawInput);
  const correct = stepConfig.answers.map(normalizeText).includes(candidate);

  if (!correct) {
    incrementAttempts(STATION_TWO_ID);
    saveProgress();
    openFeedbackPopup("Falsch", "Alle trinken einen Schluck 🍺");
    return;
  }

  addAnswerHistory(STATION_TWO_ID, STATION_TWO_HISTORY_LABELS[Math.min(step, STATION_TWO_HISTORY_LABELS.length - 1)]);
  el.answerInput.value = "";

  if (step < STATION_TWO_STEPS.length - 1) {
    progress.stepByStation[STATION_TWO_ID] = step + 1;
    saveProgress();
    openFeedbackPopup("Richtig!", stepConfig.successMessage);
    return;
  }

  progress.stepByStation[STATION_TWO_ID] = STATION_TWO_STEPS.length;
  if (progress.hintsUnlocked < 3) {
    progress.hintsUnlocked = 3;
  }
  transient.tipVisible = false;
  saveProgress();
  renderHints();
  openFeedbackPopup("Richtig!", stepConfig.successMessage, completeCurrentStationAndAdvance);
}

function onToggleTip() {
  const station = getCurrentStation();
  if (station && station.id === STATION_TWO_ID && progress.stageStatus === "active") {
    onShowStationTwoTip();
    return;
  }
  if (station && station.id === STATION_FOUR_ID && progress.stageStatus === "active") {
    onShowStationFourTip();
    return;
  }
  transient.tipVisible = !transient.tipVisible;
  updateUI();
}

function onShowStationTwoTip() {
  const current = getStationTwoTipCount();
  if (current >= STATION_TWO_TIPS.length) {
    return;
  }
  progress.tipCountByStation[STATION_TWO_ID] = current + 1;
  saveProgress();
  const tipText = STATION_TWO_TIPS[current];
  openFeedbackPopup("Alle trinken einen Schluck", `Tipp ${current + 1}: ${tipText}`);
}

function onCheckAnswerStationFour(rawInput) {
  const candidate = normalizeText(rawInput);
  const correct = STATION_FOUR_ANSWERS.map(normalizeText).includes(candidate);

  if (!correct) {
    incrementAttempts(STATION_FOUR_ID);
    saveProgress();
    openFeedbackPopup("Falsch", "Alle trinken einen Schluck 🍺");
    return;
  }

  addAnswerHistory(STATION_FOUR_ID, STATION_FOUR_HISTORY_LABEL);
  progress.stepByStation[STATION_FOUR_ID] = 1;
  if (progress.hintsUnlocked < 5) {
    progress.hintsUnlocked = 5;
  }
  transient.tipVisible = false;
  el.answerInput.value = "";
  saveProgress();
  renderHints();
  openFeedbackPopup(
    "Richtig!",
    "Wonder + Wall = Wonderwall\n\nLoesungswort:\nWonderwall",
    completeCurrentStationAndAdvance,
  );
}

function onShowStationFourTip() {
  const current = getStationFourTipCount();
  if (current >= STATION_FOUR_TIPS.length) {
    return;
  }
  progress.tipCountByStation[STATION_FOUR_ID] = current + 1;
  saveProgress();
  const tipText = STATION_FOUR_TIPS[current];
  openFeedbackPopup("Alle trinken einen Schluck", `Tipp ${current + 1}: ${tipText}`);
}

function onStationFiveCoordKeyDown(event) {
  if (event.key !== "Enter") {
    return;
  }
  event.preventDefault();
  onCheckStationFiveCoordinates();
}

function onCheckStationFiveCoordinates() {
  const station = getCurrentStation();
  if (!station || station.id !== STATION_FIVE_ID || progress.stageStatus !== "active") {
    return;
  }

  const lat = parseCoordinateValue(el.coordLatInput ? el.coordLatInput.value : "");
  const lng = parseCoordinateValue(el.coordLngInput ? el.coordLngInput.value : "");

  if (lat === null || lng === null) {
    transient.stationFiveCoordsFeedback =
      "Bitte beide Koordinaten im Dezimalformat eingeben (z.B. 48.746512 und 9.243954).";
    updateUI();
    return;
  }

  const matchesLat = isCloseCoordinate(lat, STATION_FIVE_COORD_TARGET.lat);
  const matchesLng = isCloseCoordinate(lng, STATION_FIVE_COORD_TARGET.lng);

  if (!matchesLat || !matchesLng) {
    transient.stationFiveCoordsFeedback =
      "Noch nicht korrekt. Achtet auf Songlaenge, Sekunden und letzte Ziffer.";
    updateUI();
    return;
  }

  const step = getStationFiveStep();
  progress.stepByStation[STATION_FIVE_ID] = Math.max(step, 1);
  transient.stationFiveCoordsFeedback =
    "Koordinaten korrekt. Geht zu diesen Koordinaten und beantwortet die Frage.";
  saveProgress();
  updateUI();
}

function onCheckAnswerStationFive(rawInput) {
  const step = getStationFiveStep();
  if (step < 1) {
    openFeedbackPopup("Hinweis", "Prueft zuerst die Koordinaten.");
    return;
  }

  if (step >= 2) {
    openFeedbackPopup("Hinweis", "Baut jetzt den Satz aus allen Loesungswoertern.");
    return;
  }

  const candidate = normalizeText(rawInput);
  const correct = STATION_FIVE_HUTTE_ANSWERS.map(normalizeText).includes(candidate);

  if (!correct) {
    incrementAttempts(STATION_FIVE_ID);
    saveProgress();
    openFeedbackPopup("Falsch", "Alle trinken einen Schluck 🍺");
    return;
  }

  progress.stepByStation[STATION_FIVE_ID] = 2;
  addAnswerHistory(STATION_FIVE_ID, STATION_FIVE_HISTORY_LABEL);
  transient.stationFiveBoard = {
    bankWords: shuffleWords(STATION_FIVE_SENTENCE_ORDER),
    lineWords: [],
    locked: false,
    dragWord: "",
    dragFrom: "",
  };
  el.answerInput.value = "";
  saveProgress();
  openFeedbackPopup("Richtig!", "Richtig! Letztes Lösungswort: Hütte");
}

function parseCoordinateValue(value) {
  if (typeof value !== "string") {
    return null;
  }
  const cleaned = value.trim().replace(",", ".").replace(/\s+/g, "");
  if (!/^[-+]?\d+(\.\d+)?$/.test(cleaned)) {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function isCloseCoordinate(a, b) {
  return Math.abs(a - b) <= 0.00001;
}

function shuffleWords(words) {
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ensureStationFiveBoard() {
  const step = getStationFiveStep();

  if (step >= 3) {
    transient.stationFiveBoard = {
      bankWords: [],
      lineWords: [...STATION_FIVE_SENTENCE_ORDER],
      locked: true,
      dragWord: "",
      dragFrom: "",
    };
    return;
  }

  if (step < 2) {
    transient.stationFiveBoard = {
      bankWords: [],
      lineWords: [],
      locked: false,
      dragWord: "",
      dragFrom: "",
    };
    return;
  }

  const board = transient.stationFiveBoard;
  if (
    !Array.isArray(board.bankWords) ||
    !Array.isArray(board.lineWords) ||
    board.bankWords.length + board.lineWords.length !== STATION_FIVE_SENTENCE_ORDER.length
  ) {
    transient.stationFiveBoard = {
      bankWords: shuffleWords(STATION_FIVE_SENTENCE_ORDER),
      lineWords: [],
      locked: false,
      dragWord: "",
      dragFrom: "",
    };
  }
}

function onStationFiveDragOver(event) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

function onStationFiveDragStart(event) {
  const board = transient.stationFiveBoard;
  if (board.locked) {
    event.preventDefault();
    return;
  }
  const word = event.currentTarget.dataset.word || "";
  const origin = event.currentTarget.dataset.origin || "";
  board.dragWord = word;
  board.dragFrom = origin;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", word);
  }
}

function onStationFiveDragEnd() {
  transient.stationFiveBoard.dragWord = "";
  transient.stationFiveBoard.dragFrom = "";
}

function onStationFiveDropZone(event, targetZone) {
  event.preventDefault();
  const board = transient.stationFiveBoard;
  if (board.locked) {
    return;
  }
  const word = board.dragWord;
  const from = board.dragFrom;
  if (!word || !from) {
    return;
  }
  if (!moveStationFiveWord(word, from, targetZone)) {
    return;
  }
  finalizeStationFiveMove();
}

function onStationFiveDropOnChip(event) {
  event.preventDefault();
  event.stopPropagation();
  const board = transient.stationFiveBoard;
  if (board.locked) {
    return;
  }
  const word = board.dragWord;
  const from = board.dragFrom;
  const targetWord = event.currentTarget.dataset.word || "";
  const targetZone = event.currentTarget.dataset.origin || "";

  if (!word || !from || !targetWord || !targetZone) {
    return;
  }
  if (!moveStationFiveWord(word, from, targetZone, targetWord)) {
    return;
  }
  finalizeStationFiveMove();
}

function onStationFiveChipClick(event) {
  const board = transient.stationFiveBoard;
  if (board.locked) {
    return;
  }
  const word = event.currentTarget.dataset.word || "";
  const origin = event.currentTarget.dataset.origin || "";
  if (!word || !origin) {
    return;
  }
  const targetZone = origin === "bank" ? "line" : "bank";
  if (!moveStationFiveWord(word, origin, targetZone)) {
    return;
  }
  finalizeStationFiveMove();
}

function moveStationFiveWord(word, fromZone, toZone, beforeWord = "") {
  const board = transient.stationFiveBoard;
  if (fromZone === toZone && beforeWord && beforeWord === word) {
    return false;
  }
  const fromList = fromZone === "line" ? board.lineWords : board.bankWords;
  const toList = toZone === "line" ? board.lineWords : board.bankWords;

  const fromIndex = fromList.indexOf(word);
  if (fromIndex < 0) {
    return false;
  }

  fromList.splice(fromIndex, 1);

  let insertIndex = toList.length;
  if (beforeWord) {
    const targetIndex = toList.indexOf(beforeWord);
    if (targetIndex >= 0) {
      insertIndex = targetIndex;
    }
  }
  if (fromList === toList && insertIndex > fromIndex) {
    insertIndex -= 1;
  }

  toList.splice(insertIndex, 0, word);
  return true;
}

function finalizeStationFiveMove() {
  transient.stationFiveBoard.dragWord = "";
  transient.stationFiveBoard.dragFrom = "";
  const solved = checkStationFiveSentence();
  if (solved) {
    return;
  }
  saveProgress();
  updateUI();
}

function checkStationFiveSentence() {
  const board = transient.stationFiveBoard;
  if (board.lineWords.length !== STATION_FIVE_SENTENCE_ORDER.length) {
    return false;
  }

  const correct = board.lineWords.every(
    (word, index) => normalizeText(word) === normalizeText(STATION_FIVE_SENTENCE_ORDER[index]),
  );
  if (!correct) {
    return false;
  }

  board.locked = true;
  progress.stepByStation[STATION_FIVE_ID] = 3;
  saveProgress();
  openFeedbackPopup(
    "Bingo",
    "Satz gelöst.\nNoch einmal Wonderwall wie früher in der Hütte\n\nNehmt die Gitarre. Es ist Zeit für Wonderwall.",
    completeCurrentStationAndAdvance,
  );
  return true;
}

function onHitsterCorrect() {
  const station = getCurrentStation();
  if (!station || station.id !== STATION_THREE_ID || progress.stageStatus !== "active") {
    return;
  }

  const current = getStationThreeCorrectCount();
  if (current >= STATION_THREE_TARGET_COUNT) {
    return;
  }

  const next = current + 1;
  progress.stepByStation[STATION_THREE_ID] = next;

  if (next >= STATION_THREE_TARGET_COUNT) {
    if (progress.hintsUnlocked < 4) {
      progress.hintsUnlocked = 4;
    }
    addAnswerHistory(STATION_THREE_ID, "in der");
    renderHints();
    saveProgress();
    openFeedbackPopup(
      "Challenge geschafft!",
      "Das naechste Loesungswort lautet:\nin der",
      completeCurrentStationAndAdvance,
    );
    return;
  } else {
    saveProgress();
    updateUI();
  }
}

function onHitsterWrong() {
  const station = getCurrentStation();
  if (!station || station.id !== STATION_THREE_ID || progress.stageStatus !== "active") {
    return;
  }

  incrementAttempts(STATION_THREE_ID);
  saveProgress();
  openFeedbackPopup("Falsch", "Alle trinken einen Schluck 🍺");
}

function openNotesModal() {
  if (!el.notesModal) {
    return;
  }
  el.notesModal.classList.remove("hidden");
}

function closeNotesModal() {
  if (!el.notesModal) {
    return;
  }
  el.notesModal.classList.add("hidden");
}

function onNotesModalBackdropClick(event) {
  if (el.notesModal && event.target === el.notesModal) {
    closeNotesModal();
  }
}

function onUnlockHint() {
  if (progress.stageStatus !== "solved_needs_hint") {
    return;
  }

  if (progress.hintsUnlocked < HINTS.length) {
    progress.hintsUnlocked += 1;
  }

  progress.stageStatus = "solved_ready_next";
  saveProgress();
  renderHints();
  updateUI();
}

function onNextStage() {
  if (progress.stageStatus !== "solved_ready_next") {
    return;
  }

  transient.tipVisible = false;
  transient.distanceMeters = null;
  transient.gpsStatus = "idle";
  transient.permissionMessage = "";
  transient.stationFiveCoordsFeedback = "";
  closeNotesModal();
  el.answerInput.value = "";

  if (progress.currentStationIndex >= STATIONS.length - 1) {
    progress.currentStationIndex = STATIONS.length;
    progress.stageStatus = "locked";
    progress.finalLegUnlocked = true;
    progress.finished = false;
    saveProgress();
    updateUI();
    return;
  }

  progress.currentStationIndex += 1;
  progress.stageStatus = "locked";
  saveProgress();
  updateUI();
}

function onEmergency() {
  const station = getCurrentStation();
  if (!station) {
    return;
  }

  transient.emergencyByStation[station.id] = true;
  updateUI();
}

function updateUI() {
  maybeUnlockStartHint();

  if (isPreStart()) {
    renderPreStartUI();
    return;
  }

  if (isFinalLegActive()) {
    renderFinalLegMode();
    return;
  }

  if (progress.finished) {
    renderFinishedUI();
    return;
  }

  const station = getCurrentStation();
  renderStartMode(station);
  renderChallenge(station);
}

function renderPreStartUI() {
  setHeroCompact(false);
  if (el.startCardTitle) {
    el.startCardTitle.textContent = "Naechstes Ziel";
  }
  el.modeTitle.textContent = "Schnitzeljagd - Pre-Start";
  el.modeSubtitle.textContent =
    "Diese Songs haben Bedeutung. Noch nichts eingeben, nur anschauen.";
  el.lockText.textContent =
    "Start ist erst um 10:00 Uhr.";
  el.nextTargetText.textContent =
    "Station 1 - Clara Zetkin Haus";

  setGpsStatus("idle", "Status: gesperrt bis Start");
  el.gpsStatus.classList.add("hidden");
  el.distanceText.classList.add("hidden");
  el.gpsFallback.classList.add("hidden");

  el.permissionHelp.classList.add("hidden");
  el.permissionHelp.textContent = "";

  el.challengeCard.classList.add("hidden");
  el.finalCard.classList.add("hidden");

  el.startChallengeBtn.classList.remove("hidden");
  el.startChallengeBtn.disabled = true;
  el.startChallengeBtn.textContent = "Challenge startet um 10:00";
  el.ctaHint.textContent = formatStartDateHint();
  if (el.stickyBar) {
    el.stickyBar.classList.add("hidden");
  }
}

function renderStartMode(station) {
  if (!station) {
    return;
  }

  setHeroCompact(true);
  if (el.startCardTitle) {
    el.startCardTitle.textContent = "Naechstes Ziel";
  }

  el.lockText.textContent = station.title;
  el.nextTargetText.textContent = `Naechstes Ziel: ${station.locationName}`;
  el.gpsFallback.textContent = "";

  const distance =
    typeof transient.distanceMeters === "number" ? transient.distanceMeters : "--";
  el.distanceText.textContent = `Du bist ${distance} Meter entfernt`;

  setGpsStatus(transient.gpsStatus, formatGpsStatusText(transient.gpsStatus));
  el.gpsStatus.classList.add("hidden");
  el.distanceText.classList.add("hidden");
  el.gpsFallback.classList.add("hidden");

  if (transient.permissionMessage) {
    el.permissionHelp.classList.remove("hidden");
    el.permissionHelp.textContent = transient.permissionMessage;
  } else {
    el.permissionHelp.classList.add("hidden");
    el.permissionHelp.textContent = "";
  }

  const active = progress.stageStatus === "active";
  el.startChallengeBtn.classList.toggle("hidden", active);
  el.startChallengeBtn.disabled = false;
  el.startChallengeBtn.textContent = "Challenge starten";
  el.ctaHint.textContent = "";
  if (el.stickyBar) {
    el.stickyBar.classList.add("hidden");
  }
  el.finalCard.classList.add("hidden");
}

function renderFinalLegMode() {
  setHeroCompact(true);
  if (el.startCardTitle) {
    el.startCardTitle.textContent = "Naechstes Ziel";
  }

  el.lockText.textContent = "Finale Etappe";
  el.nextTargetText.textContent = `Finalziel: ${FINAL_DESTINATION.locationName}`;
  el.gpsFallback.textContent = "";

  const distance =
    typeof transient.distanceMeters === "number" ? transient.distanceMeters : "--";
  el.distanceText.textContent = `Du bist ${distance} Meter entfernt`;

  setGpsStatus(transient.gpsStatus, formatGpsStatusText(transient.gpsStatus));
  el.gpsStatus.classList.add("hidden");
  el.distanceText.classList.add("hidden");
  el.gpsFallback.classList.add("hidden");

  if (transient.permissionMessage) {
    el.permissionHelp.classList.remove("hidden");
    el.permissionHelp.textContent = transient.permissionMessage;
  } else {
    el.permissionHelp.classList.add("hidden");
    el.permissionHelp.textContent = "";
  }

  el.challengeCard.classList.add("hidden");
  el.finalCard.classList.add("hidden");

  el.startChallengeBtn.classList.remove("hidden");
  el.startChallengeBtn.disabled = false;
  el.startChallengeBtn.textContent = "Finalziel pruefen";
  el.ctaHint.textContent = "";
  if (el.stickyBar) {
    el.stickyBar.classList.add("hidden");
  }
}

function renderChallenge(station) {
  if (progress.stageStatus === "locked" || !station) {
    closeNotesModal();
    el.challengeCard.classList.add("hidden");
    el.feedbackText.textContent = "";
    if (el.hitsterPanel) {
      el.hitsterPanel.classList.add("hidden");
    }
    if (el.stationFivePanel) {
      el.stationFivePanel.classList.add("hidden");
    }
    el.challengePrompt.classList.remove("hidden");
    el.answerInput.classList.remove("hidden");
    if (el.notesBtn) {
      el.notesBtn.classList.add("hidden");
    }
    if (el.emojiHint) {
      el.emojiHint.classList.add("hidden");
    }
    if (el.answerHistory) {
      el.answerHistory.classList.add("hidden");
      el.answerHistory.textContent = "";
    }
    el.tipText.classList.add("hidden");
    if (el.answerLabel) {
      el.answerLabel.textContent = "Loesungswort";
    }
    return;
  }

  const isStationOne = station.id === STATION_ONE_ID;
  const isStationTwo = station.id === STATION_TWO_ID;
  const isStationThree = station.id === STATION_THREE_ID;
  const isStationFour = station.id === STATION_FOUR_ID;
  const isStationFive = station.id === STATION_FIVE_ID;
  const stationFiveStep = getStationFiveStep();
  if (!isStationOne) {
    closeNotesModal();
  }
  el.challengeCard.classList.remove("hidden");
  el.challengeTitle.textContent = station.title;
  el.challengeStory.textContent = station.story;
  renderAnswerHistory(station.id);
  if (isStationOne) {
    el.challengePrompt.textContent =
      STATION_ONE_STEPS[Math.min(getStationOneStep(), STATION_ONE_STEPS.length - 1)].question;
  } else if (isStationTwo) {
    el.challengePrompt.textContent =
      STATION_TWO_STEPS[Math.min(getStationTwoStep(), STATION_TWO_STEPS.length - 1)].question;
  } else if (isStationThree) {
    el.challengePrompt.textContent = "";
  } else {
    el.challengePrompt.textContent = station.prompt;
  }
  el.challengePrompt.classList.toggle("hidden", isStationThree || isStationFive);
  el.tipText.textContent = station.tip || "";
  if (el.emojiHint) {
    if (isStationTwo) {
      el.emojiHint.textContent = "🙌 🙌\n🎉 🙌";
      el.emojiHint.classList.remove("hidden");
    } else {
      el.emojiHint.classList.add("hidden");
    }
  }
  const usesTextAnswer = !isStationThree && (!isStationFive || stationFiveStep === 1);
  if (el.answerLabel) {
    el.answerLabel.classList.toggle("hidden", !usesTextAnswer);
    el.answerLabel.textContent =
      isStationOne || isStationTwo || isStationFour || isStationFive ? "Antwort" : "Loesungswort";
  }
  el.answerInput.classList.toggle("hidden", !usesTextAnswer);
  el.answerInput.placeholder =
    isStationOne || isStationTwo || isStationFour || isStationFive
      ? "Antwort eingeben"
      : "Loesungswort eingeben";
  if (el.notesBtn) {
    el.notesBtn.classList.toggle("hidden", !isStationOne);
  }

  const tries = progress.attemptsByStation[station.id] || 0;
  const stationThreeCount = getStationThreeCorrectCount();
  const isSolvedNeedsHint = progress.stageStatus === "solved_needs_hint";
  const isSolvedReadyNext = progress.stageStatus === "solved_ready_next";
  const customFeedback = transient.stationFeedbackById[station.id] || "";

  const active = progress.stageStatus === "active";
  if ((isStationOne || isStationTwo || isStationFour || isStationFive) && !active) {
    el.challengePrompt.textContent = "Station abgeschlossen.";
  }
  el.answerInput.disabled = !active || isStationThree || (isStationFive && stationFiveStep !== 1);
  el.checkAnswerBtn.disabled = !active || (isStationFive && stationFiveStep !== 1);
  el.checkAnswerBtn.classList.toggle(
    "hidden",
    !active || isStationThree || (isStationFive && stationFiveStep !== 1),
  );

  if (el.hitsterPanel) {
    el.hitsterPanel.classList.toggle("hidden", !isStationThree);
  }
  if (el.hitsterProgress && isStationThree) {
    el.hitsterProgress.textContent = `Richtige Songs: ${stationThreeCount} / ${STATION_THREE_TARGET_COUNT}`;
  }
  if (isStationThree) {
    if (el.hitsterCorrectBtn) {
      el.hitsterCorrectBtn.disabled = !active;
    }
    if (el.hitsterWrongBtn) {
      el.hitsterWrongBtn.disabled = !active;
    }
  }

  if (el.stationFivePanel) {
    el.stationFivePanel.classList.toggle("hidden", !isStationFive);
  }
  if (isStationFive) {
    renderStationFivePanel(active, stationFiveStep, isSolvedReadyNext);
  }

  if (isStationTwo) {
    const shownTips = getStationTwoTipCount();
    const canShowMoreTips = active && shownTips < STATION_TWO_TIPS.length;
    el.showHintBtn.classList.toggle("hidden", !canShowMoreTips);
    el.showHintBtn.textContent = shownTips === 0 ? "Tipp anzeigen" : "Naechsten Tipp anzeigen";

    if (shownTips > 0) {
      el.tipText.textContent = STATION_TWO_TIPS.slice(0, shownTips)
        .map((tip, index) => `Tipp ${index + 1}: ${tip}`)
        .join("\n");
      el.tipText.classList.remove("hidden");
    } else {
      el.tipText.classList.add("hidden");
    }
  } else if (isStationFour) {
    const shownTips = getStationFourTipCount();
    const canShowMoreTips = active && shownTips < STATION_FOUR_TIPS.length;
    el.showHintBtn.classList.toggle("hidden", !canShowMoreTips);
    el.showHintBtn.textContent = shownTips === 0 ? "Tipp anzeigen" : "Naechsten Tipp anzeigen";

    if (shownTips > 0) {
      el.tipText.textContent = STATION_FOUR_TIPS.slice(0, shownTips)
        .map((tip, index) => `Tipp ${index + 1}: ${tip}`)
        .join("\n");
      el.tipText.classList.remove("hidden");
    } else {
      el.tipText.classList.add("hidden");
    }
  } else {
    const hasTip = !isStationOne && Boolean(station.tip);
    el.showHintBtn.classList.toggle("hidden", !(active && hasTip));
    el.showHintBtn.textContent = transient.tipVisible ? "Tipp ausblenden" : "Tipp anzeigen";

    if (active && hasTip && transient.tipVisible) {
      el.tipText.classList.remove("hidden");
    } else {
      el.tipText.classList.add("hidden");
    }
  }

  el.unlockHintBtn.classList.toggle(
    "hidden",
    isStationOne ||
      isStationTwo ||
      isStationThree ||
      isStationFour ||
      isStationFive ||
      !isSolvedNeedsHint,
  );
  el.nextStageBtn.classList.add("hidden");

  if (
    (isStationOne || isStationTwo || isStationThree || isStationFour || isStationFive) &&
    customFeedback
  ) {
    el.feedbackText.textContent = customFeedback;
  } else if (isSolvedNeedsHint) {
    el.feedbackText.textContent =
      "Erfolg! Schalte jetzt den naechsten Hinweis frei, dann geht es weiter.";
  } else {
    el.feedbackText.textContent = "";
  }

  const showEmergency = active && tries >= 3;
  el.emergencyBtn.classList.toggle("hidden", !showEmergency);

  if (transient.emergencyByStation[station.id] && showEmergency) {
    el.emergencyBox.classList.remove("hidden");
    el.emergencyBox.textContent = `Notfallmodus: (${station.target.lat.toFixed(4)}, ${station.target.lng.toFixed(4)}). ${station.fallback}`;
  } else {
    el.emergencyBox.classList.add("hidden");
    el.emergencyBox.textContent = "";
  }
}

function renderStationFivePanel(active, step, isSolvedReadyNext) {
  ensureStationFiveBoard();

  if (el.coordsFeedback) {
    el.coordsFeedback.textContent = transient.stationFiveCoordsFeedback || "";
  }

  if (el.coordLatInput) {
    el.coordLatInput.disabled = !active || step >= 1;
  }
  if (el.coordLngInput) {
    el.coordLngInput.disabled = !active || step >= 1;
  }
  if (el.checkCoordsBtn) {
    el.checkCoordsBtn.disabled = !active || step >= 1;
  }

  if (el.stationFiveQuestion) {
    el.stationFiveQuestion.classList.toggle("hidden", step < 1);
  }
  if (el.sentenceBuilder) {
    el.sentenceBuilder.classList.toggle("hidden", step < 2);
  }

  renderStationFiveBoard();

  if (!el.sentenceHint) {
    return;
  }
  if (isSolvedReadyNext || step >= 3) {
    el.sentenceHint.textContent = "Satzlinie gesperrt. Bingo.";
    return;
  }
  const lineCount = transient.stationFiveBoard.lineWords.length;
  if (step >= 2 && lineCount === STATION_FIVE_SENTENCE_ORDER.length) {
    el.sentenceHint.textContent = "Noch nicht... probiert weiter.";
    return;
  }
  if (step >= 2) {
    el.sentenceHint.textContent = "Zieht die Woerter in die richtige Reihenfolge.";
    return;
  }
  el.sentenceHint.textContent = "";
}

function renderStationFiveBoard() {
  if (!el.wordBank || !el.sentenceLine) {
    return;
  }
  const board = transient.stationFiveBoard;
  const isLocked = board.locked;

  el.wordBank.innerHTML = "";
  el.sentenceLine.innerHTML = "";
  el.sentenceLine.classList.toggle("sentence-line-solved", isLocked);

  board.bankWords.forEach((word) => {
    el.wordBank.appendChild(createStationFiveChip(word, "bank", isLocked));
  });
  board.lineWords.forEach((word) => {
    el.sentenceLine.appendChild(createStationFiveChip(word, "line", isLocked));
  });

  if (!isLocked && board.lineWords.length === 0) {
    const placeholder = document.createElement("p");
    placeholder.className = "sentence-placeholder";
    placeholder.textContent = "Hier ablegen";
    el.sentenceLine.appendChild(placeholder);
  }

  el.wordBank.ondragover = onStationFiveDragOver;
  el.wordBank.ondrop = (event) => onStationFiveDropZone(event, "bank");
  el.sentenceLine.ondragover = onStationFiveDragOver;
  el.sentenceLine.ondrop = (event) => onStationFiveDropZone(event, "line");
}

function createStationFiveChip(word, origin, isLocked) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "word-chip";
  chip.textContent = word;
  chip.dataset.word = word;
  chip.dataset.origin = origin;
  chip.draggable = !isLocked;
  chip.disabled = isLocked;

  if (isLocked) {
    chip.classList.add("word-chip-locked");
    return chip;
  }

  chip.addEventListener("click", onStationFiveChipClick);
  chip.addEventListener("dragstart", onStationFiveDragStart);
  chip.addEventListener("dragend", onStationFiveDragEnd);
  chip.addEventListener("dragover", onStationFiveDragOver);
  chip.addEventListener("drop", onStationFiveDropOnChip);
  return chip;
}

function renderFinishedUI() {
  setHeroCompact(true);
  if (el.startCardTitle) {
    el.startCardTitle.textContent = "Abschluss";
  }
  el.modeTitle.textContent = "Geschafft.";
  el.modeSubtitle.textContent = "Finalziel Huette erreicht.";
  el.lockText.textContent = "Alle Stationen und das Finalziel wurden erreicht.";
  el.nextTargetText.textContent = "Koordinaten-Quiz geloest. Finale abgeschlossen.";

  el.challengeCard.classList.add("hidden");
  el.finalCard.classList.remove("hidden");

  setGpsStatus("ok", "Status: abgeschlossen");
  el.distanceText.textContent = "Du bist am Ende der Schnitzeljagd angekommen.";
  el.gpsFallback.textContent = "";

  el.permissionHelp.classList.add("hidden");
  el.permissionHelp.textContent = "";

  el.startChallengeBtn.classList.add("hidden");
  el.startChallengeBtn.disabled = true;
  el.startChallengeBtn.textContent = "Alle Challenges abgeschlossen";
  el.ctaHint.textContent = "";
}

function updateCountdown() {
  if (!isPreStart()) {
    el.countdownCard.classList.add("hidden");
    return;
  }

  if (TEST_MODE) {
    el.countdownCard.classList.remove("hidden");
    el.countdownValue.textContent = "TESTMODUS";
    el.startAtText.textContent = "Zeitpruefung deaktiviert (?test=1).";
    return;
  }

  const now = Date.now();
  const startAt = new Date(GAME_CONFIG.startAtISO).getTime();
  const diff = startAt - now;

  el.startAtText.textContent = `Start: ${formatDate(new Date(GAME_CONFIG.startAtISO))}`;

  if (diff <= 0) {
    el.countdownValue.textContent = "00:00:00";
    el.countdownCard.classList.add("hidden");
    return;
  }

  el.countdownCard.classList.remove("hidden");
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  el.countdownValue.textContent =
    days > 0
      ? `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderPlaylist() {
  renderSongList(el.playlistA, PLAYLIST.A);
  renderSongList(el.playlistB, PLAYLIST.B);
}

function renderTestModeBadge() {
  if (!el.testModeBadge) {
    return;
  }
  el.testModeBadge.classList.toggle("hidden", !TEST_MODE);
}

function renderSongList(container, songs) {
  container.innerHTML = "";
  songs.forEach((item) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = `${item.song} - ${item.artist}`;
    link.textContent = item.song;
    li.appendChild(link);
    container.appendChild(li);
  });
}

function renderHints() {
  el.hintList.innerHTML = "";
  HINTS.forEach((hint, index) => {
    const li = document.createElement("li");
    if (index < progress.hintsUnlocked) {
      li.textContent = `Hinweis ${index + 1}: ${hint}`;
    } else {
      li.textContent = `Hinweis ${index + 1}: noch gesperrt`;
    }
    el.hintList.appendChild(li);
  });
}

function setGpsStatus(kind, text) {
  el.gpsStatus.classList.remove("status-idle", "status-far", "status-near", "status-ok");
  const map = {
    idle: "status-idle",
    far: "status-far",
    near: "status-near",
    ok: "status-ok",
  };
  el.gpsStatus.classList.add(map[kind] || "status-idle");
  el.gpsStatus.textContent = text;
}

function formatGpsStatusText(kind) {
  if (kind === "ok") {
    return "Status: ok";
  }
  if (kind === "near") {
    return "Status: fast da";
  }
  if (kind === "far") {
    return "Status: zu weit";
  }
  return "Status: noch nicht geprueft";
}

function getCurrentStation() {
  return STATIONS[progress.currentStationIndex] || null;
}

function getStationOneStep() {
  const raw = progress.stepByStation[STATION_ONE_ID];
  if (!Number.isInteger(raw) || raw < 0) {
    return 0;
  }
  if (raw > STATION_ONE_STEPS.length) {
    return STATION_ONE_STEPS.length;
  }
  return raw;
}

function getStationTwoStep() {
  const raw = progress.stepByStation[STATION_TWO_ID];
  if (!Number.isInteger(raw) || raw < 0) {
    return 0;
  }
  if (raw > STATION_TWO_STEPS.length) {
    return STATION_TWO_STEPS.length;
  }
  return raw;
}

function getStationTwoTipCount() {
  const raw = progress.tipCountByStation[STATION_TWO_ID];
  if (!Number.isInteger(raw) || raw < 0) {
    return 0;
  }
  if (raw > STATION_TWO_TIPS.length) {
    return STATION_TWO_TIPS.length;
  }
  return raw;
}

function getStationFourTipCount() {
  const raw = progress.tipCountByStation[STATION_FOUR_ID];
  if (!Number.isInteger(raw) || raw < 0) {
    return 0;
  }
  if (raw > STATION_FOUR_TIPS.length) {
    return STATION_FOUR_TIPS.length;
  }
  return raw;
}

function getStationFiveStep() {
  const raw = progress.stepByStation[STATION_FIVE_ID];
  if (!Number.isInteger(raw) || raw < 0) {
    return 0;
  }
  if (raw > 3) {
    return 3;
  }
  return raw;
}

function getStationThreeCorrectCount() {
  const raw = progress.stepByStation[STATION_THREE_ID];
  if (!Number.isInteger(raw) || raw < 0) {
    return 0;
  }
  if (raw > STATION_THREE_TARGET_COUNT) {
    return STATION_THREE_TARGET_COUNT;
  }
  return raw;
}

function isPreStart() {
  if (TEST_MODE) {
    return false;
  }
  return Date.now() < new Date(GAME_CONFIG.startAtISO).getTime();
}

function isFinalLegActive() {
  return progress.finalLegUnlocked && !progress.finished;
}

function maybeUnlockStartHint() {
  if (isPreStart()) {
    return;
  }
  if (progress.hintsUnlocked === 0) {
    progress.hintsUnlocked = 1;
    saveProgress();
    renderHints();
  }
}

function normalizeProgress() {
  if (!Number.isInteger(progress.currentStationIndex) || progress.currentStationIndex < 0) {
    progress.currentStationIndex = 0;
  }

  if (progress.currentStationIndex > STATIONS.length) {
    progress.currentStationIndex = STATIONS.length;
  }

  if (typeof progress.hintsUnlocked !== "number") {
    progress.hintsUnlocked = 0;
  }
  progress.hintsUnlocked = Math.min(Math.max(progress.hintsUnlocked, 0), HINTS.length);

  const validStates = new Set(["locked", "active", "solved_needs_hint", "solved_ready_next"]);
  if (!validStates.has(progress.stageStatus)) {
    progress.stageStatus = "locked";
  }

  if (typeof progress.attemptsByStation !== "object" || progress.attemptsByStation === null) {
    progress.attemptsByStation = {};
  }

  if (typeof progress.stepByStation !== "object" || progress.stepByStation === null) {
    progress.stepByStation = {};
  }

  if (typeof progress.tipCountByStation !== "object" || progress.tipCountByStation === null) {
    progress.tipCountByStation = {};
  }

  const stationOneStep = progress.stepByStation[STATION_ONE_ID];
  if (!Number.isInteger(stationOneStep) || stationOneStep < 0) {
    progress.stepByStation[STATION_ONE_ID] = 0;
  } else if (stationOneStep > STATION_ONE_STEPS.length) {
    progress.stepByStation[STATION_ONE_ID] = STATION_ONE_STEPS.length;
  }
  if (
    progress.currentStationIndex === 0 &&
    progress.stageStatus === "active" &&
    progress.stepByStation[STATION_ONE_ID] >= STATION_ONE_STEPS.length
  ) {
    progress.stepByStation[STATION_ONE_ID] = STATION_ONE_STEPS.length - 1;
  }
  if (progress.currentStationIndex === 0 && progress.stageStatus === "solved_needs_hint") {
    progress.stageStatus = "solved_ready_next";
    if (progress.hintsUnlocked < 2) {
      progress.hintsUnlocked = 2;
    }
  }

  const stationTwoStep = progress.stepByStation[STATION_TWO_ID];
  if (!Number.isInteger(stationTwoStep) || stationTwoStep < 0) {
    progress.stepByStation[STATION_TWO_ID] = 0;
  } else if (stationTwoStep > STATION_TWO_STEPS.length) {
    progress.stepByStation[STATION_TWO_ID] = STATION_TWO_STEPS.length;
  }

  const stationTwoTips = progress.tipCountByStation[STATION_TWO_ID];
  if (!Number.isInteger(stationTwoTips) || stationTwoTips < 0) {
    progress.tipCountByStation[STATION_TWO_ID] = 0;
  } else if (stationTwoTips > STATION_TWO_TIPS.length) {
    progress.tipCountByStation[STATION_TWO_ID] = STATION_TWO_TIPS.length;
  }

  if (progress.currentStationIndex === 1 && progress.stageStatus === "solved_needs_hint") {
    progress.stageStatus = "solved_ready_next";
    if (progress.hintsUnlocked < 3) {
      progress.hintsUnlocked = 3;
    }
  }

  const stationFourTips = progress.tipCountByStation[STATION_FOUR_ID];
  if (!Number.isInteger(stationFourTips) || stationFourTips < 0) {
    progress.tipCountByStation[STATION_FOUR_ID] = 0;
  } else if (stationFourTips > STATION_FOUR_TIPS.length) {
    progress.tipCountByStation[STATION_FOUR_ID] = STATION_FOUR_TIPS.length;
  }

  const stationThreeStep = progress.stepByStation[STATION_THREE_ID];
  if (!Number.isInteger(stationThreeStep) || stationThreeStep < 0) {
    progress.stepByStation[STATION_THREE_ID] = 0;
  } else if (stationThreeStep > STATION_THREE_TARGET_COUNT) {
    progress.stepByStation[STATION_THREE_ID] = STATION_THREE_TARGET_COUNT;
  }
  if (
    progress.currentStationIndex === 2 &&
    progress.stageStatus === "active" &&
    progress.stepByStation[STATION_THREE_ID] >= STATION_THREE_TARGET_COUNT
  ) {
    progress.stepByStation[STATION_THREE_ID] = STATION_THREE_TARGET_COUNT - 1;
  }
  if (progress.currentStationIndex === 2 && progress.stageStatus === "solved_needs_hint") {
    progress.stageStatus = "solved_ready_next";
    if (progress.hintsUnlocked < 4) {
      progress.hintsUnlocked = 4;
    }
  }
  if (
    progress.currentStationIndex === 2 &&
    progress.stageStatus === "solved_ready_next" &&
    progress.stepByStation[STATION_THREE_ID] < STATION_THREE_TARGET_COUNT
  ) {
    progress.stepByStation[STATION_THREE_ID] = STATION_THREE_TARGET_COUNT;
  }

  const stationFourStep = progress.stepByStation[STATION_FOUR_ID];
  if (!Number.isInteger(stationFourStep) || stationFourStep < 0) {
    progress.stepByStation[STATION_FOUR_ID] = 0;
  } else if (stationFourStep > 1) {
    progress.stepByStation[STATION_FOUR_ID] = 1;
  }
  if (
    progress.currentStationIndex === 3 &&
    progress.stageStatus === "active" &&
    progress.stepByStation[STATION_FOUR_ID] >= 1
  ) {
    progress.stepByStation[STATION_FOUR_ID] = 0;
  }
  if (progress.currentStationIndex === 3 && progress.stageStatus === "solved_needs_hint") {
    progress.stageStatus = "solved_ready_next";
    if (progress.hintsUnlocked < 5) {
      progress.hintsUnlocked = 5;
    }
  }
  if (
    progress.currentStationIndex === 3 &&
    progress.stageStatus === "solved_ready_next" &&
    progress.stepByStation[STATION_FOUR_ID] < 1
  ) {
    progress.stepByStation[STATION_FOUR_ID] = 1;
  }

  const stationFiveStep = progress.stepByStation[STATION_FIVE_ID];
  if (!Number.isInteger(stationFiveStep) || stationFiveStep < 0) {
    progress.stepByStation[STATION_FIVE_ID] = 0;
  } else if (stationFiveStep > 3) {
    progress.stepByStation[STATION_FIVE_ID] = 3;
  }
  if (
    progress.currentStationIndex === 4 &&
    progress.stageStatus === "active" &&
    progress.stepByStation[STATION_FIVE_ID] >= 3
  ) {
    progress.stepByStation[STATION_FIVE_ID] = 2;
  }
  if (progress.currentStationIndex === 4 && progress.stageStatus === "solved_needs_hint") {
    progress.stageStatus = "solved_ready_next";
    progress.stepByStation[STATION_FIVE_ID] = 3;
  }
  if (
    progress.currentStationIndex === 4 &&
    progress.stageStatus === "solved_ready_next" &&
    progress.stepByStation[STATION_FIVE_ID] < 3
  ) {
    progress.stepByStation[STATION_FIVE_ID] = 3;
  }

  if (progress.currentStationIndex < STATIONS.length && progress.stageStatus === "solved_ready_next") {
    if (progress.currentStationIndex >= STATIONS.length - 1) {
      progress.currentStationIndex = STATIONS.length;
      progress.finalLegUnlocked = true;
    } else {
      progress.currentStationIndex += 1;
    }
    progress.stageStatus = "locked";
  }

  if (typeof progress.finalLegUnlocked !== "boolean") {
    progress.finalLegUnlocked = false;
  }

  if (typeof progress.finished !== "boolean") {
    progress.finished = false;
  }

  if (progress.finished) {
    progress.finalLegUnlocked = false;
  }

  if (progress.currentStationIndex === STATIONS.length && !progress.finished && !progress.finalLegUnlocked) {
    progress.finalLegUnlocked = true;
  }

  saveProgress();
}

function loadProgress() {
  const initial = {
    currentStationIndex: DEFAULT_PROGRESS.currentStationIndex,
    hintsUnlocked: DEFAULT_PROGRESS.hintsUnlocked,
    attemptsByStation: {},
    stepByStation: {},
    tipCountByStation: {},
    stageStatus: DEFAULT_PROGRESS.stageStatus,
    finalLegUnlocked: DEFAULT_PROGRESS.finalLegUnlocked,
    finished: DEFAULT_PROGRESS.finished,
  };

  try {
    const raw = localStorage.getItem(GAME_CONFIG.storageKey);
    if (!raw) {
      return initial;
    }

    const parsed = JSON.parse(raw);
    return {
      ...initial,
      ...parsed,
      attemptsByStation: {
        ...initial.attemptsByStation,
        ...(parsed.attemptsByStation || {}),
      },
      stepByStation: {
        ...initial.stepByStation,
        ...(parsed.stepByStation || {}),
      },
      tipCountByStation: {
        ...initial.tipCountByStation,
        ...(parsed.tipCountByStation || {}),
      },
    };
  } catch (error) {
    return initial;
  }
}

function saveProgress() {
  const payload = {
    currentStationIndex: progress.currentStationIndex,
    hintsUnlocked: progress.hintsUnlocked,
    attemptsByStation: progress.attemptsByStation,
    stepByStation: progress.stepByStation,
    tipCountByStation: progress.tipCountByStation,
    stageStatus: progress.stageStatus,
    finalLegUnlocked: progress.finalLegUnlocked,
    finished: progress.finished,
  };

  localStorage.setItem(GAME_CONFIG.storageKey, JSON.stringify(payload));
}

function incrementAttempts(stationId) {
  const current = progress.attemptsByStation[stationId] || 0;
  const next = current + 1;
  progress.attemptsByStation[stationId] = next;
  return next;
}

function pickFailureMessage() {
  const idx = Math.floor(Math.random() * FEHLERSPRUECHE.length);
  return FEHLERSPRUECHE[idx];
}

function classifyDistance(distance, radius) {
  if (distance <= radius) {
    return "ok";
  }
  if (distance <= radius + 80) {
    return "near";
  }
  return "far";
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\u00e4/g, "ae")
    .replace(/\u00f6/g, "oe")
    .replace(/\u00fc/g, "ue")
    .replace(/\u00df/g, "ss")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function geoErrorToMessage(error) {
  if (!error) {
    return "Standort konnte nicht bestimmt werden. Bitte erneut versuchen.";
  }

  if (error.code === 1) {
    return (
      "Standortfreigabe verweigert. Bitte Standort aktivieren und dann erneut auf 'Challenge starten' tippen. " +
      "Auf iPhone/Android ggf. Browser-Berechtigung in den Systemeinstellungen erlauben."
    );
  }

  if (error.code === 2) {
    return "Standort momentan nicht verfuegbar. Geht kurz ins Freie und versucht es erneut.";
  }

  if (error.code === 3) {
    return "GPS-Timeout. Standort neu anfragen und kurz warten.";
  }

  return "Unbekannter GPS-Fehler. Bitte erneut versuchen.";
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadius = 6371000;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatStartDateHint() {
  return `Startdatum aktuell: ${formatDate(new Date(GAME_CONFIG.startAtISO))}`;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Absichtlich still: App soll ohne SW normal funktionieren.
    });
  });
}

function byId(id) {
  return document.getElementById(id);
}
