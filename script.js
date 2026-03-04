"use strict";

const GAME_CONFIG = Object.freeze({
  // Schnell austauschbar: einfach diese ISO-Zeit anpassen.
  startAtISO: "2026-04-25T10:00:00+02:00",
  storageKey: "schnitzeljagd-progress-v1",
  geolocation: {
    enableHighAccuracy: true,
    timeout: 12000,
    maximumAge: 0,
  },
});

const PLAYLIST = Object.freeze({
  A: [
    {
      song: "Numb / Encore",
      artist: "Linkin Park & Jay-Z",
      url: "https://open.spotify.com/search/Numb%20Encore",
    },
    {
      song: "Hurra",
      artist: "Die Aerzte",
      url: "https://open.spotify.com/search/Die%20Aerzte%20Hurra",
    },
    {
      song: "Superstition",
      artist: "Stevie Wonder",
      url: "https://open.spotify.com/search/Stevie%20Wonder%20Superstition",
    },
  ],
  B: [
    {
      song: "Another Brick in the Wall",
      artist: "Pink Floyd",
      url: "https://open.spotify.com/search/Another%20Brick%20in%20the%20Wall",
    },
    {
      song: "Wonderwall",
      artist: "Oasis",
      url: "https://open.spotify.com/search/Oasis%20Wonderwall",
    },
    {
      song: "Playlist-Platzhalter",
      artist: "Spaeter ergaenzen",
      url: "https://open.spotify.com/",
    },
  ],
});

const HINTS = Object.freeze([
  "Habt immer die Zeit im Blick",
  "Achtet auf die letzte Ziffer",
  "Bildet eine Reihe",
  "Da fehlt noch ein Punkt",
  "Und? Wohin gehts?",
]);

const STATIONS = Object.freeze([
  {
    id: "clara-zetkin",
    title: "Station 1 - Blockfloete",
    locationName: "Clara-Zetkin-Haus",
    address: "[Platzhalter-Adresse einsetzen]",
    routeHint: "Folgt dem Hauptweg und achtet auf die Beschilderung.",
    target: { lat: 50.0001, lng: 8.0001 },
    radius: 120,
    fallback: "Wenn GPS spinnt: Geht zum Haupteingang.",
    story:
      "Linkin Park trifft Jay-Z, daraus wird Encore. Ihr kennt den Gedanken dahinter.",
    prompt: "Was ist das passende Loesungswort zu 'Encore'?",
    answers: ["noch einmal", "nochmal", "noch ein mal"],
    tip: "Uebersetzt den Kernbegriff ins Deutsche.",
    nextStageText: "Naechstes Ziel: Kemnater Hof.",
  },
  {
    id: "kemnater-hof",
    title: "Station 2 - Emoji-Raetsel",
    locationName: "Kemnater Hof",
    address: "[Platzhalter-Adresse einsetzen]",
    routeHint: "Bleibt auf dem Weg, bis ihr den Hofbereich seht.",
    target: { lat: 50.0011, lng: 8.0022 },
    radius: 120,
    fallback: "Wenn GPS spinnt: Geht zum markanten Hofschild.",
    story: "Die Aerzte sagen Hurra. Das Gefuehl kennt ihr aus alten Zeiten.",
    prompt: "Welches Loesungswort ergibt sich daraus?",
    answers: ["wie fruher", "wie frueher"],
    tip: "Denkt an Nostalgie und Vergangenes.",
    nextStageText: "Naechstes Ziel: Rossert.",
  },
  {
    id: "rossert",
    title: "Station 3 - Hitster & Vesper",
    locationName: "Rossert",
    address: "[Platzhalter-Adresse einsetzen]",
    routeHint: "Richtung Waldkante halten, dort findet ihr den Punkt.",
    target: { lat: 50.0033, lng: 8.0038 },
    radius: 150,
    fallback: "Wenn GPS spinnt: Geht zu den Baenken am markanten Punkt.",
    story: "Hitster + Vesper: Ihr braucht X richtige und die richtige Fortsetzung.",
    prompt: "Welches Loesungswort passt zu 'X richtige'?",
    answers: ["in der"],
    tip: "Es ist eine kurze, zweigeteilte Wortgruppe.",
    nextStageText: "Naechstes Ziel: Zentralapotheke.",
  },
  {
    id: "zentralapotheke",
    title: "Station 4 - Mashup",
    locationName: "Zentralapotheke",
    address: "[Platzhalter-Adresse einsetzen]",
    routeHint: "Haltet Ausschau nach dem markanten Eingangsbereich.",
    target: { lat: 50.0046, lng: 8.0049 },
    radius: 120,
    fallback: "Wenn GPS spinnt: Geht direkt zum Eingang mit Schild.",
    story: "Stevie Wonder trifft Another Brick in the Wall. Daraus entsteht ein Klassiker.",
    prompt: "Wie lautet das Loesungswort?",
    answers: ["wonderwall"],
    tip: "Es ist ein sehr bekannter Songtitel.",
    nextStageText: "Naechstes Ziel: Riederstrasse.",
  },
  {
    id: "riederstrasse",
    title: "Station 5 - Meta-Raetsel",
    locationName: "Riederstrasse",
    address: "[Platzhalter-Adresse einsetzen]",
    routeHint: "Geht zur markanten Stelle an der Strasse.",
    target: { lat: 50.0058, lng: 8.0061 },
    radius: 120,
    fallback: "Wenn GPS spinnt: Geht zum markantesten Punkt vor Ort.",
    story: "Koordinaten -> Gitarre -> finaler Schritt. Jetzt wird es konkret.",
    prompt: "Welches finale Loesungswort ergibt sich?",
    answers: ["hutte", "huette"],
    tip: "Denkt an einen Ort im Freien mit Dach und Holzcharakter.",
    nextStageText: "Finale freigeschaltet.",
  },
]);

