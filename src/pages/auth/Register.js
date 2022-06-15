import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FormGroup,
  Spinner,
} from 'reactstrap';

import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  Button,
  Icon,
  PreviewCard,
} from '../../components/Component';
import Head from '../../layout/head/Head';
import PageContainer from '../../layout/page-container/PageContainer';
import { myServerApi } from '../../utils/api';
import Http from '../../utils/Http';
import AuthFooter from './AuthFooter';
import LogoComp from './Logo';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next'

const Register = () => {
  const { t } = useTranslation(); 
  const [cookies, setCookie] = useCookies();
  const history = useHistory();
  const [passState, setPassState] = useState(false);
  const [ passStateConfirm, setPassStateConfirm ] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, register, handleSubmit, watch } = useForm();
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [password, setPassword] = useState("")
  const [password_confirm, setPasswordconfirm] = useState("")
  const [email, setEmail] = useState("")
  const [errorsf, setErrorsf] = useState({
    firstname: { status: false, message : "Only alphabet characters are allowed for 'First Name'",},
    lastname: { status: false, message : "Only alphabet characters are allowed for 'Last Name'",},
    emailfield: { status: false, message : "Please input correct email address",},
    password: { status: false, message : "Must be only alphabetic characters",},
    password_confirm: { status: false, message : "Must be only alphabetic characters",},
  });
  let country_code_json = {"+1":"United States(+1)", "+93":"Afghanistan(+93)","+355":"Albania(+355)","+213":"Algeria(+213)","+376":"Andorra(+376)","+244":"Angola(+244)","+268":"Antigua and Barbuda(+268)","+54":"Argentina(+54)","+374":"Armenia(+374)","+63":"Philippines(+63)","+43":"Austria(+43)","+994":"Azerbaijan(+994)","+242":"Congo(+242)","+973":"Bahrain(+973)","+880":"Bangladesh(+880)","+246":"Barbados(+246)","+375":"Belarus(+375)","+32":"Belgium(+32)","+501":"Belize(+501)","+229":"Benin(+229)","+975":"Bhutan(+975)","+591":"Bolivia(+591)","+387":"Bosnia and Herzegovina(+387)","+55":"Brazil(+55)","+673":"Brunei(+673)","+359":"Bulgaria(+359)","+226":"Burkina Faso(+226)","+257":"Burundi(+257)","+238":"Cabo Verde(+238)","+855":"Cambodia(+855)","+237":"Cameroon(+237)","+1_ca":"Canada(+1)","+236":"Central African Republic(+236)","+235":"Chad(+235)","+56":"Chile(+56)","+86":"China(+86)","+57":"Colombia(+57)","+269":"Comoros(+269)","+506":"Costa Rica(+506)","+225":"Cote d'Ivoire(+225)","+385":"Croatia(+385)","+53":"Cuba(+53)","+357":"Cyprus(+357)","+420":"Czech Republic(+420)","+45":"Denmark(+45)","+253":"Djibouti(+253)","+767":"Dominica(+767)","+809":"Dominican Republic(+809)","+670":"East Timor(+670)","+20":"Egypt(+20)","+503":"El Salvador(+503)","+240":"Equatorial Guinea(+240)","+291":"Eritrea(+291)","+372":"Estonia(+372)","+679":"Fiji(+679)","+358":"Finland(+358)","+33":"France(+33)","+241":"Gabon(+241)","+220":"Gambia(+220)","+995":"Georgia(+995)","+49":"Germany(+49)","+233":"Ghana(+233)","+30":"Greece(+30)","+473":"Grenada(+473)","+502":"Guatemala(+502)","+224":"Guinea(+224)","+245":"Guinea-Bissau(+245)","+592":"Guyana(+592)","+509":"Haiti(+509)","+504":"Honduras(+504)","+36":"Hungary(+36)","+354":"Iceland(+354)","+91":"India(+91)","+62":"Indonesia(+62)","+964":"Iraq(+964)","+353":"Ireland(+353)","+972":"Israel(+972)","+39":"Italy(+39)","+876":"Jamaica(+876)","+81":"Japan(+81)","+962":"Jordan(+962)","+7_kaz":"Kazakhstan(+7)","+254":"Kenya(+254)","+686":"Kiribati(+686)","+82":"South Korea(+82)","+383":"Kosovo(+383)","+965":"Kuwait(+965)","+996":"Kyrgyzstan(+996)","+856":"Laos(+856)","+371":"Latvia(+371)","+961":"Lebanon(+961)","+266":"Lesotho(+266)","+231":"Liberia(+231)","+218":"Libya(+218)","+423":"Liechtenstein(+423)","+370":"Lithuania(+370)","+352":"Luxembourg(+352)","+389":"Macedonia(+389)","+261":"Madagascar(+261)","+265":"Malawi(+265)","+960":"Maldives(+960)","+223":"Mali(+223)","+356":"Malta(+356)","+692":"Marshall Islands(+692)","+222":"Mauritania(+222)","+230":"Mauritius(+230)","+52":"Mexico(+52)","+691":"Federated States of Micronesia(+691)","+373":"Moldova(+373)","+377":"Monaco(+377)","+976":"Mongolia","+382":"Montenegro(+382)","+258":"Mozambique(+258)","+95":"Myanmar(+95)","+264":"Namibia(+264)","+674":"Nauru(+674)","+977":"Nepal(+977)","+31":"Netherlands(+31)","+64":"New Zealand(+64)","+505":"Nicaragua(+505)","+227":"Niger(+227)","+234":"Nigeria(+234)","+47":"Norway(+47)","+968":"Oman(+968)","+680":"Palau(+680)","+507":"Panama(+507)","+675":"Papua New Guinea(+675)","+595":"Paraguay(+595)","+51":"Peru(+51)","+48":"Poland(+48)","+351":"Portugal(+351)","*974":"Qatar(+974)","+40":"Romania(+40)","+7":"Russia(+7)","+250":"Rwanda(+250)","+869":"Saint Kitts and Nevis(+869)","+758":"Saint Lucia(+758)","+784":"Saint Vincent and the Grenadines(+784)","+685":"Samoa(+685)","+378":"San Marino(+378)","+239":"Sao Tome and Principe(+239)","+966":"Saudi Arabia(+966)","+221":"Senegal(+221)","+248":"Seychelles(+248)","+232":"Sierra Leone(+232)","+65":"Singapore(+65)","+421":"Slovakia(+421)","+386":"Slovenia(+386)","+677":"Solomon Islands(+677)","+252":"Somalia(+252)","+27":"South Africa(+27)","+34":"Spain(+34)","+249":"Sudan(+249)","+211":"South Sudan(+211)","+597":"Suriname(+597)","+268_swa":"Swaziland(+268)","+46":"Sweden(+46)","+41":"Switzerland(+41)","+886":"Taiwan(+886)","+992":"Tajikistan(+992)","+255":"Tanzania(+255)","+66":"Thailand(+66)","+228":"Togo(+228)","+676":"Tonga(+676)","+90":"Turkey(+90)","+993":"Turkmenistan(+993)","+688":"Tuvalu(+688)","+256":"Uganda(+256)","+380":"Ukraine(+380)","+971":"United Arab Emirates(+971)","+44":"United Kingdom(+44)","+598":"Uruguay(+598)","+998":"Uzbekistan(+998)","+678":"Vanuatu(+678)","+379":"Vatican City(+379)","+58":"Venezuela(+58)","+84":"Vietnam(+84)","+260":"Zambia(+260)"};
    let country_code_arr = [];
    for (const key in country_code_json) {
      if (Object.hasOwnProperty.call(country_code_json, key)) {
        const element = country_code_json[key];
        country_code_arr.push({value: key, label: element});
      }
    }
  const handleFormSubmit = (data) => {
      if (loading) return;

      let formData = {
        ...data,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        password_confirm: password_confirm,
      }
      if (firstname === "") {
        setErrorsf({
          ...errorsf, firstname: {status: true}
        });
        return;
      }
      if (email.match(/[a-zA-Z\d-!$`=-~{}@#"$'%^&+|*:_.,]+@[a-z\d]+\.[a-z]{2,3}/) == null || email === ""){
        console.log("test");
        setErrorsf({
            ...errorsf, emailfield: {status: true}
          });
        return;
      }
      if (password ==="" || password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-+_|{}[\]!<>@"'/$#%^&*.,()=~;:?]).{6,}/) == null) {
        setErrorsf({
          ...errorsf, password: {status: true}
        });
        return;      
      }
      
      if (password_confirm !== password ) {
        setErrorsf({
          ...errorsf, password: {status: true}
        });
        return;
        
      }
      setLoading(true);
      formData = {
        ...formData,
        AffRefId: cookies.PAPAffiliateId|| " ",
        pap_visitorId: cookies.PAPVisitorId ||  " ",
      }
     const myApi = myServerApi();
      Http.register(formData).then((res) => {
      setLoading(false);
      if (res.result) {
        localStorage.setItem("username",formData.email)
        myApi.post("signup", formData)
        .then( (res) => {

        })
        .catch( err => [

        ])
       
        localStorage.setItem("registerData", JSON.stringify(formData));
        history.push("/register-success");
      } else {
        myApi.post("signup", formData)
        .then( (res) => {

        })
        .catch( err => [

        ])
        if (res.message === "An account with the given email already exists.") {
          localStorage.setItem("username",formData.email)
          toast.warn("Your account already exists");
        } else {
            toast.warn("A combination of numbers, lowercase letters, uppercase letters, and symbols with 6 or more characters.");
        }
      }    
    })
    .catch((e) => {
      myServerApi.post("signup", formData)
      .then( (res) => {

      })
      .catch( err => [

      ])
      if (e.response.message === "An account with the given email already exists.") {
        localStorage.setItem("username",formData.email)
        toast.warn("Your account already exists");
      } else {
          toast.warn("A combination of numbers, lowercase letters, uppercase letters, and symbols with 6 or more characters.");
      }
    });
  };
  const handleKeyPress = (e) => {
    if (e.shiftKey) {
      if (e.key.toLowerCase() === 'tab') {
        let nextfield = null;
         
        if (e.target.name === "email") {
          nextfield = document.querySelector(
            `input[name=lastname]`
          );
        } else if(e.target.name === "password"){
          console.log("pa")
          nextfield = document.querySelector(
            `input[name=email]`
          );
          
        } else if (e.target.name === "password_confirm") {
          console.log("confirm pa")
          nextfield = document.querySelector(
            `input[name=password]`
          );
        } else {
          console.log("term")
          if (e.target.name === "terms1") {
            nextfield = document.querySelector(
              `[name=country]`
            );
          } else {
            if (e.target.name === "terms2") {
              nextfield = document.querySelector(
                `[name=terms1]`
              );
            }
          }
          
        }
        if (e.target.name === "register") {
          nextfield = document.querySelector(
            `[name=terms2]`
          );
        }
        if (nextfield !== null)  {
          nextfield.focus();
        }
        e.preventDefault();
      }
     
    }else{
        if (e.key.toLowerCase() === 'tab') {
          let nextfield = null;
          if(e.target.name === "email"){
            nextfield = document.querySelector(
              `input[name=password]`
            );
            
          } else if (e.target.name === "password") {
            nextfield = document.querySelector(
              `input[name=password_confirm]`
            );
          } else {
            if (e.target.name === "terms1") {
              nextfield = document.querySelector(
                `[name=terms2]`
              );
              console.log("nextfield", nextfield);
            } else {
              if (e.target.name === "terms2") {
                nextfield = document.querySelector(
                  `button[name=register]`
                );
              }
            }
            
          }
          if (e.target.name === "password_confirm") {
            nextfield = document.querySelector(
              `[name=country]`
            );
          } 
          
        if (nextfield !== null)  {
          nextfield.focus();
        }
        e.preventDefault();
        }
      }

    
  }
  return (
    <React.Fragment>
      <Head title="Register" />
      <PageContainer>
        <Block className="nk-block-middle nk-auth-body  wide-xs">
          <LogoComp />
          <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
            <BlockHead>
              <BlockContent>
                <BlockDes>
                  <p>{t('create_account')}</p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
            <form className="is-alter" onSubmit={handleSubmit(handleFormSubmit)}>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="firstname">
                   {t('firstname')} (*)
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    bssize="lg"
                    id="firstname"
                    value = {firstname}
                    onChange = { e => { console.log(e.target.value.match(/^[A-Za-z]+$/)); 
                    if (e.target.value.match(/^[A-Za-z ]+$/) != null || e.target.value === "" ) {
                      setFirstname(e.target.value); 
                      if (e.target.value === "")  
                      setErrorsf({
                        ...errorsf, firstname: {status:true}
                      });
                      else {
                        setErrorsf({...errorsf, firstname: {status:false}})
                      }
                    } else 
                      setErrorsf({
                        ...errorsf, firstname: {status:true}
                      })
                    }
                    }
                    name="firstname"
                    // ref={register({ required: t('required') , validate: (value) => (value.match(/^[A-Za-z]+$/)) || "Must be only alphabetic characters" })}
                    className="form-control-lg form-control"
                    placeholder={t('placeholder_firstname')}
                  />
                  {errorsf.firstname.status && <p className="invalid">{t('only_alpha')}</p>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="lastname">
                    {t('lastname')} (*)
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    bssize="lg"
                    id="lastname"
                    name="lastname"
                    value = { lastname }
                    onChange={ e =>{ 
                    if (e.target.value.match(/^[A-Za-z ]+$/) != null || e.target.value === "" ) {
                      setLastname(e.target.value); 
                      if (e.target.value === "")  
                      setErrorsf({
                        ...errorsf, lastname: {status:true}
                      });
                      else {
                        setErrorsf({...errorsf, lastname: {status:false}})
                      }
                    } else 
                      setErrorsf({
                        ...errorsf, lastname: {status:true}
                      })
                  }}
                    // ref={register({ required: t('required'), validate: (value) => value.match(/^[A-Za-z]+$/) || "Must be only alphabetic characters" })}
                    className="form-control-lg form-control"
                    placeholder={t('placeholder_lastname')}
                  />
                  {errorsf.lastname.status && <p className="invalid">{t('only_alpha')}</p>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="email">
                    {t('email')} (*)
                  </label>
                </div>
                <div className="form-control-wrap">
                  <input
                    type="text"
                    bssize="lg"
                    id="email"
                    name="email"
                    value={email}
                    onKeyDown={(e) => handleKeyPress(e)}
                    onChange={ e => {
                      // (e.target.value.match(/^[a-zA-Z\d-@#$%^&*.,]+$/) || " " )&& setEmail(e.target.value)
                    if (e.target.value.match(/^[a-zA-Z\d-!$`=-~{}@#"$'%^&+|*:_.,]+$/) != null || e.target.value === "" ) {
                      setEmail(e.target.value); 
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
                    // ref={register({ required: t('required'), validate: (value)=> { 
                    //   if (value.match(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/))
                    //       return true; 
                    //   else
                    //     return "Please input correct email address";
                    //     }
                    //   })
                    // }  
                    className="form-control-lg form-control"
                    placeholder={t('placeholder_email')}
                  />
                  {errorsf.emailfield.status && <p className="invalid">{t('email_error')}</p>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password">
                  {t('password')} (*)
                  </label>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassState(!passState);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>
                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passState ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onKeyDown={(e) => handleKeyPress(e)}
                    onChange={ e => {
                      // (e.target.value.match(/^[a-zA-Z\d-+_!@#$%^&*.,?]+$/)|| " " ) && setPassword(e.target.value)
                      if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'$#%"/^&*.,()=~;:?]+$/) != null || e.target.value === "" ) {
                        setPassword(e.target.value); 
                        if (e.target.value === "")  
                        setErrorsf({
                          ...errorsf, password: {status:true}
                        });
                        else {
                          setErrorsf({...errorsf, password: {status:false}})
                        }
                      } else 
                        setErrorsf({
                          ...errorsf, password: {status:true}
                        })
                    }
                    }
                    // ref={register({ required: t('required'), validate: (value)=> { 
                    //   if (value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-+_!@#$%^&*.,?]).{6,}/))
                    //    { 
                    //      if (value.match(/^[a-zA-Z\d-+_!@#$%^&*.,?]+$/)) 
                    //       return true; 
                    //       else
                    //         return "Must be only alphabetic characters";
                    //   }
                    //   else
                    //     return "A combination of numbers, lowercase letters, uppercase letters, and symbols with 6 or more characters.";
                    //     }
                    //   })
                    // }  
                    placeholder={t('placeholder_password')}
                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                  />
                  {errorsf.password.status && <span className="invalid">{t('combination')}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="password_confirm">
                    {t('password_confirm')} (*)
                  </label>
                </div>
                <div className="form-control-wrap">
                  <a
                    href="#password_confirm"
                    onClick={(ev) => {
                      ev.preventDefault();
                      setPassStateConfirm(!passStateConfirm);
                    }}
                    className={`form-icon lg form-icon-right passcode-switch ${passStateConfirm ? "is-hidden" : "is-shown"}`}
                  >
                    <Icon name="eye" className="passcode-icon icon-show"></Icon>
                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                  </a>
                  <input
                    type={passStateConfirm ? "text" : "password"}
                    id="password_confirm"
                    name="password_confirm"
                    value={password_confirm}
                    onKeyDown={(e) => handleKeyPress(e)}

                    onChange={ e => {
                      // (e.target.value.match(/^[a-zA-Z\d-+_!@#$%^&*.,?]+$/)|| " " ) && setPasswordconfirm(e.target.value)
                      if (e.target.value.match(/^[a-zA-Z\d-+_|{}[\]!<>@'#$%/^&*.,()=~;:?]+$/) != null || e.target.value === "" ) {
                        setPasswordconfirm(e.target.value); 
                        if (e.target.value !== password) {
                          setErrorsf({
                            ...errorsf, password_confirm: {status: true}
                          });  
                        }
                        else if (e.target.value === "")  
                        setErrorsf({
                          ...errorsf, password_confirm: {status:true}
                        });
                        else {
                          setErrorsf({...errorsf, password_confirm: {status:false}})
                        }
                      } else 
                        setErrorsf({
                          ...errorsf, password_confirm: {status:true}
                        })
                    }
                    }
                   
                    // ref={register({ required: t('required'), validate: (value) => value === watch('password') || `Password doesn't match` })}
                    placeholder={t('placeholder_password_confirm')}
                    className={`form-control-lg form-control ${passStateConfirm ? "is-hidden" : "is-shown"}`}
                  />
                  {errorsf.password_confirm.status && <span className="invalid">{t('password_error')}</span>}
                </div>
              </FormGroup>
              <FormGroup>
                <label className="form-label" htmlFor="name">
                    {t('country')} (*)
                </label>
                <div className="form-control-wrap">
                    <select id="country" name="country" className="form-control-lg form-control"
                      ref={register({ required: t('required'), validate: (value) => value !== "noselect" || `Please select a country` })}
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
                  {errors.country && <span className="invalid">{errors.country.message}</span>}
                </div>

              </FormGroup>
              <FormGroup>
                <div className="form-control-wrap mt-40" style = {{marginTop: "36px"}}>
                    <input
                        type="checkbox"
                        className="custom-control-input "
                        id="terms1"
                        name = "terms1"
                        ref={register({ required: t('required')})}
                        onKeyDown={(e) => handleKeyPress(e)}
                    />
                    {errors.terms1 && <span className="invalid" style={{position: "absolute", left: "0",
                      color: "#fff",
                      fontSize: "11px",
                      lineHeight: "1",
                      bottom: "calc(100% + 4px)",
                      background: "#ed756b",
                      padding: "0.3rem 0.5rem",
                      zIndex: "1",
                      borderRadius: "3px",
                      whiteSpace: "nowrap"}}>{errors.terms1.message}</span>}
                    <label className="custom-control-label ml-5 pl-1 custom-control-sm" htmlFor="terms1" >{t('agree')} <a href='https://cryptowire.vip/terms/' target="_blank" >{t('terms_conditions')}</a></label>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-control-wrap" style = {{marginTop: "36px"}}>
                  <input
                      type="checkbox"
                      className="custom-control-input "
                      name = "terms2"
                      id="terms2"
                      onKeyDown={(e) => handleKeyPress(e)}
                      ref={register({ required: t('required')})}
                  />
                  {errors.terms2 && <span className="invalid" style={{position: "absolute", left: "0",
                    color: "#fff",
                    fontSize: "11px",
                    lineHeight: "1",
                    bottom: "calc(100% + 4px)",
                    background: "#ed756b",
                    padding: "0.3rem 0.5rem",
                    zIndex: "1",
                    borderRadius: "3px",
                    whiteSpace: "nowrap"}}>{errors.terms2.message}</span>}
                  <label className="custom-control-label ml-5 pl-1 custom-control-sm" htmlFor="terms2" >{t('agree')} <a href='https://cryptowire.vip/privacy-policy/' target='_blank'>{t('privacy_policy')}</a></label>
                </div>
              </FormGroup>
              <input type="hidden" id="papCookie" name="papCookie" value="noCookie" 
                      ref={register({ required: t('required')})}
              
              />

              <FormGroup>
                <Button type="submit" color="primary" size="lg" name="register" 
                      onKeyDown={(e) => handleKeyPress(e)}
                      className="btn-block">
                  {loading ? <Spinner size="sm" color="light" /> : t('register')}
                </Button>
              </FormGroup>
            </form>
            <div className="form-note-s2 text-center pt-4">
                {t('already')}
              <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                <strong>{t('instead_signin')}</strong>
              </Link>
            </div>
          </PreviewCard>
        </Block>
        <AuthFooter />
      </PageContainer>
    </React.Fragment>
  );
};
export default Register;
