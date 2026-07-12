"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const levels = ["Hiç başlamadım", "Birkaç nota biliyorum", "Başlangıç", "Orta", "İleri"];
const goals = ["Sevdiğim şarkıları çalmak", "Nota okumak", "Klasik piyano", "Pop piyano", "Beste yapmak"];

export default function Onboarding() {
  const [level, setLevel] = useState(levels[0]);
  const [goal, setGoal] = useState(goals[0]);
  const [minutes, setMinutes] = useState(15);
  const router = useRouter();
  const save = () => {
    localStorage.setItem("pianopath-profile", JSON.stringify({ level, goal, minutes }));
    router.push("/");
  };

  return <div className="page narrow"><header className="page-head"><span className="eyebrow">Kişiselleştirme</span><h1>Öğrenme yolunu oluşturalım</h1></header><section className="form-card">
    <label>Seviyen<select value={level} onChange={event => setLevel(event.target.value)}>{levels.map(item => <option key={item}>{item}</option>)}</select></label>
    <label>Ana hedefin<select value={goal} onChange={event => setGoal(event.target.value)}>{goals.map(item => <option key={item}>{item}</option>)}</select></label>
    <label>Günlük çalışma süresi<input type="range" min="5" max="60" step="5" value={minutes} onChange={event => setMinutes(Number(event.target.value))} /><b>{minutes} dakika</b></label>
    <button className="primary" onClick={save}>Planımı Oluştur</button>
  </section></div>;
}
