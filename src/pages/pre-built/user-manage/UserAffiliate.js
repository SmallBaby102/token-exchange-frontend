import React, {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  FormGroup,
  Label,
} from 'reactstrap';

import {
  setChecking,
} from '../../../actions';
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Button,
  CodeBlock,
  Col,
  Icon,
} from '../../../components/Component';
import Head from '../../../layout/head/Head';
import { myServerApi } from '../../../utils/api';
import { useTranslation } from 'react-i18next'

const UserProfileRegularPage = ({sm, updateSm}) => {
  const { t } = useTranslation(); 
  const dispatch = useDispatch();
  const myApi = myServerApi(); 
  const email = localStorage.getItem("username"); //useSelector((state) => state.user.user.username)
  const [homepageUrl, setHomepageUrl] = useState("https://cryptowire.vip/?a_aid=")
  const [signinUrl, setSigninUrl] = useState("https://dashboard.cryptowire.vip/?a_aid=")

  useEffect(() => {
    dispatch(setChecking(true));
    myApi.get(`affiliate_id/${email}`).then(res => {
      let affiliate_id = res.data.data;
      let aid;
      if(affiliate_id !== "")
      {  
          aid = affiliate_id['homepageId'];
          setHomepageUrl(`https://cryptowire.vip/?a_aid=${aid}`);
          setSigninUrl(`https://dashboard.cryptowire.vip/?a_aid=${aid}`);
      }
      dispatch(setChecking(false));
    })
    .catch(err => {
      // toast.error("Database not found");
      console.log('error: ', err);
      dispatch(setChecking(false));
      });
  }, []);
  return (
    <React.Fragment>
      <Head title={t('my_affiliate_link')}></Head>
      <BlockHead size="lg">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle tag="h4">{t('my_affiliate_link')}</BlockTitle>
            <BlockDes>
              <p>{t('affiliate_link_desc1')}
              </p>
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
            <Col md="12">
              <FormGroup>
                <CodeBlock title = {t('homepage')}
                  children = {homepageUrl}
                  >
                  {homepageUrl}
                </CodeBlock>
              </FormGroup>
              <FormGroup>
                <CodeBlock title = {t('signinurl')}
                  children = {signinUrl}
                  >
                  {signinUrl}
                </CodeBlock>
              </FormGroup>
            </Col>
        </div>
        
      </Block>
      <Block>
          <FormGroup>
              <Label style={{color:'#526484'}}>
              {t('affiliate_link_desc2')}  <a href=" https://cryptowire.vip/affiliate-details/" target="_blank">{t('more')}</a>
              </Label>
          </FormGroup>
      </Block>
    </React.Fragment>
  );
};
export default UserProfileRegularPage;
