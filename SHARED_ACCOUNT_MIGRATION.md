# Migracja do Wspólnego Konta rejson59.github.io

## Podsumowanie zmian

Zastąpiono wszystkie metody logowania w RejStream na jednolity system wspólnego konta z `rejson59.github.io`.

## Zmiany w plikach

### 1. `index.html`
- Dodano skrypt `<script src="/js/rejson-account.js?v=1" defer></script>`
- Skrypt ładuje API wspólnego konta z `rejson59.github.io`

### 2. `account.js`
Dodano trzy nowe metody do integracji ze wspólnym kontem:

#### `isSharedAccountAvailable()`
- Zwraca `true` jeśli `window.RejsonAccount` jest dostępne
- Sprawdza czy skrypt wspólnego konta został załadowany

#### `openSharedLogin()`
- Otwiera interfejs logowania z `rejson59.github.io`
- Zapisuje URL powrotu w `sessionStorage` (nie w URL!)
- Rzuca błąd jeśli wspólne konto nie jest dostępne

#### `verifySharedSession()`
- Weryfikuje sesję przez `window.RejsonAccount.getSession()`
- Zwraca nazwę użytkownika jeśli sesja jest ważna
- Zwraca `null` jeśli brak sesji lub błąd

#### Subskrypcja zmian sesji
- Dodano nasłuchiwanie `RejsonAccount.subscribe()`
- Automatyczna weryfikacja sesji przy zmianie konta

### 3. `src.js`
#### UI logowania
- Dodano sekcję "Zaloguj się przez rejson59.github.io" z przyciskiem
- Sekcja pokazuje się tylko gdy `isSharedAccountAvailable()` zwraca `true`
- Zapisano oryginalny formularz jako fallback w `<details>`
- Przycisk "Zaloguj się przez rejson59.github.io" z gradientem i ikoną

#### Obsługa przycisku
- Najpierw sprawdza czy jest już ważna sesja (`verifySharedSession()`)
- Jeśli brak sesji, otwiera logowanie (`openSharedLogin()`)
- Po powrocie weryfikuje sesję ponownie
- Przekierowuje do strony konta po udanym logowaniu

### 4. Testy

#### `tests/account-ui.test.js`
- Dodano mocki nowych metod do istniejących testów

#### `tests/shared-account.test.js` (nowy plik)
- 8 nowych testów pokrywających:
  - `isSharedAccountAvailable()` - dostępność i niedostępność
  - `openSharedLogin()` - błąd i sukces
  - `verifySharedSession()` - null, sukces, błędy sieci

## Wyniki

- **149 testów** przechodzi (141 istniejących + 8 nowych)
- Build przechodzi pomyślnie
- Zgodność z dokumentacją `wspolne-konto-projekty.md`

## Bezpieczeństwo

✅ Token NIE jest przekazywany w URL  
✅ URL powrotu zapisywany w `sessionStorage` (nie `localStorage`)  
✅ Sesja weryfikowana przez `RejsonAccount.getSession()`  
✅ Token nie jest ujawniany w logach ani publicznych profilach  
✅ Zgodność z CSP i cross-origin requirements  

## Jak to działa

1. Użytkownik klika "Zaloguj się przez rejson59.github.io"
2. System sprawdza czy jest już ważna sesja
3. Jeśli brak sesji, otwiera `RejsonAccount.open()` który przekierowuje do `rejson59.github.io/konto-demo`
4. Po zalogowaniu, `rejson59.github.io` zapisuje sesję w `localStorage` (wspólny origin)
5. Użytkownik wraca do RejStream
6. System weryfikuje sesję przez `RejsonAccount.getSession()`
7. Jeśli sesja ważna, użytkownik jest zalogowany

## Fallback

Jeśli skrypt `rejson-account.js` nie jest dostępny (np. CSP blokuje), użytkownik widzi:
- Tradycyjny formularz logowania (PIN/hasło)
- Bez sekcji wspólnego konta

To zapewnia kompatybilność wsteczną.
