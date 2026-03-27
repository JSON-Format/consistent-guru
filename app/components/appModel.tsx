"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";
import { DialogProps } from "@mui/material/Dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg";
  showCloseIcon?: boolean;
  PaperProps?: DialogProps["PaperProps"];
};

export default function OpenModel({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  showCloseIcon = true,
  PaperProps,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      scroll="paper"
      PaperProps={{
        ...PaperProps,
        sx: {
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          borderRadius: "16px",
          border: "1px solid hsl(var(--border))",
          backdropFilter: "blur(10px)",
          ...PaperProps?.sx,
        },
      }}
    >
      {/* HEADER */}
      {title && (
        <DialogTitle
          sx={{
            fontWeight: 700,
            borderBottom: "1px solid hsl(var(--border))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--font-display)",
          }}
        >
          <span>{title}</span>

          {showCloseIcon && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "hsl(var(--foreground))",
                "&:hover": {
                  backgroundColor: "hsl(var(--secondary))",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* CONTENT */}
      <DialogContent
        dividers
        sx={{
          borderColor: "hsl(var(--border))",
          fontFamily: "var(--font-body)",
        }}
      >
        {children}
      </DialogContent>

      {/* FOOTER */}
      {actions && (
        <DialogActions
          sx={{
            borderTop: "1px solid hsl(var(--border))",
            padding: "12px 20px",
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}