import React from 'react';
import { Breadcrumb } from "antd";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
    '/state': 'Shtat',
    '/state/state-organizations': 'Tashkilotlar',
    '/state/state-organizations/:id': 'Update Organizations',
    '/state/state-departments': 'Bo\'limlar',
    '/state/state-departments/add': 'Qo\'shish',
    '/state/state-departments/:slug': 'Update Departments',
    '/state/state-user': 'Hodimlar',
    '/state/state-user/add': 'Qo\'shish',
    '/state/state-user/:id': 'Update Users',
};

const StyledBreadcrumb = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        if (breadcrumbNameMap[url] === undefined) {
            return (
                <Breadcrumb.Item key={url}>
                    <span>{pathSnippets[pathSnippets.length - 1]}</span>
                </Breadcrumb.Item>
            );
        }
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadcrumbNameMap[url]}</Link>
            </Breadcrumb.Item>
        );
    });
    // const breadcrumbItems = [
    //     <Breadcrumb.Item key="home">
    //         <Link to="/state">
    //             Home
    //         </Link>
    //     </Breadcrumb.Item>,
    // ].concat(extraBreadcrumbItems);

    return (
        <BreadcrumbWrapper>
            <Breadcrumb>{extraBreadcrumbItems}</Breadcrumb>
        </BreadcrumbWrapper>
    );
};

export default StyledBreadcrumb;

const BreadcrumbWrapper = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 1rem;
  border-radius: 4px;
  box-shadow: 0 8px 16px 1px rgb(0 0 0 / 5%);
  transition: var(--main-transition);
  cursor:pointer;
  :hover{
    box-shadow: 0 8px 16px 1px rgb(0 0 0 / 1%);
  }
  .breadcrumb-item{
    
  }
`;