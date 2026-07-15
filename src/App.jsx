import { useEffect, useRef, useState } from "react";
import { CalendarDays, Clock3, Heart, MapPin, MessageCircle, Music2, VolumeX } from "lucide-react";
import Countdown from "./components/Countdown";
import FloralCorners from "./components/FloralCorners";
import Petals from "./components/Petals";
import { invitation } from "./invitation";
import "./styles.css";

function downloadCalendar() {
  const start = new Date(invitation.weddingDate);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const format = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${format(start)}`,
    `DTEND:${format(end)}`,
    `SUMMARY:${invitation.partnerOne} & ${invitation.partnerTwo}'s Wedding`,
    `LOCATION:${invitation.venue}, ${invitation.address}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding-invitation.ics";
  link.click();
  URL.revokeObjectURL(url);
}

function createWeddingMusic() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  const audioContext = new AudioContext();
  const master = audioContext.createGain();
  const compressor = audioContext.createDynamicsCompressor();
  const warmth = audioContext.createBiquadFilter();
  const delay = audioContext.createDelay();
  const feedback = audioContext.createGain();
  const reverbSend = audioContext.createGain();
  const loopLength = 24;
  const progression = [
    { bass: 130.81, chord: [261.63, 329.63, 392, 493.88], arp: [523.25, 659.25, 783.99, 987.77] },
    { bass: 123.47, chord: [246.94, 293.66, 392, 493.88], arp: [493.88, 587.33, 783.99, 987.77] },
    { bass: 110, chord: [220, 261.63, 329.63, 392], arp: [440, 523.25, 659.25, 783.99] },
    { bass: 174.61, chord: [261.63, 349.23, 392, 523.25], arp: [523.25, 698.46, 783.99, 1046.5] },
    { bass: 146.83, chord: [220, 293.66, 349.23, 523.25], arp: [440, 587.33, 698.46, 880] },
    { bass: 196, chord: [246.94, 293.66, 392, 523.25], arp: [493.88, 587.33, 783.99, 1046.5] },
    { bass: 164.81, chord: [261.63, 329.63, 392, 523.25], arp: [523.25, 659.25, 783.99, 1046.5] },
    { bass: 174.61, chord: [261.63, 349.23, 440, 523.25], arp: [523.25, 698.46, 880, 1046.5] }
  ];
  const melody = [
    { time: 0, note: 659.25, length: 0.8 },
    { time: 1, note: 783.99, length: 0.8 },
    { time: 2, note: 880, length: 0.9 },
    { time: 3.2, note: 783.99, length: 0.7 },
    { time: 4, note: 659.25, length: 1 },
    { time: 5.15, note: 587.33, length: 0.75 },
    { time: 6, note: 523.25, length: 1.15 },
    { time: 7.5, note: 587.33, length: 0.65 },
    { time: 8.1, note: 659.25, length: 0.85 },
    { time: 9.1, note: 783.99, length: 0.75 },
    { time: 10, note: 739.99, length: 0.8 },
    { time: 11, note: 659.25, length: 1.2 },
    { time: 12.4, note: 587.33, length: 0.8 },
    { time: 13.35, note: 659.25, length: 0.85 },
    { time: 14.35, note: 698.46, length: 0.85 },
    { time: 15.35, note: 783.99, length: 1.15 },
    { time: 17, note: 880, length: 0.85 },
    { time: 18, note: 783.99, length: 0.8 },
    { time: 19, note: 659.25, length: 1 },
    { time: 20.4, note: 587.33, length: 0.75 },
    { time: 21.25, note: 523.25, length: 0.8 },
    { time: 22.1, note: 587.33, length: 0.75 },
    { time: 23, note: 659.25, length: 1.2 }
  ];
  let stopped = false;
  let interval = null;

  warmth.type = "lowpass";
  warmth.frequency.value = 4200;
  warmth.Q.value = 0.7;
  compressor.threshold.value = -18;
  compressor.knee.value = 24;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.02;
  compressor.release.value = 0.35;
  master.gain.setValueAtTime(0.0001, audioContext.currentTime);
  reverbSend.gain.value = 0.42;
  delay.delayTime.value = 0.46;
  feedback.gain.value = 0.34;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(warmth);
  reverbSend.connect(delay);
  reverbSend.connect(warmth);
  warmth.connect(compressor);
  compressor.connect(master);
  master.connect(audioContext.destination);

  const connectVoice = (source, gain, pan = 0) => {
    if (audioContext.createStereoPanner) {
      const panner = audioContext.createStereoPanner();
      panner.pan.value = pan;
      source.connect(gain);
      gain.connect(panner);
      panner.connect(reverbSend);
      return;
    }

    source.connect(gain);
    gain.connect(reverbSend);
  };

  const playTone = (
    frequency,
    start,
    duration,
    { type = "sine", volume = 0.08, attack = 0.08, release = 0.35, detune = 0, pan = 0 } = {}
  ) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.detune.value = detune;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + attack);
    gain.gain.setTargetAtTime(0.0001, start + Math.max(attack, duration - release), release);
    connectVoice(oscillator, gain, pan);
    oscillator.start(start);
    oscillator.stop(start + duration + release + 0.2);
  };

  const playBell = (frequency, start, duration, volume = 0.08, pan = 0) => {
    playTone(frequency, start, duration, {
      type: "sine",
      volume,
      attack: 0.015,
      release: 0.8,
      pan
    });
    playTone(frequency * 2.01, start, duration * 0.45, {
      type: "triangle",
      volume: volume * 0.28,
      attack: 0.01,
      release: 0.45,
      pan
    });
  };

  const scheduleLoop = () => {
    if (stopped) return;
    const startAt = audioContext.currentTime + 0.08;
    progression.forEach(({ bass, chord, arp }, chordIndex) => {
      const chordStart = startAt + chordIndex * 3;

      playTone(bass, chordStart, 2.9, {
        type: "sine",
        volume: 0.12,
        attack: 0.18,
        release: 0.75,
        pan: -0.08
      });
      playTone(bass * 2, chordStart + 1.5, 1.35, {
        type: "sine",
        volume: 0.05,
        attack: 0.12,
        release: 0.55,
        pan: 0.08
      });

      chord.forEach((note, noteIndex) => {
        playTone(note, chordStart + noteIndex * 0.05, 2.85, {
          type: "triangle",
          volume: 0.055,
          attack: 0.35,
          release: 1,
          detune: noteIndex % 2 === 0 ? -4 : 4,
          pan: noteIndex % 2 === 0 ? -0.18 : 0.18
        });
      });

      arp.forEach((note, noteIndex) => {
        playBell(note, chordStart + noteIndex * 0.5, 1, 0.055, noteIndex % 2 === 0 ? -0.22 : 0.22);
        playBell(note / 2, chordStart + 2 + noteIndex * 0.22, 0.8, 0.028, 0);
      });
    });

    melody.forEach(({ time, note, length }, index) => {
      playBell(note, startAt + time, length, index % 3 === 0 ? 0.105 : 0.088, index % 2 === 0 ? -0.12 : 0.12);
    });
  };

  return {
    async start() {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      if (stopped || interval) return;

      master.gain.cancelScheduledValues(audioContext.currentTime);
      master.gain.setValueAtTime(0.0001, audioContext.currentTime);
      master.gain.exponentialRampToValueAtTime(0.72, audioContext.currentTime + 1.1);
      scheduleLoop();
      interval = window.setInterval(scheduleLoop, loopLength * 1000);
    },
    stop() {
      stopped = true;
      if (interval) {
        window.clearInterval(interval);
      }
      master.gain.cancelScheduledValues(audioContext.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.8);
      window.setTimeout(() => audioContext.close(), 900);
    }
  };
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const musicRef = useRef(null);
  const whatsappText = encodeURIComponent(
    `Hello! I would like to confirm my attendance for ${invitation.partnerOne} and ${invitation.partnerTwo}'s wedding.`
  );

  useEffect(() => {
    return () => {
      musicRef.current?.stop();
    };
  }, []);

  const startMusic = async () => {
    if (musicRef.current) return;

    const player = createWeddingMusic();
    if (!player) return;

    musicRef.current = player;
    try {
      await player.start();
      setMusicOn(true);
    } catch {
      player.stop();
      musicRef.current = null;
      setMusicOn(false);
    }
  };

  const stopMusic = () => {
    musicRef.current?.stop();
    musicRef.current = null;
    setMusicOn(false);
  };

  const toggleMusic = () => {
    if (musicOn) {
      stopMusic();
      return;
    }

    startMusic();
  };

  const openInvitation = () => {
    setOpened(true);
    startMusic();
  };

  return (
    <main>
      {!opened && (
        <section className="cover">
          <FloralCorners />
          <Petals />
          <div className="cover__content">
            <div className="seal">{invitation.initials}</div>
            <p className="eyebrow">You are warmly invited</p>
            <h1>{invitation.partnerOne} & {invitation.partnerTwo}</h1>
            <p className="cover__date">{invitation.displayDate}</p>
            <button className="button button--primary" onClick={openInvitation}>
              <Heart size={16} /> Open invitation
            </button>
          </div>
        </section>
      )}

      <button className="music-button" onClick={toggleMusic} aria-label="Toggle music">
        {musicOn ? <Music2 size={15} /> : <VolumeX size={15} />}
        {musicOn ? "Music on" : "Music off"}
      </button>

      <section className="section hero">
        <FloralCorners />
        <Petals />
        <div className="hero__content">
          <p className="eyebrow">Save the date</p>
          <h2 className="names"><span>{invitation.partnerOne}</span><i>&</i><span>{invitation.partnerTwo}</span></h2>
          <p className="intro">{invitation.intro}</p>
          <div className="date-card">
            <CalendarDays size={28} />
            <div><strong>{invitation.displayDate}</strong><span>{invitation.ceremonyTime} onwards</span></div>
          </div>
          <a className="scroll-link" href="#story">Discover our day ↓</a>
        </div>
      </section>

      <section className="section paper" id="story">
        <p className="eyebrow">Our celebration</p>
        <h2>A beautiful day awaits</h2>
        <div className="portrait-frame">
          <img className="portrait-placeholder" src="/couple.png" alt="The wedding couple" />
        </div>
        <p className="script-text">Two hearts, one promise, a lifetime together.</p>
      </section>

      <section className="section green-section">
        <p className="eyebrow">Wedding details</p>
        <h2>Join us in celebration</h2>
        <div className="details-grid">
          <article><CalendarDays /><h3>Date</h3><p>{invitation.displayDate}</p></article>
          <article><Clock3 /><h3>Time</h3><p>Ceremony at {invitation.ceremonyTime}<br />Reception at {invitation.receptionTime}</p></article>
          <article><MapPin /><h3>Venue</h3><p>{invitation.venue}<br />{invitation.address}</p></article>
        </div>
        <div className="button-row">
          <a className="button button--light" href={invitation.mapUrl} target="_blank" rel="noreferrer"><MapPin size={16} /> View map</a>
          <button className="button button--outline" onClick={downloadCalendar}><CalendarDays size={16} /> Add to calendar</button>
        </div>
      </section>

      <section className="section paper schedule-section">
        <p className="eyebrow">Order of events</p>
        <h2>Our wedding day</h2>
        <div className="timeline">
          {invitation.schedule.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><time>{item.time}</time><h3>{item.title}</h3><p>{item.note}</p></div>
            </article>
          ))}
        </div>
        <div className="dress-code"><strong>Dress code</strong><span>{invitation.dressCode}</span></div>
      </section>

      <section className="section countdown-section">
        <p className="eyebrow">Counting every moment</p>
        <h2>Until we say “I do”</h2>
        <Countdown target={invitation.weddingDate} />
      </section>

      <section className="section paper rsvp-section">
        <FloralCorners />
        <p className="eyebrow">Kindly respond</p>
        <h2>Will you join us?</h2>
        <p className="intro">Your presence would make our celebration complete.</p>
        <p className="deadline">{invitation.rsvpDeadline}</p>
        <a className="button button--primary" href={`https://wa.me/${invitation.whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noreferrer">
          <MessageCircle size={17} /> RSVP on WhatsApp
        </a>
      </section>

      <footer><p>{invitation.partnerOne} & {invitation.partnerTwo}</p><span>THANK YOU FOR CELEBRATING WITH US</span></footer>
    </main>
  );
}
