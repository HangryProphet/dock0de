import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../layouts/AppLayout";
import { fetchProfessorClasses, fetchProfessorMetrics } from "../data/api";
import type { ClassInfo, ProfessorMetrics } from "../data/api";

export function ProfessorDashboard() {
  const navigate = useNavigate();
  const { user } = useOutletContext<LayoutContext>();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [metrics, setMetrics] = useState<ProfessorMetrics>({
    activeClasses: 0,
    submissionsNeedingReview: 0,
    dockerEngineHealthy: true,
  });

  useEffect(() => {
    if (!user?.id) return;
    fetchProfessorMetrics(user.id)
      .then(setMetrics)
      .catch(() => undefined);
    fetchProfessorClasses(user.id)
      .then(setClasses)
      .catch(() => setClasses([]));
  }, [user?.id]);

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" className="kpi-card">
        <Stack gap={6}>
          <Text c="dimmed" size="sm">
            Active Classes
          </Text>
          <Title order={1}>{metrics.activeClasses}</Title>
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
          <Title order={1}>{metrics.submissionsNeedingReview}</Title>
          <Text size="sm">Prioritize high-risk runs.</Text>
        </Stack>
      </Card>
      <Card withBorder radius="lg" className="kpi-card">
        <Stack gap={6}>
          <Text c="dimmed" size="sm">
            System Status (Docker Engine)
          </Text>
          <Title order={1}>
            {metrics.dockerEngineHealthy ? "Healthy" : "Down"}
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
        <Group justify="flex-end" mt="md">
          <Pagination total={1} size="sm" radius="md" />
        </Group>
      </Card>
    </div>
  );
}
