import { useEffect, useState } from "react";
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
        <div className="matrix">
          <div className="matrix-head">
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
            <div key={row.studentId} className="matrix-row">
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
              <div className="matrix-status">
                {row.cells.map((cell) => (
                  <button
                    key={cell.submissionId ?? `${row.studentId}-missing`}
                    className={`matrix-cell status-${cell.status.toLowerCase()}`}
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
