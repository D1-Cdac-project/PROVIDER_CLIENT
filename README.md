# BookMyMandap Provider Frontend

**BookMyMandap** is the frontend for a Mandap Booking Application built using the **MERN Stack** (MongoDB, ExpressJS, ReactJS, NodeJS). This client-side application allows users and providers to interact with the booking platform through a modern and responsive UI, handling bookings, orders, authentication, and real-time updates.

---

## 📁 File Structure

The client repository follows a modern and modular structure for scalability, maintainability, and performance:

```
.husky/               Git hooks configuration for pre-commit/pre-push automation  
src/                  Main source folder containing React components, pages, and utilities  
.gitignore            Specifies untracked files to ignore  
.nvmrc                Node version manager config to enforce compatible Node.js version  
.prettierignore       Defines files and folders to exclude from Prettier formatting  
.prettierrc           Prettier configuration for consistent code styling  
app.spec.ts           Unit or integration test specifications  
eslint.config.mjs     ESLint configuration for code linting and quality checks  
jest.config.js        Configuration for running Jest tests  
package-lock.json     Automatically generated lockfile for exact dependency versions  
package.json          Project metadata, scripts, and frontend dependencies  
tsconfig.json         TypeScript configuration for project-wide type safety  
```

---

## 🧑‍💻 Tech Stack

- **Framework**: React.js  
- **Language**: JavaScript  
- **State Management**: Context API / Redux (based on implementation)
- **Styling**: Tailwinds CSS
- **Testing**: Jest, React Testing Library  
- **Linting & Formatting**: ESLint, Prettier  
- **Version Control Hooks**: Husky  

---

## 🛠️ Installation Guide

To run the **BookMyMandap frontend** on your local system, follow these steps:

### Step-1: Clone the Repository

```bash
git clone https://github.com/D1-Cdac-project/USER_PROVIDER_CLIENT.git
cd USER_PROVIDER_CLIENT
```

### Step-2: Install Dependencies

```bash
npm install
```

### Step-3: Start the Frontend Development Server

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

- Ensure environment-specific variables (like backend URLs or public keys) are set in a `.env` file if the frontend uses them.
- For smooth development, make sure both backend and frontend are running concurrently.
