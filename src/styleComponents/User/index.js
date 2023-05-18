import Style from "styled-components";
import { Divider, Dropdown } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { UserOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";

import { USER_LOGOUT, STAFFLIST_USER_LOGOUT } from "../../store/types";
import { Link } from "react-router-dom";

const UserWrapper = Style.div`
    padding: .3rem 1rem;
    display: flex;
    align-items:center;
    cursor: pointer;
`
const UserAvatar = Style.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items:center;
    justify-content:center;  
    background-color: #322A93FF;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin-left: auto;
`
const DropdownMenu = Style.div`
    width: 100%;
    background: #fff;
`
const Button = Style.button`
    border: none;
    display: block;
    width: 100%;
    padding: .5rem 1rem;
    background-color: #fff;
    cursor: pointer;
    &:hover{
        background-color: #f2f2f2;
    }
`
function DropdownItems({ logOut, isStaffList }) {
  return <DropdownMenu>
    {isStaffList ?
      <Link to='/state/settings/'>
        <p className="m-0 py-2 px-3">
          Sozlamalar
        </p>
      </Link>
      :
      <p className="m-0 py-2 px-3">
        Sozlamalar
      </p>
    }

    <Divider className="my-0" />
    <div>
      <Button onClick={logOut}>
        <LogoutOutlined /> Chiqish
      </Button>
    </div>
  </DropdownMenu>
}

function User({ user = null }) {
  const dispatch = useDispatch();
  const isStaffList = localStorage.getItem('isStaffList');

  const logOut = () => {
    if (isStaffList) {
      dispatch({
        type: STAFFLIST_USER_LOGOUT
      })
      return;
    }
    dispatch({
      type: USER_LOGOUT
    })
  }
  return user && Object.keys(user).length ?
    <Dropdown overlay={<DropdownItems logOut={logOut} isStaffList={isStaffList} />}>
      <UserWrapper>
        <UserAvatar>
          {
            user?.username ?
              user?.username?.substr(0, 1).toUpperCase() : <UserOutlined />
          }
        </UserAvatar>
      </UserWrapper>
    </Dropdown>
    : ""
}
export default User;