import {config} from '../config.js'

class HTTP{
  request(params){
    if(!params.method){
      params.method = "POST"
    } 
    if (!params.header){
      params.header = 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: config.url + params.url,
      method: params.method,
      data: params.data,
      header: {
        'content-type': params.header,
      },
      dataType: 'json',
      responseType: 'text',
      success: (res)=> {
        let code = res.statusCode.toString()
        if(code.startsWith('2')){
        // if (res.data.retCode == '0') {
          if (res.data.retCode == '-1'){
            params.success(res.data)
            wx.showToast({
              title: '抱歉，出错啦',
              duration: 1500,
              icon: 'none'
            })
          }else{
            params.success(res.data)
          }
        }else{
        wx.showToast({
          title: '抱歉，出错啦',
          duration: 1500,
          icon: 'none'
        })
        }
       },
      fail: (res) => { 
        wx.showToast({
          title: '抱歉，出错啦',
          duration: 1500,
          icon:'none'
        })
      }
    })
  }

}

export {HTTP}