"use client";

import React from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";

type OrderStatus =
  | "Booked"
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Cancelled";

const statusColors: Record<OrderStatus, string> = {
  Booked: "#9b59b6",
  Pending: "#7f8c8d",
  "In Progress": "#3498db",
  Completed: "#2ecc71",
  Cancelled: "#e74c3c",
};

const getSteps = (status: OrderStatus): OrderStatus[] => {
  switch (status) {
    case "Completed":
      return ["Booked", "Pending", "In Progress", "Completed"];
    case "In Progress":
      return ["Booked", "Pending", "In Progress"];
    case "Pending":
      return ["Booked", "Pending"];
    case "Cancelled":
      return ["Booked", "Cancelled"];
    default:
      return ["Booked"];
  }
};

interface SteppersProps {
  status: OrderStatus;
}

export default function Steppers({ status }: SteppersProps) {
  const steps = getSteps(status);
  const activeStep = steps.indexOf(status);

  return (
    <Box sx={{ width: "100%", my: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              StepIconProps={{ style: { color: statusColors[label] } }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
