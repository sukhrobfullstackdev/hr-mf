// READ ME ! =========================
// Add spaces at the end of get all methods

//User types
export const GET_USER_DATE = 'get user/allusersinfo/';
export const USER_IMAGE_UPLOAD = 'post user/employee-image-upload/';
export const AUTH = 'post user/login/';
export const LOGIN_ONE_ID = 'post user/id_egov_uz/one_id_login/';
export const AUTH_ERI = 'post user/eimzo/';
export const USER_ME = 'get user/user_me/';
export const GET_USERS = 'get user/register/ register';
export const ADD_USERS = 'post user/register/';
export const REMOVE_USERS = 'delete users/';
export const GET_ROLES = 'get user/role/ roles';
export const GET_USER_JOBS = 'get electron/jobposition/';
export const GET_USER_JOB_HISTORY = 'get electron/jobpositionhistory/';
export const USER_LOGOUT = 'post user/logout/';
export const GET_BIRTHDAYS = 'get user/birthdays/'
export const GET_USER_CALENDAR = 'get v1/calendar/staff_attendance_info/ calendarData'
export const GET_USER_CALENDAR_VIEW = 'get v1/calendar/get_event_logs/ calendarViews'
export const GET_USER_WEATHER = 'get user/weather/'
// Organisation
export const GET_ORGAN = 'get organ/ organs';
export const GET_ORGAN_FREE = 'get organs/';
export const REMOVE_ORGAN = 'delete organ/';
export const ADD_ORGAN = 'post organ/';
export const UPDATE_ORGAN = 'put organ/';
export const GET_ONE_ORGAN = 'get organ/ organ';
export const SELECT_ORGANISATION = 'post send_current_organization/'
export const GET_ORGAN_CHILDREN = 'get organichilds/ childOrgans';
export const GET_ONE_ORGAN_CHILDREN = 'get organichilds/';
export const ADD_ORGAN_CHILDREN = 'post organichilds/';
export const UPDATE_ORGAN_CHILDREN = 'put organichilds/';
export const REMOVE_ORGAN_CHILDREN = 'delete organichilds/';

// Structure
export const GET_SECTION = 'get newstruct/ sections';
export const REMOVE_SECTION = 'delete newstruct/';
export const ADD_SECTION = 'post department/';
export const UPDATE_SECTION = 'put department/';
export const GET_ONE_SECTION = 'get department/ section';

// Business Trips
export const GET_BUSINESS_TRIP_PLAN = 'get v1/business_trip/work_plan/ businessPlan'
export const GET_BUSINESS_TRIP_PLAN_BY_ID = 'get v1/business_trip/work_plan/'
export const ADD_BUSINESS_TRIP_PLAN = 'post v1/business_trip/work_plan/';

// Positions
export const GET_POSITIONS = 'get position/ positions';
export const REMOVE_POSITIONS = 'delete position/';
export const ADD_POSITIONS = 'post position/';
export const UPDATE_POSITIONS = 'put position/';
export const GET_ONE_POSITIONS = 'get position/ position';
export const GET_POSITIONS_BY_DEPARTMENT = 'get departmentposition/'

//Structure
export const GET_STRUCTURE = 'get companypositions/ structure'; //'get companymembers/ structure';
// Regions
export const GET_REGIONS = 'get v1/region/ regions';
export const GET_DISTRICT = 'get v1/region/'; //'get v1/district/ district';
export const GET_COMPANY_TYPES = 'get organizationtype/ organisationType';
export const GET_DEPARTMENT_TYPES = 'get department-type/ departmentType';
export const GET_DEPARTMENT = 'get department/ ';
export const GET_CLASSIFICATOR = 'get classificator/ ';

