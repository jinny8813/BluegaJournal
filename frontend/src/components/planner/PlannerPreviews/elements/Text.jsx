import React from "react";

const Text = ({ config, language, pageId, theme }) => {
  // 取得頁面標題
  const getTitle = () => {
    if (language === "both") {
      const enTitle = config.contents.en[pageId].title;
      const zhTitle = config.contents.zh[pageId].title;

      return (
        <div
          style={{
            position: "absolute",
            color: theme.page_titles,
            top: enTitle.style.top,
            left: enTitle.style.left,
            width: enTitle.style.width,
            height: enTitle.style.height,
          }}
        >
          <span>
            <span style={{ fontSize: "20px" }}>{enTitle.text} </span>
            <span style={{ fontSize: "16px" }}>{zhTitle.text}</span>
          </span>
        </div>
      );
    } else {
      const title = config.contents[language][pageId].title;
      return (
        <div
          style={{
            position: "absolute",
            color: theme.page_titles,
            top: title.style.top,
            left: title.style.left,
            width: title.style.width,
            height: title.style.height,
          }}
        >
          <span>
            <span style={{ fontSize: "20px" }}>{title.text}</span>
          </span>
        </div>
      );
    }
  };
  // 根據語言選擇內容
  const getContent = () => {
    if (language === "both") {
      const allEN = config.contents.en[pageId].content;
      const allZH = config.contents.zh[pageId].content;

      return allEN.map((enContent, i) => {
        const zhContent = allZH[i]; // 對應的中文內容
        return (
          <div
            key={`both-${i}`}
            className="flex flex-col items-center"
            style={{
              position: "absolute",
              color: theme.page_contents,
              top: enContent.style.top,
              left: enContent.style.left,
              width: enContent.style.width,
              height: enContent.style.height,
              justifyContent: "center",
            }}
          >
            <span>
              <span style={{ fontSize: "10px" }}>{enContent.text} </span>
              <span style={{ fontSize: "8px" }}>{zhContent.text}</span>
            </span>
          </div>
        );
      });
    } else {
      const allContents = config.contents[language][pageId].content;

      return allContents.map((content, i) => (
        <div
          key={`${language}-${i}`}
          className="flex flex-col items-center"
          style={{
            position: "absolute",
            color: theme.page_contents,
            top: content.style.top,
            left: content.style.left,
            width: content.style.width,
            height: content.style.height,
            justifyContent: "center",
          }}
        >
          <span>
            <span style={{ fontSize: "10px" }}>{content.text}</span>
          </span>
        </div>
      ));
    }
  };

  return (
    <>
      {getTitle()}
      {getContent()}
    </>
  );
};

export default React.memo(Text);
