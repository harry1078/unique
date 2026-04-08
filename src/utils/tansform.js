const API_BASE = "/api/report";

// 🔹 UI → API
export const preparePayload = (data) => ({
  reportName: "Manpower Report",
  data: data.flatMap((cat) =>
    cat.posts.map((post) => ({
      category: cat.category,
      postName: post.postName,
      metrics: post.values,
    })),
  ),
});

// 🔹 API → UI
export const transformFromAPI = (apiData) => {
  const map = {};

  apiData.data.forEach((item) => {
    if (!map[item.category]) {
      map[item.category] = { category: item.category, posts: [] };
    }

    map[item.category].posts.push({
      postName: item.postName,
      values: item.metrics,
    });
  });

  return Object.values(map);
};

// 🔹 API calls
export const fetchReport = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

export const createReport = async (payload) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

export const updateReport = async ({ id, payload }) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
};
