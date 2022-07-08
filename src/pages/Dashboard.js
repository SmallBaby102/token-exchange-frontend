import React, {
  useEffect,
  useState,
} from 'react';
import NonceGenerator from 'a-nonce-generator';
import { v4 as uuidv4 } from 'uuid';
import { parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  Row,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';

import {
  setAccounts,
  setChecking,
  setCurrentUser,
  setQuoteData,
  setDepositAddress,
} from '../actions';
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  CodeBlock,
  Icon,
  PreviewAltCard,
} from '../components/Component';
import BTCIcon from '../images/coins/bitcoin01.png';
import USDTIcon from '../images/coins/USDT.png';
import USDCIcon from '../images/coins/USDC.png';
import ETHIcon from '../images/coins/ETH.png';
import USDIcon from '../images/coins/USD02.png';
import Content from '../layout/content/Content';
import Head from '../layout/head/Head';
import api, {
  getAuthenticatedApi,
  getAuthenticatedApi2,
  myServerApi,
} from '../utils/api';
import Helper , {CONFIGURATOR_USERNAME, CONFIGURATOR_PASSWORD} from '../utils/Helper';
import Http from '../utils/Http';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
let RapidAPIKey = '575b213f4emsh6492c40f41807b3p1502cajsn546e9d7adab9';
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: "USD",
  // currencyDisplay: ''
});
const Dashboard = () => {
  //For affiliate  
  const { t } = useTranslation(); 
  let search = window.location.search
  let aid = search.split("=")[1]
  const [cookies, setCookie, removeCookie] = useCookies(['aid']);
  if (aid)
    setCookie('PAPAffiliateId', aid, { path: '/' , domain: ".cryptowire.vip"});
  // global status
  const accounts = useSelector(state => state.user.accounts);
  const pairPriceArr = useSelector(state => state.user.quote);
  let accouts_arr = Object.keys(accounts).map((key) => [Number(key), accounts[key]]);
  const history = useHistory();
  const { errors, register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const myApi = myServerApi(); 
  const user = useSelector(state => state.user.user);
  const email = user?.username; 
  const user_id = localStorage.getItem("user_id");

  const [activeId, setActiveId] = useState("");

  // coin relative status
  const [totalBalance, setTotalBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(-1)
  const [usdBalance, setUsdBalance] = useState(-1)
  const [usdtBalance, setUsdtBalance] = useState(-1)
  const [ethBalance, setEthBalance] = useState(-1)
  const [usdcBalance, setUsdcBalance] = useState(-1)
  const [btcPrice, setBtcPrice] = useState(0)
  const [usdtPrice, setUsdtPrice] = useState(1)
  const [ethPrice, setEthPrice] = useState(0)
  const [usdcPrice, setUsdcPrice] = useState(0)
  const [btcitem, setBtcitem] = useState({})
  const [usditem, setUsditem] = useState({})
  const [usdcitem, setUsdcitem] = useState({})
  const [usdtitem, setUsdtitem] = useState({})
  const [ethitem, setEthitem] = useState({})
  const [correctFlag, setCorrectFlag] = useState(false)
  // model relative status
  const btc_address = useSelector(state => state.user.btc_address);
  const usdt_address = useSelector(state => state.user.usdt_address);
  const usdc_address = useSelector(state => state.user.usdc_address);
  const eth_address = useSelector(state => state.user.eth_address);
  const [deposit_address, setDeposit_address] = useState("")
  const verification_status = user?.verification_status;
  const [modal, setModal] = useState({
    withdraw: false,
    deposit: false,
    sell: false,
    sellConfirm: false,
    withdrawConfirm: false,
    auth: false,
  });
  const [errorsSell, setErrorsSell] = useState({
    status: false,
    message: ""
  })
  const [errorsWithdraw, setErrorsWithdraw] = useState({
    status: false,
    message: ""
  })
  const [errorsWithdrawAddr, setErrorsWithdrawAddr] = useState({
    status: false,
    message: ""
  })
  const [errorsf, setErrorsf] = useState({
    authfield: { status: false, message : "Must be only alphabetic characters",},
  });
  const [loading, setLoading] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    amount_withdraw: 0,
    amount_sell: 0,
    address_withdraw: "",
    date: new Date(),
  });
  const [sellFinish, setSellFinish] = useState(0);        //0: not start, 1: success, 2: failed
  const [withdrawFinish, setWithdrawFinish] = useState(0);//0: not start, 1: success, 2: failed
  const { amount_sell } = formData;
  const [amount_receive, setAmount_receive] = useState("") 
  // /api/v1/securities/statistics
  const [availableSellAmount, setAvailableSellAmount] = useState("");
  const [availableWithdrawAmount, setAvailableWithdrawAmount] = useState("");
  const [withdrawFee, setWithdrawFee] = useState(0);
  const [withdrawFeeRule, setWithdrawFeeRule] = useState({
    BTC: 0.001,
    ETH: 0.005,
    USDT: 20,
    USDC: 20,
  })
  const [minimumWithdrawAmount, setMinimumWithdrawAmount] = useState({
    btc: 0.0025,
    eth: 0.03,
    usdt: 70,
    usdc: 70,
  })
  const [minimumSellAmount, setMinimumSellAmount] = useState({
    btc: 0.0001,
    eth: 0.01,
    usdt: 1,
    usdc: 1,
  })
  const [maximumSellAmount, setMaximumSellAmount] = useState({
    btc: 3,
    eth: 5,
    usdt: null,
    usdc: null,
  })
  const [secret_val, setSecret_val] = useState("")
  const [authCode, setAuthCode] = useState("")
  const [sellId, setSellId] = useState("")
  const onFormCancel = () => {
    setModal({ withdraw: false }, { deposit: false }, { sell: false}, {sellConfirm: false}, {withdrawConfirm: false});
  };
  const onSellConfirmFormCancel = () => {
    setModal({sellConfirm: false, sell: true});
  };
  const onWithdrawConfirmFormCancel = () => {
    setModal({withdrawConfirm: false, withdraw: true});
  };
    // submit function to update a new item
    const onDepositSubmit = (sData) => {
      setModal({ deposit: false });
    };
    const onWithdrawSubmit = () => {
      if(loading)
          return;
      if (formData.amount_withdraw < minimumWithdrawAmount[formData.product.toLowerCase()]) {
          setErrorsWithdraw({
            status: true,
            message:  t('amount_over_error')
          })
          return;
      } 
      if (formData.amount_withdraw > availableWithdrawAmount) {
        setErrorsWithdraw({
          status: true,
          message: t('amount_under_available_error')
        })
        return;
      }
      if (formData.address_withdraw === "") {
        setErrorsWithdrawAddr({
          status: true,
          message: "Address is required"
        })
        return;
      }
      setModal({...modal, withdrawConfirm : true});
      
    };
    const onWithdrawConfirmSubmit = async () => {
      // const myApi = myServerApi();
      // let security = await myApi.get(`security/${email}`)
      // let twoFactor = security.data.data;
      // setLoading(false);
      // if (twoFactor.status === 1 && twoFactor.withdraw === 1){
        // setSecret_val(security.data.data.code_from_app);
      // } else {
      //   toast.warn(t('must_2fa'));
      //   history.push("/security");
        setModal({...modal, auth: true, withdrawConfirm: false});
      
        // const secureApi = getAuthenticatedApi();
        // let data = {
        //   exchange: "PLUSQO",
        //   product: formData.product,
        //   amount:  formData.amount_withdraw,
        //   address: formData.address_withdraw,
        //   // code: '',
        //   // network: "Stellar"
        // }
        // // dispatch(setChecking(true));
    
        // setLoading(true)
        // secureApi.post(`/wallet/withdraw/create`, data).then(res => {
        //     if (res && res.data && res.data.success) {
        //       secureApi.get(`/wallet/transaction/status?txid=${res.data.txid}&state_hash=${res.data.state_hash}&timeout=10000`).then(response => {
        //         setLoading(false)
        //         if (response.data.success) {
        //           setWithdrawFinish(1);

        //           toast.success("Successfully Withdrawed");
        //           // setModal({ withdraw: false });
        //           dispatch(setChecking(false))
        //           let exchange_access_token =localStorage.getItem("exchange_access_token")
        //           if (exchange_access_token !== null && exchange_access_token !== "") {
        //             Http.getAccounts(exchange_access_token)
        //             .then((response) => {
        //                 if (response.message === "Unauthorized"){
        //                   history.push("auth-login");
        //                   dispatch(setChecking(false));
        //                   return;
        //                 }
        //                 // setModal({ sell: false });
        //                 setLoading(false);
        //                 dispatch(setAccounts(response));
        //               })
        //           }else{
        //             // history.push("auth-login")
        //           }
        //           let withdrawInfo = {
        //               ...data,
        //               email: email,
        //           };
        //           myApi.post("/withdraw", withdrawInfo)
        //           .then( res => {
                    
        //           })
        //           .catch()
        //         } else {
        //           setWithdrawFinish(2);
        //           toast.error("Server not response");
        //         }
        //         dispatch(setChecking(false))

        //       })
        //     }
        // }).catch(err => {
        //   setWithdrawFinish(2);
        //   toast.error(err.response.data.message);
        //   setLoading(false)
        //   console.log('error: ', err);
        // });
      // }
    };
    const confirmWithdraw = async () => {
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
      setAuthCode("");
      if (flag === "False")
      {
        toast.warn(t('code_error'));
        return;
      }
        setModal({...modal, ...{auth : false}});
        setLoadingConfirm(false);
        const secureApi = getAuthenticatedApi();
        let data = {
          exchange: "PLUSQO",
          product: formData.product,
          amount:  formData.amount_withdraw,
          address: formData.address_withdraw,
          // code: '',
          // network: "Stellar"
        }
        // dispatch(setChecking(true));
        setLoading(true)
        secureApi.post(`/wallet/withdraw/create`, data).then(res => {
            if (res && res.data && res.data.success) {
              secureApi.get(`/wallet/transaction/status?txid=${res.data.txid}&state_hash=${res.data.state_hash}&timeout=10000`).then(response => {
                setLoading(false)
                if (response.data.success) {
                  setWithdrawFinish(1);

                  toast.success("Successfully Withdrawed");
                  // setModal({ withdraw: false });
                  dispatch(setChecking(false))
                  let exchange_access_token =localStorage.getItem("exchange_access_token")
                  if (exchange_access_token !== null && exchange_access_token !== "") {
                    Http.getAccounts(exchange_access_token)
                    .then((response) => {
                        if (response.message === "Unauthorized"){
                          history.push("auth-login");
                          dispatch(setChecking(false));
                          return;
                        }
                        // setModal({ sell: false });
                        setLoading(false);
                        dispatch(setAccounts(response));
                      })
                  }else{
                    // history.push("auth-login")
                  }
                  let withdrawInfo = {
                      ...data,
                      email: email,
                  };
                  myApi.post("/withdraw", withdrawInfo)
                  .then( res => {
                    
                  })
                  .catch()
                } else {
                  setWithdrawFinish(2);
                  toast.error("Server not response");
                }
                dispatch(setChecking(false))

              })
            }
        }).catch(err => {
          setWithdrawFinish(2);
          toast.error(err.response.data.message);
          setLoading(false)
          console.log('error: ', err);
        });
    };
    const onSellSubmit = () => {
        if(loading)
          return;
        if (formData.amount_sell < minimumSellAmount[formData.product.toLowerCase()]) {
          setErrorsSell({
            status: true,
            message: "Amount must be over the minimum one"
          })
          return;
        } 
        if (formData.product !== "USDT" && formData.product !== "USDC" )
          if (formData.amount_sell > maximumSellAmount[formData.product.toLowerCase()]) {
            setErrorsSell({
              status: true,
              message: t('amount_under_max_error')
            })
            return;
          }
        if (formData.amount_sell > parseFloat(availableSellAmount)) {
          setErrorsSell({
            status: true,
            message: t('amount_under_available_error')
          })
          return;
        }
       
        setModal({...modal, ...{ sellConfirm : true}});
    }
    const onSellConfirmSubmit = () => {
      if(loading)
          return;
      setModal({...modal, ...{sellConfirm : false}});
      setLoading(true);
      const secureApi2 = getAuthenticatedApi2();
      const data = {
        security_id: `${formData.product}USD`,
        client_order_id: uuidv4(),
        type: "market",
        side: "sell",
        quantity: formData.amount_sell,
        time_in_force: "ioc",
        destination: "SHIFTFX",
        properties: [],
        text: "sell",
        // expire_time: "0",
        submission_time: "0",
        price: "0.00",
      };
      if (formData.product === "USDT" || formData.product === "USDC" ){
        let configdata = {
          exchange: "CONFIGURATOR_PLUSQO",
          username: CONFIGURATOR_USERNAME,
          password: CONFIGURATOR_PASSWORD
        }
        let headers = {
          "Content-Type" : "application/json",
        }
        axios.post("https://authentication.cryptosrvc.com/api/configurator_authentication/configuratorToken", configdata, {headers})
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
              amount: data.quantity, 
              comment: `${formData.product} Sell`, 
              currency: "USD"
            }
            let url = `https://config.plusqo.shiftmarketsdev.com/api/users/${bodyData.userId}/accounts/${usditem.id}/balancecorrection`;
            let sellData = {
              papFlag: false,
              email: email,
              bodyData: bodyData,
              url: url,
              amount1: data.quantity,
              amount2: data.quantity,
              balance1: usdBalance,
              balance2: usdBalance,
              headers: headers
            }
            myApi.put("sell", sellData)
            .then(result => {
                let subData = {
                  userId: user_id, 
                  accountId: sellId, 
                  type:5, 
                  amount: -(data.quantity), 
                  comment: `${formData.product} Sell`, 
                  currency: formData.product
                }
                url = `https://config.plusqo.shiftmarketsdev.com/api/users/${subData.userId}/accounts/${sellId}/balancecorrection`;
                sellData = {
                  papFlag: false,
                  email: email,
                  bodyData: subData,
                  url: url,
                  amount1: data.quantity,
                  amount2: data.quantity,
                  balance1: formData.product === "USDT" ? usdtBalance : usdcBalance,
                  balance2: usdBalance,
                  headers: headers
                }
                myApi.put("sell", sellData)
                .then(result => {
                  setLoading(false);
                  if(result.data.success){
                    setSellFinish(1);
                    toast.success("Successfully sold");
                  }
                  else {
                    setSellFinish(2);
                    toast.error("Failed sell");
                  }
                  
                  
                }).catch( e => {
                  setSellFinish(2);
                  toast.error("Failed sell");
                  setLoading(false);
                    console.log("sell error")
                })
            }).catch( e => {
              setSellFinish(2);
              toast.error("Failed sell");
              setLoading(false);
            })
            
        })
        .catch( e => {
          setSellFinish(2);
          toast.error("Failed sell");
          setLoading(false);
        })
      } else{
        // dispatch(setChecking(true));
        const ng = new NonceGenerator();
        const nonce = ng.generate();
        let myData = {
          data,
          nonce: nonce,
          auth: `Bearer ${localStorage.getItem("exchange_access_token")}`,
        }
        myApi.post(`orders`, myData).then(res => {
            if (res && res.data ) {
              let exchange_access_token = localStorage.getItem("exchange_access_token")
              if (exchange_access_token !== null && exchange_access_token !== "") {
                Http.getAccounts(exchange_access_token)
                .then((response) => {
                    if (response.message === "Unauthorized"){
                      history.push("auth-login");
                      // dispatch(setChecking(false));
                      return;
                    }
                    dispatch(setAccounts(response));
                    let configdata = {
                      exchange: "CONFIGURATOR_PLUSQO",
                      username: CONFIGURATOR_USERNAME,
                      password: CONFIGURATOR_PASSWORD
                    }
                    let headers = {
                      "Content-Type" : "application/json",
                    }
                    axios.post("https://authentication.cryptosrvc.com/api/configurator_authentication/configuratorToken", configdata, {headers})
                    .then(res => {
                        let configurator_access_token = res.data.configurator_access_token;
                        const headers = {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${configurator_access_token}`,
                        };
                        let price = null;
                        let balance = null;
                        if (formData.product === "BTC")
                        {
                          price = btcPrice;
                          balance = btcBalance;
                        }  
                        if (formData.product === "ETH") {
                            price = ethPrice;
                            balance = ethBalance;

                        }
                        if (price !== null ) {
                          let bodyData = {
                            userId: user_id, 
                            accountId: usditem.id, 
                            type:5, 
                            amount: data.quantity * price * 0.035, 
                            comment:"Sell operation", 
                            currency:"USD"
                          }
                          let url = `https://config.plusqo.shiftmarketsdev.com/api/users/${bodyData.userId}/accounts/${usditem.id}/balancecorrection`;
                          let sellData = {
                            papFlag: false,
                            email: email,
                            bodyData: bodyData,
                            url: url,
                            amount1: data.quantity,
                            amount2: data.quantity * price,
                            balance1: balance,
                            balance2: usdBalance,
                            headers: headers
                          }
                          myApi.put("sell", sellData)
                          .then(result => {
                            if(result.data.success){
                              setSellFinish(1);
                              toast.success("Successfully sold");
                            }
                            else {
                              setSellFinish(2);
                              toast.error("Failed sell");
                            }
                            setLoading(false);
                          }).catch( e => {
                            console.log("sell error")
                            setLoading(false);
                            setSellFinish(2);

                          })
                        }
                        else {
                          toast.error("Failed sell operation");
                          setSellFinish(2);

                        }
                        
                    })
                    .catch( e => {
                        setSellFinish(2);
                        toast.error("Failed sell operation");
                        setLoading(false);
                    })
                    
                  })
                  .catch(e => {
                      toast.error("Failed sell operation");
                      setLoading(false);
                      setSellFinish(2);
                    
                  })
              }
              else{
                  setSellFinish(2);
                  // history.push("auth-login")
                  toast.error("Failed sell operation");
                  setLoading(false);
              }
            }else{
              setSellFinish(2);
              toast.error("Failed sell operation");
              setLoading(false);
            }
            // dispatch(setChecking(false));
          
        }).catch(err => {
          setSellFinish(2);
          console.log('error: ', err);
            toast.error("Failed sell");
            setLoading(false);
            // dispatch(setChecking(false));
        });
      }
      
    };
    // function that loads the want to deposited data
    const onDepositClick = (id, changeAddress) => {
          setActiveId(id);
        for (const key in accouts_arr) {
        if (Object.hasOwnProperty.call(accouts_arr, key)) {
          let item = accouts_arr[key];
          item = item[1]
        if (item.id === id) {
          setFormData({
            ...formData,
            product: item.product,
          });
          if (changeAddress) {
            setLoading(true);
            const secureApi = getAuthenticatedApi();
            const data = {
              exchange: "PLUSQO",
              product: item.product,
              // reusable: false,
              // network: "Stellar"
            };
            dispatch(setChecking(true));
            secureApi.post(`/wallet/deposit/create`, data).then(res => {
                if (res && res.data && res.data.success) {
                  secureApi.get(`/wallet/transaction/status?txid=${res.data.txid}&state_hash=${res.data.state_hash}&timeout=10000`).then(response => {
                    if (response.data.address === null) {
                      // toast.warn("Please try again. Server didn't reply");
                      onDepositClick(id, true);
                    }  
                    else{
                      setDeposit_address(response.data.address)
                      dispatch(setChecking(false));
                      setLoading(false);
                      let data = {};
                      if (item.product === "BTC") {
                        data = { btc_address: response.data.address };
                      } else if (item.product === "ETH") {
                        data = { eth_address: response.data.address };

                      } else if (item.product === "USDT") {
                        data = { usdt_address: response.data.address };
                      } else if (item.product === "USDC") {
                        data = { usdc_address: response.data.address };
                      }
                      dispatch(setDepositAddress(data));    
                      data = { ...data, email: email, product: item.product }
                      myApi.post("/depositAddress", data)
                      .then((res) => {
                          
                      })
                      .catch((e) => {
  
                      })
                    }
                      
                  })
  
                }
            }).catch(err => {
                console.log('error: ', err);
                      setLoading(false);
                      dispatch(setChecking(false));
            });
          } else {
            let data;
            let tempAddr;
            if (item.product === "BTC") {
              setDeposit_address(btc_address);
              tempAddr = btc_address;
              data = { btc_address: btc_address };
            } else if (item.product === "ETH") {
              setDeposit_address(eth_address);
              tempAddr = eth_address;
              data = { eth_address: eth_address };
            } else if (item.product === "USDT") {
              setDeposit_address(usdt_address);
              tempAddr = usdt_address;
              data = { usdt_address: usdt_address };
            } else if (item.product === "USDC") {
              setDeposit_address(usdc_address);
              tempAddr = usdc_address;
              data = { usdc_address: usdc_address };
            }

            if (tempAddr !== "" && tempAddr !== null ) {
              setModal({ deposit: true }, { withdraw: false });
              data = { ...data, email: email, product: item.product }
              myApi.post("/depositAddress", data)
              .then((res) => {
                  
              })
              .catch((e) => {

              })
              return;
            }
            myApi.get(`depositAddress/${email}/${item.product}`)
            .then((res) => {
                if (res.data.success === true && res.data.data !== null && res.data.data !== "") {
                  const data = {
                    btc_address : res.data.data.btc_address,
                    usdt_address : res.data.data.usdt_address,
                    usdc_address : res.data.data.usdc_address,
                    eth_address : res.data.data.eth_address,
                  }
                  if ((item.product === "BTC" && (data.btc_address === null || data.btc_address === "")) || (item.product === "ETH" && (data.eth_address === null ||data.eth_address === "")) || (item.product === "USDT" && (data.usdt_address === null || data.usdt_address === "")) ||  (item.product === "USDC" && (data.usdc_address === null || data.usdc_address === ""))) {
                    throw ("deposit address not found");
                  }
                  dispatch(setDepositAddress(data));    
                  setModal({ deposit: true }, { withdraw: false });
                  return;
                }
                else{
                  throw ("deposit address not found");
                }
    
            })
            .catch((e) => {
                console.log(e)
                const secureApi = getAuthenticatedApi();
                const data = {
                  exchange: "PLUSQO",
                  product: item.product,
                  // reusable: false,
                  // network: "Stellar"
                };
                setModal({ deposit: true }, { withdraw: false });
                dispatch(setChecking(true));
                setLoading(true);
                secureApi.post(`/wallet/deposit/create`, data).then(res => {
                    if (res && res.data && res.data.success) {
                      secureApi.get(`/wallet/transaction/status?txid=${res.data.txid}&state_hash=${res.data.state_hash}&timeout=10000`).then(response => {
                        if (response.data.address === null) {
                          // toast.warn("Please wait a moment. Server didn't reply. Will try again");
                          onDepositClick(id);
                        }  
                        else{
                          setDeposit_address(response.data.address)
                          dispatch(setChecking(false));
                          setModal({ deposit: true }, { withdraw: false });
                          let data = {};
                          if (item.product === "BTC") {
                            data = { btc_address: response.data.address };
                          } else if (item.product === "ETH") {
                            data = { eth_address: response.data.address };

                          } else if (item.product === "USDT") {
                            data = { usdt_address: response.data.address };
                          } else if (item.product === "USDC") {
                            data = { usdt_address: response.data.address };
                          }
                          setLoading(false);
                          dispatch(setDepositAddress(data));    
                          data = { ...data, email: email, product: item.product }
                          myApi.post("/depositAddress", data)
                          .then((res) => {
                              
                          })
                          .catch((e) => {
    
                          })
                        }
                      })
    
                    }
                }).catch(err => {
                    console.log('error: ', err);
                    dispatch(setChecking(false));
                });
    
              })
          }
         
  
        }
        }
      }
        
    };
  
    // function to change the complete a project property
    const withdrawClick = async (id) => {
      
      setLoading(false);
      let security = await myApi.get(`security/${email}`)
      let twoFactor = security.data.data;
      if (twoFactor === null){
        toast.warn(t('must_2fa'));
        // history.push("/security");
        return;
      }
      setSecret_val(twoFactor.code_from_app);
      if (twoFactor.status !== 1){
        toast.warn(t('must_2fa'));
        // history.push("/security");
        return;
      }
      setWithdrawFinish(0);
      for (const key in accouts_arr) {
        if (Object.hasOwnProperty.call(accouts_arr, key)) {
          let item = accouts_arr[key];
          item = item[1]
          if (item.id === id) {
            if (item.product === "USD" && verification_status !== "2") {
                toast.warn("Please complete your verification");
                history.push("/user-profile-regular");
            }
            setFormData({
              ...formData,
              amount_withdraw: 0,
              address_withdraw: "",
              product: item.product,
            });
          
          let availableAmount = (item.balance.active_balance - 0.001)/1.001;
          if (item.product === "ETH") {
            availableAmount = (item.balance.active_balance - 0.005)/1.001;
          }
          if (item.product === "USDT") {
            availableAmount = (item.balance.active_balance - 20)/1.001;
          }
          if (item.product === "USDC") {
            availableAmount = (item.balance.active_balance - 20)/1.001;
          }
          if(availableAmount < 0)
              availableAmount = 0;
            setAvailableWithdrawAmount(availableAmount);
          
          }
        }
      }
        
      setModal({...modal,  withdraw : true,  deposit : false });
     };
    // function to change the complete a project property
    const sellClick = (id) => {
    setSellFinish(0);

      for (const key in accouts_arr) {
        if (Object.hasOwnProperty.call(accouts_arr, key)) {
          let item = accouts_arr[key];
          item = item[1]
          if (item.id === id) {
            if (item.product === "BTC") {
              setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance.toFixed(5), 5));
            }
            if (item.product === "ETH") {
              setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance.toFixed(2), 2));
            }
            if (item.product === "USDT") {
              setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance.toFixed(2), 2));
            }
            if (item.product === "USDC") {
              setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance.toFixed(2), 2));
            }
            setFormData({
              ...formData,
              product: item.product,
              amount_sell: 0,
            });
            setSellId(id);
          }
        }
      }
      setModal({ sell: true }, { deposit: false }, { withdraw: false });
     };
  useEffect(() => {
    if (accounts.length > 0)  return;
    dispatch(setChecking(true));
    Http.getAccounts(localStorage.getItem("exchange_access_token"))
    .then((response) => {
        dispatch(setChecking(false));
        if (response.message === "Unauthorized"){
            history.push("auth-login");
            return;
        }
        dispatch(setAccounts(response));
    }).catch((e) => {
      dispatch(setChecking(false));
      console.log("get accounts error", e)
    })
    api.get("exchange/quotes?exchange=PLUSQO")
      .then((res) => {
          let pairPriceArr = res.data;
          dispatch(setQuoteData(pairPriceArr));
      })
      .catch((err) => {
        console.log(err)
      })
    }, [])
  useEffect(() => {
    accouts_arr = Object.keys(accounts).map((key) => [Number(key), accounts[key]]);
    // dispatch(setChecking(true))
    for (const key in accouts_arr) {
      let item = accouts_arr[key];
        item = item[1];
        if (sellId === item.id){
          if (item.product === "BTC") {
            setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance, 5));
          }
          if (item.product === "ETH") {
            setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance, 2));
          }
          if (item.product === "USDT") {
            setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance, 2));
          }
          if (item.product === "USDC") {
            setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance, 2));
          }
        }
        if (item.product === "BTC") {
          setBtcBalance(item.balance.active_balance.toFixed(8));
          setBtcitem(item);
          // dispatch(setChecking(false))
        }
        if (item.product === "USD") {
            setUsdBalance(item.balance.active_balance.toFixed(8));
            setUsditem(item);
            // dispatch(setChecking(false))
        } 
        if (item.product === "USDT") {
            setUsdtBalance(item.balance.active_balance.toFixed(8));
            setUsdtitem(item);
            // dispatch(setChecking(false))
        } 
        if (item.product === "USDC") {
            setUsdcBalance(item.balance.active_balance.toFixed(8));
            setUsdcitem(item);
            // dispatch(setChecking(false))
        } 
        if (item.product === "ETH") {
            setEthBalance(item.balance.active_balance.toFixed(8));
            setEthitem(item);
            // dispatch(setChecking(false))
        } 
    }
  }, [accounts])
  useEffect(() => {
      let withdraw_fee = "";
      if (formData.amount_withdraw !== "") {
        if (formData.product === "BTC")
          withdraw_fee = 0.001 + formData.amount_withdraw /1000;         
        else if (formData.product === "ETH"){
          withdraw_fee = 0.005 + formData.amount_withdraw /1000;         

        } else if (formData.product === "USDT"){
          withdraw_fee = 20 + formData.amount_withdraw /1000;         
        } else if (formData.product === "USDC"){
          withdraw_fee = 20 + formData.amount_withdraw /1000;         

        } 
        
      } 
      setWithdrawFee(withdraw_fee);
  }, [formData.amount_withdraw])
  useEffect(() => {
    let sum_usd = btcBalance * btcPrice + parseFloat(usdBalance) + parseFloat(usdtBalance)  + parseFloat(usdcBalance) + (ethBalance * ethPrice);
    setTotalBalance(sum_usd);
  }, [btcPrice, btcBalance, usdBalance, usdtBalance, usdcBalance, ethPrice, ethBalance])
  // useEffect(() => {
  //   if (email !== undefined)
  //     myApi.get(`profile/${email}`).then(res => {
  //       let user = res.data.data;
  //       if(user !== "")
  //       {  
  //         let useData = {
  //           department: (user.department !== null) ? user.department : "Individual",
  //           // individual relative state
  //           firstname: user.firstname,
  //           lastname: user.lastname,
  //           email: user.email,
  //           birthday: (user.issue_date !== "" && user.issue_date !== null) ? parseISO(user.birthday) : null,
  //           issue_date: (user.issue_date !== "" && user.issue_date !== null) ? parseISO(user.issue_date) : null,
  //           exp_date: (user.exp_date !== "" && user.exp_date !== null) ? parseISO(user.exp_date) : null,
  //           issue_country: user.issue_country,
  //           // title : user.title,
  //           gener : user.gener,
  //           // marriage: user.marriage,
  //           // occupation: user.occupation,
  //           address: user.address,
  //           // id_cardtype: "",
  //           id_number: user.id_number,
  //           // id_issuer: user.id_issuer,
  //           city: user.city,
  //           country: user.country,
  //           prefecture: user.prefecture,
  //           postal_code: user.postal_code,
  //           cellphone_number: user.cellphone_number,
  //           country_code: user.country_code,
        
  //           // corporate relative state
  //           company_name: user.company_name,
  //           director_name: user.director_name,
  //           company_address: user.company_address,
  //           company_city: user.company_city,
  //           company_prefecture: user.company_prefecture,
  //           company_postal_code: user.company_postal_code,
  //           company_country_code: user.company_country_code,
  //           company_cellphone_number: user.company_cellphone_number,

  //           verification_status: user.verification_status,
  //         };
  //         dispatch(setCurrentUser(useData));
  //       }
      
  //     })
  //     .catch(err => {
  //     console.log('error: ', err);
  //     });
  // }, [email])
  useEffect(() => {
    const secureApi2 = getAuthenticatedApi2();
    // api.get("exchange/quotes?exchange=PLUSQO")
    // .then((res) => {
    //   let pairPriceArr = res.data;
    //     for (const key in pairPriceArr) {
    //       if (Object.hasOwnProperty.call(pairPriceArr, key)) {
    //         const element = pairPriceArr[key];
    //         if (element.pair === "BTCUSD"){
    //           let buyBtcPrice = element.bid;
    //           // setBtcPrice(buyBtcPrice);
    //           let real_receive = formData.amount_sell * buyBtcPrice - (formData.amount_sell * buyBtcPrice) *0.035;
    //           setAmount_receive(real_receive)      }
    //       }
    //     }
    // })
    // secureApi2.get("securities/statistics")
    if (pairPriceArr) {
      for (const key in pairPriceArr) {
        if (Object.hasOwnProperty.call(pairPriceArr, key)) {
          const element = pairPriceArr[key];
          if (element.pair === "BTCUSDT"){
            let buyBtcPrice = element.bid;
            setBtcPrice(buyBtcPrice);
          }
          if (element.pair === "USDTUSD"){
            let buyUsdtPrice = element.bid;
            setUsdtPrice(1);
          }
          if (element.pair === "USDCUSD"){
            let buyUsdcPrice = element.bid;
            setUsdcPrice(1);
          }
          if (element.pair === "ETHUSD"){
            let buyEthPrice = element.bid;
            setEthPrice(buyEthPrice);
          }
        }
      }
    }
  }, [pairPriceArr ]);
  useEffect(() => {
    if (formData.product === "BTC") {
      let real_receive = formData.amount_sell * btcPrice;
      setAmount_receive(real_receive)
    }
    if (formData.product === "USDT") {
      let real_receive = formData.amount_sell * usdtPrice;
      setAmount_receive(real_receive)
    }
    if (formData.product === "USDC") {
      let real_receive = formData.amount_sell * usdcPrice;
      setAmount_receive(real_receive)
    }
    if (formData.product === "ETH") {
      let real_receive = formData.amount_sell * ethPrice;
      setAmount_receive(real_receive)
    }
  }, [amount_sell, btcPrice, btcBalance, usdBalance, usdtBalance,usdcBalance, ethBalance, formData.product])
  return (
    <React.Fragment>
      <Head title={t('Dashboard')}></Head>
      <Content size="lg">
        <Block>
            <Row>
            <Col md="6" lg="4">
              <PreviewAltCard className="card-bordered is-dark nk-wg-card mb-3">
                <div className="nk-iv-wg2">
                  <div className="nk-iv-wg2-title">
                    <h6 className="title">
                    <Icon name="info"></Icon> {t('total')}
                    </h6>
                  </div>
                  <div className="nk-iv-wg2-text">
                    <div className="nk-iv-wg2-amount">
                      $ {btcBalance !== -1 && Helper.limitDecimal(totalBalance,2)}
                       {/* {" USD"} */}
                      {/* <span className="change ">
                        <span className="sign"></span>1.55 BTC
                      </span> */}
                    </div>
                  </div>
                </div>
              </PreviewAltCard>
            </Col>
            </Row>
            
            <Row className="gy-gs mt-4">
                <Col md="6" lg="4" sm="6">
                  <PreviewAltCard className="card-bordered is-s1 nk-wg-card dash_item">
                    <div className="nk-iv-wg2">
                      <div className="nk-iv-wg2-title">
                        <h3 className="title" style={{display: "flex",justifyContent: "space-between"}}>
                          <div className='' style={{width: "9%", display: "flex", alignItems:"center", fontSize:"1.3rem"}}>
                            <img name="bitcoin" alt="BTC" style={{ marginRight: "10px"}} className='' src={BTCIcon}></img>Bitcoin
                          </div>
                          <UncontrolledDropdown className='float-right'>
                            <DropdownToggle
                              tag="a"
                              className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                            >
                            <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                              <li onClick={() => onDepositClick(btcitem.id, false)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#deposit"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="edit"></Icon>
                                    <span>{t('deposit')}</span>
                                  </DropdownItem>
                                </li>
                                  <li onClick={() => withdrawClick(btcitem.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#markasdone"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check-round-cut"></Icon>
                                      <span>{t('withdraw')}</span>
                                    </DropdownItem>
                                  </li>
                                  {btcitem.product !== "USD" && <li onClick={() => sellClick(btcitem.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#markasdone"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check-round-cut"></Icon>
                                      <span>{t('sell')}</span>
                                    </DropdownItem>
                                  </li>}
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </h3>

                      </div>
                      <div className="nk-iv-wg2-text">
                        <div className="nk-iv-wg2-amount">
                          {" $ "}
                          {btcBalance !== -1 && btcPrice !== 0 && Helper.limitDecimal(btcBalance * btcPrice, 2)} 
                          {/* USD{" "} */}
                          <span className="change ">
                            <span className="sign"></span>{btcBalance !== -1 && Helper.limitDecimal(btcBalance, 8)} BTC
                          </span >
                        </div>
                        <div className='text-right'>
                               { btcPrice !== 0 && <span>1 BTC = {Helper.limitDecimal(btcPrice, 2)} USD</span> }
                        </div>
                      </div>
                     
                    </div>
                  </PreviewAltCard>
                </Col>
                <Col md="6" lg="4" sm="6">
                  <PreviewAltCard className="card-bordered is-s1 nk-wg-card dash_item">
                    <div className="nk-iv-wg2">
                      <div className="nk-iv-wg2-title">
                        <h3 className="title" style={{display: "flex",justifyContent: "space-between"}}>
                          <div className='' style={{width: "9%", display: "flex", alignItems:"center",  whiteSpace: "nowrap", fontSize:"1.3rem"}}>
                            <img name="eth" alt="ETH" style={{ marginRight: "10px"}} className='' src={ETHIcon}></img>Ethereum
                          </div>
                          <UncontrolledDropdown className='float-right'>
                            <DropdownToggle
                              tag="a"
                              className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                            >
                            <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                              <li onClick={() => onDepositClick(ethitem.id, false)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#deposit"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="edit"></Icon>
                                    <span>{t('deposit')}</span>
                                  </DropdownItem>
                                </li>
                                  <li onClick={() => withdrawClick(ethitem.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#markasdone"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check-round-cut"></Icon>
                                      <span>{t('withdraw')}</span>
                                    </DropdownItem>
                                  </li>
                                  <li onClick={() => sellClick(ethitem.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#markasdone"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check-round-cut"></Icon>
                                      <span>{t('sell')}</span>
                                    </DropdownItem>
                                  </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </h3>

                      </div>
                      <div className="nk-iv-wg2-text">
                        <div className="nk-iv-wg2-amount">
                          {" $ "}
                          {ethBalance !== -1 && ethPrice !== 0 && Helper.limitDecimal(ethBalance * ethPrice, 2)} 
                          {/* USD{" "} */}
                          <span className="change ">
                            <span className="sign"></span>{ethBalance !== -1 && Helper.limitDecimal(ethBalance, 8)} ETH
                          </span >
                        </div>
                        <div className='text-right'>
                              {ethPrice !== 0 &&  <span>1 ETH = {Helper.limitDecimal(ethPrice, 2)} USD</span>}
                        </div>
                      </div>
                     
                    </div>
                  </PreviewAltCard>
                </Col>
                <Col md="6" lg="4" sm="6">
                  <PreviewAltCard className="card-bordered is-s1 nk-wg-card dash_item">
                    <div className="nk-iv-wg2">
                      <div className="nk-iv-wg2-title">
                        <h3 className="title" style={{display: "flex",justifyContent: "space-between"}}>
                          <div className='' style={{width: "9%", display: "flex", alignItems:"center",  whiteSpace: "nowrap", fontSize:"1.3rem"}}>
                            <img name="usdt" alt="USDT" style={{ marginRight: "10px"}} className='' src={USDTIcon}></img>Tether USD
                          </div>
                          <UncontrolledDropdown className='float-right'>
                            <DropdownToggle
                              tag="a"
                              className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                            >
                            <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                              <li onClick={() => onDepositClick(usdtitem.id, false)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#deposit"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="edit"></Icon>
                                    <span>{t('deposit')}</span>
                                  </DropdownItem>
                                </li>
                                  <li onClick={() => withdrawClick(usdtitem.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#markasdone"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check-round-cut"></Icon>
                                      <span>{t('withdraw')}</span>
                                    </DropdownItem>
                                  </li>
                                  <li onClick={() => sellClick(usdtitem.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#markasdone"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check-round-cut"></Icon>
                                      <span>{t('sell')}</span>
                                    </DropdownItem>
                                  </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </h3>

                      </div>
                      <div className="nk-iv-wg2-text">
                        <div className="nk-iv-wg2-amount d-none d-md-flex">
                          {" $ "}
                          {usdtBalance !== -1 && usdtPrice !== 0 && Helper.limitDecimal(usdtBalance * usdtPrice, 2)} 
                            <span className="change ">
                              <span className="sign"></span>{usdtBalance !== -1 && Helper.limitDecimal(usdtBalance, 2)} USDT
                            </span >
                        </div>
                        <div className="nk-iv-wg2-amount d-md-none d-block">
                         <div> {" $ "}
                            {usdtBalance !== -1 && usdtPrice !== 0 && Helper.limitDecimal(usdtBalance * usdtPrice, 2)} 
                          </div>
                            <span className="change d-block">
                              <span className="sign"></span>{usdtBalance !== -1 && Helper.limitDecimal(usdtBalance, 2)} USDT
                            </span >
                        </div>
                        <div className='text-right'>
                              {usdtPrice !== 0 &&  <span>1 USDT = {Helper.limitDecimal(usdtPrice, 2)} USD</span>}
                        </div>
                      </div>
                     
                    </div>
                  </PreviewAltCard>
                </Col>
                <Col md="6" lg="4" sm="6">
                  <PreviewAltCard className="card-bordered is-s1 nk-wg-card dash_item">
                    <div className="nk-iv-wg2">
                      <div className="nk-iv-wg2-title">
                        <h3 className="title" style={{display: "flex",justifyContent: "space-between"}}>
                          <div className='' style={{width: "9%", display: "flex", alignItems:"center",  whiteSpace: "nowrap", fontSize:"1.3rem"}}>
                            <img name="usdc" alt="USDC" style={{ marginRight: "10px"}} className='' src={USDCIcon}></img>USD Coin
                          </div>
                          <UncontrolledDropdown className='float-right'>
                            <DropdownToggle
                              tag="a"
                              className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                            >
                            <Icon name="more-h"></Icon>
                            </DropdownToggle>
                            <DropdownMenu right>
                              <ul className="link-list-opt no-bdr">
                              <li onClick={() => onDepositClick(usdcitem.id, false)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#deposit"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="edit"></Icon>
                                    <span>{t('deposit')}</span>
                                  </DropdownItem>
                                </li>
                                  <li onClick={() => withdrawClick(usdcitem.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#markasdone"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check-round-cut"></Icon>
                                      <span>{t('withdraw')}</span>
                                    </DropdownItem>
                                  </li>
                                  <li onClick={() => sellClick(usdcitem.id)}>
                                    <DropdownItem
                                      tag="a"
                                      href="#markasdone"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      <Icon name="check-round-cut"></Icon>
                                      <span>{t('sell')}</span>
                                    </DropdownItem>
                                  </li>
                              </ul>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </h3>

                      </div>
                      <div className="nk-iv-wg2-text">
                        <div className="nk-iv-wg2-amount d-none d-md-flex">
                          {" $ "}
                          {usdcBalance !== -1 && usdcPrice !== 0 && Helper.limitDecimal(usdcBalance * usdcPrice, 2)} 
                            <span className="change ">
                              <span className="sign"></span>{usdcBalance !== -1 && Helper.limitDecimal(usdcBalance, 2)} USDC
                            </span>
                        </div>
                        <div className="nk-iv-wg2-amount d-md-none d-block">
                         <div> {" $ "}
                            {usdcBalance !== -1 && usdcPrice !== 0 && Helper.limitDecimal(usdcBalance * usdcPrice, 2)} 
                          </div>
                            <span className="change d-block">
                              <span className="sign"></span>{usdcBalance !== -1 && Helper.limitDecimal(usdcBalance, 2)} USDC
                            </span>
                        </div>
                        <div className='text-right'>
                              {usdcPrice !== 0 &&  <span>1 USDC = {Helper.limitDecimal(usdcPrice, 2)} USD</span>}
                        </div>
                      </div>
                     
                    </div>
                  </PreviewAltCard>
                </Col>
                
                <Col md="6" lg="4" sm="6">
                  <PreviewAltCard className="card-bordered is-s3 nk-wg-card dash_item">
                    <div className="nk-iv-wg2">
                      <div className="nk-iv-wg2-title">
                      <h3 className="title" style={{display: "flex",justifyContent: "space-between"}}>
                          <div className='' style={{width: "9%", display: "flex", alignItems:"center", whiteSpace: "nowrap", fontSize:"1.3rem"}}>
                            <img name="bitcoin" alt="USD" style={{ marginRight: "10px"}} className='' src={USDIcon}></img> US dollar
                          </div>
                        <UncontrolledDropdown className='float-right'>
                          <DropdownToggle
                            tag="a"
                            className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                          >
                          <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-list-opt no-bdr">
                             {/* <li onClick={() => onDepositClick(usditem.id, false)}>
                                <DropdownItem
                                  tag="a"
                                  href="#deposit"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                  }}
                                >
                                  <Icon name="edit"></Icon>
                                  <span>Deposit</span>
                                </DropdownItem>
                              </li> */}
                                <li >
                                  <Link
                                    to="/requestwire"
                                  >
                                    <Icon name="check-round-cut"></Icon>
                                    <span>{t('withdraw')}</span>
                                  </Link>
                                </li>
                                {/* {usditem.product !== "USD" && <li onClick={() => sellClick(usditem.id)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#markasdone"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="check-round-cut"></Icon>
                                    <span>Sell</span>
                                  </DropdownItem>
                                </li>} */}
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                        </h3>
                      </div>
                      <div className="nk-iv-wg2-text" >
                        <div className="nk-iv-wg2-amount">
                          $ {usdBalance !== -1 && Helper.limitDecimal(usdBalance, 2) } 
                          {/* USD */}
                        </div>
                        <div className='text-right'>
                                <span style={{opacity: "0"}}>1</span>
                        </div>
                      </div>
                    </div>
                  </PreviewAltCard>
                </Col>
                {/* <Col md="12" lg="4">
                  <PreviewAltCard className="card-bordered is-s3 nk-wg-card">
                    <div className="nk-iv-wg2">
                      <div className="nk-iv-wg2-title">
                        <h6 className="title">
                          BTC price: <Icon name="info"></Icon>
                        </h6>
                      </div>
                      <div className="nk-iv-wg2-text">
                        <div className="nk-iv-wg2-amount">
                          {formatter.format(btcBalancePrice)}
                        </div>
                      </div>
                    </div>
                  </PreviewAltCard>
                </Col> */}
          </Row>
        </Block>
        <Modal isOpen={modal.withdraw} toggle={() => setModal({ withdraw: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">WITHDRAW {formData.product}</h5>
              <div className="mt-4">
                <Form className="gy-4" onSubmit={handleSubmit(onWithdrawSubmit)}>
                  <Row>
                    <FormGroup className='ml-4'>
                      <label className="form-label">{t('important_notice')}</label>
                      <div style={{fontSize: "13px"}}>
                          <p>
                          {t('minimum_withdrawal_amount')}:   {  minimumWithdrawAmount[formData.product.toLowerCase()]} {formData.product}

                          </p>
                          <p>
                          {t('withdraw_fee')}:  {formData.amount_withdraw === 0 ? ("0.1% + " + withdrawFeeRule[formData.product]) : ((formData.product === "USDT" || formData.product === "USDC" ) && Number(withdrawFee).toFixed(6) || Number(withdrawFee).toFixed(8))} {formData.product}
                          {/* 0.001 BTC + 0.1% of withdraw amount */}

                          </p>
                          <p>
                            {t('available_amount_withdraw')}:   { (formData.product === "USDT" ||  formData.product === "USDC" ) && Helper.limitDecimal(availableWithdrawAmount, 6) || Helper.limitDecimal(availableWithdrawAmount, 8)} {formData.product}
                          </p>
                      </div>
                    </FormGroup>
                  </Row>
                  { withdrawFinish === 0?
                  <Row >
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">{t('withdraw')} {t('amount')}</label>
                        <input
                          type = "text"
                          value={formData.amount_withdraw}
                          className="form-control"
                          placeholder= {`0.00 ${formData.product}`}
                          onChange={(e) =>{ 
                              if(e.target.value == "") 
                                setFormData({ ...formData, amount_withdraw: e.target.value }); 
                              if (/^\d+\.?\d{0,8}$/.test(e.target.value) && formData.product === "BTC")
                                setFormData({ ...formData, amount_withdraw: e.target.value }); 
                              if (/^\d+\.?\d{0,8}$/.test(e.target.value) && formData.product === "ETH")
                                setFormData({ ...formData, amount_withdraw: e.target.value }); 
                              if (/^\d+\.?\d{0,6}$/.test(e.target.value) && (formData.product === "USDT" || formData.product === "USDC" ))
                                setFormData({ ...formData, amount_withdraw: e.target.value }); 
                              if (e.target.value <= availableWithdrawAmount && e.target.value > 0)
                                setErrorsWithdraw({...errorsSell, status: false});
                              else if (e.target.value > availableWithdrawAmount )
                                setErrorsWithdraw({...errorsSell, status: true, message: t('amount_under_available_error')});
                              else 
                                setErrorsWithdraw({
                                  status: true,
                                  message: t('amount_over_error')
                                })

                            } 
                          }
                          name = "amount"
                          // ref={register({
                          //   required: "This field is required", validate: (value) =>{ if (value < 0.0025) return "Amount must be over 0.0025"; if (value > availableWithdrawAmount) return "Amount must be under available amount"; }
                          // })}
                        />
                        {errorsWithdraw.status && <span className="invalid">{errorsWithdraw.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">{formData.product}  {t('address')}</label>
                        <input  
                          className="form-control" 
                          value={formData.address_withdraw}
                          placeholder = {`Enter the ${formData.product} address`}
                          onChange={(e) =>{ 
                            if (/^[A-Za-z0-9]*$/.test(e.target.value)) 
                              setFormData({ ...formData, address_withdraw: e.target.value });
                            if (e.target.value === "") {
                              setErrorsWithdrawAddr({
                                status: true,
                                message: t('required')
                              })
                            } else {
                              setErrorsWithdrawAddr({
                                status: false,
                                message: t('required')
                              })
                            }
                            } }
                          // ref={register({required: "This field is required" })}
                          name="address_withdraw"
                        />
                          {errorsWithdrawAddr.status && <span className="invalid">{errorsWithdrawAddr.message}</span>}

                      </FormGroup>
                    </Col>
                  </Row>: (withdrawFinish === 1?
                  <Row className='success_dlg'>
                    {t('withdraw_success', {amount: formData.amount_withdraw + formData.product, address: formData.address_withdraw})}
                  </Row>:
                  <Row className='fail_dlg'>
                      {t('failed')}
                  </Row>)
                  }
                  <Row className="ml-2">
                    <ul className=" align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      { withdrawFinish === 0 &&
                      <li>
                        <Button color="primary" size="md" type="submit">
                            {loading ? <Spinner size="sm" color="light" /> : t('withdraw')}
                        </Button>
                      </li>}
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                            {withdrawFinish === 0 ? t('cancel') : t('close') }
                        </Button>
                      </li>
                    </ul>
                  </Row>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={modal.deposit} toggle={() => setModal({ deposit: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">{t('deposit')}</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onDepositSubmit)}>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">{t('deposit_address_desc')}</label>
                    </FormGroup>
                  </Col>
                  <Row  className="center text-center" style={{width: "100%"}}>
                      {deposit_address !== "" && deposit_address !== null && <img alt="Address"
                        src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${deposit_address}`}
                      />}
                  </Row>
                  <div style={{width: "95%"}}>
                      <Button color="primary" size="md" type="submit" className="float-right" onClick={(e) => { e.preventDefault(); onDepositClick(activeId, true)}}>
                        {loading ? <Spinner size="sm" color="light" /> :  t('change_address')}
                      </Button>
                  </div>
                  <Col md="12">
                    <FormGroup>
                    <CodeBlock title ={t('address')}
                      children = {deposit_address}
                      >
                      {deposit_address}
                    </CodeBlock>
                    </FormGroup>
                  </Col>
                     <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          {t('close')}
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={modal.sell} toggle={() => setModal({ sell: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">{t('sell')} {formData.product}</h5>
              <div className="mt-4">
                <Form className="gy-4" onSubmit={handleSubmit(onSellSubmit)}>
                  { sellFinish === 0 ? <Col size="12"><Col md="12">
                  {formData.product !== "USDT" && formData.product !== "USDC" && <FormGroup>
                      <label className="form-label">{t('important_notice')}</label>
                      <div>
                            {t('important_notice_desc')}
                      </div>
                    </FormGroup>}
                    <label className="form-label">{t('minimum_amount')} : { minimumSellAmount[[formData.product.toLowerCase()]]} {formData.product}</label><br/>
                    <label className="form-label">{t('maximum_amount')} : {maximumSellAmount[[formData.product.toLowerCase()]] || "No limit"} {maximumSellAmount[[formData.product.toLowerCase()]] && formData.product}</label><br/>
                    <label className="form-label">{t('available_amount')} : {availableSellAmount} {formData.product}</label>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">{t('sell')} {t('amount')}</label>
                      <input
                        type = "text"
                        value={formData.amount_sell}
                        className="form-control"
                        placeholder="0.00 BTC"
                        onChange={(e) =>{ 
                          if(e.target.value == "") 
                            setFormData({ ...formData, amount_sell: e.target.value }); 
                          if (/^\d+\.?\d{0,5}$/.test(e.target.value) && formData.product === "BTC")
                            setFormData({ ...formData, amount_sell: e.target.value }); 
                          if (/^\d+\.?\d{0,2}$/.test(e.target.value) && formData.product === "ETH")
                            setFormData({ ...formData, amount_sell: e.target.value }); 
                          if (/^\d+\.?\d{0,2}$/.test(e.target.value) && (formData.product === "USDT" || formData.product !== "USDC"))
                            setFormData({ ...formData, amount_sell: e.target.value }); 
                          if (e.target.value <= parseFloat(availableSellAmount) && e.target.value > 0)
                            setErrorsSell({...errorsSell, status: false});
                          else if (e.target.value > maximumSellAmount[[formData.product.toLowerCase()]] && (formData.product!=="USDT" && formData.product !== "USDC"))
                            setErrorsSell({...errorsSell, status: true, message: t('amount_under_max_error')});
                           else if (e.target.value > parseFloat(availableSellAmount) )
                            setErrorsSell({...errorsSell, status: true, message: t('amount_under_available_error')});
                            else 
                            setErrorsSell({
                              status: true,
                                message: t('amount_over_error')
                            })

                      }}
                        name = "amount_sell"
                        // ref={register({
                        //   required: "This field is required", validate: (value) =>{ if (value > availableSellAmount) return "Amount must be under available amount"; }
                        // })}
                      />
                      {errorsSell.status && <span className="invalid">{errorsSell.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">{t('receive_desc')} </label>
                      <div className="pricing-amount text-center">
                        <div className="amount">
                          {Helper.limitDecimal(amount_receive, 2)} <span >USD</span>
                        </div>
                      </div>
                    </FormGroup>
                  </Col></Col>: (sellFinish === 1?
                    <Col md="12" className='success_dlg'>
                          {t('sell_success', {amount: formData.amount_sell+formData.product})}
                    </Col> :
                    <Col md="12" className='fail_dlg'>
                        {t('sell_failed')}
                    </Col>
                  )}
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-around">
                    {sellFinish === 0 &&<li>
                        <Button color="primary" size="md" type="submit">
                        {loading ? <Spinner size="sm" color="light" /> : t('sell')}
                        </Button>
                      </li>}
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                            {sellFinish === 0 ? t('cancel') : t('close')}
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={modal.sellConfirm} toggle={() => setModal({ sellConfirm: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onSellConfirmFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">{t('sure_sell', {amount: formData.amount_sell + formData.product})}</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onSellConfirmSubmit)}>
                  <Col md="12">
                    <FormGroup>
                      <div>
                           You receive {Helper.limitDecimal(amount_receive, 2)} USD.
                      </div>
                    </FormGroup>
                  </Col>
                 <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          {t('confirm')}
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onSellConfirmFormCancel();
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
        <Modal isOpen={modal.withdrawConfirm} toggle={() => setModal({ withdrawConfirm: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onWithdrawConfirmFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title" style={{overflowWrap: "anywhere"}}>{t('sure_withdraw', {amount: formData.amount_withdraw + formData.product, address: formData.address_withdraw})}</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onWithdrawConfirmSubmit)}>
                  <Col md="12">
                    <FormGroup>
                      <div>
                      </div>
                    </FormGroup>
                  </Col>
                 <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          {t('confirm')}
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            onWithdrawConfirmFormCancel();
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
      </Content>
      <Modal isOpen={modal.auth} toggle={() => setModal({ auth: false })} className="modal-dialog-centered" backdrop="static" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                setModal({...modal, auth: false});

              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title" style={{overflowWrap: "anywhere"}}>{t('sure_withdraw', {amount: formData.amount_withdraw + formData.product, address: formData.address_withdraw})}</h5>
              <div className="">
                <Form className="row gy-4" onSubmit={handleSubmit(confirmWithdraw)}>
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
                          {errorsf.authfield.status && <p className="invalid">{t('required')}</p>}
                    
                        </div>
                    </FormGroup>
                  </Col>
                 <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit" >
                         {loadingConfirm ? <Spinner size="sm" color="light" /> : t('confirm')}

                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal({ auth: false })
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

export default Dashboard;