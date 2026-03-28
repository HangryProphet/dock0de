import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Accordion, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { ClassInfo, UserRole } from "../data/api";
import { fetchProfessorClasses, fetchStudentClasses } from "../data/api";

type NavItem = {
  label: string;
  to: string;
  icon: "dashboard" | "sandbox";
};

const studentLinks: NavItem[] = [
  { label: "Dashboard", to: "/student", icon: "dashboard" },
];

const professorLinks: NavItem[] = [
  { label: "Dashboard", to: "/professor", icon: "dashboard" },
  { label: "Sandbox", to: "/sandbox", icon: "sandbox" },
];

type SidebarProps = {
  role: UserRole;
  userId?: string | null;
  collapsed?: boolean;
  theme?: "default" | "cyber" | "glass";
  onToggleCollapse?: () => void;
};

function NavIcon({ name }: { name: NavItem["icon"] }) {
  if (name === "sandbox") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M9 3h6l1 4h3v2h-2.4l-2 10.5a2 2 0 0 1-2 1.5h-1.2a2 2 0 0 1-2-1.5L7.4 9H5V7h3l1-4zm2.6 16h.8l1.8-10H9.8l1.8 10z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Sidebar({ role, userId, collapsed, theme = "default", onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const isTablet = useMediaQuery("(max-width: 1100px)");
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const links = role === "PROFESSOR" ? professorLinks : studentLinks;

  const asideStyle: CSSProperties = {
    background: "var(--surface)",
    borderRight: isTablet ? "none" : "1px solid var(--border)",
    borderBottom: isTablet ? "1px solid var(--border)" : "none",
    padding: collapsed ? "16px 8px" : "24px 16px",
    display: "flex",
    flexDirection: isTablet ? "row" : "column",
    alignItems: collapsed ? "center" : isTablet ? "center" : undefined,
    gap: 24,
    backdropFilter: theme === "glass" ? "blur(16px)" : undefined,
  };

  const navStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
  };

  const linkBaseStyle: CSSProperties = {
    textDecoration: "none",
    color: "var(--text)",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid transparent",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: collapsed ? "center" : "flex-start",
  };

  const subLinkBaseStyle: CSSProperties = {
    textDecoration: "none",
    color: "var(--text)",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid transparent",
    fontSize: 13,
    fontWeight: 600,
  };

  useEffect(() => {
    if (!userId) return;
    const fetcher = role === "PROFESSOR" ? fetchProfessorClasses : fetchStudentClasses;
    fetcher(userId)
      .then(setClasses)
      .catch(() => setClasses([]));
  }, [role, userId]);

  const grouped = useMemo(() =>
    classes.reduce<Record<string, ClassInfo[]>>((acc, item) => {
      acc[item.yearLevel] = acc[item.yearLevel] ?? [];
      acc[item.yearLevel].push(item);
      return acc;
    }, {}), [classes]);

  const yearLabels: Record<string, string> = {
    YEAR_1: "1st Year",
    YEAR_2: "2nd Year",
    YEAR_3: "3rd Year",
    YEAR_4: "4th Year",
  };

  return (
    <aside style={asideStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Text fw={700}>Dock0de</Text>
            <Text size="xs" c="dimmed">
              {role === "PROFESSOR" ? "Professor" : "Student"} view
            </Text>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface-alt)",
            color: "var(--text)",
            borderRadius: 10,
            padding: "4px 8px",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {collapsed ? ">>" : "<<"}
        </button>
      </div>
      <nav style={navStyle}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...linkBaseStyle,
              borderColor: isActive ? "var(--accent)" : "transparent",
              color: isActive ? "var(--accent)" : "var(--text)",
              background: isActive ? "var(--accent-subtle)" : "transparent",
            })}
          >
            <span style={{ width: 18, height: 18, display: "inline-flex" }}>
              <NavIcon name={link.icon} />
            </span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
        {role === "PROFESSOR" && !collapsed ? (
          <Accordion
            chevronPosition="right"
            style={{ marginTop: 8 }}
            styles={{
              control: {
                padding: "10px 12px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
              },
            }}
          >
            {Object.entries(grouped).map(([yearLevel, items]) => (
              <Accordion.Item key={yearLevel} value={yearLevel}>
                <Accordion.Control>{yearLabels[yearLevel] ?? yearLevel}</Accordion.Control>
                <Accordion.Panel>
                  <div style={{ display: "grid", gap: 6, padding: "8px 0 8px 6px" }}>
                    {items.map((item) => (
                      <NavLink
                        key={item.id}
                        to={`/professor/class/${item.id}`}
                        style={({ isActive }) => ({
                          ...subLinkBaseStyle,
                          borderColor: isActive ? "var(--accent)" : "transparent",
                          color: isActive ? "var(--accent)" : "var(--text)",
                          background: isActive ? "var(--accent-subtle)" : "transparent",
                        })}
                      >
                        {item.name} {item.section}
                      </NavLink>
                    ))}
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : !collapsed ? (
          <div style={{ marginTop: 8 }}>
            <Text size="xs" c="dimmed">
              My Classes
            </Text>
            <div style={{ display: "grid", gap: 6, padding: "8px 0 8px 6px" }}>
              {classes.map((item) => {
                const active = location.search.includes(`classId=${item.id}`);
                return (
                  <NavLink
                    key={item.id}
                    to={`/student?classId=${item.id}`}
                    style={{
                      ...subLinkBaseStyle,
                      borderColor: active ? "var(--accent)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text)",
                      background: active ? "var(--accent-subtle)" : "transparent",
                    }}
                  >
                    {item.name} {item.section}
                    <span style={{ color: "var(--text-muted)", fontWeight: 500, marginLeft: 6 }}>
                      · {item.yearLevel.replace("YEAR_", "Year ")}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ) : null}
      </nav>
    </aside>
  );
}
