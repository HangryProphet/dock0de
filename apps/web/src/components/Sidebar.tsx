import { NavLink, useLocation } from "react-router-dom";
import { Accordion, Text } from "@mantine/core";
import type { UserRole } from "../data/mockData";
import { mockData } from "../data/mockData";

const studentLinks = [
  { label: "Dashboard", to: "/student" },
];

const professorLinks = [
  { label: "Dashboard", to: "/professor" },
  { label: "Sandbox", to: "/sandbox" },
];

type SidebarProps = {
  role: UserRole;
};

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const links = role === "PROFESSOR" ? professorLinks : studentLinks;

  const classIds =
    role === "PROFESSOR"
      ? mockData.classes.map((item) => item.id)
      : mockData.studentEnrollments.map((item) => item.classId);

  const classes = mockData.classes.filter((item) => classIds.includes(item.id));

  const grouped = classes.reduce<Record<string, typeof classes>>((acc, item) => {
    acc[item.yearLevel] = acc[item.yearLevel] ?? [];
    acc[item.yearLevel].push(item);
    return acc;
  }, {});

  const yearLabels: Record<string, string> = {
    YEAR_1: "1st Year",
    YEAR_2: "2nd Year",
    YEAR_3: "3rd Year",
    YEAR_4: "4th Year",
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Text fw={700}>Dock0de</Text>
        <Text size="xs" c="dimmed">
          {role === "PROFESSOR" ? "Professor" : "Student"} view
        </Text>
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
            {link.label}
          </NavLink>
        ))}
        {role === "PROFESSOR" ? (
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
        ) : (
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
        )}
      </nav>
    </aside>
  );
}
