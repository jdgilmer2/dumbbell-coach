const STORAGE_KEY = "dumbbellCoach.sessions.v1";
const HEALTH_STORAGE_KEY = "dumbbellCoach.health.v1";

const workouts = [
  {
    id: "A",
    title: "Workout A",
    focus: "Full body baseline: push, pull, squat, hinge, arms.",
    exercises: [
      {
        name: "Dumbbell Bench Press",
        sets: 3,
        reps: "8-12",
        cue: "Bench flat. Stop each set with 1-2 good reps left."
      },
      {
        name: "One-Arm Dumbbell Row",
        sets: 3,
        reps: "8-12 each side",
        cue: "Support one hand on the bench. Pull elbow toward hip."
      },
      {
        name: "Goblet Squat",
        sets: 3,
        reps: "8-12",
        cue: "Hold one dumbbell at chest. Smooth depth, no knee pain."
      },
      {
        name: "Dumbbell Romanian Deadlift",
        sets: 3,
        reps: "8-12",
        cue: "Soft knees. Hips back. Feel hamstrings, not low back."
      },
      {
        name: "Dumbbell Curl",
        sets: 2,
        reps: "10-15",
        cue: "Keep elbows still. Do not swing the last reps."
      },
      {
        name: "Bench Plank",
        sets: 2,
        reps: "30-45 sec",
        cue: "Hands or forearms on bench. Brace and breathe."
      }
    ]
  },
  {
    id: "B",
    title: "Workout B",
    focus: "Shoulders, legs, back, chest support, triceps.",
    exercises: [
      {
        name: "Seated Dumbbell Shoulder Press",
        sets: 3,
        reps: "8-12",
        cue: "Use the bench upright if possible. Keep ribs down."
      },
      {
        name: "Split Squat",
        sets: 3,
        reps: "8-10 each leg",
        cue: "Bodyweight first if needed. Add dumbbells only when steady."
      },
      {
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "8-12",
        cue: "Set bench low incline. Smooth reps, no shoulder pinch."
      },
      {
        name: "Chest-Supported Dumbbell Row",
        sets: 3,
        reps: "8-12",
        cue: "Lie chest-down on incline bench. Pull shoulder blades back."
      },
      {
        name: "Overhead Dumbbell Triceps Extension",
        sets: 2,
        reps: "10-15",
        cue: "Use one dumbbell. Keep elbows pointed forward."
      },
      {
        name: "Suitcase Carry",
        sets: 2,
        reps: "30-45 sec each side",
        cue: "Walk or stand tall holding one dumbbell at your side."
      }
    ]
  },
  {
    id: "C",
    title: "Workout C",
    focus: "Technique day: lighter, clean reps, extra range of motion.",
    exercises: [
      {
        name: "Push-Up on Bench",
        sets: 3,
        reps: "8-15",
        cue: "Hands on bench if needed. Keep body straight."
      },
      {
        name: "Dumbbell Step-Up",
        sets: 3,
        reps: "8-10 each leg",
        cue: "Use a stable step. Drive through the whole foot."
      },
      {
        name: "Dumbbell Pullover",
        sets: 2,
        reps: "10-12",
        cue: "Go light. Feel chest/lats, not shoulder strain."
      },
      {
        name: "Dumbbell Hip Thrust",
        sets: 3,
        reps: "10-15",
        cue: "Upper back on bench. Pause at the top."
      },
      {
        name: "Lateral Raise",
        sets: 2,
        reps: "12-15",
        cue: "Light weight. Raise to shoulder height, no swinging."
      },
      {
        name: "Dead Bug",
        sets: 2,
        reps: "8-10 each side",
        cue: "Slow, controlled core work. Low back stays down."
      }
    ]
  }
];

let currentWorkoutIndex = 0;

