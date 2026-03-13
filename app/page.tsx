import { StudyPage } from "@/components/StudyPage";
import { studyFormatExample, type StudyData } from "@/components/study-schema";
import studyData from "@/data/study-data.json";

export default function Home() {
  const { title, sections } = studyData as StudyData;

  return (
    <StudyPage
      title={title}
      sections={sections}
      formatExample={studyFormatExample}
    />
  );
}
