/* eslint-disable */
import React, {
  useEffect,
  useState,
} from 'react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';

import { useWeb3React } from '@web3-react/core';

import { updateUser } from '../../actions';
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  PreviewAltCard,
} from '../../components/Component';
import Head from '../../layout/head/Head';
import Cwallet from '../../layout/header/Cwallet';

const CompleteProfile2 = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { account } = useWeb3React();
  const [ isOpenDialog, setIsOpenDialog ] = useState(false);

  const account_id = JSON.parse(localStorage.getItem('@dashlite_main_user')).user.id;
  
  useEffect(() => {
    if (account) {
      dispatch(updateUser(account_id, { wallet: account }, history));
    }
  }, [ account ]);

  return (
    <React.Fragment>
      <Head title="Complete Profile step2"></Head>
      <div className="kyc-app wide-sm m-auto">
        <BlockHead size="lg" className="wide-xs mx-auto">
          <BlockHeadContent className="text-center">
            <BlockTitle tag="h2" className="fw-normal">
              Connection to Crypto Wire Wallet
            </BlockTitle>
            <BlockDes>
              <p>
                Final Step! Connection to Crypto Wire Wallet
              </p>
            </BlockDes>
          </BlockHeadContent>
        </BlockHead>

        <Block>
          <PreviewAltCard className="card-bordered" bodyClass="card-inner-lg">
            <div className="nk-kyc-app p-sm-2 text-center">
              <div className="nk-kyc-app-icon">
                <Icon name="files"></Icon>
              </div>
              <div className="nk-kyc-app-text mx-auto">
                <p className="lead">
                  Metamask Wallet is your boarding pass to Crypto Wire site. Click bellow for connect your Metamask.
                </p>
              </div>
              <div className="nk-kyc-app-action">
                <Button type="submit" color="primary" size="lg" className="btn-block" onClick={() => setIsOpenDialog(true)}>
                  Connect My Metamask
                </Button>
              </div>
            </div>
          </PreviewAltCard>
          <div className="text-center pt-4">
            <p>
              If you don't have Metamask, you can download &amp; setup by clicking here: 
              <a href="https://metamask.io/download/">https://metamask.io/download/</a>
            </p>
          </div>
        </Block>
      </div>
      <Cwallet isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} />
    </React.Fragment>
  );
};
export default CompleteProfile2;
