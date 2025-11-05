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
import { ModelProps, ProviderProps } from "../../libs/chat/types";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { StaticAvatar } from "./staticAvatar";
import { providerMap, providers } from "@/appComponents/chat/data";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectProvider } from "./selectProvider";
import { generateUUID } from "@/libs/uuid";

function ModelItem({
  model,
  addRemoveModel,
}: {
  model: ModelProps;
  addRemoveModel: (model: string | ModelProps) => Promise<void>;
}) {
  return (
    <ListItem
      sx={{
        display: "flex",
        gap: 1,
      }}
      secondaryAction={
        <IconButton onClick={async () => await addRemoveModel(model.id)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <StaticAvatar alt={model.name} src={providerMap[model.providerId].logo} />
      <ListItemText primary={model.name} secondary={model.model} />
    </ListItem>
  );
}

function AddModelHeader({
  addRemoveModel,
}: {
  addRemoveModel: (model: string | ModelProps) => Promise<void>;
}) {
  const [newModel, setNewModel] = useState<ModelProps>({
    id: generateUUID(),
    name: "",
    model: "",
    providerId: providers[0].id,
  });
  return (
    <Stack
      gap={1}
      sx={{
        mt: 1,
      }}
    >
      <SelectProvider
        provider={providerMap[newModel.providerId]}
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
}: {
  models: ModelProps[];
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
        <AddModelHeader addRemoveModel={addRemoveModel} />
        <Divider sx={{ my: 1 }} />
        <List>
          {models.map((m) => (
            <ModelItem key={m.id} model={m} addRemoveModel={addRemoveModel} />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

interface AddModelProps {
  models?: ModelProps[];
  addRemoveModel: (model: string | ModelProps) => Promise<void>;
}

export function AddModel({ models, addRemoveModel }: AddModelProps) {
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
        models={models ?? []}
        addRemoveModel={addRemoveModel}
      />
    </>
  );
}

export function AddModelButton({ models, addRemoveModel }: AddModelProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Add model
      </Button>
      <AddModelDialog
        open={open}
        onClose={() => setOpen(false)}
        models={models ?? []}
        addRemoveModel={addRemoveModel}
      />
    </>
  );
}
