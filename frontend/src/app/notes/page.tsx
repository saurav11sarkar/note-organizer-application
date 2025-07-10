import NoteLists from "@/components/modules/NoteLists";
import React from "react";

const sampleNotes = [
  {
    _id: "686eb2d69123f3593e58fd30",
    title: "First Note",
    content:
      "This is my first note content. It can be quite long and will be truncated properly in the UI.",
    image: [
      "https://images.pexels.com/photos/30929534/pexels-photo-30929534.jpeg",
      "https://images.pexels.com/photos/32802756/pexels-photo-32802756.jpeg",
    ],
    category: {
      _id: "686d4da0fe482649dadc2177",
      name: "Personal",
    },
    user: {
      _id: "68698e6f1c2e244a37647ec6",
      name: "Saurav",
      email: "saurav@gmail.com",
    },
    createdAt: "2025-07-09T18:20:06.574Z",
    updatedAt: "2025-07-10T08:26:24.049Z",
  },
  {
    _id: "686eb2d69123f3593e58fd31",
    title:
      "Second Note with a much longer title that will definitely need to be truncated",
    content:
      "This is another note with different content. The UI should handle long content properly with line clamping.",
    category: {
      _id: "686d4da0fe482649dadc2178",
      name: "Work",
    },
    user: {
      _id: "68698e6f1c2e244a37647ec6",
      name: "Saurav",
      email: "saurav@gmail.com",
    },
    createdAt: "2025-07-08T10:15:30.000Z",
    updatedAt: "2025-07-09T14:45:12.000Z",
  },
  {
    _id: "686eb2d69123f3593e58fd32",
    title: "Third Note",
    content: "Short content for this one.",
    image: [
      "https://images.pexels.com/photos/32399760/pexels-photo-32399760.jpeg",
    ],
    category: {
      _id: "686d4da0fe482649dadc2179",
      name: "Ideas",
    },
    user: {
      _id: "68698e6f1c2e244a37647ec6",
      name: "Saurav",
      email: "saurav@gmail.com",
    },
    createdAt: "2025-07-07T09:10:45.000Z",
    updatedAt: "2025-07-07T09:10:45.000Z",
  },
  
];

const NotePage = () => {
  return (
    <div className="min-h-screen">
      <NoteLists notes={sampleNotes} />
    </div>
  );
};

export default NotePage;
