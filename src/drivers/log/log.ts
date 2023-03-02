export type Log = {
  name: string;
  content: LogContent;
};

export type LogContent = {
  points: [number, number][];
  sampleRate: number;
};
