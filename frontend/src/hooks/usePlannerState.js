// 主要的狀態管理 hook
import { useDateRange } from "./useDateRange";
import { usePageNavigation } from "./usePageNavigation";

export const usePlannerState = () => {
  const dateRange = useDateRange();
  const pageNavigation = usePageNavigation();

  return {
    ...dateRange,
    ...pageNavigation,
  };
};
