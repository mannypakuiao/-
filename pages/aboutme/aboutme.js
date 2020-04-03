import {
  config
} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    about:'',
    phone:'',
    address:'',
    img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: config.url + '/api/center/getAboutUsList',
      method: 'GET',
      data:{

      },
      success(res){
        wx.hideLoading()
        console.log(res)
        if(res.data.code==0){
          that.setData({
            name: res.data.data.name,
            about: res.data.data.about,
            phone: res.data.data.phone,
            img: config.url+res.data.data.img,
            address: res.data.data.address
          })         
        }
      }
    })
  },
  phone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  }
})