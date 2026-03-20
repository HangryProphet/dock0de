import { useState } from "react";
import type { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import {
  Avatar,
  Group,
  SegmentedControl,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Sidebar } from "../components/Sidebar";
import { mockData } from "../data/mockData";
import type { UserRole } from "../data/mockData";

export type LayoutContext = {
  role: UserRole;
};

export function AppLayout({ children }: PropsWithChildren) {
  const [role, setRole] = useState<UserRole>(mockData.currentUser.role);

  return (
    <div className="layout-shell">
      <Sidebar role={role} />
      <div className="layout-content">
        <header className="layout-header">
          <div>
            <Title order={3}>Dock0de</Title>
            <Text c="dimmed" size="sm">
              Safe code execution sandbox
            </Text>
          </div>
          <Group gap="sm">
            <TextInput
              placeholder="Search submissions"
              radius="md"
              className="header-search"
            />
            <SegmentedControl
              size="xs"
              value={role}
              onChange={(value) => setRole(value as UserRole)}
              data={[
                { label: "Student", value: "STUDENT" },
                { label: "Professor", value: "PROFESSOR" },
              ]}
            />
            <Group gap={8}>
              <Avatar color="brand" radius="xl">
                DK
              </Avatar>
              <div>
                <Text size="sm" fw={600}>
                  {mockData.currentUser.displayName}
                </Text>
                <Text size="xs" c="dimmed">
                  {role.toLowerCase()}
                </Text>
              </div>
            </Group>
          </Group>
        </header>
        <main className="layout-main">
          {children ?? <Outlet context={{ role }} />}
        </main>
      </div>
    </div>
  );
}
