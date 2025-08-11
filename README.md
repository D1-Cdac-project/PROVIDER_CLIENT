# BookMyMandap Provider Frontend

- **BookMyMandap** is the frontend for a Mandap Booking Application built using the **MERN Stack** (MongoDB, ExpressJS, ReactJS, NodeJS). This client-side application allows users and providers to interact with the booking platform through a modern and responsive UI, handling bookings, orders, authentication, and real-time updates.
- BookMyMandap has a dedicated front-end interface for mandap providers. It enables providers to **manage their venues**, **track bookings**, and **update availability** seamlessly. Built with modern web technologies, this portal ensures an efficient and user-friendly experience for service providers, empowering them to grow and manage their business on the platform effortlessly.

---

## 📁 File Structure

The provider frontend repository follows a modern and modular structure for scalability, maintainability, and performance:

```
dist/                 Build output directory for production assets
public/               Static files and assets
src/                  Main source folder containing React components, pages, and utilities
  components/         Reusable React components
  context/            Context providers and related logic
  pages/              Page-level components
  services/           Service layer for API calls and utilities
  store/              State management using Redux or similar
  styles/             CSS or styled-component files
  utils/              Utility functions and helpers
App.tsx               Main application component
index.css             Global CSS styles
main.tsx              Entry point for the React application
.gitignore            Files and directories to be ignored by Git
Dockerfile            Configuration for Docker containerization
README.md             Project documentation
eslint.config.js      ESLint configuration file
index.html            HTML template for the app
package-lock.json     Lock file for dependency versions
package.json          Project metadata and dependencies
postcss.config.js     PostCSS configuration
tailwind.config.js    Tailwind CSS configuration
vercel.json           Vercel deployment configuration
vite.config.ts        Vite configuration file
```

---

## 🧑‍💻 Tech Stack

- **Framework**: ReactJS, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Containerization**: Docker
- **Deployment**: Vercel

---

## 🛠️ Installation Guide

To run the **BookMyMandap Provider Frontend** on your local system, follow these steps:

### Step-1: Clone the Repository

```bash
git clone https://github.com/D1-Cdac-project/USER_PROVIDER_CLIENT.git
cd USER_PROVIDER_CLIENT
```

### Step-2: Install Dependencies

```bash
npm install
```

### Step-3: Add Environment Variables

Create a `.env` file in the root directory and add the following variables:

### Environment Variables for Provider Frontend

```env
VITE_API_URL=http://localhost:4000
```

### Step-4: Start the Frontend Development Server

```bash
npm run dev
```

Once the app starts, it will be accessible at:

```
http://localhost:5173
```

Make sure the backend server is running at **`http://localhost:4000`** for full functionality.

---

## 💡 Notes

- Ensure environment-specific variables (like backend URLs) are set in a `.env` file.
- For smooth development, ensure both backend and frontend are running concurrently.
