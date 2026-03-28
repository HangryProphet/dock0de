import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { LayoutContext } from "../layouts/AppLayout";
import { mockData } from "../data/mockData";

export function DockPage() {
  const { id } = useParams<{ id: string }>();
  const { role } = useOutletContext<LayoutContext>();
  const isTablet = useMediaQuery("(max-width: 1100px)");
  const logs = mockData.systemLogs[id ?? ""] ?? mockData.systemLogs["new-id"];
  const report = mockData.auditReports[id ?? ""] ?? mockData.auditReports["new-id"];
  const timelineItem = mockData.studentTimeline.find(
    (item) => item.submissionId === id
  );
  const activity = mockData.activities.find(
    (item) => item.id === timelineItem?.activityId
  );
  const maxScore = activity?.maxScore ?? 100;
  const [score, setScore] = useState(
    timelineItem?.professorScore ? String(timelineItem.professorScore) : ""
  );
  const [comment, setComment] = useState(timelineItem?.professorComment ?? "");

  const logText = useMemo(() => logs.join("\n"), [logs]);

  const shellStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isTablet ? "1fr" : "minmax(0, 3fr) minmax(0, 2fr)",
    gap: 20,
    position: "relative",
  };

  const terminalStyle: CSSProperties = {
    background: "var(--terminal-bg)",
    color: "var(--terminal-text)",
    borderRadius: 12,
    padding: 16,
    fontFamily: "ui-monospace, Consolas, monospace",
    fontSize: 12,
    minHeight: 240,
  };

  const previewFrameStyle: CSSProperties = {
    border: "1px solid var(--border)",
    borderRadius: 12,
    overflow: "hidden",
    height: 360,
  };

  const actionCardStyle: CSSProperties = {
    marginTop: 16,
    padding: 16,
  };

  const actionFieldsStyle: CSSProperties = {
    display: "grid",
    gap: 6,
    minWidth: 140,
  };

  const scoreInputStyle: CSSProperties = {
    height: 36,
    borderRadius: 12,
    border: "1px solid var(--border)",
    padding: "0 10px",
    fontFamily: "Manrope, Sora, Noto Sans, Segoe UI, sans-serif",
    outline: "none",
  };

  return (
    <div style={shellStyle}>
      <div>
        <Card withBorder radius="lg" style={{ minHeight: 420 }}>
          <Tabs defaultValue="logs">
            <Tabs.List>
              <Tabs.Tab value="logs">Build Logs</Tabs.Tab>
              <Tabs.Tab value="report">Health Report</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="logs" pt="md">
              <div style={terminalStyle}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{logText}</pre>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="report" pt="md">
              <Stack gap="sm">
                <Group gap="sm">
                  <Badge color="yellow" variant="light" styles={{ root: { color: "var(--terminal-text)" } }}>
                    ESLint Issues: {report.eslintIssues}
                  </Badge>
                  <Badge color="red" variant="light" styles={{ root: { color: "var(--terminal-text)" } }}>
                    Snyk Issues: {report.snykIssues}
                  </Badge>
                </Group>
                <Text size="sm" style={{ color: "var(--terminal-text)" }}>
                  {report.summary}
                </Text>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </div>
      <div>
        <Card withBorder radius="lg" style={{ minHeight: 420 }}>
          <Group justify="space-between" mb="sm">
            <div>
              <Title order={3}>Live Preview</Title>
              <Text size="sm" c="dimmed">
                Placeholder preview for the running app.
              </Text>
            </div>
            <Button variant="outline" color="brand" radius="lg" size="xs">
              Open in new tab
            </Button>
          </Group>
          <div style={previewFrameStyle}>
            <iframe title="dock-preview" src="https://example.com" style={{ width: "100%", height: "100%", border: 0 }} />
          </div>
        </Card>
      </div>
      {role === "PROFESSOR" && (
        <div style={{ gridColumn: "1 / -1" }}>
          <Card withBorder radius="lg" style={actionCardStyle}>
            <Group justify="space-between" align="center">
              <div style={actionFieldsStyle}>
                <Text size="xs" c="dimmed">
                  Score / {maxScore}
                </Text>
                <input
                  style={scoreInputStyle}
                  inputMode="numeric"
                  value={score}
                  onChange={(event) => setScore(event.currentTarget.value)}
                  placeholder={`0-${maxScore}`}
                />
              </div>
              <Textarea
                placeholder="Leave a comment"
                minRows={2}
                radius="md"
                style={{ flex: 1, minWidth: 320 }}
                value={comment}
                onChange={(event) => setComment(event.currentTarget.value)}
              />
              <Button color="brand" radius="lg" size="sm">
                Submit Grade
              </Button>
            </Group>
          </Card>
        </div>
      )}
    </div>
  );
}
