import { AudioToText } from "@/appComponents/audioToText/audioToText";
import { chats, models } from "@/appComponents/audioToText/data";

export default function AudioToTextPage() {
  return <AudioToText models={models} chats={chats} />;
}
