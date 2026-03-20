import { useNavigate, useParams } from "react-router-dom";
import { Badge, Card, Group, Text, Title } from "@mantine/core";
import { mockData } from "../data/mockData";

const statusColor: Record<string, string> = {
  SUCCESS: "green",
  FAILED: "red",
  PENDING: "yellow",
  RUNNING: "blue",
};

export function SubmissionMatrix() {
  const navigate = useNavigate();
  const { activityId } = useParams<{ activityId: string }>();
  const matrix = mockData.activityMatrix[activityId ?? "act_1"];

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" className="table-card">
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>Submission Matrix</Title>
            <Text c="dimmed" size="sm">
              Student activity health overview.
            </Text>
          </div>
          <Group gap="sm">
            <Badge color="green" variant="light">
              Success
            </Badge>
            <Badge color="yellow" variant="light">
              Warning
            </Badge>
            <Badge color="red" variant="light">
              Error
            </Badge>
          </Group>
        </Group>
        <div className="matrix">
          {matrix.rows.map((row) => (
            <div key={row.studentId} className="matrix-row">
              <div className="matrix-student">
                <Text fw={600}>{row.studentName}</Text>
                <Text size="xs" c="dimmed">
                  Last health: {row.lastHealthScore}
                </Text>
              </div>
              <div className="matrix-cells">
                {row.cells.map((cell) => (
                  <button
                    key={cell.submissionId}
                    className={`matrix-cell status-${cell.status.toLowerCase()}`}
                    title={`Score ${cell.healthScore}`}
                    onClick={() => navigate(`/dock/${cell.submissionId}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
