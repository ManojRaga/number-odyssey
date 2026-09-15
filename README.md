# Number Odyssey

A mobile-first maths adventure for **Ganita Prakash, Grade 8, Part I, Chapter 3: A Story of Numbers**. Eight worlds, 57 activities, and 24 stars. Built as a separate app using the framework-free design and round-runner approach of Rational Realms.

## Play

[Play Number Odyssey](https://manojraga.github.io/number-odyssey/) on any phone, tablet, or computer. On supported mobile browsers, use **Add to Home Screen** to keep it alongside your apps.

To run locally:

```sh
git clone https://github.com/ManojRaga/number-odyssey.git
cd number-odyssey
npm start
```

Open **http://localhost:8140**. The web game has no runtime dependencies beyond a browser. The server listens on your local network too; on a phone on the same Wi-Fi, use the Mac’s LAN address with port 8140. Browser offline installation requires HTTPS or localhost; the Android APK works offline from the first launch.

The browser caches the complete adventure after the first successful load. No external fonts, image servers, accounts, ads, analytics, or AI API calls are used. Progress and sound preferences stay on the current device. Clearing browser data or uninstalling the app can remove progress.

## GitHub Pages deployment

The repository keeps the full project on `main`. GitHub Pages serves the contents of `www/` from the root of `gh-pages`, matching Rational Realms’ deployment setup. Relative asset URLs, the web-app manifest, and the service-worker scope work under `/number-odyssey/`.

After making and committing a change on `main`, publish it with:

```sh
npm run deploy
```

This runs the tests, creates or updates `gh-pages` from `www/`, and pushes both branches. GitHub builds and deploys Pages when `gh-pages` changes. The command requires a clean working tree and never force-pushes. Deployment status appears in the repository’s Actions tab.

## Android

The installable development APK is in **`dist/Number-Odyssey.apk`**. Copy it to an Android phone and open it to install, allowing installation from that source if Android asks. It uses the distinct application ID `com.manoj.numberodyssey`, so it can coexist with Rational Realms. Minimum Android version: Android 7.0 (API 24).

This APK is signed with the local Android **debug key** for classroom testing and direct installation. It is not a Play Store release. For long-term distribution, create and privately back up a dedicated release signing key. This project does not use Rational Realms’ signing key.

To rebuild after changes:

```sh
npm ci
npx cap sync android
cd android
./gradlew -Dorg.gradle.java.home='/Applications/Android Studio.app/Contents/jbr/Contents/Home' assembleDebug
```

The build output is `android/app/build/outputs/apk/debug/app-debug.apk`. Set `android/local.properties` to your Android SDK location on another machine; this machine-specific file is ignored by Git.

## The discovery trail

| World | What children do | Textbook mapping |
| --- | --- | --- |
| Pebble Camp | Match animals and pebbles, read/build tallies, decode counting in pairs | 3.1, 3.2 I–III; pp. 48–57 |
| Roman Gate | Read and carve numerals, discover subtractive pairs, compare landmarks | 3.2 IV; pp. 58–61 |
| Nile Workshop | Build Egyptian numerals, regroup symbols, multiply by ten | 3.3 I and arithmetic examples; pp. 61–69 |
| Base Forge | Build with base-5 shapes, trade groups, explore base-7 powers, use an abacus | 3.3 II; pp. 62–70 |
| Babylon Skywatch | Read wedges in base-60 positions and investigate empty places | 3.4 I; pp. 70–74 |
| Maya Steps | Build with dots, bars and shells; use the textbook’s 360 place | 3.4 II; pp. 74–76 |
| Rod Garden | Read/build Zong and Heng rod numerals, investigate orientation and blanks | 3.4 III; pp. 76–78, 80 |
| Zero Summit | Explore zero and decimal place value; write 25 in bases 8, 5 and 2; match systems | 3.4 IV and summary; pp. 78–81 |

All prose and activities are newly written. Numeral illustrations are simplified, code-native learning diagrams. The supplied textbook is not bundled in the app.

### Content conventions

- The route follows ideas, not a claim that these civilisations came in this historical order.
- Roman puzzles require standard modern subtractive spellings. The guide acknowledges the historical alternatives mentioned in the textbook.
- The Mayan activities follow **1, 20, 360, 7,200**, the almost-base-20 convention used in this chapter, rather than pure powers of twenty. The twenties place carries at 18.
- The printed Mayan example contains an inconsistent expansion term beside a shell. The app uses the mathematically consistent expansion `4 × 360 + 11 × 20 + 0 × 1 = 1660`.
- Egyptian, Babylonian, and Chinese empty positions are shown with a modern dash in labelled teaching controls. The lesson describes how the historical representations handled blanks; the dash is not presented as an ancient zero symbol.
- Historical claims are limited to the chapter’s learning context. Exact dates and disputed priority claims are not used as scored questions.

## Learning and classroom controls

- Complete a world to unlock the next. Each has a short introduction, hands-on discoveries, and a guardian challenge.
- Answers get explanations. Incorrect answers can be retried; after two attempts, “Show me how” gives a worked solution.
- Stars reward unaided answers: 3 for at least 85%, 2 for at least 55%, and 1 for completing the world. Hints or incorrect attempts mark the current round as assisted. Your best stars are retained on replay.
- Progress is saved at round boundaries, including whether a hint or incorrect attempt occurred. Returning to the map or reloading resumes the current discovery; partially assembled controls reset. A correctly answered round resumes at the next discovery.
- **Field guide:** all eight topic summaries are available immediately, with symbol diagrams and printed textbook page references.
- **Number lab:** freely explore quantities 0–255 in bases 2–10 and compare Roman, Mayan, and Babylonian representations. No scoring.
- **Settings → Classroom mode:** open all worlds to teach in any order. This mode lasts for the current page session; stars remain saved.
- **Settings → Reset progress:** a confirmation is required. Sound is optional. Keyboard navigation, labels, visible focus, text zoom, and reduced-motion preferences are supported.

The game covers the chapter’s core concepts. It complements, rather than attempts to grade, the textbook’s open-ended history, discussion, and invent-your-own-system activities.

## Code layout

```text
www/index.html          app shell and metadata
www/css/style.css       responsive visual system
www/js/app.js           map, routes, rounds, results, guide, lab, settings
www/js/content.js       57 activities and chapter mapping
www/js/puzzles.js       interactive puzzle controls
www/js/visuals.js       numeral renderers and compass art
www/js/math.js          Roman conversion, place values, carrying, scoring
www/js/state.js         resilient local progress storage
www/js/effects.js       synthesized sounds and celebration
www/sw.js               offline cache
scripts/serve.mjs       local development server
scripts/android-art.mjs rasterize compass icons and splash art (requires sharp)
scripts/browser-qa.mjs  optional browser integration checks (requires Playwright)
tests/math.test.mjs     arithmetic, curriculum, storage and scoring checks
android/                Capacitor Android project
dist/                   installable APK and portable web bundle
```

## Verification

Run `npm test` for the dependency-free tests. They check all 3,999 supported Roman numerals; positional conversions across several bases; Mayan mixed-radix boundaries; invariant quantities during regrouping; progress persistence, corrupt storage, scoring; and whether every activity’s answer is reachable.

Browser testing completed the full 57-activity journey using the actual controls at a 390px viewport, including a wrong answer, leaving/resuming, reload, all world unlocks, all puzzle types, the guide, number lab and an offline reload. Screenshots are in `test-results/` (ignored by Git). Additional 320px and tablet checks cover layout and settings. The Android APK was compiled and its signature verified; physical-device installation was not performed.

Optional browser check:

```sh
node scripts/browser-qa.mjs --full
```

If using an existing runtime, pass `--playwright=/absolute/path/to/playwright/index.mjs` and `--chromium=/absolute/path/to/browser`. Keep the local server running during the check.
