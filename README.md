# HappyPlace

A daily well-being checklist for you and your family, built on published research and made personal, because what makes one person happy isn't always what makes another happy.

It's a plain HTML/CSS/JavaScript app with no build step, no accounts and no tracking. Everything is stored in the browser on the device you use it on.

## Features

- **Today:** a small core of well-supported habits plus extras each person picks. Weekly targets ("3 of 5 days") instead of streaks. A one-tap daily mood rating (a faces version for kids). You can catch up on the past 6 days.
- **Personalization:** each person picks 2–5 extras from a menu. Quick "did you enjoy it / worth it / hard?" taps feed "you might like…" suggestions. Every 3 weeks it nudges you to vary or swap an activity. You can set a custom weekly target and a routine cue ("after dinner") for each habit.
- **Move:** goals from the U.S. Physical Activity Guidelines for each age:
  - 3–5: about 3 hours of active play a day
  - 6–17: 60 minutes a day, plus vigorous, muscle and bone activity on 3 days a week each
  - Adults: 150–300 minutes a week plus strength training; the targets change with your goal (stay healthy, lose weight, build strength, get fitter)
  - Logs walks, runs and rides with automatic pace and effort level, and calorie-burn estimates for adults (from MET values and body weight)
  - Strength log with ACSM-based guidance on when to add weight
- **Plate:** Harvard's Healthy Eating Plate for breakfast, lunch, dinner and snacks. You tap what each meal included.
  - Adults can turn on an optional calorie target (Mifflin-St Jeor equation, safe floor, weight loss capped at about 1 lb a week) with protein, carb and fat ranges from the Institute of Medicine's recommended ranges.
  - **Kids and teens never see calories or weight goals**, following American Academy of Pediatrics guidance.
- **Check-ins:** the WHO-5 Well-Being Index every two weeks (ages 10+), with a gentle "talk to someone / 988" message when scores or moods stay low.
- **Insights:** after about 4 weeks of mood ratings, it compares your mood on days you did each activity vs. days you didn't, labeled "no clear / possible / consistent pattern," with clear warnings that patterns aren't proof. It also suggests a 2-week on/off experiment for a real answer.
- **Progress over time:**
  - A 30-day chart on Insights: bar height shows habits done, color shows mood, plus this week vs. last week.
  - A **monthly recap** for each person at the end of every month: average mood vs. last month, top habits, weekly targets hit, movement totals, lifting personal bests, WHO-5 change, balanced plates, and "your best days usually included…". The current month shows as "so far."
  - Day-by-day details are kept for 90 days. Older days are rolled into their month's recap, which is kept for good.
- **Privacy:** each person's entries, insights and recaps appear only in their own profile, and there's no family-wide view of anyone's data. On a shared device, anyone can set an optional 4–8 digit PIN. The PIN is stored hashed and is required to switch into that profile. It stops casual peeking but isn't encryption. Backups export one person at a time.
- **Keeping data safe:** the app asks the browser to treat its storage as persistent and reminds each person to save a backup (after the first week, then monthly). On phones, backups open the share sheet so they can be saved straight to iCloud Drive or Google Drive, and they restore with Import. A Content Security Policy blocks outside scripts and all network requests, so the app can't send data anywhere.
- **Family:** multiple people per device.

## How honest is the evidence?

Each habit in the app is labeled **Strong evidence**, **Good evidence, small effect**, or **Healthy habit**, with its sources (see the Research page in the app, or `js/data.js`). In short:

| Habit | Evidence |
|---|---|
| Sleep, exercise, close relationships | Strong |
| Gratitude, kindness, brief mindfulness, time in nature, social-media breaks | Real but small effects |
| "Fun thing," music, phone-free 30 minutes | Sensible, little direct research |

Positive-psychology activities help modestly. After correcting for small, biased studies, the average effect is small. The app is a habit tool, **not** a treatment for depression or any medical condition.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish with GitHub Pages

1. On GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. After a minute it's live at `https://talonandersen.github.io/HappyPlace/`.
4. On a phone, open that link and choose **Add to Home Screen** to use it like an app.

Each person's data stays in the browser on the device they use. If people share a device, they can see each other's entries.

## Project layout

```
index.html            app shell
css/styles.css        styles (light & dark mode)
js/data.js            activities, research sources, WHO-5 items, plate guide
js/app.js             app logic
icon.svg, manifest.webmanifest
```

To add or change an activity, edit `HP_ACTIVITIES` in `js/data.js`. Each activity has a target, evidence strength, tags (used for suggestions) and source IDs.

## Credits

- WHO-5 Well-Being Index © World Health Organization, licensed CC BY-NC-SA 3.0 IGO. Used here unmodified for non-commercial purposes. WHO does not endorse this app.
- Healthy Eating Plate guidance: Harvard T.H. Chan School of Public Health.
- Physical Activity Guidelines for Americans, 2nd edition (HHS).

If you're struggling, talk to a doctor or counselor. In the US, call or text **988** any time.
