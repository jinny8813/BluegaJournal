import React from "react";

const Text = ({ language, pageId, pageTitle, contents, theme }) => {
  // 取得頁面標題
  const getTitle = () => {
    if (language === "bilingual") {
      const enTitle = `${pageTitle.en} ${contents.contents.en[pageId].title.text}`;
      const zhTitle = `${contents.contents.zh[pageId].title.text}`;

      return (
        <div
          style={{
            position: "absolute",
            color: theme.page_titles,
            top: contents.contents.en[pageId].title.style.top,
            left: contents.contents.en[pageId].title.style.left,
            width: contents.contents.en[pageId].title.style.width,
            height: contents.contents.en[pageId].title.style.height,
          }}
        >
          <>
            <span style={{ fontSize: "20px" }}>{enTitle} </span>
            <span style={{ fontSize: "16px" }}>{zhTitle}</span>
          </>
        </div>
      );
    } else {
      let title;
      if (language == "en") {
        title = `${pageTitle.en} ${contents.contents.en[pageId].title.text}`;
      } else {
        title = `${pageTitle.tw} ${contents.contents.zh[pageId].title.text}`;
      }
      return (
        <div
          style={{
            position: "absolute",
            color: theme.page_titles,
            top: contents.contents.en[pageId].title.style.top,
            left: contents.contents.en[pageId].title.style.left,
            width: contents.contents.en[pageId].title.style.width,
            height: contents.contents.en[pageId].title.style.height,
          }}
        >
          <span style={{ fontSize: "20px" }}>{title}</span>
        </div>
      );
    }
  };
  // 根據語言選擇內容
  const getContent = () => {
    if (language === "bilingual") {
      const allEN = contents.contents.en[pageId].content;
      const allZH = contents.contents.zh[pageId].content;

      return allEN.map((enContent, i) => {
        const zhContent = allZH[i]; // 對應的中文內容
        return (
          <div
            key={`bilingual-${i}`}
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
            <>
              <span style={{ fontSize: "10px" }}>{enContent.text} </span>
              <span style={{ fontSize: "8px" }}>{zhContent.text}</span>
            </>
          </div>
        );
      });
    } else {
      const allContents = contents.contents[language][pageId].content;

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
          <span style={{ fontSize: "10px" }}>{content.text}</span>
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
