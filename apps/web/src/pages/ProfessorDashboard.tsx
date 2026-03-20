import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { mockData } from "../data/mockData";

export function ProfessorDashboard() {
  const navigate = useNavigate();
  const classes = mockData.classes;

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" className="kpi-card">
        <Stack gap={6}>
          <Text c="dimmed" size="sm">
            Active Classes
          </Text>
          <Title order={1}>{mockData.professorMetrics.activeClasses}</Title>
          <Text size="sm">Classes with active activities.</Text>
        </Stack>
      </Card>
      <Card withBorder radius="lg" className="kpi-card">
        <Stack gap={6}>
          <Group gap={8}>
            <Text c="dimmed" size="sm">
              Submissions Needing Review
            </Text>
            <Badge color="red" variant="light">
              Urgent
            </Badge>
          </Group>
          <Title order={1}>{mockData.professorMetrics.submissionsNeedingReview}</Title>
          <Text size="sm">Prioritize high-risk runs.</Text>
        </Stack>
      </Card>
      <Card withBorder radius="lg" className="kpi-card">
        <Stack gap={6}>
          <Text c="dimmed" size="sm">
            System Status (Docker Engine)
          </Text>
          <Title order={1}>
            {mockData.professorMetrics.dockerEngineHealthy ? "Healthy" : "Down"}
          </Title>
          <Text size="sm">Last check 30s ago.</Text>
        </Stack>
      </Card>

      <Card withBorder radius="lg" className="table-card">
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>Classes</Title>
            <Text c="dimmed" size="sm">Open a class to view activities.</Text>
          </div>
        </Group>
        <div className="table-head table-head--prof">
          <Text size="xs" c="dimmed">
            Year / Section
          </Text>
          <Text size="xs" c="dimmed">
            Class
          </Text>
          <Text size="xs" c="dimmed">
            Students
          </Text>
          <Text size="xs" c="dimmed">
            Action
          </Text>
        </div>
        {classes.map((item) => (
          <div key={item.id} className="table-row table-row--prof">
            <Text size="sm">
              {item.yearLevel.replace("YEAR_", "Year ")} {item.section}
            </Text>
            <Text size="sm">{item.name}</Text>
            <Badge color="brand" variant="light">
              {item.studentCount} students
            </Badge>
            <Button
              size="xs"
              variant="outline"
              color="brand"
              radius="lg"
              onClick={() => navigate(`/professor/class/${item.id}`)}
            >
              Open
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
