import { spawn } from "child_process";

export async function asyncSpawn(
  command: string,
  args: string[],
  close?: (code: number) => void,
  error?: (error: string) => void
) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);

    process.stdout.on("data", (data) => resolve(data.toString()));
    if (error) process.stderr.on("data", (data) => error(data.toString()));

    process.on("error", (err) => reject(err));
    if (close) process.on("close", close);
  });
}
