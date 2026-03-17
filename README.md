# CarbonMonitor Mobile

Mobile app for monitoring the carbon footprint of physical sites. Part of the **Hackathon Capgemini 2026** — *Calculer l'empreinte carbone d'un site physique*.

## Tech Stack

- **Expo 54** · **React Native**
- **Expo Router** (file-based routing)
- **React Query** · **AsyncStorage**
- **Lucide React Native** (icons)

## Features

- **Authentication**: Login, register, JWT session persistence
- **Dashboard**: Total CO₂, construction/exploitation split, last site KPIs
- **Sites**: List, create, edit, delete sites
- **Site creation**: 3 sections — General info, Energy & Transport, Construction materials
- **Materials**: 10 Base Carbone® materials + "Other" for custom materials with emission factor
- **Address**: Street, postal code, city
- **Calculation methodology**: Accordion with formulas (CO₂ total, construction, exploitation, CO₂/m², CO₂/employee, CO₂/workstation)

## Prerequisites

- **Node.js** 18+
- **API** running at `http://localhost:8080/api` (or set `EXPO_PUBLIC_API_URL`)

## Quick Start

1. **Start the API** (from `CarbonMonitor-api`):

```bash
docker-compose up -d postgres capcarbon-api
```

2. **Install dependencies**:

```bash
npm install
```

3. **Start the app**:

```bash
npx expo start
```

4. Open in **Expo Go**, **iOS Simulator**, or **Android Emulator**.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | http://localhost:8080/api | API base URL |

For a physical device, use your machine's IP (e.g. `http://192.168.1.x:8080/api`).

## Project Structure

```
app/
  (tabs)/          # Tab navigation (Home, Sites, History, Profile)
    index.tsx      # Dashboard
    sites.tsx      # Sites list
    history.tsx    # History
    profile.tsx    # Profile & logout
  site/
    new.tsx        # Create site
    [id].tsx       # Site detail
    edit/[id].tsx  # Edit site
  login.tsx
  register.tsx
constants/         # Theme, emission factors, Base Carbone materials
providers/         # App state, auth, sites
services/          # API client, site mapper
ui/                # Reusable components
utils/             # Calculations, formatting
```

## Calculation Methodology

- **CO₂ total** = construction + exploitation
- **Construction** = Σ (material quantity × Base Carbone® emission factor)
- **Exploitation** = energy + parking + employees + workstations + surface
- **CO₂ / m²** = CO₂ total ÷ surface (m²)
- **CO₂ / employé** = CO₂ total ÷ employees
- **CO₂ / poste de travail** = CO₂ total ÷ workstations

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Open iOS simulator |
| `npm run android` | Open Android emulator |
| `npm run lint` | Run ESLint |

## License

Internal use — Hackathon Capgemini 2026.
