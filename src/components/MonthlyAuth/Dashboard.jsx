import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import styles from "./index.module.scss";

const createRow = () => ({
  id: Date.now() + Math.random(),
  value: "",
  isEditing: true,
});

const createSection = () => ({
  id: Date.now() + Math.random(),
  title: "",
  parameter: "",
  rows: [createRow()],
});

export default function Dashboard() {
  const [selectedTable, setSelectedTable] = useState("Table 1");

  const [tableData, setTableData] = useState({});

  const [sections, setSections] = useState([createSection()]);

  useEffect(() => {
    fetchAllTables();
  }, []);

  const currentTableData = useMemo(() => {
    return tableData[selectedTable];
  }, [tableData, selectedTable]);

  useEffect(() => {
    if (currentTableData?.sections) {
      setSections(currentTableData.sections);
    } else {
      setSections([createSection()]);
    }
  }, [currentTableData]);

  const fetchAllTables = async () => {
    try {
      const res = await api.get("/tables");

      setTableData(res.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  const handleTableChange = (value) => {
    setTableData((prev) => ({
      ...prev,
      [selectedTable]: {
        sections,
      },
    }));

    setSelectedTable(value);
  };

  const handleSectionChange = (sectionId, field, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    );
  };

  const handleRowChange = (sectionId, rowId, value) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          rows: section.rows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  value,
                }
              : row,
          ),
        };
      }),
    );
  };

  const addRow = (sectionId) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          rows: [...section.rows, createRow()],
        };
      }),
    );
  };

  const deleteRow = (sectionId, rowId) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          rows: section.rows.filter((row) => row.id !== rowId),
        };
      }),
    );
  };

  const toggleEditRow = (sectionId, rowId) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          rows: section.rows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  isEditing: !row.isEditing,
                }
              : row,
          ),
        };
      }),
    );
  };

  const addSection = () => {
    setSections((prev) => [...prev, createSection()]);
  };

  const deleteSection = (sectionId) => {
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const getCleanPayload = () => {
    return {
      sections: sections.map((section) => ({
        ...section,
        rows: section.rows.filter((row) => row.value.trim() !== ""),
      })),
    };
  };

  const handleComplete = async () => {
    try {
      const payload = getCleanPayload();

      await api.post(`/tables/${selectedTable}`, payload);

      setTableData((prev) => ({
        ...prev,
        [selectedTable]: payload,
      }));

      alert(`${selectedTable} saved successfully`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedTables = {
        ...tableData,
        [selectedTable]: {
          sections,
        },
      };

      await api.post("/tables/all", updatedTables);

      alert("All tables submitted");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    if (tableData[selectedTable]) {
      setSections(tableData[selectedTable].sections);
    } else {
      setSections([createSection()]);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Dynamic CRUD Dashboard</h1>

          <select
            className={styles.dropdown}
            value={selectedTable}
            onChange={(e) => handleTableChange(e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i}>Table {i + 1}</option>
            ))}
          </select>
        </div>

        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <div className={styles.topRow}>
              <input
                type="text"
                placeholder="Title"
                value={section.title}
                onChange={(e) =>
                  handleSectionChange(section.id, "title", e.target.value)
                }
                className={styles.input}
              />

              <input
                type="text"
                placeholder="Parameter"
                value={section.parameter}
                onChange={(e) =>
                  handleSectionChange(section.id, "parameter", e.target.value)
                }
                className={styles.input}
              />

              <button
                type="button"
                className={styles.addSectionBtn}
                onClick={addSection}
              >
                ADD
              </button>

              <button
                type="button"
                className={styles.deleteSectionBtn}
                onClick={() => deleteSection(section.id)}
              >
                DELETE SECTION
              </button>
            </div>

            <div className={styles.rowsWrapper}>
              {section.rows.map((row) => (
                <div key={row.id} className={styles.row}>
                  <input
                    type="text"
                    placeholder="Enter Value"
                    value={row.value}
                    disabled={!row.isEditing}
                    onChange={(e) =>
                      handleRowChange(section.id, row.id, e.target.value)
                    }
                    className={styles.rowInput}
                  />

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => toggleEditRow(section.id, row.id)}
                    >
                      {row.isEditing ? "Save" : "Edit"}
                    </button>

                    <button
                      type="button"
                      className={styles.addBtn}
                      onClick={() => addRow(section.id)}
                    >
                      Add
                    </button>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => deleteRow(section.id, row.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.completeWrapper}>
          <button
            type="button"
            className={styles.completeBtn}
            onClick={handleComplete}
          >
            COMPLETE
          </button>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleCancel}
          >
            CANCEL
          </button>

          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
