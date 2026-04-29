import React, { useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

/* ---------------- MOCK CONFIG ---------------- */

const reportConfig = [
  {
    category: "Government",
    posts: ["DDG", "DIR"],
  },
  {
    category: "NISG",
    posts: ["MDD", "DDG"],
  },
];

/* ---------------- DEFAULT VALUES ---------------- */

const defaultValues = {
  Government: {
    DDG: { count: 2, remarks: "ok" },
    DIR: { count: 1, remarks: "fine" },
  },
  NISG: {
    MDD: { count: 3, remarks: "good" },
    DDG: { count: 2, remarks: "review" },
  },
};

/* ---------------- MAIN COMPONENT ---------------- */

const ReportTableApp = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  const methods = useForm({
    defaultValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isValid },
  } = methods;

  const onSubmit = (data) => {
    console.log("SUBMITTED DATA:", data);

    // Transform to report format (optional)
    const report = reportConfig.map((cat) => ({
      category: cat.category,
      posts: cat.posts.map((post) => ({
        postName: post,
        ...data?.[cat.category]?.[post],
      })),
    }));

    console.log("TRANSFORMED REPORT:", report);

    setIsEditMode(false);
  };

  const handleCancel = () => {
    reset(defaultValues); // reset back to original
    setIsEditMode(false);
  };

  return (
    <FormProvider {...methods}>
      <div style={{ padding: "20px" }}>
        {/* ACTION BUTTONS */}
        <div style={{ marginBottom: "15px" }}>
          {!isEditMode ? (
            <button onClick={() => setIsEditMode(true)}>Edit</button>
          ) : (
            <>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid}
                style={{ marginRight: "10px" }}
              >
                Save
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>

        {/* TABLE */}
        <ReportTable config={reportConfig} isEditMode={isEditMode} />
      </div>
    </FormProvider>
  );
};

/* ---------------- TABLE COMPONENT ---------------- */

const ReportTable = ({ config, isEditMode }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Category / Post</th>
          <th style={styles.th}>Count</th>
          <th style={styles.th}>Remarks</th>
        </tr>
      </thead>

      <tbody>
        {config.map((cat, i) => (
          <React.Fragment key={i}>
            {/* CATEGORY ROW */}
            <tr>
              <td colSpan={3} style={styles.categoryRow}>
                {cat.category}
              </td>
            </tr>

            {/* POST ROWS */}
            {cat.posts.map((post, j) => {
              const countField = `${cat.category}.${post}.count`;
              const remarksField = `${cat.category}.${post}.remarks`;

              const countValue = watch(countField);
              const remarksValue = watch(remarksField);

              return (
                <tr key={j}>
                  <td style={styles.subRow}>└─ {post}</td>

                  {/* COUNT */}
                  <td style={styles.td}>
                    {isEditMode ? (
                      <>
                        <input
                          type="number"
                          {...register(countField, {
                            required: "Count is required",
                            min: {
                              value: 0,
                              message: "Cannot be negative",
                            },
                          })}
                          style={styles.input}
                        />
                        {errors?.[cat.category]?.[post]?.count && (
                          <p style={styles.error}>
                            {errors[cat.category][post].count.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <span>{countValue ?? 0}</span>
                    )}
                  </td>

                  {/* REMARKS */}
                  <td style={styles.td}>
                    {isEditMode ? (
                      <>
                        <input
                          type="text"
                          {...register(remarksField, {
                            required: "Remarks required",
                            minLength: {
                              value: 3,
                              message: "Min 3 characters",
                            },
                          })}
                          style={styles.input}
                        />
                        {errors?.[cat.category]?.[post]?.remarks && (
                          <p style={styles.error}>
                            {errors[cat.category][post].remarks.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <span>{remarksValue || "-"}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

/* ---------------- STYLES ---------------- */

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ccc",
    padding: "10px",
    background: "#f5f5f5",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ccc",
    padding: "10px",
  },
  categoryRow: {
    fontWeight: "bold",
    background: "#e0e0e0",
    border: "1px solid #ccc",
    padding: "10px",
  },
  subRow: {
    padding: "10px 10px 10px 30px",
    border: "1px solid #ccc",
  },
  input: {
    width: "100%",
    padding: "5px",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
  },
};

export default ReportTableApp;
