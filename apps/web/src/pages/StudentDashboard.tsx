import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
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
  const themeMode =
    (typeof document !== "undefined" && document.body?.dataset?.theme) || "default";
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

  const classGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
  };

  const classCardStyle = (active: boolean): CSSProperties => ({
    background: active ? "var(--accent-subtle)" : "var(--surface)",
    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    borderRadius: 14,
    padding: 16,
    textAlign: "left",
    cursor: "pointer",
    display: "grid",
    gap: 6,
    backdropFilter: themeMode === "glass" ? "blur(16px)" : undefined,
  });

  const timelineStyle: CSSProperties = {
    display: "grid",
    gap: 12,
  };

  const timelineItemStyle: CSSProperties = {
    borderTop: "1px solid var(--border)",
    paddingTop: 12,
    display: "grid",
    gap: 8,
  };

  const timelineMetaStyle: CSSProperties = {
    display: "grid",
    gap: 6,
  };

  const submitBannerStyle: CSSProperties = {
    background: "var(--surface-alt)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 12,
    display: "grid",
    gap: 4,
  };

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
        <div style={classGridStyle}>
          {classes.map((item) => (
            <button
              key={item.id}
              style={classCardStyle(item.id === selectedClassId)}
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
        <div style={timelineStyle}>
          {timeline.map((item) => (
            <div key={item.id} style={timelineItemStyle}>
              <div>
                <Text fw={600}>{item.title}</Text>
                <Text size="xs" c="dimmed">
                  Due {item.dueAt.slice(0, 10)}
                </Text>
              </div>
              <div style={timelineMetaStyle}>
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
                <div>
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
                </div>
                {item.submissionId && (
                  <div>
                    <Button
                      size="xs"
                      variant="outline"
                      color="brand"
                      radius="lg"
                      onClick={() => navigate(`/dock/${item.submissionId}`)}
                    >
                      Open Dock
                    </Button>
                  </div>
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
          <div style={submitBannerStyle}>
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
