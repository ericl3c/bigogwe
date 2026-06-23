# TODO

- [x] Backend: add protected `POST /api/auth/register-admin` endpoint (CEO-only, forces `role='ceo'`).

- [ ] Frontend: add `frontend/src/pages/admin/AdminRegister.js` page (name_user, email, password).
- [ ] Frontend: add route `/admin/register` in `frontend/src/App.js`.
- [x] Frontend: add navigation link/button from `AdminDashboard` to `/admin/register`.
- [x] Frontend: add API helper in `frontend/src/pages/utils/adminApi.js` to call `/auth/register-admin`.
- [x] Validate: run backend/frontend and test CEO-only registration flow.



