# Apex
its a mobile shop inventory management app

## Development

1. Run `npm install`
2. Run `npm run dev`

## Production setup (API + Database)

- **Backend**: deploy `server/` to a Node host (Render/Railway/Fly/etc.)
  - Set `DATABASE_URL` (Postgres) and `JWT_SECRET`
  - Run `npm run db:deploy` (creates tables + seeds) then `npm start`
- **Frontend (Vercel)**:
  - Set `VITE_API_BASE_URL` to your backend API URL (example: `https://your-backend.com/api`)

## Notes

This UI was originally generated from a Magic Patterns design.
