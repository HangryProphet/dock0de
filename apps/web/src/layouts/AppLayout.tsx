import { useEffect, useState } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import {
  Avatar,
  Group,
  SegmentedControl,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Sidebar } from "../components/Sidebar";
import { login } from "../data/api";
import type { UserInfo, UserRole } from "../data/api";

export type LayoutContext = {
  role: UserRole;
  user: UserInfo | null;
};

type ThemeMode = "default" | "cyber" | "glass";

export function AppLayout({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [role, setRole] = useState<UserRole>("PROFESSOR");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isTablet = useMediaQuery("(max-width: 1100px)");
  const isMobile = useMediaQuery("(max-width: 720px)");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("dock0de-theme");
    if (saved === "default" || saved === "cyber" || saved === "glass") {
      return saved;
    }
    return "default";
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

  const shellStyle: CSSProperties = {
    minHeight: "100svh",
    display: "grid",
    gridTemplateColumns: isTablet
      ? "1fr"
      : sidebarCollapsed
      ? "72px minmax(0, 1fr)"
      : "240px minmax(0, 1fr)",
  };

  const contentStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100svh",
  };

  const headerStyle: CSSProperties = {
    height: isMobile ? "auto" : 72,
    padding: "16px 24px",
    display: "flex",
    alignItems: isMobile ? "flex-start" : "center",
    justifyContent: "space-between",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? 12 : 0,
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    backdropFilter: theme === "glass" ? "blur(16px)" : undefined,
  };

  const mainStyle: CSSProperties = {
    padding: 24,
  };

  return (
    <div style={shellStyle}>
      <Sidebar
        role={role}
        userId={user?.id}
        collapsed={sidebarCollapsed}
        theme={theme}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
      <div style={contentStyle}>
        <header style={headerStyle}>
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
              style={{ minWidth: isMobile ? undefined : 220 }}
            />
            <SegmentedControl
              size="xs"
              value={theme}
              onChange={(value) => setTheme(value as ThemeMode)}
              data={[
                { label: "Default", value: "default" },
                { label: "Cyber", value: "cyber" },
                { label: "Glass", value: "glass" },
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
        <main style={mainStyle}>
          {children ?? <Outlet context={{ role, user }} />}
        </main>
      </div>
    </div>
  );
}
