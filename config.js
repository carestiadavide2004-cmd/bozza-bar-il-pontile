/* ==========================================================================
   IL PONTILE – CONFIGURAZIONE DEL SITO
   --------------------------------------------------------------------------
   Per adattare il sito a un cliente vero modifica SOLO questo file:
   nome, contatti, orari, prezzi, eventi, serate e link social.
   ========================================================================== */

window.SITE_CONFIG = {

  /* ------------------------------------------------------------------------
     1) CHIAVE WEB3FORMS  ← incolla qui la chiave (https://web3forms.com)
     Finché resta il segnaposto, il modulo funziona in modalità demo:
     controlla i campi ma non invia nulla.
     ------------------------------------------------------------------------ */
  web3formsKey: "INSERISCI_CHIAVE_WEB3FORMS",

  /* 2) DATI DEL LOCALE ---------------------------------------------------- */
  nome: "Il Pontile",
  sottotitolo: "Bar & Eventi",
  slogan: "Dal primo caffè all'ultimo brindisi, sulla passerella che entra nel mare.",
  citta: "Pescara",
  indirizzo: "Lungomare, Pescara – indirizzo di esempio",
  telefono: "+39 085 000 0000",          // come appare sul sito
  telefonoLink: "+390850000000",          // senza spazi, per il link "Chiama"
  whatsapp: "393330000000",               // prefisso internazionale, senza + e spazi
  whatsappMessaggio: "Ciao! Vorrei informazioni per un evento al Pontile.",
  email: "ciao@ilpontile.example",
  // Mappa: coordinate del punto da mostrare (lungomare di Pescara)
  mappa: { lat: 42.4687, lng: 14.2205, zoom: 15 },
  fusoOrario: "Europe/Rome",

  /* 3) ORARI --------------------------------------------------------------
     Un elemento per giorno (0 = domenica … 6 = sabato).
     Se la chiusura è dopo mezzanotte scrivi pure "02:00": il sito lo capisce.
     Per un giorno di chiusura usa: null                                     */
  orari: {
    1: { apre: "07:00", chiude: "24:00" }, // lunedì
    2: { apre: "07:00", chiude: "24:00" }, // martedì
    3: { apre: "07:00", chiude: "24:00" }, // mercoledì
    4: { apre: "07:00", chiude: "24:00" }, // giovedì
    5: { apre: "07:00", chiude: "02:00" }, // venerdì
    6: { apre: "07:00", chiude: "02:00" }, // sabato
    0: { apre: "07:30", chiude: "24:00" }  // domenica
  },

  /* 4) SOCIAL (link segnaposto) ------------------------------------------ */
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
    instagramNome: "@ilpontile.pescara"
  },

  /* 5) IL NOSTRO GIORNO (fasce orarie mostrate nella sezione) ------------- */
  giornata: [
    { id: "colazione", nome: "Colazione", orario: "7:00 – 11:30" },
    { id: "pranzo",    nome: "Pranzo",    orario: "12:00 – 15:00" },
    { id: "aperitivo", nome: "Aperitivo", orario: "18:00 – 21:00" },
    { id: "cocktail",  nome: "Cocktail",  orario: "21:00 – chiusura" }
  ],

  /* 6) MENÙ (prezzi in euro) --------------------------------------------- */
  cocktailDellaSettimana: {
    nome: "Brezza di Ponente",
    descrizione: "Gin abruzzese, bitter al pompelmo rosa, sciroppo di rosmarino fatto da noi e un filo di tonica. Si beve guardando il sole che scende dietro la Majella.",
    prezzo: 9,
    foto: "assets/img/cocktail-settimana.jpg"
  },

  menu: [
    {
      id: "caffetteria", nome: "Caffetteria",
      voci: [
        { nome: "Espresso", prezzo: 1.2 },
        { nome: "Caffè macchiato", prezzo: 1.3 },
        { nome: "Cappuccino", prezzo: 1.6 },
        { nome: "Latte macchiato", prezzo: 2 },
        { nome: "Caffè d'orzo o ginseng", prezzo: 1.5 },
        { nome: "Marocchino", prezzo: 1.8 },
        { nome: "Caffè shakerato", prezzo: 3.5 },
        { nome: "Spremuta d'arancia", prezzo: 3.5 },
        { nome: "Centrifugato del giorno", prezzo: 4.5 },
        { nome: "Tè e tisane", prezzo: 2.5 }
      ]
    },
    {
      id: "dolci", nome: "Cornetti e dolci",
      voci: [
        { nome: "Cornetto vuoto", prezzo: 1.3 },
        { nome: "Cornetto crema, marmellata o cioccolato", prezzo: 1.5 },
        { nome: "Cornetto integrale al miele", prezzo: 1.6 },
        { nome: "Bocconotto abruzzese", prezzo: 2, nota: "ricetta di nonna Lina" },
        { nome: "Fetta di parrozzo", prezzo: 2.5 },
        { nome: "Maritozzo con la panna", prezzo: 2.5 },
        { nome: "Torta della casa", prezzo: 3.5 },
        { nome: "Yogurt greco, granola e frutta", prezzo: 5 }
      ]
    },
    {
      id: "pranzo", nome: "Panini e piatti veloci",
      voci: [
        { nome: "Toast prosciutto cotto e formaggio", prezzo: 4 },
        { nome: "Panino ventricina, pecorino e rucola", prezzo: 7 },
        { nome: "Panino porchetta, scamorza e friarielli", prezzo: 7.5 },
        { nome: "Focaccia crudo, burrata e pomodorini", prezzo: 8.5 },
        { nome: "Piadina tonno, pomodoro e cipolla rossa", prezzo: 7 },
        { nome: "Insalatona del Pontile", prezzo: 9, nota: "tonno, ceci, olive, finocchio, arancia" },
        { nome: "Poke di salmone o pollo", prezzo: 11 },
        { nome: "Pasta fredda del giorno", prezzo: 9 }
      ]
    },
    {
      id: "aperitivi", nome: "Aperitivi",
      voci: [
        { nome: "Spritz Aperol o Campari", prezzo: 6 },
        { nome: "Hugo", prezzo: 6 },
        { nome: "Americano", prezzo: 7 },
        { nome: "Analcolico alla frutta", prezzo: 5 },
        { nome: "Calice di bollicine", prezzo: 5 },
        { nome: "Aperitivo con stuzzichini", prezzo: 8, nota: "drink a scelta + piattino" },
        { nome: "Tagliere per due", prezzo: 18, nota: "salumi e formaggi abruzzesi, pallotte cacio e ova" },
        { nome: "Arrosticini (10 pezzi)", prezzo: 12, nota: "solo venerdì e sabato" }
      ]
    },
    {
      id: "cocktail", nome: "Cocktail",
      voci: [
        { nome: "Gin tonic", prezzo: 8 },
        { nome: "Negroni", prezzo: 8 },
        { nome: "Moscow Mule", prezzo: 8 },
        { nome: "Mojito", prezzo: 8 },
        { nome: "Margarita", prezzo: 8.5 },
        { nome: "Espresso Martini", prezzo: 9 },
        { nome: "Paloma", prezzo: 9 },
        { nome: "Gin tonic premium", prezzo: 12, nota: "gin selezionati dalla carta" },
        { nome: "Mocktail della casa", prezzo: 6 }
      ]
    },
    {
      id: "vini", nome: "Vini e birre",
      voci: [
        { nome: "Calice Trebbiano d'Abruzzo", prezzo: 5 },
        { nome: "Calice Cerasuolo d'Abruzzo", prezzo: 5.5 },
        { nome: "Calice Montepulciano d'Abruzzo", prezzo: 5.5 },
        { nome: "Calice Pecorino", prezzo: 6 },
        { nome: "Bottiglia di Pecorino", prezzo: 24 },
        { nome: "Prosecco (bottiglia)", prezzo: 22 },
        { nome: "Birra alla spina piccola", prezzo: 3.5 },
        { nome: "Birra alla spina media", prezzo: 5.5 },
        { nome: "Birra artigianale abruzzese (33 cl)", prezzo: 6 }
      ]
    }
  ],

  /* 7) EVENTI ------------------------------------------------------------- */
  sale: { sala: 60, terrazza: 100 },

  // Tipi di evento mostrati nelle schede (il primo, "laurea", è in evidenza)
  eventi: [
    {
      id: "laurea", nome: "Lauree", daPrezzo: 18,
      foto: "assets/img/laurea.jpg",
      fotoAlt: "Neolaureato sorridente con la corona d'alloro",
      offerta: "Prenota entro 30 giorni dalla data e la corona d'alloro te la regaliamo noi.",
      incluso: ["Buffet o aperitivo al tavolo", "Brindisi con bollicine", "Tavolo riservato in sala o in terrazza", "Musica di sottofondo e microfono per il discorso"]
    },
    {
      id: "compleanno", nome: "Compleanni", daPrezzo: 16,
      foto: "assets/img/compleanno.jpg", fotoAlt: "Ragazza che spegne le candeline su una torta di frutta",
      incluso: ["Aperitivo rinforzato", "Servizio torta e piattini", "Palloncini nei colori che scegli"]
    },
    {
      id: "diciottesimo", nome: "Diciottesimi", daPrezzo: 20,
      foto: "assets/img/diciottesimo.jpg", fotoAlt: "Brindisi con le stelline accese",
      incluso: ["Terrazza in esclusiva fino a mezzanotte", "DJ set su richiesta", "Cocktail analcolici per i più giovani"]
    },
    {
      id: "battesimo", nome: "Battesimi e comunioni", daPrezzo: 28,
      foto: "assets/img/battesimo.jpg", fotoAlt: "Tavoli apparecchiati di bianco con fiori",
      incluso: ["Pranzo seduti o buffet", "Menù bambini", "Allestimento bianco e azzurro"]
    },
    {
      id: "aziendale", nome: "Cene aziendali", daPrezzo: 32,
      foto: "assets/img/aziendale.jpg", fotoAlt: "Colleghi che brindano a una cena",
      incluso: ["Menù fisso di 3 portate", "Vini abruzzesi in abbinamento", "Schermo e microfono per presentazioni"]
    },
    {
      id: "nubilato", nome: "Addii al nubilato e al celibato", daPrezzo: 22,
      foto: "assets/img/nubilato.jpg", fotoAlt: "Amiche che festeggiano la futura sposa",
      incluso: ["Cocktail di benvenuto a tema", "Tavolata riservata", "Playlist decisa da voi"]
    }
  ],

  // Pacchetti (prezzo a persona)
  pacchetti: [
    {
      id: "base", nome: "Base", prezzo: 18,
      descrizione: "Per festeggiare senza pensieri, all'ora dell'aperitivo.",
      incluso: ["Buffet di stuzzichini caldi e freddi", "1 drink a scelta a persona", "Acqua e bibite", "Tavolo riservato per 3 ore"]
    },
    {
      id: "rinforzato", nome: "Aperitivo rinforzato", prezzo: 25, consigliato: true,
      descrizione: "Perfetto per lauree e compleanni: si cena senza accorgersene.",
      incluso: ["Tutto il pacchetto Base", "Taglieri di salumi e formaggi abruzzesi", "Primo caldo in finger food", "2 drink a scelta a persona", "Brindisi con bollicine"]
    },
    {
      id: "premium", nome: "Premium", prezzo: 38,
      descrizione: "La festa completa, con la terrazza tutta per voi.",
      incluso: ["Tutto l'Aperitivo rinforzato", "Arrosticini e frittini di mare", "Open bar cocktail per 2 ore", "Allestimento personalizzato", "Servizio torta incluso"]
    }
  ],

  caparra: "30%",

  /* 8) SERATE ------------------------------------------------------------
     giorno: 0 = domenica … 6 = sabato. Il sito mostra la prossima data.    */
  serate: [
    { giorno: 5, ora: "22:30", titolo: "DJ set in terrazza", descrizione: "House e disco anni '80 con DJ Risacca, finché il mare non si fa nero.", foto: "assets/img/dj.jpg", ingresso: "Ingresso libero" },
    { giorno: 4, ora: "21:30", titolo: "Karaoke del giovedì", descrizione: "Microfono aperto e cocktail a 6 €. Chi canta meglio vince lo shot della casa.", foto: "assets/img/karaoke.jpg", ingresso: "Ingresso libero" },
    { giorno: 0, ora: "19:00", titolo: "Live music al tramonto", descrizione: "Chitarra e voce acustiche: cantautori italiani e qualche classico da cantare insieme.", foto: "assets/img/live.jpg", ingresso: "Ingresso libero" }
  ],

  /* 9) DOMANDE FREQUENTI ------------------------------------------------- */
  faq: [
    { d: "Serve una caparra per prenotare?", r: "Sì: per confermare l'evento chiediamo una caparra del 30% sul preventivo. La restituiamo per intero se disdici almeno 15 giorni prima." },
    { d: "Posso portare una torta da fuori?", r: "Certo. Ti chiediamo solo lo scontrino della pasticceria per le norme igieniche; il servizio torta (taglio, piattini, candeline) costa 2 € a persona ed è incluso nel pacchetto Premium." },
    { d: "Si può mettere la propria musica o chiamare un DJ?", r: "Sì. Abbiamo impianto audio e microfono in sala e in terrazza: puoi collegare la tua playlist o portare un DJ. In terrazza la musica alta si spegne a mezzanotte." },
    { d: "Pensate voi agli allestimenti?", r: "Palloncini, centrotavola e tovagliato nei colori che preferisci li curiamo noi con un piccolo supplemento. Puoi anche portare le tue decorazioni: arriva un'ora prima e ti aiutiamo a sistemarle." },
    { d: "Quanto prima devo prenotare?", r: "Per sala e terrazza nel fine settimana conviene muoversi con 3–4 settimane di anticipo, soprattutto a marzo, luglio e dicembre (stagione di lauree). Per le lauree, se prenoti entro 30 giorni dalla data la corona d'alloro è un nostro regalo." },
    { d: "Ci sono opzioni per celiaci, vegetariani e vegani?", r: "Sì, basta segnalarlo nelle note del modulo: prepariamo piatti dedicati senza costi in più." }
  ]
};