const DEFAULT_PROGRESS = Object.freeze({
  currentStationIndex: 0,
  hintsUnlocked: 0,
  attemptsByStation: {},
  stageStatus: "locked",
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
  emergencyByStation: {},
};

const el = {
  modeTitle: byId("modeTitle"),
  modeSubtitle: byId("modeSubtitle"),
  countdownCard: byId("countdownCard"),
  countdownValue: byId("countdownValue"),
  startAtText: byId("startAtText"),
  playlistA: byId("playlistA"),
  playlistB: byId("playlistB"),
  hintList: byId("hintList"),
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
  challengePrompt: byId("challengePrompt"),
  answerInput: byId("answerInput"),
  checkAnswerBtn: byId("checkAnswerBtn"),
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
  renderPlaylist();
  renderHints();
  bindEvents();
  normalizeProgress();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  updateUI();
  registerServiceWorker();
}

function bindEvents() {
  el.startChallengeBtn.addEventListener("click", onStartChallenge);
  el.checkAnswerBtn.addEventListener("click", onCheckAnswer);
  el.showHintBtn.addEventListener("click", onToggleTip);
  el.unlockHintBtn.addEventListener("click", onUnlockHint);
  el.nextStageBtn.addEventListener("click", onNextStage);
  el.emergencyBtn.addEventListener("click", onEmergency);

  el.answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onCheckAnswer();
    }
  });
}

