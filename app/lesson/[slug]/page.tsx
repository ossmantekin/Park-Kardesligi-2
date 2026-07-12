import { notFound } from "next/navigation";
import { lessons } from "@/lib/lessons";
import { Piano } from "@/components/Piano";

export function generateStaticParams() {
  return lessons.map(lesson => ({ slug: lesson.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessons.find(item => item.slug === slug);
  if (!lesson) notFound();
  return <div className="page">
    <header className="page-head"><span className="eyebrow">Ders · {lesson.duration} dakika</span><h1>{lesson.title}</h1><p>{lesson.description}</p></header>
    <section className="card"><h2>Dersin amacı</h2><p>Doğru tuşu görsel ipucuyla bul, sesi dinle ve hedef notaları hatasız çalmaya çalış.</p></section>
    {lesson.notes ? <Piano start={48} count={25} targetNotes={lesson.notes} /> : <section className="card"><h2>Ritim egzersizi</h2><p>Metronom modülü Sprint 2’de gerçek zamanlama analiziyle eklenecek.</p></section>}
    <section className="coach"><b>AI öğretmen notu</b><p>Hız yerine doğruluğa odaklan. Üç kez hatasız çalmadan tempoyu artırma.</p></section>
  </div>;
}
