export interface Table {
  id: string;
  name: string;
  capacity: number;
  qrCode?: string;
  status: "active" | "inactive";
  createdAt: string;
  lastUsed?: string;
}