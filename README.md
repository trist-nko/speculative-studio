# Speculative Style Studio

**Speculative Style Studio** is an interactive web tool that lets you dress a randomized avatar in clothing items from your own wardrobe, then use AI to generate an impressionistic "vibe read" of the outfit — the kind of snap judgment a stranger might make about you before the thought disappears.

It was built as part of a PhD Comprehensive Exam project exploring how personal clothing carries memory, identity, and social meaning. But the architecture is intentionally open: swap in your own wardrobe photos, your own descriptions, and your own avatar images, and it becomes a mirror for anyone's personal style.

---

## What it does

When you open the site, a random avatar loads — one of three silhouette figures representing different life stages. You then use dropdowns to select clothing items from your wardrobe catalog, and each item's photo is overlaid directly onto the corresponding zone of the avatar (torso for tops, legs for bottoms, and so on). Accessories use a `location` field to map to specific zones like `head`, `neck`, `hand`, or `chest`.

Once you have at least three items selected, you can click **Generate Speculation** — this sends the written descriptions of your chosen items to a Gemini-powered backend, which returns a short, unfiltered gut reaction to the outfit. The goal is not analysis, but atmosphere: what kind of person do these clothes suggest?

You can also undo selections one step at a time, which makes it easy to experiment with combinations.

---

## Project structure

The frontend is a single HTML page (`index.html`) with vanilla JavaScript (`script.js`) and CSS (`style.css`). There are no frameworks — just arrow functions, CSS variables, and careful DOM manipulation. The clothing catalog lives in `catalog.json` and is loaded at runtime. Avatar images sit in `assets/avatar/`.

The backend is a lightweight Node.js + Express server (`server.js`) whose only job is to proxy requests to the Gemini API so your API key never touches the browser. It uses ES module syntax throughout.

```
/
├── index.html          # Main UI
├── script.js           # All frontend logic
├── style.css           # All styles, built on CSS variables
├── catalog.json        # Your clothing catalog
├── server.js           # Express backend + Gemini proxy
├── assets/
│   └── avatar/         # Avatar images (.webp)
└── .env                # Your GEMINI_API_KEY (never committed)
```

---

## How to adapt it for your own wardrobe

This is the core of what makes the project reusable. There are three things you need to replace: your clothing photos, your catalog data, and optionally your avatar images.

### 1. Add your clothing photos

Place your item photos inside `assets/clothing/`. The filenames matter — they must match the `id` field in `catalog.json`. Any web-friendly image format works (`.webp`, `.jpg`, `.png`), but `.webp` is recommended for performance.

### 2. Edit `catalog.json`

Each entry in the catalog is a JSON object with the following shape:

```json
{
  "id": "your-filename.webp",
  "description": "A sentence or two about this item — its history, how it feels, where it came from.",
  "category": "tops"
}
```

The `category` field must be one of: `tops`, `bottoms`, `footwear`, or `accessories`. For accessories, you also need a `location` field that tells the app which zone of the avatar to map the item to:

```json
{
  "id": "my-hat.webp",
  "description": "A crocheted bucket hat I found at a thrift store.",
  "category": "accessories",
  "location": "head"
}
```

Valid `location` values are `head`, `eyes`, `mouth`, `neck`, `chest`, and `hand`. Each maps to a pre-defined percentage-based zone on the avatar.

The description is the most important field for the AI speculation — write it the way you'd tell someone about the item. Where did it come from? What does it mean to you? The more personal and specific the description, the more interesting the generated vibe read will be.

### 3. (Optional) Replace the avatar images

The three avatar images in `assets/avatar/` are silhouette illustrations used as the base layer. If you want to use your own, replace `avatar-young.webp`, `avatar-mid.webp`, and `avatar-old.webp` with your own images. They should all be the same dimensions and aspect ratio, since the clothing overlay zones are defined as percentages of the container.

If your avatars have different proportions, you'll need to adjust the `zones` objects inside the `avatarOptions` array in `script.js`. Each zone is defined like this:

```js
tops: { top: "18%", left: "10%", width: "80%", height: "37%" }
```

Tweaking those four percentage values shifts and resizes where clothing images are placed on the avatar.

---

## Running it locally

You'll need Node.js installed. Clone the repo, then:

```bash
npm install
```

Create a `.env` file in the root with your Gemini API key:

```
GEMINI_API_KEY=your_key_here
```

Then start the server:

```bash
node server.js
```

Open `http://localhost:3000` in your browser. The server serves the static frontend and handles the `/api/speculate` route.

---

## Deploying to Render

The project is designed to deploy cleanly on [Render](https://render.com) as a **Web Service**:

- **Build command:** `npm install`
- **Start command:** `node server.js`
- **Environment variable:** Add `GEMINI_API_KEY` in the Render dashboard under Environment — never put it in your code or commit it to the repo.

Your `.env` file is for local development only. Render injects the variable directly into the process at runtime.

---

## Getting a Gemini API key

The speculation feature uses Google's Gemini API (specifically `gemini-2.5-flash`). You can get a free API key at [Google AI Studio](https://aistudio.google.com/). The free tier is sufficient for personal use — the prompt is short and only fires when you explicitly click the button.

---

## The philosophy behind the descriptions

The AI prompt is deliberately non-analytical. It doesn't ask Gemini to assess fashion or give styling advice. It asks for the gut reaction of a stranger — the unconscious impression that clothing makes before the conscious mind catches up. This framing is intentional: it surfaces the social and cultural weight that everyday garments carry, which is the core research question the project is built around.

If you're adapting this for your own wardrobe, lean into that in your descriptions. The items that generate the most interesting speculations are usually the ones with the most specific, personal histories attached to them.

---

## Tech stack

The frontend uses no frameworks — just vanilla JavaScript (ES6+), HTML, and CSS with custom properties. The backend is Node.js with Express and `node-fetch`. Avatar overlays are positioned absolutely using percentage-based zones defined per avatar. Undo history is tracked in a simple array. Everything is intentionally minimal so the project stays easy to read, fork, and modify.
