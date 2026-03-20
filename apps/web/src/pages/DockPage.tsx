import { useMemo, useState } from "react";
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
import type { LayoutContext } from "../layouts/AppLayout";
import { mockData } from "../data/mockData";

export function DockPage() {
  const { id } = useParams<{ id: string }>();
  const { role } = useOutletContext<LayoutContext>();
  const logs = mockData.systemLogs[id ?? ""] ?? mockData.systemLogs["new-id"];
  const report = mockData.auditReports[id ?? ""] ?? mockData.auditReports["new-id"];
  const timelineItem = mockData.studentTimeline.find(
    (item) => item.submissionId === id
  );
  const [score, setScore] = useState(
    timelineItem?.professorScore ? String(timelineItem.professorScore) : ""
  );
  const [comment, setComment] = useState(timelineItem?.professorComment ?? "");

  const logText = useMemo(() => logs.join("\n"), [logs]);

  return (
    <div className="dock-shell">
      <div className="dock-pane dock-pane--left">
        <Card withBorder radius="lg" className="dock-card">
          <Tabs defaultValue="logs">
            <Tabs.List>
              <Tabs.Tab value="logs">Build Logs</Tabs.Tab>
              <Tabs.Tab value="report">Health Report</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="logs" pt="md">
              <div className="terminal">
                <pre>{logText}</pre>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="report" pt="md">
              <Stack gap="sm">
                <Group gap="sm">
                  <Badge color="yellow" variant="light">
                    ESLint Issues: {report.eslintIssues}
                  </Badge>
                  <Badge color="red" variant="light">
                    Snyk Issues: {report.snykIssues}
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  {report.summary}
                </Text>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </div>
      <div className="dock-pane dock-pane--right">
        <Card withBorder radius="lg" className="dock-card">
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
          <div className="preview-frame">
            <iframe title="dock-preview" src="https://example.com" />
          </div>
        </Card>
      </div>
      {role === "PROFESSOR" && (
        <div className="dock-action">
          <Card withBorder radius="lg" className="action-card">
            <Group justify="space-between" align="center">
              <div className="action-fields">
                <Text size="xs" c="dimmed">
                  Professor Score
                </Text>
                <input
                  className="score-input"
                  inputMode="numeric"
                  value={score}
                  onChange={(event) => setScore(event.currentTarget.value)}
                  placeholder="0-100"
                />
              </div>
              <Textarea
                placeholder="Leave a comment"
                minRows={2}
                radius="md"
                className="action-input"
                value={comment}
                onChange={(event) => setComment(event.currentTarget.value)}
              />
              <Button color="brand" radius="lg">
                Submit Grade
              </Button>
            </Group>
          </Card>
        </div>
      )}
    </div>
  );
}
