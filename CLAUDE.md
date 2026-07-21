# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory first step: active technical remediation plan

Before analyzing, planning, or changing this repository, read
docs/AUDITORIA-TECNICA-2026-07.md in full. It is the active, prioritized
security/performance/architecture remediation plan. Also read root AGENTS.md,
which defines how agents must coordinate work against that plan.

Do not present the audit plan as optional background. At the start of an
implementation conversation, remind the user that the repository should keep
following the plan until its P0 and P1 findings are closed, identify the next
pending block, and recommend continuing with it. If the user asks for unrelated
work, briefly flag the open priority and recommend returning to it afterward.
An explicit user instruction can still pause, reorder, or replace the plan;
never block the user's current request merely because it is outside the plan.

When completing plan work, update the checklist and relevant evidence in
docs/AUDITORIA-TECNICA-2026-07.md. Do not mark a phase complete until its exit
criteria have been verified.

## Project overview

"Adictos al Techno" (adictosaltechno.com) — a Spanish-language news/community site for electronic (techno) music, built with a Django REST API backend and a React (Vite) frontend. Content types: noticias (news), eventos (events), entrevistas (interviews), anuncios (in-site ad banners), franja superior (top announcement strip), and a contact form that notifies an admin over WhatsApp.

## Ongoing frontend redesign (2026)

There is an active, multi-phase visual redesign of the frontend in progress.
`docs/rediseño/DESIGN.md` is the design-system source of truth (tokens,
components, a11y rules), `docs/rediseño/PLAN.md` is the phased execution plan,
`docs/rediseño/AUDITORIA.md` documents the gaps found between the mock and the
real backend/frontend, and `docs/rediseño/DECISIONES.md` records the
product/scope decisions the owner approved (font, package manager, store,
search, contact form, interviews, ads, gallery, legal pages, URLs). The visual
reference prototype is the static `docs/mocks/index.html` — treat it as a
structure/composition reference, not a literal contract (see its documented
defects in `AUDITORIA.md`). Read `DECISIONES.md` before assuming any of
`PLAN.md`'s original "decisiones abiertas" defaults still apply — several were
overridden (notably: **pnpm**, not npm; search is being implemented, not
removed; a dedicated `/cultura` route is being added).

## Repository layout

