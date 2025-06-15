export type AlertStatus = "warning" | "danger" | "info" | "success";

export interface AlertConfig {
  status?: AlertStatus;
  headline?: string;
  value?: string;
  timeout?: number;
}
