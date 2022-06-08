import React, {
  useEffect,
  useState,
} from 'react';
import NonceGenerator from 'a-nonce-generator';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';

import {
  setAccounts,
  setChecking,
  setCurrentUser,
  setQuoteData,
  setDepositAddress
} from '../actions';
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  CodeBlock,
  Col,
  Icon,
  PaginationComponent,
  ProjectCard,
  Row,
} from '../components/Component';
import BTCIcon from '../images/coins/bitcoin01.png';
import USDTIcon from '../images/coins/USDT.png';
import ETHIcon from '../images/coins/ETH.png';
import USDIcon from '../images/coins/USD02.png';
import Content from '../layout/content/Content';
import Head from '../layout/head/Head';
import api, {
  getAuthenticatedApi,
  getAuthenticatedApi2,
  myServerApi,
} from '../utils/api';
import Helper, {CONFIGURATOR_USERNAME, CONFIGURATOR_PASSWORD} from '../utils/Helper';
import Http from '../utils/Http';
import axios from 'axios';

import { projectData } from './ProjectData';
import { Link } from 'react-router-dom';
let RapidAPIKey = 'a796cf80b6msh2cd74f5c615d6fcp13183fjsnfec9e21ddbfe';

const MyWallet = () => {
  const history = useHistory();
  const user = useSelector((state) => state.user.user)
  const email = user?.username;
  const user_id = localStorage.getItem("user_id");
  const verification_status = user?.verification_status;
  const dispatch = useDispatch();
  const [sm, updateSm] = useState(false);
    // coin relative status
    const [totalBalance, setTotalBalance] = useState(22);
    const [btcBalance, setBtcBalance] = useState(-1)
    const [usdBalance, setUsdBalance] = useState(-1)
    const [usdtBalance, setUsdtBalance] = useState(-1)
    const [ethBalance, setEthBalance] = useState(-1)
    const [btcPrice, setBtcPrice] = useState(0)
    const [usdtPrice, setUsdtPrice] = useState(0)
    const [ethPrice, setEthPrice] = useState(0)
    const [btcitem, setBtcitem] = useState({})
    const [usditem, setUsditem] = useState({})
    const [usdtitem, setUsdtitem] = useState({})
    const [ethitem, setEthitem] = useState({})
    const [correctFlag, setCorrectFlag] = useState(false)

  const [modal, setModal] = useState({
    withdraw: false,
    deposit: false,
    sell: false,
    sellConfirm: false,
    withdrawConfirm: false,
    auth: false,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(projectData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  // Get current list, pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { errors, register, handleSubmit } = useForm();
  const btc_address = useSelector(state => state.user.btc_address);
  const usdt_address = useSelector(state => state.user.usdt_address);
  const eth_address = useSelector(state => state.user.eth_address);
  const [deposit_address, setDeposit_address] = useState("")
  const [hideWallet, setHideWallet] = useState(false);
  const [activeId, setActiveId] = useState("");
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
  const [formData, setFormData] = useState({
    product: "",
    amount_withdraw: "",
    amount_sell: 0,
    address_withdraw: "",
    date: new Date(),
  });
  const [sellFinish, setSellFinish] = useState(0);        //0: not start, 1: success, 2: failed
  const [withdrawFinish, setWithdrawFinish] = useState(0);//0: not start, 1: success, 2: failed

  const [amount_receive, setAmount_receive] = useState("")
  // /api/v1/securities/statistics
  const [availableWithdrawAmount, setAvailableWithdrawAmount] = useState("");
  const [availableSellAmount, setAvailableSellAmount] = useState("");
  const [withdrawFee, setWithdrawFee] = useState(0);
  const [withdrawFeeRule, setWithdrawFeeRule] = useState({
    BTC: 0.001,
    ETH: 0.005,
    USDT: 20,
  })
  const [sellId, setSellId] = useState("")
  const [minimumWithdrawAmount, setMinimumWithdrawAmount] = useState({
    btc: 0.0025,
    eth: 0.03,
    usdt: 70,
  })
  const [minimumSellAmount, setMinimumSellAmount] = useState({
    btc: 0.0001,
    eth: 0.01,
    usdt: 1,
  })
  const [maximumSellAmount, setMaximumSellAmount] = useState({
    btc: 3,
    eth: 5,
    usdt: null,
  })
  const [secret_val, setSecret_val] = useState("")
  const [authCode, setAuthCode] = useState("")
  const accounts = useSelector(state => state.user.accounts);
  const pairPriceArr = useSelector(state => state.user.quote);
  
  let accouts_arr = Object.keys(accounts).map((key) => [Number(key), accounts[key]]);
  // function to reset the form
  const resetForm = () => {
    setFormData({
      address: "",
      product: "",
      amount_withdraw: "",
      address_withdraw: "",
      date: new Date(),
    });
  };
  const myApi = myServerApi();

  // function to close the modal
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
          message: "Amount must be over minimum withdraw one"
        })
        return;
    } 
    if (formData.amount_withdraw > availableWithdrawAmount) {
      setErrorsWithdraw({
        status: true,
        message: "Amount must be under the available one"
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
    setModal({...modal, ...{ withdrawConfirm : true}});
    
  };
  const onWithdrawConfirmSubmit = async () => {
    if(loading)
        return;
        // const myApi = myServerApi();
      // let security = await myApi.get(`security/${email}`)
      // let twoFactor = security.data.data;
      // setLoading(false);
      // if (twoFactor.status === 1 && twoFactor.withdraw === 1){
        setModal({...modal, auth: true});
        // setSecret_val(security.data.data.code_from_app);

      // } else {
      //   setModal({...modal, ...{withdrawConfirm : false}});
      
      //   const secureApi = getAuthenticatedApi();
      //   let data = {
      //     exchange: "PLUSQO",
      //     product: formData.product,
      //     amount:  formData.amount_withdraw,
      //     address: formData.address_withdraw,
      //     // code: '',
      //     // network: "Stellar"
      //   }
      //   // dispatch(setChecking(true));
    
      //   setLoading(true)
      //   secureApi.post(`/wallet/withdraw/create`, data).then(res => {
      //       if (res && res.data && res.data.success) {
      //         secureApi.get(`/wallet/transaction/status?txid=${res.data.txid}&state_hash=${res.data.state_hash}&timeout=10000`).then(response => {
      //           setLoading(false)
      //           if (response.data.success) {
      //             setWithdrawFinish(1);

      //             toast.success("Successfully Withdrawed");
      //             // setModal({ withdraw: false });
      //             dispatch(setChecking(false))
      //             let exchange_access_token =localStorage.getItem("exchange_access_token")
      //             if (exchange_access_token !== null && exchange_access_token !== "") {
      //               Http.getAccounts(exchange_access_token)
      //               .then((response) => {
      //                   if (response.message === "Unauthorized"){
      //                     history.push("auth-login");
      //                     dispatch(setChecking(false));
      //                     return;
      //                   }
      //                   // setModal({ sell: false });
      //                   setLoading(false);
      //                   dispatch(setAccounts(response));
      //                 })
      //             }else{
      //               // history.push("auth-login")
      //             }
      //             let withdrawInfo = {
      //                 ...data,
      //                 email: email,
      //             };
      //             myApi.post("/withdraw", withdrawInfo)
      //             .then( res => {
                    
      //             })
      //             .catch()
      //           } else {
      //             setWithdrawFinish(2);
      //             toast.error("Server not response");
      //           }
      //           dispatch(setChecking(false))

      //         })
      //       }
      //   }).catch(err => {
      //     setWithdrawFinish(2);
      //     toast.error(err.response.data.message);
      //       setLoading(false)
      //       console.log('error: ', err);
      //   });
      // }
  };
  const confirmWithdraw = async () => {
    if(loading)
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
      toast.warn("Please input correct code");
      return;
    }
      setModal({...modal, ...{auth : false}});
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
    if (formData.amount_sell <= 0) {
        setErrorsSell({
          status: true,
          message: "Amount must be a positive number"
        })
        return;
    } 
    if (formData.product !== "USDT")
      if (formData.amount_sell > maximumSellAmount[formData.product.toLowerCase()]) {
        setErrorsSell({
          status: true,
          message: "Amount must be under the maximum one"
        })
        return;
      }
    if (formData.amount_sell > parseFloat(availableSellAmount)) {
      setErrorsSell({
        status: true,
        message: "Amount must be under the available one"
      })
      return;
    }
    setModal({...modal, ...{sellConfirm : true}});
  }
  const onSellConfirmSubmit = () => {
    const secureApi = getAuthenticatedApi();
      setModal({...modal, ...{sellConfirm : false}});
      setLoading(true);
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
    if (formData.product === "USDT"){
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
            comment:"USDT Sell", 
            currency:"USD"
          }
          let url = `https://config.plusqo.shiftmarketsdev.com/api/users/${bodyData.userId}/accounts/${usditem.id}/balancecorrection`;
            let sellData = {
              papFlag: false,
              email: email,
              bodyData: bodyData,
              amount1: data.quantity,
              amount2: data.quantity,
              balance1: usdtBalance,
              balance2: usdBalance,
              url: url,
              headers: headers
            }
            myApi.put("sell", sellData)
            .then(result => {
              let usdtData = {
                userId: user_id, 
                accountId: usdtitem.id, 
                type:5, 
                amount: -(data.quantity), 
                comment: "USDT Sell", 
                currency: "USDT"
              }
              url = `https://config.plusqo.shiftmarketsdev.com/api/users/${usdtData.userId}/accounts/${usdtitem.id}/balancecorrection`;
              sellData = {
                  papFlag: false,
                  email: email,
                  bodyData: usdtData,
                  amount1: data.quantity,
                  amount2: data.quantity,
                  balance1: usdBalance,
                  balance2: usdBalance,
                  url: url,
                  headers: headers
                }
               myApi.put("sell", sellData)
                .then(result => {
                  if(result.data.success){
                    setSellFinish(1);
                    toast.success("Successfully corrected balance");
                    Http.getAccounts(localStorage.getItem("exchange_access_token"))
                    .then((response) => {
                      if (response.message === "Unauthorized"){
                        history.push("auth-login");
                        dispatch(setChecking(false));
                        return;
                      }
                      else
                          dispatch(setAccounts(response));
                    })
                    .catch( e => {
                    
    
                    })
                  }
                  else {
                    setSellFinish(2);
                    toast.error("Failed corrected balance");
                  }
                  setLoading(false);
                  console.log("successfully selled")
                })
                .catch( e => {
                  setSellFinish(2);
                  setLoading(false);
                  toast.error("Failed corrected balance");
                  console.log("sell error")
                })
               
               
            })
            .catch( e => {
              setSellFinish(2);
              toast.error("Failed corrected balance");
              setLoading(false);
                console.log("sell error")
            })

          
          .catch( e => {
            setSellFinish(2);
            setLoading(false);
            toast.error("Failed corrected balance");
            console.log("sell error")
          })
      })
      .catch(e => {
            setSellFinish(2);
            setLoading(false);
            toast.error("Failed corrected balance");
            console.log("sell error")
      })
    } else {
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
                      let price = null;
                      let balance = null;
                      if (formData.product === "BTC"){
                        price = btcPrice;
                        balance = btcBalance;
                      }
                      if (formData.product === "ETH") {
                          balance = ethBalance;
                          price = ethPrice;
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
                          setLoading(false);
                          if(result.data.success){
                            setSellFinish(1);
                            toast.success("Successfully corrected balance");
                          }
                          else {
                            setSellFinish(2);
                            toast.error("Failed corrected balance");
                          }
                        }).catch( e => {
                            setSellFinish(2);
                            console.log("sell error")
                          setLoading(false);
                        })
                      }
                      else {
                          setSellFinish(2);
                          toast.error("Failed balance correction");
                      }
                    })
                .catch( e => {
                  console.log("sell error")
                  setSellFinish(2);
                  setLoading(false);
                  toast.error("Failed corrected balance");
                })
          }
          else{
            toast.error("Failed balance correction");
            setSellFinish(2);
            setLoading(false);
          }
          // dispatch(setChecking(false));
   
      }).catch(err => {
          console.log('error: ', err);
          // dispatch(setChecking(false));
          setLoading(false);
          setSellFinish(2);
          toast.error("Failed corrected balance");
          
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
              eth_address : res.data.data.eth_address,
            }
            if ((item.product === "BTC" && (data.btc_address === null || data.btc_address === "")) || (item.product === "ETH" && (data.eth_address === null ||data.eth_address === "")) || (item.product === "USDT" && (data.usdt_address === null||data.usdt_address === ""))) {
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
    const myApi = myServerApi();
    let security = await myApi.get(`security/${email}`)
    let twoFactor = security.data.data;
    setLoading(false);
    if (twoFactor.status !== 1){
      toast.warn("You must enable 2FA function");
      history.push("/security");
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
            product: item.product,
            amount_withdraw: 0,
            address_withdraw: "",
          });
          let availableAmount = (item.balance.active_balance - 0.001)/1.001;
          if (item.product === "ETH") {
            availableAmount = (item.balance.active_balance - 0.005)/1.001;
          }
          if (item.product === "USDT") {
            availableAmount = (item.balance.active_balance - 20)/1.001;
          }
        if(availableAmount < 0)
            availableAmount = 0;
          setAvailableWithdrawAmount(availableAmount);
        
        }
      }
    }
      
    setModal({ withdraw: true }, { deposit: false });
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
            setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance, 5));
          }
          if (item.product === "ETH") {
            setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance, 2));
          }
          if (item.product === "USDT") {
            setAvailableSellAmount(Helper.limitDecimal(item.balance.active_balance, 2));
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
      for (const key in accouts_arr) {
        let item = accouts_arr[key];
          item = item[1]
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
          }
          if (item.product === "BTC") {
            setBtcBalance(item.balance.active_balance);
            setBtcitem(item);
          } 
          if (item.product === "USD") {
              setUsdBalance(item.balance.active_balance);
              setUsditem(item);
            } 
          if (item.product === "USDT") {
              setUsdtBalance(item.balance.active_balance);
              setUsdtitem(item);
            } 
          if (item.product === "ETH") {
              setEthBalance(item.balance.active_balance);
              setEthitem(item);
            } 
      }
    }, [accounts])
  const { amount_sell } = formData;

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
          if (element.pair === "BTCUSD"){
            let buyBtcPrice = element.bid;
            setBtcPrice(buyBtcPrice);
          }
          if (element.pair === "USDTUSD"){
            let buyUsdtPrice = element.bid;
            setUsdtPrice(1);
          }
          if (element.pair === "ETHUSD"){
            let buyEthPrice = element.bid;
            setEthPrice(buyEthPrice);
          }
        }
      }
    }

  }, [ pairPriceArr ]);
  useEffect(() => {
    if (formData.product === "BTC") {
      let real_receive = formData.amount_sell * btcPrice;
      setAmount_receive(real_receive)
    }
    if (formData.product === "USDT") {
      let real_receive = formData.amount_sell * usdtPrice;
      setAmount_receive(real_receive)
    }
    if (formData.product === "ETH") {
      let real_receive = formData.amount_sell * ethPrice;
      setAmount_receive(real_receive)
    }
  }, [amount_sell, btcPrice, btcBalance, usdBalance, usdtBalance, ethBalance, formData.product])
  useEffect(() => {
    let withdraw_fee = "";
      if (formData.amount_withdraw !== "") {
        if (formData.product === "BTC")
          withdraw_fee = 0.001 + formData.amount_withdraw /1000;         
        else if (formData.product === "ETH"){
          withdraw_fee = 0.005 + formData.amount_withdraw /1000;         

        } else if (formData.product === "USDT"){
          withdraw_fee = 20 + formData.amount_withdraw /1000;         

        } 
        
      } 
    setWithdrawFee(withdraw_fee);
}, [formData.amount_withdraw])

  return (
    <React.Fragment>
      <Head title="My Wallet"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Your Wallet</BlockTitle>
              {/* <BlockDes className="text-soft">You have following tokens</BlockDes> */}
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    {/* <li className="nk-block-tools-opt" > */}
                        <Button tag="a" onClick={(e) => {setHideWallet(!hideWallet)}} className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                          {!hideWallet && <span>Hide wallet with 0 balance</span>}
                          {hideWallet && <span>Show wallet with 0 balance</span>}
                        </Button>
                    {/* </li> */}
                    {/* <li className="nk-block-tools-opt" onClick={() => setModal()}>
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Buy New TOKEN</span>
                      </Button>
                    </li> */}
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
              {
                (btcBalance !== 0 || !hideWallet) && (btcBalance !== -1) && <Col sm="6" lg="4" xxl="3" >
                    <ProjectCard>
                      <div className="project-head">
                        <a
                          href="#title"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="project-title"
                        >
                          <img name="bitcoin" alt="BTC" style={{width: "13%"}} className='' src={BTCIcon}></img> 
                          <div className="project-info ml-3">
                            <h4 className="title"><h4 className="title" style={{fontSize: "1.2rem"}}>Bitcoin</h4></h4>
                              <h4 className="">{Helper.limitDecimal(btcBalance, 8)}  <label style={{fontSize: "1rem"}}>BTC</label></h4>
                          </div>
                        </a>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="a"
                            className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                          >
                          <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-list-opt no-bdr">
                              {btcitem.product !== "USD" && <li onClick={() => onDepositClick(btcitem.id, false)}>
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
                              </li>
                              }
                                <li onClick={() => withdrawClick(btcitem.id)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#markasdone"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="check-round-cut"></Icon>
                                    <span>Withdraw</span>
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
                                    <span>Sell</span>
                                  </DropdownItem>
                                </li>}
                             
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </ProjectCard>
                  </Col>
              }
                {
                (ethBalance !== 0 || !hideWallet) && (ethBalance !== -1) && <Col sm="6" lg="4" xxl="3" >
                    <ProjectCard>
                      <div className="project-head">
                        <a
                          href="#title"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="project-title"
                        >
                          <img name="eth" alt="ETH" style={{width: "13%"}} className='' src={ETHIcon}></img> 
                          <div className="project-info ml-3">
                            <h4 className="title"><h4 className="title" style={{fontSize: "1.2rem"}}>Ethereum</h4></h4>
                              <h4 className="">{Helper.limitDecimal(ethBalance, 8)}  <label style={{fontSize: "1rem"}}>ETH</label></h4>
                          </div>
                        </a>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="a"
                            className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                          >
                          <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-list-opt no-bdr">
                              {ethitem.product !== "USD" && <li onClick={() => onDepositClick(ethitem.id, false)}>
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
                              </li>
                              }
                                <li onClick={() => withdrawClick(ethitem.id)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#markasdone"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="check-round-cut"></Icon>
                                    <span>Withdraw</span>
                                  </DropdownItem>
                                </li>
                                {ethitem.product !== "USD" && <li onClick={() => sellClick(ethitem.id)}>
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
                                </li>}
                             
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </ProjectCard>
                  </Col>
              }
                {
                (usdtBalance !== 0 || !hideWallet) && (usdtBalance !== -1) && <Col sm="6" lg="4" xxl="3" >
                    <ProjectCard>
                      <div className="project-head">
                        <a
                          href="#title"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="project-title"
                        >
                          <img name="usdt" alt="USDT" style={{width: "13%"}} className='' src={USDTIcon}></img> 
                          <div className="project-info ml-3">
                            <h4 className="title"><h4 className="title" style={{fontSize: "1.2rem"}}>Tether USD</h4></h4>
                              <h4 className="">{Helper.limitDecimal(usdtBalance, 2)}  <label style={{fontSize: "1rem"}}>USDT</label></h4>
                          </div>
                        </a>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="a"
                            className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                          >
                          <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-list-opt no-bdr">
                              {usdtitem.product !== "USD" && <li onClick={() => onDepositClick(usdtitem.id, false)}>
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
                              </li>
                              }
                                <li onClick={() => withdrawClick(usdtitem.id)}>
                                  <DropdownItem
                                    tag="a"
                                    href="#markasdone"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                    }}
                                  >
                                    <Icon name="check-round-cut"></Icon>
                                    <span>Withdraw</span>
                                  </DropdownItem>
                                </li>
                                {usdtitem.product !== "USD" && <li onClick={() => sellClick(usdtitem.id)}>
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
                                </li>}
                             
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </ProjectCard>
                  </Col>
              }
                {
                (usdBalance !== 0 || !hideWallet) && (usdBalance !== -1) && <Col sm="6" lg="4" xxl="3" >
                    <ProjectCard>
                      <div className="project-head">
                        <a
                          href="#title"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="project-title"
                        >
                          <img name="usd" alt="USD" style={{width: "13%"}} className='' src={USDIcon}></img> 
                          <div className="project-info ml-3">
                            <h4 className="title"><h4 className="title" style={{fontSize: "1.2rem"}}>US dollar</h4></h4>
                              <h4 className="">{Helper.limitDecimal(usdBalance, 2)}  <label style={{fontSize: "1rem"}}>USD</label></h4>
                          </div>
                        </a>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="a"
                            className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 mr-n1"
                          >
                          <Icon name="more-h"></Icon>
                          </DropdownToggle>
                          <DropdownMenu right>
                            <ul className="link-list-opt no-bdr">
                                <li >
                                  <Link
                                    to="/requestwire"
                                  >
                                    <Icon name="check-round-cut"></Icon>
                                    <span>Withdraw</span>
                                  </Link>
                                </li>
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </ProjectCard>
                  </Col>
              }
          </Row>
          <div className="mt-5">
            <PaginationComponent
              itemPerPage={itemPerPage}
              totalItems={data.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
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
                  <Col size="12">
                    <FormGroup>
                      <label className="form-label">Important Notice</label>
                      <div style={{fontSize: "13px"}}>
                          <p>
                          Minimum withdrawal amount:   {  minimumWithdrawAmount[formData.product.toLowerCase()]} {formData.product}

                          </p>
                          <p>
                          Withdrawal fee:  {formData.amount_withdraw === 0 ? ("0.1% + " + withdrawFeeRule[formData.product]) : (formData.product === "USDT" && Number(withdrawFee).toFixed(6) || Number(withdrawFee).toFixed(8))} {formData.product}
                          {/* 0.001 BTC + 0.1% of withdraw amount */}

                          </p>
                          <p>
                          Available amount for withdrawal:   { formData.product === "USDT" && Helper.limitDecimal(availableWithdrawAmount, 6) || Helper.limitDecimal(availableWithdrawAmount, 8)} {formData.product}

                          </p>
                      </div>
                    </FormGroup>
                  </Col>
                  { withdrawFinish === 0?
                  <Row >
                    <Col md="6">
                      <FormGroup>
                        <label className="form-label">Amount {formData.product} to withdraw</label>
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
                              if (/^\d+\.?\d{0,6}$/.test(e.target.value) && formData.product === "USDT")
                                setFormData({ ...formData, amount_withdraw: e.target.value }); 
                              if (e.target.value <= availableWithdrawAmount && e.target.value > 0)
                                setErrorsWithdraw({...errorsSell, status: false});
                              else if (e.target.value > availableWithdrawAmount )
                                setErrorsWithdraw({...errorsSell, status: true, message: "Amount must be under the available one"});
                              else 
                                setErrorsWithdraw({
                                  status: true,
                                  message: "Amount must be a minimum one"
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
                        <label className="form-label">{formData.product} address</label>
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
                                message: "Address is required"
                              })
                            } else {
                              setErrorsWithdrawAddr({
                                status: false,
                                message: "Address is required"
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
                     {formData.amount_withdraw + " " + formData.product} successfully withdrawed to {formData.address_withdraw}
                  </Row>:
                  <Row className='fail_dlg'>
                      Failed
                  </Row>)
                  }
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                    { withdrawFinish === 0 &&
                      <li>
                            <Button color="primary" size="md" type="submit">
                              {loading ? <Spinner size="sm" color="light" /> : "Withdraw"}
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
                            {withdrawFinish === 0 ? "Cancel" : "Close"}
                        </Button>
                      </li>
                    </ul>
                  </Col>
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
              <h5 className="title">Deposit</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onDepositSubmit)}>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Please deposit to below address</label>
                    </FormGroup>
                  </Col>
                  <Col size="12" className="center">
                  {deposit_address !== "" && deposit_address !== null && 
                      <img alt="Address"
                        src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${deposit_address}`}
                        // src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=1JAtyMKSQozF8sosREK3KBoANFRAPPtAzr`}
                      />
                  }
                  </Col>
                  <div style={{width: "95%"}}>
                      <Button color="primary" size="md" type="submit" className="float-right" onClick={(e) => { e.preventDefault(); onDepositClick(activeId, true)}}>
                        {loading ? <Spinner size="sm" color="light" /> : " Change address"}
                      </Button>
                  </div>
                    
                    <Col md="12">
                      <FormGroup>
                      <CodeBlock title = "Address"
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
                          Cancel
                        </Button>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={modal.sell} toggle={() => setModal({ sell: false })} className="modal-dialog-centered" size="lg" backdrop="static">
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
              <h5 className="title">Sell {formData.product}</h5>
              <div className="mt-4">
                <Form className="gy-4" onSubmit={handleSubmit(onSellSubmit)}>
                {
                sellFinish === 0 ?<Col  size="12"><Col md="12">
                {formData.product !== "USDT" && <FormGroup>
                      <label className="form-label">Important Notice</label>
                      <div>
                            Because Cryptocurrency price is changed rapidly from time to time, the final amount in USD you will receive for your selling is subject to be changed according to the market price at the time your selling order is submitted.
                      </div>
                    </FormGroup>}
                    <label className="form-label">Minimum Amount : { minimumSellAmount[[formData.product.toLowerCase()]]} {formData.product}</label><br/>
                    <label className="form-label">Maximum Amount : {maximumSellAmount[[formData.product.toLowerCase()]] || "No limit"} {maximumSellAmount[[formData.product.toLowerCase()]] && formData.product}</label><br/>
                    <label className="form-label">Available Amount : {availableSellAmount} {formData.product}</label>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Amount {formData.product} to sell</label>
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
                          if (/^\d+\.?\d{0,2}$/.test(e.target.value) && formData.product === "USDT")
                            setFormData({ ...formData, amount_sell: e.target.value }); 
                            if (e.target.value <= parseFloat(availableSellAmount) && e.target.value > 0)
                              {
                                setErrorsSell({...errorsSell, status: false});
                              }
                            else if (e.target.value > maximumSellAmount[[formData.product.toLowerCase()]] && formData.product!=="USDT")
                              setErrorsSell({...errorsSell, status: true, message: "Amount must be under the maximum one"});
                            else if (e.target.value > parseFloat(availableSellAmount) ){
                              setErrorsSell({...errorsSell, status: true, message: "Amount must be under the available one"});
                            }
                            else 
                              setErrorsSell({
                                status: true,
                                message: "Amount must be over minimum sell one"
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
                      <label className="form-label">You will receive </label>
                      <div className="pricing-amount text-center">
                        <div className="amount">
                          {Helper.limitDecimal(amount_receive, 2)} <span >USD</span>
                        </div>
                      </div>
                    </FormGroup>
                  </Col></Col>: (sellFinish === 1?
                    <Col md="12 success_dlg">
                        {formData.amount_sell} {formData.product} was successfully sold
                    </Col> :
                    <Col md="12 fail_dlg">
                        Failed balance correction
                    </Col>)
                  }
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-around">
                      {sellFinish === 0 && <li>
                        <Button color="primary" size="md" type="submit">
                            {loading ? <Spinner size="sm" color="light" /> : "Sell"}

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
                          {sellFinish === 0 ? "Cancel" : "Close"}
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
              <h5 className="title">Are you sure to sell {formData.amount_sell} {formData.product}?</h5>
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
                          Confirm
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
                          Cancel
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
              <h5 className="title" style={{overflowWrap: "anywhere"}}>Are you sure you want to withdraw {formData.amount_withdraw} {formData.product} to {formData.address_withdraw}?</h5>
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
                          Confirm
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
                          Cancel
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
                setModal({ auth: false });
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title" style={{overflowWrap: "anywhere"}}>Are you sure you want to withdraw {formData.amount_withdraw} {formData.product} to {formData.address_withdraw}?</h5>
              <div className="">
                <Form className="row gy-4" onSubmit={handleSubmit(confirmWithdraw)}>
                  <Col md="12">
                    <FormGroup>
                        <label className="form-label" htmlFor="default-01">
                          Input 2FA code
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            id="default-01"
                            name="authcode"
                            value={authCode}
                            placeholder="Enter your code"
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
                        <Button color="primary" size="md" type="button" onClick={confirmWithdraw}>
                          Confirm
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
                          
                          Cancel
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
export default MyWallet;
