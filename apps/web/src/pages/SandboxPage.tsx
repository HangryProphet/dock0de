import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  FileInput,
  Group,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { mockData } from "../data/mockData";

const statusColor: Record<string, string> = {
  SUCCESS: "green",
  FAILED: "red",
  PENDING: "yellow",
  RUNNING: "blue",
};

export function SandboxPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [environment, setEnvironment] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockData.sandboxRuns.filter((item) => {
      const matchesQuery =
        item.studentName.toLowerCase().includes(query.toLowerCase()) ||
        item.activityTitle.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status ? item.status === status : true;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="page-grid">
      <Card withBorder radius="lg" className="table-card quick-test">
        <Group justify="space-between" align="center">
          <div>
            <Title order={3}>Quick Test</Title>
            <Text c="dimmed" size="sm">
              Run a private sandbox test (excluded from metrics).
            </Text>
          </div>
          <Group gap="sm" className="quick-test-controls">
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
        <div className="table-head table-head--prof">
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
          <div key={item.id} className="table-row table-row--prof">
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
        ))}
      </Card>
    </div>
  );
}
