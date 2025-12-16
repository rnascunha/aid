import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { StaticAvatar } from "@/components/chat/staticAvatar";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectProvider } from "@/components/chat/model/selectProvider";
import { generateUUID } from "@/libs/uuid";
import { checkProviderAvaiable } from "@/libs/chat/functions";
import { providerBaseMap } from "@/libs/chat/data";
import { audioToTextProviderModel } from "../data";
import { SelectModel } from "./selectetModel";
import { NoProvidersHeader } from "@/components/chat/model/addModel";
import { ModelProps, ProviderProps } from "@/components/chat/model/types";

function ModelItem({
  model,
  addRemoveModel,
  provider,
}: {
  model: ModelProps;
  provider: ProviderProps;
  addRemoveModel: (model: string | ModelProps) => Promise<void>;
}) {
  return (
    <ListItem
      sx={{
        display: "flex",
        gap: 1,
        borderRadius: "5px",
        bgcolor: checkProviderAvaiable(provider)
          ? "inherit"
          : "var(--mui-palette-background-default)",
      }}
      secondaryAction={
        <IconButton onClick={async () => await addRemoveModel(model.id)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <StaticAvatar
        alt={model.name}
        src={providerBaseMap[provider.providerBaseId].logo}
      />
      <ListItemText primary={model.name} secondary={model.model} />
    </ListItem>
  );
}

function AddModelHeader({
  addRemoveModel,
  providers,
}: {
  addRemoveModel: (model: string | ModelProps) => Promise<void>;
  providers: ProviderProps[];
}) {
  const [newModel, setNewModel] = useState<ModelProps>({
    id: generateUUID(),
    name: "",
    model: audioToTextProviderModel[providers[0].providerBaseId][0],
    providerId: providers[0].id,
  });
  const provider = providers.find(
    (p) => p.id === newModel.providerId
  ) as ProviderProps;
  return (
    <Stack
      gap={1}
      sx={{
        mt: 1,
      }}
    >
      <SelectProvider
        provider={provider}
        setProvider={(p: ProviderProps) => {
          if (provider.id !== p.id) {
            setNewModel((prev) => ({
              ...prev,
              providerId: p.id,
              model: audioToTextProviderModel[p.providerBaseId][0],
            }));
          }
        }}
        providers={providers}
      />
      <TextField
        label="Name"
        size="small"
        value={newModel.name}
        onChange={(ev) =>
          setNewModel((prev) => ({ ...prev, name: ev.target.value }))
        }
        error={newModel.name.trim() === ""}
      />
      <SelectModel
        models={audioToTextProviderModel[provider.providerBaseId]}
        value={newModel.model}
        onChange={(ev) =>
          setNewModel((prev) => ({ ...prev, model: ev.target.value }))
        }
      />
      <Button
        onClick={() => {
          addRemoveModel(newModel);
          setNewModel((prev) => ({
            ...prev,
            id: generateUUID(),
            name: "",
            model: "",
          }));
        }}
        variant="contained"
        disabled={newModel.name.trim() === "" || newModel.model === ""}
      >
        Add
      </Button>
    </Stack>
  );
}

function AddModelDialog({
  models,
  providers,
  addRemoveModel,
  open,
  onClose,
}: {
  models: ModelProps[];
  providers: ProviderProps[];
  addRemoveModel: (model: string | ModelProps) => Promise<void>;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "500px",
            maxWidth: "100%",
            maxHeight: "80%",
          },
        },
      }}
    >
      <DialogTitle>Add Model</DialogTitle>
      <DialogContent>
        {providers.length === 0 ? (
          <NoProvidersHeader text="No provider with 'Audio to Text' support configured" />
        ) : (
          <AddModelHeader
            addRemoveModel={addRemoveModel}
            providers={providers}
          />
        )}
        <Divider sx={{ my: 1 }} />
        <List>
          {models.map((m) => {
            const provider = providers.find(
              (p) => m.providerId === p.id
            ) as ProviderProps;
            return (
              <ModelItem
                key={m.id}
                model={m}
                addRemoveModel={addRemoveModel}
                provider={provider}
              />
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

interface AddModelProps {
  models: ModelProps[];
  addRemoveModel: (model: string | ModelProps) => Promise<void>;
  providers: ProviderProps[];
}

export function AddModel({ models, addRemoveModel, providers }: AddModelProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip title="Add/Remove model">
        <IconButton onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <AddModelDialog
        open={open}
        onClose={() => setOpen(false)}
        models={models}
        addRemoveModel={addRemoveModel}
        providers={providers}
      />
    </>
  );
}

export function AddModelButton({
  models,
  addRemoveModel,
  providers,
}: AddModelProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add model
      </Button>
      <AddModelDialog
        open={open}
        onClose={() => setOpen(false)}
        models={models}
        addRemoveModel={addRemoveModel}
        providers={providers}
      />
    </>
  );
}
