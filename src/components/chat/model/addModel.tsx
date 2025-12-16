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
  Typography,
} from "@mui/material";

import { ModelProps, ProviderProps } from "@/components/chat/model/types";
import { checkProviderAvaiable } from "@/libs/chat/functions";
import { providerBaseMap } from "@/libs/chat/data";

import AddIcon from "@mui/icons-material/Add";
import { useContext, useState } from "react";
import { StaticAvatar } from "../staticAvatar";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectProvider } from "./selectProvider";
import { generateUUID } from "@/libs/uuid";
import { aIContext } from "../context";

export function NoProvidersHeader({ text }: { text?: string }) {
  const { setOpenSettings } = useContext(aIContext);

  return (
    <Stack justifyContent="center" alignItems="center" gap={1}>
      <Typography color="warning" fontWeight="bold">
        {text ?? "No provider configured"}
      </Typography>
      <Button variant="contained" onClick={() => setOpenSettings(true)}>
        Open settings
      </Button>
    </Stack>
  );
}

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
    model: "",
    providerId: providers[0].id,
  });
  const provider = providers.find(
    (p) => newModel.providerId === p.id
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
        setProvider={(p: ProviderProps) =>
          setNewModel((prev) => ({ ...prev, providerId: p.id }))
        }
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
      <TextField
        label="Model"
        size="small"
        value={newModel.model}
        onChange={(ev) =>
          setNewModel((prev) => ({
            ...prev,
            model: ev.target.value.replaceAll(/[\n\t ]/g, ""),
          }))
        }
        error={newModel.model === ""}
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
  addRemoveModel,
  open,
  onClose,
  providers,
}: {
  models: ModelProps[];
  addRemoveModel: (model: string | ModelProps) => Promise<void>;
  open: boolean;
  onClose: () => void;
  providers: ProviderProps[];
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
        {providers?.length === 0 ? (
          <NoProvidersHeader text="No provider with 'chat' support configured " />
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
