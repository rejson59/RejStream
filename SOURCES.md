# Źródła katalogu i warunki udostępniania

Przegląd: 25.10.2026. To ręcznie utrzymywany katalog, nie automatyczna synchronizacja. Nie gwarantuje dostępności w każdym regionie. Nie pobieramy materiałów chronionych z YouTube. Publiczny upload, w szczególności fanowski, nie jest dowodem licencji do redystrybucji.

## Helluva Boss

- Kanał twórców: https://www.youtube.com/@SpindleHorse
- Lista i numeracja: https://en.wikipedia.org/wiki/List_of_Helluva_Boss_episodes
- Przewodnik: https://hazbinhotel.fandom.com/wiki/Helluva_Boss/Episode_Guide
- Sezon 2: https://hazbinhotel.fandom.com/wiki/Helluva_Boss/Season_2
- Sezon 1: 8 odcinków, sezon 2: 12 odcinków. Każdy wpis ma ID źródłowego materiału (patrz `catalog.js`).
- Sezon 3: tylko pięć znalezionych wpisów katalogowych, prowadzących do wyszukiwania w Prime Video. Nie obiecujemy pełnego sezonu, bezpłatnego odtwarzania ani PL w tym serwisie. Konto, opłaty i dostępność zależą od dystrybutora.
- Pilot 2019 i Mission: Zero są osobne od regularnej numeracji sezonów.
- Shorts: wybrane 1, 3 i 4, z zachowaniem oryginalnych numerów; lista celowo opisana jako niekompletna.
- Źródła linków S1: https://archive.org/details/helluva-boss-season-1 (wykorzystana tylko lista odnośników do oryginałów, nie kopie filmów).
- Linki S2, oprócz kanału twórcy, potwierdzane w opisach odsyłających do oryginałów, np. https://www.youtube.com/watch?v=JSJJlnLKoB0 (E3), https://www.youtube.com/watch?v=ix77YfpO21Y (E4), https://www.youtube.com/watch?v=rOcEsoc58Wc (E5), https://www.youtube.com/watch?v=m79cnzRIp00 (E6), https://www.youtube.com/watch?v=QngtTvPOof0 (E7), https://www.youtube.com/watch?v=Q-SYnjOKBnI (E8), https://www.youtube.com/watch?v=40KVypV5ZOY (E9), https://www.youtube.com/watch?v=aKO6b6aHhjU (E10). RejStream osadza oryginały wskazane w opisach, nie filmy reakcyjne.
- E11, E12, piloty: https://laurasambitiouswriting.wordpress.com/2025/10/30/helluva-boss-mission-zero-review/ (bibliografia z linkami źródłowymi).

### Polski

- E1, fanowski remake: https://www.youtube.com/watch?v=4DjfKP5w8Ps
- Pilot 2019, fanowska wersja NanoKarrin: https://www.youtube.com/watch?v=Fv8Zld0d_Qg
- Wersje fanowskie są opisane jako nieoficjalne. Nie mamy zgody na ich kopiowanie ani informacji potwierdzającej pełną polską wersję wszystkich sezonów. Nie wolno interpretować znacznika PL jako oficjalnego dubbingu.
- Polskie/angielskie napisy w osadzeniu to preferencja YouTube, nie dostarczona przez nas ścieżka. Mogą być niedostępne.

## GLITCH — wybrane piloty

- The Amazing Digital Circus: https://www.youtube.com/watch?v=HwAPLk_sQ3w
- Murder Drones: https://www.youtube.com/watch?v=mImFz8mkaHo
- Kanał: https://www.youtube.com/@GLITCH
- Polska ścieżka Digital Circus: https://dubdb.fandom.com/wiki/Ob%C5%82%C4%99dny_Cyfrowy_Cyrk oraz https://supermarioglitchy4.fandom.com/wiki/THE_AMAZING_DIGITAL_CIRCUS_-_Ep_1:_PILOT . Wybór odbywa się w YouTube; nie mamy API gwarantującego jej aktywną dostępność w regionie widza.
- Nie są to pełne katalogi tych seriali, a wybrane piloty. Nie ma pobierania i rehostowania.

## Big Buck Bunny — własny player

- Autor: Blender Foundation, 2008.
- Oficjalna strona: https://peach.blender.org/
- Licencja i wymagania: https://peach.blender.org/about/
- CC BY 3.0: https://creativecommons.org/licenses/by/3.0/
- Oficjalne pobieranie: https://peach.blender.org/download/
- Wymaganie dla pełnego filmu: zachowanie całego przewijanego bloku napisów końcowych. Nie edytujemy filmu i nie wycinamy końcówki. Atrybucja jest również w playerze.
- Zewnętrzny mirror MP4: https://uploads.video-commander.com/sample/BigBuckBunny.mp4
- Źródło mirrora: https://github.com/video-commander/public-test-streams (lista aktualizowana 11.07.2026). Stary bucket Google GTV jest opisany jako niedostępny, więc go nie używamy.
- Mirror nie jest przechowywany w Git ani Supabase. Zewnętrzny serwer może zmienić dostępność; player pokazuje błąd i pozostawia link do oficjalnego źródła. W sandboxie dozwolone hosty nie pozwalają na bezpośredni test transmisji tego MP4.

## Pliki lokalne

Wybrany plik jest otwierany przez `URL.createObjectURL`, bez uploadu. Obsługiwane kodeki zależą od przeglądarki. VTT i SRT nie są pobierane z cudzych serwisów; użytkownik dodaje posiadane pliki. Nazwa pliku napisów identyfikuje ścieżkę. Osobny dubbing wymaga osobnego pliku wideo; nie obiecujemy przełączania dowolnych wewnętrznych ścieżek MKV w HTML5.
