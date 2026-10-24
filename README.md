# RejStream

Responsywna platforma odkrywania niezależnej animacji. Polski interfejs, Vite + JavaScript + Lucide.

## Uruchomienie

Wymagany Node.js 22+.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run preview` udostępnia kompilację. `dist/` nie trafia do Git.

## Biblioteka

- Helluva Boss: pełne sezony 1 (8 odcinków) i 2 (12 odcinków), wybór sezonu, dwa piloty i trzy wybrane shorts.
- Sezon 3: pięć wpisów z odnośnikiem do Prime Video, nie darmowe osadzenia. Katalog nie jest automatycznie aktualizowany.
- Dwa znalezione polskie fanduby: pilot 2019 oraz pierwszy odcinek S1. Brak fikcyjnych ścieżek językowych dla pozostałych odcinków.
- Piloty The Amazing Digital Circus oraz Murder Drones, nie całe seriale.
- Big Buck Bunny: cały film na CC BY 3.0 we własnym playerze, ze wskazaniem autora i warunków licencji.
- Łączone filtry, wyszukiwanie w wybranym sezonie i lokalna lista Helluva Boss.

## Własny player

`native-player.js` używa elementu HTML5 video i własnych kontrolek: play/pause, ±10 sekund, seek, głośność, mute, prędkość i fullscreen. Obsługuje lokalne VTT/SRT (do 5 MB na plik), wybór wielu ścieżek napisów, lokalne wideo bez wysyłania na serwer i zapisywanie pozycji Big Buck Bunny w localStorage. Obsługa błędów źródła/kodeka; sprzątanie listenerów i blob URL po zamknięciu.

Język lokalnego dubbingu zależy od wybranego pliku; nie ma automatycznego pobierania ani dekodowania wszystkich ścieżek MKV. YouTube pozostaje wyłącznie w legalnych osadzeniach produkcji, dla których nie mamy licencji na rehosting. Polskie i angielskie napisy są tam preferencją odtwarzacza, nie gwarancją ich istnienia.

## Testy i ograniczenia

`npm test`: testy danych, konwersji napisów i interfejsu (Vitest + jsdom). Nie są to testy dekodowania filmu ani odtwarzania w rzeczywistej przeglądarce. Pobranie Chromium w środowisku roboczym jest blokowane przez ograniczenia sieci. Zewnętrzny mirror i YouTube wymagają testu z przeglądarki użytkownika; źródła mogą mieć blokady regionalne/wiekowe. Player zawiera komunikaty błędów i odnośniki źródłowe.

Bez backendu, kont, Supabase ani uploadu filmów. Pliki zewnętrzne nie są kopiowane do Git. Zasoby zewnętrzne: miniatury YouTube, Google Fonts (z fontami awaryjnymi), mirror filmu CC BY.

## Publikacja

Workflow `.github/workflows/pages.yml` testuje PR, a po scaleniu do `main` testuje, buduje i wdraża na GitHub Pages. Źródło Pages: **GitHub Actions**. Ścieżki względne pozwalają działać pod `/RejStream/`.

Szczegóły źródeł, języków i praw: [SOURCES.md](SOURCES.md).