const elements = {
  workoutTitle: document.querySelector("#workoutTitle"),
  workoutFocus: document.querySelector("#workoutFocus"),
  exerciseList: document.querySelector("#exerciseList"),
  logRows: document.querySelector("#logRows"),
  sessionDate: document.querySelector("#sessionDate"),
  sessionForm: document.querySelector("#sessionForm"),
  recommendations: document.querySelector("#recommendations"),
  history: document.querySelector("#history"),
  sessionCount: document.querySelector("#sessionCount"),
  lastTrained: document.querySelector("#lastTrained"),
  bestStreak: document.querySelector("#bestStreak"),
  nextWorkoutPill: document.querySelector("#nextWorkoutPill"),
  previousWorkout: document.querySelector("#previousWorkout"),
  nextWorkout: document.querySelector("#nextWorkout"),
  clearForm: document.querySelector("#clearForm"),
  resetData: document.querySelector("#resetData"),
  fillExample: document.querySelector("#fillExample"),
  sessionNotes: document.querySelector("#sessionNotes"),
  exportData: document.querySelector("#exportData"),
  importData: document.querySelector("#importData"),
  importHealth: document.querySelector("#importHealth"),
  healthSummary: document.querySelector("#healthSummary")
};

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function loadHealthData() {
  try {
    return JSON.parse(localStorage.getItem(HEALTH_STORAGE_KEY)) || emptyHealthData();
  } catch {
    return emptyHealthData();
  }
}

function saveHealthData(healthData) {
  localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(healthData));
}

