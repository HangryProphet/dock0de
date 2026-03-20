import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Group, Text, TextInput, Title } from "@mantine/core";
import { mockData } from "../data/mockData";

export function ActivityArchive() {
  const navigate = useNavigate();
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
          <Text size="xs" c="dimmed">
            Action
          </Text>
        </div>
        {activities.map((item) => (
          <div key={item.id} className="table-row table-row--prof">
            <Text size="sm">{item.title}</Text>
            <Text size="sm">{item.dueAt.slice(0, 10)}</Text>
            <Text size="sm">{item.submissionCount}</Text>
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
        ))}
      </Card>
    </div>
  );
}
