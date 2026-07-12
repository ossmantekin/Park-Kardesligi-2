"use client";

import { useEffect, useMemo, useState } from "react";
import { midiToName, playMidiNote } from "@/lib/music";

type Props = { start?: number; count?: number; targetNotes?: number[] };

export function Piano({ start = 48, count = 24, targetNotes = [] }: Props) {
  const [last, setLast] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [midiStatus, setMidiStatus] = useState("MIDI bağlı değil");
  const notes = useMemo(() => Array.from({ length: count }, (_, index) => start + index), [start, count]);

  const press = (midi: number) => {
    playMidiNote(midi);
    setLast(midi);
    setAttempts(value => value + 1);
    if (targetNotes.includes(midi)) setHits(value => value + 1);
  };

  useEffect(() => {
    const map: Record<string, number> = { a: 60, s: 62, d: 64, f: 65, g: 67, h: 69, j: 71, k: 72 };
    const onKey = (event: KeyboardEvent) => {
      const midi = map[event.key.toLowerCase()];
      if (midi) press(midi);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const connectMidi = async () => {
    const nav = navigator as Navigator & { requestMIDIAccess?: () => Promise<MIDIAccess> };
    if (!nav.requestMIDIAccess) {
      setMidiStatus("Bu tarayıcı Web MIDI desteklemiyor");
      return;
    }
    try {
      const access = await nav.requestMIDIAccess();
      access.inputs.forEach(input => {
        input.onmidimessage = event => {
          const data = event.data;
          if (!data || data.length < 3) return;
          const [status, note, velocity] = data;
          if ((status & 0xf0) === 0x90 && velocity > 0) press(note);
        };
      });
      setMidiStatus(`${access.inputs.size} MIDI girişine bağlandı`);
    } catch {
      setMidiStatus("MIDI izni verilmedi");
    }
  };

  const whiteNotes = notes.filter(note => ![1, 3, 6, 8, 10].includes(note % 12));

  return <section className="piano-panel">
    <div className="piano-toolbar"><button onClick={connectMidi}>MIDI Klavyeyi Bağla</button><span>{midiStatus}</span></div>
    <div className="feedback">{last === null ? "Bir tuşa bas" : targetNotes.length === 0 ? `${midiToName(last)} çaldın` : targetNotes.includes(last) ? `Doğru: ${midiToName(last)}` : `Tekrar dene: ${midiToName(last)}`} {attempts > 0 && targetNotes.length > 0 ? <strong> · %{Math.round(hits / attempts * 100)}</strong> : null}</div>
    <div className="white-keys">{whiteNotes.map(note => <button key={note} className={`white-key ${targetNotes.includes(note) ? "target" : ""}`} onClick={() => press(note)}><span>{midiToName(note)}</span></button>)}</div>
    <p className="hint">Bilgisayar klavyesi: A S D F G H J K</p>
  </section>;
}
