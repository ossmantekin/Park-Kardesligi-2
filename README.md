# PianoPath – Sıfırdan Virtüözlüğe

PianoPath; sıfırdan başlayan kullanıcılar için kişiselleştirilmiş öğrenme yolu, gerçek zamanlı nota geri bildirimi, sanal piyano ve MIDI desteği sunmayı hedefleyen mobil öncelikli bir piyano öğrenme uygulamasıdır.

## Bu ilk sürümde çalışanlar

- Mobil uyumlu ana sayfa ve alt navigasyon
- Beş derslik başlangıç eğitim yolu
- Web Audio API ile ses üreten sanal piyano
- Bilgisayar klavyesiyle çalma (A–K)
- Web MIDI destekli MIDI klavye bağlantısı
- Bekleme modu: doğru nota gelmeden ilerlemeyen egzersiz
- Anlık doğru/yanlış nota geri bildirimi ve doğruluk puanı
- İki adımlı onboarding ve tarayıcıda profil saklama
- Kamu malı eserlerden oluşan başlangıç repertuvarı
- Supabase için ilk veritabanı migration dosyası ve RLS politikaları
- Açık/koyu sistem teması

## Teknolojiler

- Next.js 15
- React 19
- TypeScript strict mode
- CSS ile özgün responsive tasarım sistemi
- Web Audio API
- Web MIDI API
- Supabase / PostgreSQL hazırlığı

## Kurulum

```bash
git clone https://github.com/ossmantekin/Park-Kardesligi-2.git
cd Park-Kardesligi-2
npm install
cp .env.example .env.local
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın. MVP arayüzü anahtar olmadan açılır; kimlik doğrulama, kalıcı kullanıcı verisi, AI koçu ve ödeme için ilgili servis anahtarları gerekir.

## Veritabanı kurulumu

1. Supabase projesi oluşturun.
2. `supabase/migrations/001_initial.sql` dosyasını SQL Editor içinde çalıştırın.
3. Supabase URL ve anon key değerlerini `.env.local` içine ekleyin.

Migration; `profiles`, `lessons`, `user_progress` ve `practice_sessions` tablolarını, indeksleri, örnek dersleri ve temel Row Level Security politikalarını oluşturur.

## MIDI cihazı bağlama

1. Chrome veya Edge gibi Web MIDI destekleyen bir tarayıcı kullanın.
2. MIDI klavyeyi USB ile bilgisayara bağlayın.
3. `/play` ekranındaki **MIDI Klavyeyi Bağla** düğmesine basın.
4. Tarayıcı izin isteğini onaylayın.

Web MIDI desteği olmayan tarayıcılarda sanal piyano ve bilgisayar klavyesi çalışmaya devam eder.

## Kontroller

```bash
npm run typecheck
npm run build
```

## Yol haritası

### Sprint 2
- Supabase Auth: kayıt, giriş, şifre sıfırlama
- Onboarding verisini gerçek kullanıcı profiline kaydetme
- Ders ilerlemesini kalıcılaştırma
- Ritim egzersizi ve metronom
- Performans oturumu kayıtları

### Sprint 3
- MusicXML / nota görüntüleme
- Gelişmiş MIDI zamanlama analizi
- AI öğretmen API katmanı
- Abonelik ve Stripe
- Yönetici içerik paneli

## Kritik teknik gerçek

Mikrofonla aynı anda birden fazla piyano notasını güvenilir biçimde algılamak, basit frekans tespitinden çok daha zor bir ses işleme problemidir. Bu nedenle ürün önce deterministik MIDI analiziyle sağlamlaştırılmalı; polifonik mikrofon analizi ayrı bir Ar-Ge modülü olarak geliştirilmelidir.
