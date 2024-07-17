import { JSDOM } from "jsdom";

export const cleanHtml = (html: string): string => {
  const blacklistedElements = new Set([
    "head",
    "title",
    "meta",
    "script",
    "style",
    "path",
    "svg",
    "br",
  ]);

  const blacklistedAttributes = [
    "style",
    "ping",
    "src",
    "item.*",
    "aria.*",
    "js.*",
    "data-.*",
  ];

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Remove blacklisted elements
  blacklistedElements.forEach((tag) => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((element) => element.remove());
  });

  // Remove blacklisted attributes
  const elements = document.querySelectorAll("*");
  elements.forEach((element) => {
    blacklistedAttributes.forEach((attrPattern) => {
      const regex = new RegExp(`^${attrPattern}$`);
      Array.from(element.attributes).forEach((attr) => {
        if (regex.test(attr.name)) {
          element.removeAttribute(attr.name);
        }
      });
    });
  });

  // Remove children of elements that have children
  //   elements.forEach((element) => {
  //     if (element.children.length > 0) {
  //       while (element.firstChild) {
  //         element.removeChild(element.firstChild);
  //       }
  //     }
  //   });

  //   // Remove elements without attributes
  //   elements.forEach((element) => {
  //     if (element.attributes.length === 0) {
  //       element.remove();
  //     }
  //   });

  const sourceCode = document.documentElement.outerHTML;

  return sourceCode;
};
