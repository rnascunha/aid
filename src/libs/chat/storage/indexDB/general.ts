import { ProviderProps, ToolsProps } from "../../types";
import { deleteModelFromProviderId } from "./functions";
import { aISettings } from "./store";

/**
 * Providers
 */

export async function getProviders() {
  return await aISettings.providers.toArray();
}

export async function deleteProvider(id: string) {
  await Promise.all([
    aISettings.providers.delete(id),
    deleteModelFromProviderId(
      aISettings.chatModels,
      id,
      aISettings.chatMessages
    ),
    deleteModelFromProviderId(
      aISettings.audioToTextModels,
      id,
      aISettings.audioToTextMessages
    ),
  ]);
}

export async function updateProvider(provider: ProviderProps | string) {
  if (typeof provider === "string") {
    await deleteProvider(provider);
    return;
  }
  await aISettings.providers.put(provider);
}

/**
 * Tools
 */
const defaultToolKey = "defaultKeyTool";

export async function getTools() {
  return await aISettings.tools.get(defaultToolKey);
}

export async function updateTools(tools: ToolsProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ip, ...others } = tools;
  await aISettings.tools.put(others, defaultToolKey);
}

/**
 * Load/Save/Clear
 */
export async function clearData() {
  await aISettings.delete();
  await aISettings.open();
}

export async function exportData() {
  return await aISettings.export();
}

export async function importData(blob: Blob) {
  await clearData();
  await aISettings.import(blob);
}
