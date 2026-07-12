import Link from "next/link";
import { lessons, songs } from "@/lib/lessons";

export default function Home() {
  return <div className="page">
    <header className="hero"><span className="eyebrow">PianoPath</span><h1>Bugün piyanoda bir adım daha ilerle.</h1><p>Sana özel hazırlanan 15 dakikalık çalışma programın hazır.</p><Link className="primary" href="/lesson/klavyeyi-tani">Bugünkü Çalışmayı Başlat</Link></header>
    <section className="grid stats"><article><b>🔥 6 gün</b><span>Günlük seri</span></article><article><b>%72</b><span>Haftalık hedef</span></article><article><b>240 XP</b><span>Ustalık puanı</span></article></section>
    <section><div className="section-head"><h2>Kaldığın yerden devam et</h2><Link href="/learn">Tümünü gör</Link></div><Link className="lesson-card" href={`/lesson/${lessons[0].slug}`}><span className="lesson-index">01</span><div><h3>{lessons[0].title}</h3><p>{lessons[0].description}</p></div><b>{lessons[0].duration} dk</b></Link></section>
    <section><div className="section-head"><h2>Sana önerilen şarkılar</h2><Link href="/songs">Kütüphane</Link></div><div className="song-row">{songs.slice(0, 3).map(song => <article key={song.title}><div className="album">♪</div><h3>{song.title}</h3><p>{song.composer}</p></article>)}</div></section>
  </div>;
}
