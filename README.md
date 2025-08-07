# YT-Clone con SvelteKit

![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

Un clone funzionale e moderno dell'interfaccia di YouTube, costruito con SvelteKit, Tailwind CSS e l'API di YouTube.

---

### ✨ Demo Live & Gif

**Link alla Demo:** [https://yt-clone-woad.vercel.app/](https://yt-clone-woad.vercel.app/)

![GIF dell'applicazione in azione](./static/media/Animazione.gif)

---

## Outdated, new features

## 🚀 Caratteristiche Principali

### Funzionalità Base

- **Homepage Dinamica:** Feed di video popolari caricati dall'API di YouTube.
- **Pagina di Riproduzione Video:** Player video, dettagli del canale e informazioni sul video.
- **Pagina di Ricerca:** Funzionalità di ricerca per trovare video specifici.
- **Sezione Commenti:** Riceve dalle API i 20 commenti più recenti.
- **Video Raccomandati:** Gestiti tramite dati statici, dato che le API relative non sono più disponibili o sono state limitate.

### Esperienza Utente e Dettagli Tecnici di Rilievo

- **Sidebar onclick:** Nella homepage è presente una sidebar che compare su richiesta, analogamente a quella di youtube.
- **Animazioni a Cascata (Staggered Animations):** Gli elenchi di video non appaiono di colpo, ma entrano nella pagina con una fluida animazione a cascata (`fly`), uno dopo l'altro.
- **Streaming dei Dati:** I commenti vengono caricati in modo indipendente dal video principale tramite streaming, permettendo alla pagina di essere interattiva più velocemente.
- **Responsive Design Completo:** L'interfaccia è ottimizzata per un'esperienza perfetta su desktop, tablet e mobile, grazie a Tailwind CSS.

---

## 🛠️ Stack Tecnologico

- **Framework:** **SvelteKit** & **Svelte 5 (Runes)**
- **Linguaggio:** JavaScript / TypeScript
- **Styling:** **Tailwind CSS**
- **UI & Animazioni:**
  - **Svelte Transitions** (per l'animazione `fly`)
- **Build Tool:** Vite
- **API:** YouTube Data API v3

---

## 🔧 Come Avviare il Progetto Localmente

### Prerequisiti

- Node.js (v18.x o superiore)
- npm (o pnpm/yarn)

### Installazione

1.  **Clona la repository:**

    ```bash
    git clone [https://github.com/imalbi/yt-clone.git](https://github.com/imalbi/yt-clone.git)
    cd yt-clone
    ```

2.  **Installa le dipendenze:**

    ```bash
    npm install
    ```

3.  **Configura le variabili d'ambiente:**
    Crea un file `.env` nella cartella principale del progetto e aggiungi la tua chiave API di YouTube.

    ```
    PUBLIC_YOUTUBE_API_KEY="LA_TUA_CHIAVE_API_QUI"
    ```

4.  **Avvia il server di sviluppo:**
    ```bash
    npm run dev
    ```
    Apri [http://localhost:5173](http://localhost:5173) (o la porta indicata nel terminale) nel tuo browser.

---

## 🧠 Sfide Principali

- **Orchestrazione di Chiamate API Complesse e Dipendenti**

  - **Problema:** Nella pagina di ricerca con la sola API di ricerca non è possibile ottenere tutti i dati utili per emulare il comportamento dell'orginale.
  - **Soluzione:** Ho strutturato le chiamate nella funzione load di SvelteKit per rispettare la catena di dipendenze in modo esplicito. Infine, ho aggregato i risultati in un'unico oggeto passato al frontend.

- **Gestione Efficiente della Quota API (Caching)**
  - **Problema:** L'API di YouTube ha una quota di utilizzo giornaliera molto stretta. Durante lo sviluppo e i test, ricaricare la stessa pagina più volte causava chiamate API ripetute per gli stessi dati, consumando rapidamente la quota e rallentando i caricamenti successivi.
  - **Soluzione:** Ho implementato una semplice strategia di caching in memoria a livello server all'interno della funzione `load`. Ho utilizzato un `Map` per memorizzare le risposte delle API usando l'ID del video come chiave. Prima di effettuare una nuova chiamata `fetch`, controllo se i dati per quell'ID sono già presenti nella cache. In caso affermativo, restituisco i dati dalla cache, saltando la chiamata di rete. Questo ha ridotto drasticamente il consumo della quota API e ha reso la navigazione tra pagine già visitate istantanea.

---

## 🚀 Possibili Miglioramenti Futuri

- [x] Refactor dei Load
- [ ] Refactor dei Componenti per separare in pezzi ancora più piccoli.
- [x] Implementare Skeleton Screens
- [x] Implementare un sistema di paginazione o "infinite scroll" per i commenti e i risultati di ricerca.
- [x] Implementare Dark Mode

---

## 📄 Licenza

Distribuito sotto la Licenza MIT. Vedi `LICENSE` per maggiori informazioni.
