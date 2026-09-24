import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  Volume2,
  Languages,
  Landmark,
  HeartPulse,
  WalletCards,
  Wheat,
  GraduationCap,
  BriefcaseBusiness,
  Home,
  Users,
  FileText,
  ChevronRight,
  CheckCircle2,
  X,
  Menu,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  AlertCircle
} from "lucide-react";
import "./styles.css";
import {
  translations,
  schemesData,
  investData,
  lessonsData,
  questionnaire,
  recommendationMap
} from "./translations.js";

const iconMap = {
  kisan: Wheat,
  pmay: Home,
  ayushman: HeartPulse,
  pension: Users,
  education: GraduationCap,
  employment: BriefcaseBusiness
};

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("sahayak_lang") || "en");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState(false);
  const [screen, setScreen] = useState("home");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [toast, setToast] = useState("");

  const t = translations[lang] || translations.en;
  const currentSchemes = schemesData[lang] || schemesData.en;
  const currentInvest = investData[lang] || investData.en;
  const currentLessons = lessonsData[lang] || lessonsData.en;
  const currentQs = questionnaire[lang] || questionnaire.en;

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("sahayak_lang", lang);
  }, [lang]);

  function toggleLang() {
    const nextLang = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    setToast(nextLang === "hi" ? "भाषा बदलकर हिन्दी कर दी गई है" : "Language switched to English");
    setTimeout(() => setToast(""), 3000);
  }

  function speak(x) {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(x);
      u.lang = lang === "hi" ? "hi-IN" : "en-IN";
      speechSynthesis.speak(u);
    } else {
      setToast(t.nav.voiceUnavailable);
      setTimeout(() => setToast(""), 3000);
    }
  }

  const categoryKeys = ["All", "Farmer", "Health", "Housing", "Pension", "Education", "Employment"];

  const filteredSchemes = currentSchemes.filter((s) => {
    const matchCat = cat === "All" || s.c === cat;
    const searchTerms = `${s.t} ${s.c} ${s.cLabel || ""} ${s.d}`.toLowerCase();
    const matchQuery = searchTerms.includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  function startFinder() {
    setScreen("finder");
    setStep(0);
    setAnswers({});
    window.scrollTo(0, 0);
  }

  function handleAnswer(val) {
    const nextAnswers = { ...answers, [currentQs[step].id]: val };
    setAnswers(nextAnswers);
    if (step < currentQs.length - 1) {
      setStep(step + 1);
    } else {
      setScreen("result");
    }
  }

  function getRecommendations() {
    const a = answers;
    const rMap = recommendationMap[lang];
    if (a.need === "health") {
      return [rMap.ayushman, rMap.health_insurance, rMap.emergency_fund];
    }
    if (a.need === "scheme" && a.profile === "farmer") {
      return [rMap.pm_kisan, rMap.farmer_schemes, rMap.savings_account];
    }
    if (a.need === "edu_emp") {
      return [rMap.education_support, rMap.employment_support, rMap.savings_account];
    }
    if (a.money === "invest_long") {
      return [rMap.ppf, rMap.index_funds, rMap.sip];
    }
    return [rMap.emergency_fund, rMap.fd, rMap.govt_schemes];
  }

  return (
    <div>
      {/* Navigation */}
      <header className="nav">
        <a className="brand" href="#home" onClick={() => setScreen("home")}>
          <span className="mark">स</span>
          <b>
            {t.nav.brand}
            <small>{t.nav.tagline}</small>
          </b>
        </a>

        <nav className={menu ? "links open" : "links"}>
          {[
            ["home", t.nav.home],
            ["schemes", t.nav.schemes],
            ["health", t.nav.health],
            ["invest", t.nav.invest],
            ["learn", t.nav.learn]
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="actions">
          <button
            onClick={() => speak(t.nav.speechWelcome)}
            title={lang === "hi" ? "बोलकर सुनें" : "Listen to introduction"}
            aria-label="Listen"
          >
            <Volume2 size={17} />
          </button>

          <button
            className="lang-toggle"
            onClick={toggleLang}
            title={lang === "en" ? "हिन्दी में बदलें (Switch to Hindi)" : "Switch to English"}
          >
            <Languages size={17} />
            <span>{t.nav.langSwitchLabel}</span>
            <span className="lang-badge">{t.nav.currentLangTag}</span>
          </button>

          <button className="mobile" onClick={() => setMenu(!menu)} aria-label="Toggle Menu">
            <Menu />
          </button>
        </div>
      </header>

      {/* Main Home Screen */}
      {screen === "home" && (
        <>
          {/* Hero Section */}
          <section className="hero" id="home">
            <div>
              <span className="eyebrow">
                <ShieldCheck /> {t.hero.eyebrow}
              </span>
              <h1>
                {t.hero.title}
                <em>{t.hero.titleHighlight}</em>
              </h1>
              <p>{t.hero.desc}</p>
              <div className="buttons">
                <button className="primary" onClick={startFinder}>
                  {t.hero.btnFind} <ArrowRight />
                </button>
                <a className="secondary" href="#schemes">
                  {t.hero.btnSchemes}
                </a>
              </div>
              <div className="trust">
                {t.hero.trust.map((item, i) => (
                  <span key={i}>✓ {item}</span>
                ))}
              </div>
            </div>

            <div className="visual">
              <div className="circle"></div>
              <div className="guide">
                <small>{t.hero.guideReady}</small>
                <h3>{t.hero.guidePrompt}</h3>
                {[
                  [Landmark, t.hero.guideGovt, "schemes"],
                  [HeartPulse, t.hero.guideHealth, "health"],
                  [WalletCards, t.hero.guideSaving, "invest"]
                ].map(([Icon, title, targetId]) => (
                  <button
                    key={targetId}
                    onClick={() =>
                      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Icon />
                    {title}
                    <ChevronRight />
                  </button>
                ))}
                <button onClick={startFinder}>
                  <Search />
                  {t.hero.guideHelp}
                  <ChevronRight />
                </button>
              </div>
            </div>
          </section>

          {/* Quick Info Bar */}
          <section className="quick">
            {t.quick.map((item, idx) => {
              const icons = [Landmark, HeartPulse, WalletCards];
              const Icon = icons[idx];
              return (
                <div key={idx}>
                  <Icon />
                  <b>{item.title}</b>
                  <span>{item.desc}</span>
                </div>
              );
            })}
          </section>

          {/* Schemes Section */}
          <section className="section" id="schemes">
            <div className="head">
              <div>
                <span className="eyebrow-text">{t.schemesSection.eyebrow}</span>
                <h2>{t.schemesSection.title}</h2>
              </div>
              <p>{t.schemesSection.desc}</p>
            </div>

            <div className="toolbar">
              <div className="search">
                <Search />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.schemesSection.searchPlaceholder}
                />
              </div>
              <div className="chips">
                {categoryKeys.map((k) => (
                  <button
                    className={cat === k ? "active" : ""}
                    onClick={() => setCat(k)}
                    key={k}
                  >
                    {t.schemesSection.categories[k]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid">
              {filteredSchemes.map((s) => {
                const IconComponent = iconMap[s.id] || Wheat;
                return (
                  <article className="card" key={s.id}>
                    <div className={"scheme " + s.tone}>
                      <IconComponent />
                    </div>
                    <span className="tag">{s.cLabel || s.c}</span>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                    <button onClick={() => setSelected(s)}>
                      {t.schemesSection.btnUnderstand} <ArrowRight />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Banner */}
          <section className="banner">
            <div>
              <span className="eyebrow-text">{t.banner.eyebrow}</span>
              <h2>{t.banner.title}</h2>
              <p>{t.banner.desc}</p>
            </div>
            <button className="primary light" onClick={startFinder}>
              {t.banner.btn} <ArrowRight />
            </button>
          </section>

          {/* Health Section */}
          <section className="section" id="health">
            <div className="head">
              <div>
                <span className="eyebrow-text">{t.healthSection.eyebrow}</span>
                <h2>{t.healthSection.title}</h2>
              </div>
              <p>{t.healthSection.desc}</p>
            </div>

            <div className="health">
              <div>
                <HeartPulse className="healthicon" />
                <h3>{t.healthSection.cardTitle}</h3>
                <p>{t.healthSection.cardDesc}</p>
                <div className="checks">
                  {t.healthSection.checks.map((chk, i) => (
                    <span key={i}>✓ {chk}</span>
                  ))}
                </div>
              </div>

              <div className="health-side">
                <div>
                  <b>{t.healthSection.govtTitle}</b>
                  <p>{t.healthSection.govtDesc}</p>
                  <button onClick={() => setSelected(currentSchemes[2])}>
                    {t.healthSection.govtBtn}
                  </button>
                </div>

                <div>
                  <b>{t.healthSection.pvtTitle}</b>
                  <p>{t.healthSection.pvtDesc}</p>
                  <button onClick={() => speak(t.healthSection.pvtSpeech)}>
                    {t.healthSection.pvtBtn}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Investment Section */}
          <section className="section cream" id="invest">
            <div className="head">
              <div>
                <span className="eyebrow-text">{t.investSection.eyebrow}</span>
                <h2>{t.investSection.title}</h2>
              </div>
              <p>{t.investSection.desc}</p>
            </div>

            <div className="grid">
              {currentInvest.map(([name, risk, sym, desc]) => (
                <article className="card invest" key={name}>
                  <div className="symbol">{sym}</div>
                  <span className="tag">
                    {t.investSection.riskPrefix}
                    {risk}
                  </span>
                  <h3>{name}</h3>
                  <p>{desc}</p>
                  <button onClick={() => speak(`${name}. ${desc}`)}>
                    {t.investSection.btnExplain}
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Learn Section */}
          <section className="section" id="learn">
            <div className="center">
              <span className="eyebrow-text">{t.learnSection.eyebrow}</span>
              <h2>{t.learnSection.title}</h2>
              <p>{t.learnSection.desc}</p>
            </div>

            <div className="grid">
              {currentLessons.map(([question, answer]) => (
                <article className="card lesson" key={question}>
                  <BookOpen />
                  <h3>{question}</h3>
                  <p>{answer}</p>
                  <button onClick={() => speak(`${question}. ${answer}`)}>
                    {t.learnSection.btnListen}
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Documents Section */}
          <section className="docs">
            <div>
              <FileText />
              <span className="eyebrow-text">{t.docsSection.eyebrow}</span>
              <h2>{t.docsSection.title}</h2>
              <p>{t.docsSection.desc}</p>
            </div>
            <div>
              {t.docsSection.items.map((doc, i) => (
                <span key={i}>✓ {doc}</span>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Interactive Questionnaire Screen */}
      {screen === "finder" && (
        <main className="finder">
          <button className="back" onClick={() => setScreen("home")}>
            {t.finder.back}
          </button>
          <div className="finderbox">
            <div className="progress">
              {currentQs.map((_, i) => (
                <i className={i <= step ? "done" : ""} key={i} />
              ))}
            </div>
            <span className="eyebrow-text">
              {t.finder.questionNum} {step + 1} {t.finder.of} {currentQs.length}
            </span>
            <h1>{currentQs[step].q}</h1>
            <p>{t.finder.hint}</p>
            <div className="answers">
              {currentQs[step].options.map((opt) => (
                <button onClick={() => handleAnswer(opt.value)} key={opt.value}>
                  {opt.label}
                  <ArrowRight />
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Questionnaire Results Screen */}
      {screen === "result" && (
        <main className="finder">
          <div className="result">
            <div className="resultmark">✓</div>
            <span className="eyebrow-text">{t.finder.resultEyebrow}</span>
            <h1>{t.finder.resultTitle}</h1>
            <p>{t.finder.resultDesc}</p>
            <div className="resultgrid">
              {getRecommendations().map((recItem, idx) => (
                <div key={idx}>
                  <CheckCircle2 />
                  {recItem}
                </div>
              ))}
            </div>
            <button className="primary" onClick={() => setScreen("home")}>
              {t.finder.exploreBtn} <ArrowRight />
            </button>
            <button className="outline" onClick={startFinder}>
              {t.finder.answerAgain}
            </button>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer>
        <div className="brand">
          <span className="mark">स</span>
          <b>
            {t.nav.brand}
            <small>{t.nav.tagline}</small>
          </b>
        </div>
        <p>{t.footer.tagline}</p>
        <span>
          <AlertCircle /> {t.footer.disclaimer}
        </span>
      </footer>

      {/* Scheme Detail Modal */}
      {selected && (
        <div className="modalback" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)} aria-label="Close">
              <X />
            </button>
            <div className={"scheme " + selected.tone}>
              {(() => {
                const IconComponent = iconMap[selected.id] || Wheat;
                return <IconComponent />;
              })()}
            </div>
            <span className="tag">{selected.cLabel || selected.c}</span>
            <h2>{selected.t}</h2>
            <p>{selected.d}</p>
            <h4>{t.modal.whatToUnderstand}</h4>
            <ul>
              {selected.info.map((infoPoint, idx) => (
                <li key={idx}>
                  <CheckCircle2 />
                  {infoPoint}
                </li>
              ))}
            </ul>
            <button
              className="primary"
              onClick={() =>
                speak(`${selected.t}. ${selected.d} ${selected.info.join(" ")}`)
              }
            >
              <Volume2 /> {t.modal.listenBtn}
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);