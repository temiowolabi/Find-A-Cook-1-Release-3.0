import React, { useState } from 'react';
import axios from 'axios';

async function postImage({document, description}) {
  const formData = new FormData();
  formData.append("document", document)
  formData.append("description", description)

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const result = await axios.post('http://localhost:5001/cook/documents', formData, config)
  return result.data
}


function RenderUploader() {
  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [documents, setDocuments] = useState([]);

  const submit = async event => {
    event.preventDefault()
    const result = await postImage({document: file, description})
    setDocuments([result.document, ...documents])
  }

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };
  return (
    <div className="App">
<form encType="multipart/form-data" method="POST" action="/cook/documents" onSubmit={submit}>
<input type="file" name="document" multiple onChange={(e) => fileSelected(e)} />
  <button type="submit">Upload Documents</button>
</form>

    </div>
  );
}



export default RenderUploader;
