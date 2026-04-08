import { useState, useMemo } from "react";

const CATEGORIES = [
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "Government",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
  "NISG/AKAL",
];

const POST_NAMES = [
  "DDG",
  "Director",
  "Director (Tech)",
  "ADG",
  "DD",
  "DD (Tech)",
  "AD (Tech)",
  "SO",
  "PS",
  "AAO",
  "TO",
  "ASO",
  "Chief Technologist Officer",
  "Head of Engineering",
  "Principal Security Architect",
  "Security Architect",
  "Principal Software Architect",
  "Software Architect",
  "Principal Biometric Architect",
  "Biometric Architect",
  "Head of Innovation",
  "Product Manager (Innovations)",
  "Program Manager - R&D",
  "Head of Operations",
  "Principal Application Consultant (Part-Time)",
  "",
];

const HEADERS = [
  "Sanctioned",
  "Working",
  "Upcoming Vacancies (Next 6 Months)",
  "Online Training (Policy 25.7.2022 & 1.1.2024)",
  "i-GOT Registrations",
];

const HEADER_KEYS = [
  "sanctioned",
  "working",
  "upcomingVacancies",
  "onlineTraining",
  "igotRegistrations",
];

const INITIAL_VALUES = [
  [1, 1, 0, 0, 1],
  [3, 2, 1, 0, 2],
  [5, 4, 2, 0, 4],
  [1, 1, 0, 0, 1],
  [1, 1, 5, 0, 3],
  [7, 3, 1, 0, 3],
  [4, 3, 1, 0, 2],
  [3, 2, 1, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 0, 1, 0, 3],
  [7, 3, 4, 0, 2],
  [3, 2, 1, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 1, 0, 0, 0],
  [4, 2, 2, 0, 0],
  [1, 0, 1, 0, 0],
  [2, 0, 2, 0, 0],
  [1, 1, 0, 0, 0],
  [2, 2, 3, 0, 0],
  [3, 0, 1, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 0, 0, 0, 0],
];

const buildInitialData = () =>
  POST_NAMES.map((post, i) => {
    const obj = { category: CATEGORIES[i], postName: post };
    HEADER_KEYS.forEach((k, j) => {
      obj[k] = INITIAL_VALUES[i][j];
    });
    return obj;
  });

const UNIQUE_CATS = [...new Set(CATEGORIES)];
const UNIQUE_POSTS = [...new Set(POST_NAMES.filter(Boolean))];

