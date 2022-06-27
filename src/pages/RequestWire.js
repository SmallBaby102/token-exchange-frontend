import React, {
  useEffect,
  useState,
} from 'react';

import { parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Badge,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  PopoverBody,
  PopoverHeader,
  Spinner,
  UncontrolledPopover,
  Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Toast
} from 'reactstrap';

import { setChecking, setCurrentUser } from '../actions';
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Col,
  PreviewCard,
  Icon,
  Row,
  RSelect,
  
  BlockBetween,
  BlockDes,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent, 
} from '../components/Component';
import Head from '../layout/head/Head';
import { myServerApi } from '../utils/api';
import Helper , {CONFIGURATOR_USERNAME, CONFIGURATOR_PASSWORD} from '../utils/Helper';
import axios from 'axios';
// import { productData, categoryOptions } from "./ProductData";
import Content from "../layout/content/Content";
// import ProductH from "../../../images/product/h.png";
import Dropzone from "react-dropzone";
import SimpleBar from "simplebar-react";
import { t } from 'i18next';
let RapidAPIKey = '575b213f4emsh6492c40f41807b3p1502cajsn546e9d7adab9';
// var formatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: "USD",
//   // currencyDisplay: ''
// });
const RequestWire = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const myApi = myServerApi(); 
  const user = useSelector((state) => state.user.user);
  // const userinfo = useSelector((state) => state.user);
  // const verification_status = user?.verification_status;
  const email = localStorage.getItem("username"); //useSelector((state) => state.user.user.username)
  const { errors, register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [availableAmount, setAvailableAmount] = useState(-1);
  const [minimumAmount, setMinimumAmount] = useState(10000);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [fees, setFees] = useState(320);
  const user_id = localStorage.getItem("user_id");
  const [usditem, setUsditem] = useState({})
  const [wireFinish, setWireFinish] = useState(0)
  const [wireId, setWireId] = useState(null)
  const [modal, setModal] = useState({
    wireConfirm: false,
    useTemplate: false,
    template_remove_confirm: false,
    auth: false,
  });
  const accounts = useSelector(state => state.user.accounts);
  // let accouts_arr = Object.keys(accounts).map((key) => [Number(key), accounts[key]]);
  const [errorsStr, setErrorsStr] = useState({
    beneficiary_name : {status: false, message: t('unavailable_character_error') },
    beneficiary_street : {status: false, message: t('unavailable_character_error') },
    beneficiary_city : {status: false, message: t('unavailable_character_error') },
    bankstreet_address : {status: false, message: t('unavailable_character_error') },
    beneficiary_postal_code : {status: false, message: t('unavailable_character_error') },
    bank_name : {status: false, message: t('unavailable_character_error') },
    bank_city : {status: false, message: t('unavailable_character_error') },
    bank_country : {status: false, message: "This field is required" },
    bankpostal_code : {status: false, message: t('unavailable_character_error') },
    swift_code : {status: false, message: "Only alphabet characters are allowed for Swift code" },
    reference_code : {status: false, message: "Only alphabet characters are allowed for Swift code" },
    intermediarybank_address : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank address" },
    intermediarybank_name : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank name" },
    intermediarybank_number : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank number'" },
    intermediarybank_region : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank region'" },
    intermediarybank_swiftcode : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank swift code" },
    bankaccount_number : {status: false, message: "Only alphabet characters are allowed for Bank account number" },
    templatename : {status: false, message: "This field is required" },
  })
  const [errorsWire, setErrorsWire] = useState({
    status: false,
    message: ""
  })
  const [errorsf, setErrorsf] = useState({
    authfield: { status: false, message : "Must be only alphabetic characters",},
  });
  const [formData, setFormData] = useState({

    // individual relative state
    account_type: "Individual",
    beneficiary_name: "",
    beneficiary_country: "",
    beneficiary_street: "",
    // beneficiary_city: "",
    beneficiary_postal_code: "",
    bank_name: "",
    bankaccount_number: "",
    bank_country: "noselect",
    bankstreet_address: "",
    // bank_city: "",
    // bank_region: "",
    bankpostal_code: "",
    swift_code: "",
    reference_code: "",
    // intermediarybank_city:"",
    intermediarybank_name:"",
    intermediarybank_address:"",
    intermediarybank_number:"",
    intermediarybank_country:"",
    // intermediarybank_region: "",
    intermediarybank_swiftcode: "",
    amount: 0,
  });
  const [secret_val, setSecret_val] = useState("")
  const [authCode, setAuthCode] = useState("")
  // const profileOptions = {
  //   title       : [{value: "Mr.", label: "Mr."},{value: "Ms.", label: "Ms."}],
  //   marriage    : [{value: "Single", label: "Single"}, {value: "Married", label: "Married"}],
  //   account_type    : [{value: "Individual", label: "Individual"}, {value: "Corporate", label: "Corporate"}],
  //   occupation  : [{value: "CEO", label: "CEO"}, {value: "Director", label: "Director"}, {value: "Employee", label: "Employee"}, {value: "Housewife", label: "Housewife"}, {value: "Student", label: "Student"}, {value: "Other", label: "Other"}],
  // };
  const onWireConfirmFormCancel = () => {
    setFormData({...formData, amount: 0})
    setModal({...modal, wireConfirm: false})
  }
  const onUseTemplateFormCancel = () => {
    setModal({...modal, useTemplate: false})
  }
  const handleFormSubmit = (submitFormData) => {
    if (loading)
    return;
    if (saveTemplate && templateName === "") {
      setErrorsStr({
        ...errorsStr, templatename: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.beneficiary_name === "") {
      setErrorsStr({
        ...errorsStr, beneficiary_name: {status: true, message: "This field is required"}
      });
      return;
    }
    // if (formData.beneficiary_street === "") {
    //   setErrorsStr({
    //     ...errorsStr, beneficiary_street: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }
    // if (formData.beneficiary_postal_code === "") {
    //   setErrorsStr({
    //     ...errorsStr, beneficiary_postal_code: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }
    if (formData.bank_name === "") {
      setErrorsStr({
        ...errorsStr, bank_name: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.bank_country === "noselect") {
      setErrorsStr({
        ...errorsStr, bank_country: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.bankaccount_number === "") {
      setErrorsStr({
        ...errorsStr, bankaccount_number: {status: true, message: "This field is required"}
      });
      return;
    }
    // if (formData.bankstreet_address === "") {
    //   setErrorsStr({
    //     ...errorsStr, bankstreet_address: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }
    // if (formData.bank_region === "") {
    //   setErrorsStr({
    //     ...errorsStr, bank_region: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }
    // if (formData.bankpostal_code === "") {
    //   setErrorsStr({
    //     ...errorsStr, bankpostal_code: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }
    if (formData.swift_code === "") {
      setErrorsStr({
        ...errorsStr, swift_code: {status: true, message: "This field is required"}
      });
      return;
    }
    // if (formData.intermediarybank_name === "") {
    //   setErrorsStr({
    //     ...errorsStr, intermediarybank_name: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }
    // if (formData.intermediarybank_address === "") {
    //   setErrorsStr({
    //     ...errorsStr, intermediarybank_address: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }
    // if (formData.intermediarybank_number === "") {
    //   setErrorsStr({
    //     ...errorsStr, intermediarybank_number: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }
    // if (formData.intermediarybank_swiftcode === "") {
    //   setErrorsStr({
    //     ...errorsStr, intermediarybank_swiftcode: {status: true, message: "This field is required"}
    //   });
    //   return;
    // }

   
    if (formData.amount < minimumAmount){
        setErrorsWire({
          status:true,
          message: `Amount must be over ${minimumAmount}`
        })
        return;
    } 
        
    if (formData.amount > availableAmount) {
      setErrorsWire({
        status: true,
        message: "Amount must be under total amount"
      })
      return;
    }
    if (saveTemplate){
      let indexOfName = data.findIndex((item) => item.template_name === templateName);
      if (indexOfName >= 0){
        setErrorsStr({...errorsStr, templatename: {status: true, message: "Template Name already exists"}})
        return;
      }
      let submittedData = {
        template_name: templateName,
        beneficiary_name: formData.beneficiary_name,
        bank_name: formData.bank_name,
        bank_account_number: formData.bankaccount_number,
        bank_country: formData.bank_country,
        swift_bic_code: formData.swift_code,
        reference_code: formData.reference_code,
      }
      const myApi = myServerApi();
      myApi.post(`/bank_template/${email}`, submittedData).then(res => {
          console.log("result", res)
      }).catch(err => {
          console.log('error: ', err);
      });
    }
    
    setWireFinish(0);
    setModal({...modal, wireConfirm: true})
    
  };
  
  const onWireConfirmSubmit = async () => {
    // setModal({...modal, wireConfirm: false})
    if (loading)
    return;
    const myApi = myServerApi();
    let security = await myApi.get(`security/${email}`)
    let twoFactor = security.data.data;
    setLoading(false);
    if (twoFactor !== null){
      if (twoFactor.status === 1 && twoFactor.request_wire === 1){
        setSecret_val(twoFactor.code_from_app);
        setModal({...modal, auth: true});
        return;
      } 
    }
    setLoading(true);
    let configdata = {
      exchange: "CONFIGURATOR_PLUSQO",
      username: CONFIGURATOR_USERNAME,
      password: CONFIGURATOR_PASSWORD
    }
    let headers = {
      "Content-Type" : "application/json",
    }
    axios.post("https://authentication.cryptosrvc.com/api/configurator_authentication/configuratorToken", configdata, { headers })
    .then(res => {
        let configurator_access_token = res.data.configurator_access_token;
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configurator_access_token}`,
        };
        let bodyData = {
          userId: user_id, 
          accountId: usditem.id, 
          type:5, 
          amount: -(formData.amount), 
          comment:"Wire Request", 
          currency:"USD"
        }
        let data = {...formData, status: "0"};
        let url = `https://config.plusqo.shiftmarketsdev.com/api/users/${bodyData.userId}/accounts/${usditem.id}/balancecorrection`;
        let sellData = {
          papFlag: true,
          email: email,
          bodyData: bodyData,
          url: url,
          amount1: -(formData.amount),
          amount2: -(formData.amount),
          balance1: usditem.balance.active_balance,
          balance2: usditem.balance.active_balance,
          formData: data,
          fee: fees,
          receiveAmount: receiveAmount,
          headers: headers
        }
        myApi.put("sell", sellData)
        .then(result => {
          setWireId(result.data.wireid);
          toast.success("Successfully requested wire");
          setLoading(false); 
          setWireFinish(1);
          
        }).catch( e => {
          setWireId(null);
          setLoading(false); 
          setWireFinish(2);
        })
    })
    .catch(e => {
      setWireFinish(2);
      
    })
  };
  const confirmWire = async () => {
    if(loadingConfirm)
        return;
    let flag = "False";
    const options = {
      method: 'GET',
      url: 'https://google-authenticator.p.rapidapi.com/validate/',
      params: {code: authCode, secret: secret_val},
      headers: {
        'X-RapidAPI-Host': 'google-authenticator.p.rapidapi.com',
        'X-RapidAPI-Key': RapidAPIKey
      }
    };
    let response = await axios.request(options);
    flag =  response.data
    if (flag === "False")
    {
      toast.warn(t('code_error'));
      return;
    }
    setModal({...modal, auth : false});
    setLoadingConfirm(true);
      let configdata = {
        exchange: "CONFIGURATOR_PLUSQO",
        username: CONFIGURATOR_USERNAME,
        password: CONFIGURATOR_PASSWORD
      }
      let headers = {
        "Content-Type" : "application/json",
      }
      axios.post("https://authentication.cryptosrvc.com/api/configurator_authentication/configuratorToken", configdata, { headers })
      .then(res => {
          let configurator_access_token = res.data.configurator_access_token;
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${configurator_access_token}`,
          };
          let bodyData = {
            userId: user_id, 
            accountId: usditem.id, 
            type:5, 
            amount: -(formData.amount), 
            comment:"Wire Request", 
            currency:"USD"
          }
          let data = {...formData, status: "0"};
          let url = `https://config.plusqo.shiftmarketsdev.com/api/users/${bodyData.userId}/accounts/${usditem.id}/balancecorrection`;
          let sellData = {
            papFlag: true,
            email: email,
            bodyData: bodyData,
            url: url,
            amount1: -(formData.amount),
            amount2: -(formData.amount),
            balance1: usditem.balance.active_balance,
            balance2: usditem.balance.active_balance,
            formData: data,
            headers: headers
          }
          myApi.put("sell", sellData)
          .then(result => {
            setWireId(result.data.wireid);
            toast.success("'Successfully requested wire");
            setLoadingConfirm(false); 
            setWireFinish(1);
            
          }).catch( e => {
            setWireId(null);
            setLoadingConfirm(false); 
            setWireFinish(2);
          })
      })
      .catch(e => {
        setWireFinish(2);
        
      })
  };
  useEffect(() => {
      dispatch(setChecking(true))
      myApi.get(`profile/${email}`).then(res => {
        let user = res.data.data;
        if(user !== "")
        {  
          let userdata = {
            // individual relative state
            firstname: user.firstname,
            lastname: user.lastname,
            birthday: (user.issue_date !== "" && user.issue_date !== null) ? parseISO(user.birthday) : new Date(),
            issue_date: (user.issue_date !== "" && user.issue_date !== null) ? parseISO(user.issue_date) : new Date(),
            exp_date: (user.exp_date !== "" && user.exp_date !== null) ? parseISO(user.exp_date) : new Date(),
            issue_country: user.issue_country,
            // title : user.title,
            gener : user.gener,
            // marriage: user.marriage,
            // occupation: user.occupation,
            address: user.address,
            // id_cardtype: "",
            id_number: user.id_number,
            // id_issuer: user.id_issuer,
            city: user.city,
            country: user.country,
            prefecture: user.prefecture,
            postal_code: user.postal_code,
            cellphone_number: user.cellphone_number,
            country_code: user.country_code,
        
            // corporate relative state
            company_name: user.company_name,
            director_name: user.director_name,
            company_address: user.company_address,
            company_city: user.company_city,
            company_prefecture: user.company_prefecture,
            company_postal_code: user.company_postal_code,
            company_country_code: user.company_country_code,
            company_cellphone_number: user.company_cellphone_number,
          };
          dispatch(setCurrentUser(userdata));
          if (user.verification_status !== "2" || user === null) {
            if (user.verification_status === "1") {
              toast.warn(t('verify_profile_desc'));
              history.push("user-profile-verification");
            } else {
              toast.warn(t('complete_profile_desc'));
              history.push("user-profile-regular");
            }
          }
        } else{
          toast.warn(t('complete_profile_desc'));
          history.push("user-profile-regular");
        }
        dispatch(setChecking(false))

      })
      .catch(err => {
        console.log('error: ', err);
        dispatch(setChecking(false))
        toast.warn(t('complete_profile_desc'));
        history.push("user-profile-regular");
      });
      
  }, []);
  useEffect(() => {
    // dispatch(setChecking(true))
    let accouts_arr = Object.keys(accounts).map((key) => [Number(key), accounts[key]]);
    for (const key in accouts_arr) {
          let item = accouts_arr[key];
          item = item[1]
          if (item.product === "USD") {
            setUsditem(item);
            let availableBalance = 0;

            // if (item.balance.active_balance <= 50000) {
            //   availableBalance = (item.balance.active_balance * 0.92);
              
            // } else {
            //   availableBalance = (item.balance.active_balance * 0.93);
              
            // }
            if (availableBalance < 0) {
              availableBalance = 0;
            } else {
               availableBalance = item.balance.active_balance
            }
            setAvailableAmount(availableBalance);
            // dispatch(setChecking(false))
          }
    }
  }, [accounts])
  useEffect(() => {
    if (formData.amount === undefined) {
        setFormData({...formData, amount: 0});
        setFees("0");
      }
    else{

      if (formData.amount <= 50000) {
        setFees(parseFloat(formData.amount * 0.08));
        
      } else {
        if (formData.amount <= 150000) {
            setFees(parseFloat(formData.amount * 0.07));
          
        } else {
            setFees(parseFloat(formData.amount * 0.06));
        }
      }
    }
      
  }, [formData.amount])

  useEffect(() => {
    let receive_amount = Number(formData.amount) - Number(fees);
    if (receive_amount < 0) {
        receive_amount = 0;
    }
    setReceiveAmount(receive_amount);
  }, [fees])
  
  // for bank template
  const [data, setData] = useState([]);
  const [originData, setOriginData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [modalData, setModalData] = useState({
    template_name: "",
    beneficiary_name: "",
    bank_name: "",
    bank_account_number: "",
    bank_country: "",
    swift_bic_code: "",
    reference_code: "",
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [files, setFiles] = useState([]);
  const [saveTemplate, setSaveTemplate] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [errorsMsg, setErrorsMsg] = useState({
    update_template_name: {status: false, message: t('required')},
    add_template_name: {status: false, message: t('required')},
  })
 

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };


  const onUseTemplateFormSubmit = () => {
    if (loading)
    return;
    let newData = data;
    let index = newData.findIndex((item) => item.check === true);
    if (index === -1 ) {
      toast.warn(t('select_template'));
      return;
    }
    setErrorsStr({...errorsStr, beneficiary_name: {status: false}, bank_name: {status: false},bankaccount_number: {status: false},bank_country: {status: false},swift_code: {status: false}});
    setFormData({
      ...formData,
      beneficiary_name: newData[index].beneficiary_name,
      bank_name: newData[index].bank_name,
      bankaccount_number: newData[index].bank_account_number,
      bank_country: newData[index].bank_country,
      swift_code: newData[index].swift_bic_code,
      reference_code: newData[index].reference_code,
    })
    setModal({ useTemplate: false });
    
  };
  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setModalData({
      template_name: "",
      beneficiary_name: "",
      bank_name: "",
      bank_account_number: "",
      bank_country: "",
      swift_bic_code: "",
      reference_code: "",
    });

  };

  const onFormSubmit = (form) => {
    if (modalData.template_name === ""){
      setErrorsMsg({...errorsMsg, add_template_name: {status: true, message: t('required')}})
      return;
    }
    let indexOfName = data.findIndex((item) => item.template_name === modalData.template_name);
    if (indexOfName >= 0 && editId !== data[indexOfName].id){
      setErrorsMsg({...errorsMsg, add_template_name: {status: true, message: t('template_exist')}})
      return;
    }
    let submittedData = {
      template_name: modalData.template_name,
      beneficiary_name: modalData.beneficiary_name,
      bank_name: modalData.bank_name,
      bank_account_number: modalData.bank_account_number,
      bank_country: modalData.bank_country,
      swift_bic_code: modalData.swift_bic_code,
      reference_code: modalData.reference_code,
    };
    const myApi = myServerApi();
    myApi.post(`/bank_template/${email}`, submittedData).then(res => {
        console.log("result", res)
        submittedData.id = res.data.id;
        setData([submittedData, ...data]);
        setOriginData([submittedData, ...data]);
    }).catch(err => {
        console.log('error: ', err);
    });
    setView({ open: false });
    // resetForm();
  };

  const onEditSubmit = () => {
    if (modalData.template_name === ""){
      setErrorsMsg({...errorsMsg, update_template_name: {status: true, message: t('required')}})
      return;
    }
    let indexOfName = data.findIndex((item) => item.template_name === modalData.template_name);
    if (indexOfName >= 0 && editId !== data[indexOfName].id){
      setErrorsMsg({...errorsMsg, update_template_name: {status: true, message: t('template_exist')}})
      return;
    }

    let submittedData;
    let newItems = data;
    let index = newItems.findIndex((item) => item.id === editId);

    newItems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          ...item,
          template_name: modalData.template_name,
          beneficiary_name: modalData.beneficiary_name,
          bank_name: modalData.bank_name,
          bank_account_number: modalData.bank_account_number,
          bank_country: modalData.bank_country,
          swift_bic_code: modalData.swift_bic_code,
          reference_code: modalData.reference_code,
        };
      }
    });
    newItems[index] = submittedData;
    setData(newItems);
    resetForm();
    setView({ edit: false, add: false });

    const myApi = myServerApi();
    myApi.post(`/bank_template/${email}`, submittedData).then(res => {
        console.log("result", res)
    }).catch(err => {
        console.log('error: ', err);
    });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setModalData({
          template_name: item.template_name,
          beneficiary_name: item.beneficiary_name,
          bank_name: item.bank_name,
          bank_account_number: item.bank_account_number,
          bank_country: item.bank_country,
          swift_bic_code: item.swift_bic_code,
          reference_code: item.reference_code,
        });
      }
    });
    setEditedId(id);
    setFiles([]);
    setView({ add: false, edit: true });
  };

  // selects one product
  const onSelectChange = (e, id) => {
    let newData = data;
    newData.forEach((item) => {
      if (item.id === id) {
        item.check = e.currentTarget.checked;
      }
      else {
        item.check = false;
      }
    });
    setData([...newData]);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to delete a product
  const deleteTemplate = (id) => {
    let defaultData = data;
    defaultData = defaultData.filter((item) => item.id !== id);
    setData([...defaultData]);
    defaultData = originData;
    defaultData = defaultData.filter((item) => item.id !== id);
    setOriginData([...defaultData]);
    setModal({...modal, template_remove_confirm: false});
    const myApi = myServerApi();
    myApi.delete(`/bank_template/${id}`).then(res => {
        console.log("result", res)
    }).catch(err => {
        console.log('error: ', err);
    });
  };

  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };


  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    const myApi = myServerApi();
    myApi.get(`/bank_template/${email}`).then(res => {
      if (res) {
        let bankTemplates = res.data.data;
        bankTemplates = bankTemplates.sort((a, b) => {
          return a.created_at < b.created_at? 1 : -1
        })
        setData(bankTemplates);
        setOriginData(bankTemplates);
      }
    }).catch(err => {
        console.log('error: ', err);
    });
  }, [])
   // Changing state value when searching name
   useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = originData.filter((item) => {
        return item.template_name.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...originData]);
    }
  }, [onSearchText]);
  return (
    <React.Fragment>
      <Head title={t('request_wire')}></Head>
      <Content>
        <BlockHead size="lg">
            <BlockHeadContent className="text-center">
              <BlockTitle tag="h4" className="">{t('wire_withdrawal')}</BlockTitle>
            </BlockHeadContent>
        </BlockHead>

        <Block>
          <PreviewCard className="card-bordered container " style={{width: "80%"}}>
            <div className="" style={{fontSize: "14px"}}>
              {t('request_desc1')}
              <p className="mt-3"> <Badge className="badge-dot" color="Dark"> </Badge>{t('request_desc2')}</p>
              <p><Badge className="badge-dot" color="Dark"> </Badge>{t('request_desc3')}</p>
              {/* <p><Badge className="badge-dot" color="Dark"> </Badge>All outgoing USD wires must include a US based intermediary bank in order for the wires to be completed.</p> */}
            </div>
            </PreviewCard>
        </Block>
        <Block>
          <div className="nk-data data-list container">
            <FormGroup>
              <Button color="success" size="md" className="" onClick={() => setModal({...modal, useTemplate : true})}>
                    {t('use_template')}
              </Button>
            </FormGroup>
            <Form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
              <Row className="gy-4">
                  <Col md="12">
                    <FormGroup>
                      <Label className="form-label">
                        {t('beneficiary_name')} *
                      </Label>
                      <div className="form-control-wrap">
                          <input className="form-control " value={formData.beneficiary_name} 
                          onChange = { e => {
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                            setFormData({...formData, beneficiary_name: e.target.value}); 
                            if (e.target.value === "")  
                            setErrorsStr({
                              ...errorsStr, beneficiary_name: {message: t('required'), status:true }
                            });
                            else {
                              setErrorsStr({...errorsStr, beneficiary_name: {status:false}})
                            }
                          } else 
                            setErrorsStr({
                              ...errorsStr, beneficiary_name: {status:true, message: t('unavailable_character_error')}
                            })
                          }
                          }
                          name="beneficiary_name"  placeholder={t('placeholder_beneficiary_name')} />
                          {errorsStr.beneficiary_name.status && <span className="invalid">{errorsStr.beneficiary_name.message}</span>}
                      </div>
                      <Label style={{fontSize: "14px"}}>{t('bank_name_desc')}</Label>
                    </FormGroup>
                    {/* <FormGroup>
                      <Label className="form-label">
                        ACCOUNT TYPE *
                      </Label>
                      <div className="form-control-wrap">
                        <RSelect options={profileOptions.account_type} 
                        value={{value: formData.account_type, label: formData.account_type}}
                        onChange = {e => setFormData({...formData, account_type: e.value})}
                        ref={register({required: "This field is required" , validate: (value) => value !== "" || `Please select a account type` })} 
                        name="account_type" placeholder="Please select the account type" className="form-control-outlined"/>
                        {errors.account_type && <span className="invalid">{errors.account_type.message}</span>}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label">
                        BENEFICIARY COUNTRY *
                      </Label>
                          <div className="form-control-wrap">
                              <select id="beneficiary_country" name="beneficiary_country" className="form-control"
                                placeholder="Please select the beneficiary country"
                                ref={register({ required: "This field is required", validate: (value) => value !== "noselect" || `Please select a beneficiary country` })}
                              >
                                  <option value="noselect" >Select a beneficiary country</option>
                                  <option value="United States">United States</option>
                                  <option value="Afghanistan">Afghanistan</option>
                                  <option value="Albania">Albania</option>
                                  <option value="Algeria">Algeria</option>
                                  <option value="Andorra">Andorra</option>
                                  <option value="Angola">Angola</option>
                                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                  <option value="Argentina">Argentina</option>
                                  <option value="Armenia">Armenia</option>
                                  <option value="Australia">Australia</option>
                                  <option value="Austria">Austria</option>
                                  <option value="Azerbaijan">Azerbaijan</option>
                                  <option value="Bahamas">Bahamas</option>
                                  <option value="Bahrain">Bahrain</option>
                                  <option value="Bangladesh">Bangladesh</option>
                                  <option value="Barbados">Barbados</option>
                                  <option value="Belarus">Belarus</option>
                                  <option value="Belgium">Belgium</option>
                                  <option value="Belize">Belize</option>
                                  <option value="Benin">Benin</option>
                                  <option value="Bhutan">Bhutan</option>
                                  <option value="Bolivia">Bolivia</option>
                                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                  <option value="Botswana">Botswana</option>
                                  <option value="Brazil">Brazil</option>
                                  <option value="Brunei">Brunei</option>
                                  <option value="Bulgaria">Bulgaria</option>
                                  <option value="Burkina Faso">Burkina Faso</option>
                                  <option value="Burundi">Burundi</option>
                                  <option value="Cabo Verde">Cabo Verde</option>
                                  <option value="Cambodia">Cambodia</option>
                                  <option value="Cameroon">Cameroon</option>
                                  <option value="Canada">Canada</option>
                                  <option value="Central African Republic">Central African Republic</option>
                                  <option value="Chad">Chad</option>
                                  <option value="Chile">Chile</option>
                                  <option value="China">China</option>
                                  <option value="Colombia">Colombia</option>
                                  <option value="Comoros">Comoros</option>
                                  <option value="Congo">Congo</option>
                                  <option value="Costa Rica">Costa Rica</option>
                                  <option value="Cote d'Ivoire">Cote d'Ivoire</option>
                                  <option value="Croatia">Croatia</option>
                                  <option value="Cuba">Cuba</option>
                                  <option value="Cyprus">Cyprus</option>
                                  <option value="Czech Republic">Czech Republic</option>
                                  <option value="Denmark">Denmark</option>
                                  <option value="Djibouti">Djibouti</option>
                                  <option value="Dominica">Dominica</option>
                                  <option value="Dominican Republic">Dominican Republic</option>
                                  <option value="East Timor">East Timor</option>
                                  <option value="Ecuador">Ecuador</option>
                                  <option value="Egypt">Egypt</option>
                                  <option value="El Salvador">El Salvador</option>
                                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                                  <option value="Eritrea">Eritrea</option>
                                  <option value="Estonia">Estonia</option>
                                  <option value="Fiji">Fiji</option>
                                  <option value="Finland">Finland</option>
                                  <option value="France">France</option>
                                  <option value="Gabon">Gabon</option>
                                  <option value="Gambia">Gambia</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Germany">Germany</option>
                                  <option value="Ghana">Ghana</option>
                                  <option value="Greece">Greece</option>
                                  <option value="Grenada">Grenada</option>
                                  <option value="Guatemala">Guatemala</option>
                                  <option value="Guinea">Guinea</option>
                                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                                  <option value="Guyana">Guyana</option>
                                  <option value="Haiti">Haiti</option>
                                  <option value="Honduras">Honduras</option>
                                  <option value="Hungary">Hungary</option>
                                  <option value="Iceland">Iceland</option>
                                  <option value="India">India</option>
                                  <option value="Indonesia">Indonesia</option>
                                  <option value="Iraq">Iraq</option>
                                  <option value="Ireland">Ireland</option>
                                  <option value="Israel">Israel</option>
                                  <option value="Italy">Italy</option>
                                  <option value="Jamaica">Jamaica</option>
                                  <option value="Japan">Japan</option>
                                  <option value="Jordan">Jordan</option>
                                  <option value="Kazakhstan">Kazakhstan</option>
                                  <option value="Kenya">Kenya</option>
                                  <option value="Kiribati">Kiribati</option>
                                  <option value="South Korea">South Korea </option>
                                  <option value="Kosovo">Kosovo</option>
                                  <option value="Kuwait">Kuwait</option>
                                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                                  <option value="Laos">Laos</option>
                                  <option value="Latvia">Latvia</option>
                                  <option value="Lebanon">Lebanon</option>
                                  <option value="Lesotho">Lesotho</option>
                                  <option value="Liberia">Liberia</option>
                                  <option value="Libya">Libya</option>
                                  <option value="Liechtenstein">Liechtenstein</option>
                                  <option value="Lithuania">Lithuania</option>
                                  <option value="Luxembourg">Luxembourg</option>
                                  <option value="Macedonia">Macedonia</option>
                                  <option value="Madagascar">Madagascar</option>
                                  <option value="Malawi">Malawi</option>
                                  <option value="Malaysia">Malaysia</option>
                                  <option value="Maldives">Maldives</option>
                                  <option value="Mali">Mali</option>
                                  <option value="Malta">Malta</option>
                                  <option value="Marshall Islands">Marshall Islands</option>
                                  <option value="Mauritania">Mauritania</option>
                                  <option value="Mauritius">Mauritius</option>
                                  <option value="Mexico">Mexico</option>
                                  <option value="Federated States of Micronesia">Federated States of Micronesia</option>
                                  <option value="Moldova">Moldova</option>
                                  <option value="Monaco">Monaco</option>
                                  <option value="Mongolia">Mongolia</option>
                                  <option value="Montenegro">Montenegro</option>
                                  <option value="Morocco">Morocco</option>
                                  <option value="Mozambique">Mozambique</option>
                                  <option value="Myanmar">Myanmar</option>
                                  <option value="Namibia">Namibia</option>
                                  <option value="Nauru">Nauru</option>
                                  <option value="Nepal">Nepal</option>
                                  <option value="Netherlands">Netherlands</option>
                                  <option value="New Zealand">New Zealand</option>
                                  <option value="Nicaragua">Nicaragua</option>
                                  <option value="Niger">Niger</option>
                                  <option value="Nigeria">Nigeria</option>
                                  <option value="Norway">Norway</option>
                                  <option value="Oman">Oman</option>
                                  <option value="Palau">Palau</option>
                                  <option value="Panama">Panama</option>
                                  <option value="Papua New Guinea">Papua New Guinea</option>
                                  <option value="Paraguay">Paraguay</option>
                                  <option value="Peru">Peru</option>
                                  <option value="Philippines">Philippines</option>
                                  <option value="Poland">Poland</option>
                                  <option value="Portugal">Portugal</option>
                                  <option value="Qatar">Qatar</option>
                                  <option value="Romania">Romania</option>
                                  <option value="Russia">Russia</option>
                                  <option value="Rwanda">Rwanda</option>
                                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                  <option value="Saint Lucia">Saint Lucia</option>
                                  <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                                  <option value="Samoa">Samoa</option>
                                  <option value="San Marino">San Marino</option>
                                  <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                  <option value="Saudi Arabia">Saudi Arabia</option>
                                  <option value="Senegal">Senegal</option>
                                  <option value="Seychelles">Seychelles</option>
                                  <option value="Sierra Leone">Sierra Leone</option>
                                  <option value="Singapore">Singapore</option>
                                  <option value="Slovakia">Slovakia</option>
                                  <option value="Slovenia">Slovenia</option>
                                  <option value="Solomon Islands">Solomon Islands</option>
                                  <option value="Somalia">Somalia</option>
                                  <option value="South Africa">South Africa</option>
                                  <option value="Spain">Spain</option>
                                  <option value="Sudan">Sudan</option>
                                  <option value="South Sudan">South Sudan</option>
                                  <option value="Suriname">Suriname</option>
                                  <option value="Swaziland">Swaziland</option>
                                  <option value="Sweden">Sweden</option>
                                  <option value="Switzerland">Switzerland</option>
                                  <option value="Taiwan">Taiwan</option>
                                  <option value="Tajikistan">Tajikistan</option>
                                  <option value="Tanzania">Tanzania</option>
                                  <option value="Thailand">Thailand</option>
                                  <option value="Togo">Togo</option>
                                  <option value="Tonga">Tonga</option>
                                  <option value="Turkey">Turkey</option>
                                  <option value="Turkmenistan">Turkmenistan</option>
                                  <option value="Tuvalu">Tuvalu</option>
                                  <option value="Uganda">Uganda</option>
                                  <option value="Ukraine">Ukraine</option>
                                  <option value="United Arab Emirates">United Arab Emirates</option>
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Uruguay">Uruguay</option>
                                  <option value="Uzbekistan">Uzbekistan</option>
                                  <option value="Vanuatu">Vanuatu</option>
                                  <option value="Vatican City">Vatican City</option>
                                  <option value="Venezela">Venezuela</option>
                                  <option value="Vietnam">Vietnam</option>
                                  <option value="Zambia">Zambia</option>
                            </select>
                            {errors.beneficiary_country && <span className="invalid">{errors.beneficiary_country.message}</span>}
                          </div>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                        BENEFICIARY ADDRESS *
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control "   
                        value={formData.beneficiary_street} 
                        onChange = { e => {
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                            setFormData({...formData, beneficiary_street: e.target.value}); 
                            if (e.target.value === "")  
                            setErrorsStr({
                              ...errorsStr, beneficiary_street: {message: "This field is required", status:true }
                            });
                            else {
                            setErrorsStr({...errorsStr, beneficiary_street: {status:false}})
                            }
                          } else 
                          setErrorsStr({
                              ...errorsStr, beneficiary_street: {status:true, message: t('unavailable_character_error')}
                            })
                          }
                          }
                        name="beneficiary_street"  placeholder="Enter beneficiary address" />
                      {errorsStr.beneficiary_street.status && <span className="invalid">{errorsStr.beneficiary_street.message}</span>}
                      </div>
                    </FormGroup>
          
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                      BENEFICIARY POSTAL CODE *
                      </Label>
                      <div className="form-control-wrap">
                          <input className="form-control "  
                            value={formData.beneficiary_postal_code} 
                            onChange = { e => {
                              if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                                setFormData({...formData, beneficiary_postal_code: e.target.value}); 
                                if (e.target.value === "")  
                                setErrorsStr({
                                  ...errorsStr, beneficiary_postal_code: {message: "This field is required", status:true }
                                });
                                else {
                                setErrorsStr({...errorsStr, beneficiary_postal_code: {status:false}})
                                }
                              } else 
                              setErrorsStr({
                                  ...errorsStr, beneficiary_postal_code: {status:true, message: t('unavailable_character_error')}
                                })
                              }
                              }
                          name="beneficiary_postal_code"  placeholder="Enter beneficiary postal code"  />
                          {errorsStr.beneficiary_postal_code.status && <span className="invalid">{errorsStr.beneficiary_postal_code.message}</span>}
                      </div>
                    </FormGroup> */}
                    <FormGroup>
                      <Label className="form-label">
                      {t('bank_name')} *
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control " 
                            value={formData.bank_name} 
                            onChange = { e => {
                              if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                                setFormData({...formData, bank_name: e.target.value}); 
                                if (e.target.value === "")  
                                setErrorsStr({
                                  ...errorsStr, bank_name: {message: "This field is required", status:true }
                                });
                                else {
                                setErrorsStr({...errorsStr, bank_name: {status:false}})
                                }
                              } else 
                              setErrorsStr({
                                  ...errorsStr, bank_name: {status:true, message: t('unavailable_character_error')}
                                })
                              }
                              }
                        name="bank_name"  placeholder={t('placeholder_bank_name')} />
                      {errorsStr.bank_name.status && <span className="invalid">{errorsStr.bank_name.message}</span>}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                      {t('bank_number')} *
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control " 
                          value={formData.bankaccount_number} 
                          onChange = { e => {
                            if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                              setFormData({...formData, bankaccount_number: e.target.value}); 
                              if (e.target.value === "")  
                              setErrorsStr({
                                ...errorsStr, bankaccount_number: {message: t('required'), status:true }
                              });
                              else {
                              setErrorsStr({...errorsStr, bankaccount_number: {status:false}})
                              }
                            } else 
                            setErrorsStr({
                                ...errorsStr, bankaccount_number: {status:true, message: t('unavailable_character_error')}
                              })
                            }
                            }
                        name="bankaccount_number"  placeholder={t('placeholder_bank_number')}  />
                        {errorsStr.bankaccount_number.status && <span className="invalid">{errorsStr.bankaccount_number.message}</span>}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label">
                      {t('bank_country')} *
                      </Label>
                          <div className="form-control-wrap">
                              <select id="bank_country" name="bank_country" value={formData.bank_country} className="form-control"
                                onChange = { e => {
                                    setFormData({...formData, bank_country: e.target.value}); 
                                    if (e.target.value === "noselect")  
                                      setErrorsStr({
                                        ...errorsStr, bank_country: {message: t('required'), status: true }
                                      });
                                    else {
                                      setErrorsStr({...errorsStr, bank_country: {status:false}})
                                    }
                                  }
                                }
                              >
                                  <option value="noselect" > {t('select_country')}</option>
                                  <option value="United States">United States</option>
                                  <option value="Afghanistan">Afghanistan</option>
                                  <option value="Albania">Albania</option>
                                  <option value="Algeria">Algeria</option>
                                  <option value="Andorra">Andorra</option>
                                  <option value="Angola">Angola</option>
                                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                  <option value="Argentina">Argentina</option>
                                  <option value="Armenia">Armenia</option>
                                  <option value="Australia">Australia</option>
                                  <option value="Austria">Austria</option>
                                  <option value="Azerbaijan">Azerbaijan</option>
                                  <option value="Bahamas">Bahamas</option>
                                  <option value="Bahrain">Bahrain</option>
                                  <option value="Bangladesh">Bangladesh</option>
                                  <option value="Barbados">Barbados</option>
                                  <option value="Belarus">Belarus</option>
                                  <option value="Belgium">Belgium</option>
                                  <option value="Belize">Belize</option>
                                  <option value="Benin">Benin</option>
                                  <option value="Bhutan">Bhutan</option>
                                  <option value="Bolivia">Bolivia</option>
                                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                  <option value="Botswana">Botswana</option>
                                  <option value="Brazil">Brazil</option>
                                  <option value="Brunei">Brunei</option>
                                  <option value="Bulgaria">Bulgaria</option>
                                  <option value="Burkina Faso">Burkina Faso</option>
                                  <option value="Burundi">Burundi</option>
                                  <option value="Cabo Verde">Cabo Verde</option>
                                  <option value="Cambodia">Cambodia</option>
                                  <option value="Cameroon">Cameroon</option>
                                  <option value="Canada">Canada</option>
                                  <option value="Central African Republic">Central African Republic</option>
                                  <option value="Chad">Chad</option>
                                  <option value="Chile">Chile</option>
                                  <option value="China">China</option>
                                  <option value="Colombia">Colombia</option>
                                  <option value="Comoros">Comoros</option>
                                  <option value="Congo">Congo</option>
                                  <option value="Costa Rica">Costa Rica</option>
                                  <option value="Cote d'Ivoire">Cote d'Ivoire</option>
                                  <option value="Croatia">Croatia</option>
                                  <option value="Cuba">Cuba</option>
                                  <option value="Cyprus">Cyprus</option>
                                  <option value="Czech Republic">Czech Republic</option>
                                  <option value="Denmark">Denmark</option>
                                  <option value="Djibouti">Djibouti</option>
                                  <option value="Dominica">Dominica</option>
                                  <option value="Dominican Republic">Dominican Republic</option>
                                  <option value="East Timor">East Timor</option>
                                  <option value="Ecuador">Ecuador</option>
                                  <option value="Egypt">Egypt</option>
                                  <option value="El Salvador">El Salvador</option>
                                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                                  <option value="Eritrea">Eritrea</option>
                                  <option value="Estonia">Estonia</option>
                                  <option value="Fiji">Fiji</option>
                                  <option value="Finland">Finland</option>
                                  <option value="France">France</option>
                                  <option value="Gabon">Gabon</option>
                                  <option value="Gambia">Gambia</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Germany">Germany</option>
                                  <option value="Ghana">Ghana</option>
                                  <option value="Greece">Greece</option>
                                  <option value="Grenada">Grenada</option>
                                  <option value="Guatemala">Guatemala</option>
                                  <option value="Guinea">Guinea</option>
                                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                                  <option value="Guyana">Guyana</option>
                                  <option value="Haiti">Haiti</option>
                                  <option value="Honduras">Honduras</option>
                                  <option value="Hungary">Hungary</option>
                                  <option value="Iceland">Iceland</option>
                                  <option value="India">India</option>
                                  <option value="Indonesia">Indonesia</option>
                                  <option value="Iraq">Iraq</option>
                                  <option value="Ireland">Ireland</option>
                                  <option value="Israel">Israel</option>
                                  <option value="Italy">Italy</option>
                                  <option value="Jamaica">Jamaica</option>
                                  <option value="Japan">Japan</option>
                                  <option value="Jordan">Jordan</option>
                                  <option value="Kazakhstan">Kazakhstan</option>
                                  <option value="Kenya">Kenya</option>
                                  <option value="Kiribati">Kiribati</option>
                                  <option value="South Korea">South Korea </option>
                                  <option value="Kosovo">Kosovo</option>
                                  <option value="Kuwait">Kuwait</option>
                                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                                  <option value="Laos">Laos</option>
                                  <option value="Latvia">Latvia</option>
                                  <option value="Lebanon">Lebanon</option>
                                  <option value="Lesotho">Lesotho</option>
                                  <option value="Liberia">Liberia</option>
                                  <option value="Libya">Libya</option>
                                  <option value="Liechtenstein">Liechtenstein</option>
                                  <option value="Lithuania">Lithuania</option>
                                  <option value="Luxembourg">Luxembourg</option>
                                  <option value="Macedonia">Macedonia</option>
                                  <option value="Madagascar">Madagascar</option>
                                  <option value="Malawi">Malawi</option>
                                  <option value="Malaysia">Malaysia</option>
                                  <option value="Maldives">Maldives</option>
                                  <option value="Mali">Mali</option>
                                  <option value="Malta">Malta</option>
                                  <option value="Marshall Islands">Marshall Islands</option>
                                  <option value="Mauritania">Mauritania</option>
                                  <option value="Mauritius">Mauritius</option>
                                  <option value="Mexico">Mexico</option>
                                  <option value="Federated States of Micronesia">Federated States of Micronesia</option>
                                  <option value="Moldova">Moldova</option>
                                  <option value="Monaco">Monaco</option>
                                  <option value="Mongolia">Mongolia</option>
                                  <option value="Montenegro">Montenegro</option>
                                  <option value="Morocco">Morocco</option>
                                  <option value="Mozambique">Mozambique</option>
                                  <option value="Myanmar">Myanmar</option>
                                  <option value="Namibia">Namibia</option>
                                  <option value="Nauru">Nauru</option>
                                  <option value="Nepal">Nepal</option>
                                  <option value="Netherlands">Netherlands</option>
                                  <option value="New Zealand">New Zealand</option>
                                  <option value="Nicaragua">Nicaragua</option>
                                  <option value="Niger">Niger</option>
                                  <option value="Nigeria">Nigeria</option>
                                  <option value="Norway">Norway</option>
                                  <option value="Oman">Oman</option>
                                  <option value="Palau">Palau</option>
                                  <option value="Panama">Panama</option>
                                  <option value="Papua New Guinea">Papua New Guinea</option>
                                  <option value="Paraguay">Paraguay</option>
                                  <option value="Peru">Peru</option>
                                  <option value="Philippines">Philippines</option>
                                  <option value="Poland">Poland</option>
                                  <option value="Portugal">Portugal</option>
                                  <option value="Qatar">Qatar</option>
                                  <option value="Romania">Romania</option>
                                  <option value="Russia">Russia</option>
                                  <option value="Rwanda">Rwanda</option>
                                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                  <option value="Saint Lucia">Saint Lucia</option>
                                  <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                                  <option value="Samoa">Samoa</option>
                                  <option value="San Marino">San Marino</option>
                                  <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                  <option value="Saudi Arabia">Saudi Arabia</option>
                                  <option value="Senegal">Senegal</option>
                                  <option value="Seychelles">Seychelles</option>
                                  <option value="Sierra Leone">Sierra Leone</option>
                                  <option value="Singapore">Singapore</option>
                                  <option value="Slovakia">Slovakia</option>
                                  <option value="Slovenia">Slovenia</option>
                                  <option value="Solomon Islands">Solomon Islands</option>
                                  <option value="Somalia">Somalia</option>
                                  <option value="South Africa">South Africa</option>
                                  <option value="Spain">Spain</option>
                                  <option value="Sudan">Sudan</option>
                                  <option value="South Sudan">South Sudan</option>
                                  <option value="Suriname">Suriname</option>
                                  <option value="Swaziland">Swaziland</option>
                                  <option value="Sweden">Sweden</option>
                                  <option value="Switzerland">Switzerland</option>
                                  <option value="Taiwan">Taiwan</option>
                                  <option value="Tajikistan">Tajikistan</option>
                                  <option value="Tanzania">Tanzania</option>
                                  <option value="Thailand">Thailand</option>
                                  <option value="Togo">Togo</option>
                                  <option value="Tonga">Tonga</option>
                                  <option value="Turkey">Turkey</option>
                                  <option value="Turkmenistan">Turkmenistan</option>
                                  <option value="Tuvalu">Tuvalu</option>
                                  <option value="Uganda">Uganda</option>
                                  <option value="Ukraine">Ukraine</option>
                                  <option value="United Arab Emirates">United Arab Emirates</option>
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Uruguay">Uruguay</option>
                                  <option value="Uzbekistan">Uzbekistan</option>
                                  <option value="Vanuatu">Vanuatu</option>
                                  <option value="Vatican City">Vatican City</option>
                                  <option value="Venezela">Venezuela</option>
                                  <option value="Vietnam">Vietnam</option>
                                  <option value="Zambia">Zambia</option>
                            </select>
                            {errorsStr.bank_country.status && <span className="invalid">{errorsStr.bank_country.message}</span>}
                          </div>
                    </FormGroup>
                    {/* <FormGroup >
                      <Label className="form-label">
                        BANK ADDRESS *
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control "
                        value={formData.bankstreet_address} 
                        onChange = { e => {
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                            setFormData({...formData, bankstreet_address: e.target.value}); 
                            if (e.target.value === "")  
                            setErrorsStr({
                              ...errorsStr, bankstreet_address: {message: "This field is required", status:true }
                            });
                            else {
                            setErrorsStr({...errorsStr, bankstreet_address: {status:false}})
                            }
                          } else 
                          setErrorsStr({
                              ...errorsStr, bankstreet_address: {status:true, message: t('unavailable_character_error')}
                            })
                          }
                          }
                        name="bankstreet_address"  placeholder="Enter bank address" />
                      {errorsStr.bankstreet_address.status && <span className="invalid">{errorsStr.bankstreet_address.message}</span>}
                      </div>
                    </FormGroup>
                          
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                        BANK POSTAL CODE *
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control "  
                        value={formData.bankpostal_code} 
                        onChange = { e => {
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                            setFormData({...formData, bankpostal_code: e.target.value}); 
                            if (e.target.value === "")  
                            setErrorsStr({
                              ...errorsStr, bankpostal_code: {message: "This field is required", status:true }
                            });
                            else {
                            setErrorsStr({...errorsStr, bankpostal_code: {status:false}})
                            }
                          } else 
                          setErrorsStr({
                              ...errorsStr, bankpostal_code: {status:true, message: t('unavailable_character_error')}
                            })
                          }
                          }
                        
                        name="bankpostal_code"  placeholder="Enter bank postal code"   />
                      {errorsStr.bankpostal_code.status && <span className="invalid">{errorsStr.bankpostal_code.message}</span>}
                      </div>
                    </FormGroup> */}
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                        {t('swift_code')} *
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control "  
                        value={formData.swift_code} 
                        onChange = { e => {
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                            setFormData({...formData, swift_code: e.target.value}); 
                            if (e.target.value === "")  
                            setErrorsStr({
                              ...errorsStr, swift_code: {message: t('required'), status:true }
                            });
                            else {
                            setErrorsStr({...errorsStr, swift_code: {status:false}})
                            }
                          } else 
                          setErrorsStr({
                              ...errorsStr, swift_code: {status:true, message: t('unavailable_character_error')}
                            })
                          }
                          }
                        
                        name="swift_code" placeholder={t('placeholder_swift_code')} />
                        {errorsStr.swift_code.status && <span className="invalid">{errorsStr.swift_code.message}</span>}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                        {t('reference_code')}
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control " name="reference_code"
                        value={formData.reference_code} 
                        onChange = { e => {
                            if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                              setFormData({...formData, reference_code: e.target.value}); 
                              setErrorsStr({...errorsStr, reference_code: {status:false}})
                            } else 
                            setErrorsStr({
                                ...errorsStr, reference_code: {status:true, message: t('unavailable_character_error')}
                              })
                            }
                            }
                          placeholder={t('placeholder_reference_code')}  />
                          {errorsStr.reference_code.status && <span className="invalid">{errorsStr.reference_code.message}</span>}

                      </div>
                    </FormGroup>
                    {/* <FormGroup>
                      <Label className="form-label">
                        INTERMEDIARY BANK NAME *
                      </Label>
                      <div className="form-control-wrap">
                          <input className="form-control "  
                          value={formData.intermediarybank_name} 
                          onChange = { e => {
                            if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                              setFormData({...formData, intermediarybank_name: e.target.value}); 
                              if (e.target.value === "")  
                              setErrorsStr({
                                ...errorsStr, intermediarybank_name: {message: "This field is required", status:true }
                              });
                              else {
                              setErrorsStr({...errorsStr, intermediarybank_name: {status:false}})
                              }
                            } else 
                            setErrorsStr({
                                ...errorsStr, intermediarybank_name: {status:true, message: t('unavailable_character_error')}
                              })
                            }
                            }
                          name="intermediarybank_name"  placeholder="Enter intermediary bank name" />
                          {errorsStr.intermediarybank_name.status && <span className="invalid">{errorsStr.intermediarybank_name.message}</span>}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label">
                        INTERMEDIARY BANK ACCOUNT NUMBER/IBAN/ROUTING NUMBER *
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control " 
                        value={formData.intermediarybank_number} 
                        onChange = { e => {
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                            setFormData({...formData, intermediarybank_number: e.target.value}); 
                            if (e.target.value === "")  
                            setErrorsStr({
                              ...errorsStr, intermediarybank_number: {message: "This field is required", status:true }
                            });
                            else {
                            setErrorsStr({...errorsStr, intermediarybank_number: {status:false}})
                            }
                          } else 
                          setErrorsStr({
                              ...errorsStr, intermediarybank_number: {status:true, message: t('unavailable_character_error')}
                            })
                          }
                          }
                        
                        name="intermediarybank_number"  placeholder="Enter intermediary bank account number/iban/routing number" />
                        {errorsStr.intermediarybank_number.status && <span className="invalid">{errorsStr.intermediarybank_number.message}</span>}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label">
                            INTERMEDIARY BANK COUNTRY *
                      </Label>
                          <div className="form-control-wrap">
                              <select id="intermediarybank_country" name="intermediarybank_country" value={formData.intermediarybank_country} onChange={(e) => setFormData({...formData, intermediarybank_country: e.target.value})} className="form-control"
                                placeholder="Please select the intermediary bank country"
                                ref={register({ required: "This field is required", validate: (value) => value !== "noselect" || `Please select a intermediary bank country` })}
                              >
                                  <option value="noselect" >Select a intermediary bank country</option>
                                  <option value="United States">United States</option>
                                  <option value="Afghanistan">Afghanistan</option>
                                  <option value="Albania">Albania</option>
                                  <option value="Algeria">Algeria</option>
                                  <option value="Andorra">Andorra</option>
                                  <option value="Angola">Angola</option>
                                  <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                  <option value="Argentina">Argentina</option>
                                  <option value="Armenia">Armenia</option>
                                  <option value="Australia">Australia</option>
                                  <option value="Austria">Austria</option>
                                  <option value="Azerbaijan">Azerbaijan</option>
                                  <option value="Bahamas">Bahamas</option>
                                  <option value="Bahrain">Bahrain</option>
                                  <option value="Bangladesh">Bangladesh</option>
                                  <option value="Barbados">Barbados</option>
                                  <option value="Belarus">Belarus</option>
                                  <option value="Belgium">Belgium</option>
                                  <option value="Belize">Belize</option>
                                  <option value="Benin">Benin</option>
                                  <option value="Bhutan">Bhutan</option>
                                  <option value="Bolivia">Bolivia</option>
                                  <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                  <option value="Botswana">Botswana</option>
                                  <option value="Brazil">Brazil</option>
                                  <option value="Brunei">Brunei</option>
                                  <option value="Bulgaria">Bulgaria</option>
                                  <option value="Burkina Faso">Burkina Faso</option>
                                  <option value="Burundi">Burundi</option>
                                  <option value="Cabo Verde">Cabo Verde</option>
                                  <option value="Cambodia">Cambodia</option>
                                  <option value="Cameroon">Cameroon</option>
                                  <option value="Canada">Canada</option>
                                  <option value="Central African Republic">Central African Republic</option>
                                  <option value="Chad">Chad</option>
                                  <option value="Chile">Chile</option>
                                  <option value="China">China</option>
                                  <option value="Colombia">Colombia</option>
                                  <option value="Comoros">Comoros</option>
                                  <option value="Congo">Congo</option>
                                  <option value="Costa Rica">Costa Rica</option>
                                  <option value="Cote d'Ivoire">Cote d'Ivoire</option>
                                  <option value="Croatia">Croatia</option>
                                  <option value="Cuba">Cuba</option>
                                  <option value="Cyprus">Cyprus</option>
                                  <option value="Czech Republic">Czech Republic</option>
                                  <option value="Denmark">Denmark</option>
                                  <option value="Djibouti">Djibouti</option>
                                  <option value="Dominica">Dominica</option>
                                  <option value="Dominican Republic">Dominican Republic</option>
                                  <option value="East Timor">East Timor</option>
                                  <option value="Ecuador">Ecuador</option>
                                  <option value="Egypt">Egypt</option>
                                  <option value="El Salvador">El Salvador</option>
                                  <option value="Equatorial Guinea">Equatorial Guinea</option>
                                  <option value="Eritrea">Eritrea</option>
                                  <option value="Estonia">Estonia</option>
                                  <option value="Fiji">Fiji</option>
                                  <option value="Finland">Finland</option>
                                  <option value="France">France</option>
                                  <option value="Gabon">Gabon</option>
                                  <option value="Gambia">Gambia</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Germany">Germany</option>
                                  <option value="Ghana">Ghana</option>
                                  <option value="Greece">Greece</option>
                                  <option value="Grenada">Grenada</option>
                                  <option value="Guatemala">Guatemala</option>
                                  <option value="Guinea">Guinea</option>
                                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                                  <option value="Guyana">Guyana</option>
                                  <option value="Haiti">Haiti</option>
                                  <option value="Honduras">Honduras</option>
                                  <option value="Hungary">Hungary</option>
                                  <option value="Iceland">Iceland</option>
                                  <option value="India">India</option>
                                  <option value="Indonesia">Indonesia</option>
                                  <option value="Iraq">Iraq</option>
                                  <option value="Ireland">Ireland</option>
                                  <option value="Israel">Israel</option>
                                  <option value="Italy">Italy</option>
                                  <option value="Jamaica">Jamaica</option>
                                  <option value="Japan">Japan</option>
                                  <option value="Jordan">Jordan</option>
                                  <option value="Kazakhstan">Kazakhstan</option>
                                  <option value="Kenya">Kenya</option>
                                  <option value="Kiribati">Kiribati</option>
                                  <option value="South Korea">South Korea </option>
                                  <option value="Kosovo">Kosovo</option>
                                  <option value="Kuwait">Kuwait</option>
                                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                                  <option value="Laos">Laos</option>
                                  <option value="Latvia">Latvia</option>
                                  <option value="Lebanon">Lebanon</option>
                                  <option value="Lesotho">Lesotho</option>
                                  <option value="Liberia">Liberia</option>
                                  <option value="Libya">Libya</option>
                                  <option value="Liechtenstein">Liechtenstein</option>
                                  <option value="Lithuania">Lithuania</option>
                                  <option value="Luxembourg">Luxembourg</option>
                                  <option value="Macedonia">Macedonia</option>
                                  <option value="Madagascar">Madagascar</option>
                                  <option value="Malawi">Malawi</option>
                                  <option value="Malaysia">Malaysia</option>
                                  <option value="Maldives">Maldives</option>
                                  <option value="Mali">Mali</option>
                                  <option value="Malta">Malta</option>
                                  <option value="Marshall Islands">Marshall Islands</option>
                                  <option value="Mauritania">Mauritania</option>
                                  <option value="Mauritius">Mauritius</option>
                                  <option value="Mexico">Mexico</option>
                                  <option value="Federated States of Micronesia">Federated States of Micronesia</option>
                                  <option value="Moldova">Moldova</option>
                                  <option value="Monaco">Monaco</option>
                                  <option value="Mongolia">Mongolia</option>
                                  <option value="Montenegro">Montenegro</option>
                                  <option value="Morocco">Morocco</option>
                                  <option value="Mozambique">Mozambique</option>
                                  <option value="Myanmar">Myanmar</option>
                                  <option value="Namibia">Namibia</option>
                                  <option value="Nauru">Nauru</option>
                                  <option value="Nepal">Nepal</option>
                                  <option value="Netherlands">Netherlands</option>
                                  <option value="New Zealand">New Zealand</option>
                                  <option value="Nicaragua">Nicaragua</option>
                                  <option value="Niger">Niger</option>
                                  <option value="Nigeria">Nigeria</option>
                                  <option value="Norway">Norway</option>
                                  <option value="Oman">Oman</option>
                                  <option value="Palau">Palau</option>
                                  <option value="Panama">Panama</option>
                                  <option value="Papua New Guinea">Papua New Guinea</option>
                                  <option value="Paraguay">Paraguay</option>
                                  <option value="Peru">Peru</option>
                                  <option value="Philippines">Philippines</option>
                                  <option value="Poland">Poland</option>
                                  <option value="Portugal">Portugal</option>
                                  <option value="Qatar">Qatar</option>
                                  <option value="Romania">Romania</option>
                                  <option value="Russia">Russia</option>
                                  <option value="Rwanda">Rwanda</option>
                                  <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                  <option value="Saint Lucia">Saint Lucia</option>
                                  <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                                  <option value="Samoa">Samoa</option>
                                  <option value="San Marino">San Marino</option>
                                  <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                  <option value="Saudi Arabia">Saudi Arabia</option>
                                  <option value="Senegal">Senegal</option>
                                  <option value="Seychelles">Seychelles</option>
                                  <option value="Sierra Leone">Sierra Leone</option>
                                  <option value="Singapore">Singapore</option>
                                  <option value="Slovakia">Slovakia</option>
                                  <option value="Slovenia">Slovenia</option>
                                  <option value="Solomon Islands">Solomon Islands</option>
                                  <option value="Somalia">Somalia</option>
                                  <option value="South Africa">South Africa</option>
                                  <option value="Spain">Spain</option>
                                  <option value="Sudan">Sudan</option>
                                  <option value="South Sudan">South Sudan</option>
                                  <option value="Suriname">Suriname</option>
                                  <option value="Swaziland">Swaziland</option>
                                  <option value="Sweden">Sweden</option>
                                  <option value="Switzerland">Switzerland</option>
                                  <option value="Taiwan">Taiwan</option>
                                  <option value="Tajikistan">Tajikistan</option>
                                  <option value="Tanzania">Tanzania</option>
                                  <option value="Thailand">Thailand</option>
                                  <option value="Togo">Togo</option>
                                  <option value="Tonga">Tonga</option>
                                  <option value="Turkey">Turkey</option>
                                  <option value="Turkmenistan">Turkmenistan</option>
                                  <option value="Tuvalu">Tuvalu</option>
                                  <option value="Uganda">Uganda</option>
                                  <option value="Ukraine">Ukraine</option>
                                  <option value="United Arab Emirates">United Arab Emirates</option>
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Uruguay">Uruguay</option>
                                  <option value="Uzbekistan">Uzbekistan</option>
                                  <option value="Vanuatu">Vanuatu</option>
                                  <option value="Vatican City">Vatican City</option>
                                  <option value="Venezela">Venezuela</option>
                                  <option value="Vietnam">Vietnam</option>
                                  <option value="Zambia">Zambia</option>
                            </select>
                            {errors.intermediarybank_country && <span className="invalid">{errors.intermediarybank_country.message}</span>}
                          </div>
                    </FormGroup>
                    <FormGroup>
                      <Label className="form-label">
                        INTERMEDIARY BANK ADDRESS *
                      </Label>
                      <div className="form-control-wrap">
                        <input className="form-control "  
                        value={formData.intermediarybank_address} 
                        onChange = { e => {
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                            setFormData({...formData, intermediarybank_address: e.target.value}); 
                            if (e.target.value === "")  
                            setErrorsStr({
                              ...errorsStr, intermediarybank_address: {message: "This field is required", status:true }
                            });
                            else {
                            setErrorsStr({...errorsStr, intermediarybank_address: {status:false}})
                            }
                          } else 
                          setErrorsStr({
                              ...errorsStr, intermediarybank_address: {status:true, message: t('unavailable_character_error')}
                            })
                          }
                          }
                        
                        name="intermediarybank_address"  placeholder="Enter intermediary bank address" />
                      {errorsStr.intermediarybank_address.status && <span className="invalid">{errorsStr.intermediarybank_address.message}</span>}
                      </div>
                    </FormGroup>
                  
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                        INTERMEDIARY BANK SWIFT/BIC CODE *
                      </Label>
                      <div className="form-control-wrap">
                          <input className="form-control " 
                            value={formData.intermediarybank_swiftcode} 
                            onChange = { e => {
                              if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:? ]+$/) !== null || e.target.value === "" ) {
                                setFormData({...formData, intermediarybank_swiftcode: e.target.value}); 
                                if (e.target.value === "")  
                                setErrorsStr({
                                  ...errorsStr, intermediarybank_swiftcode: {message: "This field is required", status:true }
                                });
                                else {
                                setErrorsStr({...errorsStr, intermediarybank_swiftcode: {status:false}})
                                }
                              } else 
                              setErrorsStr({
                                  ...errorsStr, intermediarybank_swiftcode: {status:true, message: t('unavailable_character_error')}
                                })
                              }
                              }
                            name="intermediarybank_swiftcode"  placeholder="Enter intermediary bank swift/bic code"   />
                          {errorsStr.intermediarybank_swiftcode.status && <span className="invalid">{errorsStr.intermediarybank_swiftcode.message}</span>}
                      </div>
                    </FormGroup> */}
                    <Row className="mt-5">
                      <Col md="6">
                        <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              name="saveTemplate"
                              className="custom-control-input form-control"
                              id='saveTemplate'
                              // checked={saveTemplate}
                              onChange={e => {setSaveTemplate(e.target.checked); console.log("save", e.target.checked)}}
                            />
                             <label className="custom-control-label form-label" htmlFor="saveTemplate">
                              {t('save_template')}
                            </label>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="form-group d-flex">
                            <label className="form-label mt-1 mr-2" htmlFor="templatename" style={{whiteSpace: "nowrap"}}>
                              {t('template_name')}
                            </label>
                            <input
                              type="text"
                              disabled={!saveTemplate}
                              className="form-control"
                              name="templatename"
                              value={templateName}
                              onChange={e => {setTemplateName(e.target.value); setErrorsStr({
                                ...errorsStr, templatename: { status: false }
                              }); } }
                            />
                            {errorsStr.templatename.status && <span className="invalid">{errorsStr.templatename.message}</span>}
                        </div>
                      </Col>
                    </Row>
                    <FormGroup className='mt-3'>
                      <label className="form-label">{t('amount')} *</label>
                      <div className="form-control-wrap">
                        <input
                          type = "text"
                          value={formData.amount}
                          className="form-control "
                          placeholder="0.00 USD"
                          onChange={(e) => { 
                              if(e.target.value.match(/^[0-9]*\.?[0-9]*$/) || e.target.value === "") 
                                    setFormData({ ...formData, amount: e.target.value }) 
                              if (e.target.value < minimumAmount){
                                  setErrorsWire({
                                    status:true,
                                    message: t('amount_over_error')
                                  })
                              } else if (e.target.value > availableAmount) {
                                setErrorsWire({
                                  status: true,
                                  message: t('amount_under_available_error')
                                })
                              } else {
                                setErrorsWire({
                                  status: false
                                })
                              }
                            }
                          }
                          name = "amount"
                          // ref={register({
                          //   required: "This field is required", validate: (value) =>{ if (value < 10000) return "Amount must be over 10000"; if (value > availableAmount) return "Amount must be under total amount"; }
                          // })}
                        />
                      {errorsWire.status && <span className="invalid">{errorsWire.message}</span>}
                      </div>
                    </FormGroup>
                    <div className="pricing-body">
                      <ul className="pricing-features">
                        <li>
                          <span className="w-50">{t('available_balance')}</span> : <span className="ml-auto">{availableAmount === -1 ? <Spinner size="sm" color="dark" />: Helper.limitDecimal(availableAmount, 2)}</span>
                        </li>
                        <li>
                          <span className="w-50">{t('minimum_amount')}</span> : <span className="ml-auto">{Helper.limitDecimal(minimumAmount, 2)}</span>
                        </li>
                        <li>
                          <span className="w-50"  >{t('fees')}
                            <Button onClick={e => {e.preventDefault();}} id="PopoverDismisable" style={{fontSize: "12px",marginLeft:"7px", textDecoration:"underline"}}>
                                {t('notes')}
                            </Button>
                            <UncontrolledPopover target="PopoverDismisable" trigger="focus">
                              <PopoverHeader>{t('fee_desc')}</PopoverHeader>
                              <PopoverBody>
                                  {t('from')} 10,000 USD {t('to')} 50,000 USD &nbsp;&nbsp;           : 8%<br/>
                                  {t('from')} 50,001 USD {t('to')} 150,000 USD                      : 7%<br/>
                                  {t('from')} 150,001 USD &emsp;&emsp;&emsp;&emsp;&nbsp; : 6%<br/>
                              </PopoverBody>
                            </UncontrolledPopover>
                          </span>
                          : <span className="ml-auto">{Helper.limitDecimal(fees, 2)}</span>
                        </li>
                        <li>
                          <span className="w-50">{t('receive_desc')}</span> : <span className="ml-auto">{Helper.limitDecimal(receiveAmount, 2)}</span>
                        </li>
                      </ul>
                    </div>
                  </Col>
              </Row>
              <div className="text-center pt-5">
                  <FormGroup>
                    <Button type="submit" color="primary" size="lg" className="btn-block">
                      {t('confirm')}
                    </Button>
                  </FormGroup>
              </div>
            </Form>
          </div>
        </Block>
      </Content>
      <Modal isOpen={modal.wireConfirm} toggle={() => setModal({ wireConfirm: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onWireConfirmFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              {wireFinish === 0 && <h5 className="title" style={{overflowWrap: "anywhere"}}>Are you sure to request wire {formData.amount}USD?</h5>}
              {wireFinish === 1 && <h5 className="title" style={{overflowWrap: "anywhere"}}>You successfully requested wire {formData.amount}USD.</h5>}
              {wireFinish === 2 && <h5 className="title" style={{overflowWrap: "anywhere"}}>Request wire failed.</h5>}
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onWireConfirmSubmit)}>
                  <Col md="12">
                    <FormGroup>
                      { wireFinish !== 0 && wireId !== null &&
                        <div>
                         WireID is <Link to ={`/wirehistory/${wireId}`}>{wireId}</Link>
                      </div>}
                    </FormGroup>
                  </Col>
                 <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    { wireFinish === 0 && <li>
                       <Button color="primary" size="md" type="submit">
                          
                          {loading ? <Spinner size="sm" color="light" /> : "Confirm"}
                        </Button>
                      </li>}
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onWireConfirmFormCancel();
                          }}
                          className="link link-light"
                        >
                          {
                            wireFinish === 0 ? "Cancel": "Close"
                          }
                          
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
      </Modal>

      {/* Bank template */}
      <Modal isOpen={modal.useTemplate} toggle={() => setModal({ useTemplate: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onUseTemplateFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
                <Form className="row gy-4" >
                  <Col md="12">
                      <BlockHead size="sm">
                        <BlockBetween>
                          <BlockHeadContent>
                            <div className="toggle-wrap nk-block-tools-toggle">
                              <a
                                href="#more"
                                className="btn btn-icon btn-trigger toggle-expand mr-n1"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  updateSm(!sm);
                                }}
                              >
                                <Icon name="more-v"></Icon>
                              </a>
                              <div className="toggle-expand-content" style={{ display: sm ? "block" : "none",}}>
                                <ul className="nk-block-tools g-3">
                                  <li>
                                    <div className="form-control-wrap">
                                      <div className="form-icon form-icon-right">
                                        <Icon name="search"></Icon>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="default-04"
                                        placeholder={t('placeholder_search_template')}
                                        onChange={(e) => onFilterChange(e)}
                                      />
                                    </div>
                                  </li>
                                  <li>
                                  <UncontrolledDropdown>
                                    <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                      <Icon name="setting"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu right className="dropdown-menu-xs">
                                      <ul className="link-check">
                                        <li>
                                          <span> {t('show')}</span>
                                        </li>
                                        <li className={itemPerPage === 10 ? "active" : ""}>
                                          <DropdownItem
                                            tag="a"
                                            href="#dropdownitem"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              setItemPerPage(10);
                                            }}
                                          >
                                            10
                                          </DropdownItem>
                                        </li>
                                        <li className={itemPerPage === 15 ? "active" : ""}>
                                          <DropdownItem
                                            tag="a"
                                            href="#dropdownitem"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              setItemPerPage(15);
                                            }}
                                          >
                                            15
                                          </DropdownItem>
                                        </li>
                                      </ul>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                  </li>
                                  <li className="nk-block-tools-opt">
                                    <Button
                                      className="toggle btn-icon d-md-none"
                                      color="primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        toggle("add");
                                      }}
                                    >
                                      <Icon name="plus"></Icon>
                                    </Button>
                                    <Button
                                      className="toggle d-none d-md-inline-flex"
                                      color="primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        toggle("add");
                                      }}
                                    >
                                      <Icon name="plus"></Icon>
                                      <span> {t('add_template')}</span>
                                    </Button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </BlockHeadContent>
                        </BlockBetween>
                      </BlockHead>
                      <Block>
                        <Card className="card-bordered">
                          <div className="card-inner-group">
                            <div className="card-inner p-0">
                              <DataTableBody>
                                <DataTableHead>
                                  <DataTableRow className="nk-tb-col-check">
                                    {/* <div className="custom-control custom-control-sm custom-checkbox notext"> */}
                                      {/* <input
                                        type="checkbox"
                                        className="custom-control-input form-control"
                                        id="uid_1"
                                        onChange={(e) => selectorCheck(e)}
                                      /> */}
                                      {/* <label className="custom-control-label" htmlFor="uid_1"></label> */}
                                    {/* </div> */}
                                  </DataTableRow>
                                  <DataTableRow size="sm">
                                    <span>{t('template_name')}</span>
                                  </DataTableRow>
                                  <DataTableRow>
                                    <span>{t('beneficiary_name')}</span>
                                  </DataTableRow>
                                  <DataTableRow>
                                    <span>{t('bank_name')}</span>
                                  </DataTableRow>
                                  {/* <DataTableRow>
                                    <span>BANK ACCUNT NUMBER/IBAN</span>
                                  </DataTableRow>
                                  <DataTableRow size="md">
                                    <span>BANK COUNTRY</span>
                                  </DataTableRow>
                                  <DataTableRow size="md">
                                    <span>SWIFT/BIC CODE</span>
                                  </DataTableRow>
                                  <DataTableRow size="md">
                                    <span>REFERENCE CODE</span>
                                  </DataTableRow> */}
                                  <DataTableRow className="nk-tb-col-tools">
                                    {/* <ul className="nk-tb-actions gx-1 my-n1">
                                      <li className="mr-n1">
                                        <UncontrolledDropdown>
                                          <DropdownToggle
                                            tag="a"
                                            href="#toggle"
                                            onClick={(ev) => ev.preventDefault()}
                                            className="dropdown-toggle btn btn-icon btn-trigger"
                                          >
                                            <Icon name="more-h"></Icon>
                                          </DropdownToggle>
                                          <DropdownMenu right>
                                            <ul className="link-list-opt no-bdr">
                                              <li>
                                                <DropdownItem tag="a" href="#edit" onClick={(ev) => ev.preventDefault()}>
                                                  <Icon name="edit"></Icon>
                                                  <span>Edit Selected</span>
                                                </DropdownItem>
                                              </li>
                                              <li>
                                                <DropdownItem
                                                  tag="a"
                                                  href="#remove"
                                                  onClick={(ev) => {
                                                    ev.preventDefault();
                                                    selectorDeleteProduct();
                                                  }}
                                                >
                                                  <Icon name="trash"></Icon>
                                                  <span>Remove Selected</span>
                                                </DropdownItem>
                                              </li>
                                              <li>
                                                <DropdownItem
                                                  tag="a"
                                                  href="#view"
                                                  onClick={(ev) => {
                                                    ev.preventDefault();
                                                  }}
                                                >
                                                  <Icon name="eye"></Icon>
                                                  <span>View Selected</span>
                                                </DropdownItem>
                                              </li>
                                            </ul>
                                          </DropdownMenu>
                                        </UncontrolledDropdown>
                                      </li>
                                    </ul> */}
                                  </DataTableRow>
                                </DataTableHead>
                                {currentItems.length > 0
                                  ? currentItems.map((item) => {
                                      return (
                                        <DataTableItem key={item.id}>
                                          <DataTableRow className="nk-tb-col-check">
                                            <div className="custom-control custom-control-sm custom-checkbox notext">
                                              <input
                                                type="radio"
                                                className="custom-control custom-radio"
                                                name="select_bank"
                                                checked={item.check}
                                                id={item.id + "uid1"}
                                                key={Math.random()}
                                                onChange={(e) => {onSelectChange(e, item.id); console.log(e.currentTarget.checked)}}
                                              />
                                            </div>
                                          </DataTableRow>
                                          <DataTableRow size="sm">
                                            <span className="tb-product">
                                              {/* <img src={item.img ? item.img : ProductH} alt="product" className="thumb" /> */}
                                              <span className="title">{item.template_name}</span>
                                            </span>
                                          </DataTableRow>
                                          <DataTableRow>
                                            <span className="tb-sub">{item.beneficiary_name}</span>
                                          </DataTableRow>
                                          <DataTableRow>
                                            <span className="tb-sub">{item.bank_name}</span>
                                          </DataTableRow>
                                          <DataTableRow className="nk-tb-col-tools">
                                            <ul className="nk-tb-actions gx-1 my-n1">
                                              <li className="mr-n1">
                                                <UncontrolledDropdown>
                                                  <DropdownToggle
                                                    tag="a"
                                                    href="#more"
                                                    onClick={(ev) => ev.preventDefault()}
                                                    className="dropdown-toggle btn btn-icon btn-trigger"
                                                  >
                                                    <Icon name="more-h"></Icon>
                                                  </DropdownToggle>
                                                  <DropdownMenu right>
                                                    <ul className="link-list-opt no-bdr">
                                                      <li>
                                                        <DropdownItem
                                                          tag="a"
                                                          href="#edit"
                                                          onClick={(ev) => {
                                                            ev.preventDefault();
                                                            onEditClick(item.id);
                                                            toggle("edit");
                                                          }}
                                                        >
                                                          <Icon name="edit"></Icon>
                                                          <span> {t('edit')} {t('template')}</span>
                                                        </DropdownItem>
                                                      </li>
                                                      <li>
                                                        <DropdownItem
                                                          tag="a"
                                                          href="#view"
                                                          onClick={(ev) => {
                                                            ev.preventDefault();
                                                            onEditClick(item.id);
                                                            toggle("details");
                                                          }}
                                                        >
                                                          <Icon name="eye"></Icon>
                                                          <span>{t('view')} {t('template')}</span>
                                                        </DropdownItem>
                                                      </li>
                                                      <li>
                                                        <DropdownItem
                                                          tag="a"
                                                          href="#remove"
                                                          onClick={(ev) => {
                                                            ev.preventDefault();
                                                            setModal({...modal, template_remove_confirm: true});
                                                            setEditedId(item.id);
                                                          }}
                                                        >
                                                          <Icon name="trash"></Icon>
                                                          <span>{t('remove')} {t('template')}</span>
                                                        </DropdownItem>
                                                      </li>
                                                    </ul>
                                                  </DropdownMenu>
                                                </UncontrolledDropdown>
                                              </li>
                                            </ul>
                                          </DataTableRow>
                                        </DataTableItem>
                                      );
                                    })
                                  : null}
                              </DataTableBody>
                              <div className="card-inner">
                                {data.length > 0 ? (
                                  <PaginationComponent
                                    itemPerPage={itemPerPage}
                                    totalItems={data.length}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                  />
                                ) : (
                                  <div className="text-center">
                                    <span className="text-silent">No templates found</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Block>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="button" onClick={e => {onUseTemplateFormSubmit()}}>
                          {t('confirm')}
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onUseTemplateFormCancel();
                          }}
                          className="link link-light"
                        >
                            {t('cancel')}
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Form>
            </div>
          </ModalBody>
      </Modal>
      <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a href="#cancel" className="close">
            {" "}
            <Icon
              name="cross-sm"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
            ></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">{t('update_template')}</h5>
            <div className="mt-4">
              <Form onSubmit={handleSubmit(onEditSubmit)}>
                <Row className="g-3">
                  <Col size="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-title">
                      {t('template_name')}
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          name="template_name"
                          onChange={(e) => {onInputChange(e); setErrorsMsg({...errorsMsg, update_template_name: {status: false}})}}
                          value={modalData.template_name}
                        />
                        {errorsMsg.update_template_name.status && <span className="invalid">{errorsMsg.update_template_name.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="regular-price">
                      {t('beneficiary_name')}
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          name="beneficiary_name"
                          onChange={(e) => onInputChange(e)}
                          className="form-control"
                          defaultValue={modalData.beneficiary_name}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="sale-price">
                      {t('bank_name')}
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          name="bank_name"
                          onChange={(e) => onInputChange(e)}
                          defaultValue={modalData.bank_name}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="stock">
                      {t('bank_number')}
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          name="bank_account_number"
                          onChange={(e) => onInputChange(e)}
                          defaultValue={modalData.bank_account_number}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="SKU">
                      {t('bank_country')}
                      </label>
                      <div className="form-control-wrap">
                            <select id="bank_country" name="bank_country" value={modalData.bank_country} onChange={(e) => onInputChange(e)} className="form-control"
                            >
                                <option value="noselect" >{t('select_country')}</option>
                                <option value="United States">United States</option>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="Albania">Albania</option>
                                <option value="Algeria">Algeria</option>
                                <option value="Andorra">Andorra</option>
                                <option value="Angola">Angola</option>
                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbaijan">Azerbaijan</option>
                                <option value="Bahamas">Bahamas</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Barbados">Barbados</option>
                                <option value="Belarus">Belarus</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Belize">Belize</option>
                                <option value="Benin">Benin</option>
                                <option value="Bhutan">Bhutan</option>
                                <option value="Bolivia">Bolivia</option>
                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                <option value="Botswana">Botswana</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Brunei">Brunei</option>
                                <option value="Bulgaria">Bulgaria</option>
                                <option value="Burkina Faso">Burkina Faso</option>
                                <option value="Burundi">Burundi</option>
                                <option value="Cabo Verde">Cabo Verde</option>
                                <option value="Cambodia">Cambodia</option>
                                <option value="Cameroon">Cameroon</option>
                                <option value="Canada">Canada</option>
                                <option value="Central African Republic">Central African Republic</option>
                                <option value="Chad">Chad</option>
                                <option value="Chile">Chile</option>
                                <option value="China">China</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Comoros">Comoros</option>
                                <option value="Congo">Congo</option>
                                <option value="Costa Rica">Costa Rica</option>
                                <option value="Cote d'Ivoire">Cote d'Ivoire</option>
                                <option value="Croatia">Croatia</option>
                                <option value="Cuba">Cuba</option>
                                <option value="Cyprus">Cyprus</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Djibouti">Djibouti</option>
                                <option value="Dominica">Dominica</option>
                                <option value="Dominican Republic">Dominican Republic</option>
                                <option value="East Timor">East Timor</option>
                                <option value="Ecuador">Ecuador</option>
                                <option value="Egypt">Egypt</option>
                                <option value="El Salvador">El Salvador</option>
                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                <option value="Eritrea">Eritrea</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Fiji">Fiji</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="Gabon">Gabon</option>
                                <option value="Gambia">Gambia</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Germany">Germany</option>
                                <option value="Ghana">Ghana</option>
                                <option value="Greece">Greece</option>
                                <option value="Grenada">Grenada</option>
                                <option value="Guatemala">Guatemala</option>
                                <option value="Guinea">Guinea</option>
                                <option value="Guinea-Bissau">Guinea-Bissau</option>
                                <option value="Guyana">Guyana</option>
                                <option value="Haiti">Haiti</option>
                                <option value="Honduras">Honduras</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Iceland">Iceland</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Iraq">Iraq</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Israel">Israel</option>
                                <option value="Italy">Italy</option>
                                <option value="Jamaica">Jamaica</option>
                                <option value="Japan">Japan</option>
                                <option value="Jordan">Jordan</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Kiribati">Kiribati</option>
                                <option value="South Korea">South Korea </option>
                                <option value="Kosovo">Kosovo</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                <option value="Laos">Laos</option>
                                <option value="Latvia">Latvia</option>
                                <option value="Lebanon">Lebanon</option>
                                <option value="Lesotho">Lesotho</option>
                                <option value="Liberia">Liberia</option>
                                <option value="Libya">Libya</option>
                                <option value="Liechtenstein">Liechtenstein</option>
                                <option value="Lithuania">Lithuania</option>
                                <option value="Luxembourg">Luxembourg</option>
                                <option value="Macedonia">Macedonia</option>
                                <option value="Madagascar">Madagascar</option>
                                <option value="Malawi">Malawi</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Maldives">Maldives</option>
                                <option value="Mali">Mali</option>
                                <option value="Malta">Malta</option>
                                <option value="Marshall Islands">Marshall Islands</option>
                                <option value="Mauritania">Mauritania</option>
                                <option value="Mauritius">Mauritius</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Federated States of Micronesia">Federated States of Micronesia</option>
                                <option value="Moldova">Moldova</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Mongolia">Mongolia</option>
                                <option value="Montenegro">Montenegro</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Mozambique">Mozambique</option>
                                <option value="Myanmar">Myanmar</option>
                                <option value="Namibia">Namibia</option>
                                <option value="Nauru">Nauru</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Nicaragua">Nicaragua</option>
                                <option value="Niger">Niger</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Norway">Norway</option>
                                <option value="Oman">Oman</option>
                                <option value="Palau">Palau</option>
                                <option value="Panama">Panama</option>
                                <option value="Papua New Guinea">Papua New Guinea</option>
                                <option value="Paraguay">Paraguay</option>
                                <option value="Peru">Peru</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Romania">Romania</option>
                                <option value="Russia">Russia</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                <option value="Saint Lucia">Saint Lucia</option>
                                <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                                <option value="Samoa">Samoa</option>
                                <option value="San Marino">San Marino</option>
                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Senegal">Senegal</option>
                                <option value="Seychelles">Seychelles</option>
                                <option value="Sierra Leone">Sierra Leone</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Slovakia">Slovakia</option>
                                <option value="Slovenia">Slovenia</option>
                                <option value="Solomon Islands">Solomon Islands</option>
                                <option value="Somalia">Somalia</option>
                                <option value="South Africa">South Africa</option>
                                <option value="Spain">Spain</option>
                                <option value="Sudan">Sudan</option>
                                <option value="South Sudan">South Sudan</option>
                                <option value="Suriname">Suriname</option>
                                <option value="Swaziland">Swaziland</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Taiwan">Taiwan</option>
                                <option value="Tajikistan">Tajikistan</option>
                                <option value="Tanzania">Tanzania</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Togo">Togo</option>
                                <option value="Tonga">Tonga</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Turkmenistan">Turkmenistan</option>
                                <option value="Tuvalu">Tuvalu</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Uruguay">Uruguay</option>
                                <option value="Uzbekistan">Uzbekistan</option>
                                <option value="Vanuatu">Vanuatu</option>
                                <option value="Vatican City">Vatican City</option>
                                <option value="Venezela">Venezuela</option>
                                <option value="Vietnam">Vietnam</option>
                                <option value="Zambia">Zambia</option>
                          </select>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="SKU">
                        {t('swift_code')}
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          name="swift_bic_code"
                          onChange={(e) => onInputChange(e)}
                          defaultValue={modalData.swift_bic_code}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="reference_code">
                        {t('reference_code')}
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          name="reference_code"
                          onChange={(e) => onInputChange(e)}
                          defaultValue={modalData.reference_code}
                        />
                      </div>
                    </div>
                  </Col>
               
                  <Col size="12">
                    <Button color="primary" type="button" onClick={(e) => { onEditSubmit();}}>
                      <Icon className="plus"></Icon>
                      <span>{t('update_template')}</span>
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a href="#cancel" className="close">
            {" "}
            <Icon
              name="cross-sm"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
            ></Icon>
          </a>
          <div className="nk-modal-head">
            <h4 className="nk-modal-title title">
            {t('template_name')} :  <small className="text-primary">{modalData.template_name}</small>
            </h4>
          </div>
          <div className="nk-tnx-details mt-sm-3 pl-2 pr-2">
            <Row className="gy-3">
              <Col lg={6}>
                <span className="sub-text">{t('beneficiary_name')}</span>
                <span className="caption-text">{modalData.beneficiary_name}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">{t('bank_name')}</span>
                <span className="caption-text">{modalData.bank_name}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">{t('bank_number')}</span>
                <span className="caption-text">
                  {modalData.bank_account_number}
                </span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">{t('bank_country')}</span>
                <span className="caption-text"> {modalData.bank_country}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">{t('swift_code')}</span>
                <span className="caption-text"> {modalData.swift_bic_code}</span>
              </Col>
              <Col lg={6}>
                <span className="sub-text">{t('reference_code')}</span>
                <span className="caption-text"> {modalData.reference_code}</span>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={view.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a href="#cancel" className="close">
            {" "}
            <Icon
              name="cross-sm"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
            ></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">{t('add_template')}</h5>
            <div className="mt-4">
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="product-title">
                      {t('template_name')}
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="template_name"
                        onChange={(e) => {onInputChange(e); setErrorsMsg({...errorsMsg, add_template_name: {status: false}})}}
                        defaultValue={modalData.template_name}
                      />
                      {errorsMsg.add_template_name.status && <span className="invalid">{errorsMsg.add_template_name.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="regular-price">
                      {t('beneficiary_name')}
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        name="beneficiary_name"
                        onChange={(e) => onInputChange(e)}
                        className="form-control"
                        defaultValue={modalData.beneficiary_name}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sale-price">
                    {t('bank_name')}
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="bank_name"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={modalData.bank_name}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bank_account_number">
                    {t('bank_number')}
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="bank_account_number"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={modalData.bank_account_number}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bank_country">
                     {t('bank_country')}
                    </label>
                    <div className="form-control-wrap">
                          <select id="bank_country" name="bank_country" value={modalData.bank_country} onChange={(e) => onInputChange(e)} className="form-control"
                          >
                              <option value="noselect" >{t('select_country')}</option>
                              <option value="United States">United States</option>
                              <option value="Afghanistan">Afghanistan</option>
                              <option value="Albania">Albania</option>
                              <option value="Algeria">Algeria</option>
                              <option value="Andorra">Andorra</option>
                              <option value="Angola">Angola</option>
                              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                              <option value="Argentina">Argentina</option>
                              <option value="Armenia">Armenia</option>
                              <option value="Australia">Australia</option>
                              <option value="Austria">Austria</option>
                              <option value="Azerbaijan">Azerbaijan</option>
                              <option value="Bahamas">Bahamas</option>
                              <option value="Bahrain">Bahrain</option>
                              <option value="Bangladesh">Bangladesh</option>
                              <option value="Barbados">Barbados</option>
                              <option value="Belarus">Belarus</option>
                              <option value="Belgium">Belgium</option>
                              <option value="Belize">Belize</option>
                              <option value="Benin">Benin</option>
                              <option value="Bhutan">Bhutan</option>
                              <option value="Bolivia">Bolivia</option>
                              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                              <option value="Botswana">Botswana</option>
                              <option value="Brazil">Brazil</option>
                              <option value="Brunei">Brunei</option>
                              <option value="Bulgaria">Bulgaria</option>
                              <option value="Burkina Faso">Burkina Faso</option>
                              <option value="Burundi">Burundi</option>
                              <option value="Cabo Verde">Cabo Verde</option>
                              <option value="Cambodia">Cambodia</option>
                              <option value="Cameroon">Cameroon</option>
                              <option value="Canada">Canada</option>
                              <option value="Central African Republic">Central African Republic</option>
                              <option value="Chad">Chad</option>
                              <option value="Chile">Chile</option>
                              <option value="China">China</option>
                              <option value="Colombia">Colombia</option>
                              <option value="Comoros">Comoros</option>
                              <option value="Congo">Congo</option>
                              <option value="Costa Rica">Costa Rica</option>
                              <option value="Cote d'Ivoire">Cote d'Ivoire</option>
                              <option value="Croatia">Croatia</option>
                              <option value="Cuba">Cuba</option>
                              <option value="Cyprus">Cyprus</option>
                              <option value="Czech Republic">Czech Republic</option>
                              <option value="Denmark">Denmark</option>
                              <option value="Djibouti">Djibouti</option>
                              <option value="Dominica">Dominica</option>
                              <option value="Dominican Republic">Dominican Republic</option>
                              <option value="East Timor">East Timor</option>
                              <option value="Ecuador">Ecuador</option>
                              <option value="Egypt">Egypt</option>
                              <option value="El Salvador">El Salvador</option>
                              <option value="Equatorial Guinea">Equatorial Guinea</option>
                              <option value="Eritrea">Eritrea</option>
                              <option value="Estonia">Estonia</option>
                              <option value="Fiji">Fiji</option>
                              <option value="Finland">Finland</option>
                              <option value="France">France</option>
                              <option value="Gabon">Gabon</option>
                              <option value="Gambia">Gambia</option>
                              <option value="Georgia">Georgia</option>
                              <option value="Germany">Germany</option>
                              <option value="Ghana">Ghana</option>
                              <option value="Greece">Greece</option>
                              <option value="Grenada">Grenada</option>
                              <option value="Guatemala">Guatemala</option>
                              <option value="Guinea">Guinea</option>
                              <option value="Guinea-Bissau">Guinea-Bissau</option>
                              <option value="Guyana">Guyana</option>
                              <option value="Haiti">Haiti</option>
                              <option value="Honduras">Honduras</option>
                              <option value="Hungary">Hungary</option>
                              <option value="Iceland">Iceland</option>
                              <option value="India">India</option>
                              <option value="Indonesia">Indonesia</option>
                              <option value="Iraq">Iraq</option>
                              <option value="Ireland">Ireland</option>
                              <option value="Israel">Israel</option>
                              <option value="Italy">Italy</option>
                              <option value="Jamaica">Jamaica</option>
                              <option value="Japan">Japan</option>
                              <option value="Jordan">Jordan</option>
                              <option value="Kazakhstan">Kazakhstan</option>
                              <option value="Kenya">Kenya</option>
                              <option value="Kiribati">Kiribati</option>
                              <option value="South Korea">South Korea </option>
                              <option value="Kosovo">Kosovo</option>
                              <option value="Kuwait">Kuwait</option>
                              <option value="Kyrgyzstan">Kyrgyzstan</option>
                              <option value="Laos">Laos</option>
                              <option value="Latvia">Latvia</option>
                              <option value="Lebanon">Lebanon</option>
                              <option value="Lesotho">Lesotho</option>
                              <option value="Liberia">Liberia</option>
                              <option value="Libya">Libya</option>
                              <option value="Liechtenstein">Liechtenstein</option>
                              <option value="Lithuania">Lithuania</option>
                              <option value="Luxembourg">Luxembourg</option>
                              <option value="Macedonia">Macedonia</option>
                              <option value="Madagascar">Madagascar</option>
                              <option value="Malawi">Malawi</option>
                              <option value="Malaysia">Malaysia</option>
                              <option value="Maldives">Maldives</option>
                              <option value="Mali">Mali</option>
                              <option value="Malta">Malta</option>
                              <option value="Marshall Islands">Marshall Islands</option>
                              <option value="Mauritania">Mauritania</option>
                              <option value="Mauritius">Mauritius</option>
                              <option value="Mexico">Mexico</option>
                              <option value="Federated States of Micronesia">Federated States of Micronesia</option>
                              <option value="Moldova">Moldova</option>
                              <option value="Monaco">Monaco</option>
                              <option value="Mongolia">Mongolia</option>
                              <option value="Montenegro">Montenegro</option>
                              <option value="Morocco">Morocco</option>
                              <option value="Mozambique">Mozambique</option>
                              <option value="Myanmar">Myanmar</option>
                              <option value="Namibia">Namibia</option>
                              <option value="Nauru">Nauru</option>
                              <option value="Nepal">Nepal</option>
                              <option value="Netherlands">Netherlands</option>
                              <option value="New Zealand">New Zealand</option>
                              <option value="Nicaragua">Nicaragua</option>
                              <option value="Niger">Niger</option>
                              <option value="Nigeria">Nigeria</option>
                              <option value="Norway">Norway</option>
                              <option value="Oman">Oman</option>
                              <option value="Palau">Palau</option>
                              <option value="Panama">Panama</option>
                              <option value="Papua New Guinea">Papua New Guinea</option>
                              <option value="Paraguay">Paraguay</option>
                              <option value="Peru">Peru</option>
                              <option value="Philippines">Philippines</option>
                              <option value="Poland">Poland</option>
                              <option value="Portugal">Portugal</option>
                              <option value="Qatar">Qatar</option>
                              <option value="Romania">Romania</option>
                              <option value="Russia">Russia</option>
                              <option value="Rwanda">Rwanda</option>
                              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                              <option value="Saint Lucia">Saint Lucia</option>
                              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                              <option value="Samoa">Samoa</option>
                              <option value="San Marino">San Marino</option>
                              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                              <option value="Saudi Arabia">Saudi Arabia</option>
                              <option value="Senegal">Senegal</option>
                              <option value="Seychelles">Seychelles</option>
                              <option value="Sierra Leone">Sierra Leone</option>
                              <option value="Singapore">Singapore</option>
                              <option value="Slovakia">Slovakia</option>
                              <option value="Slovenia">Slovenia</option>
                              <option value="Solomon Islands">Solomon Islands</option>
                              <option value="Somalia">Somalia</option>
                              <option value="South Africa">South Africa</option>
                              <option value="Spain">Spain</option>
                              <option value="Sudan">Sudan</option>
                              <option value="South Sudan">South Sudan</option>
                              <option value="Suriname">Suriname</option>
                              <option value="Swaziland">Swaziland</option>
                              <option value="Sweden">Sweden</option>
                              <option value="Switzerland">Switzerland</option>
                              <option value="Taiwan">Taiwan</option>
                              <option value="Tajikistan">Tajikistan</option>
                              <option value="Tanzania">Tanzania</option>
                              <option value="Thailand">Thailand</option>
                              <option value="Togo">Togo</option>
                              <option value="Tonga">Tonga</option>
                              <option value="Turkey">Turkey</option>
                              <option value="Turkmenistan">Turkmenistan</option>
                              <option value="Tuvalu">Tuvalu</option>
                              <option value="Uganda">Uganda</option>
                              <option value="Ukraine">Ukraine</option>
                              <option value="United Arab Emirates">United Arab Emirates</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Uruguay">Uruguay</option>
                              <option value="Uzbekistan">Uzbekistan</option>
                              <option value="Vanuatu">Vanuatu</option>
                              <option value="Vatican City">Vatican City</option>
                              <option value="Venezela">Venezuela</option>
                              <option value="Vietnam">Vietnam</option>
                              <option value="Zambia">Zambia</option>
                        </select>
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="swift_bic_code">
                    {t('swift_code')}
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="swift_bic_code"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={modalData.swift_bic_code}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reference_code">
                  {t('reference_code')}
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        name="reference_code"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={modalData.reference_code}
                      />
                    </div>
                  </div>
                </Col>
            
                <Col size="12">
                  <Button color="primary" type="button" onClick={e => {e.preventDefault(); onFormSubmit();}}>
                    <Icon className="plus"></Icon>
                    <span>{t('add_template')}</span>
                  </Button>
                </Col>
              </Row>
            </form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={modal.template_remove_confirm} toggle={() => setModal({...modal, template_remove_confirm: false})} className="modal-dialog-centered" size="lg">
        <ModalBody>
          <a href="#cancel" className="close">
            {" "}
            <Icon
              name="cross-sm"
              onClick={(ev) => {
                ev.preventDefault();
                setModal({...modal, template_remove_confirm: false});
              }}
            ></Icon>
          </a>
          <div className="nk-modal-head">
            <h4 className="nk-modal-title title">
                {t('sure_remove_template')}
            </h4>
          </div>
          <Col size="12" className="mt-5">
            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 ">
              <li>
                <Button color="primary" size="md" type="button" onClick={e => {deleteTemplate(editId)}}>
                  {t('confirm')}
                </Button>
              </li>
              <li>
                <Button
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModal({...modal, template_remove_confirm: false})
                  }}
                  className="link link-light"
                >
                    {t('cancel')}
                </Button>
              </li>
            </ul>
          </Col>
        </ModalBody>
      </Modal>
      {/* {view.add && <div className="toggle-overlay" style={{zIndex: "9990"}} onClick={toggle}></div>} */}
      <Modal isOpen={modal.auth} toggle={() => setModal({ auth: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                setModal({ auth: false });
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title" style={{overflowWrap: "anywhere"}}>{t('sure_request_wire', {amount: formData.amount})}</h5>
              <div className="">
                <Form className="row gy-4" onSubmit={handleSubmit(confirmWire)}>
                  <Col md="12">
                    <FormGroup>
                        <label className="form-label" htmlFor="default-01">
                          {t('enter_code')}
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            id="default-01"
                            name="authcode"
                            value={authCode}
                            placeholder={t('input_2fa')}
                            className="form-control-lg form-control"
                            onChange={ e => {
                              // (e.target.value.match(/^[a-zA-Z\d-@#$%^&*.,]+$/) || " " )&& setEmail(e.target.value)
                            if (e.target.value.match(/^[a-zA-Z\d-!$`=-~{}@#"$'%^&+|*:_.,]+$/) != null || e.target.value === "" ) {
                              setAuthCode(e.target.value); 
                              if (e.target.value === "")  
                              setErrorsf({
                                ...errorsf, emailfield: {status:true}
                              });
                              else {
                                setErrorsf({...errorsf, emailfield: {status:false}})
                              }
                            } else 
                              setErrorsf({
                                ...errorsf, emailfield: {status:true}
                              })
                            }}
                          />
                          {errorsf.authfield.status && <p className="invalid">This field is required</p>}
                    
                        </div>
                    </FormGroup>
                  </Col>
                 <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                            {loadingConfirm ? <Spinner size="sm" color="light" /> : t('confirm')}
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal({...modal, auth: false});
                          }}
                          className="link link-light"
                        >
                          
                          {t('cancel')}
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default RequestWire;
