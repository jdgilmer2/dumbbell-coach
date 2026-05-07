# Dumbbell Coach

A small static web app for adjustable dumbbells and a bench.

## What it does

- Suggests a rotating 3-day dumbbell workout schedule.
- Lets you log weight, best reps, and RPE for each exercise.
- Recommends whether to increase, hold, or reduce weight next time.
- Saves history in browser local storage.
- Exports/imports `workout-data.json` for Codex automation review.
- Imports Apple Health `export.xml` or generic health JSON for weight/cardio summaries.
- Tracks sessions, last trained date, and a simple consistency streak.

## How to use

Open `index.html` in a browser.

Start with Workout A. Use the first session as a baseline:

1. Pick a weight that feels controlled.
2. Aim for the recommended rep range.
3. Stop most sets with 1-2 good reps left.
4. Enter weight, best reps, and RPE.
5. Follow the next-time recommendation.

After logging, use **Export JSON** and save the file as `workout-data.json`
in this folder if you want the Codex automation to review your latest workout.

## Apple Watch / Health data

A static web app cannot directly read Apple Watch or Apple Health data. Use one
of these import paths:

1. On iPhone, open Health, tap your profile picture, choose **Export All Health
   Data**, unzip the export, then import `apple_health_export/export.xml`.
2. Use an app such as Health Auto Export or HealthSave to export JSON, then
   import that JSON.

After importing health data, use **Export JSON** to include it in
`workout-data.json` for the weekly Codex coach automation.

## Safety note

This is not medical advice. Stop if you feel sharp pain, chest pain, dizziness,
or anything that feels wrong. If you have medical concerns, ask a clinician
before starting.
