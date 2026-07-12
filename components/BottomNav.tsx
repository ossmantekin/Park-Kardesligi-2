import Link from "next/link";

const items = [["/", "Ana Sayfa"], ["/learn", "Öğren"], ["/play", "Çal"], ["/songs", "Şarkılar"], ["/profile", "Profil"]];

export function BottomNav() {
  return <nav className="bottom-nav" aria-label="Ana menü">{items.map(([href, label]) => <Link key={href} href={href} className={href === "/play" ? "play-link" : ""}>{label}</Link>)}</nav>;
}
