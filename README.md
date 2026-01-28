# AwarenessHub

**Professional Cybersecurity Training Platform**

🌐 **Live Site:** [https://www.awarenesshub.app/](https://www.awarenesshub.app/)

![AwarenessHub Platform](https://github.com/user-attachments/assets/fb111fe3-f364-49c3-bc68-4974268a9e97)

## 📖 Overview

AwarenessHub is a comprehensive cybersecurity training platform designed to help individuals master cybersecurity through interactive learning. The platform offers hands-on training modules, real-world simulations, and comprehensive security assessments to develop practical security skills.

## ✨ Features

- **12+ Training Modules** - Comprehensive training from basics to advanced cybersecurity concepts
- **Interactive Challenges** - Real-world scenarios and hands-on practice exercises
- **Live Simulations** - Phishing, SMS, and email threat simulations for practical experience
- **Progress Tracking** - Badges, leaderboards, and achievement system to track your learning journey
- **DFIR Training** - Digital Forensics and Incident Response modules
- **Security Tools** - Comprehensive security tools training and practice
- **Mobile Support** - Native Android app built with Capacitor

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Shadcn/UI** - Re-usable component library

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Mobile
- **Capacitor** - Cross-platform native runtime
- **Android** - Native Android deployment

### Additional Libraries
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **date-fns** - Date utility library

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **pnpm** - Fast, disk space efficient package manager

### Deployment
- **Vercel** - Frontend hosting and serverless functions
- **Vercel Functions** - API endpoints

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AwarenessHub-NOV1.git
cd AwarenessHub-NOV1
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
pnpm build
```

### Android Development

```bash
# Build and sync Android
pnpm android:build

# Open Android Studio
pnpm android:open

# Run on Android device
pnpm android:run
```

## 📱 Features in Detail

### Training Modules
Comprehensive cybersecurity training covering:
- Fundamentals of cybersecurity
- Network security
- Malware analysis
- Incident response
- Social engineering
- And more...

### Interactive Simulations
- Real-world phishing scenarios
- SMS threat simulations
- Email security challenges
- Hands-on security tool practice

### Progress Tracking
- Achievement badges
- Global leaderboard
- Personal progress dashboard
- Completion certificates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For support or inquiries: **support@Awarenesshub.app**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

**Built with ❤️ for the cybersecurity community**
