import { useState } from "react";
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

export default function App() {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const whatsappText = encodeURIComponent(
    `Hello! I would like to confirm my attendance for ${invitation.partnerOne} and ${invitation.partnerTwo}'s wedding.`
  );

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
            <button className="button button--primary" onClick={() => setOpened(true)}>
              <Heart size={16} /> Open invitation
            </button>
          </div>
        </section>
      )}

      <button className="music-button" onClick={() => setMusicOn((value) => !value)} aria-label="Toggle music">
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
