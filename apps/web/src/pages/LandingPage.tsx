import type { CSSProperties } from "react";
import { Button, Group, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { LetterGlitch } from "../components/LetterGlitch";

export function LandingPage() {
  const navigate = useNavigate();
  const isTablet = useMediaQuery("(max-width: 1100px)");
  const isMobile = useMediaQuery("(max-width: 720px)");

  const shellStyle: CSSProperties = {
    minHeight: "100svh",
    background: "#080d15",
    color: "#e6f0ff",
    padding: isMobile ? "14px 4vw 52px" : "18px 5vw 72px",
    position: "relative",
    overflowX: "hidden",
  };

  const cardNavStyle: CSSProperties = {
    position: "fixed",
    top: isMobile ? 8 : 14,
    left: isMobile ? "4vw" : "50%",
    right: isMobile ? "4vw" : undefined,
    transform: isMobile ? "none" : "translateX(-50%)",
    width: isMobile ? "auto" : "min(1120px, 90vw)",
    zIndex: 20,
    border: "1px solid rgba(230, 240, 255, 0.22)",
    borderRadius: isMobile ? 16 : 22,
    background: "linear-gradient(180deg, rgba(11, 16, 26, 0.9), rgba(11, 16, 26, 0.68))",
    backdropFilter: "blur(18px)",
    padding: isMobile ? 12 : "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    flexDirection: isMobile ? "column" : "row",
    gap: 12,
    boxShadow: "0 10px 30px rgba(3, 7, 14, 0.35)",
  };

  const sectionBandStyle: CSSProperties = {
    position: "relative",
    borderRadius: isMobile ? 20 : 28,
    paddingLeft: isMobile ? 14 : 24,
    paddingRight: isMobile ? 14 : 24,
  };

  const navCardStyle: CSSProperties = {
    border: 0,
    borderRadius: 999,
    background: "transparent",
    color: "#e6f0ff",
    padding: isMobile ? "8px 12px" : "10px 16px",
    display: "grid",
    gap: 4,
    textAlign: "left",
    cursor: "pointer",
    minWidth: isMobile ? 126 : 148,
    transition: "transform 180ms ease, color 180ms ease, background 180ms ease",
  };

  const navCardTitleStyle: CSSProperties = {
    fontWeight: 600,
    fontSize: isMobile ? 14 : 17,
    fontFamily: '"Space Grotesk", "Manrope", sans-serif',
  };

  const navCardSubStyle: CSSProperties = {
    fontSize: isMobile ? 11 : 13,
    color: "rgba(230, 240, 255, 0.7)",
  };

  const bodyCopyStyle: CSSProperties = {
    margin: 0,
    maxWidth: 580,
    color: "rgba(230, 240, 255, 0.8)",
    fontSize: 16,
    lineHeight: 1.75,
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={shellStyle}>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.24,
          zIndex: 0,
        }}
      >
        <LetterGlitch
          glitchColors={["#2b4539", "#61dca3", "#61b3dc"]}
          glitchSpeed={62}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.44)",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 14% 12%, rgba(94, 122, 255, 0.14), transparent 36%), radial-gradient(circle at 84% 16%, rgba(74, 228, 197, 0.12), transparent 34%), radial-gradient(circle at 50% 78%, rgba(255, 182, 112, 0.1), transparent 38%)",
            zIndex: 3,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gap: 0,
          maxWidth: 1120,
          margin: "0 auto",
          paddingTop: isMobile ? 126 : 92,
        }}
      >
        <div style={cardNavStyle} role="navigation" aria-label="Landing sections">
          <div
            style={{
              display: "flex",
              flexWrap: isMobile ? "nowrap" : "wrap",
              gap: 12,
              width: isMobile ? "100%" : undefined,
              overflowX: isMobile ? "auto" : "visible",
              paddingBottom: isMobile ? 2 : 0,
            }}
          >
            <button type="button" style={navCardStyle} onClick={() => scrollToSection("about") }>
              <span style={navCardTitleStyle}>About Us</span>
              <small style={navCardSubStyle}>What Dock0de is</small>
            </button>
            <button type="button" style={navCardStyle} onClick={() => scrollToSection("workflow") }>
              <span style={navCardTitleStyle}>Workflow</span>
              <small style={navCardSubStyle}>How classes run</small>
            </button>
            <button type="button" style={navCardStyle} onClick={() => scrollToSection("platform") }>
              <span style={navCardTitleStyle}>Platform</span>
              <small style={navCardSubStyle}>Core capabilities</small>
            </button>
          </div>
          <div style={{ width: isMobile ? "100%" : undefined }}>
            <button
              type="button"
              style={{
                border: "1px solid rgba(230, 240, 255, 0.34)",
                borderRadius: 999,
                background: "rgba(230, 240, 255, 0.06)",
                color: "#f8fbff",
                height: 44,
                padding: "0 18px",
                fontWeight: 600,
                fontSize: 15,
                fontFamily: '"Space Grotesk", "Manrope", sans-serif',
                width: isMobile ? "100%" : "auto",
              }}
            >
              Register or Login
            </button>
          </div>
        </div>

        <section
          id="hero"
          style={{
            ...sectionBandStyle,
            paddingTop: isMobile ? 30 : 70,
            paddingBottom: 52,
            display: "flex",
            alignItems: "flex-start",
            minHeight: "72vh",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 16,
              maxWidth: isTablet ? "100%" : 920,
              textAlign: "left",
            }}
          >
            <Text
              style={{
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: isMobile ? 16 : 22,
                fontWeight: 900,
                color: "#f8fbff",
                fontFamily: '"Space Grotesk", "Manrope", sans-serif',
                display: "inline-block",
                padding: "8px 20px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 999,
                marginBottom: 12,
              }}
            >
              DOCK0DE
            </Text>
            <Title
              order={1}
              style={{
                fontSize: isMobile ? "clamp(28px, 9vw, 42px)" : "clamp(40px, 6vw, 76px)",
                lineHeight: 1.02,
                color: "#f8fbff",
                fontFamily: '"Space Grotesk", "Manrope", sans-serif',
                letterSpacing: "-0.03em",
              }}
            >
              Grade faster, run safer, and keep coding classes in one live workspace.
            </Title>
            <Text
              size="lg"
              style={{
                maxWidth: 740,
                color: "rgba(230, 240, 255, 0.78)",
                marginTop: 4,
                fontSize: isMobile ? 16 : undefined,
              }}
            >
              A class-first sandbox for professors with activity timelines, containerized runs,
              and Dock-level submission review.
            </Text>
            <Group gap="md" mt="xl" style={{ flexWrap: "wrap", justifyContent: "flex-start" }}>
              <Button
                variant="outline"
                color="gray"
                radius="md"
                size="lg"
                onClick={() => navigate("/professor")}
              >
                Professor Demo
              </Button>
              <Button
                variant="subtle"
                color="gray"
                radius="md"
                size="lg"
                onClick={() => navigate("/student")}
              >
                Student Demo
              </Button>
            </Group>
          </div>
        </section>

        <section
          id="about"
          style={{
            ...sectionBandStyle,
            display: "grid",
            gap: 14,
            scrollMarginTop: 88,
            paddingTop: isMobile ? 48 : 68,
            paddingBottom: isMobile ? 48 : 68,
            background: "linear-gradient(180deg, rgba(16, 24, 38, 0.2), rgba(13, 21, 34, 0.08))",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <Text
              style={{
                textTransform: "uppercase",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "rgba(110, 255, 189, 0.86)",
                fontFamily: '"Space Grotesk", "Manrope", sans-serif',
              }}
            >
              About Us
            </Text>
            <Title order={2} style={{ color: "#f5f9ff", fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}>
              Built for instructors who need speed and visibility.
            </Title>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isTablet ? 14 : 22 }}>
            <p style={bodyCopyStyle}>
              Dock0de is a focused classroom operations space for code-heavy subjects. Instead of
              passing files around chat threads and separate grading sheets, each activity becomes a
              structured lane where students submit and professors review.
            </p>
            <p style={bodyCopyStyle}>
              The platform is designed around decision speed: a professor can move from roster-level
              overview to specific build logs and grading controls in seconds.
            </p>
          </div>
        </section>

        <section
          id="workflow"
          style={{
            ...sectionBandStyle,
            display: "grid",
            gap: 14,
            scrollMarginTop: 88,
            paddingTop: isMobile ? 48 : 68,
            paddingBottom: isMobile ? 48 : 68,
            background: "linear-gradient(180deg, rgba(17, 29, 38, 0.2), rgba(13, 22, 30, 0.08))",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <Text
              style={{
                textTransform: "uppercase",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "rgba(110, 255, 189, 0.86)",
                fontFamily: '"Space Grotesk", "Manrope", sans-serif',
              }}
            >
              Workflow
            </Text>
            <Title order={2} style={{ color: "#f5f9ff", fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}>
              A smooth activity lifecycle from upload to grade.
            </Title>
          </div>
          <div style={{ borderLeft: "1px solid rgba(230, 240, 255, 0.28)", padding: `2px 0 2px ${isMobile ? 16 : 22}px` }}>
            {[
              ["1. Publish Activity", "Professors define instructions, due dates, and scoring per class activity."],
              ["2. Student Submission", "Students upload project zip files directly from their activity timeline context."],
              ["3. Sandbox Run", "Each submission executes inside a short-lived isolated container with live logs."],
              ["4. Review and Grade", "Professors open Dock, inspect outputs, then score and annotate immediately."],
            ].map(([title, desc], idx) => (
              <div
                key={title}
                style={{
                  borderTop: idx === 0 ? 0 : "1px dashed rgba(230, 240, 255, 0.16)",
                  padding: "18px 0",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "#86ffe2",
                    position: "absolute",
                    left: isMobile ? -20 : -26,
                    top: 24,
                  }}
                />
                <h3
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontFamily: '"Space Grotesk", "Manrope", sans-serif',
                    color: "#f3f8ff",
                  }}
                >
                  {title}
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: 15, color: "rgba(230, 240, 255, 0.76)", lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="platform"
          style={{
            ...sectionBandStyle,
            display: "grid",
            gap: 14,
            scrollMarginTop: 88,
            paddingTop: isMobile ? 48 : 68,
            paddingBottom: isMobile ? 48 : 68,
            background: "linear-gradient(180deg, rgba(20, 24, 39, 0.22), rgba(14, 18, 30, 0.1))",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <Text
              style={{
                textTransform: "uppercase",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "rgba(110, 255, 189, 0.86)",
                fontFamily: '"Space Grotesk", "Manrope", sans-serif',
              }}
            >
              Platform
            </Text>
            <Title order={2} style={{ color: "#f5f9ff", fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}>
              Everything needed for class operations in one surface.
            </Title>
          </div>
          <div
            style={{
              display: "grid",
              gap: 14,
              border: "1px solid rgba(230, 240, 255, 0.14)",
              borderRadius: 20,
              padding: "6px 20px",
              background: "linear-gradient(180deg, rgba(9, 17, 28, 0.5), rgba(8, 13, 22, 0.35))",
            }}
          >
            {[
              ["Professor Dashboard", "Track classes, active activities, and priority submissions at a glance."],
              ["Sandbox Testing", "Run private checks without affecting class analytics and timelines."],
              ["Submission Matrix", "Open activity matrices and drill down to each student attempt in one click."],
            ].map(([title, desc], idx) => (
              <div
                key={title}
                style={{
                  padding: "18px 0",
                  borderTop: idx === 0 ? 0 : "1px solid rgba(230, 240, 255, 0.17)",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontFamily: '"Space Grotesk", "Manrope", sans-serif',
                    color: "#f2f8ff",
                  }}
                >
                  {title}
                </h3>
                <p style={{ margin: "6px 0 0", color: "rgba(230, 240, 255, 0.78)", fontSize: 15, lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer
          style={{
            padding: "40px 0 8px",
            borderTop: "1px solid rgba(230, 240, 255, 0.18)",
            marginTop: 24,
          }}
        >
          <Text size="sm" style={{ color: "rgba(230, 240, 255, 0.7)" }}>
            Dock0de • Built for classroom coding operations.
          </Text>
        </footer>
      </div>
    </div>
  );
}
