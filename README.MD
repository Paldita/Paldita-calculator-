<div align="center">

<img src="src/assets/favicon.svg" alt="Paldita Calculator Logo" width="120" />

# Paldita Calculator

### A modern, open-source calculator crafted with Angular, TypeScript, and SCSS.

Beautiful glassmorphism • Scientific calculations • Animated themes • Memory • History • Easter eggs • Responsive design

<br>

![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success?style=for-the-badge)

*A calculator that focuses equally on delightful interactions, polished visuals, and practical everyday functionality.*

</div>

---

# Overview

**Paldita Calculator** is a modern calculator built with **Angular**, combining a premium glassmorphism interface with a feature-rich scientific calculator and highly polished UI animations.

Rather than being a basic calculator, Paldita emphasizes **micro-interactions**, **responsive animations**, **dynamic themes**, and **playful hidden surprises** while remaining fast, lightweight, and intuitive.

The application persists user preferences—including theme, memory values, and calculation history—using the browser's **localStorage**, ensuring a seamless experience across sessions.

---

# Features

## 🎨 Dynamic Theme Experience

Unlike a traditional dark mode toggle, Paldita transforms the entire application through an animated visual story.

### Theme Story Sequence

Switching themes triggers an animated sequence where:

- A miniature painter character drops onto the screen.
- The painter paints a rotating Sun/Moon medallion.
- The background floods from the exact point the user tapped.
- Theme colors transition smoothly across the interface.
- A contextual greeting appears:
  - **Good Morning**
  - **Good Night**
- Every sound effect is synthesized live using the **Web Audio API**.
- No external audio files are included.

### Day Theme

- Flying birds animation
- Soft synthesized bird chirps
- Bright lighting
- Warm color palette

### Night Theme

- Falling stars animation
- Ambient night chime
- Persistent twinkling star field
- Deep blue atmosphere

---

# Premium Glassmorphism

The interface uses several visual layers to create a premium glass effect.

- Multi-layer backdrop blur
- Saturation filtering
- Animated light reflections
- SVG grain texture overlay
- Smooth depth shadows
- Floating interface cards
- Animated highlights

---

# Calculator Features

## Standard Operations

- Addition
- Subtraction
- Multiplication
- Division
- Percentage
- Decimal calculations
- Parentheses
- Sign toggle (±)

## Scientific Operations

- Square (x²)
- Reciprocal (1/x)
- Power (xʸ)
- Square root (√)
- Factorial (n!)
- Sine
- Cosine
- Tangent
- Natural logarithm (ln)
- Common logarithm (log)
- π Constant

---

# Memory Functions

Supports complete calculator memory operations.

- Memory Clear (MC)
- Memory Recall (MR)
- Memory Add (M+)
- Memory Subtract (M−)

Memory values remain available between sessions through **localStorage**.

---

# Calculation History

Every completed calculation is automatically saved.

Features include:

- Persistent history
- Scrollable history panel
- Quick review of previous calculations
- Automatic browser persistence

---

# Clipboard Support

Tap the calculator result to instantly copy it to your clipboard.

A lightweight confirmation toast appears after every successful copy.

---

# Typography

Paldita combines multiple typefaces to improve readability and personality.

| Font | Purpose |
|------|----------|
| Outfit | User Interface |
| JetBrains Mono | Calculator Display |
| Fraunces Italic | Branding & Story Banners |

---

# Branding

The application includes custom Paldita branding.

- Gem logo
- Wordmark
- Matching browser favicon
- Branded easter egg animation
- Signature jingle

---

# Animations

Animations are powered using Angular's animation framework.

Highlights include:

- Digit-by-digit display animation
- Painter entrance
- Banner transitions
- Theme flood animation
- Button press animations
- Hover spring effects
- Animated reflections

---

# Mobile Experience

Paldita is designed for touch devices.

Features include:

- Responsive layouts
- Large touch targets
- Mobile-friendly spacing
- Touch animations
- Light haptic feedback using `navigator.vibrate()` where supported

---

# Easter Eggs

