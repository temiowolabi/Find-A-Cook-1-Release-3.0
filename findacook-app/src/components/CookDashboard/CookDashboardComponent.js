import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCook } from '../../redux/actions/cookActions'
import axios from 'axios';
import Scheduler from '../Scheduler';

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


const CookDashboard = () => {
  // const navigate = useNavigate();
	// const { cookId } = useParams();
	// console.log('', cookId)
	
	// const dispatch = useDispatch(); 


	// useEffect(() => {
	// 	dispatch(getCook(cookId));
	// }, [dispatch, cookId]);

	// const { cook } = useSelector(state => state.cooks);
  // console.log(cook);

  const [documentDescription, setDocumentDescription] = useState("")
  const [documents, setDocuments] = useState([]);

  const submit = async (event) => {
    event.preventDefault();
    const result = await postImage({documents, documentDescription});
    setDocuments([...result.documents, ...documents]);
  };
  

  const fileSelected = (event) => {
    const files = event.target.files;
    setDocuments(files);
  };

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [profile, setProfile] = useState("");
  const [menuItem, setMenuItem] = useState(null);
  const [specialities, setSpecialities] = useState([]);


  axios.defaults.withCredentials = true
  useEffect(()=> {
      axios.get('http://localhost:5001/cook/cookinfo', {
        params: {
          populate: "specialties",
        },
      })
      .then((res) => {
          setFirstName(res.data.firstn);
          setLastName(res.data.lastn);
          setEmail(res.data.email);
          setSpecialities(res.data.special);
          setDescription(res.data.descrip);
          setProfile(res.data.profile);
          console.log(res.data.firstn)
      })
      .catch((err) => {
          console.error(err);
      });
  }, [])

  useEffect(() => {
    axios.get('http://localhost:5001/cook/menuitems')
      .then((res) => {
        setMenuItem(res.data.menuItem);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
  
    return (
<>

     <section class="dashboard">

     <div class="row">
             <div class="col-xl-4">
               <div class="card-box">
                 <h4 class="header-title mt-0">Personal Information</h4>
                 <div class="panel-body">
                   <p class="text-muted font-13">
                     hello, I'm {firstname} {lastname}. {description}
                   </p>
                   <hr />
                   <div class="text-left">
                     <p class="text-muted font-13">
                       <strong>Full Name :</strong>{" "}
                       <span class="m-l-15">{firstname} {lastname}</span>
                     </p>
                     <p class="text-muted font-13">
                       <strong>Email :</strong>{" "}
                       <span class="m-l-15">{email}</span>
                     </p>
                     <p class="text-muted font-13">
                       <strong>Cuisine(s) :</strong>{" "}
                       <span class="m-l-5">
                         <span
                           class="flag-icon flag-icon-us m-r-5 m-t-0"
                           title="us"
                         ></span>
                         <span>{specialities.map((item) => item.category_name).join(", ")}</span>{" "}
                       </span>
                     </p>
                   </div>
                 </div>
               </div>
             </div>
             <div class="col-xl-8">
               <div class="row">
                 <div class="col-sm-4">
                   <div className="cook-img-container">
                     <div className="cook-dash-img">
                       <img 
                       src={`http://localhost:5001/${profile}`}
                       alt="" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
 
     </section>


</>
    );
  };
  
  export default CookDashboard;
