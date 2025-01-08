import React from "react";
import { getLunarOrSolarTerm } from "../../../../utils/lunarGenerator";

const Text = ({
  language,
  pageId,
  pageTitle,
  contents,
  theme,
  lunarDate,
  dateRange,
}) => {
  const isSingleDay =
    dateRange.start.toDateString() === dateRange.end.toDateString();
  const getLunarTerm = () => {
    if (lunarDate === "true" && isSingleDay) {
      const lunarTerm = getLunarOrSolarTerm(new Date(dateRange.start));
      return lunarTerm;
    }
    return null;
  };

  const lunarTerm = getLunarTerm();

  // 取得頁面標題
  const getTitle = () => {
    if (language === "bilingual") {
      let enTitle = `${pageTitle.en}`;
      let enTitleText = contents.contents.en[pageId].title.text;
      let zhTitle = `${contents.contents.zh[pageId].title.text}`;
      let lunarTitle = lunarTerm ? `${lunarTerm}` : null;

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
            {lunarTitle && (
              <span style={{ fontSize: "16px" }}>{lunarTitle} </span>
            )}
            {!isSingleDay && (
              <>
                <span style={{ fontSize: "20px" }}>{enTitleText} </span>
                <span style={{ fontSize: "16px" }}>{zhTitle}</span>
              </>
            )}
          </>
        </div>
      );
    } else {
      let title;
      let titleText;
      if (language == "en") {
        title = `${pageTitle.en}`;
        titleText = `${contents.contents.en[pageId].title.text}`;
      } else {
        title = `${pageTitle.tw}`;
        titleText = `${contents.contents.zh[pageId].title.text}`;
      }
      let lunarTitle = lunarTerm ? `${lunarTerm}` : null;

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
            <span style={{ fontSize: "20px" }}>{title} </span>
            {lunarTitle && (
              <span style={{ fontSize: "20px" }}>{lunarTitle} </span>
            )}
            {!isSingleDay && (
              <span style={{ fontSize: "20px" }}>{titleText} </span>
            )}
          </>
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
            className="flex items-center"
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
              &nbsp;
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
