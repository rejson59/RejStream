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

Oficjalne produkcje korzystają z osadzeń YouTube. Ścieżki audio wybiera się w ustawieniach źródłowego playera. Nie udajemy, że API osadzenia udostępnia pełną listę języków: nie pobieramy jej i nie gwarantujemy tych samych ścieżek w każdym odcinku/regionie. Preferencje napisów PL/EN nie gwarantują ich obecności. Polskie wersje są teraz opisane osobno przy każdym odcinku:

- **Helluva Boss:** pełne fanduby do całego sezonu 1, dziewięciu odcinków sezonu 2 (1, 3–5, 7–11), pilota 2019 i wszystkich trzech shorts z katalogu (1, 3, 4). S1E1 ma do wyboru NanoKarrin i BruDolina Studios. Autorzy mają odnośniki do kanału i materiału z pełną obsadą.
- **S2E2:** pełny polski lektor amatorski, wyraźnie oddzielony od dubbingu. Nie dodajemy znalezionego 10-minutowego fragmentu jako pełnego odcinka.
- **Luki:** nie potwierdzono pełnego, dostępnego fandubu S2E6, S2E12 ani Mission: Zero. UI mówi to wprost; wskazuje też oficjalnego lektora w płatnym Prime Video. Dla sezonu 3 języki trzeba sprawdzić u dystrybutora.
- **Digital Circus (9 odcinków) i pilot Murder Drones:** oficjalny polski dubbing GLITCH; widoczna instrukcja `⚙ → Ścieżka dźwiękowa → Polski`. Nie tworzymy pozornej opcji automatycznego przełączenia audio, bo osadzenie tego nie umożliwia.

Domyślnie wybieramy znaleziony polski materiał, jeżeli istnieje. Ręczny wybór oryginału lub polskiej wersji zapamiętuje preferencję na tym urządzeniu, także dla następnego odcinka. Filtry rozróżniają wszystkie potwierdzone polskie wersje i same fanduby. Materiał S2E1 z ograniczeniem wieku prowadzi do YouTube zamiast niedziałającego osadzenia. Pozostałe źródła również mają bezpośredni link, jeśli odtwarzanie w osadzeniu jest zablokowane. Metadane i ograniczenia przeglądu są w `SOURCES.md`; nie przeprowadzono testu transmisji YouTube w sandboxie.

Własny player HTML5 pozostaje w sekcji „Mój player” / „Własny odtwarzacz”: lokalne pliki wideo, SRT/VTT, wiele plików napisów, ±10 s, seek, tempo, głośność i fullscreen. Żaden lokalny plik nie jest wysyłany na serwer. Obsługa kodeków zależy od przeglądarki; oddzielny dubbing wymaga pliku wideo z tą wersją audio.

## Walidacja

- `npm test`: 40 testów danych i interfejsu (Vitest/jsdom).
- `npm run build`: statyczne zasoby w `dist/` (ignorowane przez Git).
- Test przeglądarkowy Chromium/Playwright w sandboxie: 24 kombinacje tras i szerokości, sortowanie, siatka, ulubione po reloadzie, kolejka, następny odcinek, ręczne obejrzane, import SRT, błąd lokalnego wideo i sprzątanie po opuszczeniu playera. Brak błędów JS.
- Po uzupełnieniu audio: 40 kombinacji tras/szerokości; wybór polskiego materiału i alternatywnego fandubu, zapamiętywanie preferencji, następny odcinek, lektor, luki, ograniczenie wieku, filtrowanie i sortowanie. Brak błędów JS i poziomego overflow.
- Test przeglądarkowy dotyczy naszej aplikacji. Zewnętrzne transmisje YouTube i obrazki mają blokadę sieci w sandboxie; nie potwierdza to dekodowania ani dostępności reklam/audio/napisów w regionie użytkownika. Miniatury przy blokadzie mają zaprojektowane zastępstwo.

## Wdrożenie

Workflow `.github/workflows/pages.yml`: testy i build w PR, a po scaleniu do `main` również publikacja GitHub Pages. Źródło Pages: **GitHub Actions**. Bez backendu, Supabase i rehostingu filmów.

Więcej o źródłach i prawach: [SOURCES.md](SOURCES.md).

## Polski od startu, logo i zwiastuny

Polskie napisy są teraz domyślnie włączane (jeśli źródło je udostępnia), a znalezione polskie materiały wybierane w pierwszej kolejności. Starsza preferencja oryginału nie blokuje nowych ustawień PL; późniejsze ręczne zmiany nadal są respektowane. `hl=pl` ustawia język interfejsu YouTube, nie ścieżkę audio. Dla oficjalnych wielościeżkowych odcinków automatyczny wybór dubbingu nadal zależy od YouTube.

Każdy serial ma osadzony odtwarzacz zwiastuna bezpośrednio pod opisem na stronie szczegółów oraz w wyróżnieniu strony głównej — bez przycisku przenoszącego na inną stronę. Zwiastuny korzystają z osobnych polskich uploadów: dwa od twórców oficjalnego dubbingu GLITCH i fanowski zwiastun sezonu 2 Helluva Boss. Podpisani autorzy, źródło, domyślne polskie napisy, powrót do odcinków; bez autoplay i bez dopisywania do historii odcinków.

Własny wektorowy znak R/play jest w `public/rejstream-mark.svg`, na pasku bocznym, w mobilnym nagłówku, stopce i faviconie. Skaluje się bez utraty ostrości.

Walidacja tej aktualizacji: 40 testów Vitest, build produkcyjny, 35 kontroli tras/szerokości (360, 390, 600, 768, 1440 px), bez poziomego overflow i błędów JS. Zewnętrzne odtwarzanie YouTube nie było testowane.

Zwiastuny w opisie: responsywne proporcje 16:9, podpisani autorzy, link awaryjny do YouTube, domyślne napisy PL, ładowanie lazy i brak autoplay. Dotychczasowe adresy `#trailer/...` nadal działają.
