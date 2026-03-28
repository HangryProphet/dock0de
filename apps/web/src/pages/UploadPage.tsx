import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Button,
  Card,
  Group,
  Progress,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { mockData } from "../data/mockData";

export function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [environment, setEnvironment] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const isZip = useMemo(() => file?.name.endsWith(".zip"), [file]);
  const canSubmit = Boolean(file && isZip && environment && !isUploading);

  useEffect(() => {
    if (!isUploading) return;
    const interval = setInterval(() => {
      setProgress((value) => {
        const next = Math.min(value + 12, 100);
        if (next === 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/dock/new-id"), 400);
        }
        return next;
      });
    }, 240);
    return () => clearInterval(interval);
  }, [isUploading, navigate]);

  const handleFile = (selected: File | null) => {
    setFile(selected);
  };

  const shellStyle: CSSProperties = {
    minHeight: "70vh",
    display: "grid",
    placeItems: "center",
  };

  const cardStyle: CSSProperties = {
    width: "min(680px, 94vw)",
    padding: 24,
  };

  const dropzoneStyle: CSSProperties = {
    border: `1px dashed ${dragActive ? "var(--accent)" : "var(--border)"}`,
    borderRadius: 16,
    padding: 28,
    display: "grid",
    gap: 6,
    placeItems: "center",
    textAlign: "center",
    background: dragActive ? "var(--accent-subtle)" : "var(--surface)",
    position: "relative",
    overflow: "hidden",
  };

  const dropzoneInputStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
  };

  return (
    <div style={shellStyle}>
      <Card withBorder radius="lg" style={cardStyle}>
        <Title order={2}>Upload Submission</Title>
        <Text c="dimmed" size="sm" mb="lg">
          Drag and drop your .zip file to start a new run.
        </Text>
        <div
          style={dropzoneStyle}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            const dropped = event.dataTransfer.files[0];
            handleFile(dropped ?? null);
          }}
        >
          <input
            style={dropzoneInputStyle}
            type="file"
            accept=".zip"
            onChange={(event) => handleFile(event.currentTarget.files?.[0] ?? null)}
          />
          <Text fw={600}>Drop your .zip here</Text>
          <Text size="xs" c="dimmed">
            {file ? file.name : "Only .zip files are accepted"}
          </Text>
        </div>
        {!isZip && file && (
          <Text size="xs" c="red" mt="xs">
            Only .zip uploads are allowed.
          </Text>
        )}
        <Select
          data={mockData.environments}
          value={environment}
          onChange={setEnvironment}
          label="Environment"
          placeholder="Select runtime"
          radius="md"
          mt="md"
        />
        {isUploading && (
          <Progress value={progress} radius="xl" mt="md" color="brand" />
        )}
        <Group justify="flex-end" mt="lg">
          <Button
            color="brand"
            radius="lg"
            disabled={!canSubmit}
            onClick={() => {
              setIsUploading(true);
              setProgress(0);
            }}
          >
            Start Run
          </Button>
        </Group>
      </Card>
    </div>
  );
}
