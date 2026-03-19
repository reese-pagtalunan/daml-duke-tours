import { useState, useEffect, useRef, useCallback } from "react";

// ── Location → Blurb Dictionary ───────────────────────────────────────────────
// Add, remove, or edit entries here. Keys are matched case-insensitively.
const LOCATION_BLURBS = {
  "paris": "Paris, the City of Light, sits along the Seine River in northern France. Home to the Eiffel Tower, the Louvre, and world-renowned cuisine, Paris has been a global centre of art, fashion, and culture for centuries.",
  "tokyo": "Tokyo is Japan's bustling capital, a city where ancient temples stand beside neon-lit skyscrapers. With a population of over thirteen million, it is one of the world's most densely populated cities and a leader in technology, fashion, and food.",
  "new york": "New York City is the most populous city in the United States, a dazzling metropolis of five boroughs spread across islands and coastline. From the bright lights of Times Square to the green expanse of Central Park, New York is a city that never sleeps.",
  "london": "London is the capital of England and the United Kingdom, a city of over two thousand years of history. Sitting on the River Thames, it is home to iconic landmarks such as the Tower of London, Buckingham Palace, and the Houses of Parliament.",
  "sydney": "Sydney is Australia's largest city, famed for its stunning harbour, the iconic Opera House, and the sweeping arc of the Harbour Bridge. With golden beaches, a warm climate, and a vibrant multicultural culture, Sydney is one of the world's most liveable cities.",
  "rome": "Rome, the Eternal City, is the capital of Italy and a living museum of Western civilisation. From the ancient Colosseum and the Roman Forum to the Vatican's Sistine Chapel, Rome layers thousands of years of history into every street and piazza.",
  "dubai": "Dubai is a gleaming city-state on the Persian Gulf, known for record-breaking architecture, luxury shopping, and a bold vision of the future. The Burj Khalifa, the world's tallest building, soars above a skyline that rose almost entirely within a single generation.",
  "cape town": "Cape Town lies at the south-western tip of Africa, flanked by the Atlantic Ocean and the dramatic cliffs of Table Mountain. It is one of the continent's most cosmopolitan cities, blending a rich cultural heritage with breathtaking natural scenery.",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d0d;
    --surface: #161616;
    --border: #2a2a2a;
    --accent: #4B9CD3;
    --accent-dim: #2f7ab8;
    --text-primary: #f0ece4;
    --text-secondary: #7a7570;
    --word-active: #6cb4e8;
    --radius: 4px;
  }

  .tts-root {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1.5rem 5rem;
    font-family: 'DM Mono', monospace;
    color: var(--text-primary);
  }

  .tts-header { width: 100%; max-width: 760px; margin-bottom: 3.5rem; }
  .tts-eyebrow { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); opacity: 0.7; }
  .tts-title { font-family: 'DM Serif Display', serif; font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 400; line-height: 1.1; margin-top: 0.25rem; color: #ffffff; }
  .tts-title em { font-style: italic; color: var(--accent); }

  .tts-card { width: 100%; max-width: 760px; background: var(--surface); border: 1px solid var(--border); border-radius: 2px; }

  .tts-search-section { padding: 1.5rem 1.75rem; border-bottom: 1px solid var(--border); }
  .tts-label { display: block; font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.6rem; }

  .tts-search-row { display: flex; gap: 0.6rem; align-items: stretch; }
  .tts-input-wrap { position: relative; flex: 1; }

  .tts-input {
    width: 100%; background: #111; border: 1px solid var(--border);
    border-radius: var(--radius); padding: 0.65rem 1rem;
    font-family: 'DM Mono', monospace; font-size: 0.85rem;
    color: var(--text-primary); outline: none; transition: border-color 0.2s;
  }
  .tts-input:focus { border-color: var(--accent); }
  .tts-input::placeholder { color: #3a3a3a; }
  .tts-input.error { border-color: #7a2020; }

  .tts-suggestions {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0;
    background: #1c1c1c; border: 1px solid var(--border);
    border-radius: var(--radius); z-index: 10; overflow: hidden;
  }
  .tts-suggestion {
    padding: 0.55rem 1rem; font-size: 0.8rem; color: var(--text-secondary);
    cursor: pointer; transition: background 0.1s, color 0.1s;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .tts-suggestion:hover, .tts-suggestion.highlighted { background: #222; color: var(--text-primary); }

  .tts-lookup-btn {
    font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em;
    text-transform: uppercase; background: var(--accent); color: #0d0d0d;
    border: none; border-radius: var(--radius); padding: 0 1.25rem;
    cursor: pointer; font-weight: 500; transition: background 0.15s; white-space: nowrap;
  }
  .tts-lookup-btn:hover { background: #7ec8f0; }

  .tts-hint { margin-top: 0.5rem; font-size: 0.65rem; color: var(--text-secondary); letter-spacing: 0.04em; }
  .tts-hint.err { color: #c05050; }

  .tts-chips { margin-top: 0.9rem; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .tts-chip {
    font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 0.25rem 0.6rem; border: 1px solid #252525; border-radius: 2px;
    color: #555; cursor: pointer; transition: border-color 0.15s, color 0.15s;
  }
  .tts-chip:hover { border-color: var(--accent-dim); color: var(--accent); }
  .tts-chip.active { border-color: var(--accent); color: var(--accent); }

  .tts-display-section { padding: 1.75rem 1.75rem 2rem; border-bottom: 1px solid var(--border); }
  .tts-display-label {
    font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--text-secondary); margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .tts-location-tag { margin-left: auto; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); opacity: 0.8; }
  .tts-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 1s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)} }

  .tts-words { font-family: 'DM Serif Display', serif; font-size: clamp(1rem, 2.5vw, 1.3rem); line-height: 1.9; color: #a09a92; user-select: none; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; width: 100%; }
  .tts-empty { font-family: 'DM Serif Display', serif; font-size: 1.1rem; font-style: italic; color: #2e2e2e; }
  .word { display: inline; margin-right: 0.28em; transition: color 0.1s, text-shadow 0.1s; }
  .word.active { color: var(--word-active); text-shadow: 0 0 24px rgba(75,156,211,0.35); }
  .word.pending { color: #a09a92; }

  .tts-progress-bar { height: 2px; background: #1f1f1f; }
  .tts-progress-fill { height: 100%; background: var(--accent); transition: width 0.15s linear; box-shadow: 0 0 8px rgba(75,156,211,0.5); }

  .tts-controls { padding: 1.25rem 1.75rem; display: flex; align-items: center; gap: 0.75rem; }
  .tts-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    font-family: 'DM Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
    cursor: pointer; border: 1px solid var(--border); border-radius: var(--radius);
    padding: 0.55rem 1.1rem; background: transparent; color: var(--text-secondary); transition: all 0.15s;
  }
  .tts-btn:hover:not(:disabled) { border-color: #444; color: var(--text-primary); }
  .tts-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .tts-btn-play { background: var(--accent); border-color: var(--accent); color: #0d0d0d; font-weight: 500; padding: 0.55rem 1.5rem; }
  .tts-btn-play:hover:not(:disabled) { background: #7ec8f0; border-color: #7ec8f0; color: #0d0d0d; }

  .tts-counter { margin-left: auto; font-size: 0.65rem; color: var(--text-secondary); }
  .tts-counter span { color: var(--accent); }

  .tts-status { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.28rem 0.6rem; border-radius: 2px; border: 1px solid; }
  .tts-status.idle   { color: #555; border-color: #252525; }
  .tts-status.playing { color: var(--accent); border-color: var(--accent-dim); }
  .tts-status.paused  { color: #888; border-color: #333; }
  .tts-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .tts-status.playing .tts-dot { animation: pulse 0.8s infinite; }

  

  .tts-sliders { padding: 0 1.75rem 1.5rem; display: flex; gap: 2rem; flex-wrap: wrap; }
  .tts-slider-group { display: flex; flex-direction: column; gap: 0.4rem; min-width: 140px; flex: 1; }
  .tts-slider-header { display: flex; justify-content: space-between; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-secondary); }
  .tts-slider-header span { color: var(--accent); }
  input[type=range] { -webkit-appearance: none; width: 100%; height: 2px; background: var(--border); border-radius: 2px; outline: none; cursor: pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 6px rgba(75,156,211,0.4); }
`;

const PlayIcon = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><polygon points="2,1 10,5.5 2,10"/></svg>;
const PauseIcon = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="2" y="1" width="3" height="9" rx="1"/><rect x="6" y="1" width="3" height="9" rx="1"/></svg>;
const RestartIcon = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 5.5A4 4 0 1 1 7 2.1"/><polyline points="7,0.5 7,2.5 9,2.5" fill="none"/></svg>;

export default function TextToSpeech() {
  const [query, setQuery] = useState("");
  const [activeLocation, setActiveLocation] = useState(null);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const [status, setStatus] = useState("idle");
  const [wordIndex, setWordIndex] = useState(-1);

  const [rate, setRate] = useState(1);

  const utterRef = useRef(null);
  const locationKeys = Object.keys(LOCATION_BLURBS);
  const text = activeLocation ? LOCATION_BLURBS[activeLocation] : "";
  const words = text.trim().split(/\s+/).filter(Boolean);
  const progress = wordIndex < 0 ? 0 : Math.round(((wordIndex + 1) / words.length) * 100);

  const suggestions = query.trim()
    ? locationKeys.filter(k => k.includes(query.toLowerCase().trim()))
    : [];



  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const speak = useCallback((startWord = 0) => {
    window.speechSynthesis.cancel();
    const remaining = words.slice(startWord).join(" ");
    if (!remaining) return;
    const utter = new SpeechSynthesisUtterance(remaining);
    utter.rate = rate;
    let local = startWord;
    utter.onboundary = (e) => { if (e.name === "word") { setWordIndex(local); local++; } };
    utter.onend = () => { setStatus("idle"); setWordIndex(words.length - 1); };
    utter.onerror = () => setStatus("idle");
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setStatus("playing");
  }, [words, rate]);

  const handleLookup = (key) => {
    const normalized = (key || query).toLowerCase().trim();
    setShowSuggestions(false);
    if (LOCATION_BLURBS[normalized]) {
      setActiveLocation(normalized);
      setQuery(normalized.replace(/\b\w/g, c => c.toUpperCase()));
      setError("");
      window.speechSynthesis.cancel();
      setStatus("idle");
      setWordIndex(-1);
    } else {
      setError(`No blurb found for "${key || query}"`);
      setActiveLocation(null);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || !suggestions.length) { if (e.key === "Enter") handleLookup(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter") { e.preventDefault(); if (highlightIdx >= 0) handleLookup(suggestions[highlightIdx]); else handleLookup(); setHighlightIdx(-1); }
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const handlePlay = () => {
    if (status === "paused") { window.speechSynthesis.resume(); setStatus("playing"); }
    else speak(Math.max(wordIndex, 0));
  };
  const handlePause = () => { window.speechSynthesis.pause(); setStatus("paused"); };
  const handleRestart = () => { setWordIndex(-1); speak(0); };

  const pretty = (k) => k.replace(/\b\w/g, c => c.toUpperCase());
  const statusLabel = { idle: "Idle", playing: "Playing", paused: "Paused" }[status];

  return (
    <>
      <style>{styles}</style>
      <div className="tts-root" onClick={() => setShowSuggestions(false)}>
        <header className="tts-header">
          <span className="tts-eyebrow">Duke Campus Tour Audio Guide</span>
          <h1 className="tts-title">Explore <em>Duke University</em></h1>
        </header>

        <div className="tts-card" onClick={e => e.stopPropagation()}>

          {/* Search */}
          <section className="tts-search-section">
            <label className="tts-label">Location Name</label>
            <div className="tts-search-row">
              <div className="tts-input-wrap">
                <input
                  className={`tts-input${error ? " error" : ""}`}
                  placeholder="Perkins Library, Marketplace, Bostock Library…"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setError(""); setShowSuggestions(true); setHighlightIdx(-1); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="tts-suggestions">
                    {suggestions.map((k, i) => (
                      <div key={k} className={`tts-suggestion${i === highlightIdx ? " highlighted" : ""}`} onMouseDown={() => handleLookup(k)}>
                        📍 {pretty(k)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="tts-lookup-btn" onClick={() => handleLookup()}>Look up</button>
            </div>
            {error
              ? <p className="tts-hint err">{error}</p>
              : <p className="tts-hint">Type a location and press Look up.</p>
            }
          </section>

          {/* Display */}
          <section className="tts-display-section">
            <div className="tts-display-label">
              {status === "playing" && <span className="tts-pulse" />}
              Transcript
              {activeLocation && <span className="tts-location-tag">📍 {pretty(activeLocation)}</span>}
            </div>
            {text ? (
              <div className="tts-words">
                {words.map((w, i) => (
                  <span key={i} className={`word ${i === wordIndex ? "active" : i < wordIndex ? "" : "pending"}`}>{w}</span>
                ))}
              </div>
            ) : (
              <p className="tts-empty">Search for a location to load its audio guide…</p>
            )}
          </section>

          <div className="tts-progress-bar">
            <div className="tts-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Controls */}
          <div className="tts-controls">
            {status === "playing"
              ? <button className="tts-btn tts-btn-play" onClick={handlePause}><PauseIcon /> Pause</button>
              : <button className="tts-btn tts-btn-play" onClick={handlePlay} disabled={!text}><PlayIcon /> {status === "paused" ? "Resume" : "Play"}</button>
            }
            <button className="tts-btn" onClick={handleRestart} disabled={!text}><RestartIcon /> Restart</button>
            <div className={`tts-status ${status}`}><span className="tts-dot" /> {statusLabel}</div>
            <span className="tts-counter"><span>{Math.max(wordIndex + 1, 0)}</span> / {words.length} words</span>
          </div>

          {/* Sliders */}
          <div className="tts-sliders">
            <div className="tts-slider-group">
              <div className="tts-slider-header"><span>Speed</span><span>{rate.toFixed(1)}×</span></div>
              <input type="range" min="0.5" max="2" step="0.1" value={rate}
                onChange={e => setRate(parseFloat(e.target.value))} disabled={status === "playing"} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}