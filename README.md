npx create-next-app@latest pianopath --typescript --tailwind --eslint --app
cd pianopath
npx shadcn-ui@latest init
pianopath/
├── src/
│   ├── app/                    # Next.js App Router (Sayfalar: /login, /dashboard, /learn)
│   ├── components/             # Yeniden kullanılabilir UI bileşenleri
│   │   ├── ui/                 # Shadcn UI bileşenleri
│   │   ├── piano/              # Sanal piyano, MIDI entegrasyonu bileşenleri
│   │   └── shared/             # Header, Sidebar, vb.
│   ├── lib/                    # Supabase client, utils, Stripe entegrasyonu
│   ├── hooks/                  # Özel React hook'ları (useMidi, useAudio, useAuth)
│   ├── store/                  # Durum yönetimi (Zustand veya Redux - Zustand önerilir)
│   ├── types/                  # TypeScript arayüzleri ve tipleri
│   └── styles/                 # Global CSS (Tailwind yapılandırması)
├── supabase/                   # Supabase migration ve config dosyaları
├── public/                     # Statik dosyalar, PWA manifest
├── package.json
└── .env.local                  # Çevresel değişkenler
-- users tablosu Supabase Auth tarafından otomatik yönetilir (auth.users)

-- Kullanıcı Profilleri
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'pro')),
  goal TEXT,
  daily_goal_minutes INT DEFAULT 15,
  experience_points INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Dersler
CREATE TABLE lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL,
  order_index INT NOT NULL,
  midi_data JSONB, -- İleride detaylı nota/beklenen vuruş verileri için
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Kullanıcı İlerlemesi
CREATE TABLE user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  lesson_id UUID REFERENCES lessons(id) NOT NULL,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INT DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, lesson_id)
);
// src/hooks/useMidi.ts
import { useState, useEffect } from 'react';

export type NoteEvent = {
  note: number;
  velocity: number;
  isOn: boolean;
};

export function useMidi() {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [activeNotes, setActiveNotes] = useState<Map<number, number>>(new Map()); // note -> velocity
  const [lastEvent, setLastEvent] = useState<NoteEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError("Tarayıcınız Web MIDI API'yi desteklemiyor.");
      return;
    }

    navigator.requestMIDIAccess().then(
      (access) => {
        setMidiAccess(access);
        const inputs = Array.from(access.inputs.values());
        
        inputs.forEach((input) => {
          input.onmidimessage = handleMidiMessage;
        });

        access.onstatechange = (e) => {
          // Yeni cihaz bağlandığında veya koptuğunda
          console.log(`MIDI port durumu değişti: ${e.port.name}, durumu: ${e.port.state}`);
        };
      },
      (err) => {
        setError(`MIDI erişimi reddedildi: ${err}`);
      }
    );

    return () => {
      // Temizleme işlemleri
      if (midiAccess) {
         Array.from(midiAccess.inputs.values()).forEach(input => {
             input.onmidimessage = null;
         })
      }
    };
  }, []);

  const handleMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [command, note, velocity] = message.data;
    
    // Sadece Note On (144) ve Note Off (128) komutlarını dinle
    if (command === 144 || command === 128) {
      const isOn = command === 144 && velocity > 0;
      
      setLastEvent({ note, velocity, isOn });

      setActiveNotes((prev) => {
        const newNotes = new Map(prev);
        if (isOn) {
          newNotes.set(note, velocity);
        } else {
          newNotes.delete(note);
        }
        return newNotes;
      });
    }
  };

  return { activeNotes, lastEvent, error, hasMidiSupport: !!navigator.requestMIDIAccess };
}
// src/components/piano/VirtualPiano.tsx
'use client';

import React from 'react';
import { useMidi } from '@/hooks/useMidi';

// Basit bir oktav (Do'dan Si'ye) - Gerçek uygulamada 88 tuş döngüsü yazılır.
const KEYS = [
  { note: 60, type: 'white', label: 'C' },
  { note: 61, type: 'black', label: 'C#' },
  { note: 62, type: 'white', label: 'D' },
  { note: 63, type: 'black', label: 'D#' },
  { note: 64, type: 'white', label: 'E' },
  { note: 65, type: 'white', label: 'F' },
  { note: 66, type: 'black', label: 'F#' },
  { note: 67, type: 'white', label: 'G' },
  { note: 68, type: 'black', label: 'G#' },
  { note: 69, type: 'white', label: 'A' },
  { note: 70, type: 'black', label: 'A#' },
  { note: 71, type: 'white', label: 'B' },
];

export default function VirtualPiano() {
  const { activeNotes, error } = useMidi();

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const isNoteActive = (note: number) => activeNotes.has(note);

  return (
    <div className="flex relative justify-center mt-10">
      {KEYS.map((key) => {
        const active = isNoteActive(key.note);
        return (
          <div
            key={key.note}
            className={`
              flex justify-center items-end pb-2 cursor-pointer
              ${key.type === 'white' 
                ? 'w-12 h-40 bg-white border border-gray-300 text-black z-0 rounded-b-md' 
                : 'w-8 h-24 bg-black text-white absolute top-0 -ml-4 z-10 rounded-b-md'}
              ${active ? (key.type === 'white' ? 'bg-blue-200' : 'bg-blue-600') : ''}
              hover:${key.type === 'white' ? 'bg-gray-100' : 'bg-gray-800'}
            `}
            // TODO: onClick ve onTouchEvents eklenerek fare/dokunma ile çalma sağlanacak
          >
            <span className="text-xs font-semibold select-none">{key.label}</span>
          </div>
        );
      })}
    </div>
  );
}
// src/components/piano/VirtualPiano.tsx
'use client';

import React from 'react';
import { useMidi } from '@/hooks/useMidi';

// Basit bir oktav (Do'dan Si'ye) - Gerçek uygulamada 88 tuş döngüsü yazılır.
const KEYS = [
  { note: 60, type: 'white', label: 'C' },
  { note: 61, type: 'black', label: 'C#' },
  { note: 62, type: 'white', label: 'D' },
  { note: 63, type: 'black', label: 'D#' },
  { note: 64, type: 'white', label: 'E' },
  { note: 65, type: 'white', label: 'F' },
  { note: 66, type: 'black', label: 'F#' },
  { note: 67, type: 'white', label: 'G' },
  { note: 68, type: 'black', label: 'G#' },
  { note: 69, type: 'white', label: 'A' },
  { note: 70, type: 'black', label: 'A#' },
  { note: 71, type: 'white', label: 'B' },
];

export default function VirtualPiano() {
  const { activeNotes, error } = useMidi();

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const isNoteActive = (note: number) => activeNotes.has(note);

  return (
    <div className="flex relative justify-center mt-10">
      {KEYS.map((key) => {
        const active = isNoteActive(key.note);
        return (
          <div
            key={key.note}
            className={`
              flex justify-center items-end pb-2 cursor-pointer
              ${key.type === 'white' 
                ? 'w-12 h-40 bg-white border border-gray-300 text-black z-0 rounded-b-md' 
                : 'w-8 h-24 bg-black text-white absolute top-0 -ml-4 z-10 rounded-b-md'}
              ${active ? (key.type === 'white' ? 'bg-blue-200' : 'bg-blue-600') : ''}
              hover:${key.type === 'white' ? 'bg-gray-100' : 'bg-gray-800'}
            `}
            // TODO: onClick ve onTouchEvents eklenerek fare/dokunma ile çalma sağlanacak
          >
            <span className="text-xs font-semibold select-none">{key.label}</span>
          </div>
        );
      })}
    </div>
  );
}
