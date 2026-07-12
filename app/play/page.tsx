import { Piano } from "@/components/Piano";

export default function Play() {
  return <div className="page">
    <header className="page-head"><span className="eyebrow">Serbest Çal</span><h1>Sanal Piyano</h1><p>Ekrandan, bilgisayar klavyesinden veya MIDI cihazından çal.</p></header>
    <Piano count={25} />
    <section className="card"><h2>Bekleme modu</h2><p>Hedef notalar: Do, Re, Mi, Fa, Sol. Doğru notayı buldukça uygulama performansını ölçer.</p><Piano start={60} count={13} targetNotes={[60, 62, 64, 65, 67]} /></section>
  </div>;
}
