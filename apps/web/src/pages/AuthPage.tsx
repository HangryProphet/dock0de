import { useState } from "react";
import { Button, Card, Tabs, Text, TextInput, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<string | null>("login");
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/student");
  };

  return (
    <div className="auth-shell">
      <Card withBorder radius="lg" className="auth-card">
        <Title order={2} mb="sm">
          Welcome to Dock0de
        </Title>
        <Text c="dimmed" size="sm" mb="lg">
          Secure sandbox access for students and professors.
        </Text>
        <Tabs value={activeTab} onChange={setActiveTab} mb="md">
          <Tabs.List>
            <Tabs.Tab value="login">Login</Tabs.Tab>
            <Tabs.Tab value="register">Register</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="login" pt="md">
            <TextInput label="Email" placeholder="you@school.edu" radius="md" />
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter password"
              radius="md"
              mt="sm"
            />
          </Tabs.Panel>
          <Tabs.Panel value="register" pt="md">
            <TextInput label="Full name" placeholder="A. Student" radius="md" />
            <TextInput label="Email" placeholder="you@school.edu" radius="md" mt="sm" />
            <TextInput
              label="Password"
              type="password"
              placeholder="Create password"
              radius="md"
              mt="sm"
            />
          </Tabs.Panel>
        </Tabs>
        <Button color="brand" radius="lg" fullWidth onClick={handleContinue}>
          Continue
        </Button>
        <div className="auth-links">
          <Text size="xs" c="dimmed">
            Forgot password
          </Text>
          <Text size="xs" c="dimmed">
            Back to landing
          </Text>
        </div>
      </Card>
    </div>
  );
}
