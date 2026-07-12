import Link from "next/link";

export default function Profile() {
  return <div className="page">
    <header className="page-head"><span className="eyebrow">Profil</span><h1>Gelişim Paneli</h1><p>Veriler MVP boyunca örnek gösterimdir; Supabase bağlantısıyla kalıcı hale gelir.</p></header>
    <section className="grid stats"><article><b>74 dk</b><span>Toplam çalışma</span></article><article><b>%86</b><span>Nota doğruluğu</span></article><article><b>3/5</b><span>Tamamlanan ders</span></article></section>
    <section className="card"><h2>Kişisel planını oluştur</h2><p>Seviyeni, hedefini, enstrümanını ve günlük çalışma süreni seç.</p><Link className="primary" href="/onboarding">Onboarding’i Başlat</Link></section>
  </div>;
}
