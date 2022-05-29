import React, {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import {
  Col,
  FormGroup,
  Row,
  Spinner,
} from 'reactstrap';

import {
  setChecking,
  setCurrentUser,
} from '../../../actions';
import {
  BlockBetween,
  BlockContent,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Icon,
} from '../../../components/Component';
import Head from '../../../layout/head/Head';
import { myServerApi } from '../../../utils/api';
import { fromStringTodateFormatter, dateFormatterAlt, dateCompare, hideEmail } from '../../../utils/Utils';

const UserProfileVerificationPage = ({profileProgressStatus, setProfileProgress, sm, updateSm }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user.user)
  const email = user?.username;
  const [loading, setLoading] = useState(false);
  const [fileCount, setFileCount] = useState(1);
  const [addedFiles, setAddedFiles] = useState([null]);
  const [data, setData] = useState({
      verification_status : "",
      department: "",
      name: "",
      birthday: "",
      id_number: "",
      issue_date: "",
      exp_date: "",
      issue_country: "",
      address: "",
      // city: "",
      // prefecture: "",
      postal_code: "",
      country: "",
      // corporate
      company_name: "",
      director_name: "",
      company_address: "",
      // company_city: "",
      // company_prefecture: "",
      company_postal_code: "",
      company_country: "",

      // files
      passport_file: null,
      utility_file: null,
      
      artice_file: null,
      director_file: null,
      memorandum_file: null,
      ubo_file: null,
      bill_file: null,
      board_file: null
  });
  useEffect(() => {
    dispatch(setChecking(true));
    const myApi = myServerApi();
    const before_email = localStorage.getItem("username");
    myApi.get(`profile/${before_email}`).then(res => {
        dispatch(setChecking(true));
        let user = res.data.data;
        if(user !== "")
        {  
          setData({...data, ...{...user, name: (user.firstname && user.lastname) ? user.firstname + " " + user.lastname: "" ,
                birthday: user.birthday?.toString(),
                issue_date: user.birthday?.toString(),
                exp_date: user.exp_date?.toString(),
                verification_status: user.verification_status === "2"? "Completed": (user.verification_status==="1"? "Pending": "Not Approved")
          }});
        }  
        dispatch(setCurrentUser(user));
        if(user){
          setProfileProgress(true);
          if (user.verification_status === "0") {
            if(!user.department) {
              history.push("user-profile-regular")
              setProfileProgress(false);
            }
            else
            {
              if (user.department === "Individual") {
                for (const key in user) {
                  if (key === "verification_status" || key === "deposit_address" || key === "company_name" || key === "company_address"
                  || key === "company_country" ||  key === "company_country_code"|| key === "company_postal_code"|| key === "company_cellphone_number"|| key === "director_name" )
                    continue;
                    if (key === "country" || key === "issue_country") {
                      if (user[key] === "noselect") {
                        console.log("noselect", key)
                        history.push("user-profile-regular")
                        setProfileProgress(false);
                        break;
                      }  
                    }
                    
                    if (user[key] === "" ||user[key] ==  null) {
                      console.log("in-invalide key", key);
                      history.push("user-profile-regular")
                      setProfileProgress(false);
                      break;
                    }
                }
                
  
              } else {
                for (const key in user) {
                  if (key === "verification_status" || key === "deposit_address")
                    continue;
                  if (key === "country" || key === "issue_country" || key === "company_country") {
                    if (user[key] === "noselect") {
                      console.log("co-noselect", key)
                      history.push("user-profile-regular")
  
                      setProfileProgress(false);
                      break;
                    }  
                  }
                  if (user[key] === "" || user[key] == null) {
                    console.log("cor-invalide key", key);
                    history.push("user-profile-regular")
                      setProfileProgress(false);
                      break;
                    }
                }
        
              }
            }
          } else {
            
          }
         
        
        }
        else{
          toast.error("Failed");
        }
        dispatch(setChecking(false));
    })
    .catch(err => {
      // toast.error("Database not found");
      console.log('error: ', err);
      dispatch(setChecking(false));
      });
  }, []);
  const addFile = (e) => {
  if (data.verification_status !== "Not Approved") {
    return;
  }
  setData({...data, verification_status: data.verification_status});
    let temp = addedFiles;
    temp.push(null);
    setAddedFiles(temp);
    console.log("Added Files", addedFiles)
}
  const removeFile = (index) => {
  if (data.verification_status !== "Not Approved") {
    return;
  }
    let temp = addedFiles;
    temp = [...temp.slice(0,index), ...temp.slice(index + 1,temp.length)];
    setAddedFiles(temp);
}

const uploadData = (e) => {
  if (data.verification_status !== "Not Approved" || loading) {
    return;
  }
      const myApi = myServerApi();
      const formData = new FormData(); 
        // Update the formData object 
        formData.append(
          "email",
          email,
        );
        formData.append(
          "name",
          data.name,
        );
        formData.append(
          "birthday",
          data.birthday,
        );
        formData.append(
          "passport_id",
          data.id_number,
        );
        formData.append(
          "issue_date",
          data.issue_date,
        );
        formData.append(
          "exp_date",
          data.exp_date,
        );
        formData.append(
          "issue_country",
          data.issue_country,
        );
        formData.append(
          "address",
          data.address,
        );
        formData.append( 
          "postal_code", 
          data.postal_code, 
        ); 
        formData.append( 
          "country", 
          data.country, 
        ); 
        // files
        formData.append( 
          "fileCount", 
          addedFiles.length, 
        ); 
        for (let index = 0; index < addedFiles.length; index++) {
          const element = addedFiles[index];
          let fileName = "addedFile" + index;
          formData.append( 
            fileName, 
            element, 
          ); 
        }
        
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };
        setLoading(true);
        myApi.post("/profileVerification", formData, config)
        .then((res) => {
            toast.success("Successfully updated");
          let verification_status= res.data.verification_status === "2"? "Completed": (res.data.verification_status==="1"? "Pending": "Not Approved")

            setData({...data, verification_status: verification_status})
            setLoading(false)
        })
        .catch((err) => {
          toast.success("Successfully updated");
          setLoading(false)

        })

} 

  return (
    <React.Fragment>
      <Head title="Profile Verification"></Head>

      <BlockHead size="lg">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle tag="h4" className="text-center">Profile Verification</BlockTitle>
          </BlockHeadContent>
          <BlockHeadContent className="align-self-start d-lg-none">
            <Button
              className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
              onClick={() => updateSm(!sm)}
            >
              <Icon name="menu-alt-r"></Icon>
            </Button>
          </BlockHeadContent>
        </BlockBetween>
      </BlockHead>
      { data.department === "Individual" ? <BlockContent>
          <Row>
            <Col size={6}>
              <span className="h6 fw-500">Verification Status</span>
            </Col>
            <Col size={6}>
              {/* <div
                className={`dot dot-${
                  data.verification_status === "Completed"
                    ? "success"
                    : data.verification_status === "Pending"
                    ? "warning"
                    : data.verification_status === "Not Approved"
                    ? "danger"
                    : "danger"
                } d-md-none`}
              ></div> */}
              <span
                  className={`badge badge-sm badge-dim badge-outline-${
                    data.verification_status === "Completed"
                    ? "success"
                    : data.verification_status === "Pending"
                    ? "warning"
                    : data.verification_status === "Not Approved"
                    ? "danger"
                    : "danger"
                  } d-md-inline-flex`}
                >
                  {data.verification_status}
                </span>
            </Col>
          </Row>
        <div className="mt-2" style={{borderBottom:"1px solid #364a63"}}>
        </div>
          <Row className="mt-3 ">
            <Col size={6}>
              <span className="h6 fw-light">Account type</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.department}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Name</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.name}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Birthday</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{fromStringTodateFormatter(data.birthday, true)}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Id number</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.id_number}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Issue Date</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{fromStringTodateFormatter(data.issue_date, true)}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Expiration Date</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{fromStringTodateFormatter(data.exp_date, true)}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Issue Country</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.issue_country}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Home Address</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.address}</span>
            </Col>
          </Row>
          {/* <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">City/Municipality</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.city}</span>
            </Col>
          </Row> */}
          {/* <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Prefecture</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.prefecture}</span>
            </Col>
          </Row> */}
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Postal Code</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.postal_code}</span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col size={6}>
              <span className="h6 fw-light">Country</span>
            </Col>
            <Col size={6}>
              <span className="h6 fw-light">{data.country}</span>
            </Col>
          </Row>
          <div className="mt-3" style={{borderBottom:"1px solid #364a63"}}>
          </div>
          <Row>
            <Col className="ml-3 mt-2">
                The following documents are required for individual verification.
              <br/><br/>
              1. ID (passport or valid drivers license or residence permit or government-issued ID Card)
              <br/><br/>
                *In some cases, we may request additional confirmation documents.
            </Col>
          </Row>
          <Row>
            <Col  md={8} >
            {
              addedFiles.length !== 0 ? addedFiles.map((item, index) => {
                return(
                  <FormGroup className="mt-4 ml-3">
                      <div className="form-control-wrap d-flex">
                          <div className="custom-file">
                              <input type="file" className="custom-file-input" name={index} id={index} disabled= {data.verification_status !== "Not Approved"}
                                onChange={(e) => {let temp = addedFiles; temp[index] = e.target.files[0]; setAddedFiles(temp); setData({...data, verification_status:data.verification_status}) }}
                                />
                              <label className="custom-file-label" htmlFor={index}>
                                {(item == null) ? "Choose a file" : item.name} 
                              </label>
                          </div>
                          <Button className="btn-dim" color="warning" onClick={e => removeFile(index)}>Remove</Button>
                      </div>

                  </FormGroup> 
                )
              }):""
            }
            </Col>
            <Col md={4}>
              <FormGroup>
                  <Button type="input" color="primary" disabled= {data.verification_status !== "Not Approved"} size="md" onClick={(e) => addFile(e)} className="btn mt-4 ml-3">
                  Add
                  </Button>
              </FormGroup>
            </Col>
        
          </Row>
          <div className="text-center pt-5">
            <FormGroup>
              <Button type="input" color="primary" disabled= {data.verification_status !== "Not Approved"} size="lg" onClick={(e) => uploadData(e)} className="btn-block">
                {loading ? <Spinner size="sm" color="light" /> : "Update"}
              </Button>
            </FormGroup>
        </div>
      </BlockContent> :
      // Corporate part
      <BlockContent>
      <Row>
        <Col size={6}>
          <span className="h6 fw-500">Verification Status</span>
        </Col>
        <Col size={6}>
          <div
            className={`dot dot-${
              data.verification_status !== "Not Approved"
                ? "success"
                : data.verification_status === "Pending"
                ? "warning"
                : data.verification_status === "Not Approved"
                ? "danger"
                : "danger"
            } d-md-none`}
          ></div>
          <span
              className={`badge badge-sm badge-dim badge-outline-${
                data.verification_status !== "Not Approved"
                ? "success"
                : data.verification_status === "Pending"
                ? "warning"
                : data.verification_status === "Not Approved"
                ? "danger"
                : "danger"
              } d-none d-md-inline-flex`}
            >
              {data.verification_status}
            </span>
        </Col>
      </Row>
      <div className="mt-2" style={{borderBottom:"1px solid #364a63"}}>
      </div>
      <Row className="mt-2">
        <Col size={6}>
          <span className="h6 fw-light">Account type</span>
        </Col>
        <Col size={6}>
          <span className="h6 fw-light">{data.department}</span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col size={6}>
          <span className="h6 fw-light">Company Name</span>
        </Col>
        <Col size={6}>
          <span className="h6 fw-light">{data.company_name}</span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col size={6}>
          <span className="h6 fw-light">Director</span>
        </Col>
        <Col size={6}>
          <span className="h6 fw-light">{data.director_name}</span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col size={6}>
          <span className="h6 fw-light">Company Address</span>
        </Col>
        <Col size={6}>
          <span className="h6 fw-light">{data.company_address}</span>
        </Col>
      </Row>
      {/* <Row className="mt-3">
        <Col size={6}>
          <span className="h6 fw-light">City/Municipality</span>
        </Col>
        <Col size={6}>
          <span className="h6 fw-light">{data.company_city}</span>
        </Col>
      </Row> */}
      {/* <Row className="mt-3">
        <Col size={6}>
          <span className="h6 fw-light">Prefecture</span>
        </Col>
        <Col size={6}>
          <span className="h6 fw-light">{data.company_prefecture}</span>
        </Col>
      </Row> */}
      <Row className="mt-3">
        <Col size={6}>
          <span className="h6 fw-light">Postal Code</span>
        </Col>
        <Col size={6}>
          <span className="h6 fw-light">{data.company_postal_code}</span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col size={6}>
          <span className="h6 fw-light">Country</span>
        </Col>
        <Col size={6}>
          <span className="h6 fw-light">{data.company_country}</span>
        </Col>
      </Row>
      <div className="mt-2" style={{borderBottom:"1px solid #364a63"}}>
      </div>
      <Row>
          <Col className="ml-3 mt-2">
          The following documents are required for corporate verification.
          <br/><br/>
          1. Certificate of Incorporation
          <br/><br/>
          2. Director's ID(passport or valid drivers license or residence permit or government-issued ID card)
          <br/><br/>
          *In some cases, we may request additional confirmation documents. <br/>
          </Col>
      </Row>
      <Row>
            <Col  md={8}>
            {
              addedFiles.length !== 0 ?addedFiles.map((item, index) => {
                return(
                  <FormGroup className="mt-4 ml-3" >
                      <div className="form-control-wrap d-flex">
                          <div className="custom-file">
                              <input type="file" className="custom-file-input" name={index} id={index} disabled= {data.verification_status !== "Not Approved"}
                                onChange={(e) => {let temp = addedFiles; temp[index] = e.target.files[0]; setAddedFiles(temp); setData({...data, verification_status:data.verification_status}) }}
                                />
                              <label className="custom-file-label" htmlFor={index}>
                                {(item == null) ? "Choose a file" : item.name} 
                              </label>
                          </div>
                          <Button className="btn-dim" color="warning" onClick={e => removeFile(index)}>Remove</Button>
                      </div>
                  </FormGroup> 
                )
              }): ""
            }
            </Col>
            <Col md={4}>
              <FormGroup>
                  <Button type="input" color="primary" disabled= {data.verification_status !== "Not Approved"} size="md" onClick={(e) => addFile(e)} className="btn mt-4 ml-3">
                  Add
                  </Button>
              </FormGroup>
            </Col>
        
          </Row>
      <div className="text-center pt-5">
        <FormGroup>
          <Button type="input"  disabled= {data.verification_status !== "Not Approved"} color="primary" size="lg" onClick={(e) => uploadData(e)} className="btn-block">
            {loading ? <Spinner size="sm" color="light" /> : "Update"}
          </Button>
        </FormGroup>
    </div>
      </BlockContent>  
      }
    </React.Fragment>
  );
};
export default UserProfileVerificationPage;
