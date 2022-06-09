import React, { useState } from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  useHistory,
} from 'react-router-dom';
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import { logout } from '../../../../actions';
import { Icon } from '../../../../components/Component';
import {
  LinkItem,
  LinkList,
} from '../../../../components/links/Links';
import UserAvatar from '../../../../components/user/UserAvatar';
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { toast } from 'react-toastify';

const MobileUser = () => {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const toggleProfile = () => setOpenProfile((prevState) => !prevState);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(state => state.user.user);
  const accountIntervalId = useSelector(state => state.user.accountIntervalId);
  const quoteIntervalId = useSelector(state => state.user.quoteIntervalId);
  const prrofileProgressState = useSelector(state => state.user.prrofileProgressState);
  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
        </div>
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter ">
          <div className="user-card">
            <div className="user-info">
              {/* <span className="lead-text">{currentUser?.firstname + currentUser?.lastname}</span> */}
              <span className="word-wrap" style={{overflowWrap: "anywhere"}}>{currentUser?.username}</span>
            </div>
          </div>
        </div>
        <Navigation
            // you can use your own router's api to get pathname
            activeItemId={history.location.pathname}
            onSelect={({ itemId }) => {
              console.log("itemid", itemId)
              if (itemId == "/signout")
               {
                clearInterval(accountIntervalId); 
                clearInterval(quoteIntervalId); 
                dispatch(logout(history)); 
               }
               else {
                 if (itemId === "/user-profile-verification" && prrofileProgressState === false){
                  toast.warn("Please input all details of profile.");
                  history.push("/user-profile-regular");
                  return;
                 }
                  if (itemId !== "/profile" && itemId !== "/affiliate" && itemId !== "/securityitem")
                  {
                    toggle();
                    history.push(itemId);
                  }
               }
            }}
            items={[
              {
                title: 'View Profile',
                itemId: '/profile',
                // you can use your own custom Icon component as well
                // icon is optional
                elemBefore: () => <Icon name="user-alt" />,
                subNav: [
                  {
                    title: 'Personal Information',
                    itemId: '/user-profile-regular',
                    elemBefore: () => <Icon name="user-fill-c" />,
                  },
                  {
                    title: 'Profile Verification',
                    itemId: '/user-profile-verification',
                    elemBefore: () => <Icon name="shield" />,

                  },
                ],
              },
              {
                title: 'Affiliate',
                itemId: '/affiliate',
                elemBefore: () => <Icon name="tranx-fill" />,
                subNav: [
                  {
                    title: 'My Affiliate Link',
                    itemId: '/user-affiliate',
                    elemBefore: () => <Icon name="link" />,
                  },
                  {
                    title: 'My user',
                    itemId: '/user-myuser',
                    elemBefore: () => <Icon name="users" />,
                  },
                  {
                    title: 'Commission Report',
                    itemId: '/user-commission-report',
                    elemBefore: () => <Icon name="reports" />,
                  },
                ],
              },
              {
                title: 'Security',
                itemId: '/securityitem',
                elemBefore: () => <Icon name="shield" />,
                subNav: [
                  {
                    title: '2-Factor Authentication',
                    itemId: '/security',
                    elemBefore: () => <Icon name="shield" />,
                  },
                 
                ],
              },
             
              {
                title: 'Sign Out',
                itemId: '/signout',
                elemBefore: () => <Icon name="signout" />,
              },
             
            ]}
          />
      </DropdownMenu>
    </Dropdown>
  );
};

export default MobileUser;
