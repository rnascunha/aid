import { Avatar, AvatarProps } from "@mui/material";
import Image, { StaticImageData } from "next/image";

import generic from "@/images/ai/generic-ai.png";

type StaticAvatarProps = Omit<AvatarProps, "src"> & {
  src?: StaticImageData;
  alt: string;
  size?: number;
};

export function StaticAvatar(props: StaticAvatarProps) {
  const { src, alt, ...other } = props;
  return (
    <Avatar {...other}>
      <Image src={src ?? generic} alt={alt} fill={true} sizes="40px" />
    </Avatar>
  );
}
