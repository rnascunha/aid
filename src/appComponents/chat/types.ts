import { StaticImageData } from "next/image";

export interface UserProps {
  id: string;
  name: string;
  logo: StaticImageData;
  online: boolean;
}

export interface MessageProps {
  id: string;
  content: string;
  timestamp: number;
  unread?: boolean;
  sender: UserProps | "You";
  attachment?: {
    fileName: string;
    type: string;
    size: string;
  };
}

// export interface ChatProps {
//   id: string;
//   sender: UserProps;
//   messages: MessageProps[];
// };

export type ChatProps = Record<UserProps["id"], MessageProps[]>;
