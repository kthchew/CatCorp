# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



To run frontend:
> cd frontend
> npm run dev

To run backend:
> create a .env file in the "Backend" folder, paste in the following code (i will provide the db string):
>  `VITE_CONN_STRING = <DATABASE CONNECTION STRING>`
> cd backend
> node server.js