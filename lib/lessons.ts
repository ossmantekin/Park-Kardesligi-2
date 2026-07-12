export type Lesson = {
  slug: string;
  title: string;
  description: string;
  duration: number;
  status: "open" | "locked";
  notes?: number[];
};

export const lessons: Lesson[] = [
  { slug: "klavyeyi-tani", title: "Piyano Klavyesini Tanı", description: "Siyah tuş gruplarını ve tüm Do notalarını bul.", duration: 8, status: "open", notes: [48, 60, 72] },
  { slug: "parmak-numaralari", title: "Parmak Numaraları", description: "Her iki el için 1–5 parmak düzenini öğren.", duration: 7, status: "open", notes: [60, 62, 64, 65, 67] },
  { slug: "ilk-bes-nota", title: "İlk Beş Nota", description: "Do, Re, Mi, Fa ve Sol notalarını sırayla çal.", duration: 10, status: "open", notes: [60, 62, 64, 65, 67] },
  { slug: "ilk-ritim", title: "İlk Ritim", description: "Dörtlük ve ikilik notaları metronomla uygula.", duration: 9, status: "open" },
  { slug: "ilk-sarki", title: "İlk Şarkı", description: "Ode to Joy melodisinin başlangıcını öğren.", duration: 12, status: "open", notes: [64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62] }
];

export const songs = [
  { title: "Ode to Joy", composer: "L. van Beethoven", level: "Başlangıç", minutes: 2 },
  { title: "Twinkle, Twinkle", composer: "Geleneksel", level: "Başlangıç", minutes: 2 },
  { title: "Minuet in G", composer: "C. Petzold", level: "Başlangıç", minutes: 3 },
  { title: "Für Elise – Tema", composer: "L. van Beethoven", level: "Orta", minutes: 4 },
  { title: "Prelude in C", composer: "J. S. Bach", level: "Orta", minutes: 3 }
];