function emptyHealthData() {
  return {
    importedAt: null,
    source: null,
    latestWeightLb: null,
    latestWeightDate: null,
    daily: {}
  };
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentWorkout() {
  return workouts[currentWorkoutIndex];
}

function parseRepRange(repText) {
  const match = repText.match(/(\d+)\D+(\d+)/);
  if (!match) return { low: 8, high: 12 };
  return { low: Number(match[1]), high: Number(match[2]) };
}

function renderWorkout() {
  const workout = getCurrentWorkout();
  elements.workoutTitle.textContent = workout.title;
  elements.workoutFocus.textContent = workout.focus;
  elements.nextWorkoutPill.textContent = `Next: ${workout.title}`;

  elements.exerciseList.innerHTML = workout.exercises
    .map((exercise) => `
      <article class="exercise-card">
        <div class="exercise-title">
          <strong>${exercise.name}</strong>
          <span class="badge">${exercise.sets} x ${exercise.reps}</span>
        </div>
        <p>${exercise.cue}</p>
      </article>
    `)
    .join("");

  elements.logRows.innerHTML = workout.exercises
    .map((exercise, index) => `
      <div class="log-row">
        <label>
          Exercise
          <input value="${exercise.name}" data-field="name" data-index="${index}" readonly>
        </label>
        <label>
          Weight
          <input type="number" min="0" step="2.5" placeholder="lbs" data-field="weight" data-index="${index}">
        </label>
        <label>
          Best reps
          <input type="number" min="0" step="1" placeholder="reps" data-field="reps" data-index="${index}">
        </label>
        <label>
          RPE
          <select data-field="rpe" data-index="${index}">
            <option value="">Pick</option>
            <option value="6">6 easy</option>
            <option value="7">7 solid</option>
            <option value="8">8 hard</option>
            <option value="9">9 near max</option>
            <option value="10">10 max</option>
          </select>
        </label>
      </div>
    `)
    .join("");
}

function buildRecommendations(session) {
  return session.entries.map((entry) => {
    const exercise = getCurrentWorkout().exercises.find((item) => item.name === entry.name);
    const range = parseRepRange(exercise?.reps || "8-12");
    const reps = Number(entry.reps || 0);
    const weight = Number(entry.weight || 0);
    const rpe = Number(entry.rpe || 0);

    if (!reps || !weight) {
      return {
        type: "hold",
        name: entry.name,
        message: "No complete log yet. Use a weight you can control and record the best clean set."
      };
    }

    if (reps >= range.high && rpe <= 8) {
      return {
        type: "increase",
        name: entry.name,
        message: `Increase next time. Try ${roundToHalf(weight + 5)} lb if your dumbbells allow it, or add one rep per set if that jump feels too big.`
      };
    }

    if (reps < range.low || rpe >= 10) {
      return {
        type: "reduce",
        name: entry.name,
        message: `Back off slightly next time. Try ${Math.max(0, roundToHalf(weight - 5))} lb, or keep the same weight and aim for cleaner reps.`
      };
    }

    if (rpe >= 9) {
      return {
        type: "hold",
        name: entry.name,
        message: "Hold this weight next time. Your goal is to make it feel smoother before increasing."
      };
    }

    return {
      type: "hold",
      name: entry.name,
      message: "Keep the same weight next time and try to add 1 rep while keeping form clean."
    };
  });
}

function roundToHalf(value) {
  return Math.round(value * 2) / 2;
}

function renderRecommendations(session) {
  if (!session) {
    elements.recommendations.className = "recommendations empty-state";
    elements.recommendations.textContent = "Log a session and I will suggest what to change next time.";
    return;
  }

  const recs = buildRecommendations(session);
  elements.recommendations.className = "recommendations";
  elements.recommendations.innerHTML = recs
    .map((rec) => `
      <article class="recommendation-card ${rec.type}">
        <strong>${rec.name}</strong>
        <p>${rec.message}</p>
      </article>
    `)
    .join("");
}

function renderHistory() {
  const sessions = loadSessions();
  elements.sessionCount.textContent = sessions.length;
  elements.lastTrained.textContent = sessions.length ? formatDate(sessions.at(-1).date) : "None";
  elements.bestStreak.textContent = calculateBestStreak(sessions);

  if (!sessions.length) {
    elements.history.className = "history empty-state";
    elements.history.textContent = "No sessions saved yet.";
    renderRecommendations(null);
    return;
  }

  elements.history.className = "history";
  elements.history.innerHTML = [...sessions]
    .reverse()
    .map((session) => {
      const totalVolume = session.entries.reduce((sum, entry) => {
        return sum + Number(entry.weight || 0) * Number(entry.reps || 0);
      }, 0);
      const best = session.entries
        .filter((entry) => entry.weight && entry.reps)
        .sort((a, b) => Number(b.weight) * Number(b.reps) - Number(a.weight) * Number(a.reps))[0];
      return `
        <article class="history-card">
          <strong>${formatDate(session.date)} - ${session.workoutTitle}</strong>
          <p>${session.notes || "No notes."}</p>
          <div class="history-meta">
            <span>${Math.round(totalVolume)} lb-reps</span>
            <span>${best ? `${best.name}: ${best.weight} x ${best.reps}` : "No sets logged"}</span>
          </div>
        </article>
      `;
    })
    .join("");

  renderRecommendations(sessions.at(-1));
}

function renderHealthSummary() {
  const health = loadHealthData();
  const days = Object.entries(health.daily || {}).sort(([a], [b]) => a.localeCompare(b));

  if (!health.importedAt || !days.length) {
    elements.healthSummary.className = "health-summary empty-state";
    elements.healthSummary.textContent = "No health data imported yet.";
    return;
  }

  const recentDays = days.slice(-7);
  const totals = recentDays.reduce((sum, [, day]) => {
    sum.steps += Number(day.steps || 0);
    sum.distanceMiles += Number(day.distanceMiles || 0);
    sum.activeEnergyCalories += Number(day.activeEnergyCalories || 0);
    sum.exerciseMinutes += Number(day.exerciseMinutes || 0);
    return sum;
  }, { steps: 0, distanceMiles: 0, activeEnergyCalories: 0, exerciseMinutes: 0 });

  const dayCount = Math.max(1, recentDays.length);
  elements.healthSummary.className = "health-summary";
  elements.healthSummary.innerHTML = `
    <div class="health-tile">
      <span>Latest weight</span>
      <strong>${health.latestWeightLb ? `${roundToHalf(health.latestWeightLb)} lb` : "None"}</strong>
    </div>
    <div class="health-tile">
      <span>7-day avg steps</span>
      <strong>${Math.round(totals.steps / dayCount).toLocaleString()}</strong>
    </div>
    <div class="health-tile">
      <span>7-day distance</span>
      <strong>${totals.distanceMiles.toFixed(1)} mi</strong>
    </div>
    <div class="health-tile">
      <span>7-day exercise</span>
      <strong>${Math.round(totals.exerciseMinutes)} min</strong>
    </div>
  `;
}

function calculateBestStreak(sessions) {
  const dates = [...new Set(sessions.map((session) => session.date))].sort();
  if (!dates.length) return 0;

  let best = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i += 1) {
    const previous = new Date(dates[i - 1]);
    const next = new Date(dates[i]);
    const diffDays = Math.round((next - previous) / 86400000);
    if (diffDays <= 3) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function collectSession() {
  const workout = getCurrentWorkout();
  const entries = workout.exercises.map((exercise, index) => {
    const fields = [...document.querySelectorAll(`[data-index="${index}"]`)];
    const entry = { name: exercise.name };
    fields.forEach((field) => {
      entry[field.dataset.field] = field.value.trim();
    });
    return entry;
  });

  return {
    id: crypto.randomUUID(),
    date: elements.sessionDate.value,
    workoutId: workout.id,
    workoutTitle: workout.title,
    entries,
    notes: elements.sessionNotes.value.trim(),
    savedAt: new Date().toISOString()
  };
}

function clearForm() {
  elements.sessionForm.reset();
  elements.sessionDate.value = todayString();
}

function fillExample() {
  const rows = [...document.querySelectorAll(".log-row")];
  rows.forEach((row, index) => {
    const weight = row.querySelector('[data-field="weight"]');
    const reps = row.querySelector('[data-field="reps"]');
    const rpe = row.querySelector('[data-field="rpe"]');
    weight.value = index < 2 ? 25 : index < 4 ? 35 : 15;
    reps.value = index % 2 === 0 ? 12 : 9;
    rpe.value = index % 2 === 0 ? 8 : 9;
  });
  elements.sessionNotes.value = "First baseline. Felt good, but rows were harder than expected.";
}

function exportDataFile() {
  const health = loadHealthData();
  const payload = {
    exportedAt: new Date().toISOString(),
    appVersion: 1,
    sessions: loadSessions(),
    health
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "workout-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function importDataFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    const sessions = Array.isArray(payload) ? payload : payload.sessions;
    if (!Array.isArray(sessions)) {
      throw new Error("No sessions array found.");
    }
    saveSessions(sessions);
    if (payload.health) {
      saveHealthData(payload.health);
      renderHealthSummary();
    }
    renderHistory();
  } catch (error) {
    window.alert(`Could not import workout data: ${error.message}`);
  } finally {
    event.target.value = "";
  }
}

async function importHealthFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const healthData = file.name.toLowerCase().endsWith(".xml")
      ? parseAppleHealthXml(text)
      : parseHealthJson(text);
    saveHealthData(healthData);
    renderHealthSummary();
  } catch (error) {
    window.alert(`Could not import health data: ${error.message}`);
  } finally {
    event.target.value = "";
  }
}

