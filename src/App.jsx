import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code,
  Eye,
  FolderGit2,
  Gamepad2,
  GraduationCap,
  List,
  Mail,
  MapPin,
  MessageSquare,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import {
  SiBun,
  SiCss,
  SiDart,
  SiDiscord,
  SiExpress,
  SiFastapi,
  SiFlutter,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNuxt,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSteam,
  SiSupabase,
  SiTailwindcss,
  SiVite,
  SiVuedotjs,
} from "react-icons/si";

const techIconMap = {
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "Vue": SiVuedotjs,
  "Nuxt.js": SiNuxt,
  "JavaScript": SiJavascript,
  "HTML": SiHtml5,
  "CSS": SiCss,
  "Tailwind CSS": SiTailwindcss,
  "Vite": SiVite,
  "Node.js": SiNodedotjs,
  "Bun": SiBun,
  "Express": SiExpress,
  "PostgreSQL": SiPostgresql,
  "MySQL": SiMysql,
  "MongoDB": SiMongodb,
  "Supabase": SiSupabase,
  "Python": SiPython,
  "PHP": SiPhp,
  "Go": SiGo,
  "FastAPI": SiFastapi,
  "Flutter": SiFlutter,
  "Dart": SiDart,
  "Machine Learning": Brain,
  "Deep Learning": Brain,
  "Computer Vision": Eye,
  "OpenClaw": Bot,
  "Assistant Design": Sparkles,
  "Turbopack": Zap,
};

