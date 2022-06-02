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
import { findUpper } from '../../../../utils/Utils';

const User = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(state => state.user.user);
  const accountIntervalId = useSelector(state => state.user.accountIntervalId);
  const quoteIntervalId = useSelector(state => state.user.quoteIntervalId);
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
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem
              link={window.location.pathname.split("/")[2] === "invest" ? "/invest/profile" : "/user-profile-regular"}
              icon="user-alt"
              onClick={toggle}
            >
              View Profile
            </LinkItem>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem
              link="/user-affiliate"
              icon="tranx-fill"
              onClick={toggle}
            >
              Affiliate
            </LinkItem>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem
              link="/security"
              icon="shield"
              onClick={toggle}
            >
              Security
            </LinkItem>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <Link to="#" onClick={() => { clearInterval(accountIntervalId); clearInterval(quoteIntervalId); dispatch(logout(history)); } }>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </Link>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
