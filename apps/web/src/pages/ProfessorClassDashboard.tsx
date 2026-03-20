import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { mockData } from "../data/mockData";

export function ProfessorClassDashboard() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const classInfo = mockData.classes.find((item) => item.id === id) ?? mockData.classes[0];
  const metrics = mockData.classMetrics[classInfo.id];
  const [tab, setTab] = useState<string | null>("metrics");
  const [modalOpen, setModalOpen] = useState(false);
  const [activityQuery, setActivityQuery] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [studentStatus, setStudentStatus] = useState<string | null>(null);
  const activities = useMemo(
    () => mockData.activities.filter((item) => item.classId === classInfo.id),
    [classInfo.id]
  );
  const roster = mockData.classRoster[classInfo.id] ?? [];

  const filteredActivities = useMemo(() => {
    return activities.filter((item) =>
      item.title.toLowerCase().includes(activityQuery.toLowerCase())
    );
  }, [activities, activityQuery]);

  const filteredRoster = useMemo(() => {
    return roster.filter((item) => {
      const matchesQuery = item.studentName
        .toLowerCase()
        .includes(studentQuery.toLowerCase());
      const matchesStatus = studentStatus ? item.status === studentStatus : true;
      return matchesQuery && matchesStatus;
    });
  }, [roster, studentQuery, studentStatus]);

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" className="table-card class-header">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>
              {classInfo.name} {classInfo.section}
            </Title>
            <Text size="sm" c="dimmed">
              {classInfo.yearLevel.replace("YEAR_", "Year ")} class
            </Text>
          </div>
          <Badge color="brand" variant="light">
            Invite Code: {classInfo.inviteCode}
          </Badge>
        </Group>
      </Card>

      <Card withBorder radius="lg" className="table-card">
        <Tabs value={tab} onChange={setTab} className="class-tabs">
          <Tabs.List>
            <Tabs.Tab value="metrics">Metrics</Tabs.Tab>
            <Tabs.Tab value="activities">Activities</Tabs.Tab>
            <Tabs.Tab value="students">Students</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="metrics" pt="md">
            <div className="page-grid">
              <Card withBorder radius="lg" className="kpi-card">
                <Stack gap={6}>
                  <Text c="dimmed" size="sm">
                    Completion Rate
                  </Text>
                  <Title order={1}>{Math.round(metrics.completionRate * 100)}%</Title>
                  <Text size="sm">Based on latest activity submissions.</Text>
                </Stack>
              </Card>
              <Card withBorder radius="lg" className="kpi-card">
                <Stack gap={6}>
                  <Text c="dimmed" size="sm">
                    Top ESLint Errors
                  </Text>
                  <div className="metric-list">
                    {metrics.topEslintErrors.map((item) => (
                      <Text key={item} size="sm">
                        {item}
                      </Text>
                    ))}
                  </div>
                </Stack>
              </Card>
              <Card withBorder radius="lg" className="kpi-card">
                <Stack gap={6}>
                  <Text c="dimmed" size="sm">
                    Running Containers
                  </Text>
                  <Title order={1}>{metrics.runningContainers}</Title>
                  <Text size="sm">Active grading sessions.</Text>
                </Stack>
              </Card>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="activities" pt="md">
            <Group justify="space-between" align="center" mb="md">
              <div>
                <Title order={3}>Activities</Title>
                <Text c="dimmed" size="sm">
                  Manage class tasks and deadlines.
                </Text>
              </div>
              <Group gap="sm" className="activities-toolbar">
                <TextInput
                  placeholder="Search activities"
                  value={activityQuery}
                  onChange={(event) => setActivityQuery(event.currentTarget.value)}
                  radius="md"
                />
                <Button color="brand" radius="lg" onClick={() => setModalOpen(true)}>
                  Create Activity
                </Button>
              </Group>
            </Group>
            <div className="table-head table-head--prof">
              <Text size="xs" c="dimmed">
                Activity
              </Text>
              <Text size="xs" c="dimmed">
                Due Date
              </Text>
              <Text size="xs" c="dimmed">
                Submissions
              </Text>
              <Text size="xs" c="dimmed">Health Avg</Text>
            </div>
            {filteredActivities.map((item) => (
              <div key={item.id} className="table-row table-row--prof">
                <Text size="sm">{item.title}</Text>
                <Text size="sm">{item.dueAt.slice(0, 10)}</Text>
                <Badge color="brand" variant="light">
                  {item.submissionCount}
                </Badge>
                <Button
                  size="xs"
                  variant="outline"
                  color="brand"
                  radius="lg"
                  onClick={() => navigate(`/professor/class/${classInfo.id}/activities/${item.id}`)}
                >
                  Open Matrix
                </Button>
              </div>
            ))}
          </Tabs.Panel>

          <Tabs.Panel value="students" pt="md">
            <Group justify="space-between" align="center" mb="md">
              <div>
                <Title order={3}>Students</Title>
                <Text c="dimmed" size="sm">
                  Enrollment roster and status.
                </Text>
              </div>
              <Group gap="sm" className="activities-toolbar">
                <TextInput
                  placeholder="Search students"
                  value={studentQuery}
                  onChange={(event) => setStudentQuery(event.currentTarget.value)}
                  radius="md"
                />
                <Select
                  placeholder="Status"
                  data={["ACTIVE", "INACTIVE"]}
                  value={studentStatus}
                  onChange={setStudentStatus}
                  radius="md"
                  clearable
                />
              </Group>
            </Group>
            <div className="table-head table-head--prof">
              <Text size="xs" c="dimmed">
                Student
              </Text>
              <Text size="xs" c="dimmed">
                Status
              </Text>
              <Text size="xs" c="dimmed">
                Last Activity
              </Text>
              <Text size="xs" c="dimmed">
                Action
              </Text>
            </div>
            {filteredRoster.map((item) => (
              <div key={item.studentId} className="table-row table-row--prof">
                <Text size="sm">{item.studentName}</Text>
                <Badge color={item.status === "ACTIVE" ? "green" : "gray"} variant="light">
                  {item.status}
                </Badge>
                <Text size="sm">{item.lastActivity ?? "-"}</Text>
                <Button
                  size="xs"
                  variant="outline"
                  color="brand"
                  radius="lg"
                >
                  View
                </Button>
              </div>
            ))}
          </Tabs.Panel>
        </Tabs>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Activity"
        centered
      >
        <Stack gap="sm">
          <TextInput label="Title" placeholder="Week 6 Lab" radius="md" />
          <Textarea label="Description" placeholder="Brief assignment notes" radius="md" />
          <TextInput label="Due Date" placeholder="YYYY-MM-DD" radius="md" />
          <Group justify="flex-end">
            <Button
              variant="outline"
              color="brand"
              radius="lg"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button color="brand" radius="lg" onClick={() => setModalOpen(false)}>
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
