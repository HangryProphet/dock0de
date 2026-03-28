import { Button, Card, Center, Group, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/professor");
  };

  return (
    <Center mih="100svh" p={24}>
      <Card withBorder radius="lg" w="min(480px, 90vw)" p={24}>
        <Title order={2} mb="sm">
          Dock0de Preview Access
        </Title>
        <Text c="dimmed" size="sm" mb="lg">
          Jump into the live dashboard. Login will return later.
        </Text>
        <Button color="brand" radius="lg" fullWidth onClick={handleContinue}>
          Enter Dashboard
        </Button>
        <Group justify="space-between" mt={16}>
          <Text size="xs" c="dimmed">
            No account required for demo.
          </Text>
        </Group>
      </Card>
    </Center>
  );
}
