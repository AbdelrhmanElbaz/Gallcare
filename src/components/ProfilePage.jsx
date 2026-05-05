import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { uploadService } from "../services/upload.service.js";
import { medicalService } from "../services/medical.service.js";

// ─── Mock analysis history (replace with real API when backend is ready) ──────
const MOCK_ANALYSES = [
  {
    id: 1,
    date: "2025-04-28T10:23:00Z",
    image_name: "liver_scan_april.jpg",
    verdict: "Healthy",
    confidence: 92,
    primary_finding: "No significant abnormalities detected in hepatic parenchyma.",
    recommendation: "Continue routine check-ups every 6 months.",
    indicators: [
      { label: "Liver Texture", value: "Homogeneous", status: "normal" },
      { label: "Echogenicity", value: "Normal", status: "normal" },
      { label: "Bile Duct", value: "Not dilated", status: "normal" },
    ],
  },
  {
    id: 2,
    date: "2025-03-15T09:10:00Z",
    image_name: "gallbladder_ct.png",
    verdict: "Diseased",
    confidence: 87,
    primary_finding: "Hyperechoic foci suggestive of gallstones with posterior acoustic shadowing.",
    recommendation: "Consult a gastroenterologist for further evaluation and possible cholecystectomy.",
    indicators: [
      { label: "Gallbladder Wall", value: "Thickened (5mm)", status: "abnormal" },
      { label: "Gallstones", value: "Multiple, 8–12mm", status: "abnormal" },
      { label: "Bile Duct", value: "Mildly dilated", status: "borderline" },
    ],
  },
  {
    id: 3,
    date: "2025-02-02T14:45:00Z",
    image_name: "abdominal_mri.jpg",
    verdict: "Inconclusive",
    confidence: 61,
    primary_finding: "Image quality insufficient for definitive classification.",
    recommendation: "Repeat scan with higher resolution imaging equipment.",
    indicators: [
      { label: "Image Quality", value: "Poor", status: "abnormal" },
      { label: "Liver Visibility", value: "Partial", status: "borderline" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const verdictColor = (v) =>
  v === "Healthy" ? "#0abfaa" : v === "Diseased" ? "#ff6b6b" : "#f5a623";
const verdictBg = (v) =>
  v === "Healthy"
    ? "rgba(10,191,170,0.1)"
    : v === "Diseased"
    ? "rgba(255,107,107,0.1)"
    : "rgba(245,166,35,0.1)";
const verdictIcon = (v) =>
  v === "Healthy" ? "✅" : v === "Diseased" ? "⚠️" : "❓";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analyses");
  const [uploads, setUploads] = useState([]);
  const [analyses] = useState(MOCK_ANALYSES);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [loadingUploads, setLoadingUploads] = useState(true);

  useEffect(() => {
    uploadService
      .getHistory()
      .then(setUploads)
      .catch(() => {})
      .finally(() => setLoadingUploads(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const initials =
    user
      ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
      : "??";

  const healthyCount = analyses.filter((a) => a.verdict === "Healthy").length;
  const diseasedCount = analyses.filter((a) => a.verdict === "Diseased").length;
  const avgConfidence = analyses.length
    ? Math.round(analyses.reduce((s, a) => s + a.confidence, 0) / analyses.length)
    : 0;

  return (
    <div style={S.page}>
      {/* ── Navbar ── */}
      <header style={S.nav}>
        <div style={S.navInner}>
          <button style={S.backBtn} onClick={() => navigate("/home")} type="button">
            ← Back to Home
          </button>
          <div style={S.navLogo}>
            <span>💚</span>
            <span style={S.navLogoText}>GallCare</span>
          </div>
          <button style={S.logoutBtn} onClick={handleLogout} type="button">
            Sign Out
          </button>
        </div>
      </header>

      <main style={S.main}>
        {/* ── Profile Hero ── */}
        <div style={S.profileHero}>
          <div style={S.heroBg} />
          <div style={S.heroContent}>
            {/* Avatar */}
            <div style={S.avatar}>{initials}</div>

            {/* Info */}
            <div style={S.heroInfo}>
              <h1 style={S.heroName}>
                {user?.first_name ?? "—"} {user?.last_name ?? ""}
              </h1>
              <p style={S.heroEmail}>{user?.email ?? "—"}</p>
              <div style={S.heroBadges}>
                <span style={S.badge}>🩺 Patient</span>
                <span style={S.badge}>📍 GallCare Member</span>
              </div>
            </div>

            {/* Stats */}
            <div style={S.heroStats}>
              <div style={S.statBox}>
                <span style={{ ...S.statNum, color: "#0abfaa" }}>{analyses.length}</span>
                <span style={S.statLabel}>Total Scans</span>
              </div>
              <div style={S.statDivider} />
              <div style={S.statBox}>
                <span style={{ ...S.statNum, color: "#0abfaa" }}>{healthyCount}</span>
                <span style={S.statLabel}>Healthy</span>
              </div>
              <div style={S.statDivider} />
              <div style={S.statBox}>
                <span style={{ ...S.statNum, color: "#ff6b6b" }}>{diseasedCount}</span>
                <span style={S.statLabel}>Diseased</span>
              </div>
              <div style={S.statDivider} />
              <div style={S.statBox}>
                <span style={{ ...S.statNum, color: "#f5a623" }}>{avgConfidence}%</span>
                <span style={S.statLabel}>Avg. Confidence</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={S.tabBar}>
          {[
            { id: "analyses", icon: "🔬", label: "Analysis History" },
            { id: "uploads", icon: "🖼️", label: "Uploaded Scans" },
            { id: "info", icon: "👤", label: "Personal Info" },
          ].map((tab) => (
            <button
              key={tab.id}
              style={{
                ...S.tab,
                ...(activeTab === tab.id ? S.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div style={S.tabContent}>

          {/* ══ Analysis History Tab ══ */}
          {activeTab === "analyses" && (
            <div style={S.analysesLayout}>
              {/* List */}
              <div style={S.analysisList}>
                <div style={S.listHeader}>
                  <h2 style={S.listTitle}>Past Analyses</h2>
                  <button
                    style={S.newScanBtn}
                    onClick={() => navigate("/process")}
                    type="button"
                  >
                    + New Scan
                  </button>
                </div>

                {analyses.length === 0 ? (
                  <div style={S.emptyBox}>
                    <span style={{ fontSize: "3rem" }}>🩻</span>
                    <p style={S.emptyText}>No analyses yet. Upload a scan to get started.</p>
                    <button
                      style={S.newScanBtn}
                      onClick={() => navigate("/process")}
                      type="button"
                    >
                      Analyze a Scan
                    </button>
                  </div>
                ) : (
                  analyses.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        ...S.analysisCard,
                        ...(selectedAnalysis?.id === a.id ? S.analysisCardActive : {}),
                      }}
                      onClick={() =>
                        setSelectedAnalysis(selectedAnalysis?.id === a.id ? null : a)
                      }
                    >
                      {/* Verdict badge */}
                      <div
                        style={{
                          ...S.verdictBadge,
                          background: verdictBg(a.verdict),
                          color: verdictColor(a.verdict),
                          border: `1px solid ${verdictColor(a.verdict)}33`,
                        }}
                      >
                        {verdictIcon(a.verdict)} {a.verdict}
                      </div>

                      <div style={S.cardMeta}>
                        <p style={S.cardImageName}>🩻 {a.image_name}</p>
                        <p style={S.cardDate}>
                          {formatDate(a.date)} · {formatTime(a.date)}
                        </p>
                      </div>

                      <p style={S.cardFinding}>{a.primary_finding}</p>

                      {/* Confidence bar */}
                      <div style={S.confBar}>
                        <div style={S.confTrack}>
                          <div
                            style={{
                              ...S.confFill,
                              width: `${a.confidence}%`,
                              background: verdictColor(a.verdict),
                            }}
                          />
                        </div>
                        <span
                          style={{
                            ...S.confNum,
                            color: verdictColor(a.verdict),
                          }}
                        >
                          {a.confidence}%
                        </span>
                      </div>

                      <p style={S.viewDetail}>
                        {selectedAnalysis?.id === a.id ? "▲ Hide details" : "▼ View details"}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Detail Panel */}
              {selectedAnalysis && (
                <div style={S.detailPanel}>
                  <div style={S.detailHeader}>
                    <div
                      style={{
                        ...S.detailVerdict,
                        color: verdictColor(selectedAnalysis.verdict),
                        background: verdictBg(selectedAnalysis.verdict),
                        border: `1.5px solid ${verdictColor(selectedAnalysis.verdict)}44`,
                      }}
                    >
                      <span style={{ fontSize: "2rem" }}>
                        {verdictIcon(selectedAnalysis.verdict)}
                      </span>
                      <div>
                        <p style={S.detailVerdictLabel}>Diagnosis</p>
                        <p
                          style={{
                            ...S.detailVerdictText,
                            color: verdictColor(selectedAnalysis.verdict),
                          }}
                        >
                          {selectedAnalysis.verdict}
                        </p>
                      </div>
                      <div style={S.detailConfidence}>
                        <span
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: verdictColor(selectedAnalysis.verdict),
                          }}
                        >
                          {selectedAnalysis.confidence}%
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#5e7b8c" }}>confidence</span>
                      </div>
                    </div>
                  </div>

                  <div style={S.detailSection}>
                    <p style={S.detailSectionLabel}>Primary Finding</p>
                    <p style={S.detailText}>{selectedAnalysis.primary_finding}</p>
                  </div>

                  <div style={S.detailSection}>
                    <p style={S.detailSectionLabel}>Diagnostic Indicators</p>
                    {selectedAnalysis.indicators.map((ind, i) => (
                      <div key={i} style={S.indRow}>
                        <span style={S.indLabel}>{ind.label}</span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={S.indValue}>{ind.value}</span>
                          <span
                            style={{
                              ...S.statusPill,
                              background:
                                ind.status === "normal"
                                  ? "rgba(10,191,170,0.12)"
                                  : ind.status === "abnormal"
                                  ? "rgba(255,107,107,0.12)"
                                  : "rgba(245,166,35,0.12)",
                              color:
                                ind.status === "normal"
                                  ? "#089082"
                                  : ind.status === "abnormal"
                                  ? "#d94f4f"
                                  : "#c47a00",
                            }}
                          >
                            {ind.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={S.detailSection}>
                    <p style={S.detailSectionLabel}>Clinical Recommendation</p>
                    <div style={S.recommendBox}>
                      <p style={S.detailText}>{selectedAnalysis.recommendation}</p>
                    </div>
                  </div>

                  <div style={S.detailMeta}>
                    <span style={S.detailMetaItem}>
                      📅 {formatDate(selectedAnalysis.date)}
                    </span>
                    <span style={S.detailMetaItem}>
                      🕐 {formatTime(selectedAnalysis.date)}
                    </span>
                    <span style={S.detailMetaItem}>
                      📄 {selectedAnalysis.image_name}
                    </span>
                  </div>

                  <button
                    style={S.printBtn}
                    onClick={() => window.print()}
                    type="button"
                  >
                    🖨 Print Report
                  </button>
                </div>
              )}

              {/* Placeholder when nothing selected */}
              {!selectedAnalysis && analyses.length > 0 && (
                <div style={S.detailPlaceholder}>
                  <span style={{ fontSize: "3rem" }}>👆</span>
                  <p style={S.emptyText}>Select an analysis to view full details</p>
                </div>
              )}
            </div>
          )}

          {/* ══ Uploads Tab ══ */}
          {activeTab === "uploads" && (
            <div>
              <div style={S.listHeader}>
                <h2 style={S.listTitle}>Uploaded Scans</h2>
                <button
                  style={S.newScanBtn}
                  onClick={() => navigate("/#upload")}
                  type="button"
                >
                  + Upload New
                </button>
              </div>

              {loadingUploads ? (
                <div style={S.loadingRow}>
                  <div style={S.spinner} />
                  <span style={{ color: "#5e7b8c" }}>Loading uploads…</span>
                </div>
              ) : uploads.length === 0 ? (
                <div style={S.emptyBox}>
                  <span style={{ fontSize: "3rem" }}>🖼️</span>
                  <p style={S.emptyText}>No uploads yet.</p>
                </div>
              ) : (
                <div style={S.uploadsGrid}>
                  {uploads.map((item, i) => (
                    <div key={item.id || i} style={S.uploadCard}>
                      <div style={S.uploadThumb}>🩻</div>
                      <div style={S.uploadInfo}>
                        <p style={S.uploadName}>{item.file_name || item.name}</p>
                        <p style={S.uploadMeta}>
                          {item.file_type?.toUpperCase() || "FILE"} ·{" "}
                          {item.size
                            ? item.size < 1024 * 1024
                              ? `${(item.size / 1024).toFixed(1)} KB`
                              : `${(item.size / 1024 / 1024).toFixed(1)} MB`
                            : "—"}
                        </p>
                        <p style={S.uploadDate}>
                          {item.created_at ? formatDate(item.created_at) : "—"}
                        </p>
                      </div>
                      <button
                        style={S.analyzeSmallBtn}
                        onClick={() => navigate("/process")}
                        type="button"
                      >
                        Analyze
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ Personal Info Tab ══ */}
          {activeTab === "info" && (
            <div style={S.infoGrid}>
              <div style={S.infoCard}>
                <h3 style={S.infoCardTitle}>👤 Account Information</h3>
                <div style={S.infoRows}>
                  {[
                    ["First Name", user?.first_name ?? "—"],
                    ["Last Name", user?.last_name ?? "—"],
                    ["Email Address", user?.email ?? "—"],
                    ["Member Since", "2025"],
                  ].map(([label, value]) => (
                    <div key={label} style={S.infoRow}>
                      <span style={S.infoLabel}>{label}</span>
                      <span style={S.infoValue}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={S.infoCard}>
                <h3 style={S.infoCardTitle}>📊 Analysis Summary</h3>
                <div style={S.summaryGrid}>
                  {[
                    { label: "Total Analyses", value: analyses.length, color: "#0abfaa" },
                    { label: "Healthy Results", value: healthyCount, color: "#0abfaa" },
                    { label: "Diseased Results", value: diseasedCount, color: "#ff6b6b" },
                    { label: "Avg. Confidence", value: `${avgConfidence}%`, color: "#f5a623" },
                  ].map((s) => (
                    <div key={s.label} style={S.summaryItem}>
                      <span style={{ ...S.summaryNum, color: s.color }}>{s.value}</span>
                      <span style={S.summaryLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...S.infoCard, gridColumn: "1 / -1" }}>
                <h3 style={S.infoCardTitle}>⚙️ Actions</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    style={S.actionBtn}
                    onClick={() => navigate("/process")}
                    type="button"
                  >
                    🔬 New Analysis
                  </button>
                  <button
                    style={S.actionBtn}
                    onClick={() => navigate("/home")}
                    type="button"
                  >
                    🏠 Go to Home
                  </button>
                  <button
                    style={{ ...S.actionBtn, ...S.actionBtnDanger }}
                    onClick={handleLogout}
                    type="button"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Disclaimer ── */}
      <p style={S.disclaimer}>
        ⚕ Results are AI-generated and for informational purposes only.
        Always consult a qualified physician.
      </p>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "#f7fafa",
    fontFamily: '"DM Sans", sans-serif',
    color: "#1a2e3b",
  },

  // Nav
  nav: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #e0edec",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 5%",
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #e0edec",
    borderRadius: 50,
    padding: "8px 18px",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#5e7b8c",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "1.3rem",
  },
  navLogoText: {
    fontFamily: '"DM Serif Display", serif',
    color: "#0d2b45",
    fontWeight: 400,
  },
  logoutBtn: {
    background: "transparent",
    border: "1.5px solid #e0edec",
    borderRadius: 50,
    padding: "8px 20px",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#0d2b45",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  // Hero
  profileHero: {
    position: "relative",
    overflow: "hidden",
    marginBottom: 0,
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #0d2b45 0%, #163552 60%, #0a4040 100%)",
  },
  heroContent: {
    position: "relative",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "48px 5%",
    display: "flex",
    alignItems: "center",
    gap: 32,
    flexWrap: "wrap",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0abfaa, #089082)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: "0 0 0 4px rgba(10,191,170,0.3)",
  },
  heroInfo: { flex: 1 },
  heroName: {
    fontFamily: '"DM Serif Display", serif',
    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
    color: "white",
    margin: "0 0 6px",
    fontWeight: 400,
  },
  heroEmail: { color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", margin: "0 0 12px" },
  heroBadges: { display: "flex", gap: 10, flexWrap: "wrap" },
  badge: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.85)",
    borderRadius: 50,
    padding: "4px 14px",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  heroStats: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: "18px 28px",
    flexShrink: 0,
  },
  statBox: { textAlign: "center", padding: "0 20px" },
  statNum: { display: "block", fontSize: "1.6rem", fontWeight: 700, fontFamily: '"DM Serif Display", serif' },
  statLabel: { fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" },
  statDivider: { width: 1, height: 40, background: "rgba(255,255,255,0.15)" },

  // Tabs
  main: { maxWidth: 1100, margin: "0 auto", padding: "0 5% 64px" },
  tabBar: {
    display: "flex",
    gap: 4,
    background: "white",
    border: "1px solid #e0edec",
    borderTop: "none",
    padding: "0 4px",
    position: "sticky",
    top: 68,
    zIndex: 50,
  },
  tab: {
    padding: "16px 22px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "#5e7b8c",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "color 0.2s, border-color 0.2s",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  tabActive: {
    color: "#0abfaa",
    borderBottomColor: "#0abfaa",
  },
  tabContent: { paddingTop: 32 },

  // Analyses layout
  analysesLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    alignItems: "start",
  },
  analysisList: { display: "flex", flexDirection: "column", gap: 12 },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  listTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#0d2b45",
    margin: 0,
  },
  newScanBtn: {
    background: "#0abfaa",
    color: "white",
    border: "none",
    borderRadius: 50,
    padding: "9px 20px",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  // Analysis card
  analysisCard: {
    background: "white",
    border: "1.5px solid #e0edec",
    borderRadius: 14,
    padding: "18px 20px",
    cursor: "pointer",
    transition: "border-color 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  analysisCardActive: {
    borderColor: "#0abfaa",
    boxShadow: "0 0 0 3px rgba(10,191,170,0.1)",
  },
  verdictBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 50,
    padding: "4px 14px",
    fontSize: "0.78rem",
    fontWeight: 700,
    alignSelf: "flex-start",
  },
  cardMeta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardImageName: { fontSize: "0.85rem", fontWeight: 600, color: "#0d2b45", margin: 0 },
  cardDate: { fontSize: "0.78rem", color: "#5e7b8c", margin: 0 },
  cardFinding: {
    fontSize: "0.85rem",
    color: "#5e7b8c",
    lineHeight: 1.55,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  confBar: { display: "flex", alignItems: "center", gap: 10 },
  confTrack: {
    flex: 1,
    height: 5,
    background: "#e0edec",
    borderRadius: 99,
    overflow: "hidden",
  },
  confFill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 0.6s ease",
  },
  confNum: { fontSize: "0.78rem", fontWeight: 700, minWidth: 34 },
  viewDetail: {
    fontSize: "0.75rem",
    color: "#0abfaa",
    margin: 0,
    fontWeight: 600,
    textAlign: "right",
  },

  // Detail panel
  detailPanel: {
    background: "white",
    border: "1.5px solid #e0edec",
    borderRadius: 16,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
    position: "sticky",
    top: 120,
  },
  detailPlaceholder: {
    background: "white",
    border: "1.5px dashed #e0edec",
    borderRadius: 16,
    minHeight: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  detailHeader: {},
  detailVerdict: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    borderRadius: 12,
    padding: "16px 20px",
  },
  detailVerdictLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#5e7b8c",
    margin: "0 0 4px",
  },
  detailVerdictText: {
    fontSize: "1.4rem",
    fontWeight: 700,
    margin: 0,
    fontFamily: '"DM Serif Display", serif',
  },
  detailConfidence: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  detailSection: {},
  detailSectionLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#5e7b8c",
    margin: "0 0 8px",
  },
  detailText: { fontSize: "0.9rem", color: "#1a2e3b", lineHeight: 1.65, margin: 0 },
  indRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    background: "#f7fafa",
    border: "1px solid #e0edec",
    borderRadius: 8,
    marginBottom: 6,
  },
  indLabel: { fontSize: "0.85rem", color: "#1a2e3b", fontWeight: 500 },
  indValue: { fontSize: "0.82rem", color: "#5e7b8c" },
  statusPill: {
    fontSize: "0.7rem",
    fontWeight: 700,
    borderRadius: 99,
    padding: "3px 10px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  recommendBox: {
    background: "rgba(10,191,170,0.06)",
    border: "1px solid rgba(10,191,170,0.2)",
    borderRadius: 10,
    padding: "12px 16px",
  },
  detailMeta: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    borderTop: "1px solid #e0edec",
    paddingTop: 14,
  },
  detailMetaItem: {
    fontSize: "0.78rem",
    color: "#5e7b8c",
    background: "#f7fafa",
    border: "1px solid #e0edec",
    borderRadius: 8,
    padding: "5px 12px",
  },
  printBtn: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1.5px solid #e0edec",
    borderRadius: 50,
    fontWeight: 600,
    fontSize: "0.88rem",
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#0d2b45",
  },

  // Uploads
  uploadsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },
  uploadCard: {
    background: "white",
    border: "1px solid #e0edec",
    borderRadius: 12,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  uploadThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "rgba(10,191,170,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    flexShrink: 0,
  },
  uploadInfo: { flex: 1 },
  uploadName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#0d2b45",
    margin: 0,
    maxWidth: 300,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  uploadMeta: { fontSize: "0.78rem", color: "#5e7b8c", margin: "2px 0 0" },
  uploadDate: { fontSize: "0.75rem", color: "#5e7b8c", margin: "2px 0 0" },
  analyzeSmallBtn: {
    background: "rgba(10,191,170,0.1)",
    color: "#089082",
    border: "1px solid rgba(10,191,170,0.25)",
    borderRadius: 50,
    padding: "6px 18px",
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },

  // Personal Info
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  infoCard: {
    background: "white",
    border: "1px solid #e0edec",
    borderRadius: 16,
    padding: "24px",
  },
  infoCardTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0d2b45",
    margin: "0 0 18px",
  },
  infoRows: { display: "flex", flexDirection: "column", gap: 0 },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f0f5f5",
  },
  infoLabel: { fontSize: "0.85rem", color: "#5e7b8c", fontWeight: 500 },
  infoValue: { fontSize: "0.9rem", color: "#0d2b45", fontWeight: 600 },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  summaryItem: {
    background: "#f7fafa",
    border: "1px solid #e0edec",
    borderRadius: 10,
    padding: "14px",
    textAlign: "center",
  },
  summaryNum: {
    display: "block",
    fontSize: "1.5rem",
    fontWeight: 700,
    fontFamily: '"DM Serif Display", serif',
    marginBottom: 4,
  },
  summaryLabel: { fontSize: "0.75rem", color: "#5e7b8c", fontWeight: 600 },

  // Actions
  actionBtn: {
    background: "#0abfaa",
    color: "white",
    border: "none",
    borderRadius: 50,
    padding: "10px 22px",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  actionBtnDanger: {
    background: "transparent",
    color: "#d94f4f",
    border: "1.5px solid #ffd0d0",
  },

  // Utils
  emptyBox: {
    background: "white",
    border: "1.5px dashed #e0edec",
    borderRadius: 14,
    padding: "48px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },
  emptyText: { fontSize: "0.9rem", color: "#5e7b8c", margin: 0, lineHeight: 1.6 },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "32px",
    justifyContent: "center",
  },
  spinner: {
    width: 22,
    height: 22,
    border: "2.5px solid #e0edec",
    borderTopColor: "#0abfaa",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  disclaimer: {
    textAlign: "center",
    fontSize: "0.75rem",
    color: "#5e7b8c",
    padding: "0 5% 32px",
    lineHeight: 1.6,
    maxWidth: 600,
    margin: "0 auto",
  },
};
