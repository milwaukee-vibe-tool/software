import { LogContent } from "./log";

export function ParseCSV(file: string): LogContent {
  const lines = file.split("\n");
  const content: LogContent = {
    sampleRate: 0,
    points: [],
  };

  // Parse header row
  const columns = lines[0].split(",");
  content.sampleRate = Number(columns[1].split(":")[1]);

  // Parse points
  lines.slice(1).forEach((line, index) => {
    if (line === "") return;
    const columns = line.split(",");
    content.points.push([index, Number(columns[0])]);
  });
  return content;
}
