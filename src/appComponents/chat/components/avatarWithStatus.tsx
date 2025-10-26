import { Avatar, AvatarProps, Badge } from "@mui/material";
import Image, { StaticImageData } from "next/image";

type StaticAvatarProps = Omit<AvatarProps, "src"> & {
  src: StaticImageData;
  alt: string;
};

type AvatarWithStatusProps = StaticAvatarProps & {
  src: StaticImageData;
  alt: string;
  online?: boolean;
};

export function StaticAvatar(props: StaticAvatarProps) {
  const { src, alt, ...other } = props;
  return (
    <Avatar {...other}>
      <Image src={src} alt={alt} fill={true} sizes="40px" />
    </Avatar>
  );
}

export default function AvatarWithStatus(props: AvatarWithStatusProps) {
  const { online = false, ...other } = props;
  return (
    <div>
      <Badge
        color={online ? "success" : "primary"}
        variant={online ? "standard" : "dot"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <StaticAvatar {...other} />
      </Badge>
    </div>
  );
}
