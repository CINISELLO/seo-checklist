# SEO Checklist — Istruzioni di Setup

## Prima di tutto: inserisci la tua chiave Supabase

Apri il file `.env` e sostituisci `INCOLLA_QUI_LA_TUA_ANON_KEY` con la chiave
`anon public` che trovi su Supabase → Settings → API Keys → Legacy → anon public → Copy.

Esempio:
```
VITE_SUPABASE_URL=https://lezbfnqsdlfnxqyztovy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
```

---

## Carica su GitHub

1. Vai su github.com → "New repository" → nome: `seo-checklist` → Create
2. Apri il Terminale in questa cartella ed esegui:

```bash
npm install
git init
git add .
git commit -m "primo commit"
git branch -M main
git remote add origin https://github.com/TUOUSERNAME/seo-checklist.git
git push -u origin main
```

(sostituisci TUOUSERNAME con il tuo username GitHub)

---

## Pubblica su Vercel

1. Vai su vercel.com → "Add New Project"
2. Seleziona il repository `seo-checklist`
3. Vai su "Environment Variables" e aggiungi:
   - `VITE_SUPABASE_URL` → `https://lezbfnqsdlfnxqyztovy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` → la tua chiave anon
4. Clicca **Deploy**
5. In 2 minuti hai il tuo URL (es. `seo-checklist.vercel.app`)

---

## Installa come app

**iPhone:** Safari → vai sull'URL → icona Condividi → "Aggiungi a schermata Home"
**Android:** Chrome → vai sull'URL → tre puntini → "Installa app"
**Mac/Windows:** Chrome o Edge → vai sull'URL → icona installazione nella barra → Installa

---

## Aggiorna la checklist in futuro

1. Modifica i file con Claude
2. Sostituisci i file nella cartella
3. Esegui dal Terminale:
```bash
git add .
git commit -m "aggiornamento"
git push
```
Vercel si aggiorna automaticamente in 2 minuti.
