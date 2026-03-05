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

const STATIONS = Object.freeze([
  {
    id: "clara-zetkin",
    title: "Station 1 - Blockfloete",
    locationName: "Clara Zetkin Haus",
    address: "48 44'44.3\"N 9 12'17.7\"E",
    routeHint: "Startpunkt um 10:00. Dort startet euer Blockfloeten-Spiel.",
    target: { lat: 48.745639, lng: 9.204917 },
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
    address: "48 43'52.5\"N 9 13'34.7\"E",
    routeHint: "Bleibt auf dem Weg, bis ihr den Hofbereich seht.",
    target: { lat: 48.73125, lng: 9.226306 },
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
    address: "48 43'20.3\"N 9 14'25.7\"E",
    routeHint: "Richtung Waldkante halten, dort findet ihr den Punkt.",
    target: { lat: 48.722306, lng: 9.240472 },
    radius: 150,
    fallback: "Wenn GPS spinnt: Geht zu den Baenken am markanten Punkt.",
    story: "Hitster + Vesper: Ihr braucht X richtige und die richtige Fortsetzung.",
    prompt: "Welches Loesungswort passt zu 'X richtige'?",
    answers: ["in der"],
    tip: "Es ist eine kurze, zweigeteilte Wortgruppe.",
    nextStageText: "Naechstes Ziel: Ruiter Krankenhaus.",
  },
  {
    id: "ruiter-krankenhaus",
    title: "Station 4 - Wort-Raetsel",
    locationName: "Ruiter Krankenhaus",
    address: "48 44'23.3\"N 9 15'09.8\"E",
    routeHint: "Geht zum Eingangsbereich des Krankenhauses.",
    target: { lat: 48.739806, lng: 9.252722 },
    radius: 120,
    fallback: "Wenn GPS spinnt: Geht direkt zum Eingang mit Schild.",
    story: "Hier wartet euer Wort-Raetsel als naechste Etappe.",
    prompt: "Wie lautet das Loesungswort?",
    answers: ["wonderwall"],
    tip: "Es ist ein sehr bekannter Songtitel.",
    nextStageText: "Naechstes Ziel: Riederstrasse.",
  },
  {
    id: "riederstrasse",
    title: "Station 5 - Meta-Raetsel",
    locationName: "Riederstrasse",
    address: "48 45'11.6\"N 9 14'39.3\"E",
    routeHint: "Geht zur markanten Stelle an der Strasse.",
    target: { lat: 48.753222, lng: 9.24425 },
    radius: 120,
    fallback: "Wenn GPS spinnt: Geht zum markantesten Punkt vor Ort.",
    story: "Koordinaten -> Gitarre -> finaler Schritt. Jetzt wird es konkret.",
    prompt: "Welches finale Loesungswort ergibt sich?",
    answers: ["hutte", "huette"],
    tip: "Denkt an einen Ort im Freien mit Dach und Holzcharakter.",
    nextStageText: "Finalziel freigeschaltet: Huette.",
  },
]);

const FINAL_DESTINATION = Object.freeze({
  locationName: "Huette",
  address: "48 44'47.4\"N 9 14'38.2\"E",
  routeHint: "Nach der Aufloesung in der Riederstrasse geht es zur Huette.",
  target: { lat: 48.7465, lng: 9.243944 },
  radius: 150,
  fallback: "Wenn GPS spinnt: Geht zum markantesten Punkt an der Huette.",
});

