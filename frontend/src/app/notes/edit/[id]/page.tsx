import NoteForm from "@/components/modules/NoteForm";
import React from "react";

const UpdateNote = () => {
  return (
    <div>
      <NoteForm isEdit={true} />
    </div>
  );
};

export default UpdateNote;
