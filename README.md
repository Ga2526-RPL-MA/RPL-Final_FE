# RPL Final - Frontend

Sistem Manajemen Tugas Akhir 

## Tech Stack

- **Framework**: Next.js  Router)
- **Language**: TypeScript


## Getting Started

### Prerequisites

- Node.js 
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build Production

```bash
npm run build
npm start
```


## Features

### Authentication
- Login / Register
- Forgot Password / Reset Password
- Role-based access (Dosen / Mahasiswa)

### Dosen
- Dashboard dengan aktivitas terkini
- Manajemen judul tugas akhir
- Pending requests dari mahasiswa
- Monitoring progress mahasiswa

### Mahasiswa
- Dashboard dengan status tugas akhir
- Tawaran judul tugas akhir
- Progress tugas akhir
- Detail tugas akhir

## Environment Variables

File `.env`:

```env
NEXT_PUBLIC_API_BASE=" "
```
