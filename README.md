# RejStream

Polskojęzyczny katalog niezależnej animacji z osobnymi stronami seriali, sezonów oraz ekranem oglądania. Vite + JavaScript + Lucide. Node.js 22.12+.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run preview` udostępnia kompilację. Vite nasłuchuje na 0.0.0.0 i obsługuje host podglądu Arena. `base: './'` pozwala publikować pod `/RejStream/`. Routing przez hash działa na GitHub Pages bez reguł serwera.

## Biblioteka

- **The Amazing Digital Circus** — 1 sezon, wszystkie 9 odcinków z oficjalnej playlisty GLITCH, pilot jako odcinek 1. Tytuły, numeracja i linki sprawdzone 25.10.2026.
- **Helluva Boss** — pełne sezony 1 (8 odcinków) i 2 (12 odcinków), osobno dwa piloty i trzy wybrane shorts. Sezon 3: pięć wpisów z linkiem do Prime Video, nie darmowe osadzenia ani pełny sezon.
- **Murder Drones** — wybrany pilot, z wyraźnym oznaczeniem niepełnej kolekcji.
- Usunięto Big Buck Bunny z aktywnego katalogu.

## UX i funkcje

- Start → seriale → szczegóły serialu → sezony → ekran oglądania z kolejką odcinków, poprzednim/następnym odcinkiem i linkiem do źródła.
- Wyszukiwanie seriali w katalogu i odcinków na stronie wybranego serialu. Zmiana kontekstu czyści frazę, więc nazwa serialu nie filtruje przypadkowo jego odcinków.
- Sortowanie seriali: polecane, A–Z, Z–A; odcinki od pierwszego lub ostatniego. Widok listy i siatki.
- Moja lista dla każdego serialu; migracja poprzedniej listy Helluva Boss. Ręczne oznaczenie obejrzanych (bez przeładowywania odtwarzacza), ostatnio otwarty odcinek. Dane w localStorage, bez konta.
- Telefon: dolna nawigacja, zwijana wyszukiwarka, przewijane zakładki sezonów, kolejka pod playerem. Testowano szerokości 360, 390, 768 i 1440 px bez poziomego overflow.
- Fonty DM Sans i Barlow Condensed przechowywane lokalnie przez Fontsource, bez żądań do Google Fonts. Obrazki źródłowe mają gradientowy fallback na wypadek blokady sieci.
- Dostępność: skip link, etykiety ikon, aria-current / aria-pressed, fokus w panelach informacyjnych, Escape, skrót `/`, reduced-motion.

## Audio i napisy

Oficjalne produkcje korzystają z osadzeń YouTube. Ścieżki audio wybiera się w ustawieniach źródłowego playera. Nie udajemy, że API osadzenia udostępnia pełną listę języków: nie pobieramy jej i nie gwarantujemy tych samych ścieżek w każdym odcinku/regionie. Preferencje napisów PL/EN nie gwarantują ich obecności. Znalezione polskie fanduby HB (pilot 2019 i S1E1) mają osobne, wyraźnie nieoficjalne źródła.

Własny player HTML5 pozostaje w sekcji „Mój player” / „Własny odtwarzacz”: lokalne pliki wideo, SRT/VTT, wiele plików napisów, ±10 s, seek, tempo, głośność i fullscreen. Żaden lokalny plik nie jest wysyłany na serwer. Obsługa kodeków zależy od przeglądarki; oddzielny dubbing wymaga pliku wideo z tą wersją audio.

## Walidacja

- `npm test`: 22 testy danych i interfejsu (Vitest/jsdom).
- `npm run build`: statyczne zasoby w `dist/` (ignorowane przez Git).
- Test przeglądarkowy Chromium/Playwright w sandboxie: 24 kombinacje tras i szerokości, sortowanie, siatka, ulubione po reloadzie, kolejka, następny odcinek, ręczne obejrzane, import SRT, błąd lokalnego wideo i sprzątanie po opuszczeniu playera. Brak błędów JS.
- Test przeglądarkowy dotyczy naszej aplikacji. Zewnętrzne transmisje YouTube i obrazki mają blokadę sieci w sandboxie; nie potwierdza to dekodowania ani dostępności reklam/audio/napisów w regionie użytkownika. Miniatury przy blokadzie mają zaprojektowane zastępstwo.

## Wdrożenie

Workflow `.github/workflows/pages.yml`: testy i build w PR, a po scaleniu do `main` również publikacja GitHub Pages. Źródło Pages: **GitHub Actions**. Bez backendu, Supabase i rehostingu filmów.

Więcej o źródłach i prawach: [SOURCES.md](SOURCES.md).
