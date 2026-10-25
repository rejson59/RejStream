# RejStream

Polskojęzyczny katalog niezależnej animacji. Vite + JavaScript + Lucide, Node.js 22.12+.

```sh
npm ci
npm run dev
npm test
npm run build
```

Vite nasłuchuje na `0.0.0.0`, akceptuje host podglądu Arena. `base: './'` i routing hash pozwalają publikować pod `/RejStream/` na GitHub Pages. Build `dist/` jest ignorowany przez Git.

## Biblioteka i audio

- **The Amazing Digital Circus:** wszystkie 9 odcinków, jeden sezon; pilot jest odcinkiem 1.
- **Helluva Boss:** pełne sezony 1 (8) i 2 (12), osobne piloty i trzy wybrane shorts. Pięć wpisów S3 prowadzi do płatnego Prime Video, nie do bezpłatnych osadzeń.
- **Murder Drones:** cały serial, 8 odcinków z oficjalnego kanału GLITCH, od pilota do Absolute End. Wszystkie mają oficjalny polski dubbing BruDolina Studios w ścieżkach audio YouTube. Źródła, daty i ograniczenia w `SOURCES.md`.
- Big Buck Bunny nie jest częścią katalogu.

Oficjalny dubbing wybiera się w YouTube: **⚙ → Ścieżka dźwiękowa → Polski**. API iframe nie oferuje wiarygodnego automatycznego wyboru ścieżki audio. Nie udajemy takiej funkcji i nie tworzymy sztucznych osobnych uploadów językowych. Inne dubbingi/napisy zależą od źródła i regionu.

Helluva Boss: potwierdzone pełne fanduby całego S1, dziewięciu odcinków S2 (1, 3–5, 7–11), pilota 2019 i shorts 1, 3, 4. S2E2 ma lektora, nie dubbing. S1E1: NanoKarrin lub BruDolina Studios. S2E1 z ograniczeniem wieku otwiera YouTube zamiast obiecywać osadzenie. Brak potwierdzonego pełnego fandubu S2E6, S2E12 i Mission: Zero — UI mówi to wprost. Autorzy i kanały są podpisani.

Preferowane napisy PL: parametry URL plus ograniczone próby przez API po gotowości i zmianie modułów. `captions.track` to próba kompatybilności, nie gwarantowany kontrakt YouTube; potwierdzenie wymaga odczytu języka. Brak ścieżki lub obsługi API daje instrukcję ustawień, nie fałszywy komunikat sukcesu. Zmiana napisów nie przeładowuje iframe. Preferencja oryginału/polskiego uploadu pozostaje ustawieniem interfejsu na urządzeniu.

Zwiastuny są osadzone pod opisem i dopasowane do sezonu. Brak zweryfikowanego zwiastuna = brak playera, zamiast podmiany sezonu. Bez autoplay i bez zapisu zwiastunów do historii. Logo jest w `public/rejstream-mark.svg`.

## Konta społeczności i prywatność

RejStream używa **istniejących kont społeczności** z `rejson59.github.io/spolecznosc.html` w projekcie Supabase `rejson-widgets`. To własny system **nazwa + 4-cyfrowy PIN**, nie Supabase Auth ani nowe konta. Zakładka `#account` loguje przez istniejące `community_login`, sprawdza `community_whoami` i pobiera bibliotekę konta. Rejestracja prowadzi do społeczności.

- Gość może oglądać odcinki i lokalne pliki; **nie zapisujemy ani nie wznawiamy jego historii**.
- Historia `#history`, zapisane sekundy (z ułamkami), ulubione i ręczne „obejrzane” wymagają konta; dane przechowywane są w Supabase, nie w localStorage/IndexedDB.
- W przeglądarce pozostają token sesji społeczności (`rejson_community_session_v1`, wspólny na tym samym originie) i preferencje interfejsu. PIN nie jest zapisywany.
- Stare lokalne `rej-playback-v1`, `rej-recent`, `rej-favorites`, `rej-watched`, `rej-saved` są usuwane. **Nie przenosimy anonimowej historii na konto bez zgody.**
- Dane są w pamięci aplikacji podczas sesji; synchronizacja zmienionych wpisów odbywa się co około 5 s. Błąd jest widoczny globalnie, a kolejkę można ponowić z ekranu konta. Nie ma trwałego lokalnego fallbacku offline; zamknięcie karty przed udanym zapisem może utracić ostatnie sekundy.
- Wylogowanie i zmiana konta usuwają dane z pamięci; stary tracker nie może zapisać pozycji do nowego konta. Zmiany wspólnej sesji w innych kartach są obsługiwane przez `storage`.
- Odtwarzanie zewnętrzne w YouTube/Prime Video nie jest mierzone. Pomiar odtwarzania nie zlicza seeków, pauzy ani buforowania.