- `backend_django/` — Django project (`backend_django/backend_django` is the settings/urls package). Apps: `noticias` (news/events/interviews/comments/tags/ads/contact — the core content app), `users` (JWT auth + password reset), `store` (products/categories/orders + Mercado Pago — present in the codebase but currently unrouted on the frontend, see below).
- `frontend/` — React 18 + Vite + Tailwind CSS 4 SPA.
- `venv/` — local Python virtualenv (not part of source; recreate with `python -m venv venv`, don't assume it exists after a fresh checkout).

## Commands

### Backend (from `backend_django/`)
```bash
python manage.py runserver              # dev server at http://127.0.0.1:8000/
python manage.py migrate                # apply migrations
python manage.py makemigrations <app>   # create migrations for noticias/users/store
python manage.py test                   # run all tests
python manage.py test noticias          # run tests for a single app
python manage.py createsuperuser
```
Requires a running PostgreSQL instance and a Redis instance at `127.0.0.1:6379` (used for view caching — see Architecture below) — both must be up before `runserver` will work correctly.

### Frontend (from `frontend/`)
```bash
pnpm install
pnpm run dev       # dev server at http://localhost:5173/
pnpm run build     # runs scripts/generate-sitemap.mjs, then vite build
pnpm run lint      # ESLint
pnpm run preview   # preview production build
```
`pnpm` is the only supported package manager (`pnpm-lock.yaml` is the committed lockfile); `package-lock.json` was removed as part of the 2026 redesign (see `docs/rediseño/DECISIONES.md`) — don't regenerate it with `npm install`.

## Configuration

- Backend secrets/config are env-driven via `python-dotenv` + `python-decouple` — required vars: `SECRET_KEY`, `DEBUG`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_PUBLIC_KEY`, `EVOLUTION_API_URL`, `EVOLUTION_API_TOKEN`, `ADMIN_NUMBER`, `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `FRONTEND_URL`, optionally `MEDIA_PUBLIC_BASE_URL`. Database is PostgreSQL only, no SQLite fallback.
- Production security settings in `settings.py` (`SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, HSTS) are all toggled by `DEBUG` — they're inert in local dev but active whenever `DEBUG=False`.
- `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` are hardcoded in `settings.py` around the production domain (`adictosaltechno.com` / `api.adictosaltechno.com`) plus a couple of dev/LAN entries — update these when adding a new frontend origin.
- Frontend reads its API base URL from `VITE_API_URL` (see `frontend/src/config/api.js`), falling back to `https://api.adictosaltechno.com/api/` if unset — set `VITE_API_URL=http://127.0.0.1:8000/api/` in a local `.env` for the frontend to talk to a local backend.
- `backend_django/DEPLOY_GALERIAS.md` documents the deploy steps used for the photo-gallery feature (migrate, `MEDIA_PUBLIC_BASE_URL`, manual restart) — a useful template for how deploys are done on this project (git pull → migrate → restart process manager), though there's no automated CI/CD.

## Backend architecture

Each Django app follows the same DRF pattern: `models.py` → `serializers.py` → `views.py` (ViewSets) → `urls.py` (DRF `DefaultRouter`), wired into the project via `backend_django/backend_django/urls.py`.

- **Auth**: `rest_framework_simplejwt` with a custom `CustomTokenObtainPairView` in `users/`. Access tokens last 60 min, refresh tokens 7 days with rotation + blacklisting (`rest_framework_simplejwt.token_blacklist` is installed). `users/views.py` also implements email-based password reset (`PasswordResetRequestView` / `PasswordResetConfirmView`) using Django's `PasswordResetTokenGenerator` and SMTP (`send_mail`); the reset link points at `{FRONTEND_URL}/reset-password/{uid}/{token}`.
- **Permission pattern**: ViewSets override `get_permissions()` — `AllowAny` for `list`/`retrieve`, `IsAdminUser` for writes (noticias, eventos, entrevistas, tags, franjasuperior, store categorías/productos all follow this — note it's `IsAdminUser`, not just `IsAuthenticated`, so regular registered users can't create content). `ComentarioViewSet` is the exception: `IsAuthenticatedOrReadOnly`, with ownership checks in `perform_update`/`perform_destroy` (users can only edit/delete their own comments). `ContactoViewSet.create` is `AllowAny` (public contact form).
- **Caching**: `noticias` list endpoints (`Noticia`, `Evento`, `Entrevista`) are wrapped in `@method_decorator(cache_page(CACHE_TTL), name='list')` (5 min) backed by `django-redis`. Cache is invalidated with a blunt `cache.clear()` in every `perform_create`/`perform_update`/`perform_destroy` — if you add a new cached viewset or a new mutating action, remember to clear the cache there too, since there's no per-key invalidation.
- **View-count tracking**: `Noticia`, `Evento`, and `Entrevista` each increment a `vistas` counter via an `F()` update inside `retrieve()`. `Anuncio` and `FranjaSuperior` similarly track `clicks`/`vistas` via a `track-click` custom `@action`.
- **Image optimization**: `noticias/mixins.py`'s `ImagenOptimizadaMixin` (used by `Noticia`, `Evento`, `Anuncio`, `Entrevista`, `FotoNoticia`, `FotoEvento`, `FotoEntrevista`) overrides `save()` to re-encode every uncommitted `ImageField` on the model to WEBP (max 1200x1200, quality 80) via `noticias/utils.py`'s `optimizar_imagen` before persisting.
- **WhatsApp notifications**: `noticias/utils.py`'s `enviar_whatsapp_contacto` posts to an Evolution API instance to notify `ADMIN_NUMBER` whenever the contact form (`ContactoViewSet.perform_create`) is submitted; it's fired in a background `threading.Thread`, not synchronously.
- **Content galleries**: `FotoNoticia`/`FotoEvento`/`FotoEntrevista` give each `Noticia`/`Evento`/`Entrevista` an ordered photo gallery (`related_name='fotos'`) in addition to their single main image field.
- **Events have multiple dates**: `Evento` no longer has a single `fecha_hora` field — dates live in a separate `FechaEvento` model (`related_name='fechas'`), and `Evento.fecha_hora` is a computed `@property` that returns the next upcoming date (or the most recent past one if none are upcoming). The `EventoViewSet` queryset does the "closest upcoming date first" ordering with an `annotate()`/`Min()` on `fechas`, not a simple `order_by`.
- **Lookup by slug**: `Noticia`, `Evento`, `Entrevista`, and `Producto` are looked up by `slug` (`lookup_field = "slug"`), not numeric id.
- **Pagination**: DRF's `DEFAULT_PAGINATION_CLASS` is `PageNumberPagination` with `PAGE_SIZE = 20` globally — list endpoints return `{results, count, next, previous}`, not a bare array (see `normalizeListResponse` on the frontend, which handles both shapes).
- **Store / Mercado Pago (currently unrouted on the frontend)**: `store/views.py`'s `crear_preferencia_pago` builds a Mercado Pago checkout preference from cart items, validating stock, but its `back_urls` are still hardcoded to a LAN dev IP (`192.168.1.4:5173`) rather than `FRONTEND_URL` — this hasn't been touched since the store frontend routes were pulled from `App.jsx` (see Frontend architecture). Treat this whole feature as dormant/needs-reconnecting rather than a working reference implementation.
- **Media**: uploaded images live under `backend_django/media/{noticias,eventos,entrevistas,productos,anuncios}/` (plus `noticias/galeria/`, `eventos/galeria/`, `entrevistas/galeria/` for the gallery models), served via `MEDIA_URL`/`MEDIA_ROOT` only when `DEBUG=True`; `MEDIA_PUBLIC_BASE_URL` is used to build absolute public URLs for gallery photos in production.
- **Rich text**: `django-tinymce` powers content fields; `TINYMCE_DEFAULT_CONFIG` whitelists `iframe`, `blockquote` (Instagram embeds), and `script` tags via `extended_valid_elements`/`custom_elements` to support embedded media.

## Frontend architecture

- **Routing**: single `BrowserRouter` in `App.jsx`, routes are lazy-loaded (`React.lazy` + `Suspense`) — noticias, eventos, entrevistas, login/register, and password reset (`/forgot-password`, `/reset-password/:uidb64/:token`). Unmatched paths redirect to `/`. **There are currently no routes for the store/cart/checkout/contact pages** (`/tienda`, `/carrito`, `/pago/*`, `/contacto`) even though their page components, `CartContext`, `CartDropdown`, `CartButton`, and the store API service all still exist in the tree and `Header.jsx`/`MainPage.jsx` still reference cart state — if you're asked to "fix the store" or "why doesn't checkout work," start by checking whether routes need to be re-added to `App.jsx` before debugging deeper.
- **Global state**: `CartProvider` (outermost) and `AuthProvider` wrap the app from `src/context/`. Cart persists to `localStorage["cart"]`; JWT tokens persist to `localStorage["accessToken"/"refreshToken"]`. `AuthContext` decodes the JWT client-side with `jwt-decode` rather than calling a "me" endpoint.
- **API layer & auth refresh**: `src/services/api.js` is the primary axios client, configured from `src/config/api.js`'s `API_BASE_URL` (driven by `VITE_API_URL`, see Configuration). It has a **request interceptor** that calls `ensureValidAccessToken()` before every request — proactively refreshing the access token via `/token/refresh/` if it's expired or about to expire — and a **response interceptor** that clears auth storage and hard-redirects to `/login` on any 401/403. Do not reintroduce the old pattern of manually attaching `Authorization` headers per-call for endpoints already covered by this client; only do it for one-off `axios` calls outside `api` (e.g. `getNoticia` still uses a raw `axios.get` intentionally, for `withCredentials`). `src/services/store.api.js` is a separate, older axios instance for the store endpoints and does not have these interceptors.
- **List response shape**: since the backend paginates, list-fetching functions in `api.js` (`getNoticias`, `getInterview`, `getEvents`, `getAnunciosByUbicacion`) run the response through `normalizeListResponse`, which accepts either a bare array or `{results: [...]}`. Follow this pattern for any new list endpoint rather than assuming a bare array.
- **Theming**: a dark/light theme toggle lives directly in `App.jsx` (`ThemeToggle`), storing the choice in `localStorage["adt-theme"]` and setting `document.documentElement.dataset.theme`; components should read the theme via that data attribute / Tailwind dark-mode classes, not local component state.
- **Pages** are grouped by feature under `src/pages/{NewsPage,EventsPage,InterviewPage,LoginPage,store}/`. `src/components/` splits into `common/` (shared UI incl. `Seo.jsx`, `Breadcrumbs.jsx`, `AdBanner.jsx`, `NoticiasCarousel.jsx`), `layout/` (Header/Footer/CartDropdown), `features/` (Comments, Maps, store-specific cards/filters), and `magicui/` (animation/effect components).
- **Sanitization**: HTML from TinyMCE-authored content (noticias/entrevistas) is passed through `src/utils/htmlSanitizer.js` (DOMPurify) before rendering — keep using this wrapper for any new backend-authored HTML rather than injecting raw HTML directly.
- **SEO**: `frontend/scripts/generate-sitemap.mjs` runs as a pre-build step (see `npm run build`) to generate a sitemap; `src/components/common/Seo.jsx` handles per-page meta tags.

## Working across environments

Production runs on a server reachable via the `adt` SSH alias at `/home/django/web-electro`. **`main` is the prod branch** — there is no separate deploy branch; whatever is on `origin/main` is (or is about to be) what's live. The `dev` and `prod` branches on GitHub are stale/abandoned (both are strict ancestors of `main`, 35 and 52 commits behind respectively as of 2026-07-19) — don't treat them as sources of truth for anything; ignore them or ask before pushing to them. When comparing local state against production, diff against `origin/main`.

Server layout/process manager, confirmed 2026-07-19:
- Backend: gunicorn runs as a systemd service (`sudo systemctl restart gunicorn`, passwordless sudo works over the `adt` SSH session), venv at `backend_django/env` (not `venv`), bound to a unix socket nginx proxies to. Redis (for view caching) runs as its own systemd service, always on.
- Frontend: no process manager involved — `frontend/dist` is built via `pnpm run build` and served directly by nginx as static files (`root /home/django/web-electro/frontend/dist;` with SPA fallback to `index.html`). A rebuild just needs the `dist/` folder regenerated; nginx doesn't need a reload.
- `pm2` on the server only runs an unrelated `proxy-fastapi` process — not part of this app's deploy.

**Deploying**: run `./deploy-prod.sh` from the repo root (Git Bash / the Bash tool). It's gitignored (local-only, not committed) — if it's missing, recreate it: it must (1) refuse to run with uncommitted local changes or if not on `main`, (2) push local `main` to `origin/main` if they've diverged, (3) SSH to `adt` and run `git pull origin main`, then `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput && sudo systemctl restart gunicorn` in `backend_django` (with `env/` activated), then `pnpm install --frozen-lockfile && pnpm run build` in `frontend`. Supports `--skip-frontend` / `--skip-backend` to deploy only one side. Ask the user for explicit confirmation before running it — it restarts gunicorn (brief downtime) and pushes to the branch that's actually live.
