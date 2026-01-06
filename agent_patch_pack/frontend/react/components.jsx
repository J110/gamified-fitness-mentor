import React from "react";

export function ChapterTabs({ current, onChange }) {
  const chapters = ["HEALTH","FINANCE","PURPOSE","RELATIONSHIPS"];
  return (
    <div className="tabs">
      {chapters.map(ch => (
        <button key={ch}
          className={current === ch ? "tab active" : "tab"}
          onClick={() => onChange(ch)}
        >
          {ch}
        </button>
      ))}
    </div>
  );
}

export function SkillCards({ cards, onComplete }) {
  if (!cards?.length) return <div className="muted">No cards found.</div>;
  return (
    <div className="cardGrid">
      {cards.map(card => (
        <div key={card.id} className="skillCard">
          <div className="title">{card.title}</div>
          <div className="why">{card.why}</div>
          <div className="footer">
            <span>⏱ {card.time_min} min</span>
            <div className="actions">
              <button onClick={() => onComplete(card, "partial")}>Partial</button>
              <button onClick={() => onComplete(card, "full")}>Done</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
