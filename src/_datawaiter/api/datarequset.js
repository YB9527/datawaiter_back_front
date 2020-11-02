import request from './request'
var datawaiterip = window.datawaiterip;

export function get() {
  return request({
    url: '/jdbc/get',
    method: 'get',
    baseURL: datawaiterip,
  }).then(res => {
    return res.data;
  });
}

export function systemApi({url,method,data}) {
  let custom= {url: url, method: method?method:"get",baseURL: datawaiterip};
  if(method === "post"){
    custom.data  = data;
    custom.header={
      'Content-Type':'application/json'  //如果写成contentType会报错
    }
  }
  return request(custom).then(res => {
    return res.data;
  });
}
