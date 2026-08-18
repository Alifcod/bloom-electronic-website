// Future technical articles use this content model. Keep the collection small and
// publish only material supported by Bloom's real engineering experience.
export const articleTopics = [
  "PCB troubleshooting",
  "PCB manufacturing preparation",
  "Embedded controller development",
  "ESP32 and STM32 production considerations",
  "Prototype failure analysis",
  "DFM and BOM preparation",
  "Industrial IoT connectivity",
  "Power-electronics development lessons",
];

export const articles = [];

export function defineArticle(article) {
  return {
    slug: "",
    title: "",
    description: "",
    publishedAt: "",
    updatedAt: "",
    topic: "",
    summary: "",
    sections: [],
    limitations: [],
    relatedServices: [],
    ...article,
  };
}
