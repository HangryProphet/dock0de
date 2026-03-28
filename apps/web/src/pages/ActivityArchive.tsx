import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Group, Text, TextInput, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { mockData } from "../data/mockData";

export function ActivityArchive() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 720px)");
  const { id } = useParams<{ id: string }>();
  const [query, setQuery] = useState("");
  const classId = id ?? mockData.classes[0]?.id;

  const activities = useMemo(() => {
    return mockData.activities.filter((item) => {
      const matchesClass = item.classId === classId;
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
      return matchesClass && matchesQuery;
    });
  }, [classId, query]);

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
    <div className="page-grid">
      <Card withBorder radius="lg" className="table-card">
        <Group justify="space-between" align="center" mb="md">
          <div>
            <Title order={3}>Activity Archive</Title>
            <Text c="dimmed" size="sm">
              Search and open the submission matrix.
            </Text>
          </div>
          <TextInput
            placeholder="Search activities"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            radius="md"
          />
        </Group>
        <div style={headStyle}>
          <Text size="xs" c="dimmed">
            Activity
          </Text>
          <Text size="xs" c="dimmed">
            Due Date
          </Text>
          <Text size="xs" c="dimmed">
            Submissions
          </Text>
          <Text size="xs" c="dimmed">
            Action
          </Text>
        </div>
        {activities.map((item) => (
          <div key={item.id} style={rowStyle}>
            <Text size="sm">{item.title}</Text>
            <Text size="sm">{item.dueAt.slice(0, 10)}</Text>
            <Text size="sm">{item.submissionCount}</Text>
            <div>
              <Button
                size="xs"
                variant="outline"
                color="brand"
                radius="lg"
                onClick={() => navigate(`/professor/class/${classId}/activities/${item.id}`)}
              >
                Open Matrix
              </Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
