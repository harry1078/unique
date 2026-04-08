import React, { useState, useMemo } from "react";

export default function DynamicTable({ schema }) {
  const [data, setData] = useState(schema.data);

  // 🔹 Handle Input Change
  const handleChange = (catIndex, postIndex, key, value) => {
    if (value < 0) return; // prevent negative

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

    schema.headers.forEach((h) => {
      totals[h.key] = 0;
    });

    flatData.forEach((row) => {
      schema.headers.forEach((h) => {
        totals[h.key] += Number(row.values[h.key]) || 0;
      });
    });

    return totals;
  }, [flatData, schema.headers]);

  const grandTotal = Object.values(columnTotals).reduce((a, b) => a + b, 0);

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
        {/* 🔹 HEADER */}
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

        {/* 🔹 BODY */}
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
    </div>
  );
}
