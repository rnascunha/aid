import { Avatar, AvatarProps } from "@mui/material";
import Image, { StaticImageData } from "next/image";

type StaticAvatarProps = Omit<AvatarProps, "src"> & {
  src: StaticImageData;
  alt: string;
};

export function StaticAvatar(props: StaticAvatarProps) {
  const { src, alt, ...other } = props;
  return (
    <Avatar {...other}>
      <Image src={src} alt={alt} fill={true} sizes="40px" />
    </Avatar>
  );
}