function parseAppleHealthXml(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Apple Health XML could not be parsed.");
  }

  const health = emptyHealthData();
  health.importedAt = new Date().toISOString();
  health.source = "apple-health-export-xml";

  doc.querySelectorAll("Record").forEach((record) => {
    const type = record.getAttribute("type") || "";
    const date = toDateKey(record.getAttribute("startDate") || record.getAttribute("creationDate"));
    const rawValue = Number(record.getAttribute("value"));
    const unit = record.getAttribute("unit") || "";
    if (!date || Number.isNaN(rawValue)) return;

    const day = getHealthDay(health, date);
    if (type.includes("BodyMass")) {
      const pounds = unit === "kg" ? rawValue * 2.2046226218 : rawValue;
      health.latestWeightLb = pounds;
      health.latestWeightDate = date;
      day.weightLb = pounds;
    } else if (type.includes("StepCount")) {
      day.steps += rawValue;
    } else if (type.includes("DistanceWalkingRunning")) {
      day.distanceMiles += unit === "km" ? rawValue * 0.621371 : rawValue;
    } else if (type.includes("ActiveEnergyBurned")) {
      day.activeEnergyCalories += unit === "kJ" ? rawValue * 0.239006 : rawValue;
    } else if (type.includes("AppleExerciseTime")) {
      day.exerciseMinutes += rawValue;
    }
  });

  return health;
}

