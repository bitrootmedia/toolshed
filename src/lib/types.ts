import type { ComponentType, LazyExoticComponent } from "react";
import type { LucideIcon } from "lucide-react";

export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  category: string;
  icon: LucideIcon;
}

export interface ToolDefinition extends ToolMeta {
  component: LazyExoticComponent<ComponentType>;
}
