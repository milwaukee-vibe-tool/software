export function printTime(seconds: number) {
  if (seconds === 0) return "0s";

  let formats: string[] = [];
  let remainder = seconds;
  for (const unit of units) {
    const unit_count = Math.floor(remainder / unit.seconds);
    remainder %= unit.seconds;
    if (unit_count === 0) continue;
    formats.push(`${unit_count}${unit.suffix}`);
  }
  return formats.join(" ");
}

const units: Unit[] = [
  { seconds: 60 * 60, suffix: "h" },
  { seconds: 60, suffix: "m" },
  { seconds: 1, suffix: "s" },
  { seconds: 0.001, suffix: "ms" },
];

type Unit = {
  seconds: number;
  suffix: string;
};