function parseHealthJson(text) {
  const payload = JSON.parse(text);
  if (payload.health?.daily) return payload.health;
  if (payload.daily) return payload;

  const health = emptyHealthData();
  health.importedAt = new Date().toISOString();
  health.source = "generic-health-json";
  const records = Array.isArray(payload) ? payload : findArray(payload);
  if (!records) throw new Error("No health records found in JSON.");

  records.forEach((record) => {
    const date = toDateKey(record.date || record.startDate || record.start || record.creationDate);
    if (!date) return;
    const day = getHealthDay(health, date);
    const type = String(record.type || record.name || record.metric || "").toLowerCase();
    const value = Number(record.value ?? record.qty ?? record.quantity ?? record.total);
    if (Number.isNaN(value)) return;

    if (type.includes("weight") || type.includes("bodymass")) {
      const pounds = String(record.unit || "").toLowerCase() === "kg" ? value * 2.2046226218 : value;
      health.latestWeightLb = pounds;
      health.latestWeightDate = date;
      day.weightLb = pounds;
    } else if (type.includes("step")) {
      day.steps += value;
    } else if (type.includes("distance")) {
      day.distanceMiles += String(record.unit || "").toLowerCase() === "km" ? value * 0.621371 : value;
    } else if (type.includes("active") || type.includes("calorie") || type.includes("energy")) {
      day.activeEnergyCalories += value;
    } else if (type.includes("exercise")) {
      day.exerciseMinutes += value;
    }
  });

  return health;
}

function findArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return null;
  for (const child of Object.values(value)) {
    const found = findArray(child);
    if (found) return found;
  }
  return null;
}

function getHealthDay(health, date) {
  health.daily[date] ||= {
    steps: 0,
    distanceMiles: 0,
    activeEnergyCalories: 0,
    exerciseMinutes: 0,
    weightLb: null
  };
  return health.daily[date];
}

function toDateKey(value) {
  if (!value) return null;
  const match = String(value).match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

elements.previousWorkout.addEventListener("click", () => {
  currentWorkoutIndex = (currentWorkoutIndex - 1 + workouts.length) % workouts.length;
  renderWorkout();
});

elements.nextWorkout.addEventListener("click", () => {
  currentWorkoutIndex = (currentWorkoutIndex + 1) % workouts.length;
  renderWorkout();
});

elements.clearForm.addEventListener("click", clearForm);
elements.fillExample.addEventListener("click", fillExample);
elements.exportData.addEventListener("click", exportDataFile);
elements.importData.addEventListener("change", importDataFile);
elements.importHealth.addEventListener("change", importHealthFile);

elements.sessionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const session = collectSession();
  const sessions = loadSessions();
  sessions.push(session);
  saveSessions(sessions);
  renderHistory();
  clearForm();
});

elements.resetData.addEventListener("click", () => {
  const confirmed = window.confirm("Delete all saved workout history on this browser?");
  if (!confirmed) return;
  saveSessions([]);
  renderHistory();
});

elements.sessionDate.value = todayString();
renderWorkout();
renderHistory();
renderHealthSummary();
