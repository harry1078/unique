import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ================= API ================= */

const API_BASE = "http://localhost:5000/api/report";

const fetchReport = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

const createReport = async (payload) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

const updateReport = async ({ id, payload }) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

/* ================= HELPERS ================= */

// 🔹 Keep only filled values
const cleanMetrics = (values = {}) => {
  const cleaned = {};
  Object.keys(values).forEach((key) => {
    const val = values[key];
    if (val !== "" && val !== undefined && val !== null) {
      cleaned[key] = val;
    }
  });
  return cleaned;
};

// 🔹 UI → API payload
const preparePayload = (data) => ({
  reportName: "Manpower Report",
  data: data.flatMap((cat) =>
    cat.posts
      .map((post) => {
        const metrics = cleanMetrics(post.values);
        if (Object.keys(metrics).length === 0) return null;

        return {
          category: cat.category,
          postName: post.postName,
          metrics,
        };
      })
      .filter(Boolean),
  ),
});

// 🔹 API → UI
const transformFromAPI = (apiData) => {
  const map = {};

  apiData.data.forEach((item) => {
    if (!map[item.category]) {
      map[item.category] = { category: item.category, posts: [] };
    }

    map[item.category].posts.push({
      postName: item.postName,
      values: item.metrics || {},
    });
  });

  return Object.values(map);
};

/* ================= COMPONENT ================= */

export default function DynamicTable2({ schema, reportId }) {
  const [data, setData] = useState(schema.data);
  const queryClient = useQueryClient();
  const isEditMode = !!reportId;

  /* 🔹 Fetch (Edit Mode) */
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => fetchReport(reportId),
    enabled: isEditMode,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (reportData) {
      setData(transformFromAPI(reportData));
    }
  }, [reportData]);

  /* 🔹 Input Change */
  const handleChange = (catIndex, postIndex, key, value) => {
    if (value < 0) return;

    const updated = [...data];
    updated[catIndex].posts[postIndex].values[key] =
      value === "" ? "" : Number(value);

    setData(updated);
  };

  /* 🔹 Flatten */
  const flatData = useMemo(() => {
    return data.flatMap((cat, catIndex) =>
      cat.posts.map((post, postIndex) => ({
        category: cat.category,
        postName: post.postName,
        values: post.values || {},
        catIndex,
        postIndex,
      })),
    );
  }, [data]);

  /* 🔹 Row Total */
  const getRowTotal = (values = {}) =>
    schema.headers.reduce((sum, h) => sum + (Number(values[h.key]) || 0), 0);

  /* 🔹 Column Totals */
  const columnTotals = useMemo(() => {
    const totals = {};
    schema.headers.forEach((h) => (totals[h.key] = 0));

    flatData.forEach((row) => {
      schema.headers.forEach((h) => {
        totals[h.key] += Number(row.values?.[h.key]) || 0;
      });
    });

    return totals;
  }, [flatData, schema.headers]);

  const grandTotal = Object.values(columnTotals).reduce((a, b) => a + b, 0);

  /* 🔹 Mutation */
  const mutation = useMutation({
    mutationFn: (payload) =>
      isEditMode
        ? updateReport({ id: reportId, payload })
        : createReport(payload),

    onSuccess: () => {
      alert(isEditMode ? "Updated ✅" : "Created ✅");
      queryClient.invalidateQueries(["report"]);
    },

    onError: (err) => {
      alert(err.message);
    },
  });

  const handleSubmit = () => {
    const payload = preparePayload(data);
    mutation.mutate(payload);
  };

  if (isLoading) return <p style={{backgroundColor: '#fff'}}>Loading...</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", backgroundColor: "#fff", width: "100%" }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Post Name</th>
            {schema.headers.map((h) => (
              <th key={h.key}>{h.label}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {flatData.map((row, i) => (
            <tr key={i}>
              <td>{row.category}</td>
              <td>{row.postName}</td>

              {schema.headers.map((h) => (
                <td key={h.key}>
                  <input
                    type="number"
                    value={row.values?.[h.key] ?? ""}
                    placeholder="Enter"
                    onChange={(e) =>
                      handleChange(
                        row.catIndex,
                        row.postIndex,
                        h.key,
                        e.target.value,
                      )
                    }
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key))
                        e.preventDefault();
                    }}
                    style={{ width: "70px" }}
                  />
                </td>
              ))}

              <td>
                <b>{getRowTotal(row.values)}</b>
              </td>
            </tr>
          ))}

          {/* 🔥 TOTAL ROW */}
          <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
            <td colSpan={2}>TOTAL</td>
            {schema.headers.map((h) => (
              <td key={h.key}>{columnTotals[h.key]}</td>
            ))}
            <td>{grandTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* 🔥 SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={mutation.isPending}
        style={{ marginTop: "10px" }}
      >
        {mutation.isPending
          ? "Saving..."
          : isEditMode
            ? "Update Report"
            : "Create Report"}
      </button>
    </div>
  );
}
