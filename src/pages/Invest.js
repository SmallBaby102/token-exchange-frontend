import React, { useState, useEffect } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
//mui library
import { Button, PreviewAltCard } from "../components/Component";
import { Stack, Typography } from '@mui/material';

import ImportContactsRoundedIcon from '@mui/icons-material/ImportContactsRounded';
//web3
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Config from "../config/app";

const InvestHomePage = () => {
  const { account, library } = useWeb3React();
  const [BNBVal, setBNBVal] = useState(0);
  const [HCAVal, setHCAVal] = useState(0);
  const [NFTVal, setNFTVal] = useState(0);
  const [NFTData, setNFTData] = useState(null);

  const send = async () => {
    if (account) {
      //send HCA
      const web3 = new Web3(library.provider);
      const HCAContract = new web3.eth.Contract(Config.HCA.abi, Config.HCA.address);
      const value = 0.20 * 10 ** 9;
      await HCAContract.methods.transfer(Config.WalletAddress, value).send({ from: account });
    } else {
      alert("Please connect your wallet.");
    }
  }

  useEffect(() => {
    const updateData = async () => {
      if (account) {
        //BNB value
        const web3 = new Web3(library.provider);
        const balance = await web3.eth.getBalance(account);
        setBNBVal(web3.utils.fromWei(balance));

        //HCA value
        const HCAContract = new web3.eth.Contract(Config.HCA.abi, Config.HCA.address);
        const HCABal = await HCAContract.methods.balanceOf(account).call();
        setHCAVal(HCABal / (10 ** 9));

        //NFT value
        const NFTContract = new web3.eth.Contract(Config.NFT.abi, Config.NFT.address);
        const NFTBal = await NFTContract.methods.balanceOf(account).call();
        setNFTVal(NFTBal);

        //NFT data
        const tokens = await NFTContract.methods.tokensOfOwner(account).call();
        let tokenData = [];
        for (let i=0; i<tokens.length; i++) {
          let tData = await NFTContract.methods.tokenURI(tokens[i]).call();
          tokenData.push(tData);
        }

        let nftData = [];
        for (let i=0; i<tokenData.length; i++) {
          let res = await fetch(tokenData[i]);
          let json = await res.json();
          nftData.push(json);
        }
        setNFTData(nftData);
      } else {
        setBNBVal(0);
        setHCAVal(0);
        setNFTVal(0);
      }
    }

    updateData();
  }, [ account, library ]);

  return (
    <React.Fragment>
      <Head title="Leaderbard Old" />
      <Content>
        <Stack p={5} style={{ justifyContent: "center", alignItems: 'center' }}>
          <Typography variant="h3">YOUR INFOS:</Typography>
          <Typography variant="h7" pb={5}>{ account ? account : 'BNB WALLET HERE' }</Typography>
          <PreviewAltCard className="w-75">
            <Stack style={{ width: "100%" }} spacing={4} alignItems="center" justifyContent="center" py={5}>
              <ImportContactsRoundedIcon style={{ fontSize: "50px" }}></ImportContactsRoundedIcon>
              <Typography variant="h6">HCA Balance = {HCAVal} </Typography>
              <Typography variant="h6">BNB Balance = {BNBVal} </Typography>
              <Typography variant="h6">NFT Balance = {NFTVal} </Typography>
              <Button variant="contained" color="primary" onClick={() => send()}>Send</Button>
              {
                NFTData?.length && NFTData.map((ele, index) => {
                  return (
                    <div className="row w-100" key={index}>
                      <div className="col-6  justify-content-center align-items-center d-flex">
                        <img src={ele.image} width="60%" alt="NFT" />
                      </div>
                      <div className="col-6 justify-content-center align-items-center d-flex">
                        <Typography variant="h6"> {ele.name}</Typography>
                      </div>
                    </div>
                  )
                })
              }
            </Stack>
          </PreviewAltCard>
        </Stack>
      </Content>
    </React.Fragment>
  );
};

export default InvestHomePage;
