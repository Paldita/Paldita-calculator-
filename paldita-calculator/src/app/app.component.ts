import { CommonModule } from '@angular/common';
import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  HostListener,
  OnInit,
} from '@angular/core';

interface HistoryEntry {
  expr: string;
  result: string;
}

interface AmbientStar {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

interface TransientItem {
  id: number;
  left: string;
  duration: number;
  color?: string;
  top?: number;
  symbol?: string;
  drift?: string;
}

type Theme = 'light' | 'dark';

const THEME_COLORS: Record<Theme, { a: string; b: string }> = {
  light: { a: '#EDE7DA', b: '#E1D9C4' },
  dark: { a: '#1b1826', b: '#0e0c14' },
};

const STORAGE_KEYS = {
  theme: 'calc-theme',
  history: 'calc-history',
  memory: 'calc-memory',
};

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const CONFETTI_PALETTE = ['#c9b788', '#e8ded0', '#8a7a4f', '#2b2a2f', '#d8cdb0'];

// ---------- Paldita signature easter egg ----------
const SPARKLE_GLYPHS = ['✨', '💎', '⭐', '🍬'];
const LOGO_TAP_TARGET = 5; // taps required on the logo mark to unlock the Konami secret on touch devices
const LOGO_TAP_WINDOW = 1600; // ms window the taps must land inside
const BRAND_PRESS_HOLD = 850; // ms hold on the wordmark to unlock the Paldita surprise

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  animations: [
    trigger('bannerAnim', [
      transition(':enter', [
        style({ transform: 'translate(-50%, -60px)', opacity: 0 }),
        animate('480ms cubic-bezier(0.16,1,0.3,1)', style({ transform: 'translate(-50%, 0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('380ms ease-in', style({ transform: 'translate(-50%, -60px)', opacity: 0 })),
      ]),
    ]),
    trigger('painterAnim', [
      transition(':enter', [
        style({ transform: 'translateY(-160px) rotate(-12deg)', opacity: 0 }),
        animate('650ms cubic-bezier(0.34,1.4,0.64,1)', style({ transform: 'translateY(0) rotate(0deg)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'translateY(-170px) rotate(10deg)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  // ---------- Core calculator state ----------
  currentValue = '0';
  previousValue = '';
  operator: string | null = null;
  resetNext = false;

  memory = 0;
  historyData: HistoryEntry[] = [];
  historyLine = '';
  changeTick = 0;

  sciOpen = false;
  memRowOpen = false;
  histOpen = false;
  theme: Theme = 'light';

  showToast = false;
  toastMsg = '';

  // ---------- Ambient background ----------
  orb1Transform = '';
  orb2Transform = '';
  orb3Transform = '';
  private readonly orbFactors = [18, -14, 10];
  ambientStars: AmbientStar[] = [];

  // ---------- Theme story overlay ----------
  painterVisible = false;
  medallionVisible = false;
  medallionFlipped = false;
  birds: TransientItem[] = [];
  fallingStars: TransientItem[] = [];
  bannerVisible = false;
  bannerText = '';
  private idCounter = 0;

  // ---------- Easter egg: Konami (keyboard) ----------
  confetti: TransientItem[] = [];
  secretActive = false;
  private konamiBuffer: string[] = [];

  // ---------- Easter egg: logo multi-tap (touch/mobile-friendly alias for Konami) ----------
  private logoTapTimes: number[] = [];

  // ---------- Easter egg: Paldita signature surprise (long-press, mouse + touch) ----------
  sparkles: TransientItem[] = [];
  palditaActive = false;
  private pressTimer: ReturnType<typeof setTimeout> | null = null;
  private pressFired = false;

  private audioCtx: AudioContext | null = null;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.theme = savedTheme;
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark';
    }
    document.documentElement.setAttribute('data-theme', this.theme);

    const savedHistory = localStorage.getItem(STORAGE_KEYS.history);
    if (savedHistory) {
      try { this.historyData = JSON.parse(savedHistory); } catch { this.historyData = []; }
    }

    const savedMemory = localStorage.getItem(STORAGE_KEYS.memory);
    if (savedMemory) this.memory = parseFloat(savedMemory) || 0;

    this.ambientStars = Array.from({ length: 45 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      size: Math.random() < 0.8 ? 2 : 3,
      duration: 2000 + Math.random() * 3000,
      delay: Math.random() * 3000,
    }));
  }

  // ---------- Derived display ----------
  get displayValue(): string {
    return this.formatNumber(this.currentValue);
  }

  get displayChars(): { ch: string; key: string; delay: number }[] {
    const val = this.displayValue;
    const len = val.length;
    return val.split('').map((ch, i) => ({
      ch,
      key: `${this.changeTick}-${i}`,
      delay: (len - 1 - i) * 18,
    }));
  }

  trackByChar(_i: number, item: { key: string }): string {
    return item.key;
  }

  formatNumber(str: string): string {
    if (str === 'Error' || str === '' || str === undefined) return str;
    const neg = str.startsWith('-');
    if (neg) str = str.slice(1);
    let [intPart, decPart] = str.split('.');
    if (intPart === '') intPart = '0';
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let result = withCommas;
    if (decPart !== undefined) result += '.' + decPart;
    return (neg ? '-' : '') + result;
  }

  private bump(): void {
    this.changeTick++;
  }

  // ---------- Toggles ----------
  toggleSci(): void { this.sciOpen = !this.sciOpen; }
  toggleMemRow(): void { this.memRowOpen = !this.memRowOpen; }
  toggleHistory(): void { this.histOpen = !this.histOpen; }

  // ---------- Copy to clipboard ----------
  copyValue(): void {
    if (this.histOpen) return;
    navigator.clipboard?.writeText(this.currentValue).then(() => {
      this.toastMsg = 'Copied';
      this.showToast = true;
      setTimeout(() => (this.showToast = false), 1100);
    }).catch(() => {});
  }

  // ---------- Theme: painter story + circular flood ----------
  toggleTheme(e: MouseEvent): void {
    const target: Theme = this.theme === 'dark' ? 'light' : 'dark';
    this.runThemeStory(e.clientX, e.clientY, target);
  }

  private runThemeStory(x: number, y: number, target: Theme): void {
    // 1. Painter falls in
    this.painterVisible = true;

    // 2. Medallion appears, painter "paints" it, flood-fills the real UI
    setTimeout(() => {
      this.medallionVisible = true;
      this.playSwish();
    }, 380);

    setTimeout(() => {
      this.medallionFlipped = target === 'dark';
      this.runColorFlood(x, y, target);
    }, 560);

    // 3. Aftermath: birds + morning banner, or stars + night banner
    setTimeout(() => {
      if (target === 'dark') {
        this.spawnFallingStars();
        this.playChime();
        this.showStoryBanner('Good night');
      } else {
        this.spawnBirds();
        this.playChirp();
        this.showStoryBanner('Good morning');
      }
    }, 1150);

    // 4. Painter leaves, medallion fades
    setTimeout(() => {
      this.painterVisible = false;
      this.medallionVisible = false;
    }, 2500);
    setTimeout(() => { this.medallionFlipped = false; }, 3100);
  }

  private runColorFlood(x: number, y: number, target: Theme): void {
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.setProperty('--flood-a', THEME_COLORS[target].a);
    overlay.style.setProperty('--flood-b', THEME_COLORS[target].b);
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    document.body.appendChild(overlay);

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    ) * 1.05;

    requestAnimationFrame(() => {
      overlay.style.transition = 'clip-path 0.65s cubic-bezier(.65,0,.35,1)';
      overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;
    });

    setTimeout(() => {
      this.theme = target;
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem(STORAGE_KEYS.theme, target);
    }, 300);

    setTimeout(() => {
      overlay.style.transition = 'opacity 0.4s ease';
      overlay.style.opacity = '0';
    }, 620);
    setTimeout(() => overlay.remove(), 1050);
  }

  private showStoryBanner(text: string): void {
    this.bannerText = text;
    this.bannerVisible = true;
    setTimeout(() => (this.bannerVisible = false), 2000);
  }

  private spawnBirds(): void {
    for (let i = 0; i < 2; i++) {
      const id = this.idCounter++;
      const item: TransientItem = {
        id,
        left: '',
        top: 40 + Math.random() * 60 + i * 30,
        duration: 2200 + Math.random() * 600,
      };
      this.birds.push(item);
      setTimeout(() => {
        this.birds = this.birds.filter((b) => b.id !== id);
      }, item.duration + 100);
    }
  }

  private spawnFallingStars(): void {
    for (let i = 0; i < 14; i++) {
      const id = this.idCounter++;
      const item: TransientItem = {
        id,
        left: `${Math.random() * 100}%`,
        duration: 900 + Math.random() * 700,
      };
      setTimeout(() => {
        this.fallingStars.push(item);
        setTimeout(() => {
          this.fallingStars = this.fallingStars.filter((s) => s.id !== id);
        }, item.duration + 100);
      }, i * 70);
    }
  }

  // ---------- Web Audio synthesis (no external sound files) ----------
  private ctx(): AudioContext {
    if (!this.audioCtx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new Ctor();
    }
    return this.audioCtx;
  }

  private playTone(freq: number, duration: number, delay = 0, type: OscillatorType = 'sine', volume = 0.15): void {
    try {
      const ctx = this.ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.05);
    } catch { /* audio unsupported or blocked — fail silently */ }
  }

  private playChirp(): void {
    this.playTone(2200, 0.12, 0, 'sine', 0.1);
    this.playTone(2700, 0.12, 0.15, 'sine', 0.1);
    this.playTone(2400, 0.1, 0.32, 'sine', 0.08);
  }

  private playChime(): void {
    this.playTone(660, 1.1, 0, 'sine', 0.09);
    this.playTone(990, 1.0, 0.05, 'sine', 0.05);
  }

  private playSwish(): void {
    try {
      const ctx = this.ctx();
      const bufferSize = Math.floor(ctx.sampleRate * 0.3);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      const gain = ctx.createGain();
      gain.gain.value = 0.15;
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
    } catch { /* fail silently */ }
  }

  // ---------- Core calculator logic ----------
  appendNumber(num: string): void {
    if (this.resetNext) { this.currentValue = '0'; this.resetNext = false; }
    if (num === '.' && this.currentValue.includes('.')) return;
    if (this.currentValue === '0' && num !== '.') this.currentValue = num;
    else this.currentValue += num;
    this.bump();
  }

  appendOperator(op: string): void {
    if (this.operator !== null) this.calculate();
    this.previousValue = `${this.formatNumber(this.currentValue)} ${op}`;
    this.operator = op;
    this.resetNext = true;
    this.bump();
  }

  private factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  insertPi(): void {
    this.currentValue = String(parseFloat(Math.PI.toFixed(8)));
    this.resetNext = false;
    this.bump();
  }

  applyFunc(fn: string): void {
    const val = parseFloat(this.currentValue);
    let result: number;
    let label = fn;
    switch (fn) {
      case 'sin': result = Math.sin((val * Math.PI) / 180); break;
      case 'cos': result = Math.cos((val * Math.PI) / 180); break;
      case 'tan': result = Math.tan((val * Math.PI) / 180); break;
      case 'sqrt': result = Math.sqrt(val); label = '√'; break;
      case 'log': result = Math.log10(val); break;
      case 'ln': result = Math.log(val); break;
      case 'fact': result = this.factorial(val); label = 'n!'; break;
      case 'sq': result = val * val; label = 'x²'; break;
      case 'recip': result = 1 / val; label = '1/x'; break;
      case 'neg': result = -val; label = '±'; break;
      default: return;
    }
    const expr = `${label}(${val})`;
    this.historyLine = expr;
    this.currentValue = isNaN(result) ? 'Error' : String(parseFloat(result.toFixed(8)));
    this.resetNext = true;
    this.pushHistory(expr, this.currentValue);
    this.bump();
  }

  calculate(): void {
    if (this.operator === null || this.resetNext) return;
    const prev = parseFloat(this.previousValue);
    const curr = parseFloat(this.currentValue);
    let result: number;

    switch (this.operator) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '×': result = prev * curr; break;
      case '÷': result = curr === 0 ? NaN : prev / curr; break;
      case '%': result = prev % curr; break;
      case '^': result = Math.pow(prev, curr); break;
      default: return;
    }

    const expr = `${this.previousValue} ${this.formatNumber(this.currentValue)}`;
    this.historyLine = `${expr} =`;
    this.previousValue = '';
    this.currentValue = isNaN(result) ? 'Error' : String(parseFloat(result.toFixed(8)));
    this.operator = null;
    this.resetNext = true;
    this.pushHistory(expr, this.currentValue);
    this.bump();
  }

  // ---------- History (persisted) ----------
  private pushHistory(expr: string, result: string): void {
    if (result === 'Error') return;
    this.historyData.unshift({ expr, result });
    if (this.historyData.length > 30) this.historyData.pop();
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(this.historyData));
  }

  reuseHistory(i: number): void {
    const h = this.historyData[i];
    this.currentValue = h.result;
    this.resetNext = true;
    this.histOpen = false;
    this.bump();
  }

  clearHistory(e: Event): void {
    e.stopPropagation();
    this.historyData = [];
    localStorage.removeItem(STORAGE_KEYS.history);
  }

  // ---------- Memory (persisted) ----------
  memClear(): void { this.memory = 0; localStorage.setItem(STORAGE_KEYS.memory, String(this.memory)); }
  memRecall(): void { this.currentValue = String(this.memory); this.resetNext = true; this.bump(); }
  memAdd(): void { this.memory += parseFloat(this.currentValue) || 0; localStorage.setItem(STORAGE_KEYS.memory, String(this.memory)); }
  memSub(): void { this.memory -= parseFloat(this.currentValue) || 0; localStorage.setItem(STORAGE_KEYS.memory, String(this.memory)); }

  clearAll(): void {
    this.currentValue = '0';
    this.previousValue = '';
    this.operator = null;
    this.resetNext = false;
    this.historyLine = '';
    this.bump();
  }

  deleteLast(): void {
    if (this.resetNext) return;
    this.currentValue = this.currentValue.length > 1 ? this.currentValue.slice(0, -1) : '0';
    this.bump();
  }

  // ---------- Ripple ----------
  ripple(e: MouseEvent): void {
    const btn = e.currentTarget as HTMLElement;
    btn.classList.remove('ripple');
    void btn.offsetWidth;
    btn.classList.add('ripple');
    this.vibrate(8);
  }

  // ---------- Parallax orbs ----------
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    this.orb1Transform = `translate(${dx * this.orbFactors[0]}px, ${dy * this.orbFactors[0]}px)`;
    this.orb2Transform = `translate(${dx * this.orbFactors[1]}px, ${dy * this.orbFactors[1]}px)`;
    this.orb3Transform = `translate(${dx * this.orbFactors[2]}px, ${dy * this.orbFactors[2]}px)`;
  }

  // ---------- Keyboard + Easter egg ----------
  @HostListener('window:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    this.checkKonami(e.key);

    if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
    else if (e.key === '.') this.appendNumber('.');
    else if (e.key === '+') this.appendOperator('+');
    else if (e.key === '-') this.appendOperator('-');
    else if (e.key === '*') this.appendOperator('×');
    else if (e.key === '/') { e.preventDefault(); this.appendOperator('÷'); }
    else if (e.key === '^') this.appendOperator('^');
    else if (e.key === 'Enter' || e.key === '=') this.calculate();
    else if (e.key === 'Backspace') this.deleteLast();
    else if (e.key === 'Escape') this.clearAll();
  }

  private checkKonami(key: string): void {
    this.konamiBuffer.push(key);
    if (this.konamiBuffer.length > KONAMI_CODE.length) this.konamiBuffer.shift();
    const matches = this.konamiBuffer.length === KONAMI_CODE.length &&
      this.konamiBuffer.every((k, i) => k === KONAMI_CODE[i]);
    if (matches) {
      this.konamiBuffer = [];
      this.triggerEasterEgg();
    }
  }

  private triggerEasterEgg(): void {
    this.secretActive = true;
    this.spawnConfetti(34);
    this.showStoryBanner('Secret unlocked');
    this.playChime();
    setTimeout(() => (this.secretActive = false), 5000);
  }

  private spawnConfetti(count: number): void {
    for (let i = 0; i < count; i++) {
      const id = this.idCounter++;
      const item: TransientItem = {
        id,
        left: `${Math.random() * 100}%`,
        duration: 1600 + Math.random() * 900,
        color: CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)],
      };
      setTimeout(() => {
        this.confetti.push(item);
        setTimeout(() => {
          this.confetti = this.confetti.filter((c) => c.id !== id);
        }, item.duration + 100);
      }, i * 25);
    }
  }

  // ---------- Easter egg access: logo multi-tap (no keyboard needed — works on phones) ----------
  // The Konami code needs arrow keys, which touch devices don't have. Tapping the
  // logo mark a handful of times in quick succession unlocks the exact same
  // confetti secret, so the egg is reachable on any device.
  onLogoTap(): void {
    const now = Date.now();
    this.logoTapTimes = this.logoTapTimes.filter((t) => now - t < LOGO_TAP_WINDOW);
    this.logoTapTimes.push(now);
    if (this.logoTapTimes.length >= LOGO_TAP_TARGET) {
      this.logoTapTimes = [];
      this.triggerEasterEgg();
    }
  }

  // ---------- Easter egg: Paldita signature surprise ----------
  // A brand-new hidden treat: press and hold the "Paldita" wordmark (mouse or
  // finger both work identically) to spill a shower of sparkles and hear a
  // little signature chime — Paldita's own calling card.
  onBrandPressStart(e: Event): void {
    if (e.cancelable) e.preventDefault();
    this.pressFired = false;
    this.clearPressTimer();
    this.pressTimer = setTimeout(() => {
      this.pressFired = true;
      this.triggerPalditaEgg();
    }, BRAND_PRESS_HOLD);
  }

  onBrandPressEnd(): void {
    this.clearPressTimer();
  }

  private clearPressTimer(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  private triggerPalditaEgg(): void {
    if (this.palditaActive) return;
    this.palditaActive = true;
    this.vibrate([12, 40, 12]);
    this.spawnSparkles(26);
    this.showStoryBanner('✨ Paldita says hi');
    this.playPalditaJingle();
    setTimeout(() => (this.palditaActive = false), 2600);
  }

  private spawnSparkles(count: number): void {
    for (let i = 0; i < count; i++) {
      const id = this.idCounter++;
      const item: TransientItem = {
        id,
        left: `${Math.random() * 100}%`,
        duration: 1500 + Math.random() * 1100,
        symbol: SPARKLE_GLYPHS[Math.floor(Math.random() * SPARKLE_GLYPHS.length)],
        drift: `${(Math.random() * 80 - 40).toFixed(0)}px`,
      };
      setTimeout(() => {
        this.sparkles.push(item);
        setTimeout(() => {
          this.sparkles = this.sparkles.filter((s) => s.id !== id);
        }, item.duration + 100);
      }, i * 30);
    }
  }

  // A small ascending arpeggio — a distinct signature jingle, separate from
  // the day/night chime and chirp used elsewhere in the app.
  private playPalditaJingle(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => this.playTone(freq, 0.22, i * 0.09, 'triangle', 0.1));
  }

  // ---------- Haptics (touch devices only; silently ignored elsewhere) ----------
  private vibrate(pattern: number | number[]): void {
    try { navigator.vibrate?.(pattern); } catch { /* unsupported — ignore */ }
  }
}
