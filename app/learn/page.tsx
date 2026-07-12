import Link from "next/link";
import { lessons } from "@/lib/lessons";

export default function Learn() {
  return <div className="page">
    <header className="page-head"><span className="eyebrow">Seviye 0</span><h1>Piyanoya Başlangıç</h1><p>Temeli acele etmeden kur. Her ders bir sonrakinin taşıyıcı kolonudur.</p></header>
    <div className="path">{lessons.map((lesson, index) => <Link href={`/lesson/${lesson.slug}`} className="path-node" key={lesson.slug}><span>{index + 1}</span><div><h2>{lesson.title}</h2><p>{lesson.description}</p></div><b>{lesson.duration} dk</b></Link>)}</div>
  </div>;
}
