import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "PianoPath",
  description: "Sıfırdan virtüözlüğe interaktif piyano eğitimi"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="tr"><body><main>{children}</main><BottomNav /></body></html>;
}
