import { useState, useRef } from "react";
import ScaleControl from "./controls/ScaleControl";
import PageNavigator from "./controls/PageNavigator";
import { message } from "antd";
import PlannerDownloadModal from "./controls/PlannerDownloadModal";
import { plannerService } from "../../../services/api/plannerService";

const PlannerControls = ({
  scale,
  onScaleChange,
  currentPage,
  totalPages,
  inputValue,
  onPageChange,
  onInputChange,
  onInputConfirm,
  userSelection,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const abortControllerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const MAX_RETRIES = 3;

  const handleCancel = () => {
    if (isDownloading) {
      abortControllerRef.current?.abort();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      message.info("下載已取消");
    }
    setIsModalVisible(false);
    setIsDownloading(false);
    setRetryCount(0);
  };

  const handleDownload = async (surveyData, setProgress) => {
    if (retryCount >= MAX_RETRIES) {
      message.error("已達最大重試次數，請稍後再試");
      handleCancel();
      return;
    }

    try {
      setIsDownloading(true);

      // 創建新的 AbortController
      abortControllerRef.current = new AbortController();

      // 準備配置數據
      const downloadConfig = {
        userSelection: userSelection,
        surveyData: surveyData,
      };

      // 模擬下載進度
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
      }, 500);
      // 調用 API 生成 PDF
      const pdfBlob = await plannerService.generatePDF(
        downloadConfig,
        abortControllerRef.current.signal
      );

      // 清除進度條計時器
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProgress(100);

      const now = new Date();

      // 處理下載
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `planner-${now.toLocaleDateString()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // 成功後重置重試計數
      setRetryCount(0);
      message.success("下載完成！");

      setTimeout(() => {
        handleCancel();
      }, 1500);
    } catch (error) {
      console.error("下載失敗:", error);

      if (error.message === "Download cancelled") {
        return;
      }

      // 增加重試計數
      setRetryCount((prev) => {
        const newCount = prev + 1;
        if (newCount < MAX_RETRIES) {
          message.warning(`下載失敗，正在進行第 ${newCount} 次重試...`);
          // 使用遞迴調用進行重試，但加入延遲
          setTimeout(() => handleDownload(surveyData, setProgress), 1000);
        }
        return newCount;
      });
    } finally {
      if (retryCount >= MAX_RETRIES) {
        setIsDownloading(false);
        handleCancel();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* 畫面預覽和下載 Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          畫面預覽和下載
        </h2>
        <div className="space-y-4">
          <ScaleControl scale={scale} onScaleChange={onScaleChange} />
          <PageNavigator
            currentPage={currentPage}
            totalPages={totalPages}
            inputValue={inputValue}
            onPageChange={onPageChange}
            onInputChange={onInputChange}
            onInputConfirm={onInputConfirm}
          />
          <button
            onClick={() => setIsModalVisible(true)}
            disabled={isDownloading}
            className="w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 transition-colors duration-200 my-4 text-white"
          >
            <i className="fa-solid fa-download"></i>下載 PDF
          </button>
          <PlannerDownloadModal
            visible={isModalVisible}
            onCancel={handleCancel}
            userSelection={userSelection}
            onSubmit={handleDownload}
            isDownloading={isDownloading}
            retryCount={retryCount}
            maxRetries={MAX_RETRIES}
          />
        </div>
      </div>
    </div>
  );
};

export default PlannerControls;
