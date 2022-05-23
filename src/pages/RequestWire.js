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
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Badge,
  FormGroup,
  Label,
  Popover,
  PopoverBody,
  PopoverHeader,
  Spinner,
  UncontrolledPopover,
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
  Row,
  RSelect,
} from '../components/Component';
import Head from '../layout/head/Head';
import { myServerApi } from '../utils/api';
import Helper , {CONFIGURATOR_USERNAME, CONFIGURATOR_PASSWORD} from '../utils/Helper';
import axios from 'axios';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: "USD",
  // currencyDisplay: ''
});
const RequestWire = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const myApi = myServerApi(); 
  const user = useSelector((state) => state.user.user);
  const userinfo = useSelector((state) => state.user);
  const verification_status = user?.verification_status;
  const email = localStorage.getItem("username"); //useSelector((state) => state.user.user.username)
  const { errors, register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [availableAmount, setAvailableAmount] = useState(-1);
  const [minimumAmount, setMinimumAmount] = useState(10000);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [fees, setFees] = useState(320);
  const user_id = localStorage.getItem("user_id");
  const [usditem, setUsditem] = useState({})
  
  const accounts = useSelector(state => state.user.accounts);
  let accouts_arr = Object.keys(accounts).map((key) => [Number(key), accounts[key]]);
  const [errorsStr, setErrorsStr] = useState({
    beneficiary_name : {status: false, message: "You have entered an unavailable character" },
    beneficiary_street : {status: false, message: "You have entered an unavailable character" },
    beneficiary_city : {status: false, message: "You have entered an unavailable character" },
    bankstreet_address : {status: false, message: "You have entered an unavailable character" },
    beneficiary_postal_code : {status: false, message: "You have entered an unavailable character" },
    bank_name : {status: false, message: "You have entered an unavailable character" },
    bank_city : {status: false, message: "You have entered an unavailable character" },
    bankpostal_code : {status: false, message: "You have entered an unavailable character" },
    bank_region : {status: false, message: "You have entered an unavailable character" },
    swift_code : {status: false, message: "Only alphabet characters are allowed for Swift code" },
    reference_code : {status: false, message: "Only alphabet characters are allowed for Swift code" },
    intermediarybank_address : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank address" },
    intermediarybank_name : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank name" },
    intermediarybank_number : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank number'" },
    intermediarybank_region : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank region'" },
    intermediarybank_swiftcode : {status: false, message: "Only alphabet characters are allowed for Intermediary Bank swift code" },
    bankaccount_number : {status: false, message: "Only alphabet characters are allowed for Bank account number" },
  })
  const [errorsWire, setErrorsWire] = useState({
    status: false,
    message: ""
  })
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
    bank_country: "",
    bankstreet_address: "",
    // bank_city: "",
    bank_region: "",
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

  const profileOptions = {
    title       : [{value: "Mr.", label: "Mr."},{value: "Ms.", label: "Ms."}],
    marriage    : [{value: "Single", label: "Single"}, {value: "Married", label: "Married"}],
    account_type    : [{value: "Individual", label: "Individual"}, {value: "Corporate", label: "Corporate"}],
    occupation  : [{value: "CEO", label: "CEO"}, {value: "Director", label: "Director"}, {value: "Employee", label: "Employee"}, {value: "Housewife", label: "Housewife"}, {value: "Student", label: "Student"}, {value: "Other", label: "Other"}],
  };

  const handleFormSubmit = (submitFormData) => {
    console.log("ss", submitFormData)
    if (loading)
    return;
    if (formData.beneficiary_name === "") {
      setErrorsStr({
        ...errorsStr, beneficiary_name: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.beneficiary_street === "") {
      setErrorsStr({
        ...errorsStr, beneficiary_street: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.beneficiary_postal_code === "") {
      setErrorsStr({
        ...errorsStr, beneficiary_postal_code: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.bank_name === "") {
      setErrorsStr({
        ...errorsStr, bank_name: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.bankaccount_number === "") {
      setErrorsStr({
        ...errorsStr, bankaccount_number: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.bankstreet_address === "") {
      setErrorsStr({
        ...errorsStr, bankstreet_address: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.bank_region === "") {
      setErrorsStr({
        ...errorsStr, bank_region: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.bankpostal_code === "") {
      setErrorsStr({
        ...errorsStr, bankpostal_code: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.swift_code === "") {
      setErrorsStr({
        ...errorsStr, swift_code: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.intermediarybank_name === "") {
      setErrorsStr({
        ...errorsStr, intermediarybank_name: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.intermediarybank_address === "") {
      setErrorsStr({
        ...errorsStr, intermediarybank_address: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.intermediarybank_number === "") {
      setErrorsStr({
        ...errorsStr, intermediarybank_number: {status: true, message: "This field is required"}
      });
      return;
    }
    if (formData.intermediarybank_swiftcode === "") {
      setErrorsStr({
        ...errorsStr, intermediarybank_swiftcode: {status: true, message: "This field is required"}
      });
      return;
    }

   
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
    setLoading(true); 
    setErrorsWire({
      status: false,
      message: "Amount must be under total amount"
    })
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
          comment:"Sell_operation", 
          currency:"USD"
        }
        let data = {...formData, status: "0", beneficiary_country: submitFormData.beneficiary_country, bank_country: submitFormData.bank_country, intermediarybank_country: submitFormData.intermediarybank_country};
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
          setFormData({...formData, amount: 0})
          toast.success("Successfully corrected balance");
          console.log("successfully selled")
          setLoading(false); 
         
        }).catch( e => {
          setLoading(false); 
          console.log("sell error")
        })
    })
    
  };
  useEffect(() => {
    // if (verification_status === "2"){
    
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
          if (user.verification_status === "0") {
            toast.warn("Please complete profile verification");
            history.push("user-profile-regular");
          }
          if (user.verification_status === "1") {
            toast.warn("We are currently verifying your profile. Please wait until it is completed");
            history.push("user-profile-verification");
          }
        }
        dispatch(setChecking(false))

      })
      .catch(err => {
        console.log('error: ', err);
        dispatch(setChecking(false))
        toast.warn("Please complete profile verification");
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
  return (
    <React.Fragment>
      <Head title="Request Wire"></Head>
      <BlockHead size="lg">
          <BlockHeadContent className="text-center">
            <BlockTitle tag="h4" className="mt-4">USD Wire Withdrawal</BlockTitle>
          </BlockHeadContent>
      </BlockHead>

      <Block>
        <PreviewCard className="card-bordered container " style={{width: "80%"}}>
          <div className="" style={{fontSize: "14px"}}>
            To request a withdrawal, please provide us with the required bank information requested below after reading the following points to note.
            <p className="mt-3"> <Badge className="badge-dot" color="Dark"> </Badge>Withdrawals will only be processed if the bank account listed matches the name on the account that was approved through the onboarding process.</p>
            <p><Badge className="badge-dot" color="Dark"> </Badge>Any listed fees represent fees assessed by CryptoWire to process your withdrawal. Other banks used during the transfer my charge additional fees and are not within our contrl.</p>
            <p><Badge className="badge-dot" color="Dark"> </Badge>All outgoing USD wires must include a US based intermediary bank in order for the wires to be completed.</p>
          </div>
          </PreviewCard>
      </Block>
      <Block>
        <div className="nk-data data-list container">
        <form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
          <Row className="gy-4">
              <Col md="12">
                <FormGroup>
                  <Label className="form-label">
                    BENEFICIARY NAME *
                  </Label>
                  <div className="form-control-wrap">
                      <input className="form-control " value={formData.beneficiary_name} 
                       onChange = { e => {
                       if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
                         setFormData({...formData, beneficiary_name: e.target.value}); 
                         if (e.target.value === "")  
                         setErrorsStr({
                           ...errorsStr, beneficiary_name: {message: "This field is required", status:true }
                         });
                         else {
                          setErrorsStr({...errorsStr, beneficiary_name: {status:false}})
                         }
                       } else 
                        setErrorsStr({
                           ...errorsStr, beneficiary_name: {status:true, message: "You have entered an unavailable character"}
                         })
                       }
                       }
                      name="beneficiary_name"  placeholder="Enter the beneficiary name" />
                      {errorsStr.beneficiary_name.status && <span className="invalid">{errorsStr.beneficiary_name.message}</span>}
                  </div>
                  <Label style={{fontSize: "14px"}}>The name on this bank account must match the name of your account</Label>
                </FormGroup>
                <FormGroup>
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
                      if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                          ...errorsStr, beneficiary_street: {status:true, message: "You have entered an unavailable character"}
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
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                              ...errorsStr, beneficiary_postal_code: {status:true, message: "You have entered an unavailable character"}
                            })
                          }
                          }
                      name="beneficiary_postal_code"  placeholder="Enter beneficiary postal code"  />
                      {errorsStr.beneficiary_postal_code.status && <span className="invalid">{errorsStr.beneficiary_postal_code.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                   BANK NAME *
                  </Label>
                  <div className="form-control-wrap">
                    <input className="form-control " 
                        value={formData.bank_name} 
                        onChange = { e => {
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                              ...errorsStr, bank_name: {status:true, message: "You have entered an unavailable character"}
                            })
                          }
                          }
                    name="bank_name"  placeholder="Enter bank name" />
                  {errorsStr.bank_name.status && <span className="invalid">{errorsStr.bank_name.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                  BANK ACCUNT NUMBER/IBAN *
                  </Label>
                  <div className="form-control-wrap">
                    <input className="form-control " 
                      value={formData.bankaccount_number} 
                      onChange = { e => {
                        if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
                          setFormData({...formData, bankaccount_number: e.target.value}); 
                          if (e.target.value === "")  
                          setErrorsStr({
                            ...errorsStr, bankaccount_number: {message: "This field is required", status:true }
                          });
                          else {
                           setErrorsStr({...errorsStr, bankaccount_number: {status:false}})
                          }
                        } else 
                         setErrorsStr({
                            ...errorsStr, bankaccount_number: {status:true, message: "You have entered an unavailable character"}
                          })
                        }
                        }
                    name="bankaccount_number"  placeholder="Enter bank account number"  />
                    {errorsStr.bankaccount_number.status && <span className="invalid">{errorsStr.bankaccount_number.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    BANK COUNTRY *
                  </Label>
                      <div className="form-control-wrap">
                          <select id="bank_country" name="bank_country"  className="form-control"
                            ref={register({ required: "This field is required", validate: (value) => value !== "noselect" || `Please select a bank country` })}
                          >
                              <option value="noselect" >Select a bank country</option>
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
                        {errors.bank_country && <span className="invalid">{errors.bank_country.message}</span>}
                      </div>
                </FormGroup>
                <FormGroup >
                  <Label className="form-label">
                    BANK ADDRESS *
                  </Label>
                  <div className="form-control-wrap">
                    <input className="form-control "
                     value={formData.bankstreet_address} 
                     onChange = { e => {
                      if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                          ...errorsStr, bankstreet_address: {status:true, message: "You have entered an unavailable character"}
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
                      if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                          ...errorsStr, bankpostal_code: {status:true, message: "You have entered an unavailable character"}
                        })
                      }
                      }
                    
                    name="bankpostal_code"  placeholder="Enter bank postal code"   />
                  {errorsStr.bankpostal_code.status && <span className="invalid">{errorsStr.bankpostal_code.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                    SWIFT/BIC CODE *
                  </Label>
                  <div className="form-control-wrap">
                    <input className="form-control "  
                     value={formData.swift_code} 
                     onChange = { e => {
                      if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
                        setFormData({...formData, swift_code: e.target.value}); 
                        if (e.target.value === "")  
                        setErrorsStr({
                          ...errorsStr, swift_code: {message: "This field is required", status:true }
                        });
                        else {
                         setErrorsStr({...errorsStr, swift_code: {status:false}})
                        }
                      } else 
                       setErrorsStr({
                          ...errorsStr, swift_code: {status:true, message: "You have entered an unavailable character"}
                        })
                      }
                      }
                    
                    name="swift_code" placeholder="Enter swift/bic code"  />
                    {errorsStr.swift_code.status && <span className="invalid">{errorsStr.swift_code.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                    REFERENCE CODE
                  </Label>
                  <div className="form-control-wrap">
                    <input className="form-control " name="reference_code"
                      onChange = { e => {
                        if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
                          setFormData({...formData, reference_code: e.target.value}); 
                           setErrorsStr({...errorsStr, reference_code: {status:false}})
                        } else 
                         setErrorsStr({
                            ...errorsStr, reference_code: {status:true, message: "You have entered an unavailable character"}
                          })
                        }
                        }
                      placeholder="Enter reference code"  />
                      {errorsStr.reference_code.status && <span className="invalid">{errorsStr.reference_code.message}</span>}

                  </div>
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    INTERMEDIARY BANK NAME *
                  </Label>
                  <div className="form-control-wrap">
                      <input className="form-control "  
                      value={formData.intermediarybank_name} 
                      onChange = { e => {
                        if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                            ...errorsStr, intermediarybank_name: {status:true, message: "You have entered an unavailable character"}
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
                      if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                          ...errorsStr, intermediarybank_number: {status:true, message: "You have entered an unavailable character"}
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
                      if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                          ...errorsStr, intermediarybank_address: {status:true, message: "You have entered an unavailable character"}
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
                          if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) !== null || e.target.value === "" ) {
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
                              ...errorsStr, intermediarybank_swiftcode: {status:true, message: "You have entered an unavailable character"}
                            })
                          }
                          }
                        name="intermediarybank_swiftcode"  placeholder="Enter intermediary bank swift/bic code"   />
                      {errorsStr.intermediarybank_swiftcode.status && <span className="invalid">{errorsStr.intermediarybank_swiftcode.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <label className="form-label">AMOUNT *</label>
                  <div className="form-control-wrap">
                    <input
                      type = "text"
                      value={formData.amount}
                      className="form-control "
                      placeholder="0.00 USD"
                      onChange={(e) =>{ if(e.target.value.match(/^[0-9]*\.?[0-9]*$/) || e.target.value === "") setFormData({ ...formData, amount: e.target.value })} }
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
                      <span className="w-50">Available Balance</span> : <span className="ml-auto">{availableAmount === -1 ? <Spinner size="sm" color="dark" />: Helper.limitDecimal(availableAmount, 2)}</span>
                    </li>
                    <li>
                      <span className="w-50">Minimum amount</span> : <span className="ml-auto">{Helper.limitDecimal(minimumAmount, 2)}</span>
                    </li>
                    <li>
                      <span className="w-50"  >Fees
                        <Button onClick={e => {e.preventDefault();}} id="PopoverDismisable" style={{fontSize: "12px",marginLeft:"7px", textDecoration:"underline"}}>
                            Notes
                        </Button>
                        <UncontrolledPopover target="PopoverDismisable" trigger="focus">
                          <PopoverHeader>The fee is determined by the amount.</PopoverHeader>
                          <PopoverBody>
                              From 10,000 USD To 50,000 USD &nbsp;&nbsp;           : 8%<br/>
                              From 50,001 USD To 150,000 USD                      : 7%<br/>
                              From 150,001 USD &emsp;&emsp;&emsp;&emsp;&nbsp; : 6%<br/>
                          </PopoverBody>
                        </UncontrolledPopover>
                      </span>
                       : <span className="ml-auto">{Helper.limitDecimal(fees, 2)}</span>
                    </li>
                    <li>
                      <span className="w-50">To receive</span> : <span className="ml-auto">{Helper.limitDecimal(receiveAmount, 2)}</span>
                    </li>
                  </ul>
                </div>
              </Col>
          </Row>
            <div className="text-center pt-5">
                <FormGroup>
                <Button type="submit" color="primary" size="lg" className="btn-block">
                  {loading ? <Spinner size="sm" color="light" /> : "SUBMIT"}
                </Button>
                </FormGroup>
              </div>
          </form>
        </div>
      </Block>
    </React.Fragment>
  );
};
export default RequestWire;
