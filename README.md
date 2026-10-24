# RejStream

Responsywny, polskojęzyczny katalog niezależnej animacji. Vite + JavaScript + Lucide.

## Uruchomienie

```sh
npm ci
npm run dev
```

`npm run build` tworzy statyczną stronę w `dist/`. `npm run preview` udostępnia kompilację.

## Funkcje i ograniczenia

- Cztery odcinki pierwszego sezonu Helluva Boss osadzone z oficjalnych źródeł YouTube.
- Osobny polski, nieoficjalny fandub pierwszego odcinka (źródło: https://www.youtube.com/watch?v=4DjfKP5w8Ps).
- Wyszukiwanie, filtry, lokalnie zapisana lista ulubionych.
- Napisy PL/EN jako preferencje YouTube — dostępność zależy od materiału. Inne ścieżki dźwiękowe, jeśli autor je udostępnił, można wybrać w samym YouTube.
- Brak kont, backendu i pobierania filmów. Supabase nie jest wymagany.
- Osadzenia mogą być blokowane przez autora, region lub ograniczenia wiekowe. Odtwarzacz zawiera odnośnik do materiału na YouTube.
- Zewnętrzne zasoby: miniatury YouTube oraz opcjonalne Google Fonts (z lokalnymi fontami awaryjnymi).
- Ocena IMDb w interfejsie jest statyczna, nie aktualizuje się automatycznie.

## Publikacja

Workflow `.github/workflows/pages.yml` buduje i publikuje stronę z gałęzi `arena/72c23322-rejstream`. W repozytorium GitHub Pages musi mieć ustawione źródło **GitHub Actions**. Ścieżki zasobów są względne, dzięki czemu aplikacja działa pod `/RejStream/`.

## Prawa

RejStream nie pobiera ani nie przechowuje cudzych filmów. Helluva Boss i materiały graficzne należą do odpowiednich właścicieli praw. Obecność fandubu w serwisie YouTube nie potwierdza uzyskania przez jego autora licencji. Katalog nie jest powiązany z twórcami serialu ani YouTube.
