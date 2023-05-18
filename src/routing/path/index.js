import React from "react";
import Login from "../../pages/login";
import DashboardWrapper from "../../pages/dashboard";
import DashboardNotFound from "../../pages/dashboard/components/DashboardNotFound";
import Company from "../../pages/dashboard/organ";
import AddCompany from "../../pages/dashboard/organ/add";
import Register from "../../pages/dashboard/register";
import AddRegister from "../../pages/dashboard/register/add";
import UpdateCompany from "../../pages/dashboard/organ/update";
import Sections from "../../pages/dashboard/sections";
import AddSections from "../../pages/dashboard/sections/add";
import UpdateSections from "../../pages/dashboard/sections/update";
import Positions from "../../pages/dashboard/positions";
import AddPosition from "../../pages/dashboard/positions/add";
import UpdatePosition from "../../pages/dashboard/positions/update";
import StructureView from "../../pages/dashboard/structure-view";
import Cabinet from "../../pages/cabinet";
import Staff from "../../pages/dashboard/staff";
import Orders from "../../pages/dashboard/orders";
import AddOrder from "../../pages/dashboard/orders/add";
import UpdateOrder from "../../pages/dashboard/orders/update";
import Chat from "../../pages/cabinet/chat";
import StaffAdd from "../../pages/dashboard/staff/add";
import StaffUpdate from "../../pages/dashboard/staff/update";
import StateTable from "../../pages/dashboard/state-table";
import ChatById from "../../pages/cabinet/chat/[id]";
import Employee from "../../pages/dashboard/employee";
import AddEmployee from "../../pages/dashboard/employee/add";
import IsIll from "../../pages/dashboard/staff/isIll";
import News from "../../pages/cabinet/news";
import Info from "../../pages/cabinet/info";
import Birthday from "../../pages/cabinet/birthday";
import CabinetNotFound from "../../pages/cabinet/cabinet-not-found";
import Settings from "../../pages/cabinet/settings";
import UpdateIsIll from "../../pages/dashboard/staff/isIll/update";
import ViewStaff from "../../pages/dashboard/staff/view";
import DashboardMain from "../../pages/dashboard/main";
import Appeals from "../../pages/cabinet/appeals";
import EditAppeal from "../../pages/cabinet/appeals/[type]/appeal/edit";
import DashboardAppeal from "../../pages/dashboard/appeal";
import DashboardVacations from "../../pages/dashboard/vacations";
import TimeTable from "../../pages/dashboard/state-table/time-table";
import Turnstile from "../../pages/dashboard/state-table/turnstile";
import NotFound from "../../pages/not-found";
import Identification from "../../pages/dashboard/identification";
import AddIdentification from "../../pages/dashboard/identification/add";
import Approved from "../../pages/cabinet/approved";
import Survey from "../../pages/survey";
import Surveys from "../../pages/dashboard/surveys";
import SurveyByKey from "../../pages/survey/[key]";
import DashboardSurveyByKey from "../../pages/dashboard/surveys/[key]";
import UserSurveyPage from "../../pages/cabinet/info/survey";
import SurveyAppeal from "../../pages/survey/[id]/appeal";
import CabinetAppeal from "../../pages/cabinet/appeals/[type]/appeal";
import Report from "../../pages/dashboard/report";
import MfId from "../../pages/login/mf-id";
import Vacations from "../../pages/cabinet/vacations";
import IqTest from "../../pages/dashboard/iq-test";
import ViewIqTest from "../../pages/dashboard/iq-test/view";
import TestId from "../../pages/dashboard/iq-test/answer/[testId]";
import OrderView from "../../pages/dashboard/orders/view";
import AppealView from "../../pages/dashboard/appeal/view";
import CreateOrderByAppeal from "../../pages/dashboard/orders/create-order-by-appeal";
import CabinetAppealView from "../../pages/cabinet/appeals/view";
import DashboardDismissSheet from "../../pages/dashboard/dismiss-sheet";
import DashboardDismissSheetByAppealId from "../../pages/dashboard/dismiss-sheet/[appealId]";
import DismissSheetUpdate from "../../pages/dashboard/dismiss-sheet/update";
import CabinetNoticeAdd from "../../pages/cabinet/notice/add";
import CabinetNoticeUpdate from "../../pages/cabinet/notice/update";
import Content from "../../pages/cabinet/component/Content";
import CreateUserByOrder from "../../pages/dashboard/staff/create-user-by-order";
import SalaryList from "../../pages/dashboard/salary";
import AddSalary from "../../pages/dashboard/salary/add";
import UpdateSalary from "../../pages/dashboard/salary/update";
import OrderOpenUrl from "../../pages/order";
import UpdateQuestion from "../../pages/dashboard/iq-test/update";
import CabinetIQTest from "../../pages/cabinet/iq-test";
import CabinetTestId from "../../pages/cabinet/iq-test/[testId]";
import CabinetNoticeView from "../../pages/cabinet/notice/view";