function onStartChallenge() {
  if (isPreStart() || progress.finished) {
    return;
  }

  if (progress.stageStatus === "solved_needs_hint" || progress.stageStatus === "solved_ready_next") {
    transient.permissionMessage =
      "Diese Station ist bereits geloest. Nutzt jetzt 'Hinweis freischalten' oder 'Weiter zur naechsten Etappe'.";
    updateUI();
    return;
  }

  const station = getCurrentStation();
  if (!station) {
    return;
  }

  transient.permissionMessage = "";

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
      const dist = haversineMeters(latitude, longitude, station.target.lat, station.target.lng);

      transient.distanceMeters = Math.round(dist);
      transient.gpsStatus = classifyDistance(dist, station.radius);

      if (dist <= station.radius) {
        if (progress.stageStatus === "locked") {
          progress.stageStatus = "active";
          saveProgress();
        }
        transient.permissionMessage = "Im Radius. Challenge ist freigeschaltet.";
      } else {
        progress.stageStatus = "locked";
        saveProgress();
        transient.permissionMessage =
          "Noch zu weit weg. Geht naeher an den Zielpunkt und tippt erneut auf Challenge starten.";
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
    el.feedbackText.textContent = "Bitte erst ein Loesungswort eingeben.";
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

function onToggleTip() {
  transient.tipVisible = !transient.tipVisible;
  updateUI();
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

  if (progress.currentStationIndex >= STATIONS.length - 1) {
    progress.currentStationIndex = STATIONS.length;
    progress.finished = true;
    progress.stageStatus = "locked";
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
  const preStart = isPreStart();
  const station = getCurrentStation();

  if (preStart) {
    renderPreStartUI();
    return;
  }

  if (progress.finished) {
    renderFinishedUI();
    return;
  }

  renderStartMode(station);
  renderChallenge(station);
}

function renderPreStartUI() {
  el.modeTitle.textContent = "Schnitzeljagd - Pre-Start";
  el.modeSubtitle.textContent =
    "Diese Songs haben Bedeutung. Noch nichts eingeben, nur anschauen.";
  el.lockText.textContent =
    "Inhalte der Stationen sind noch gesperrt. Start ist erst um 10:00 Uhr.";
  el.nextTargetText.textContent = "Ab Start wird das erste Ziel freigeschaltet.";

  setGpsStatus("idle", "Status: gesperrt bis Start");
  el.distanceText.textContent = "Du bist -- Meter entfernt";
  el.gpsFallback.textContent = "";

  el.permissionHelp.classList.add("hidden");
  el.permissionHelp.textContent = "";

  el.challengeCard.classList.add("hidden");
  el.finalCard.classList.add("hidden");

  el.startChallengeBtn.disabled = true;
  el.startChallengeBtn.textContent = "Challenge startet um 10:00";
  el.ctaHint.textContent = formatStartDateHint();
  el.stickyBar.classList.remove("hidden");
}

function renderStartMode(station) {
  el.modeTitle.textContent = "Jetzt gehts los.";
  el.modeSubtitle.textContent = "Songs der Playlist haben Bedeutung.";

  el.lockText.textContent = `Ziel: ${station.locationName} (${station.address})`;
  el.nextTargetText.textContent = station.routeHint;
  el.gpsFallback.textContent = `Fallback: ${station.fallback}`;

  const distance =
    typeof transient.distanceMeters === "number" ? transient.distanceMeters : "--";
  el.distanceText.textContent = `Du bist ${distance} Meter entfernt`;

  const statusText =
    transient.gpsStatus === "ok"
      ? "Status: ok"
      : transient.gpsStatus === "near"
      ? "Status: fast da"
      : transient.gpsStatus === "far"
      ? "Status: zu weit"
      : "Status: noch nicht geprueft";

  setGpsStatus(transient.gpsStatus, statusText);

  if (transient.permissionMessage) {
    el.permissionHelp.classList.remove("hidden");
    el.permissionHelp.textContent = transient.permissionMessage;
  } else {
    el.permissionHelp.classList.add("hidden");
    el.permissionHelp.textContent = "";
  }

  el.startChallengeBtn.disabled = false;
  el.startChallengeBtn.textContent = "Challenge starten";
  el.ctaHint.textContent = "GPS wird nur bei Klick abgefragt und nicht gespeichert.";
  el.stickyBar.classList.remove("hidden");
  el.finalCard.classList.add("hidden");
}

function renderChallenge(station) {
  if (progress.stageStatus === "locked") {
    el.challengeCard.classList.add("hidden");
    el.feedbackText.textContent = "";
    return;
  }

  el.challengeCard.classList.remove("hidden");
  el.challengeTitle.textContent = station.title;
  el.challengeStory.textContent = station.story;
  el.challengePrompt.textContent = station.prompt;
  el.tipText.textContent = station.tip || "";

  const tries = progress.attemptsByStation[station.id] || 0;
  const isSolvedNeedsHint = progress.stageStatus === "solved_needs_hint";
  const isSolvedReadyNext = progress.stageStatus === "solved_ready_next";

  const active = progress.stageStatus === "active";
  el.answerInput.disabled = !active;
  el.checkAnswerBtn.disabled = !active;
  el.checkAnswerBtn.classList.toggle("hidden", !active);

  const hasTip = Boolean(station.tip);
  el.showHintBtn.classList.toggle("hidden", !(active && hasTip));
  el.showHintBtn.textContent = transient.tipVisible ? "Tipp ausblenden" : "Tipp anzeigen";

  if (active && hasTip && transient.tipVisible) {
    el.tipText.classList.remove("hidden");
  } else {
    el.tipText.classList.add("hidden");
  }

  el.unlockHintBtn.classList.toggle("hidden", !isSolvedNeedsHint);
  el.nextStageBtn.classList.toggle("hidden", !isSolvedReadyNext);
  el.nextStageBtn.textContent =
    progress.currentStationIndex === STATIONS.length - 1
      ? "Zum Finale"
      : "Weiter zur naechsten Etappe";

  if (isSolvedNeedsHint) {
    el.feedbackText.textContent =
      "Erfolg! Schalte jetzt den naechsten Hinweis frei, dann geht es weiter.";
  }

  if (isSolvedReadyNext) {
    const nextText =
      progress.currentStationIndex < STATIONS.length - 1
        ? STATIONS[progress.currentStationIndex].nextStageText
        : "Finale freigeschaltet.";
    el.feedbackText.textContent = `Hinweis freigeschaltet. ${nextText}`;
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

function renderFinishedUI() {
  el.modeTitle.textContent = "Geschafft.";
  el.modeSubtitle.textContent = "Alle Stationen geloest.";
  el.lockText.textContent = "Letzte Etappe erreicht.";
  el.nextTargetText.textContent = "Setzt eure Reihe als Koordinaten in Google Maps ein.";

  el.challengeCard.classList.add("hidden");
  el.finalCard.classList.remove("hidden");

  setGpsStatus("ok", "Status: abgeschlossen");
  el.distanceText.textContent = "Du bist am Ende der Schnitzeljagd angekommen.";
  el.gpsFallback.textContent = "";

  el.permissionHelp.classList.add("hidden");
  el.permissionHelp.textContent = "";

  el.startChallengeBtn.disabled = true;
  el.startChallengeBtn.textContent = "Alle Challenges abgeschlossen";
  el.ctaHint.textContent = "";
}

function updateCountdown() {
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

function renderSongList(container, songs) {
  container.innerHTML = "";
  songs.forEach((item) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${item.song} - ${item.artist}`;
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

function getCurrentStation() {
  return STATIONS[progress.currentStationIndex] || null;
}

function isPreStart() {
  return Date.now() < new Date(GAME_CONFIG.startAtISO).getTime();
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

  if (progress.currentStationIndex === STATIONS.length) {
    progress.finished = true;
  }

  if (typeof progress.finished !== "boolean") {
    progress.finished = false;
  }

  saveProgress();
}

function loadProgress() {
  const initial = {
    currentStationIndex: DEFAULT_PROGRESS.currentStationIndex,
    hintsUnlocked: DEFAULT_PROGRESS.hintsUnlocked,
    attemptsByStation: {},
    stageStatus: DEFAULT_PROGRESS.stageStatus,
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
    stageStatus: progress.stageStatus,
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
