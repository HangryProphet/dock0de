import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  FileInput,
  Group,
  Modal,
  NumberInput,
  Pagination,
  Select,
  Slider,
  Stack,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  fetchClassActivities,
  fetchClassStudents,
  fetchProfessorClasses,
  createActivity,
  updateActivity,
} from "../data/api";
import type { ActivityInfo, ClassInfo, RosterEntry } from "../data/api";
import type { LayoutContext } from "../layouts/AppLayout";

export function ProfessorClassDashboard() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 720px)");
  const isSmall = useMediaQuery("(max-width: 560px)");
  const themeMode =
    (typeof document !== "undefined" && document.body?.dataset?.theme) || "default";
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { user } = useOutletContext<LayoutContext>();
  const [tab, setTab] = useState<string | null>("metrics");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [activityQuery, setActivityQuery] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [studentStatus, setStudentStatus] = useState<string | null>(null);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [newActivityDueDate, setNewActivityDueDate] = useState("");
  const [newActivityMaxScore, setNewActivityMaxScore] = useState<number>(100);
  const [newActivityFiles, setNewActivityFiles] = useState<File[]>([]);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [activities, setActivities] = useState<ActivityInfo[]>([]);
  const [roster, setRoster] = useState<RosterEntry[]>([]);
  const classId = id ?? classInfo?.id ?? "";
  const todayIso = new Date().toISOString().slice(0, 10);

  function resetActivityForm() {
    setNewActivityTitle("");
    setNewActivityDescription("");
    setNewActivityDueDate("");
    setNewActivityMaxScore(100);
    setNewActivityFiles([]);
  }

  function openCreateActivityModal() {
    setModalMode("create");
    setEditingActivityId(null);
    resetActivityForm();
    setModalOpen(true);
  }

  function openEditActivityModal(activity: ActivityInfo) {
    setModalMode("edit");
    setEditingActivityId(activity.id);
    setNewActivityTitle(activity.title);
    setNewActivityDescription(activity.description ?? "");
    setNewActivityDueDate(activity.dueAt.slice(0, 10));
    setNewActivityMaxScore(activity.maxScore);
    setNewActivityFiles([]);
    setModalOpen(true);
  }

  async function handleSaveActivity() {
    if (!newActivityTitle.trim() || !newActivityDueDate) {
      return;
    }

    try {
      const payload = {
        title: newActivityTitle.trim(),
        description: newActivityDescription.trim(),
        dueAt: new Date(newActivityDueDate).toISOString(),
        maxScore: newActivityMaxScore,
      };

      if (modalMode === "edit" && editingActivityId) {
        const updated = await updateActivity(classId, editingActivityId, payload);
        setActivities((prev) =>
          prev.map((item) => (item.id === editingActivityId ? updated : item))
        );
      } else {
        const created = await createActivity(classId, payload);
        setActivities((prev) => [...prev, created]);
      }

      setModalOpen(false);
      resetActivityForm();
      setEditingActivityId(null);
      setModalMode("create");
    } catch (err) {
      console.error("Failed to save activity", err);
    }
  }

  useEffect(() => {
    const requestedTab = (location.state as { tab?: string } | null)?.tab;
    if (requestedTab === "metrics" || requestedTab === "activities" || requestedTab === "students") {
      setTab(requestedTab);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!id) return;
    fetchProfessorClasses(user?.id)
      .then((items) => {
        const found = items.find((item) => item.id === id) ?? items[0] ?? null;
        setClassInfo(found);
      })
      .catch(() => setClassInfo(null));
  }, [id, user?.id]);

  useEffect(() => {
    if (!id) return;
    fetchClassActivities(id)
      .then(setActivities)
      .catch(() => setActivities([]));
    fetchClassStudents(id)
      .then(setRoster)
      .catch(() => setRoster([]));
  }, [id]);

  const completionRate = useMemo(() => {
    if (!classInfo || activities.length === 0) return 0;
    const totalSlots = classInfo.studentCount * activities.length;
    if (totalSlots === 0) return 0;
    const totalSubmissions = activities.reduce(
      (sum, item) => sum + item.submissionCount,
      0
    );
    return totalSubmissions / totalSlots;
  }, [activities, classInfo]);

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

  const activitiesHeadStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr 1fr 0.8fr 1fr",
    gap: 12,
    padding: "8px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  const activitiesRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr 1fr 0.8fr 1fr",
    gap: 12,
    alignItems: "center",
    padding: 12,
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: 12,
  };

  const studentsHeadStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
    gap: 12,
    padding: "8px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  const studentsRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
    gap: 12,
    alignItems: "center",
    padding: "12px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  const scoreBoxStyle: CSSProperties = {
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 12,
    background:
      themeMode === "cyber"
        ? "rgba(53, 242, 194, 0.08)"
        : themeMode === "glass"
        ? "rgba(255, 255, 255, 0.05)"
        : "var(--surface-alt)",
    borderColor:
      themeMode === "cyber"
        ? "rgba(53, 242, 194, 0.32)"
        : themeMode === "glass"
        ? "rgba(255, 255, 255, 0.24)"
        : "var(--border)",
    backdropFilter: themeMode === "glass" ? "blur(10px)" : undefined,
  };

  const filesBoxStyle: CSSProperties = {
    border: "1px dashed var(--border)",
    borderRadius: 12,
    padding: 12,
    background:
      themeMode === "cyber"
        ? "rgba(53, 242, 194, 0.06)"
        : themeMode === "glass"
        ? "rgba(255, 255, 255, 0.04)"
        : "var(--surface-alt)",
    borderColor:
      themeMode === "cyber"
        ? "rgba(53, 242, 194, 0.3)"
        : themeMode === "glass"
        ? "rgba(255, 255, 255, 0.22)"
        : "var(--border)",
    backdropFilter: themeMode === "glass" ? "blur(10px)" : undefined,
  };

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" className="table-card" style={{ background: "var(--surface)" }}>
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>
              {classInfo?.name ?? "Class"} {classInfo?.section ?? ""}
            </Title>
            <Text size="sm" c="dimmed">
              {classInfo?.yearLevel ? classInfo.yearLevel.replace("YEAR_", "Year ") : ""} class
            </Text>
          </div>
          <Group gap="sm">
            <Badge color="brand" variant="light">
              Invite Code: {classInfo?.inviteCode ?? ""}
            </Badge>
            <Button
              size="xs"
              variant="outline"
              color="brand"
              radius="lg"
              onClick={() => navigate("/professor")}
            >
              Back to Classes
            </Button>
          </Group>
        </Group>
      </Card>

      <Card withBorder radius="lg" className="table-card">
        <Tabs
          value={tab}
          onChange={setTab}
          styles={{
            list: { borderBottom: "1px solid var(--border)" },
            tab: { height: 48, fontWeight: 600, fontSize: 14 },
          }}
        >
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
                  <Title order={1}>{Math.round(completionRate * 100)}%</Title>
                  <Text size="sm">Based on total submissions.</Text>
                </Stack>
              </Card>
              <Card withBorder radius="lg" className="kpi-card">
                <Stack gap={6}>
                  <Text c="dimmed" size="sm">
                    Top ESLint Errors
                  </Text>
                  <div className="metric-list">
                    <Text size="sm">No data yet</Text>
                  </div>
                </Stack>
              </Card>
              <Card withBorder radius="lg" className="kpi-card">
                <Stack gap={6}>
                  <Text c="dimmed" size="sm">
                    Running Containers
                  </Text>
                  <Title order={1}>0</Title>
                  <Text size="sm">Phase 1 backend (no runs).</Text>
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
              <Group gap="sm" wrap="wrap">
                <TextInput
                  placeholder="Search activities"
                  value={activityQuery}
                  onChange={(event) => setActivityQuery(event.currentTarget.value)}
                  radius="md"
                />
                <Button color="brand" radius="lg" onClick={openCreateActivityModal}>
                  Create Activity
                </Button>
              </Group>
            </Group>
            <div style={activitiesHeadStyle}>
              <Text size="xs" c="dimmed">
                Activity
              </Text>
              <Text size="xs" c="dimmed">
                Due Date
              </Text>
              <Text size="xs" c="dimmed">
                Submissions
              </Text>
              <Text size="xs" c="dimmed">Max Score</Text>
              <Text size="xs" c="dimmed">Action</Text>
            </div>
            {filteredActivities.map((item) => (
              <div key={item.id} style={activitiesRowStyle}>
                <Text size="sm">{item.title}</Text>
                <Text size="sm">{item.dueAt.slice(0, 10)}</Text>
                <Badge color="brand" variant="light">
                  {item.submissionCount}
                </Badge>
                <Text size="sm">{item.maxScore}</Text>
                <Group gap="xs" wrap="wrap">
                  <Button
                    size="xs"
                    variant="outline"
                    color="brand"
                    radius="lg"
                    onClick={() =>
                      navigate(`/professor/class/${classId}/activities/${item.id}`)
                    }
                  >
                    Open
                  </Button>
                  <Button
                    size="xs"
                    variant="light"
                    color="brand"
                    radius="lg"
                    onClick={() => openEditActivityModal(item)}
                  >
                    Edit
                  </Button>
                </Group>
              </div>
            ))}
            <Group justify="flex-end" mt="md">
              <Pagination total={1} size="sm" radius="md" />
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value="students" pt="md">
            <Group justify="space-between" align="center" mb="md">
              <div>
                <Title order={3}>Students</Title>
                <Text c="dimmed" size="sm">
                  Enrollment roster and status.
                </Text>
              </div>
              <Group gap="sm" wrap="wrap">
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
            <div style={studentsHeadStyle}>
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
              <div key={item.studentId} style={studentsRowStyle}>
                <Text size="sm">{item.studentName}</Text>
                <Badge color={item.status === "ACTIVE" ? "green" : "gray"} variant="light">
                  {item.status}
                </Badge>
                <Text size="sm">{item.lastActivity ?? "-"}</Text>
                <div>
                  <Button
                    size="xs"
                    variant="outline"
                    color="brand"
                    radius="lg"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
            <Group justify="flex-end" mt="md">
              <Pagination total={1} size="sm" radius="md" />
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingActivityId(null);
          setModalMode("create");
          resetActivityForm();
        }}
        title={modalMode === "edit" ? "Edit Activity" : "Create Activity"}
        size="lg"
        centered
      >
        <Stack gap={10}>
          <TextInput
            label="Title"
            placeholder="Week 6 Lab"
            radius="md"
            value={newActivityTitle}
            onChange={(event) => setNewActivityTitle(event.currentTarget.value)}
          />
          <Textarea
            label="Description"
            placeholder="Write full activity instructions, requirements, and grading notes..."
            radius="md"
            autosize
            minRows={6}
            maxRows={10}
            value={newActivityDescription}
            onChange={(event) => setNewActivityDescription(event.currentTarget.value)}
          />
          <div style={filesBoxStyle}>
            <FileInput
              label="Activity Files"
              description="Attach references (PDF, DOC, DOCX, PPT, PPTX, TXT)."
              placeholder="Add supporting files"
              multiple
              clearable
              radius="md"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
              value={newActivityFiles}
              onChange={(files) => setNewActivityFiles(files ?? [])}
            />
            {newActivityFiles.length > 0 && (
              <Text size="xs" c="dimmed" mt="xs">
                {newActivityFiles.length} file{newActivityFiles.length === 1 ? "" : "s"} ready to attach.
              </Text>
            )}
          </div>
          <TextInput
            label="Due Date"
            type="date"
            min={todayIso}
            radius="md"
            styles={{
              input: {
                color: "var(--text)",
                colorScheme: themeMode === "default" ? "light" : "dark",
              },
            }}
            value={newActivityDueDate}
            onChange={(event) => setNewActivityDueDate(event.currentTarget.value)}
          />
          <div style={scoreBoxStyle}>
            <NumberInput
              label="Max Score"
              description="Type a value or use the slider below."
              min={1}
              max={300}
              step={5}
              radius="md"
              value={newActivityMaxScore}
              onChange={(value) => {
                if (typeof value === "number" && Number.isFinite(value)) {
                  const bounded = Math.min(300, Math.max(1, Math.round(value)));
                  setNewActivityMaxScore(bounded);
                }
              }}
            />
            <Slider
              mt="sm"
              style={{ marginBottom: isSmall ? 28 : 22 }}
              color="brand"
              styles={{
                bar: { background: "var(--accent)" },
                thumb: { borderColor: "var(--accent)", background: "var(--surface)" },
                track: { background: "color-mix(in srgb, var(--border) 85%, transparent)" },
                markLabel: { color: "var(--text-secondary)" },
              }}
              min={10}
              max={200}
              step={5}
              marks={[
                { value: 25, label: "25" },
                { value: 50, label: "50" },
                { value: 100, label: "100" },
                { value: 150, label: "150" },
                { value: 200, label: "200" },
              ]}
              value={Math.min(200, Math.max(10, newActivityMaxScore))}
              onChange={(value) => setNewActivityMaxScore(value)}
              label={(value) => `${value} pts`}
            />
            <Text size="xs" c="dimmed" mt="md" style={{ lineHeight: 1.35 }}>
              Recommended classroom range: 10-200 points.
            </Text>
          </div>
          <Group justify="flex-end">
            <Button
              variant="outline"
              color="brand"
              radius="lg"
              onClick={() => {
                setModalOpen(false);
                setEditingActivityId(null);
                setModalMode("create");
                resetActivityForm();
              }}
            >
              Cancel
            </Button>
            <Button
              color="brand"
              radius="lg"
              onClick={handleSaveActivity}
              disabled={!newActivityTitle.trim() || !newActivityDueDate}
            >
              {modalMode === "edit" ? "Save Changes" : "Create"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