## 🎉 Konami Code

Desktop users can unlock a hidden celebration by entering:

```text
↑ ↑ ↓ ↓ ← → ← → B A
```

Mobile users can activate the exact same surprise by tapping the Paldita logo **five times** quickly.

Unlocked effects include:

- Confetti
- Celebration animation
- Hidden interactions

---

## ✨ Paldita Secret

Press and hold the **Paldita** wordmark for approximately one second.

This activates:

- Sparkle shower
- Four-note signature jingle
- Golden "=" button glow

This easter egg is unique to Paldita and independent of the Konami sequence.

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| Angular | Frontend Framework |
| TypeScript | Application Logic |
| SCSS / CSS | Styling |
| RxJS | Reactive Programming |
| Angular Animations | Motion System |
| Web Audio API | Runtime Sound Synthesis |
| Clipboard API | Copy Results |
| Local Storage API | Persistent State |

---

# Persistence

The following data is automatically stored:

- Theme
- Memory value
- Calculation history

Everything is stored locally inside the browser using:

```text
localStorage
```

No user data is sent to any external server.

---

# Run Locally

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm start
```

Open:

```
http://localhost:4200
```

---

# Production Build

```bash
npm install
npm run build
```

Production files are generated in:

```text
dist/calculator/browser
```

---

# Deploy to Vercel

## Using the CLI

```bash
npm install -g vercel
vercel
```

The included `vercel.json` automatically configures:

- Build command
- Output directory
- Framework settings

No additional configuration is required.

---

## Using GitHub

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Deploy.

Vercel automatically reads the provided configuration.

---

# Project Structure

```text
paldita-calculator/
│
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.config.ts
│   │
│   ├── assets/
│   │   └── favicon.svg
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── vercel.json
├── LICENSE
└── README.md
```

---

# Browser Support

- Google Chrome
- Microsoft Edge
- Firefox
- Safari
- Brave
- Opera

---

# License

This project is licensed under the **MIT License**.

See the **LICENSE** file for more information.

---

<div align="center">

**Built with Angular ❤️ by Paldita**

Crafted with attention to animation, interaction, and user experience.

⭐ If you enjoy this project, consider giving it a star on GitHub.

</div>├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   ├── app.component.*
│   │   └── app.config.ts
│   │
│   ├── assets/
│   │   ├── icons/
│   │   ├── sounds/
│   │   └── favicon.svg
│   │
│   ├── styles/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
│
├── public/
├── angular.json
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/paldita-calculator.git
```

## Navigate to the project

```bash
cd paldita-calculator
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
ng serve
```

Open your browser:

```
http://localhost:4200
```

---

# Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `ng serve` | Start development server |
| `ng build` | Production build |
| `ng test` | Run unit tests |
| `ng lint` | Lint source code |

---

# Build

Development

```bash
ng build
```

Production

```bash
ng build --configuration production
```

The compiled files are generated inside the `dist/` directory.

---

# Browser Support

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari
- Brave
- Opera

---

# Performance

- Fast startup
- Lazy Angular rendering
- Optimized bundle generation
- Responsive interactions
- Lightweight architecture
- Mobile optimized

---

# Keyboard Shortcuts

| Key | Action |
|------|--------|
| `0-9` | Enter number |
| `+ - × ÷` | Arithmetic operations |
| `Enter` | Calculate |
| `Backspace` | Delete last character |
| `Escape` | Clear calculator |
| `.` | Decimal point |

---

# Roadmap

- [ ] Unit Converter
- [ ] Currency Converter
- [ ] Calculator Themes
- [ ] More Scientific Functions
- [ ] Graphing Calculator
- [ ] PWA Support
- [ ] Offline Mode
- [ ] Internationalization (i18n)

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

Please follow the project's coding style and keep pull requests focused on a single feature or fix.

---

# License

This project is licensed under the **MIT License**.

See the `LICENSE` file for complete license information.

---

<div align="center">

**Built with ❤️ using Angular & TypeScript**

If you find this project useful, consider giving it a ⭐ on GitHub.

</div>