const DEFAULT_PROGRESS = Object.freeze({
  currentStationIndex: 0,
  hintsUnlocked: 0,
  attemptsByStation: {},
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
  emergencyByStation: {},
};

const el = {
  modeTitle: byId("modeTitle"),
  modeSubtitle: byId("modeSubtitle"),
  testModeBadge: byId("testModeBadge"),
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
  renderTestModeBadge();
  renderPlaylist();
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

  const finalLeg = isFinalLegActive();

  if (
    !finalLeg &&
    (progress.stageStatus === "solved_needs_hint" || progress.stageStatus === "solved_ready_next")
  ) {
    transient.permissionMessage =
      "Diese Station ist bereits geloest. Nutzt jetzt 'Hinweis freischalten' oder 'Weiter zur naechsten Etappe'.";
    updateUI();
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
  el.modeTitle.textContent = "Schnitzeljagd - Pre-Start";
  el.modeSubtitle.textContent =
    "Diese Songs haben Bedeutung. Noch nichts eingeben, nur anschauen.";
  el.lockText.textContent =
    "Inhalte der Stationen sind noch gesperrt. Start ist erst um 10:00 Uhr.";
  el.nextTargetText.textContent =
    "Ab Start wird Hinweis 1 freigeschaltet und Station 1 am Clara Zetkin Haus aktiv.";

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
  if (!station) {
    return;
  }

  el.modeTitle.textContent = "Jetzt gehts los.";
  el.modeSubtitle.textContent = "Songs der Playlist haben Bedeutung.";

  el.lockText.textContent = `Ziel: ${station.locationName} (${station.address})`;
  el.nextTargetText.textContent = station.routeHint;
  el.gpsFallback.textContent = `Fallback: ${station.fallback}`;

  const distance =
    typeof transient.distanceMeters === "number" ? transient.distanceMeters : "--";
  el.distanceText.textContent = `Du bist ${distance} Meter entfernt`;

  setGpsStatus(transient.gpsStatus, formatGpsStatusText(transient.gpsStatus));

  if (transient.permissionMessage) {
    el.permissionHelp.classList.remove("hidden");
    el.permissionHelp.textContent = transient.permissionMessage;
  } else {
    el.permissionHelp.classList.add("hidden");
    el.permissionHelp.textContent = "";
  }

  el.startChallengeBtn.disabled = false;
  el.startChallengeBtn.textContent = "Challenge starten";
  el.ctaHint.textContent = TEST_MODE
    ? "Testmodus aktiv: Zeit- und GPS-Pruefung sind deaktiviert."
    : "GPS wird nur bei Klick abgefragt und nicht gespeichert.";
  el.stickyBar.classList.remove("hidden");
  el.finalCard.classList.add("hidden");
}

function renderFinalLegMode() {
  el.modeTitle.textContent = "Finale Etappe";
  el.modeSubtitle.textContent = "Aufloesung geholt? Dann ab zur Huette.";

  el.lockText.textContent = `Finalziel: ${FINAL_DESTINATION.locationName} (${FINAL_DESTINATION.address})`;
  el.nextTargetText.textContent = FINAL_DESTINATION.routeHint;
  el.gpsFallback.textContent = `Fallback: ${FINAL_DESTINATION.fallback}`;

  const distance =
    typeof transient.distanceMeters === "number" ? transient.distanceMeters : "--";
  el.distanceText.textContent = `Du bist ${distance} Meter entfernt`;

  setGpsStatus(transient.gpsStatus, formatGpsStatusText(transient.gpsStatus));

  if (transient.permissionMessage) {
    el.permissionHelp.classList.remove("hidden");
    el.permissionHelp.textContent = transient.permissionMessage;
  } else {
    el.permissionHelp.classList.add("hidden");
    el.permissionHelp.textContent = "";
  }

  el.challengeCard.classList.add("hidden");
  el.finalCard.classList.add("hidden");

  el.startChallengeBtn.disabled = false;
  el.startChallengeBtn.textContent = "Finalziel pruefen";
  el.ctaHint.textContent = TEST_MODE
    ? "Testmodus aktiv: Finalziel-Pruefung laeuft ohne GPS."
    : "GPS wird nur bei Klick abgefragt und nicht gespeichert.";
  el.stickyBar.classList.remove("hidden");
}

function renderChallenge(station) {
  if (progress.stageStatus === "locked" || !station) {
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
      ? "Finalziel freischalten"
      : "Weiter zur naechsten Etappe";

  if (isSolvedNeedsHint) {
    el.feedbackText.textContent =
      "Erfolg! Schalte jetzt den naechsten Hinweis frei, dann geht es weiter.";
  }

  if (isSolvedReadyNext) {
    const nextText =
      progress.currentStationIndex < STATIONS.length - 1
        ? STATIONS[progress.currentStationIndex].nextStageText
        : "Finalziel freigeschaltet: Huette.";
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

  el.startChallengeBtn.disabled = true;
  el.startChallengeBtn.textContent = "Alle Challenges abgeschlossen";
  el.ctaHint.textContent = "";
}

function updateCountdown() {
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
