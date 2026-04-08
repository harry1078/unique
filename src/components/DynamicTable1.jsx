import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createReport,
  fetchReport,
  preparePayload,
  transformFromAPI,
  updateReport,
} from "../utils/tansform";

export default function DynamicTable1({ schema, reportId }) {
  const [data, setData] = useState(schema.data);
  //   const queryClient = useQueryClient();

  //   const isEditMode = !!reportId;

  // 🔥 Fetch existing report (EDIT MODE)
  //   const { data: reportData, isLoading } = useQuery({
  //     queryKey: ["report", reportId],
  //     queryFn: () => fetchReport(reportId),
  //     enabled: isEditMode,
  //     retry: 2,
  //     staleTime: 1000 * 60 * 5,
  //   });

  // 🔥 Populate state in edit mode
  //   useEffect(() => {
  //     if (reportData) {
  //       setData(transformFromAPI(reportData));
  //     }
  //   }, [reportData]);

  // 🔹 Handle Input Change
  const handleChange = (catIndex, postIndex, key, value) => {
    if (value < 0) return;

    const updated = [...data];
    updated[catIndex].posts[postIndex].values[key] =
      value === "" ? "" : Number(value);

    setData(updated);
  };

  // 🔹 Flatten Data
  const flatData = useMemo(() => {
    return data.flatMap((cat, catIndex) =>
      cat.posts.map((post, postIndex) => ({
        category: cat.category,
        postName: post.postName,
        values: post.values,
        catIndex,
        postIndex,
      })),
    );
  }, [data]);

  // 🔹 Row Total
  const getRowTotal = (values) => {
    return schema.headers.reduce(
      (sum, h) => sum + (Number(values[h.key]) || 0),
      0,
    );
  };

  // 🔹 Column Totals
  const columnTotals = useMemo(() => {
    const totals = {};
    schema.headers.forEach((h) => (totals[h.key] = 0));

    flatData.forEach((row) => {
      schema.headers.forEach((h) => {
        totals[h.key] += Number(row.values[h.key]) || 0;
      });
    });

    return totals;
  }, [flatData, schema.headers]);

  const grandTotal = Object.values(columnTotals).reduce((a, b) => a + b, 0);

  // 🔥 Mutation (CREATE + UPDATE)
  //   const mutation = useMutation({
  //     mutationFn: (payload) =>
  //       isEditMode
  //         ? updateReport({ id: reportId, payload })
  //         : createReport(payload),

  //     onSuccess: () => {
  //       alert(isEditMode ? "Updated ✅" : "Created ✅");
  //       queryClient.invalidateQueries(["report"]);
  //     },

  //     onError: (err) => {
  //       alert(err.message);
  //     },
  //   });

  // 🔥 Submit Handler
  const handleSubmit = () => {
    console.log("payy");

    // const payload = preparePayload(data);
    // mutation.mutate(payload);
  };

  //   if (isLoading) return <p>Loading...</p>;

  console.log("data", data);

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          width: "100%",
        }}
      >
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
                    value={row.values[h.key] ?? ""}
                    onChange={(e) =>
                      handleChange(
                        row.catIndex,
                        row.postIndex,
                        h.key,
                        e.target.value,
                      )
                    }
                    style={{ width: "70px" }}
                  />
                </td>
              ))}

              <td>
                <b>{getRowTotal(row.values)}</b>
              </td>
            </tr>
          ))}

          <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
            <td colSpan={2}>TOTAL</td>
            {schema.headers.map((h) => (
              <td key={h.key}>{columnTotals[h.key]}</td>
            ))}
            <td>{grandTotal}</td>
          </tr>
        </tbody>
      </table>

      {/* 🔥 SUBMIT BUTTON */}
      {/* <button
        onClick={handleSubmit}
        disabled={mutation.isPending}
        style={{ marginTop: "10px" }}
      >
        {mutation.isPending
          ? "Saving..."
          : isEditMode
            ? "Update Report"
            : "Create Report"}
      </button> */}
    </div>
  );
}
