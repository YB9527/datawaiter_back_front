import request from './request'

var datawaiterip = window.datawaiterip;
export function get() {
  console.log(datawaiterip)
  return request({
    url: '/jdbc/get',
    method: 'get',
    baseURL: datawaiterip,
  }).then(res => {
    return res.data;
  });
}

