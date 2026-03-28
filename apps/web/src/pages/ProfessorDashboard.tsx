import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../layouts/AppLayout";
import {
  fetchProfessorClasses,
  fetchProfessorMetrics,
  fetchProfessorRecentSubmissions,
} from "../data/api";
import type {
  ClassInfo,
  ProfessorMetrics,
  ProfessorRecentSubmission,
} from "../data/api";

export function ProfessorDashboard() {
  const navigate = useNavigate();
  const isCompact = useMediaQuery("(max-width: 1100px)");
  const isMobile = useMediaQuery("(max-width: 720px)");
  const themeMode =
    (typeof document !== "undefined" && document.body?.dataset?.theme) || "default";
  const { user } = useOutletContext<LayoutContext>();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<ProfessorRecentSubmission[]>([]);
  const [metrics, setMetrics] = useState<ProfessorMetrics>({
    activeClasses: 0,
    activeActivities: 0,
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
    fetchProfessorRecentSubmissions(user.id, 12)
      .then(setRecentSubmissions)
      .catch(() => setRecentSubmissions([]));
  }, [user?.id]);

  const attentionActivities = useMemo(() => {
    const attentionStatuses = new Set([
      "PENDING",
      "QUEUED",
      "BUILDING",
      "RUNNING",
      "FAILED",
      "TIMEOUT",
    ]);
    const grouped = new Map<
      string,
      {
        classId: string;
        activityId: string | null;
        activityTitle: string;
        className: string;
        total: number;
        pending: number;
        issues: number;
        latestSubmittedAt: string;
      }
    >();

    recentSubmissions
      .filter((item) => attentionStatuses.has(item.status))
      .forEach((item) => {
        const key = `${item.classId}:${item.activityId ?? item.activityTitle}`;
        const current = grouped.get(key);
        if (!current) {
          grouped.set(key, {
            classId: item.classId,
            activityId: item.activityId,
            activityTitle: item.activityTitle,
            className: item.className,
            total: 1,
            pending: item.status === "PENDING" ? 1 : 0,
            issues: item.status === "FAILED" || item.status === "TIMEOUT" ? 1 : 0,
            latestSubmittedAt: item.submittedAt,
          });
          return;
        }
        current.total += 1;
        current.pending += item.status === "PENDING" ? 1 : 0;
        current.issues += item.status === "FAILED" || item.status === "TIMEOUT" ? 1 : 0;
        if (new Date(item.submittedAt).getTime() > new Date(current.latestSubmittedAt).getTime()) {
          current.latestSubmittedAt = item.submittedAt;
        }
      });

    return Array.from(grouped.values())
      .sort(
        (a, b) =>
          new Date(b.latestSubmittedAt).getTime() - new Date(a.latestSubmittedAt).getTime()
      )
      .slice(0, 6);
  }, [recentSubmissions]);

  const recentPreview = recentSubmissions.slice(0, 5);

  const summaryStripGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isCompact ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 12,
  };

  const summaryPillStyle: CSSProperties = {
    border: "1px solid var(--border)",
    borderRadius: 12,
    background:
      themeMode === "cyber" || themeMode === "glass"
        ? "color-mix(in srgb, var(--surface-alt) 85%, transparent)"
        : "var(--surface-alt)",
    padding: "12px 14px",
    display: "grid",
    gap: 6,
  };

  const attentionRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.2fr auto",
    gap: 14,
    alignItems: "center",
    padding: "12px 0",
    borderTop: "1px solid var(--border)",
  };

  const compactHeadStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "0.9fr 1.2fr 0.8fr",
    gap: 12,
    padding: "8px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  const compactRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "0.9fr 1.2fr 0.8fr",
    gap: 12,
    alignItems: "center",
    padding: "12px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  const classesHeadStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 0.9fr 0.9fr 0.8fr",
    gap: 12,
    padding: "8px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  const classesRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 0.9fr 0.9fr 0.8fr",
    gap: 12,
    alignItems: "center",
    padding: "12px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" style={{ gridColumn: "span 12" }}>
        <div style={summaryStripGridStyle}>
          <div style={summaryPillStyle}>
            <Text c="dimmed" size="xs">
              Active Classes
            </Text>
            <Title order={2}>{metrics.activeClasses}</Title>
          </div>
          <div style={summaryPillStyle}>
            <Text c="dimmed" size="xs">
              Active Activities
            </Text>
            <Title order={2}>{metrics.activeActivities}</Title>
          </div>
          <div style={{ ...summaryPillStyle, borderColor: "color-mix(in srgb, var(--error-border) 45%, var(--border))" }}>
            <Group gap={8} align="center">
              <Text c="dimmed" size="xs">
                Needs Review
              </Text>
              <Badge color="red" variant="light" size="xs">
                Urgent
              </Badge>
            </Group>
            <Title order={2}>{metrics.submissionsNeedingReview}</Title>
          </div>
        </div>
      </Card>

      <Card
        withBorder
        radius="lg"
        style={{
          gridColumn: isCompact ? "span 6" : "span 8",
          boxShadow:
            themeMode === "cyber" || themeMode === "glass"
              ? "inset 0 1px 0 rgba(255, 255, 255, 0.03)"
              : undefined,
        }}
      >
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>Activities Requiring Attention</Title>
            <Text c="dimmed" size="sm">
              Prioritize grading and unstable runs first.
            </Text>
          </div>
          <Badge color={metrics.dockerEngineHealthy ? "green" : "red"} variant="light">
            Docker {metrics.dockerEngineHealthy ? "Healthy" : "Down"}
          </Badge>
        </Group>

        {attentionActivities.length === 0 && (
          <Text size="sm" c="dimmed">
            No priority activities right now.
          </Text>
        )}

        {attentionActivities.map((item) => (
          <div key={`${item.classId}-${item.activityId ?? item.activityTitle}`} style={attentionRowStyle}>
            <div>
              <Text size="sm" fw={700}>
                {item.activityTitle}
              </Text>
              <Text size="xs" c="dimmed">
                {item.className} · Last update {new Date(item.latestSubmittedAt).toLocaleString()}
              </Text>
            </div>
            <Group gap="xs" align="center">
              <Badge color="blue" variant="light">
                {item.total} submissions
              </Badge>
              {item.issues > 0 ? (
                <Badge color="red" variant="light">
                  {item.issues} issues
                </Badge>
              ) : (
                <Badge color="yellow" variant="light">
                  {item.pending} pending
                </Badge>
              )}
              <div>
                <Button
                  size="xs"
                  color="brand"
                  variant="outline"
                  radius="lg"
                  disabled={!item.activityId}
                  onClick={() => {
                    if (!item.activityId) return;
                    navigate(`/professor/class/${item.classId}/activities/${item.activityId}`);
                  }}
                >
                  Open
                </Button>
              </div>
            </Group>
          </div>
        ))}
      </Card>

      <Card
        withBorder
        radius="lg"
        style={{
          gridColumn: isCompact ? "span 6" : "span 4",
          boxShadow:
            themeMode === "cyber" || themeMode === "glass"
              ? "inset 0 1px 0 rgba(255, 255, 255, 0.03)"
              : undefined,
        }}
      >
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={4}>Recent Student Uploads</Title>
            <Text c="dimmed" size="sm">
              Latest few submissions only.
            </Text>
          </div>
        </Group>

        <div style={compactHeadStyle}>
          <Text size="xs" c="dimmed">
            Student
          </Text>
          <Text size="xs" c="dimmed">
            Activity
          </Text>
          <Text size="xs" c="dimmed">
            Action
          </Text>
        </div>
        {recentPreview.map((item) => (
          <div key={item.submissionId} style={compactRowStyle}>
            <div>
              <Text size="sm" fw={600}>
                {item.studentName}
              </Text>
              <Text size="xs" c="dimmed">
                {item.className}
              </Text>
            </div>
            <div>
              <Button
                size="xs"
                variant="subtle"
                color="brand"
                radius="lg"
                onClick={() => {
                  if (!item.activityId) return;
                  navigate(`/professor/class/${item.classId}/activities/${item.activityId}`);
                }}
                disabled={!item.activityId}
              >
                {item.activityTitle}
              </Button>
              <Text size="xs" c="dimmed">
                {item.environment} · {item.status}
              </Text>
            </div>
            <div>
              <Button
                size="xs"
                variant="outline"
                color="brand"
                radius="lg"
                onClick={() => navigate(`/professor/class/${item.classId}/activities`)}
              >
                Open Work
              </Button>
            </div>
          </div>
        ))}
      </Card>

      <Card
        withBorder
        radius="lg"
        className="table-card"
        style={{
          gridColumn: "span 12",
          boxShadow:
            themeMode === "cyber" || themeMode === "glass"
              ? "inset 0 1px 0 rgba(255, 255, 255, 0.03)"
              : undefined,
        }}
      >
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>Classes</Title>
            <Text c="dimmed" size="sm">Class overview and quick activity access.</Text>
          </div>
        </Group>
        <div style={classesHeadStyle}>
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
            Activities
          </Text>
          <Text size="xs" c="dimmed">
            Action
          </Text>
        </div>
        {classes.map((item) => (
          <div key={item.id} style={classesRowStyle}>
            <Text size="sm">
              {item.yearLevel.replace("YEAR_", "Year ")} {item.section}
            </Text>
            <Text size="sm">{item.name}</Text>
            <Badge color="brand" variant="light">
              {item.studentCount} students
            </Badge>
            <div>
              <Button
                size="xs"
                variant="light"
                color="brand"
                radius="lg"
                onClick={() =>
                  navigate(`/professor/class/${item.id}`, {
                    state: { tab: "activities" },
                  })
                }
              >
                {item.activeActivities} active
              </Button>
            </div>
            <div>
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
          </div>
        ))}
        <Group justify="flex-end" mt="md">
          <Pagination total={1} size="sm" radius="md" />
        </Group>
      </Card>
    </div>
  );
}
