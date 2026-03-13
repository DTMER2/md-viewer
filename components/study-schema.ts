export type StudySection = {
  title: string;
  items: string[];
};

export type StudyData = {
  title: string;
  sections: StudySection[];
};

export const studyFormatExample = `{
  "title": "免疫細胞の分類",
  "sections": [
    {
      "title": "基本",
      "items": [
        "貪食能を持つ白血球: {{好中球}}、単球、マクロファージ、樹状細胞（DC）。",
        "抗原提示能を持つ白血球: 単球、マクロファージ、樹状細胞（DC）、{{B細胞}}。"
      ]
    }
  ]
}`;
