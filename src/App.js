import { useState, useRef, useEffect } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAILY_CONTENT = {
  Sunday: {
    quote: "Every dawn is the universe whispering — you get to begin again.",
    rituals: [
      "🌅 Watch the light change this morning, even for just one minute",
      "🫖 Make something warm and hold it with both hands — feel present",
      "📓 Write three things that are quietly good in your life right now",
      "🌿 Step outside and breathe the morning air — let it reset you",
      "💜 Give yourself full permission to move slowly today",
    ],
  },
  Monday: {
    quote: "Like the dawn, you bring light simply by showing up.",
    rituals: [
      "☀️ Before anything else, take three deep breaths and set one gentle intention",
      "🎵 Play a song that makes you feel like the best version of yourself",
      "💧 Drink a full glass of water first thing — gift your body its first nourishment",
      "🌸 Wear something today that makes you feel like you",
      "✨ Remind yourself: your presence is enough",
    ],
  },
  Tuesday: {
    quote: "Growth doesn't happen all at once — it happens in quiet, tender moments like this one.",
    rituals: [
      "🧘 Stretch your body slowly for five minutes — move without judgment",
      "🍓 Eat something colorful today and savor every bite",
      "💌 Send a message to someone who lifts your spirit",
      "🌺 Notice one beautiful thing in your surroundings right now",
      "🫶 Place a hand on your heart and say: I am doing my best",
    ],
  },
  Wednesday: {
    quote: "You are not behind. You are exactly where your dawn finds you.",
    rituals: [
      "🪞 Look at yourself with soft eyes today — with wonder, not judgment",
      "🌱 Tend to something living — a plant, a relationship, a dream",
      "📖 Read something purely for pleasure, even just one page",
      "🌬️ When stress rises, breathe out longer than you breathe in",
      "💐 Do one small thing today just because it brings you joy",
    ],
  },
  Thursday: {
    quote: "Even the darkest night yields to the dawn — and so will this.",
    rituals: [
      "🕯️ If today feels heavy, light something — a candle, your favorite scent",
      "🚶 Take a slow walk and let your mind wander freely",
      "🎨 Create something tiny — a doodle, a rearranged space, a new recipe",
      "🌙 Name what you're feeling without trying to fix it",
      "💜 Remind yourself: hard days are part of growing",
    ],
  },
  Friday: {
    quote: "You have risen every single day this week — that is its own kind of magic.",
    rituals: [
      "💃 Dance to one song in your own space — no audience needed",
      "🌟 Celebrate one thing — anything — from your week",
      "🛁 Do a small self-care ritual tonight purely for yourself",
      "🌸 Tell someone you appreciate them — and include yourself",
      "✨ Release what didn't go perfectly — it was still a dawn worth having",
    ],
  },
  Saturday: {
    quote: "The dawn has no agenda. Today, neither do you.",
    rituals: [
      "🌅 Wake without an alarm if you can — let your body lead",
      "☕ Make your morning drink exactly as you love it — slowly, luxuriously",
      "🌳 Spend time somewhere with sky above you today",
      "📸 Photograph something that catches your eye — just for you",
      "🌸 Ask yourself: what does my soul need today? Then honor the answer",
    ],
  },
};

const CHAT_SYSTEM_PROMPT = `You are Aurora — the warm, wise AI companion inside Dawn, a self-care app for women. Your name reflects the first light of dawn — gentle, radiant, full of new possibility.

Your nature:
- You speak with the warmth of a trusted friend and the wisdom of someone who truly sees you
- Your words feel like the first light of morning — soft, hopeful, and full of gentle clarity
- You use dawn, light, and sunrise metaphors naturally but sparingly
- You never minimize feelings or rush someone past pain
- You hold space for hard days as tenderly as beautiful ones
- You celebrate every small act of self-love as the profound thing it is

Your boundaries:
- You only speak on self-care, self-love, emotional wellness, mindfulness, inner growth, body appreciation, and personal flourishing
- For serious mental health crises, gently and warmly encourage professional support
- Never give medical advice
- Responses are 2-4 short paragraphs — warm, flowing prose, never bullet points
- Always close with a soft question or a gentle encouraging nudge
- You are a safe, judgment-free haven — every woman who finds you deserves to feel seen and cherished

You are the gentle voice that reminds her: every day is a new dawn, and she is worthy of its light.`;

