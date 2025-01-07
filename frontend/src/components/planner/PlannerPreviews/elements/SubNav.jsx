import React from "react";

const SubNav = ({
  theme,
  allPages,
  page,
  contents,
  language,
  getPagesByLayoutIdandDate,
  onPageChange,
}) => {
  const generateSubNav = () => {
    if (language === "bilingual") {
      language = "en";
    }
    const layoutTypes = allPages.filter(
      (p) => p.type === "chapter" && p.layout_type === `${page.layout.type}`
    );
    return layoutTypes.map((layoutType, i) => {
      const label = contents.contents[language][layoutType.layoutId].title.text;
      const isCurrentLayout = page.layoutId === layoutType.layoutId;
      const targetPage = getPagesByLayoutIdandDate(
        layoutType.layoutId,
        page.dateRange
      );

      return (
        <>
          <span
            key={`${i}`}
            style={{
              fontSize: "8px",
              fontWeight: `${isCurrentLayout ? "bold" : "normal"}`,
              color: `${
                isCurrentLayout
                  ? theme.page_dynamic_elements
                  : theme.page_contents
              }`,
              cursor: "pointer",
            }}
            onClick={() => onPageChange(targetPage[0].pageNumber)}
          >
            &nbsp;{label}
          </span>
          {layoutTypes.length - 1 !== i ? (
            <span style={{ fontSize: "8px", color: theme.page_contents }}>
              &nbsp;·
            </span>
          ) : (
            <></>
          )}
        </>
      );
    });
  };
  return (
    <div
      className="flex flex-row items-center"
      style={{
        position: "absolute",
        top: "32px",
        right: "48px",
      }}
    >
      {generateSubNav()}
    </div>
  );
};

export default React.memo(SubNav);
