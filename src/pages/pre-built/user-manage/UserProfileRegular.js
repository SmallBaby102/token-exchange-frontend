import React, {
  useEffect,
  useState,
} from 'react';

import { parseISO } from 'date-fns';
import DatePickerMobile from 'react-mobile-datepicker'
import DatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { toast } from 'react-toastify';
import {
  FormGroup,
  Label,
  Spinner,
} from 'reactstrap';

import {
  setChecking,
  setCurrentUser,
} from '../../../actions';
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  Col,
  Icon,
  Row,
  RSelect,
} from '../../../components/Component';
import Head from '../../../layout/head/Head';
import { myServerApi } from '../../../utils/api';
import { fromStringTodateFormatter, dateFormatterWithdoutTime } from '../../../utils/Utils';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
const UserProfileRegularPage = ({setProfileProgress, sm, updateSm, setProfileName }) => {
  const dispatch = useDispatch();
  const myApi = myServerApi(); 
  const currentUser = useSelector((state) => state.user.user);
  let verification_status = currentUser?.verification_status;
  if (verification_status === null || verification_status === undefined)
  {
    verification_status = "0";
  }
  const email = localStorage.getItem("username"); //useSelector((state) => state.user.user.username)
  const { handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    department: "Individual",
    // individual relative state
    firstname: "",
    lastname: "",
    birthday: null,
    issue_date: null,
    exp_date: null,
    issue_country: "",
    title : "",
    gener : "",
    marriage: "",
    occupation: "",
    address: "",
    // id_cardtype: "",
    id_number: "",
    // id_issuer: "",
    // city: "",
    country: "",
    // prefecture: "",
    postal_code: "",
    cellphone_number: "",
    country_code: "",

    // corporate relative state
    company_name: "",
    director_name: "",
    company_address: "",
    // company_city: "",
    company_country: "",
    // company_prefecture: "",
    company_postal_code: "",
    company_country_code: "",
    company_cellphone_number: "",
  });
  const profileOptions = {
    title       : [{value: "Mr.", label: "Mr."},{value: "Ms.", label: "Ms."}],
    gener       : [{value: "Male", label: "Male"},{value: "Female", label: "Female"}],
    marriage    : [{value: "Single", label: "Single"}, {value: "Married", label: "Married"}],
    occupation  : [{value: "CEO", label: "CEO"}, {value: "Director", label: "Director"}, {value: "Employee", label: "Employee"}, {value: "Housewife", label: "Housewife"}, {value: "Student", label: "Student"}, {value: "Other", label: "Other"}],
  };
  let country_code_json = {"+1":"United States(+1)", "+93":"Afghanistan(+93)","+355":"Albania(+355)","+213":"Algeria(+213)","+376":"Andorra(+376)","+244":"Angola(+244)","+268":"Antigua and Barbuda(+268)","+54":"Argentina(+54)","+374":"Armenia(+374)","+63":"Philippines(+63)","+43":"Austria(+43)","+994":"Azerbaijan(+994)","+242":"Congo(+242)","+973":"Bahrain(+973)","+880":"Bangladesh(+880)","+246":"Barbados(+246)","+375":"Belarus(+375)","+32":"Belgium(+32)","+501":"Belize(+501)","+229":"Benin(+229)","+975":"Bhutan(+975)","+591":"Bolivia(+591)","+387":"Bosnia and Herzegovina(+387)","+55":"Brazil(+55)","+673":"Brunei(+673)","+359":"Bulgaria(+359)","+226":"Burkina Faso(+226)","+257":"Burundi(+257)","+238":"Cabo Verde(+238)","+855":"Cambodia(+855)","+237":"Cameroon(+237)","+1_ca":"Canada(+1)","+236":"Central African Republic(+236)","+235":"Chad(+235)","+56":"Chile(+56)","+86":"China(+86)","+57":"Colombia(+57)","+269":"Comoros(+269)","+506":"Costa Rica(+506)","+225":"Cote d'Ivoire(+225)","+385":"Croatia(+385)","+53":"Cuba(+53)","+357":"Cyprus(+357)","+420":"Czech Republic(+420)","+45":"Denmark(+45)","+253":"Djibouti(+253)","+767":"Dominica(+767)","+809":"Dominican Republic(+809)","+670":"East Timor(+670)","+20":"Egypt(+20)","+503":"El Salvador(+503)","+240":"Equatorial Guinea(+240)","+291":"Eritrea(+291)","+372":"Estonia(+372)","+679":"Fiji(+679)","+358":"Finland(+358)","+33":"France(+33)","+241":"Gabon(+241)","+220":"Gambia(+220)","+995":"Georgia(+995)","+49":"Germany(+49)","+233":"Ghana(+233)","+30":"Greece(+30)","+473":"Grenada(+473)","+502":"Guatemala(+502)","+224":"Guinea(+224)","+245":"Guinea-Bissau(+245)","+592":"Guyana(+592)","+509":"Haiti(+509)","+504":"Honduras(+504)","+36":"Hungary(+36)","+354":"Iceland(+354)","+91":"India(+91)","+62":"Indonesia(+62)","+964":"Iraq(+964)","+353":"Ireland(+353)","+972":"Israel(+972)","+39":"Italy(+39)","+876":"Jamaica(+876)","+81":"Japan(+81)","+962":"Jordan(+962)","+7_kaz":"Kazakhstan(+7)","+254":"Kenya(+254)","+686":"Kiribati(+686)","+82":"South Korea(+82)","+383":"Kosovo(+383)","+965":"Kuwait(+965)","+996":"Kyrgyzstan(+996)","+856":"Laos(+856)","+371":"Latvia(+371)","+961":"Lebanon(+961)","+266":"Lesotho(+266)","+231":"Liberia(+231)","+218":"Libya(+218)","+423":"Liechtenstein(+423)","+370":"Lithuania(+370)","+352":"Luxembourg(+352)","+389":"Macedonia(+389)","+261":"Madagascar(+261)","+265":"Malawi(+265)","+960":"Maldives(+960)","+223":"Mali(+223)","+356":"Malta(+356)","+692":"Marshall Islands(+692)","+222":"Mauritania(+222)","+230":"Mauritius(+230)","+52":"Mexico(+52)","+691":"Federated States of Micronesia(+691)","+373":"Moldova(+373)","+377":"Monaco(+377)","+976":"Mongolia","+382":"Montenegro(+382)","+258":"Mozambique(+258)","+95":"Myanmar(+95)","+264":"Namibia(+264)","+674":"Nauru(+674)","+977":"Nepal(+977)","+31":"Netherlands(+31)","+64":"New Zealand(+64)","+505":"Nicaragua(+505)","+227":"Niger(+227)","+234":"Nigeria(+234)","+47":"Norway(+47)","+968":"Oman(+968)","+680":"Palau(+680)","+507":"Panama(+507)","+675":"Papua New Guinea(+675)","+595":"Paraguay(+595)","+51":"Peru(+51)","+48":"Poland(+48)","+351":"Portugal(+351)","*974":"Qatar(+974)","+40":"Romania(+40)","+7":"Russia(+7)","+250":"Rwanda(+250)","+869":"Saint Kitts and Nevis(+869)","+758":"Saint Lucia(+758)","+784":"Saint Vincent and the Grenadines(+784)","+685":"Samoa(+685)","+378":"San Marino(+378)","+239":"Sao Tome and Principe(+239)","+966":"Saudi Arabia(+966)","+221":"Senegal(+221)","+248":"Seychelles(+248)","+232":"Sierra Leone(+232)","+65":"Singapore(+65)","+421":"Slovakia(+421)","+386":"Slovenia(+386)","+677":"Solomon Islands(+677)","+252":"Somalia(+252)","+27":"South Africa(+27)","+34":"Spain(+34)","+249":"Sudan(+249)","+211":"South Sudan(+211)","+597":"Suriname(+597)","+268_swa":"Swaziland(+268)","+46":"Sweden(+46)","+41":"Switzerland(+41)","+886":"Taiwan(+886)","+992":"Tajikistan(+992)","+255":"Tanzania(+255)","+66":"Thailand(+66)","+228":"Togo(+228)","+676":"Tonga(+676)","+90":"Turkey(+90)","+993":"Turkmenistan(+993)","+688":"Tuvalu(+688)","+256":"Uganda(+256)","+380":"Ukraine(+380)","+971":"United Arab Emirates(+971)","+44":"United Kingdom(+44)","+598":"Uruguay(+598)","+998":"Uzbekistan(+998)","+678":"Vanuatu(+678)","+379":"Vatican City(+379)","+58":"Venezuela(+58)","+84":"Vietnam(+84)","+260":"Zambia(+260)"};
  let country_code_arr = [];
  for (const key in country_code_json) {
    if (Object.hasOwnProperty.call(country_code_json, key)) {
      const element = country_code_json[key];
      country_code_arr.push({value: key, label: element});
    }
  }

  const handleFormSubmit = () => {
    if (verification_status !== "0"){
      return;
    }
    setLoading(true);
    
    let data = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      department: formData.department,
      username: email,
      // title : formData.title,
      gener : formData.gener,
      // marriage: formData.marriage,
      // occupation: formData.occupation,
      birthday: formData.birthday,
      // id_cardtype: formData.id_cardtype, 
      id_number: formData.id_number,
      issue_date: formData.issue_date,
      exp_date: formData.exp_date,
      issue_country: formData.issue_country,
      // id_issuer: formData.id_issuer,
      country: formData.country,
      address: formData.address,
      // city: formData.city,
      // prefecture: formData.prefecture,
      postal_code: formData.postal_code,
      country_code: formData.country_code,
      cellphone_number: formData.cellphone_number,
    }
    if (formData.department === "Corporate") {
      data = {...data, ...{
          director_name: formData.director_name,
          company_name: formData.company_name,
          company_address: formData.company_address,
          company_cellphone_number: formData.company_cellphone_number,
          // company_city: formData.company_city,
          company_country: formData.company_country,
          company_country_code: formData.company_country_code,
          company_postal_code: formData.company_postal_code,
          // company_prefecture: formData.company_prefecture,
        }
      };
    }
    myApi.put('profile', data).then(res => {
      setLoading(false);
      if(res.data.success){
        toast.success("Successfully saved");
        dispatch(setCurrentUser(res.data.user));
        setProfileProgress(true);
        const resUser = res.data.user;
        setProfileName(resUser.firstname + " " + resUser.lastname);
        if(resUser){
          if(!resUser.department) {
            setProfileProgress(false);
          }
          else
          {
            if (resUser.department === "Individual") {
              for (const key in resUser) {
                if (key === "verification_status" || key === "deposit_address" || key === "company_name" || key === "company_address" 
                || key === "company_country" ||  key === "company_country_code"|| key === "company_postal_code"|| key === "company_cellphone_number"|| key === "director_name" )
                  continue;
                  if (key === "country" || key === "issue_country") {
                    if (resUser[key] === "noselect") {
                      setProfileProgress(false);
                      break;
                    }  
                  }
                  
                  if (resUser[key] === "" || null) {
                    console.log("in-invalide key", key);
                    setProfileProgress(false);
                    break;
                  }
              }
              

            } else {
              for (const key in resUser) {
                if (key === "verification_status" || key === "deposit_address")
                  continue;
                if (key === "country" || key === "issue_country" || key === "company_country") {
                  if (resUser[key] === "noselect") {
                    setProfileProgress(false);
                    break;
                  }  
                }
                if (resUser[key] === "" || null) {
                  console.log("cor-invalide key", key);
                    setProfileProgress(false);
                    break;
                  }
              }
      
            }
          }
        
        }
        else{
          toast.error("Failed");
        }

      }
    })
    .catch(err => {
      toast.error("Failed");
      setLoading(false);
      });
  };
  useEffect(() => {
      dispatch(setChecking(true));
      myApi.get(`profile/${email}`).then(res => {
      let user = res.data.data;
      if(user !== "")
      {  
        let tempUser = {
          verification_status: user.verification_status,
          department: (user.department !== null) ? user.department : "Individual",
          // individual relative state
          firstname: user.firstname,
          lastname: user.lastname,
          birthday: (user.birthday !== "" && user.birthday !== null) ? (user.birthday) : null,
          issue_date: (user.issue_date !== "" && user.issue_date !== null) ?(user.issue_date) : null,
          exp_date: (user.exp_date !== "" && user.exp_date !== null) ? (user.exp_date) : null,
          issue_country: user.issue_country,
          // title : user.title,
          gener : user.gener,
          // marriage: user.marriage,
          // occupation: user.occupation,
          address: user.address,
          // id_cardtype: "",
          id_number: user.id_number,
          // id_issuer: user.id_issuer,
          // city: user.city,
          country: user.country,
          // prefecture: user.prefecture,
          postal_code: user.postal_code,
          cellphone_number: user.cellphone_number,
          country_code: user.country_code,
      
          // corporate relative state
          company_name: user.company_name,
          director_name: user.director_name,
          company_address: user.company_address,
          // company_city: user.company_city,
          company_country: user.company_country,
          // company_prefecture: user.company_prefecture,
          company_postal_code: user.company_postal_code,
          company_country_code: user.company_country_code,
          company_cellphone_number: user.company_cellphone_number,
        };
        setProfileName(user.firstname + " " + user.lastname);
        setFormData(tempUser);
        dispatch(setCurrentUser(tempUser));
        if(user){
          setProfileProgress(true);
          console.log(user)
          if(!user.department) {
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
                      setProfileProgress(false);
                      break;
                    }  
                  }
                  
                  if (user[key] === "" || user[key] == null) {
                    console.log("in-invalide key", key);
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

                    setProfileProgress(false);
                    break;
                  }  
                }
                if (user[key] === "" || user[key] == null) {
                  console.log("cor-invalide key", key);
                    setProfileProgress(false);
                    break;
                  }
              }
      
            }
          }
        
        }
        else{
          toast.error("Failed");
        }
          
      }
      dispatch(setChecking(false));
    })
    .catch(err => {
      // toast.error("Database not found");
      console.log('error: ', err);
      dispatch(setChecking(false));
      });
  }, []);
  // For DatePicker
  const [state, setState] = useState({
    time: new Date(),
    isOpen: false,
    isOpen1: false,
    isOpen2: false,
    theme: 'default',
  })

  const handleToggle = (isOpen) => () => {
      setState({ isOpen });
  }
  const handleToggle1 = (isOpen1) => () => {
      setState({ isOpen1 });
  }
  const handleToggle2 = (isOpen2) => () => {
      setState({ isOpen2 });
  }
  const handleThemeToggle = (theme) => () => {
    if (verification_status === "0")
      setState({ theme, isOpen: true });
  }
  const handleThemeToggle1 = (theme) => () => {
    if (verification_status === "0")
      setState({ theme, isOpen1: true });
  }
  const handleThemeToggle2 = (theme) => () => {
    if (verification_status === "0")
      setState({ theme, isOpen2: true });
  }
  return (
    <React.Fragment>
      <Head title="User Profile"></Head>
      <BlockHead size="lg">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle tag="h4">Personal Information</BlockTitle>
            <BlockDes>
              <p>Basic info, like your name and address, that you use on Platform.</p>
            </BlockDes>
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
      <Block>
        <div className="nk-data data-list">
        <form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
          <Row className="gy-4">
              <Col md="6">
              <FormGroup>
                    <Row className="gy-4">
                    <Col md="4">
                      <div className="g">
                        <div className="custom-control custom-control-lg custom-radio">
                          <input
                            disabled= {verification_status !== "0"}
                            type="radio"
                            className="custom-control-input form-control"
                            name="department"
                            id="Individual"
                            checked = {formData.department === "Individual" ? true: false}
                            onChange={(e) => {setFormData({...formData,  department: "Individual"}); } }
                          />
                          <label className="custom-control-label" htmlFor="Individual">
                            Individual
                          </label>
                        </div>
                      </div>
                      </Col>
                      <Col md="8">
                      <div className="g">
                        <div className="custom-control custom-control-lg custom-radio">
                          <input
                            disabled= {verification_status !== "0"}
                            type="radio"
                            className="custom-control-input form-control"
                            name="department"
                            id="Corporate"
                            checked = {formData.department === "Corporate" ? true: false}
                            onChange={(e) => setFormData({...formData, department: "Corporate"})}
                          />
                          <label className="custom-control-label" htmlFor="Corporate">
                              Corporate
                          </label>
                        </div>
                      </div>
                      </Col>
                    </Row>
                </FormGroup>
                {/* <FormGroup>
                  <Label className="form-label">
                    Title
                  </Label>
                  <RSelect options={profileOptions.title} 
                            isDisabled= {verification_status !== "0"}
                            value={{value: formData.title, label: formData.title}}  onChange={(e) => setFormData({...formData, title: e.value})} placeholder="Select Title" className="form-control-outlined"/>
                </FormGroup> */}
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                      First Name
                  </Label>
                  <input 
                    disabled= {verification_status !== "0"}
                    className="form-control " name="firstname" value={formData.firstname} 
                    onChange = { e => { 
                      if (e.target.value.match(/^[A-Za-z ]+$/) != null || e.target.value === "" ) {
                        setFormData({...formData, firstname: e.target.value}) ;
                      }}}
                    placeholder="Enter first name" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                      Last Name
                  </Label>
                  <input className="form-control " 
                            disabled= {verification_status !== "0"}
                            name="lastname" value={formData.lastname} 
                            onChange = { e => { 
                              if (e.target.value.match(/^[A-Za-z ]+$/) != null || e.target.value === "" ) {
                                setFormData({...formData, lastname: e.target.value}) ;
                              }}}
                            placeholder="Enter last name" />
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    Gener
                  </Label>
                  <RSelect options={profileOptions.gener} 
                            isDisabled= {verification_status !== "0"}
                            value={{value: formData.gener, label: formData.gener}}  onChange={(e) => setFormData({...formData, gener: e.value})} placeholder="Select gener" className="form-control-outlined"/>
                </FormGroup>
                {/* <FormGroup>
                  <Label className="form-label">
                    Marriage
                  </Label>
                    <RSelect options={profileOptions.marriage} 
                            isDisabled= {verification_status !== "0"}
                            name="marriage" value={{value: formData.marriage, label: formData.marriage}} onChange={(e) => setFormData({...formData, marriage: e.value})} placeholder="Select Marriage status" className="form-control-outlined"/>
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    Occupation
                  </Label>
                    <RSelect options={profileOptions.occupation} 
                            isDisabled= {verification_status !== "0"}
                            value={{value: formData.occupation, label: formData.occupation}}  name="occupation" onChange={(e) => setFormData({...formData, occupation: e.value})} placeholder="Select Occupation" className="form-control-outlined"/>
                </FormGroup> */}
                <FormGroup className="d-none d-md-block">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <DesktopDatePicker
                          disabled= {verification_status !== "0"}
                          label="Birthday"
                          inputFormat="dd/MM/yyyy"
                          value={formData.birthday}
                          onChange={(date) => {setFormData({ ...formData, birthday:  date.toISOString().slice(0,10) }) }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                        </Stack>
                    </LocalizationProvider>
                </FormGroup>
                <FormGroup className='d-md-none'>
                    <label className="form-label">Birthday</label>
                    <input disabled= {verification_status !== "0"}
                      className="form-control" value={fromStringTodateFormatter(formData.birthday, true)}/>
                    <a
                        style={{opacity: "0", width:"100%", position:"absolute", bottom: "0", height: "40px"}}
                        className="select-btn sm"
                        onClick={handleThemeToggle('default')}>
                        Select Date
                    </a>
                    <DatePickerMobile
                      theme={state.theme}
                      isOpen={state.isOpen}
                      value={formData.birthday !== null ? new Date(formData.birthday) : new Date()}
                      showCaption
                        headerFormat="DD/MM/YYYY"
                        confirmText="Set"
                        cancelText="Cancel"
                        dateConfig={{
                        'date': {
                          format: 'D',
                          caption: 'Day',
                          step: 1,
                          },
                          'month': {
                              format: 'M',
                              caption: 'Month',
                              step: 1,
                          },
                          'year': {
                            format: 'YYYY',
                            caption: 'Year',
                            step: 1,
                          },
                      }}
                    onSelect={(date) => {setFormData({ ...formData, birthday: date.toISOString().slice(0,10) }); setState({isOpen1:false})}}
                    onCancel={handleToggle(false)} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                     Id Number (Passport/Drivers License/National ID) 
                  </Label>
                  <input className="form-control " 
                            disabled= {verification_status !== "0"}
                            name="id_number" value={formData.id_number} onChange={(e) => setFormData({...formData, id_number: e.target.value})} placeholder="Enter Id number" type="text" />
                </FormGroup>
                <FormGroup>
                  <Row className="gy-4">
                      <Col md="6">
                        <FormGroup className="d-none d-md-block">
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3}>
                              <DesktopDatePicker
                                disabled= {verification_status !== "0"}
                                label="Issue Date"
                                inputFormat="dd/MM/yyyy"
                                value={formData.issue_date}
                                onChange={(date) => {setFormData({ ...formData, issue_date: date.toISOString().slice(0,10)}) }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                              </Stack>
                          </LocalizationProvider>
                        </FormGroup>
                        <FormGroup className='d-md-none'>
                            <label className="form-label">Issue Date</label>
                            <input disabled= {verification_status !== "0"}
                              className="form-control" value={fromStringTodateFormatter(formData.issue_date, true)}/>
                            <a
                                style={{opacity: "0", width:"100%", position:"absolute", bottom: "0", height: "40px"}}
                                className="select-btn sm"
                                onClick={handleThemeToggle1('default')}>
                                Select Date
                            </a>
                            <DatePickerMobile
                              theme={state.theme}
                              isOpen={state.isOpen1}
                              value={formData.issue_date !== null ? new Date(formData.issue_date) : new Date()}
                              showCaption
                              headerFormat="DD/MM/YYYY"
                              confirmText="Set"
                              cancelText="Cancel"
                              dateConfig={{
                                'date': {
                                  format: 'D',
                                  caption: 'Day',
                                  step: 1,
                                  },
                                  'month': {
                                      format: 'M',
                                      caption: 'Month',
                                      step: 1,
                                  },
                                  'year': {
                                    format: 'YYYY',
                                    caption: 'Year',
                                    step: 1,
                                  },
                              }}
                            onSelect={(date) => {setFormData({ ...formData, issue_date: date.toISOString().slice(0,10) }); setState({isOpen1:false})}}
                            onCancel={handleToggle1(false)} />
                        </FormGroup>
                      </Col>
                      <Col md="6">
                          <FormGroup className="d-none d-md-block">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <Stack spacing={3}>
                                <DesktopDatePicker
                                  disabled= {verification_status !== "0"}
                                  label="Expireation Date"
                                  inputFormat="dd/MM/yyyy"
                                  value={formData.exp_date}
                                  onChange={(date) => {setFormData({ ...formData, exp_date: date.toISOString().slice(0,10) }) }}
                                  renderInput={(params) => <TextField {...params} />}
                                />
                                </Stack>
                            </LocalizationProvider>
                        </FormGroup>
                        <FormGroup className='d-md-none'>
                          <label className="form-label">Expiration date</label>
                          <input disabled= {verification_status !== "0"}
                            className="form-control" value={fromStringTodateFormatter(formData.exp_date, true)}/>
                          <a
                              style={{opacity: "0", width:"100%", position:"absolute", bottom: "0", height: "40px"}}
                              className="select-btn sm"
                              onClick={handleThemeToggle2('default')}>
                              Select Date
                          </a>
                          <DatePickerMobile
                            theme={state.theme}
                            isOpen={state.isOpen2}
                            showCaption
                            value={formData.exp_date !== null ? new Date(formData.exp_date) : new Date()}
                            headerFormat="DD/MM/YYYY"
                            confirmText="Set"
                            cancelText="Cancel"
                            dateConfig={{
                              'date': {
                                format: 'D',
                                caption: 'Day',
                                step: 1,
                                },
                                'month': {
                                    format: 'M',
                                    caption: 'Month',
                                    step: 1,
                                },
                                'year': {
                                  format: 'YYYY',
                                  caption: 'Year',
                                  step: 1,
                                },
                            }}
                          onSelect={(date) => {setFormData({ ...formData, exp_date: date.toISOString().slice(0,10) }); setState({isOpen1:false})}}
                          onCancel={handleToggle2(false)} />
                      </FormGroup>
                      </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    Issue Country
                  </Label>
                      <div className="form-control-wrap">
                          <select id="issue_country" name="issue_country" 
                          disabled= {verification_status !== "0"}
                          value={formData.issue_country} onChange={(e) => setFormData({...formData, issue_country: e.target.value})} className="form-control"
                            // ref={register({ required: "This field is required", validate: (value) => value !== "noselect" || `Please select a country` })}
                          >
                              <option value="noselect" >Select Country</option>
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
                        {/* {errors.country && <span className="invalid">{errors.country.message}</span>} */}
                      </div>
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                   Home Address
                  </Label>
                  <input className="form-control " 
                  disabled= {verification_status !== "0"}
                  name="address" onChange={(e) => setFormData({...formData, address: e.target.value})} value={formData.address} placeholder="Enter the home address" />
                </FormGroup>
                {/* <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                    City/Municipality
                  </Label>
                  <input className="form-control " 
                  disabled= {verification_status !== "0"}
                  name="city" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}  placeholder="Enter City/Municipality" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                    Prefecture
                  </Label>
                  <input className="form-control "
                  disabled= {verification_status !== "0"}
                  name="prefecture" value={formData.prefecture} onChange={(e) => setFormData({...formData, prefecture: e.target.value})} placeholder="Enter Prefecture" />
                </FormGroup> */}
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                    Postal Code
                  </Label>
                  <input className="form-control " 
                  disabled= {verification_status !== "0"}
                  name="postal_code" value={formData.postal_code} placeholder="Enter Postal Code"  onChange={(e) => setFormData({...formData, postal_code: e.target.value})} type="text" />
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    Country
                  </Label>
                      <div className="form-control-wrap">
                          <select id="country" name="country" 
                  disabled= {verification_status !== "0"}
                  value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="form-control"
                            // ref={register({ required: "This field is required", validate: (value) => value !== "noselect" || `Please select a country` })}
                          >
                              <option value="noselect" >Select Country</option>
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
                        {/* {errors.country && <span className="invalid">{errors.country.message}</span>} */}
                      </div>
                </FormGroup>
                {/* <FormGroup>
                    <Label className="form-label">
                      ID CARD TYPE
                    </Label>
                    <Row className="gy-4">
                    <Col md="4">
                      <div className="g">
                        <div className="custom-control custom-control-lg custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input form-control"
                            name="id_cardtype"
                            id="customRadio5"
                            checked = {formData.id_cardtype === "passport" ? true: false}
                            onChange={(e) => {setFormData({...formData,  id_cardtype: "passport"}); } }
                          />
                          <label className="custom-control-label" htmlFor="customRadio5">
                            Passport
                          </label>
                        </div>
                      </div>
                      </Col>
                      <Col md="8">
                      <div className="g">
                        <div className="custom-control custom-control-lg custom-radio">
                          <input
                            type="radio"
                            className="custom-control-input form-control"
                            name="id_cardtype"
                            id="customRadio6"
                            checked = {formData.id_cardtype === "driving_license" ? true: false}
                            onChange={(e) => setFormData({...formData, id_cardtype: "driving_license"})}
                          />
                          <label className="custom-control-label" htmlFor="customRadio6">
                              ID(Driving License,etc.)
                          </label>
                        </div>
                      </div>
                      </Col>
                    </Row>
                </FormGroup> */}
                <Row>
                   <Col md="6">
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                        Phone Number
                      </Label>
                      <RSelect options={country_code_arr}
                  isDisabled= {verification_status !== "0"}
                  value={{value: formData.country_code, label: formData.country_code}}  onChange={(e) =>  setFormData({...formData, country_code: e.label})} placeholder="Select phone Country Code" className="form-control-outlined"/>
                    </FormGroup>
                   </Col>
                    <Col md="6" >
                      <FormGroup style={{marginTop: "8px"}}>
                        <Label htmlFor="default-5" className="form-label">
                        </Label>
                        <input className="form-control "
                          disabled= {verification_status !== "0"}
                          name="cellphone_number" value={formData.cellphone_number} placeholder="Enter the phone Number"  
                          onKeyPress= { (evt) =>
                            {
                              if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
                              {
                                  evt.preventDefault();
                              }
                            }
                          }
                          onChange={(e) => setFormData({...formData, cellphone_number: e.target.value})} type="number" />
                      </FormGroup>
                    </Col>
                </Row>
                
                
                <div className="text-center pt-5">
                    <FormGroup>
                    <Button type="submit" 
                      disabled= {verification_status !== "0"}
                      color="primary" size="lg" className="btn-block">
                      {loading ? <Spinner size="sm" color="light" /> : "Update"}
                    </Button>
                    </FormGroup>
                  </div>
              </Col>
              {/* corporate relative components */}
              {formData.department === "Corporate" &&
              <Col md="6"  >
                <FormGroup style={{marginTop:"53px"}}>
                  <Label className="form-label">
                    Company name
                  </Label>
                  <input className="form-control "
                  disabled= {verification_status !== "0"}
                  name="company_name" onChange={(e) => setFormData({...formData, company_name: e.target.value})} value={formData.company_name} placeholder="Enter your company name" />
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    Director Name
                  </Label>
                  <input className="form-control "
                  disabled= {verification_status !== "0"}
                  name="director_name" onChange={(e) => setFormData({...formData, director_name: e.target.value})} value={formData.director_name} placeholder="Enter the director name" />
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    Company Address
                    </Label>
                  <input className="form-control "
                  disabled= {verification_status !== "0"}
                  name="company_address" onChange={(e) => setFormData({...formData, company_address: e.target.value})} value={formData.company_address} placeholder="Enter the company address" />
                </FormGroup>
                {/* <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                    City/Municipality
                  </Label>
                  <input className="form-control "
                  disabled= {verification_status !== "0"}
                  name="company_city" value={formData.company_city} onChange={(e) => setFormData({...formData, company_city: e.target.value})}  placeholder="Enter the company City/Municipality" />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                    Prefecture
                  </Label>
                  <input className="form-control "
                  disabled= {verification_status !== "0"}
                  name="company_prefecture" value={formData.company_prefecture} onChange={(e) => setFormData({...formData, company_prefecture: e.target.value})} placeholder="Enter the company Prefecture" />
                </FormGroup> */}
                <FormGroup>
                  <Label htmlFor="default-5" className="form-label">
                    Postal Code
                  </Label>
                  <input className="form-control "
                  disabled= {verification_status !== "0"}
                  name="company_postal_code" value={formData.company_postal_code} placeholder="Enter the company Postal Code"  onChange={(e) => setFormData({...formData, company_postal_code: e.target.value})} type="text" />
                </FormGroup>
                <FormGroup>
                  <Label className="form-label">
                    Company Country
                  </Label>
                      <div className="form-control-wrap">
                          <select id="company_country" 
                  disabled= {verification_status !== "0"}
                  name="company_country" value={formData.company_country} onChange={(e) => setFormData({...formData, company_country: e.target.value})} className="form-control"
                            // ref={register({ required: "This field is required", validate: (value) => value !== "noselect" || `Please select a country` })}
                          >
                              <option value="noselect" >Select Country</option>
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
                        {/* {errors.country && <span className="invalid">{errors.country.message}</span>} */}
                      </div>
                </FormGroup>
                <Row>
                   <Col md="6">
                    <FormGroup>
                      <Label htmlFor="default-5" className="form-label">
                        Phone Number
                      </Label>
                      <RSelect options={country_code_arr} 
                      isDisabled= {verification_status !== "0"}
                      value={{value: formData.company_country_code, label: formData.company_country_code}}  
                      onChange={(e) =>  
                      {
                        
                            setFormData({...formData, company_country_code: e.label});
                        }
                      } 
                    placeholder="Select the company phone Country Code" className="form-control-outlined"/>
                    </FormGroup>
                   </Col>
                    <Col md="6" >
                      <FormGroup style={{marginTop: "8px"}}>
                      <Label htmlFor="default-5" className="form-label" > 
                      </Label>
                        <input className="form-control "
                          disabled= {verification_status !== "0"}
                          name="company_cellphone_number" value={formData.company_cellphone_number} placeholder="Enter the company phone Number"  
                          onChange={(e) => {
                            setFormData({...formData, company_cellphone_number: e.target.value})
                          }} 
                          onKeyPress= { (evt) =>
                            {
                              if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
                              {
                                  evt.preventDefault();
                              }
                            }
                          }
                          type="number" />
                      </FormGroup>
                    </Col>
                </Row>
                
               
              </Col>
              }
          </Row>
          </form>

          
        </div>
      </Block>
    </React.Fragment>
  );
};
export default UserProfileRegularPage;