//Staff
export const GET_STAFF = 'get user/usersemployee/ staffs';
export const GET_STAFF_IS_ARCHIVE = 'get user/userrelease/ staffs';
export const GET_ONE_STAFF = 'get user/usersemployee/';
export const ADD_STAFF = 'post user/usersemployee/';
export const UPDATE_STAFF = 'put user/usersemployee/';
export const GET_STAFF_LIST_BT_CHOICE = 'get v1/calendar/staff/list/'
export const GET_STAFF_LIST_BT_ID = 'get v1/calendar/staff/'
export const GET_VACATION_STAFF = 'get v1/calendar/vacation/staff/ vacationStaff'
export const GET_VACATION_TYPES = 'get v1/calendar/vacation/staff/current_statistics_by_type/'
export const POST_VACATION_STAFF = 'post v1/calendar/vacation/staff/'
export const PUT_VACATION_STAFF = 'put v1/calendar/vacation/staff/'
export const GET_USER_FAMILY_INFO = 'get electron/siblings/';
export const GET_USER_FAMILY_CHILD_INFO = 'post electron/siblings/childs/';
export const CHECK_STAFF_NOROCLOGIE = 'post electron/employee_info/get_narcology/'
export const CHECK_STAFF_PSYCHOLOGY = 'post electron/employee_info/get_psychology/'
export const CHECK_STAFF_CONVICTION = 'post electron/employee_info/get_conviction/'
export const CHECK_STAFF_DEATH = 'post electron/employee_info/get_death/'
export const CHECK_STAFF_DIVORCED = 'post electron/employee_info/get_divorced/';
export const CHECK_STAFF_MARRIAGE = 'post electron/employee_info/marriage_user/';
export const GET_DATE_NEW_STAFF = 'post electron/employee_info/get_passport_data/';
export const GET_STAFF_BY_DEPARTMENT = 'get v1/settings/head_department/own_staffs/';
export const GET_CALENDAR_BY_STAFF = 'get v1/calendar/head_department_staff_attendance/ calendarData';
export const APPROVED_CALENDAR_BT_HEAD = 'put v1/tourniquet/staff/comment/';
export const ADD_COMMENT_ON_TIME_TABLE = 'post v1/tourniquet/staff/comment/';
export const GET_RESERVE_TO_HEMIS = 'get v1/integration/hemis/';

//Admin employee
export const GET_EMPLOYEE_FOR_ADMIN  = 'get user/adminusers/ adminusers';
export const ADD_EMPLOYEE_FOR_ADMIN  = 'post user/adminusers/';

//Statistic
export const GET_TOTAL_COUNTS = 'get total-counts-by-tin/';

//Table
export const GET_DAY_OFF = 'get v1/calendar/vacation/list/';
export const GET_TABLE_STATISTIC = 'get v1/calendar/statistics/';
export const GET_TABLE_USER_LIST = 'get v1/calendar/ tableUserList';
export const TABLE_SET_STATUS = 'post v1/calendar/';
export const GET_DAY_OFF_MONTH = 'get v1/calendar/extra_vacations/'
export const SET_DAY_OFF = 'post v1/calendar/add_extra_vacation/'

//Chats
export const GET_ALL_CHATS = 'get chat/create_chat/';
export const GET_CHAT_BY_ID = 'get chat/chat_detail/ chatList'
export const CHAT_CREATE = 'post chat/create_chat/';

//Commands
export const GET_COMMANDS = 'get v1/command/ orders';
export const GET_ORDER_BY_CODE = 'get v1/confirmed-command/';
export const GET_COMMANDS_TYPES = 'get v1/command-type/ commandType';
export const GET_ONE_COMMANDS = 'get v1/command/';
export const GET_COMMAND_APPROVERS = 'get v1/org-approvers/';
export const GET_COMMAND_BY_USER = 'get v1/approvals/';
export const GET_COMMAND_PDF_BY_ID = 'get v1/tabel/command-pdf/';
export const ADD_COMMANDS = 'post v1/command/';
export const UPDATE_COMMANDS = 'put v1/command/';
export const REMOVE_COMMAND = 'delete v1/command/';
export const APPROVERS_REJECTED_COMMANDS = 'post v1/approvals/';
export const COMMAND_CONFIRMED = 'post user/e-imzo/sign/'
export const COMMAND_GENERATE = 'post v1/generate-command/'

