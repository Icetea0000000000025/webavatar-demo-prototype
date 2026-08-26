# Botnoi WebAvatar Demo Portal

Interactive Sandbox และ Web Application ต้นแบบสำหรับทดสอบการเชื่อมต่อระบบ **Botnoi WebAvatar (3D Conversational AI)** เข้ากับ Web Application จริง พร้อมจำลอง Use Case ธุรกิจหลากหลายรูปแบบ (จองตั๋วเครื่องบิน, สั่งอาหาร, ร้านค้าไอที, พอร์ทัลบริการ)

--------

## 📌 ภาพรวมโปรเจกต์ (Overview)

โปรเจกต์นี้สร้างขึ้นเพื่อทดสอบและสาธิตการทำงานร่วมกันระหว่าง **WebAvatar JSSDK** กับ Single Page Application (React) โดยมีฟีเจอร์หลัก:

- **Voice-to-Voice Realtime Interaction**: สนทนาเสียงกับ 3D VRM Avatar แบบ Real-time ผ่าน WebSockets พร้อม Lip-sync และท่าทาง (Animations) ตามบริบท
- **SPA Web Navigation Control**: Avatar สามารถสั่งเปลี่ยนหน้า (Route) หรือควบคุมหน้าเว็บตามคำสั่งเสียงของผู้ใช้ผ่าน Custom Event (`webavatar-navigate`)
- **Interactive Scenarios**: ตัวอย่างหน้าบ้านและหลังบ้าน (Admin) สำหรับทดสอบ Flow การสั่งงานจริง
- **Multilingual Support**: รองรับ 7 ภาษา (TH, EN, ZH, JA, KO, ES, FR) พร้อม sync ค่าคำสั่งทักทาย (Greeting Instruction) ไปยัง Avatar อัตโนมัติ
- **Modern UI & Theme System**: สลับ Dark / Light mode, แอนิเมชันด้วย Framer Motion, และพื้นหลัง Interactive Canvas

---

## 🚀 รายการหน้า Demo (Demo Pages)

| Route | ชื่อหน้า | รายละเอียด |
| :--- | :--- | :--- |
| `/` | **Home** | หน้า Landing Page ภาพรวมระบบ, Interactive Bento Grid, System Status |
| `/flight-demo` | **Flight Booking** | ระบบค้นหาและจำลองการจองตั๋วเครื่องบิน (มีหน้า Admin ที่ `/flight-demo/admin`) |
| `/food-demo` | **Food Ordering** | ระบบสั่งอาหารออนไลน์ ตะกร้าสินค้า และขั้นตอนชำระเงิน (มีหน้า Admin ที่ `/food-demo/admin`) |
| `/it-store-demo` | **IT Store** | แคตตาล็อกสินค้าไอที ค้นหา/กรองสเปก (มีหน้า Admin ที่ `/it-store-demo/admin`) |
| `/all-demo` | **TN House Portal** | พอร์ทัลศูนย์รวมบริการและอสังหาริมทรัพย์ |
| `/about` | **About Us** | ข้อมูลและเทคโนโลยีเบื้องหลัง |
| `/contact` | **Contact & FAQ** | แบบฟอร์มติดต่อสอบถามและคำถามที่พบบ่อย |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Routing**: React Router v7
- **Animation & Icons**: Framer Motion, Lucide React
- **UI Components**: Radix UI Dialog, Sonner (Toast)
- **AI Avatar**: Botnoi WebAvatar JSSDK

---

## ⚙️ การติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. ข้อกำหนดเบื้องต้น
- Node.js >= 18.x
- npm / yarn / pnpm

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. รัน Development Server
```bash
npm run dev
```
เปิดบราวเซอร์ที่ `http://localhost:5173`

### 4. Build สำหรับ Production
```bash
npm run build
```
ผลลัพธ์การ Build จะถูกสร้างไว้ที่โฟลเดอร์ `dist/`

---

## 🔌 การเชื่อมต่อ WebAvatar (Integration Details)

### 1. การใส่ Config และโหลด SDK (`index.html`)

```html
<script>
  window.ChatWidgetConfig = {
    mode: "realtime-widget",        // "realtime-widget" หรือ "realtime-fullscreen"
    widgetId: "Botnoi",
    avatarUrl: "Botnoi",
    greetingInstruction: "Greet the user in Thai.",
    enableBubble: "false",
    cameraOffset: "0,0,0.5",
    animationUrl: "Greeting",
    defaultAnimationUrl: "Idleloop, idle_breatheloop, Idle_Swayloop",
    randomGeneric: "false",
  };
</script>
<script id="webavatar-jssdk" src="https://webavatar.didthat.cc/chat-widget.js" async></script>
```

### 2. การดักจับ Event สั่งเปลี่ยนหน้าใน SPA (`SpaNavListener.tsx`)

Avatar สื่อสารกับหน้าเว็บผ่าน `document.dispatchEvent` เมื่อได้รับคำสั่งให้เปิดหน้าใหม่:

```tsx
// src/components/SpaNavListener.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpaNavListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent;
      const target = customEvent.detail.target;
      try {
        const url = new URL(target, window.location.origin);
        navigate(url.pathname + url.search + url.hash);
      } catch {
        navigate(target);
      }
    };

    document.addEventListener('webavatar-navigate', handleNav);
    return () => document.removeEventListener('webavatar-navigate', handleNav);
  }, [navigate]);

  return null;
}
```

> รายละเอียดเชิงลึกเรื่อง Events, Methods, Camera, และการปรับแต่งเสียง สามารถอ่านเพิ่มเติมได้ใน [INTEGRATION_GUIDE_REALTIME.md](file:///C:/Users/ASUS/webavatar-demo-prototype/INTEGRATION_GUIDE_REALTIME.md)

---

## 📁 โครงสร้างโปรเจกต์ (Directory Structure)

```text
├── public/                 # Static assets & icons
├── src/
│   ├── assets/             # รูปภาพ, โลโก้, และสื่อต่างๆ
│   ├── components/         # Reusable UI & Layout
│   │   ├── AppNavbar.tsx   # Header & ตัวสลับภาษา/ธีม
│   │   ├── AppFooter.tsx   # Footer
│   │   ├── SpaNavListener.tsx # WebAvatar Navigation Listener
│   │   └── ui/             # Radix / Dialog / Toast helpers
│   ├── config/             # Config รายการหน้าและเมนู (pages.ts)
│   ├── lib/                # Contexts (Theme, Language, i18n translations)
│   ├── pages/              # หน้า Demo แต่ละ Use Case
│   ├── App.tsx             # Route Configuration
│   └── main.tsx            # Application Entry Point
├── INTEGRATION_GUIDE_REALTIME.md # เอกสาร API/SDK Integration
└── package.json
```

---

## 📜 NPM Scripts

| คำสั่ง | หน้าที่ |
| :--- | :--- |
| `npm run dev` | สตาร์ท Dev Server |
| `npm run build` | เช็ค Type (`tsc -b`) และ Build Production Bundle |
| `npm run preview` | รันเว็บแบบพรีวิวจากโฟลเดอร์ `dist/` |
| `npm run lint` | ตรวจสอบโค้ดด้วย ESLint |