export default function StaffingEditor1() {
  const [data, setData] = useState(buildInitialData);
  const [tab, setTab] = useState("table");
  const [copied, setCopied] = useState(false);

  const handleChange = (rowIdx, key, val) => {
    setData((prev) => {
      const next = [...prev];
      next[rowIdx] = { ...next[rowIdx], [key]: parseInt(val) || 0 };
      return next;
    });
  };

  const totals = useMemo(
    () =>
      HEADER_KEYS.reduce((acc, k) => {
        acc[k] = data.reduce((s, row) => s + (row[k] || 0), 0);
        return acc;
      }, {}),
    [data],
  );

  const jsonOutput = useMemo(
    () => ({
      categories: UNIQUE_CATS,
      postNames: UNIQUE_POSTS,
      headers: HEADERS,
      data: data.map((row, i) => {
        const entry = { category: row.category, postName: row.postName };
        HEADER_KEYS.forEach((k, j) => {
          entry[HEADERS[j]] = row[k];
        });
        return entry;
      }),
      totals: HEADERS.reduce((acc, h, j) => {
        acc[h] = totals[HEADER_KEYS[j]];
        return acc;
      }, {}),
    }),
    [data, totals],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Staffing Data Manager</h1>
          <p style={styles.subtitle}>
            {UNIQUE_CATS.length} categories · {UNIQUE_POSTS.length} posts ·{" "}
            {HEADERS.length} metrics
          </p>
        </div>
        <div style={styles.tabs}>
          {["table", "json"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...styles.tabBtn,
                ...(tab === t ? styles.tabActive : {}),
              }}
            >
              {t === "table" ? "📊 Data Entry" : "{ } JSON Output"}
            </button>
          ))}
        </div>
      </div>

      {tab === "table" && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  style={{ ...styles.th, ...styles.stickyCol, minWidth: 110 }}
                >
                  Category
                </th>
                <th
                  style={{ ...styles.th, ...styles.stickyCol2, minWidth: 200 }}
                >
                  Post Name
                </th>
                {HEADERS.map((h, i) => (
                  <th
                    key={i}
                    style={{ ...styles.th, minWidth: 130, textAlign: "center" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, ri) => (
                <tr
                  key={ri}
                  style={ri % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={{ ...styles.td, ...styles.stickyCol }}>
                    <span
                      style={{
                        ...styles.catBadge,
                        ...(row.category === "Government"
                          ? styles.catGov
                          : styles.catNisg),
                      }}
                    >
                      {row.category}
                    </span>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...styles.stickyCol2,
                      fontWeight: 500,
                      fontSize: 12,
                    }}
                  >
                    {row.postName}
                  </td>
                  {HEADER_KEYS.map((k, ci) => (
                    <td key={ci} style={{ ...styles.td, textAlign: "center" }}>
                      <input
                        type="number"
                        min={0}
                        value={row[k]}
                        onChange={(e) => handleChange(ri, k, e.target.value)}
                        style={styles.numInput}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Totals Row */}
              <tr style={styles.totalsRow}>
                <td
                  style={{
                    ...styles.totalCell,
                    ...styles.stickyCol,
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.05em",
                  }}
                >
                  TOTAL
                </td>
                <td style={{ ...styles.totalCell, ...styles.stickyCol2 }} />
                {HEADER_KEYS.map((k, ci) => (
                  <td
                    key={ci}
                    style={{
                      ...styles.totalCell,
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {totals[k]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {tab === "json" && (
        <div>
          <div style={styles.jsonToolbar}>
            <span style={styles.jsonLabel}>
              Live JSON — updates as you edit values in Data Entry
            </span>
            <button
              onClick={handleCopy}
              style={{
                ...styles.copyBtn,
                ...(copied ? styles.copyBtnSuccess : {}),
              }}
            >
              {copied ? "✓ Copied!" : "Copy JSON"}
            </button>
          </div>
          <pre style={styles.pre}>{JSON.stringify(jsonOutput, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "1.5rem",
    maxWidth: "100%",
    color: "#1a1a1a",
    background: "#f8f7f4",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111",
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
    margin: "4px 0 0",
  },
  tabs: {
    display: "flex",
    gap: 6,
    background: "#ede9e3",
    padding: "4px",
    borderRadius: 10,
  },
  tabBtn: {
    padding: "6px 16px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    color: "#666",
    transition: "all 0.15s",
  },
  tabActive: {
    background: "#fff",
    color: "#111",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #e2dfd9",
    borderRadius: 12,
    background: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 12,
  },
  th: {
    background: "#f4f1ec",
    padding: "10px 12px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: 11,
    color: "#555",
    borderBottom: "1px solid #e2dfd9",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  stickyCol: {
    position: "sticky",
    left: 0,
    zIndex: 3,
    background: "#f4f1ec",
    borderRight: "1px solid #e2dfd9",
  },
  stickyCol2: {
    position: "sticky",
    left: 118,
    zIndex: 3,
    background: "#f4f1ec",
    borderRight: "1px solid #e2dfd9",
  },
  td: {
    padding: "6px 12px",
    borderBottom: "0.5px solid #ede9e3",
    verticalAlign: "middle",
    color: "#333",
  },
  rowEven: { background: "#fff" },
  rowOdd: { background: "#faf9f7" },
  catBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.03em",
    whiteSpace: "nowrap",
  },
  catGov: {
    background: "#dbeafe",
    color: "#1e40af",
  },
  catNisg: {
    background: "#dcfce7",
    color: "#166534",
  },
  numInput: {
    width: 56,
    padding: "4px 6px",
    border: "1px solid #d1cdc7",
    borderRadius: 6,
    background: "#faf9f7",
    color: "#111",
    fontSize: 12,
    textAlign: "center",
    outline: "none",
  },
  totalsRow: {
    background: "#1a1a1a",
    position: "sticky",
    bottom: 0,
  },
  totalCell: {
    padding: "10px 12px",
    color: "#fff",
    fontSize: 12,
    borderTop: "2px solid #333",
  },
  jsonToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  jsonLabel: {
    fontSize: 12,
    color: "#888",
  },
  copyBtn: {
    padding: "6px 16px",
    borderRadius: 8,
    border: "1px solid #d1cdc7",
    background: "#fff",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    color: "#333",
    transition: "all 0.15s",
  },
  copyBtnSuccess: {
    background: "#dcfce7",
    color: "#166534",
    borderColor: "#86efac",
  },
  pre: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 11,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    background: "#1a1a1a",
    color: "#e2e8f0",
    border: "1px solid #333",
    borderRadius: 12,
    padding: "1.25rem",
    maxHeight: 520,
    overflowY: "auto",
  },
};