// StaffList
import MainPage from "./../../pages/state/main-page/MainPage";
import State from "./../../pages/state";
import StateDepartment from "../../pages/state/state-department";
import StateUser from "../../pages/state/state-user";
import StaffListUsers from "../../pages/state/users/users";
import StateOrganizations from "../../pages/state/state-organization";
import UpdateStateOrganization from "../../pages/state/state-organization/update/UpdateStateOrganization";
import UpdateStateDepartment from "./../../pages/state/state-department/update/UpdateStateDepartment";
import OrgStaffList from "../../pages/state/orgStaffList";
import OrgStaffs from "../../pages/state/orgStaffList/OrgStaffs";
import StaffUserSettings from "../../pages/state/userSettings/UserSettings";
// StaffList end

import DashboardNotice from "../../pages/dashboard/notice";
import DashboardNoticeView from "../../pages/dashboard/notice/view";
import Certificate from "../../pages/certificate";
import DashboardStaffCheck from "../../pages/dashboard/staff/check";
import ShtatDepartments from "../../pages/dashboard/shtat-departments";
import DashboardDayOff from "../../pages/dashboard/settings/day-off";
import DashboardRoleControl from "../../pages/dashboard/settings/role-control";
import OpenUrlNotice from "../../pages/notice";
import NewChat from "../../pages/cabinet/new-chat";
import UserCard, {UserCardImage} from "../../pages/visit-card";
import DashboardAllTable from "../../pages/dashboard/state-table/all-table";
import OpenStateTable, {OpenTimeTable} from "../../pages/state-table";
import DashboardStaffReserve from "../../pages/dashboard/staff/reserve";
import DashboardChildOrgans from "../../pages/dashboard/child-organs";
import DashboardChildOrganAdd from "../../pages/dashboard/child-organs/add";
import DashboardBusinessTripPlan from "../../pages/dashboard/businsess-trip-plan/inxed";
import DashboardBusinessTripPlanView from "../../pages/dashboard/businsess-trip-plan/view";
import DashboardBusinessTripPlanAdd from "../../pages/dashboard/businsess-trip-plan/add";
import DashboardOrderTypes from "../../pages/dashboard/order-types";
import DashboardAddOrderTypes from "../../pages/dashboard/order-types/add";

