import Axios from 'axios';

function Req({ type, data, headers, query, responseType }) {
  const [method, url] = URLParser(type);
  const token = localStorage.getItem('token');
  const isStaffList = localStorage.getItem('isStaffList');
  return Axios({
    url: isStaffList ? `${process.env.REACT_APP_STAFFLIST_URL}/api/${url}` : `${process.env.REACT_APP_SERVER_URL}/api/${url}`,
    method: method ? method : "GET",
    data: data ? data : {},
    params: query && Object.keys(query).length ? query : {}, 
    responseType: responseType ? responseType : null,
    headers: headers ? {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    } : {
      Authorization: token ? `Bearer ${token}` : ''
    },
  });
}


function URLParser(string) {
  return string.split(' ');
}
export default Req;
export { Req, URLParser };