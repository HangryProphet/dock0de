import { Button, Card, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/professor");
  };

  return (
    <div className="auth-shell">
      <Card withBorder radius="lg" className="auth-card">
        <Title order={2} mb="sm">
          Dock0de Preview Access
        </Title>
        <Text c="dimmed" size="sm" mb="lg">
          Jump into the live dashboard. Login will return later.
        </Text>
        <Button color="brand" radius="lg" fullWidth onClick={handleContinue}>
          Enter Dashboard
        </Button>
        <div className="auth-links">
          <Text size="xs" c="dimmed">
            No account required for demo.
          </Text>
        </div>
      </Card>
    </div>
  );
}
