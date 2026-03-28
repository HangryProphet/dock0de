import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Group, Text, Title, Pagination } from "@mantine/core";
import { fetchActivityMatrix } from "../data/api";
import type { ActivityMatrix } from "../data/api";

export function SubmissionMatrix() {
  const navigate = useNavigate();
  const { activityId } = useParams<{ activityId: string }>();
  const [matrix, setMatrix] = useState<ActivityMatrix | null>(null);

  useEffect(() => {
    if (!activityId) return;
    fetchActivityMatrix(activityId)
      .then(setMatrix)
      .catch(() => setMatrix(null));
  }, [activityId]);

  const rows = matrix?.rows ?? [];

  const matrixStyle: CSSProperties = {
    display: "grid",
    gap: 12,
  };

  const matrixHeadStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.5fr 0.8fr 0.7fr 0.8fr",
    gap: 16,
    alignItems: "center",
    borderTop: "1px solid var(--border)",
    paddingTop: 12,
  };

  const matrixRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.5fr 0.8fr 0.7fr 0.8fr",
    gap: 16,
    alignItems: "center",
    borderTop: "1px solid var(--border)",
    paddingTop: 12,
  };

  const statusWrapStyle: CSSProperties = {
    display: "flex",
    gap: 8,
    justifyContent: "flex-start",
    flexWrap: "wrap",
  };

  const statusCellStyle = (status: string, disabled?: boolean): CSSProperties => {
    const base: CSSProperties = {
      minWidth: 96,
      height: 28,
      padding: "0 10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase",
      color: "var(--text)",
      borderRadius: 8,
      border: "1px solid var(--border)",
      background: "var(--surface-alt)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.7 : 1,
    };

    if (status === "SUCCESS") {
      return { ...base, background: "var(--success-bg)", borderColor: "var(--success-border)" };
    }
    if (status === "FAILED") {
      return { ...base, background: "var(--error-bg)", borderColor: "var(--error-border)" };
    }
    if (status === "PENDING" || status === "RUNNING") {
      return { ...base, background: "var(--warning-bg)", borderColor: "var(--warning-border)" };
    }
    if (status === "MISSING") {
      return { ...base, background: "var(--surface)", color: "var(--text-muted)" };
    }

    return base;
  };

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" className="table-card">
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>{matrix?.activityTitle ?? "Submissions"}</Title>
            <Text c="dimmed" size="sm">
              Submissions
            </Text>
          </div>
          <Button
            variant="outline"
            color="brand"
            radius="lg"
            size="xs"
            onClick={() =>
              matrix?.classId
                ? navigate(`/professor/class/${matrix.classId}`)
                : navigate(-1)
            }
          >
            Back to Class
          </Button>
        </Group>
        <div style={matrixStyle}>
          <div style={matrixHeadStyle}>
            <Text size="xs" c="dimmed">
              Student
            </Text>
            <Text size="xs" c="dimmed">
              Score
            </Text>
            <Text size="xs" c="dimmed">
              Date Submitted
            </Text>
            <Text size="xs" c="dimmed">
              Environment
            </Text>
            <Text size="xs" c="dimmed">
              Status
            </Text>
          </div>
          {rows.map((row) => (
            <div key={row.studentId} style={matrixRowStyle}>
              <Text fw={600}>{row.studentName}</Text>
              <Text fw={600}>
                {row.cells[0]?.healthScore ?? "-"}
              </Text>
              <Text fw={600}>
                {row.cells[0]?.submittedAt
                  ? row.cells[0].submittedAt.slice(0, 10)
                  : "-"}
              </Text>
              <Text fw={600}>
                {row.cells[0]?.environment ?? "-"}
              </Text>
              <div style={statusWrapStyle}>
                {row.cells.map((cell) => (
                  <button
                    key={cell.submissionId ?? `${row.studentId}-missing`}
                    style={statusCellStyle(cell.status, !cell.submissionId)}
                    title={
                      cell.status === "MISSING"
                        ? "NO SUBMISSION"
                        : `Score ${cell.healthScore ?? "-"}`
                    }
                    onClick={() =>
                      cell.submissionId ? navigate(`/dock/${cell.submissionId}`) : undefined
                    }
                    disabled={!cell.submissionId}
                  >
                    <span>
                      {cell.status === "PENDING"
                        ? "PENDING REVIEW"
                        : cell.status === "MISSING"
                          ? "NO SUBMISSION"
                          : cell.status === "SUCCESS"
                            ? "GRADED"
                            : cell.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Group justify="flex-end" mt="md">
          <Pagination total={1} size="sm" radius="md" />
        </Group>
      </Card>
    </div>
  );
}
