import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  IconButton,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const DialogContext = createContext();

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "",
    content: null,
  });

  const openDialog = useCallback((title, content) => {
    setDialogState({ isOpen: true, title, content });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, isOpen: false }));
  }, []);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        maxWidth="sm"
        fullWidth
        open={dialogState.isOpen}
        onClose={closeDialog}
      >
        <DialogTitle sx={{ fontSize: "1.25rem" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {dialogState.title}
            <IconButton
              size="small"
              onClick={closeDialog}
              sx={{ m: -1, mt: -0.8 }}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>{dialogState.content}</DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};
