import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  FileInput,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { LayoutContext } from "../layouts/AppLayout";
import {
  fetchStudentActivities,
  fetchStudentClasses,
} from "../data/api";
import type { ClassInfo, TimelineItem } from "../data/api";

const statusColor: Record<string, string> = {
  SUCCESS: "green",
  FAILED: "red",
  PENDING: "yellow",
  RUNNING: "blue",
};

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useOutletContext<LayoutContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const selectedClassId = searchParams.get("classId") ?? classes[0]?.id ?? "";
  const selectedClass = classes.find((item) => item.id === selectedClassId);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitActivity, setSubmitActivity] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [environment, setEnvironment] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchStudentClasses(user.id)
      .then(setClasses)
      .catch(() => setClasses([]));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !selectedClassId) return;
    fetchStudentActivities(selectedClassId, user.id)
      .then(setTimeline)
      .catch(() => setTimeline([]));
  }, [selectedClassId, user?.id]);

  const submitActivityInfo = useMemo(
    () => timeline.find((activity) => activity.activityId === submitActivity),
    [timeline, submitActivity]
  );

  const pendingGrades = useMemo(
    () => timeline.filter((item) => item.status === "PENDING").length,
    [timeline]
  );

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" className="table-card">
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>My Classes</Title>
            <Text c="dimmed" size="sm">
              Select a class to view its activity timeline.
            </Text>
          </div>
          <Button variant="outline" color="brand" radius="lg">
            Join Class
          </Button>
        </Group>
        <div className="class-grid">
          {classes.map((item) => (
            <button
              key={item.id}
              className={`class-card${item.id === selectedClassId ? " is-active" : ""}`}
              onClick={() => setSearchParams({ classId: item.id })}
            >
              <Text size="xs" c="dimmed">
                {item.yearLevel.replace("YEAR_", "Year ")} {item.section}
              </Text>
              <Title order={4}>{item.name}</Title>
              <Text size="xs" c="dimmed">
                {item.studentCount} students
              </Text>
            </button>
          ))}
        </div>
      </Card>

      <Card withBorder radius="lg" className="table-card">
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>Activity Timeline</Title>
            <Text c="dimmed" size="sm">
              {selectedClass ? `${selectedClass.name} ${selectedClass.section}` : "Select a class"}
            </Text>
          </div>
          <Badge variant="light" color="brand">
            {pendingGrades} pending grades
          </Badge>
        </Group>
        <div className="timeline">
          {timeline.map((item) => (
            <div key={item.id} className="timeline-item">
              <div>
                <Text fw={600}>{item.title}</Text>
                <Text size="xs" c="dimmed">
                  Due {item.dueAt.slice(0, 10)}
                </Text>
              </div>
              <div className="timeline-meta">
                <Badge color={statusColor[item.status] ?? "gray"} variant="light">
                  {item.status}
                </Badge>
                {item.professorScore !== undefined && (
                  <Text size="xs">Score: {item.professorScore}</Text>
                )}
                {item.professorComment && (
                  <Text size="xs" c="dimmed">
                    {item.professorComment}
                  </Text>
                )}
                <Button
                  size="xs"
                  variant="outline"
                  color="brand"
                  radius="lg"
                  onClick={() => {
                    setSubmitActivity(item.activityId);
                    setSubmitOpen(true);
                  }}
                >
                  Submit Work
                </Button>
                {item.submissionId && (
                  <Button
                    size="xs"
                    variant="outline"
                    color="brand"
                    radius="lg"
                    onClick={() => navigate(`/dock/${item.submissionId}`)}
                  >
                    Open Dock
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        opened={submitOpen}
        onClose={() => setSubmitOpen(false)}
        title="Submit Work"
        centered
      >
        <Stack gap="sm">
          <div className="submit-banner">
            <Text size="xs" c="dimmed">
              Class
            </Text>
            <Text fw={600}>
              {selectedClass ? `${selectedClass.name} ${selectedClass.section}` : ""}
            </Text>
            <Text size="xs" c="dimmed">
              Activity
            </Text>
            <Text fw={600}>
              {submitActivityInfo?.title ?? ""}
            </Text>
          </div>
          <Text size="sm" c="dimmed">
            Upload a .zip for this activity.
          </Text>
          <FileInput
            label="Submission"
            placeholder="Select .zip file"
            value={file}
            onChange={setFile}
            accept=".zip"
            radius="md"
          />
          <Select
            label="Environment"
            placeholder="Select runtime"
            data={[
              { value: "REACT", label: "React/Vite" },
              { value: "NODE", label: "Node.js" },
              { value: "JAVA", label: "Java" },
            ]}
            value={environment}
            onChange={setEnvironment}
            radius="md"
          />
          <Group justify="flex-end">
            <Button
              variant="outline"
              color="brand"
              radius="lg"
              onClick={() => setSubmitOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="brand"
              radius="lg"
              disabled={!file || !environment || !submitActivity}
              onClick={() => {
                setSubmitOpen(false);
                navigate("/dock/new-id");
              }}
            >
              Start Run
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
