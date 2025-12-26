# 📦 Borrow Tracker (Sledovanie požičaných vecí)

**Borrow Tracker** je moderná a intuitívna webová aplikácia vyvinutá ako semestrálny projekt pre predmet **Frontendové technológie**. Aplikácia slúži na komplexnú správu vypožičaných predmetov, sledovanie ich stavu, termínov vrátenia a správu kontaktov priateľov. Projekt demonštruje pokročilé využitie ekosystému Vue 3 v kombinácii s TypeScriptom a Vuetify.

## 🚀 Live Demo
Aplikácia je plne optimalizovaná, otestovaná a nasadená prostredníctvom GitHub Pages:
👉 **[https://versus1478.github.io/FT_project/](https://versus1478.github.io/FT_project/)**

---

## 📋 Detailná implementácia požiadaviek
Tento projekt bol navrhnutý tak, aby pokryl všetky technické kritériá semestrálnej práce:

| Požiadavka | Technická implementácia a detaily |
| :--- | :--- |
| **Vue 3 (Options API)** | Komponenty využívajú štruktúru `data()`, `methods` a `computed` pre prehľadnú logiku. |
| **TypeScript** | Prísna typizácia cez `Interfaces`. Každý objekt (Item, Friend) má definovanú dátovú štruktúru. |
| **Pinia State Management** | Centralizovaná správa stavu rozdelená do reaktívnych modulov `itemsStore` a `friendsStore`. |
| **Vue Router** | Navigácia cez `createWebHashHistory` pre plnú kompatibilitu so statickým hostingom. |
| **Vuetify 3** | Profesionálne UI komponenty (grid, formuláre, karty) s implementovanou validáciou vstupov. |
| **Perzistencia dát** | Plná synchronizácia s `localStorage`. Dáta ostávajú uložené aj po obnovení prehliadača. |
| **Vlastné komponenty** | Implementovaných viac ako 5 funkčných komponentov (napr. `ItemCard`, `StatusBadge`, `FriendStatsCard`). |

---

## 🏗️ Architektúra a logické moduly

### 🧠 Správa stavu (Stores)
1. **Items Store**:
   - Spravuje CRUD operácie (pridanie, mazanie, editácia) vypožičaných predmetov.
   - Obsahuje logiku pre prepočet zostávajúcich dní do vrátenia na základe aktuálneho dátumu.
   - Dynamicky filtruje položky podľa stavu (Aktívne / Vrátené) a kategórií.
2. **Friends Store**:
   - Udržiava databázu priateľov a ich kontaktných údajov.
   - Agreguje dáta z Items Store, vďaka čomu v reálnom čase zobrazuje štatistiky dlžníkov.

### 📁 Organizácia projektu
- **`src/components/`**: UI stavebné bloky ako `ItemCard.vue` pre zobrazenie veci або `AddItemForm.vue` pre validovaný formulár.
- **`src/interfaces/`**: TypeScript modely definujúce štruktúru dát (`Item.ts`, `Friend.ts`, `Category.ts`).
- **`src/router/`**: Konfigurácia ciest pre Dashboard, Friends, Stats a History.
- **`src/stores/`**: Pinia modely obsahujúce globálnu logiku, výpočty štatistík a prácu s LocalStorage.
- **`src/views/`**: Hlavné stránky aplikácie ako Dashboard (prehľad), Stats (grafy) a History (archív).
- **`src/plugins/`**: Konfigurácia Vuetify, tém a ikon.
- **`App.vue`**: Root komponent s hlavnou navigáciou, layoutom a bočným menu (drawer).

---

## 📐 Softvérové princípy a čistý kód (SOLID)
Pri vývoji boli dodržané kľúčové princípy pre zabezpečenie udržateľnosti kódu:
- **Single Responsibility (SRP)**: Každý modul má jednu úlohu. Napríklad Stores riešia dáta, zatiaľ čo Views riešia len to, ako tieto dáta zobraziť používateľovi.
- **Interface Segregation**: Použitím TypeScript rozhraní sme zabezpečili, že komponenty pracujú len s tými dátami, ktoré sú pre ne relevantné, čím sa predchádza chybám pri prenose dát.
- **Konzistencia a integrita**: Akákoľvek zmena v stave (napr. vrátenie veci) sa okamžite atomicky premietne do všetkých súvisiacich pohľadov, grafov a štatistík priateľov.
- **Dry (Don't Repeat Yourself)**: Opakujúce sa UI prvky (ako statusy položiek) sú vynesené do samostatných komponentov.

---

## 💻 Používateľské rozhranie a UX
Aplikácia je navrhnutá s dôrazom na jednoduchosť, prístupnosť a prehľadnosť:
- **Dashboard**: Farebne odlíšené karty podľa stavu (Zelená - v termíne, Červená - po termíne).
- **Štatistiky**: Interaktívna vizualizácia kategórií a hodnôt požičaných vecí.
- **Validácia**: Robustná validácia formulárov cez Vuetify pravidlá (rules), ktorá nepovolí uloženie neúplných dát.
- **Responzivita**: Layout je prispôsobený pre mobilné zariadenia aj desktopy vďaka Vuetify grid systému.