`supabase/rejstream.sql` zawiera wdrożoną migrację: tabela `rejstream_library` z RLS i odebranym bezpośrednim dostępem dla `anon`/`authenticated`. RPC odczytu/zapisu ustalają użytkownika **wyłącznie z tokena przez istniejące `community_session_user`**, nigdy z identyfikatora przesłanego przez klienta. Kod przeglądarki zawiera tylko istniejący publiczny klucz anon. Nie dodajemy klucza service-role i nie zmieniamy kont, PIN-ów ani tabel społeczności.

Odziedziczony PIN czterocyfrowy zapewnia mniejszą ochronę niż pełne hasło/MFA; integracja nie zmienia globalnego mechanizmu społeczności. Token sesji jest poufny. Nie należy umieszczać go w linkach ani logach.

## Player i interfejs

Katalog, wyszukiwanie seriali/odcinków, sezony, sortowanie, lista/siatka, poprzedni/następny odcinek i kolejka. Mobilne menu ma historię; konto jest pod awatarem nagłówka i w menu desktopowym. Ulubione i oznaczanie obejrzanych zachęcają do zalogowania, ale nie blokują oglądania.

Historia pokazuje najnowszą zapisaną pozycję materiału, datę i link do odcinka. Oddzielne uploady zachowują oddzielny postęp. Pasek przy odcinku pokazuje pozycję/długość, nie skumulowany czas. Wznawianie wykorzystuje `start` oraz najwyżej jedną korektę API po cue/play przy odchyleniu >1,5 s; bez redundantnego seekowania podczas `onReady`. Rzeczywisty punkt startu zależy od dekodera YouTube.

Informacja o buforowaniu i ręczne „Wczytaj ponownie” po długim oczekiwaniu/błędzie, bez automatycznej pętli restartów i bez zakrywania kontrolek. Nie gwarantujemy usunięcia problemów sieci i kodeków YouTube. Zwiastuny podpinają API blisko viewportu.

Własny player HTML5: legalnie posiadane lokalne pliki, SRT/VTT, ±10 s, seek, tempo, głośność i fullscreen. **Bajtów wideo i napisów nie wysyłamy.** Po zalogowaniu nazwa/identyfikator pliku i pozycja są zapisywane na koncie; po powrocie trzeba ponownie wybrać plik. Kodeki zależą od przeglądarki.

Dostępność: skip link, etykiety, aria-current/pressed, fokus dialogu, Escape, skrót `/`, reduced-motion. Fonty Fontsource są lokalne. Miniatury źródłowe mają fallback przy niedostępnej sieci.

## Walidacja i wdrożenie

- 71 testów Vitest/jsdom: dane, napisy/player, logowanie i izolacja sesji, cloud sync/retry, brak historii gościa, przejścia UI.
- Chromium: 32 kombinacje tras/szerokości (360, 390, 768, 1440), logowanie, historia/wznowienie, ulubione po reloadzie, brak lokalnego zapisu i wylogowanie. **Zamockowana sieć RPC/YouTube**, bez błędów JS i poziomego overflow.
- W działającym Supabase: RLS włączone, brak bezpośrednich praw anon do tabeli; transakcyjny test dwóch tymczasowych użytkowników potwierdził odmowę gościa, własny odczyt i brak odczytu/usuwania danych drugiego konta. Cały test wycofano (`ROLLBACK`), bez zmian prawdziwych kont.
- Produkcyjny build oraz npm audit. Rzeczywistego logowania przez przeglądarkę do Supabase, streamingu/dekodowania YouTube i wyboru języków nie da się sprawdzić w sandboxie z ograniczoną siecią.

Workflow `.github/workflows/pages.yml`: testy/build w PR, po scaleniu do `main` publikacja GitHub Pages. Frontend jest statyczny; funkcje konta wymagają Supabase. Filmów nie rehostujemy. Więcej o autorach i prawach: [SOURCES.md](SOURCES.md).
