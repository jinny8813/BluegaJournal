import {
  Modal,
  Form,
  Input,
  Select,
  Progress,
  Button,
  Steps,
  message,
} from "antd";
import { useState } from "react";
import { format } from "date-fns";

const { Step } = Steps;

const PlannerDownloadModal = ({
  visible,
  onCancel,
  userSelection,
  onSubmit,
  isDownloading,
  retryCount,
  maxRetries,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [form] = Form.useForm();

  // 移除 isRetrying 狀態，簡化邏輯
  const handleSubmit = async (surveyData) => {
    try {
      setCurrentStep(2);
      await onSubmit(surveyData, setDownloadProgress);
    } catch (error) {
      // 只處理錯誤提示，重試邏輯交給父組件
      message.error("下載失敗");
    }
  };

  const handleCancel = () => {
    if (!isDownloading) {
      form.resetFields();
      setCurrentStep(0);
      setDownloadProgress(0);
    }
    onCancel();
  };

  return (
    <Modal
      title="下載確認"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      closable={!isDownloading}
      maskClosable={!isDownloading}
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="確認選項" />
        <Step title="問卷調查" />
        <Step title="下載進度" />
      </Steps>

      {currentStep === 0 && (
        <div>
          <h3>請確認您的手帳設置：</h3>
          <ul>
            <li>方向：{userSelection.orientation}</li>
            <li>主題：{userSelection.theme}</li>
            <li>---</li>
            <li>周開始：{userSelection.weekStart}</li>
            <li>開始月份：{format(userSelection.startDate, "yyyy-MM")}</li>
            <li>期間：{userSelection.duration} 個月</li>
            <li>---</li>
            <li>版面：{userSelection.layouts.join(", ")}</li>
            <li>---</li>
            <li>語言：{userSelection.language}</li>
            <li>農曆：{userSelection.lunarDate}</li>
            <li>節日：{userSelection.holidays}</li>
          </ul>
          <div style={{ marginTop: 24, textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              返回修改
            </Button>
            <Button type="primary" onClick={() => setCurrentStep(1)}>
              繼續
            </Button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="age"
            label="年齡區間"
            rules={[{ required: true, message: "請選擇年齡區間" }]}
          >
            <Select>
              <Select.Option value="18-24">18-24 歲</Select.Option>
              <Select.Option value="25-34">25-34 歲</Select.Option>
              <Select.Option value="35-44">35-44 歲</Select.Option>
              <Select.Option value="45-54">45-54 歲</Select.Option>
              <Select.Option value="55+">55 歲以上</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="occupation"
            label="職業"
            rules={[{ required: true, message: "請選擇職業" }]}
          >
            <Select>
              <Select.Option value="student">學生</Select.Option>
              <Select.Option value="employed">上班族</Select.Option>
              <Select.Option value="self-employed">自由工作者</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="source"
            label="從何處得知本網站"
            rules={[{ required: true, message: "請選擇資訊來源" }]}
          >
            <Select>
              <Select.Option value="social">社群媒體</Select.Option>
              <Select.Option value="search">搜尋引擎</Select.Option>
              <Select.Option value="friend">親友推薦</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="couponCode" label="兌換碼（選填）">
            <Input placeholder="請輸入兌換碼" />
          </Form.Item>

          <div style={{ marginTop: 24, textAlign: "right" }}>
            <Button
              onClick={() => setCurrentStep(0)}
              style={{ marginRight: 8 }}
            >
              返回
            </Button>
            <Button type="primary" htmlType="submit">
              開始下載
            </Button>
          </div>
        </Form>
      )}

      {currentStep === 2 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Progress
            type="circle"
            percent={downloadProgress}
            status={retryCount > 0 ? "exception" : undefined}
          />
          <p style={{ marginTop: 16 }}>
            {downloadProgress < 100
              ? retryCount > 0
                ? `正在重試中 (${retryCount}/${maxRetries})...`
                : "正在生成 PDF..."
              : "下載完成！"}
          </p>
          {isDownloading && (
            <Button danger style={{ marginTop: 16 }} onClick={handleCancel}>
              取消下載
            </Button>
          )}
          {retryCount > 0 && (
            <p style={{ marginTop: 8, color: "#faad14" }}>
              重試次數: {retryCount}/{maxRetries}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
};

export default PlannerDownloadModal;
