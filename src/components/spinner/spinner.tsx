import { CSSProperties, SVGProps } from "react";
import styles from "./spinner.module.css";

export default function Spinner({
  width = 150,
  height = 150,
  style,
  props
}: {
  width?: number|string;
  height?: number|string;
  style?: CSSProperties;
  props?: SVGProps<SVGSVGElement>;
}) {
  return (
    <svg
      width={width}
      height={height}
      style={style}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="var(--mui-palette-text-primary)"
      {...props}
    >
      <g
        className={styles.spinner}
      >
        <circle cx="12" cy="2.5" r="1.5" opacity=".14" />
        <circle cx="16.75" cy="3.77" r="1.5" opacity=".29" />
        <circle cx="20.23" cy="7.25" r="1.5" opacity=".43" />
        <circle cx="21.50" cy="12.00" r="1.5" opacity=".57" />
        <circle cx="20.23" cy="16.75" r="1.5" opacity=".71" />
        <circle cx="16.75" cy="20.23" r="1.5" opacity=".86" />
        <circle cx="12" cy="21.5" r="1.5" />
      </g>
    </svg>
  );
}