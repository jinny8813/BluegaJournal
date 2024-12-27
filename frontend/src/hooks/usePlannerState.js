// 主要的狀態管理 hook
import { useDateRange } from "./useDateRange";
import { usePageNavigation } from "./usePageNavigation";
import { useConfig } from "./useConfig";

export const usePlannerState = () => {
  const dateRange = useDateRange();
  const pageNavigation = usePageNavigation();
  const config = useConfig();

  return {
    ...dateRange,
    ...pageNavigation,
    ...config,
  };
};
