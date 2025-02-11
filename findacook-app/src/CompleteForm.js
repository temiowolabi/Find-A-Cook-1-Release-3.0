import React, { useState } from 'react';
import Footer from "./components/Footer/Footer";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

async function postImage({documents, description}) {
  const formData = new FormData();
  for (let i = 0; i < documents.length; i++) {
    formData.append('document', documents[i]);
  }
  formData.append('description', description);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const result = await axios.post('http://localhost:5001/cook/documents', formData, config);
  return result.data;
}


const CompleteForm = () => {
    const { categories } = useSelector(state => state.categories);

    const [file, setFile] = useState()
    const [description, setDescription] = useState("")
    const [documents, setDocuments] = useState([]);
  
    const submit = async (event) => {
      event.preventDefault();
      const result = await postImage({documents, description});
      setDocuments([...result.documents, ...documents]);
    };
    
  
    const fileSelected = (event) => {
      const files = event.target.files;
      setDocuments(files);
    };
  return (
    <>

      

<Topbar />
            <Sidebar />

            <div className="cookaddfood">


          <h2>Documentation</h2>
          <form encType="multipart/form-data" method="POST" action="/cook/documents" onSubmit={submit} className="personal-form">
        <label for="other">Add the following documents: </label>
        <div>

  <ul className="documents-list">
    <li>HAACP</li>
    <li>Garda Vetting</li>
    <li>Insurance</li>
  </ul>
</div> 

        <input type="file" name="document" multiple onChange={(e) => fileSelected(e)} placeholder="Other" accept=".pdf" /> <br />


        <a href="/submit"><button type="submit">Submit</button></a>

      </form>

      </div> 

      {/* <Footer /> */}
    </>
  );
};

export default CompleteForm;
