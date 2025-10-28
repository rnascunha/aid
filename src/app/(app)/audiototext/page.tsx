import { AudioToText } from "@/appComponents/audioToText/audioToText";
import { chats, providers } from "@/appComponents/audioToText/data";

export default function AudioToTextPage() {
  return <AudioToText providers={providers} chats={chats} />;
}
