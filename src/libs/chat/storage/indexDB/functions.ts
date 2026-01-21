import { TableSenders } from "./types";

/**
 * Provider/Model
 */

export async function deleteModelFromProviderId(
  table: TableSenders,
  providerId: string,
  deleteSenderMessages: (modelId: string) => Promise<void>,
) {
  const allModels = await table
    .where("providerId")
    .equals(providerId)
    .toArray();
  await Promise.all([
    table.where("providerId").equals(providerId).delete(),
    ...allModels.map((p) => deleteSenderMessages(p.id)),
  ]);
}