const stackGroups = [
  {
    name: "Frontend",
    items: ["React", "Next.js", "Vue", "Nuxt.js", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Vite"],
  },
  {
    name: "Backend",
    items: ["Node.js", "Bun", "Express", "ElysiaJS", "Python", "FastAPI", "PHP", "Go"],
  },
  {
    name: "Database",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"],
  },
  {
    name: "AI / ML",
    items: ["Machine Learning", "Deep Learning", "Computer Vision", "OpenClaw", "Assistant Design"],
  },
  {
    name: "Other",
    items: ["Flutter", "Dart", "Turbopack"],
  },
];

const strengths = [
  "Fast adaptation across tools and domains",
  "Comfortable working solo or inside a team",
  "Research-first mindset with production follow-through",
];

const focusAreas = [
  {
    title: "AI R&D",
    body: "Machine learning, deep learning, experimentation, and implementation aimed at usable outcomes.",
    icon: Brain,
  },
  {
    title: "Fullstack Delivery",
    body: "Interfaces, backend services, APIs, and working systems delivered with practical engineering discipline.",
    icon: Code,
  },
  {
    title: "Operational Assistants",
    body: "Chatbot logic, helpdesk automation, and AI flows designed for live support environments.",
    icon: Workflow,
  },
];

const timeline = [
  {
    label: "Experience",
    title: "Fullstack Web",
    body: "Building product interfaces and backend-connected systems with a practical shipping mindset.",
    icon: Briefcase,
  },
  {
    label: "Experience",
    title: "R&D AI, Machine Learning, Deep Learning",
    body: "Working across research, prototyping, model-oriented workflows, and implementation.",
    icon: Brain,
  },
  {
    label: "Education",
    title: "Informatics · Universitas Nasional",
    body: "Academic base supporting software engineering and applied AI exploration.",
    icon: GraduationCap,
  },
];

const projects = [
  {
    name: "InsightFace — Attendance & Recognition",
    tag: "Computer Vision · Private",
    summary:
      "Sistem absensi otomatis berbasis face recognition menggunakan CCTV dan InsightFace (512-dimensi). Anti-spoofing, dual camera RTSP, auto-reconnect watchdog, attendance logging, dan web interface realtime.",
    detail:
      "Versi PTI-Absensi adalah monorepo: backend FastAPI, web React + Vite, dan mobile Expo React Native — digunakan operasional nyata di lingkungan institutional.",
    stack: ["Python", "InsightFace", "FastAPI", "Flask", "OpenCV", "React", "Expo", "PostgreSQL"],
    image: "/projects/testing1.jpg",
    highlight: true,
    link: null,
    private: true,
  },
  {
    name: "Lady Lunaria Eldharia",
    tag: "AI Identity System",
    summary:
      "A personality-driven assistant system that combines identity consistency, practical utility, and operator-facing interaction.",
    detail:
      "Presented here through the Clawbot visual layer, Lunaria is the public AI face that turns assistant behavior into something memorable and usable.",
    stack: ["OpenClaw", "Assistant Design", "Automation", "Discord"],
    image: "/projects/clawbot-avatar.svg",
    highlight: false,
    link: null,
    private: false,
  },
  {
    name: "EZVIZ Camera Monitoring",
    tag: "Python Desktop · CCTV",
    summary:
      "Aplikasi desktop Python untuk monitoring dan controlling kamera EZVIZ dengan live RTSP streaming, PTZ, alarm, snapshot, IR LED, dan privacy mode.",
    detail:
      "Dibangun dengan pyezvizapi, customtkinter, dan opencv-python. Cross-platform, keamanan login berbasis sesi.",
    stack: ["Python", "OpenCV", "customtkinter", "pyezvizapi"],
    image: "/projects/ezviz-preview.svg",
    highlight: false,
    link: "https://github.com/AdrianTriSetiawan/EZVIZ-Camera-Controling-and-Monitoring",
    private: false,
  },
  {
    name: "Procurement Charting Suite",
    tag: "Vue 3 · Private Dashboard",
    summary:
      "Suite charting untuk visualisasi data procurement pabrik gula. Frontend Vue 3 + Vite, backend Node.js + Express + PostgreSQL.",
    detail:
      "Dashboard builder, charting, data source manager, export PNG/CSV. Digunakan internal untuk kebutuhan pabrik manufaktur.",
    stack: ["Vue 3", "Vite", "Node.js", "Express", "PostgreSQL"],
    image: "/projects/procurement-preview.svg",
    highlight: false,
    link: null,
    private: true,
  },
  {
    name: "ASTREAM — Anime Streaming",
    tag: "Web App · Public",
    summary:
      "Website streaming anime tanpa iklan menggunakan Consumet API dan gogoanime provider. Live di Cloudflare Pages.",
    detail:
      "Dibangun hanya dengan HTML, CSS, dan JavaScript murni tanpa framework. Live di astream.pages.dev.",
    stack: ["HTML", "CSS", "JavaScript", "Consumet API"],
    image: "/projects/astream-preview.svg",
    highlight: false,
    link: "https://github.com/AdrianTriSetiawan/Anime-Stream",
    private: false,
  },
  {
    name: "VS Code Extensions",
    tag: "Developer Tools · TypeScript",
    summary:
      "4 VS Code extensions: env-bridge, k8s-port-forward-profiles, trustlens, dan Bubblegums theme — semua tersedia publik.",
    detail:
      "env-bridge sync .env ke launch.json/tasks.json. k8s-port-forward manage kubectl dari sidebar. trustlens scan risk extension. Bubblegums adalah dark theme pink/purple.",
    stack: ["TypeScript", "VS Code API", "Node.js"],
    image: "/projects/clawbot-avatar.svg",
    highlight: false,
    link: "https://github.com/AdrianTriSetiawan/",
    private: false,
  },
];

const contactLinks = [
  {
    label: "Email",
    value: "adriansetiawan26@gmail.com",
    href: "mailto:adriansetiawan26@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/AdrianTriSetiawan",
    href: "https://github.com/AdrianTriSetiawan/",
    icon: FolderGit2,
  },
  {
    label: "Steam",
    value: "finnngck",
    href: "https://steamcommunity.com/id/finnngck/",
    icon: SiSteam,
  },
  {
    label: "Discord",
    value: "luzwellsclauka",
    href: null,
    icon: SiDiscord,
  },
];

const tocSections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "tech", label: "Skills & Stack" },
  { id: "ai", label: "AI Guide" },
  { id: "contact", label: "Contact" },
];

const fallbackAgent = {
  displayName: "Lady Lunaria Eldharia",
  publicRole: "Portfolio guide for Adrian Tri Setiawan",
  persona: {
    publicStyle:
      "For this portfolio, Lunaria acts as Adrian's website guide. She stays warm and elegant, but remains focused on Adrian's work and profile context.",
  },
};

const starterPrompts = [
  "Who are you, Lunaria?",
  "Summarize Adrian",
  "Tell me about PIRA",
  "Explain Recognition CCTV",
  "How can I contact Adrian?",
];

