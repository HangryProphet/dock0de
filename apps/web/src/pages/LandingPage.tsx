import { Button, Group, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ShapeGrid } from "../components/ShapeGrid";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-shell">
      <div className="landing-grid">
        <ShapeGrid
          speed={0.3}
          squareSize={40}
          direction="up"
          borderColor="#08d916"
          hoverFillColor="#fffafa"
          shape="hexagon"
          hoverTrailAmount={0}
        />
      </div>
      <div className="landing-hero">
        <div className="landing-hero-content">
          <Text className="landing-eyebrow">DOCK0DE</Text>
          <Title order={1} className="landing-title">
            Ship safer code labs with a live sandbox and instant grading.
          </Title>
          <Text size="lg" className="landing-subtitle">
            Activity-first flows, real-time runs, and clean professor controls built
            for classroom velocity.
          </Text>
          <Group gap="md" className="landing-cta" mt="xl">
            <Button
              color="#08d916"
              style={{ color: "#070b10", fontWeight: 700 }}
              radius="md"
              size="lg"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
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
      </div>
    </div>
  );
}