export default function DawnApp() {
  const today = new Date().getDay();
  const [activeTab, setActiveTab] = useState("today");
  const [selectedDay, setSelectedDay] = useState(today);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome, beautiful soul 🌅 I'm Aurora, your companion here at Dawn. This is your safe, gentle space — no expectations, no judgment, just you. How are you feeling as this new day begins?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMsg = { role: "user", content: inputValue.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: CHAT_SYSTEM_PROMPT,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.map((b) => b.text || "").join("") || "I'm here with you 🌅";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Something gentle got in the way 🌸 I'm still here — please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const todayContent = DAILY_CONTENT[DAYS[today]];
  const dayContent = DAILY_CONTENT[DAYS[selectedDay]];

  return (
    <div style={{
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fff5f9 0%, #f8f0ff 40%, #fce8f4 70%, #fff0e8 100%)",
      color: "#3a2040",
      position: "relative",
      overflowX: "hidden",
    }}>

      {/* Sunrise glow top */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "280px",
        background: "linear-gradient(180deg, rgba(255,180,200,0.25) 0%, rgba(255,150,220,0.1) 50%, transparent 100%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Soft orbs */}
      <div style={{ position: "fixed", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,160,255,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", left: "-60px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,160,200,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "40%", left: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,150,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Floating petals */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", fontSize: ["12px","10px","14px","11px","13px","10px"][i],
            left: `${[8,22,45,60,75,88][i]}%`, top: "-20px", opacity: 0.12,
            animation: `petalFall ${[14,19,16,22,15,18][i]}s linear ${[0,4,7,2,9,5][i]}s infinite`,
          }}>🌸</div>
        ))}
      </div>

      {/* Header */}
      <header style={{ textAlign: "center", padding: "44px 20px 16px", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.45em", textTransform: "uppercase", color: "#c080b0", marginBottom: "10px" }}>
          a new beginning, every day
        </div>
        <h1 style={{
          fontSize: "clamp(52px, 10vw, 80px)", fontWeight: "400", margin: 0,
          background: "linear-gradient(135deg, #c060a0 0%, #9050c0 40%, #e080b0 80%, #c8785a 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "0.12em", lineHeight: 1,
        }}>dawn</h1>
        <div style={{ fontSize: "13px", color: "#c090b8", marginTop: "8px", fontStyle: "italic", letterSpacing: "0.05em" }}>
          rise gently · grow softly · love fully
        </div>
        {/* Sunrise line */}
        <div style={{ margin: "18px auto 0", width: "80px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(200,120,90,0.4), #e080b0, rgba(200,120,90,0.4), transparent)" }} />
        <div style={{ margin: "4px auto 0", width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(200,120,180,0.3), transparent)" }} />
      </header>

      {/* Navigation */}
      <nav style={{ display: "flex", justifyContent: "center", gap: "6px", padding: "16px 20px 20px", position: "relative", zIndex: 1 }}>
        {[
          { id: "today", label: "✦ Today" },
          { id: "week", label: "◇ My Week" },
          { id: "chat", label: "❋ Aurora" },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "10px 24px", borderRadius: "30px",
            border: activeTab === tab.id ? "none" : "1px solid rgba(180,100,160,0.25)",
            background: activeTab === tab.id
              ? "linear-gradient(135deg, #c060a0, #9050c0)"
              : "rgba(255,255,255,0.45)",
            color: activeTab === tab.id ? "white" : "#b070a0",
            fontSize: "13px", cursor: "pointer",
            fontFamily: "Palatino Linotype, serif",
            letterSpacing: "0.05em",
            transition: "all 0.3s ease",
            boxShadow: activeTab === tab.id ? "0 6px 24px rgba(144,80,192,0.3)" : "none",
            backdropFilter: "blur(8px)",
          }}>{tab.label}</button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "0 20px 80px", position: "relative", zIndex: 1 }}>

        {/* TODAY */}
        {activeTab === "today" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span style={{
                background: "rgba(255,255,255,0.6)", border: "1px solid rgba(192,96,160,0.25)",
                borderRadius: "20px", padding: "6px 20px", fontSize: "12px",
                color: "#b070a0", letterSpacing: "0.12em", backdropFilter: "blur(8px)",
              }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>

            {/* Sunrise quote card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(248,240,255,0.6))",
              border: "1px solid rgba(192,96,160,0.2)",
              borderRadius: "28px", padding: "36px 32px",
              marginBottom: "24px", textAlign: "center",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 40px rgba(144,80,192,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Sunrise decoration */}
              <div style={{
                position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                width: "200px", height: "100px",
                background: "radial-gradient(ellipse at bottom, rgba(255,160,100,0.08) 0%, transparent 70%)",
              }} />
              <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.7 }}>🌅</div>
              <p style={{
                fontSize: "clamp(15px, 3vw, 19px)", fontStyle: "italic",
                lineHeight: "1.75", color: "#5a2050", margin: 0, position: "relative", zIndex: 1,
              }}>
                {todayContent.quote}
              </p>
              <div style={{ marginTop: "16px", fontSize: "11px", color: "#c090b8", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                today's dawn reflection
              </div>
            </div>

            {/* Rituals */}
            <div style={{ fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#c090b8", marginBottom: "14px" }}>
              ✦ gentle invitations for today
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {todayContent.rituals.map((ritual, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(192,96,160,0.15)",
                  borderRadius: "18px", padding: "16px 22px",
                  fontSize: "15px", lineHeight: "1.55", color: "#4a2545",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 16px rgba(144,80,192,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "default",
                  animationDelay: `${i * 0.1}s`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(144,80,192,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(144,80,192,0.05)"; }}
                >
                  {ritual}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "32px", fontSize: "13px", color: "#c8a0c0", fontStyle: "italic" }}>
              No checkboxes. No pressure. Just your dawn. 🌸
            </div>
          </div>
        )}

        {/* WEEK */}
        {activeTab === "week" && (
          <div>
            {/* Day pills */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "28px", overflowX: "auto", paddingBottom: "6px" }}>
              {DAYS.map((day, idx) => (
                <button key={day} onClick={() => setSelectedDay(idx)} style={{
                  flex: "0 0 auto", padding: "10px 14px", borderRadius: "16px", minWidth: "52px",
                  border: selectedDay === idx ? "none" : "1px solid rgba(180,100,160,0.25)",
                  background: selectedDay === idx
                    ? "linear-gradient(135deg, #c060a0, #9050c0)"
                    : idx === today ? "rgba(192,96,160,0.08)" : "rgba(255,255,255,0.45)",
                  color: selectedDay === idx ? "white" : idx === today ? "#c060a0" : "#b070a0",
                  fontSize: "12px", cursor: "pointer",
                  fontFamily: "Palatino Linotype, serif", textAlign: "center",
                  boxShadow: selectedDay === idx ? "0 4px 18px rgba(144,80,192,0.28)" : "none",
                  transition: "all 0.2s ease", backdropFilter: "blur(8px)",
                }}>
                  <div style={{ fontWeight: "600" }}>{SHORT_DAYS[idx]}</div>
                  {idx === today && <div style={{ fontSize: "8px", marginTop: "2px", opacity: 0.8 }}>today</div>}
                </button>
              ))}
            </div>

            {/* Day header */}
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "400", color: "#5a2050", margin: "0 0 6px" }}>{DAYS[selectedDay]}</h2>
              <div style={{ width: "50px", height: "2px", background: "linear-gradient(90deg, #c060a0, #9050c0)", borderRadius: "2px" }} />
            </div>

            {/* Quote */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(248,240,255,0.5))",
              border: "1px solid rgba(192,96,160,0.18)",
              borderRadius: "22px", padding: "26px 24px", marginBottom: "18px",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c090b8", marginBottom: "12px" }}>✦ dawn reflection</div>
              <p style={{ fontSize: "16px", fontStyle: "italic", color: "#5a2050", margin: 0, lineHeight: "1.7" }}>
                "{dayContent.quote}"
              </p>
            </div>

            {/* Rituals */}
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c090b8", marginBottom: "12px" }}>✦ gentle invitations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dayContent.rituals.map((ritual, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.5)", border: "1px solid rgba(192,96,160,0.15)",
                  borderRadius: "16px", padding: "14px 20px", fontSize: "14px",
                  lineHeight: "1.55", color: "#4a2545", backdropFilter: "blur(6px)",
                }}>
                  {ritual}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAT */}
        {activeTab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 300px)", minHeight: "420px" }}>
            {/* Aurora header */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.65), rgba(248,240,255,0.5))",
              border: "1px solid rgba(192,96,160,0.2)",
              borderRadius: "22px", padding: "16px 20px", marginBottom: "16px",
              display: "flex", alignItems: "center", gap: "14px",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #c060a0, #9050c0, #e08060)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", boxShadow: "0 6px 20px rgba(144,80,192,0.3)",
              }}>🌅</div>
              <div>
                <div style={{ fontWeight: "600", color: "#5a2050", fontSize: "16px", letterSpacing: "0.05em" }}>Aurora</div>
                <div style={{ fontSize: "12px", color: "#c090b8", fontStyle: "italic" }}>your dawn companion · always here</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingRight: "2px", marginBottom: "14px" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "83%",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #c060a0, #9050c0)"
                      : "rgba(255,255,255,0.65)",
                    color: msg.role === "user" ? "white" : "#4a2545",
                    padding: "14px 18px",
                    borderRadius: msg.role === "user" ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
                    fontSize: "14px", lineHeight: "1.7",
                    border: msg.role === "assistant" ? "1px solid rgba(192,96,160,0.18)" : "none",
                    boxShadow: msg.role === "user" ? "0 4px 18px rgba(144,80,192,0.28)" : "0 2px 12px rgba(0,0,0,0.04)",
                    backdropFilter: msg.role === "assistant" ? "blur(8px)" : "none",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.65)", border: "1px solid rgba(192,96,160,0.18)",
                    borderRadius: "22px 22px 22px 6px", padding: "14px 22px",
                    backdropFilter: "blur(8px)",
                  }}>
                    <span style={{ fontSize: "22px", letterSpacing: "4px", color: "#c090b8" }}>
                      <span style={{ animation: "dotPulse 1.4s ease-in-out infinite" }}>·</span>
                      <span style={{ animation: "dotPulse 1.4s ease-in-out 0.3s infinite" }}>·</span>
                      <span style={{ animation: "dotPulse 1.4s ease-in-out 0.6s infinite" }}>·</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{
              display: "flex", gap: "10px", alignItems: "center",
              background: "rgba(255,255,255,0.65)", border: "1px solid rgba(192,96,160,0.25)",
              borderRadius: "22px", padding: "8px 8px 8px 20px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px rgba(144,80,192,0.08)",
            }}>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Share what's on your heart…"
                style={{
                  flex: 1, border: "none", background: "transparent",
                  fontSize: "14px", color: "#4a2545", outline: "none",
                  fontFamily: "Palatino Linotype, serif",
                  fontStyle: inputValue ? "normal" : "italic",
                }}
              />
              <button onClick={sendMessage} disabled={isLoading || !inputValue.trim()} style={{
                background: inputValue.trim() ? "linear-gradient(135deg, #c060a0, #9050c0)" : "rgba(192,96,160,0.15)",
                border: "none", borderRadius: "16px", width: "46px", height: "46px",
                cursor: inputValue.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", transition: "all 0.2s ease", flexShrink: 0,
                boxShadow: inputValue.trim() ? "0 4px 16px rgba(144,80,192,0.3)" : "none",
              }}>
                {isLoading ? "🌸" : "✦"}
              </button>
            </div>
            <div style={{ textAlign: "center", fontSize: "11px", color: "#c8a0c0", marginTop: "10px", fontStyle: "italic" }}>
              A safe, judgment-free space — your dawn sanctuary 💜
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes dotPulse { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes petalFall {
          0%{transform:translateY(-20px) rotate(0deg);opacity:0}
          10%{opacity:0.12}
          90%{opacity:0.12}
          100%{transform:translateY(100vh) rotate(380deg);opacity:0}
        }
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(192,96,160,0.25);border-radius:4px}
        *{box-sizing:border-box}
      `}</style>
    </div>
  );
}