const initialMessages = [
  {
    role: "assistant",
    text:
      "I am Lady Lunaria Eldharia, Adrian's portfolio guide. Ask me about his profile, projects, strengths, or contact details.",
  },
];

const heroRoles = [
  "Fullstack Engineer",
  "AI R&D Builder",
  "OpenClaw + CV Operator",
];

function ClawbotAvatar({ size = "h-12 w-12", className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-cyan-200/15 bg-[#0c1114] shadow-[0_10px_30px_rgba(0,0,0,0.25)] ${size} ${className}`}
    >
      <img
        src="/projects/clawbot-avatar.svg"
        alt="Clawbot visual avatar"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function AnimatedSection({ children, delay = 0, className = "" }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, filter: "blur(6px)" }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@_-";

function useScramble(target, { duration = 900, stagger = 30 } = {}) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef(null);

  useEffect(() => {
    let start = null;
    const len = target.length;

    function tick(now) {
      if (!start) start = now;
      const elapsed = now - start;
      const revealed = Math.min(len, Math.floor((elapsed / duration) * len));
      let result = "";
      for (let i = 0; i < len; i++) {
        if (i < revealed) {
          result += target[i];
        } else if (i < revealed + 4) {
          result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        } else {
          result += target[i];
        }
      }
      setDisplay(result);
      if (revealed < len) frameRef.current = requestAnimationFrame(tick);
      else setDisplay(target);
    }

    const delay = setTimeout(() => {
      frameRef.current = requestAnimationFrame(tick);
    }, stagger);

    return () => {
      clearTimeout(delay);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, stagger]);

  return display;
}

const wordVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StaggeredWords({ text, className = "" }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          custom={i}
          variants={wordVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function useTypewriterRotation(
  roles,
  {
    typeSpeed = 75,
    deleteSpeed = 48,
    pauseAfterType = 1800,
    pauseAfterDelete = 260,
  } = {},
) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState(roles[0] ?? "");
  const [isDeleting, setIsDeleting] = useState(false);
  const currentRole = roles[roleIndex] ?? "";

  useEffect(() => {
    let timeoutId;

    if (!isDeleting && displayText === currentRole) {
      timeoutId = window.setTimeout(() => setIsDeleting(true), pauseAfterType);
    } else if (isDeleting && displayText === "") {
      timeoutId = window.setTimeout(() => {
        setRoleIndex((index) => (index + 1) % roles.length);
        setIsDeleting(false);
      }, pauseAfterDelete);
    } else if (isDeleting) {
      timeoutId = window.setTimeout(() => {
        setDisplayText((text) => text.slice(0, -1));
      }, deleteSpeed);
    } else {
      timeoutId = window.setTimeout(() => {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
      }, typeSpeed);
    }

    return () => window.clearTimeout(timeoutId);
  }, [
    currentRole,
    deleteSpeed,
    displayText,
    isDeleting,
    pauseAfterDelete,
    pauseAfterType,
    roles.length,
    typeSpeed,
  ]);

  return { roleText: displayText, roleIndex };
}

function TypingIndicator({ elapsed, size = "md" }) {
  const isSmall = size === "sm";
  return (
    <div className="flex flex-row gap-2">
      <ClawbotAvatar size={isSmall ? "h-6 w-6" : "h-8 w-8"} className="mt-1 shrink-0 rounded-xl" />
      <div className={`rounded-2xl rounded-tl-none border border-primary/20 bg-primary/10 ${isSmall ? "px-3 py-2" : "px-4 py-3"}`}>
        <div className="flex items-center gap-2">
          <span className="typing-dot inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="typing-dot inline-block h-2 w-2 rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
          <span className="typing-dot inline-block h-2 w-2 rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
          {elapsed >= 3 && (
            <span className="ml-1 font-mono text-xs text-muted-foreground">{elapsed}s</span>
          )}
        </div>
        <p className={`mt-1 text-muted-foreground ${isSmall ? "text-[10px]" : "text-xs"}`}>
          Lunaria is typing…
        </p>
      </div>
    </div>
  );
}

function HomeToc({ sections, activeId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-[max(1rem,calc(50%-46rem))] top-24 z-30 hidden w-44 2xl:block"
      >
        <nav className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Contents</p>
          <ul className="mt-4 space-y-1">
            {sections.map((section) => {
              const active = activeId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition ${
                      active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-border"}`} />
                    <span>{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.aside>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-6 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg 2xl:hidden"
        aria-label="Toggle contents"
      >
        <List className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm 2xl:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="fixed bottom-20 left-5 z-50 w-64 rounded-2xl border border-border bg-card p-4 shadow-xl 2xl:hidden"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Contents</p>
              <ul className="mt-4 space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition ${
                        activeId === section.id
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          activeId === section.id ? "bg-primary" : "bg-border"
                        }`}
                      />
                      <span>{section.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function SectionHeader({ icon: Icon, title, body, action = null }) {
  return (
    <div className="mb-12 flex items-start justify-between gap-4">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-theme-10 text-primary ring-1 ring-primary/20">
            <Icon className="h-5 w-5" />
          </span>
          <div className="h-px w-10 rounded-full bg-gradient-theme opacity-60" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">{body}</p>
      </div>
      {action}
    </div>
  );
}

function GridSnakes() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext("2d");
    const grid = 24;
    const snakeCount = 3;
    const snakeLength = 8;
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const cols = () => Math.floor(canvas.width / grid);
    const rows = () => Math.floor(canvas.height / grid);

    const snakes = Array.from({ length: snakeCount }, () => {
      const x = Math.floor(Math.random() * cols());
      const y = Math.floor(Math.random() * rows());
      return { trail: [[x, y]], dir: directions[Math.floor(Math.random() * 4)] };
    });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const snake of snakes) {
        if (Math.random() < 0.3) {
          snake.dir = directions[Math.floor(Math.random() * 4)];
        }

        const [hx, hy] = snake.trail[snake.trail.length - 1];
        let nx = hx + snake.dir[0];
        let ny = hy + snake.dir[1];

        if (nx < 0) nx = cols() - 1;
        if (nx >= cols()) nx = 0;
        if (ny < 0) ny = rows() - 1;
        if (ny >= rows()) ny = 0;

        snake.trail.push([nx, ny]);
        if (snake.trail.length > snakeLength) snake.trail.shift();

        snake.trail.forEach(([gx, gy], index) => {
          const alpha = ((index + 1) / snake.trail.length) * 0.45;
          ctx.beginPath();
          ctx.arc(gx * grid + grid / 2, gy * grid + grid / 2, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 214, 255, ${alpha})`;
          ctx.fill();
        });
      }
    };

    const interval = setInterval(tick, 180);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1]" />;
}

function App() {
  const [agent, setAgent] = useState(fallbackAgent);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [typingElapsed, setTypingElapsed] = useState(0);
  const [gatewayState, setGatewayState] = useState("checking");
  const [chatSource, setChatSource] = useState("connecting");
  const [visitorSessionId, setVisitorSessionId] = useState("");
  const [activeSection, setActiveSection] = useState("about");
  const latestMessages = useMemo(() => messages.slice(-4), [messages]);
  const typingTimerRef = useRef(null);
  const streamingIndexRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { roleText, roleIndex } = useTypewriterRotation(heroRoles);
  const scrambledName = useScramble("@AdrianTriSetiawan", { duration: 1200, stagger: 400 });

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    const storageKey = "adrian-portfolio-chat-session";
    let sessionId = window.localStorage.getItem(storageKey);
    if (!sessionId) {
      sessionId = `portfolio-${crypto.randomUUID()}`;
      window.localStorage.setItem(storageKey, sessionId);
    }
    setVisitorSessionId(sessionId);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAgent() {
      try {
        const response = await fetch("/agents/portfolio-agent.json", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && data && typeof data === "object") {
          setAgent((current) => ({ ...current, ...data }));
        }
      } catch (_error) {
        // Keep fallback.
      }
    }

    loadAgent();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadHealth() {
      try {
        const response = await fetch("/api/health", { cache: "no-store" });
        if (!response.ok) throw new Error("health failed");
        const data = await response.json();
        if (!cancelled) {
          setGatewayState(data.gateway === "live" ? "live" : "degraded");
          setChatSource(data.agentId ? "website-subagent" : "fallback");
        }
      } catch (_error) {
        if (!cancelled) {
          setGatewayState("degraded");
          setChatSource("fallback");
        }
      }
    }

    loadHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function updateActiveSection() {
      const threshold = window.innerHeight * 0.4;
      let current = tocSections[0].id;
      for (const section of tocSections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= threshold) {
          current = section.id;
        }
      }
      setActiveSection(current);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  async function submitQuestion(question) {
    const trimmed = question.trim();
    if (!trimmed || isTyping) return;

    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setChatOpen(true);
    setIsTyping(true);
    setTypingElapsed(0);

    typingTimerRef.current = setInterval(() => {
      setTypingElapsed((s) => s + 1);
    }, 1000);

    streamingIndexRef.current = null;

    try {
      const response = await fetch("/api/portfolio-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId: visitorSessionId }),
      });
      if (!response.ok) throw new Error("chat failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop();

        for (const part of parts) {
          const eventMatch = part.match(/^event: (\w+)/m);
          const dataMatch = part.match(/^data: (.+)/m);
          if (!eventMatch || !dataMatch) continue;
          const event = eventMatch[1];
          let data;
          try { data = JSON.parse(dataMatch[1]); } catch { continue; }

          if (event === "token") {
            if (streamingIndexRef.current === null) {
              // First token — stop typing indicator, insert streaming message
              clearInterval(typingTimerRef.current);
              setIsTyping(false);
              setTypingElapsed(0);
              setMessages((current) => {
                streamingIndexRef.current = current.length;
                return [...current, { role: "assistant", text: data.text, streaming: true }];
              });
            } else {
              const idx = streamingIndexRef.current;
              setMessages((current) =>
                current.map((m, i) =>
                  i === idx ? { ...m, text: m.text + data.text } : m
                )
              );
            }
          } else if (event === "done") {
            const idx = streamingIndexRef.current;
            setMessages((current) =>
              current.map((m, i) =>
                i === idx ? { ...m, streaming: false } : m
              )
            );
            setChatSource(data.fallbackUsed ? "fallback" : "website-subagent");
          }
        }
      }

      if (streamingIndexRef.current === null) throw new Error("no response");
      setGatewayState("live");
    } catch (_error) {
      setGatewayState("degraded");
      setChatSource("fallback");
      if (streamingIndexRef.current === null) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: "I can still guide you through Adrian's portfolio, but the live backend is temporarily degraded.",
          },
        ]);
      }
    } finally {
      clearInterval(typingTimerRef.current);
      setIsTyping(false);
      setTypingElapsed(0);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitQuestion(input);
  }

  return (
    <main className="min-h-screen bg-background bg-[length:24px_24px] [background-image:radial-gradient(circle,hsl(var(--dot-grid))_1px,transparent_1px)] text-foreground">
      <HomeToc sections={tocSections} activeId={activeSection} />

      <header id="top" className="relative overflow-hidden border-b border-border/60">
        <GridSnakes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div
          className="absolute top-0 right-[max(0px,calc(50%-40rem))] hidden h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl sm:block animate-[hero-glow_8s_ease-in-out_infinite]"
          style={{ backgroundColor: "hsl(var(--hero-orb-primary))" }}
        />
        <div
          className="absolute bottom-0 left-[max(0px,calc(50%-40rem))] hidden h-[520px] w-[520px] -translate-x-1/3 translate-y-1/3 rounded-full blur-3xl sm:block animate-[hero-glow_11s_ease-in-out_infinite_reverse]"
          style={{ backgroundColor: "hsl(var(--hero-orb-accent))" }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 md:py-28">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative shrink-0"
            >
              <div className="relative h-40 w-40 md:h-48 md:w-48">
                <div className="absolute inset-0 rounded-full bg-gradient-theme-30 blur-2xl opacity-80" />
                <div className="absolute -inset-1 rounded-full bg-gradient-theme opacity-20 blur-md" />
                <div className="absolute inset-0 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm" />
                <div className="absolute inset-[6px] overflow-hidden rounded-full border border-white/20 shadow-inner">
                  <img
                    src="/profile/adrian-portrait.jpg"
                    alt="Adrian Tri Setiawan"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-gradient-theme text-white shadow-lg shadow-primary/30">
                  <BadgeCheck className="h-5 w-5" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-center md:text-left"
            >
              <motion.p
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mb-3 text-base text-muted-foreground"
              >
                Hi, I&apos;m{" "}
                <span className="font-semibold text-gradient-theme font-mono">{scrambledName}</span>
              </motion.p>
              <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                <span className="text-gradient-theme">{roleText}</span>
                <span
                  className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[2px] rounded-sm bg-primary"
                  style={{ animation: "blink 1s step-end infinite" }}
                />
                <br />
                <StaggeredWords text="building AI systems" className="block mt-1" />
                <br />
                <StaggeredWords text="with OpenClaw + ML + CV" className="block mt-1 text-foreground" />
              </h1>
              <motion.p
                initial={reduceMotion ? undefined : { opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground"
              >
                Adrian focuses on AI research, machine learning, deep learning,
                assistant systems, and fullstack product execution for real
                operational environments rather than static demos.
              </motion.p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                {["Fullstack", "AI R&D", "Machine Learning", "OpenClaw", "Computer Vision"].map(
                  (label, index) => (
                    <span
                      key={label}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                        index === roleIndex
                          ? "border border-[#20d6ee] bg-[#20d6ee]/15 text-foreground scale-105"
                          : "border border-[#20d6ee]/30 bg-background/80 text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-theme px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:brightness-110"
                >
                  View projects
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="mailto:adriansetiawan26@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                >
                  Contact Adrian
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid gap-4 md:grid-cols-3"
          >
            {[
              ["Base", "Jakarta - Surabaya", MapPin],
              ["Audience", "Available for freelance", Users],
              ["Runtime", chatSource === "website-subagent" ? "OpenClaw sub-agent" : "Fallback mode", Zap],
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-primary/70" />
                  <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <AnimatedSection>
            <p className="mx-auto max-w-3xl font-display text-lg leading-relaxed text-muted-foreground md:text-2xl">
              Adrian&apos;s profile sits between research and deployment.
              He works across <span className="text-foreground font-semibold">AI R&amp;D</span>,
              <span className="text-gradient-theme font-semibold"> fullstack execution</span>, and
              operational assistant systems intended to be used in live environments.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                { href: "#experience", label: "Experience" },
                { href: "#projects", label: "Projects" },
                { href: "#contact", label: "Contact" },
                { href: "#ai", label: "Ask Lunaria" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    item.href === "#ai"
                      ? "bg-gradient-theme text-white shadow-lg shadow-primary/20"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection>
            <SectionHeader
              icon={Briefcase}
              title="About"
              body="A technical profile shaped by research, delivery, and system thinking. Adrian Tri Setiawan is positioned for employers and freelance clients who need someone capable of both experimentation and shipping."
            />
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <AnimatedSection delay={0.08}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-theme" />
                <p className="text-sm leading-8 text-muted-foreground">
                  Adrian works with a research-first approach, but he is not limited
                  to theory. His focus is building AI systems, assistant workflows,
                  support automation, and fullstack products that can move from
                  concept into actual usage.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.14}>
              <div className="grid gap-3">
                {strengths.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section id="experience" className="bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection>
            <SectionHeader
              icon={Briefcase}
              title="Experience"
              body="A compact technical CV structure closer to a working operator page than to a standard personal landing page."
            />
          </AnimatedSection>

          <AnimatedSection delay={0.06}>
            <div className="mb-12 rounded-2xl bg-card/50 p-6">
              <p className="mx-auto mb-6 max-w-3xl text-center text-lg text-muted-foreground">
                Adrian combines research-minded work with practical engineering delivery.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {focusAreas.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-border bg-background/50 p-5 transition hover:border-accent/40 hover:bg-accent/5"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
            <AnimatedSection delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-theme" />
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Operating range</p>
                <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
                  Fullstack web delivery, AI experimentation, and assistant-system design.
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Adrian&apos;s work sits across frontend and backend delivery, AI
                  research, implementation of machine learning and deep learning
                  workflows, and assistant systems intended for operational
                  environments such as support or internal automation.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-5">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <AnimatedSection key={item.title} delay={0.14 + index * 0.05}>
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                      <h3 className="mt-2 font-display text-xl font-bold text-foreground">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection>
            <SectionHeader
              icon={FolderGit2}
              title="Projects"
              body="Selected systems and case studies presented with a denser, more technical project hierarchy."
              action={
                <a
                  href="https://github.com/AdrianTriSetiawan/"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-primary md:inline-flex"
                >
                  <FolderGit2 className="h-4 w-4" />
                  AdrianTriSetiawan
                </a>
              }
            />
          </AnimatedSection>

          <AnimatedSection delay={0.04} className="mb-8">
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent p-8">
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">InsightFace — Attendance System</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Flagship private work: face recognition attendance via CCTV with anti-spoofing, dual camera, and a full web + mobile monorepo.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    "InsightFace 512-dim + anti-spoofing untuk deteksi foto/video palsu.",
                    "Dual RTSP camera support dengan auto-reconnect watchdog.",
                    "Monorepo: FastAPI backend, React web, Expo React Native mobile.",
                  ].map((line) => (
                    <div key={line} className="rounded-xl border border-gold/20 bg-background/50 p-4 text-sm text-muted-foreground">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <AnimatedSection key={project.name} delay={0.08 + index * 0.05}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                  className={`card-glow h-full rounded-2xl border p-6 transition ${
                    project.highlight
                      ? "border-accent/40 bg-gradient-to-br from-accent/5 to-transparent"
                      : "border-border bg-card hover:border-primary/20"
                  }`}
                >
                  <div className="group overflow-hidden rounded-xl border border-border bg-background">
                    <div className="relative overflow-hidden">
                      {project.image.includes("clawbot-avatar") ? (
                        <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-primary backdrop-blur">
                          <ClawbotAvatar size="h-5 w-5" className="rounded-full border-white/10" />
                          Clawbot shell
                        </div>
                      ) : null}
                      <img
                        src={project.image}
                        alt={`${project.name} preview`}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${
                        project.highlight ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {project.tag}
                    </span>
                    {project.private ? (
                      <span className="rounded-full border border-muted-foreground/20 bg-muted px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        Private
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-foreground">{project.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.summary}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{project.detail}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => {
                      const TechIcon = techIconMap[item];
                      return (
                        <span key={item} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-foreground">
                          {TechIcon && <TechIcon className="h-3 w-3 shrink-0 opacity-70" />}
                          {item}
                        </span>
                      );
                    })}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-primary transition hover:text-primary/80"
                    >
                      <FolderGit2 className="h-3.5 w-3.5" />
                      View on GitHub
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="tech" className="bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection>
            <SectionHeader
              icon={Code}
              title="Skills & Stack"
              body="Multi-stack range with an AI-heavy operating direction, presented more like a technical inventory than a marketing badge wall."
            />
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-4">
            <AnimatedSection delay={0.08}>
              <div>
                <h3 className="mb-4 font-display font-semibold">Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.14} className="md:col-span-3">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stackGroups.map((group) => (
                  <div key={group.name} className="card-glow relative overflow-hidden rounded-xl border border-border bg-card p-4 transition hover:border-primary/20">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-theme opacity-40" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">{group.name}</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => {
                        const TechIcon = techIconMap[item];
                        return (
                          <span key={item} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground">
                            {TechIcon && <TechIcon className="h-3.5 w-3.5 shrink-0" />}
                            {item}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section id="ai" className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection>
            <SectionHeader
              icon={Bot}
              title="AI Guide"
              body="Lunaria is the public-facing AI voice of this portfolio. The chat panel is routed through a dedicated OpenClaw website agent instead of Adrian's main private assistant."
            />
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
            <AnimatedSection delay={0.06}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-theme" />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <ClawbotAvatar />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Persona</p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-foreground">{agent.displayName}</h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-primary/70">presented through clawbot</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {chatSource === "website-subagent" ? "OpenClaw sub-agent" : "Fallback mode"}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">{agent.persona?.publicStyle}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => submitQuestion(prompt)}
                      className="rounded-full border border-border bg-background px-3 py-2 text-xs text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask Lunaria about Adrian, PIRA, or Recognition CCTV"
                    className="h-12 rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-theme px-5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Ask
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-5 max-h-72 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                  <AnimatePresence initial={false}>
                    {latestMessages.map((message, index) => (
                      <motion.article
                        key={`${message.role}-${index}-${message.text.slice(0, 24)}`}
                        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {message.role === "assistant" && (
                          <ClawbotAvatar size="h-8 w-8" className="mt-1 shrink-0 rounded-xl" />
                        )}
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                            message.role === "assistant"
                              ? "border border-primary/20 bg-primary/10 text-foreground rounded-tl-none"
                              : "border border-border bg-muted text-foreground rounded-tr-none"
                          }`}
                        >
                          <p className="whitespace-pre-line">{message.text}</p>
                        </div>
                      </motion.article>
                    ))}
                    {isTyping && (
                      <motion.div
                        key="typing-inline"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                      >
                        <TypingIndicator elapsed={typingElapsed} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </AnimatedSection>

            <div className="grid gap-6">
              <AnimatedSection delay={0.12}>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Runtime</p>
                  <div className="mt-4 space-y-4">
                    {[
                      {
                        icon: Bot,
                        title: "Website sub-agent",
                        body: "Public chat is routed into a dedicated OpenClaw website agent instead of Adrian's main private agent.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Scoped responses",
                        body: "Lunaria only answers inside Adrian's portfolio context for public stability and clarity.",
                      },
                      {
                        icon: Radar,
                        title: "Session isolation",
                        body: "Each visitor keeps a browser-level session ID so website conversations do not mix with the main agent or with other visitors.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="flex gap-4">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                            <p className="mt-1 text-sm leading-7 text-muted-foreground">{item.body}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.18}>
                <div id="contact" className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Contact</p>
                  <div className="mt-4 space-y-3">
                    {contactLinks.map((item) => {
                      const Icon = item.icon;
                      const isExternal = item.href && item.href.startsWith("http");
                      const Wrapper = item.href ? "a" : "div";
                      return (
                        <Wrapper
                          key={item.label}
                          href={item.href || undefined}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noreferrer" : undefined}
                          className={`flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition ${item.href ? "hover:border-primary/40 hover:bg-primary/5 cursor-pointer" : "opacity-80"}`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                              <p className="text-sm text-foreground">{item.value}</p>
                            </div>
                          </div>
                          {item.href && <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
                        </Wrapper>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.24}>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-accent" />
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Beyond the keyboard</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    <a
                      href="https://steamcommunity.com/id/finnngck/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      <SiSteam className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Steam</p>
                        <p className="text-sm text-foreground">finnngck</p>
                      </div>
                      <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                    </a>
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                      <SiDiscord className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Discord</p>
                        <p className="text-sm text-foreground">luzwellsclauka</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["CS2", "Dota 2", "Anime"].map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Let&apos;s build something useful.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Adrian is open to employer opportunities, freelance work, and AI-oriented collaborations.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:adriansetiawan26@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-theme px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
              >
                <Mail className="h-4 w-4" />
                Email Adrian
              </a>
              <a
                href="https://github.com/AdrianTriSetiawan/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
              >
                <FolderGit2 className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://steamcommunity.com/id/finnngck/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
              >
                <SiSteam className="h-4 w-4" />
                Steam
              </a>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {chatOpen ? (
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-[min(26rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.75rem] border border-border bg-card/98 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <div className="relative px-4 pt-4 pb-3">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-theme" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ClawbotAvatar />
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Website AI</p>
                      <p className="font-display text-base font-semibold text-foreground">{agent.displayName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${chatSource === "website-subagent" ? "bg-green-400" : "bg-amber-400"}`} />
                      {chatSource === "website-subagent" ? "live" : "fallback"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 px-3 pb-1">
                {messages.map((message, index) => (
                  <div
                    key={`floating-${message.role}-${index}`}
                    className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {message.role === "assistant" && (
                      <ClawbotAvatar size="h-6 w-6" className="mt-1 shrink-0 rounded-lg" />
                    )}
                    <div
                      className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                        message.role === "assistant"
                          ? "bg-primary/10 text-foreground rounded-tl-none"
                          : "bg-muted text-foreground rounded-tr-none"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && <TypingIndicator elapsed={typingElapsed} size="sm" />}
              </div>

              <div className="border-t border-border/60 px-3 py-3">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={isTyping ? "Lunaria is responding…" : "Ask about Adrian or his projects…"}
                    disabled={isTyping}
                    className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isTyping}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-theme text-white transition hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setChatOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-theme px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:brightness-110 active:scale-95"
        >
          <ClawbotAvatar size="h-6 w-6" className="rounded-full" />
          {chatOpen ? "Close Lunaria" : "Ask Lunaria"}
        </button>
      </div>
    </main>
  );
}

export default App;
