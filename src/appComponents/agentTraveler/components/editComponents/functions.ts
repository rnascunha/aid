import dayjs from "@/libs/dayjs";
import { Dayjs } from "dayjs";

export function setDateTimePicker(
  date: string,
  time: string,
  timezone: string,
) {
  return timezone
    ? dayjs.tz(`${date} ${time}`, "DD/MM/YYYY HH:mm", timezone)
    : dayjs(`${date} ${time}`, "DD/MM/YYYY HH:mm");
}

export function updateDateTime<T>(
  value: Dayjs | null | undefined,
  updateState: (field: keyof T, value: string) => void,
  { date, time }: { date: keyof T; time: keyof T },
) {
  updateState(date, value?.format("DD/MM/YYYY") ?? "");
  updateState(time, value?.format("HH:mm") ?? "");
}
