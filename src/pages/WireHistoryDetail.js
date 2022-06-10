import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getAuthenticatedApi, myServerApi } from '../utils/api';
import { setChecking } from '../actions';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { bgcolor, Box } from '@mui/system';
import { Col, Row } from 'reactstrap';
import Content from '../layout/content/Content';
import { fromStringTodateFormatter, fromStringTodatetimeFormatter } from '../utils/Utils';

export default function CustomizedTimeline() {
  const { wireid } =  useParams();
  const dispatch = useDispatch();
  const email = localStorage.getItem("username");
  const [wireHistory, setWireHistory] = useState(null)
  const [mobileView, setMobileView] = useState(false);
  useEffect(async () => {
    dispatch(setChecking(true));
      // get report data from local db
      const myApi = myServerApi();
      myApi.get(`/wirehistory/${wireid}/${email}`).then(res => {
        dispatch(setChecking(false));
        if (res) {
          let wirehistory = res.data.data;
          setWireHistory(wirehistory)
        }
      }).catch(err => {
      dispatch(setChecking(false));
      console.log('error: ', err);
      });
}, []);
const viewChange = () => {
  if (window.innerWidth < 992) {
    setMobileView(true);
  } else {
    setMobileView(false);
  }
};
window.addEventListener("load", viewChange);
window.addEventListener("resize", viewChange);
let color = {color: "#1976d2"};
return (
    <Content >
      <Box className="mt-4 pl-5 pt-2 pr-5">
        { wireHistory && <Row>
            <Col md="5" className='pl-4' style={{overflowWrap: "anywhere"}}>
              <Row className="">
                <Col size={6}>
                  <span className="h6">Wire ID</span>
                </Col>
                <Col size={6}>
                  <span className="h6">{wireHistory.wireid}</span>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col size={6}>
                  <span className="h6 fw-light">BENEFICIARY NAME</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.beneficiary_name}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">ACCOUNT TYPE</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.account_type}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">BENEFICIARY ADDRESS</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.beneficiary_street}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">BENEFICIARY POSTAL CODE</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.beneficiary_postal_code}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">BANK NAME</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.bank_name}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">BANK ACCOUNT NUMBER</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.bankaccount_number}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">BANK COUNTRY</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.bank_country}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">BANK ADDRESS</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.bankstreet_address}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">BANK POSTAL CODE</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.bankpostal_code}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">SWIFT/BIC CODE</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.swift_code}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">REFERENCE CODE</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.reference_code}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">INTERMEDIARY BANK NAME</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.intermediarybank_name}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">INTERMEDIARY BANK ACCNO</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.intermediarybank_number}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">INTERMEDIARY BANK COUNTRY</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.intermediarybank_swiftcode}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">INTERMEDIARY BANK ADDRESS</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.intermediarybank_address}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">INTERMEDIARY BANK SWIFT</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{wireHistory.intermediarybank_swiftcode}</span>
                </Col>
              </Row>
              <Row className="">
                <Col size={6}>
                  <span className="h6 fw-light">AMOUNT</span>
                </Col>
                <Col size={6}>
                  <span className="h6 fw-light">{-wireHistory.amount}USD</span>
                </Col>
              </Row>
            </Col>
            <Col md="7" className='mt-2' style={{marginLeft: "-30px"}}>
            {
            wireHistory &&
              <Timeline >
              <TimelineItem>
                <TimelineOppositeContent
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  {fromStringTodatetimeFormatter(wireHistory.pending_date, true)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color='primary'/>
                  <TimelineConnector sx={{ bgcolor: 'primary.main' }}/>
                </TimelineSeparator>
                <TimelineContent sx={{ my: '-12px', px: 2 }}>
                {wireHistory.status === "0" ? <Typography variant="h6" component="span" style={color}>
                    Pending
                  </Typography>:
                  <Typography variant="h6" component="span">
                  Pending
                </Typography>}
                  {wireHistory.status === "0" ? <Typography style={color}> You set up your transfer</Typography>:
                  <Typography > You set up your transfer</Typography>}
                </TimelineContent>
              </TimelineItem>
              { wireHistory.status !== "0" && wireHistory.approved_date !== "Null" &&
                <TimelineItem>
                {wireHistory.status === "1" ? <TimelineOppositeContent
                  sx={{ m: 'auto 0' }}
                  color="text.primary"
                >
                  {fromStringTodatetimeFormatter(wireHistory.approved_date, true)}
                </TimelineOppositeContent>:
                <TimelineOppositeContent
                    sx={{ m: 'auto 0' }}
                    variant="body2"
                    color="text.secondary"
                >
                  {fromStringTodatetimeFormatter(wireHistory.approved_date, true)}
                </TimelineOppositeContent>
                }
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: 'primary.main' }}/>
                  <TimelineDot color="primary">
                  </TimelineDot>
                  {wireHistory.status !== "1" && <TimelineConnector sx={{ bgcolor: 'primary.main' }}/> }
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                {wireHistory.status === "1" ? <Typography variant="h6" component="span" style={color}>
                    Approved
                  </Typography>:<Typography variant="h6" component="span">
                    Approved
                  </Typography>}
                  {wireHistory.status === "1" ? <Typography style={color}>Your transfer was approved</Typography>:
                  <Typography>Your transfer was approved</Typography>}
                </TimelineContent>
              </TimelineItem>
              }
              { (wireHistory.status !== "0" &&  wireHistory.status !== "1" && wireHistory.processing_date !== "Null") &&
                (wireHistory.status == "2" ?
                <TimelineItem>
                  <TimelineOppositeContent
                    color="text.primary"
                    sx={{ m: 'auto 0', mt: "34px" }}
                  >
                    {fromStringTodatetimeFormatter(wireHistory.processing_date, true)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector sx={{ bgcolor: 'primary.main' }}/>
                    <TimelineDot color="info"  >
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent sx={{  px: 2 }}>
                    <Typography variant="h6" component="span" sx={{ color: 'primary.main' }}>
                      Processing
                    </Typography>
                    <Typography sx={{ color: 'primary.main' }}>Our bank is processing your transfer</Typography>
                  </TimelineContent>
                </TimelineItem>:
                <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0' }}
                  variant="body2"
                  color="text.secondary"
                >
                  {fromStringTodatetimeFormatter(wireHistory.processing_date, true)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: 'primary.main' }}/>
                  <TimelineDot color="info">
                    {/* <HotelIcon /> */}
                  </TimelineDot>
                  <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Processing
                  </Typography>
                  <Typography>Our bank is processing your transfer</Typography>
                </TimelineContent>
              </TimelineItem>)
              }
              {
                wireHistory.status === "3" && wireHistory.completed_date !== "Null" &&
              <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0'}}
                  color="text.primary"
                  variant="body2"

                >
                  {fromStringTodatetimeFormatter(wireHistory.completed_date, true)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: 'primary.main' }}/>
                  <TimelineDot color="info" >
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span"  sx={{ color: 'primary.main' }}>
                    Complete
                  </Typography>
                  <Typography  sx={{ color: 'primary.main' }}>Your transfer went out of our bank</Typography>
                </TimelineContent>
              </TimelineItem>
              }
              {
                wireHistory.status === "9" &&
              <TimelineItem>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0', mt: "34px" }}
                  variant="body2"
                  color="red"
                >
                  {fromStringTodatetimeFormatter(wireHistory.decline_date, true)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                  <TimelineDot color="warning">
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent >
                  <Typography variant="h6" component="span" style={{color:"red"}}>
                    Decline
                  </Typography>
                  <Typography style={{color:"red"}}>Your transaction was declined</Typography>
                </TimelineContent>
              </TimelineItem>
              }
               <div style={mobileView === false ? {transform: "translate(calc(50% - 140px))"} : {transform: "translate(calc(50% - 75px))"}}>
                    <div className='mt-4' style={mobileView === true ? {fontSize: "1.1rem", wordBreak: "break-all", color: "orange", width:"112%"}:{fontSize: "1.1rem", wordBreak: "break-all", color: "orange", width:"72%"}}>
                      {wireHistory.memo}
                  </div>
                </div>
              </Timeline>
            }
              
          </Col>
          </Row>}
      </Box>
    </Content>
  );
}
