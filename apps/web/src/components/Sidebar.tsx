import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Accordion, Text } from "@mantine/core";
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
  onToggleCollapse?: () => void;
};

function NavIcon({ name }: { name: NavItem["icon"] }) {
  if (name === "sandbox") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M9 3h6l1 4h3v2h-2.4l-2 10.5a2 2 0 0 1-2 1.5h-1.2a2 2 0 0 1-2-1.5L7.4 9H5V7h3l1-4zm2.6 16h.8l1.8-10H9.8l1.8 10z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Sidebar({ role, userId, collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const links = role === "PROFESSOR" ? professorLinks : studentLinks;

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
    <aside className={`sidebar${collapsed ? " is-collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Text fw={700}>Dock0de</Text>
          <Text size="xs" c="dimmed">
            {role === "PROFESSOR" ? "Professor" : "Student"} view
          </Text>
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleCollapse}
        >
          {collapsed ? ">>" : "<<"}
        </button>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " is-active" : ""}`
            }
          >
            <span className="sidebar-link-icon">
              <NavIcon name={link.icon} />
            </span>
            <span className="sidebar-link-label">{link.label}</span>
          </NavLink>
        ))}
        {role === "PROFESSOR" && !collapsed ? (
          <Accordion className="sidebar-accordion" chevronPosition="right">
            {Object.entries(grouped).map(([yearLevel, items]) => (
              <Accordion.Item key={yearLevel} value={yearLevel}>
                <Accordion.Control>{yearLabels[yearLevel] ?? yearLevel}</Accordion.Control>
                <Accordion.Panel>
                  <div className="sidebar-accordion-panel">
                    {items.map((item) => (
                      <NavLink
                        key={item.id}
                        to={`/professor/class/${item.id}`}
                        className={({ isActive }) =>
                          `sidebar-sub-link${isActive ? " is-active" : ""}`
                        }
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
          <div className="sidebar-accordion">
            <Text size="xs" c="dimmed" className="sidebar-section-title">
              My Classes
            </Text>
            <div className="sidebar-accordion-panel">
              {classes.map((item) => {
                const active = location.search.includes(`classId=${item.id}`);
                return (
                  <NavLink
                    key={item.id}
                    to={`/student?classId=${item.id}`}
                    className={`sidebar-sub-link${active ? " is-active" : ""}`}
                  >
                    {item.name} {item.section}
                    <span className="sidebar-sub-meta">· {item.yearLevel.replace("YEAR_", "Year ")}</span>
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
