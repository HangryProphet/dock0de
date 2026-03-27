import { useEffect, useState } from "react";
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
import { login } from "../data/api";
import type { UserInfo, UserRole } from "../data/api";

export type LayoutContext = {
  role: UserRole;
  user: UserInfo | null;
};

type ThemeMode = "default" | "cyber" | "glass" | "command";

export function AppLayout({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [role, setRole] = useState<UserRole>("PROFESSOR");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("dock0de-theme");
    return (saved as ThemeMode) ?? "default";
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("dock0de-theme", theme);
  }, [theme]);

  useEffect(() => {
    const emailByRole: Record<UserRole, string> = {
      STUDENT: "a.student@dock0de.edu",
      PROFESSOR: "prof@dock0de.edu",
      ADMIN: "prof@dock0de.edu",
    };
    login(emailByRole[role])
      .then((response) => {
        if (response.ok && response.user) {
          setUser(response.user);
          setRole(response.user.role);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, [role]);

  return (
    <div className={`layout-shell${sidebarCollapsed ? " is-collapsed" : ""}`}>
      <Sidebar
        role={role}
        userId={user?.id}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
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
              value={theme}
              onChange={(value) => setTheme(value as ThemeMode)}
              data={[
                { label: "Default", value: "default" },
                { label: "Cyber", value: "cyber" },
                { label: "Glass", value: "glass" },
                { label: "Command", value: "command" },
              ]}
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
                {user?.displayName?.slice(0, 2).toUpperCase() ?? "DK"}
              </Avatar>
              <div>
                <Text size="sm" fw={600}>
                  {user?.displayName ?? "User"}
                </Text>
                <Text size="xs" c="dimmed">
                  {role.toLowerCase()}
                </Text>
              </div>
            </Group>
          </Group>
        </header>
        <main className="layout-main">
          {children ?? <Outlet context={{ role, user }} />}
        </main>
      </div>
    </div>
  );
}
