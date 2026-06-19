# Deploy Doc Scanner to Cloudflare Pages

The app is 100% static (no build step). Everything runs in the browser —
scanned pages never leave the phone. Cloudflare only serves the files and gives
you an `https://` URL (required for the camera + "Add to Home Screen").

## One-time: log in to Cloudflare

In the Claude Code prompt, type this with the `!` prefix so it runs here and
opens your browser to approve:

```
! wrangler login
```

Approve in the browser, then tell Claude "done" and it will deploy.

## Deploy (Claude runs this, or you can)

```
wrangler pages deploy . --project-name doc-scanner
```

First run creates the project and prints your URL:
`https://doc-scanner.pages.dev`. Re-running the same command publishes updates.

## On your iPhone

1. Open the `https://...pages.dev` URL in **Safari**.
2. Allow camera access when prompted.
3. Share button → **Add to Home Screen** → it installs like an app, works offline.

## Alternative: no CLI (dashboard drag-and-drop)

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Name it `doc-scanner`, drag in the contents of this folder (index.html,
   manifest.webmanifest, sw.js, `vendor/`, `icons/`).
3. Deploy → you get the same `https://...pages.dev` URL.

## Notes

- `vendor/opencv.js` is 9.5 MB (edge-detection). First load on cellular is slow;
  the service worker caches it so later loads and offline use are instant.
- To force-update the cached app after a deploy, bump `CACHE` in `sw.js`
  (e.g. `docscanner-v3` → `v4`).