//Calendar turnstile
export const GET_TIME_TABLE = 'get v1/calendar/staff/working_hour_types/';
export const ADD_TIME_TABLE = 'post v1/calendar/set/working_hour/';
export const GET_TIME_TABLE_EVENT_BY_USER = 'get v1/tourniquet/event/ timeTableEvent';
export const GET_TIME_TABLE_EVENT = 'get v1/tourniquet/attendance-by-department/';
export const SEND_TIME_TABLE_IN_APPROVE = 'post v1/calendar/director/approvers/send_table/';
export const GET_TIME_TABLE_STATUS = 'get v1/calendar/director/approvers/table_status_check/';
export const GET_ALL_TIME_TABLE = 'get v1/calendar/tabel/approved/ allTimeTable';
export const CONFIRM_TIME_TABLE_BY_HEAD = 'post v1/calendar/director/approvers/checked_by_key/';
export const GET_OPEN_TIME_TABLE = 'get v1/calendar/director/approvers/{id}/info_staff_attendance/ openTimeTable';
//Survey and resume apis
export const GET_SURVEY = 'get v1/survey/';
export const GET_ONE_SURVEY = 'get v1/survey/';
export const GET_SURVEY_BY_KEY = 'get v1/survey/check/';
export const ADD_SURVEY = 'post v1/survey/';
export const GET_SURVEYS = 'get v1/survey/ surveys';
export const SURVEY_SET_STATUS = 'patch v1/survey/';
//user surveys
export const GET_USER_SURVEY = 'get user/survey/';
export const GET_USER_ADD_SURVEY = 'post user/survey/';
export const UPDATE_USER_ADD_SURVEY = 'put user/survey/';
export const REMOVER_SURVEY_ACTIVITY = 'delete user/survey-activity/';
export const REMOVER_SURVEY_FAMILY_INFO = 'delete user/survey-family-info/';
// Orders
export const GET_APPEAL_TEMPLATE = 'post v1/application/application_template/'
export const ADD_APPEAL = 'post v1/application/';
export const GET_APPEAL_HR = 'get v1/application/ applications';
export const GET_APPEAL_ONE_HR = 'get v1/application/';
export const GET_APPEAL_PDF_URL = 'post v1/application/';
export const CHECK_APPEAL_STATUS_BY_HR = 'put v1/application/';
export const CHECK_APPEAL_STATUS_BY_HO = 'post v1/application/set_status/';
export const GET_APPEAL_APPROVALS = 'get v1/application/approvers/';
export const SET_APPEAL_APPROVALS_STATUS = 'post v1/application/set_status_approval/';
export const GET_APPEAL_STAT_BY_TYPE = 'get v1/application/current_statistics_by_type/';
export const GET_APPEAL_TYPES = 'get v1/application/types/';
export const GET_APPEAL_STAT_BY_STATUS = 'get v1/application/current_statistics_by_status/';
//Certificate
export const GET_CERTIFICATE = 'get mf_id/certificate/'
//Iq test
export const GET_IQ_TESTS ='get v1/simple_test/ iqTests';
export const GET_MINFIN_TEST ='get minfintest/ minFinTest';
export const GET_ONE_IQ_TEST ='get v1/simple_test/';
export const ADD_IQ_TEST ='post v1/simple_test/';
export const UPDATE_IQ_TEST ='put v1/simple_test/';
export const ADD_IQ_TEST_QUESTION ='put v1/simple_test/';
export const UPDATE_IQ_TEST_QUESTION ='post v1/simple_test/edit_questions/';
export const SET_STATUS_IQ_TEST ='put v1/simple_test/';
// Dismiss Sheet
export const GET_DISMISS_SHEET = 'get v1/application/dismiss/sheet/ dismissSheet';
export const GET_USER_DISMISS_SHEET = 'get v1/application/dismiss/sheet/ userDismissSheet';
export const GET_ONE_DISMISS_SHEET = 'get v1/application/dismiss/sheet/';
export const CREATE_DISMISS_SHEET = 'post v1/application/dismiss/sheet/';
export const UPDATE_DISMISS_SHEET = 'put v1/application/dismiss/sheet/';
export const REMOVE_GET_DISMISS_SHEET = 'delete v1/application/dismiss/sheet/';
export const APPROVE_GET_DISMISS_SHEET = 'get v1/application/dismiss/sheet/approvers/';
export const SET_STATUS_DISMISS_SHEET = 'post v1/application/dismiss/sheet/set_status_approval/';
export const CONFIRMED_DISMISS_SHEET = 'post v1/application/dismiss/sheet/set_status/';
// Other API
export const GET_COUNTRY = 'get v1/country/';
export const GET_CHILD_ORGANISATION = 'get republic_childs/';
export const GET_EDUCATION = 'get electron/diplom/';
export const GET_STAT_BY_DEPARTMENT = 'get department_type_count/';
export const GET_STAT = 'get v1/statistics/department/';
export const GET_STAT_BY_NATIONALITY = 'get v1/statistics/nation_statistic/';
export const GET_STAT_BY_AGE = 'get v1/statistics/user_age/';
export const GET_NATIONALITY = 'get user/nationality/';
export const GET_STAFF_WORKING_TYPE = 'get staff_working_type/';
export const GET_STAFF_RESPONSIBLE = 'get responsible_man/';
export const GET_REPORT = 'get v2/staff/report/';
export const GET_IDENTIFICATION = 'get mf_id/user_certificate/';
export const GET_ORGAN_BY_REGION = 'get childs/';
export const LOGIN_MF_ID = 'post user/login_with_mf_id/';
export const GET_RAZRYAD = 'get v2/staff/razryad/';
export const GET_USER_TAX = 'get electron/employee_info/get_physical_tax/ userTaxInfo'
export const GET_SHTAT_REPORT = 'get v1/shtat/report/';
// Notice
export const GET_NOTICE = 'get v1/notice/ notice';
export const GET_ONE_NOTICE = 'get v1/notice/';
export const CREATE_NOTICE = 'post v1/notice/';
export const UPDATE_NOTICE = `put v1/notice/`;
export const REMOVE_NOTICE = `delete v1/notice/`;
export const CONFIRMED_NOTICE = `post v1/notice/confirm/`;
export const GET_USER_SALARY = `get v1/integration/uzasboSalary/`;
export const GET_SALARY_PENSION = `get electron/pension/`;
export const GET_SALARY_VENCON = `get v1/integration/venkonSalary/`;
export const GET_SALARY_BT_UZASBO = `get v1/integration/uzasboSalarySpravka/`;
export const GET_NOTICE_CONFIRMED = `get v1/notice/confirmed/`;
//Salary
export const GET_SALARY = 'get salary/ salary'
export const GET_ONE_SALARY = 'get salary/'
export const CREATE_SALARY = 'post salary/'
export const UPDATE_SALARY = 'put salary/'
export const REMOVE_SALARY = 'delete salary/'
// States
export const STAFFLIST_USER_LOGOUT = 'get v1/shtat/user/logout/';
export const GET_STATE_ORGS = `get v1/shtat/organizations/ stateOrgs`;
export const GET_STATE_ORG = `get v1/shtat/organization/`;
export const UPDATE_STATE_ORG = 'put v1/shtat/organization/';
export const GET_STATE_DEPARTMENTS = `get v1/shtat/department/list/ stateDepartments`;
export const GET_STATE_DEPARTMENT = `get v1/shtat/department/`;
export const REMOVE_DEPARTMENT = `delete v1/shtat/department/`;
export const CREATE_STATE_DEPARTMENT = `post v1/shtat/department/ stateDepartment`;
export const UPDATE_STATE_DEPARTMENT = `put v1/shtat/department/`;
export const GET_STATE_USERS = `get v1/shtat/users/ stateUsers`;
export const GET_STAFFLIST_DEPARTMENT_USERS = `get v1/shtat/department/list/users/ stafflistDepartmentUsers`;
export const SELECT_STATE_USERS = `get v1/shtat/select_user/`;
export const GET_STAFFLIST_ROLES = `get v1/shtat/role/list/`;
export const GET_STAFFLIST_USERDATA = `get v1/shtat/user_me/`;
export const GET_ORG_STAFFLIST = `get v1/shtat/departments/sent_shtatka/ orgStaffList`;
export const GET_ONE_ORG_STAFFLIST = `get v1/shtat/departments/sent_shtatka/`;
export const CHANGE_STAFF_USER_STATUS = `post v1/shtat/user/change_status/`;
export const CHECK_STAFF_USER_PASSWORD = `post v1/shtat/user/check_password/`;
export const CHANGE_STAFF_USER_PASSWORD = `post v1/shtat/user/change_password/`;
// Settings
export const GET_USER_ROLE_CONTROL = 'get v1/settings/hr/hr_users/'
export const GET_USER_BY_ROLE = 'get v1/settings/hr/user_list/ userListByRole'
export const ADD_USER_ROLE_CONTROL = 'post v1/settings/hr/give_hr_role/'
export const CHANGE_USER_ROLE_CONTROL = 'post v1/settings/hr/remove_hr_role/';

// Order types
export const GET_ORDER_TYPES = 'get v1/tabel/command-type/hr_types orderTypes';
export const GET_ONE_ORDER_TYPES = 'get v1/tabel/command-type/';
export const UPDATE_ORDER_TYPES = 'put v1/tabel/command-type/';
export const CREATE_ORDER_TYPES = 'post v1/tabel/command-type/';
export const CHANGE_STATUS_ORDER_TYPES = 'delete v1/tabel/command-type/';