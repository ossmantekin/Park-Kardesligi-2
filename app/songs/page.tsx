import { songs } from "@/lib/lessons";

export default function Songs() {
  return <div className="page">
    <header className="page-head"><span className="eyebrow">Repertuvar</span><h1>Şarkı Kütüphanesi</h1><p>İlk sürümde kamu malı ve geleneksel eserler.</p></header>
    <div className="song-list">{songs.map((song, index) => <article key={song.title}><div className="album">{index + 1}</div><div><h2>{song.title}</h2><p>{song.composer} · {song.level}</p></div><b>{song.minutes} dk</b></article>)}</div>
  </div>;
}