export default [
  {
    path: '/',
    index: true,
    element: <Login/>,
  },
  {
    path: '/login',
    index: true,
    element: <Login />,
  },
  {
    path: '/confirmed-table',
    element: <OpenStateTable />,
  },
  {
    path: '/order/:orderCode',
    index: true,
    element: <OrderOpenUrl />,
  },
  {
    path: '/visit-card',
    element: <UserCard />,
    children: [{
      path: ':userId/:orgTin',
      element: <UserCardImage/>
    }]
  },
  {
    path: '/certificate/:id',
    index: true,
    element: <Certificate/>
  },
  {
    path: '/mf-id',
    index: true,
    element: <MfId/>,
  },
  {
    path: '/survey',
    element: <Survey />,
    children: [
      {
        path: ':key',
        index: true,
        element: <SurveyByKey />
      },
      {
        path: 'appeal',
        children: [
          {
            path: ':id',
            element: <SurveyAppeal />,
          }
        ]
      }
    ]
  },
  {
    path: `dashboard`,
    index: false,
    element: <DashboardWrapper />,
    children: [
      {
        path: 'main',
        element: <DashboardMain />,
      },
      {
        path: 'appeal',
        element: <DashboardAppeal />,
        children: [{
          path: 'view/:id',
          element: <AppealView/>
        }]
      },
      {
        path: 'vacations',
        element: <DashboardVacations />,
      },
      {
        element: <Company />,
        path: 'organ',
        children: [
          {
            element: <AddCompany />,
            path: 'add',
          }, {
            element: <UpdateCompany />,
            path: ':id',
          },
        ]
      },
      {
        element: <Register />,
        path: 'register',
        children: [
          {
            element: <AddRegister />,
            path: 'add',
          },
        ]
      },
      {
        element: <Employee />,
        path: 'employee',
        children: [
          {
            element: <AddEmployee />,
            path: 'add',
          },
        ]
      },
      {
        element: <Sections />,
        path: 'sections',
        children: [
          {
            element: <AddSections />,
            path: 'add',
          }, {
            element: <UpdateSections />,
            path: ':id',
          },
        ]
      },
      {
        path: 'child-organs',
        element: <DashboardChildOrgans/>,
        children: [
          {
            path: 'add',
            element: <DashboardChildOrganAdd/>
          },
          {
            path: ':id',
            element: <DashboardChildOrganAdd/>
          }
        ]
      },
      {
        element: <Positions />,
        path: 'positions',
        children: [
          {
            element: <AddPosition />,
            path: 'add',
          }, {
            element: <UpdatePosition />,
            path: ':id',
          },
        ]
      },
      {
        element: <Orders />,
        path: 'orders',
        children: [
          {
            element: <AddOrder />,
            path: 'add',
            children: [
              {
                path: ':appealId',
                element: <AddOrder/>
              }
            ]
          }, {
            element: <OrderView/>,
            path: 'view/:id',
          }, {
            element: <CreateOrderByAppeal/>,
            path: 'create-order-by-appeal/:id',
          }, {
            element: <UpdateOrder />,
            path: ':id',
          },
        ]
      },
      {
        element: <StructureView />,
        path: 'structure-view',
      },
      {
        element: <Report />,
        path: 'report',
      },
      {
        path: 'time-table',
        element: <TimeTable />
      },
      {
        path: 'turnstile',
        element: <Turnstile />
      },
      {
        element: <Staff />,
        path: 'staff',
        children: [
          {
            path:'check',
            element: <DashboardStaffCheck/>
          },
          {
            path:'reserve',
            element: <DashboardStaffReserve/>
          },
          {
            path: 'add',
            element: <StaffAdd />
          }, {
            path: ':id',
            element: <StaffUpdate />
          }, {
            path: 'is-ill/:userId',
            element: <IsIll />
          }, {
            path: 'is-ill/update/:id',
            element: <UpdateIsIll />
          }, {
            path: 'view/:id',
            element: <ViewStaff />
          }, {
            path: 'create-user-by-order/:applicationId/:surveyId',
            element: <CreateUserByOrder/>
          }
        ]
      },
      {
        path: 'state-table',
        element: <StateTable />
      },
      {
        path: 'all-table',
        element: <DashboardAllTable/>
      },
      {
        path: 'dey-off',
        element: <DashboardDayOff/>
      },
      {
        path: 'order-types',
        element: <DashboardOrderTypes/>,
        children: [{
          path: 'add',
          element: <DashboardAddOrderTypes/>,
        },{
          path: 'add/:id',
          element: <DashboardAddOrderTypes/>,
        }]
      },
      {
        path: 'role-control',
        element: <DashboardRoleControl/>
      },
      {
        path: 'identification',
        element: <Identification />,
        children: [{
          element: <AddIdentification />,
          path: 'add',
        }]
      },
      {
        path: 'business-trip-plan',
        element: <DashboardBusinessTripPlan/>,
        children: [{
          path: 'view/:id',
          element: <DashboardBusinessTripPlanView/>
        },{
          path: 'add',
          element: <DashboardBusinessTripPlanAdd/>
        },{
          path: 'add/:id',
          element: <DashboardBusinessTripPlanAdd/>
        }]
      },
      {
        path: 'surveys',
        element: <Surveys />,
        children: [{
          path: ':key',
          element: <DashboardSurveyByKey />
        }]
      },
      {
        path: 'dismiss-sheet',
        element: <DashboardDismissSheet/>,
        children: [{
          path: ':appealId',
          element: <DashboardDismissSheetByAppealId />
        },{
          path: 'update/:id',
          element: <DismissSheetUpdate/>
        }]
      },
      {
        path: 'iq-test',
        element: <IqTest/>,
        children: [
          {
            path: 'view/:id',
            element: <ViewIqTest/>
          },
          {
            path: 'answer/:testId',
            element: <TestId/>
          },
          {
            path: ':id',
            element: <UpdateQuestion/>
          }
        ]
      },
      {
        path: 'salary',
        element: <SalaryList/>,
        children: [
          {
            path: 'add',
            element: <AddSalary/>,
          },
          {
            path: ':id',
            element: <UpdateSalary/>,
          }
        ]
      },
      {
        path: 'shtat-departments',
        element: <ShtatDepartments/>,
        children: []
      },
      {
        path: 'notice',
        element: <DashboardNotice/>,
        children: [
          {
            path: 'view/:id',
            element: <DashboardNoticeView/>
          }
        ]
      },
      {
        path: '*',
        element: <DashboardNotFound />
      }
    ]
  },
  {
    path: 'cabinet',
    element: <Cabinet />,
    children: [
        {
          path: 'chat',
          element: <NewChat/>,
          children: [{
            path: ':chatId',
            element: <NewChat/>
          }]
        },
        {
        path: 'new-chat',
        element: <Chat />,
        children: [{
          path: ':id',
          element: <ChatById />
      }]
    }, {
        path: 'iq-test',
        element: <CabinetIQTest/>,
        children: [
          {
            path: ':testId',
            element: <CabinetTestId/>
          }
        ]
      },{
      path: 'approved',
      element: <Approved />,
      children: [
      {
        path:':tab',
        element: <Approved/>,
      }]
    }, {
      path: 'news',
      element: <News />
    }, {
      path: 'notice',
      children: [{
        path: 'add',
        element: <CabinetNoticeAdd/>
      },{
        path: 'update/:id',
        element: <CabinetNoticeUpdate/>
      },{
        path: 'view/:id',
        element: <CabinetNoticeView/>
      }]
    }, {
      path: 'info',
      element: <Info />,
      children: [
        {
          path: 'survey',
          element: <UserSurveyPage />,
          children: [
            {
              path: ':id'
            }
          ]
        },
        {
          path: ':infoKey',
          element: <Content/>
        }
      ]
    }, {
      path: 'birthday',
      element: <Birthday />
    }, {
      path: 'settings',
      element: <Settings />
    },
    {
      path: 'vacations',
      element: <Vacations />,
    },
    {
      path: 'appeals',
      element: <Appeals />,
    },
    {
      path: 'edit-appeal/:id',
      element: <EditAppeal />,
    },
    {
      path: 'appeal-view/:id',
      element: <CabinetAppealView/>
    },
    {
      path: ':type',
      element: <CabinetAppeal />,
    },
    {
      path: '*',
      element: <CabinetNotFound />
    }]
  },
  {
    path: 'state',
    element: <State />,
    children: [
      {
        path: 'main',
        element: <MainPage />,
      },
      {
        path: 'settings',
        element: <StaffUserSettings />,
      },
      {
        path: 'state-departments',
        element: <StateDepartment />,
        children: [
          {
            element: <UpdateStateDepartment />,
            path: 'add',
          }, {
            element: <UpdateStateDepartment />,
            path: ':id',
          },
        ]
      },
      {
        path: 'state-user',
        element: <StateUser />,
      },
      {
        path: 'orgStaffList',
        element: <OrgStaffList />,
        children: [
          {
            path: ':id',
            element: <OrgStaffs />,
          },
        ]
      },
      {
        path: 'users',
        element: <StaffListUsers />,
      },
      {
        path: 'state-organizations',
        element: <StateOrganizations />,
        children: [{
          path: ':id',
          element: <UpdateStateOrganization />
        }]
      },
    ]
  },
  {
    path: 'notice/:id',
    element: <OpenUrlNotice/>
  },
  {
    path: "*",
    element: <NotFound message="Bu sahifa mavjud emas yoki avalroq o'chirib yuborilgan!" />
  }
]