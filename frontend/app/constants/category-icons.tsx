import {
  BrainIcon,
  BriefcaseIcon,
  CodeIcon,
  CpuIcon,
  DatabaseIcon,
  Gamepad2Icon,
  GanttChartSquareIcon,
  GraduationCapIcon,
  LayersIcon,
  PaletteIcon,
  ShieldIcon,
  TrendingUpIcon,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: { [key: string]: LucideIcon } = {
  "game-dev-all": Gamepad2Icon,
  hardware: CpuIcon,
  academics: GraduationCapIcon,
  "artificial-intelligence": BrainIcon,
  design: PaletteIcon,
  it: ShieldIcon,
  career: GanttChartSquareIcon,
  productivity: BriefcaseIcon,
  "data-science": DatabaseIcon,
  "it-programming": CodeIcon,
  business: TrendingUpIcon,
  // 기본 아이콘
  default: LayersIcon,
};
