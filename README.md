# 🗑️ Smart Trash Bin Dashboard

Dashboard monitoring IoT untuk **Smart Bin Adaptif Terintegrasi** berbasis Multi-Sensor dan Computer Vision.

Dibangun dengan **Next.js 15**, **Tailwind CSS**, dan **Firebase Realtime Database**.

---

## 🚀 Setup & Instalasi

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka browser di
# http://localhost:3000
```

---

## 🔥 Struktur Database Firebase

Setiap tempat sampah disimpan di root Firebase Realtime Database dengan key `trashbin_idXXXX`:

```json
{
  "trashbin_id0001": {
    "capacity_plastic": 67,
    "capacity_wet": 42,
    "capacity_dry": 85,

    "count_plastic":   23,
    "count_cardboard":  8,
    "count_glass":      5,
    "count_metal":      3,
    "count_paper":     12,
    "count_trash":     19,

    "gas_level":      124.5,
    "air_quality":    "Normal",

    "last_update":    "2026-04-06T10:30:00Z",
    "is_active":      true,
    "location":       "Gedung FTI – Lantai 2"
  }
}
```

### Field Reference

| Field | Tipe | Keterangan |
|-------|------|------------|
| `capacity_plastic` | Integer (0–100) | Kepenuhan chamber plastik (%) |
| `capacity_wet` | Integer (0–100) | Kepenuhan chamber organik basah (%) |
| `capacity_dry` | Integer (0–100) | Kepenuhan chamber anorganik kering (%) |
| `count_plastic` | Integer | Jumlah item plastik terdeteksi |
| `count_cardboard` | Integer | Jumlah item kardus |
| `count_glass` | Integer | Jumlah item kaca |
| `count_metal` | Integer | Jumlah item logam |
| `count_paper` | Integer | Jumlah item kertas |
| `count_trash` | Integer | Jumlah item organik/sampah umum |
| `gas_level` | Float | Nilai PPM dari sensor MQ-135 |
| `air_quality` | String | `"Normal"` / `"Peringatan"` / `"Berbahaya"` |
| `last_update` | String (ISO 8601) | Timestamp update terakhir |
| `is_active` | Boolean | Status aktif perangkat |
| `location` | String | Lokasi fisik tempat sampah |

---

## 🤖 Klasifikasi Sampah (TrashNet → Chamber)

| Label TrashNet | Chamber | Warna |
|---------------|---------|-------|
| `plastic` | 🧴 Plastik | Cyan |
| `cardboard` | ♻️ Anorganik Kering | Orange |
| `glass` | ♻️ Anorganik Kering | Violet |
| `metal` | ♻️ Anorganik Kering | Slate |
| `paper` | ♻️ Anorganik Kering | Amber |
| `trash` | 🌿 Organik Basah | Green |

---

## 🛠️ Tech Stack

- **Next.js 15** – React framework
- **Tailwind CSS** – Utility-first styling
- **Firebase Realtime Database** – Real-time data sync
- **Recharts** – Data visualization
- **Framer Motion** – Animations
- **Lucide React** – Icons
- **date-fns** – Date formatting

---

## 📡 Hardware

- **Raspberry Pi 4B** – Main processor
- **Raspberry Pi Camera V2** (8MP) – Computer vision
- **MobileNetV2** – ML classification model
- **JSN-SR04T** – Ultrasonic distance sensor (capacity)
- **MQ-135** – Gas sensor (odor detection)
- **MG996R Servo** – Waste sorting mechanism
- **SMD 5730** – Controlled lighting

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Eco glass theme
├── components/
│   ├── Dashboard.tsx   # Main dashboard layout
│   ├── Navbar.tsx      # Top navigation
│   ├── ChamberCard.tsx # Chamber capacity gauges
│   ├── WasteChart.tsx  # Waste distribution charts
│   ├── GasMonitor.tsx  # MQ-135 gas monitor
│   ├── StatsOverview.tsx # Summary stats
│   ├── SystemInfo.tsx  # Device info panel
│   ├── TourGuide.tsx   # Interactive tour
│   ├── Background.tsx  # Visual decorations
│   └── Skeleton.tsx    # Loading states
├── hooks/
│   └── useTrashBin.ts  # Firebase realtime hooks
├── lib/
│   └── firebase.ts     # Firebase config
└── types/
    └── index.ts        # TypeScript types
```
