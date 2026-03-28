import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  FileInput,
  Group,
  Pagination,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { mockData } from "../data/mockData";

const statusColor: Record<string, string> = {
  SUCCESS: "green",
  FAILED: "red",
  PENDING: "yellow",
  RUNNING: "blue",
};

export function SandboxPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 720px)");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [environment, setEnvironment] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockData.sandboxRuns.filter((item) => item.isTestRun).filter((item) => {
      const matchesQuery =
        item.studentName.toLowerCase().includes(query.toLowerCase()) ||
        item.activityTitle.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status ? item.status === status : true;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const headStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
    gap: 12,
    padding: "8px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  const rowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
    gap: 12,
    alignItems: "center",
    padding: "12px 0",
    borderTop: "1px solid var(--border)",
    color: "var(--text)",
  };

  return (
    <div className="page-grid" style={{ color: "var(--text)" }}>
      <Card withBorder radius="lg" className="table-card" style={{ background: "var(--surface)" }}>
        <Group justify="space-between" align="center">
          <div>
            <Title order={3}>Quick Test</Title>
            <Text c="dimmed" size="sm">
              Run a private sandbox test (excluded from metrics).
            </Text>
          </div>
          <Group gap="sm" wrap="wrap">
            <FileInput
              placeholder="Select .zip"
              value={file}
              onChange={setFile}
              accept=".zip"
              radius="md"
            />
            <Select
              placeholder="Environment"
              data={mockData.environments}
              value={environment}
              onChange={setEnvironment}
              radius="md"
            />
            <Button
              color="brand"
              radius="lg"
              disabled={!file || !environment}
              onClick={() => navigate("/dock/new-id")}
            >
              Run Test
            </Button>
          </Group>
        </Group>
      </Card>
      <Card withBorder radius="lg" className="table-card">
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>Live Sandbox</Title>
            <Text c="dimmed" size="sm">
              Quick access to student runs for testing.
            </Text>
          </div>
          <Group gap="sm">
            <TextInput
              placeholder="Search students or activities"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              radius="md"
            />
            <Select
              placeholder="Status"
              data={["PENDING", "SUCCESS", "FAILED", "RUNNING"]}
              value={status}
              onChange={setStatus}
              radius="md"
              clearable
            />
          </Group>
        </Group>
        <div style={headStyle}>
          <Text size="xs" c="dimmed">
            Student
          </Text>
          <Text size="xs" c="dimmed">
            Activity
          </Text>
          <Text size="xs" c="dimmed">
            Status
          </Text>
          <Text size="xs" c="dimmed">
            Action
          </Text>
        </div>
        {filtered.map((item) => (
          <div key={item.id} style={rowStyle}>
            <Text size="sm">{item.studentName}</Text>
            <div>
              <Text size="sm">{item.activityTitle}</Text>
              <Text size="xs" c="dimmed">
                {item.className}
              </Text>
            </div>
            <Badge color={statusColor[item.status] ?? "gray"} variant="light">
              {item.status}
            </Badge>
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
          </div>
        ))}
        <Group justify="flex-end" mt="md">
          <Pagination total={1} size="sm" radius="md" />
        </Group>
      </Card>
    </div>
  );
}
