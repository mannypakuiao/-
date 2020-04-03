//获取应用实例
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
import {
  config
} from '../../config.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */

  data: {
    url:config.url,
    value:'',
    list: [
      { title: '区域', img: '../../images/icons/xiajiantou1.png' },
      { title: '方式', img: '../../images/icons/xiajiantou1.png' },
      { title: '面积', img: '../../images/icons/xiajiantou1.png' },
      { title: '价格', img: '../../images/icons/xiajiantou1.png' },
    ],
    likeLi: [],
    quyus: [],
    fangxings: ['出租', '出售'],
    windowHeight: '400',
    quyuselected: '',
    fangxingselected: '',
    mianjiselected: '',
    shoujiaselected: '',
    mianji: ['不限', '20㎡以下', '20-50㎡', '50-100㎡', '100-200㎡', '200-500㎡', '500-1000㎡', '1000㎡以上'],
    shoujia: ['500元/月以下', '500-1000元/月', '1000-1500元/月', '1500-2000元/月', '2000-2500元/月', '2500-3000元/月', '3000元/月以上'],
    typeIndex: '5',
    quyuindex: '100',
    fangxingindex: '100',
    mianjiindex: '100',
    shoujiaindex: '100',
    diqushow: false,
    qyshow: false,
    mianshow: false,
    shoujiashow: false,
    zhezhaoshow: false,
    listIndex: '',
    type:'',
    pageNumber: 1,
    minprice:'',
    maxprice:'',
    quyucode:'',
    shuju:false
  },
  onLoad: function (options) {

    var that = this;
    var type = options.type
    if(type==3){
      wx.setNavigationBarTitle({
        title: '商铺列表'   
      })
    } 
    if (type == 4){
      wx.setNavigationBarTitle({
        title: '写字楼列表'
      })
    }
    if (type == 5) {
      wx.setNavigationBarTitle({
        title: '厂房列表'
      })
    }
    
    that.setData({
      type: type
    })
    var data = {
      cityCode: wx.getStorageSync('citycode'),
      pageNumber: that.data.pageNumber,
      type: that.data.type
    }
    that.requestDate(data);

    //获取屏幕高度
    var query = wx.createSelectorQuery();
    query.select('.aa').boundingClientRect()
    query.exec((res) => {
      var listHeight = res[0].height; // 获取list高度
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowHeight: res.windowHeight - listHeight - 20
          })
        },
      })
    })

    //区域下拉
    wx.request({
      url: config.url + '/api/homePage/getAreaList/' + wx.getStorageSync('citycode'),
      method: 'GET',
      success(res) {
        if (res.data.code == 0) {
          //var quyus = '';
          that.setData({
            quyus: res.data.data
          })
        }
      }
    })
  },
  requestDate(data) {
    console.log(data)
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    wx.request({
      url: config.url + '/api/homePage/getBuildingsListPage',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        if (res.data.data == '') {
          that.setData({
            shuju: true
          })
        }
        wx.hideLoading()
        if (res.data.code == 0) {
          var likeLi = that.data.likeLi.concat(res.data.data)
          if (data.pageNumber == 1) {
            likeLi = res.data.data
          }
          if (res.data.data.length > 0) {
            that.setData({
              likeLi: likeLi,
              pageNumber: data.pageNumber + 1,
              flag: true,
            })
          } else {
            that.setData({
              likeLi: likeLi,
              flag: false
            })
          }
        }
      }
    })
  },
  loadMore: function () {
    if (this.data.flag) {
      var pageNumber = this.data.pageNumber
      var type = this.data.type
      var housetype = this.data.housetype
      this.queren(pageNumber, type, housetype);
    }
  },
  //housetype  1：区域 2：房型  3:面积 4：售价
  housetype: function (e) {
    var housetype = e.currentTarget.dataset.housetype
    var type = this.data.type
    this.setData({
      housetype: housetype
    })
    this.queren(1, type, housetype)
  },
  formSubmit: function (e) {
    this.setData({
      minprice: e.detail.value.minprice,
      maxprice: e.detail.value.maxprice
    })
  },
  //重置
  chongzhi1: function (e) {
    this.setData({
      quyuselected: '',
      quyuindex: '-1',
      quyucode: '',
      'list[0].title': '区域'
    })
  },
  chongzhi2: function (e) {
    this.setData({
      fangxingselected: '',
      fangxingindex: '-1',
      'list[1].title': '方式'
    })
  },
  chongzhi3: function (e) {
    this.setData({
      mianjiindex: '-1',
      mianjiselected: '',
      'list[2].title': '面积'
    })
  },
  chongzhi4: function (e) {
    this.setData({
      shoujiaindex: '-1',
      shoujiaselected: '',
      'list[3].title': '售价',
      value: ''
    })
  },
  queren: function (pageNumber, type, housetype) {
    let listIndex = this.data.listIndex
    this.setData({
      diqushow: false,
      shoujiashow: false,
      qyshow: false,
      mianshow: false,
      zhezhaoshow: false,
      typeIndex: '5',
      quyuindex: '100',
      fangxingindex: '100',
      mianjiindex: '100',
      shoujiaindex: '100',
    })
    if (listIndex == 0) {
      if (this.data.quyuselected !== "") {
        this.setData({
          "list[0].title": this.data.quyuselected
        })
      }
    }
    if (listIndex == 1) {
      if (this.data.fangxingselected !== "") {
        if (this.data.fangxingselected=='出售'){
          this.setData({
            'shoujia[0]': '10万以下',
            'shoujia[1]': '10-30万',
            'shoujia[2]': '30-50万',
            'shoujia[3]': '50-100万',
            'shoujia[4]': '100-200万',
            'shoujia[5]': '200-300万',
            'shoujia[6]': '300-500万',
            'shoujia[7]': '500万以上'
          })
        } else {
          this.setData({
            'shoujia[0]': '500元/月以下',
            'shoujia[1]': '500-1000元/月',
            'shoujia[2]': '1000-1500元/月',
            'shoujia[3]': '1500-2000元/月',
            'shoujia[4]': '2000-2500元/月',
            'shoujia[5]': '2500-3000元/月',
            'shoujia[6]': '3000元/月以上'
          })
        }
        this.setData({
          "list[1].title": this.data.fangxingselected
        })
      }
    }
    if (listIndex == 2) {
      if (this.data.mianjiselected !== "") {
        this.setData({
          "list[2].title": this.data.mianjiselected
        })
      }
    }
    if (listIndex == 3) {
      if (this.data.shoujiaselected == "" && this.data.minprice == '' && this.data.maxprice == '') {
        this.setData({
          "list[3].title": '售价'
        })
      }
      if (this.data.shoujiaselected !== "" && this.data.minprice == '' && this.data.maxprice == '') {
        this.setData({
          "list[3].title": this.data.shoujiaselected
        })
      }
      if (this.data.minprice !== '' || this.data.maxprice !== '') {
        this.setData({
          "list[3].title": this.data.minprice + '万' + '-' + this.data.maxprice + '万'
        })
      }
      if (this.data.minprice == '' && this.data.maxprice !== '') {
        this.setData({
          "list[3].title": this.data.maxprice + '万以下'
        })
      }
      if (this.data.minprice !== '' && this.data.maxprice == '') {
        this.setData({
          "list[3].title": this.data.minprice + '万以上'
        })
      }
    }

    var that = this;
    //面积
    var mianjiselected = that.data.mianjiselected;
    var mianji = mianjiselected.split('-');
    //售价
    var shoujiaselected = that.data.shoujiaselected;
    var shoujia = shoujiaselected.split('-');
    //面积
    var mianji0 = "";
    var mianji1 = "";
    var shoujia0 = "";
    var shoujia1 = "";
    if (mianjiselected == '不限') {
      mianji0 = "";
      mianji1 = "";
    } else if (mianjiselected == "20㎡以下") {
      mianji0 = 0;
      mianji1 = 20;
    } else if (mianjiselected == "1000㎡以上") {
      mianji0 = 1000;
      mianji1 = "";
    } else if (mianji.length > 1) {
      mianji0 = mianji[0];
      mianji1 = mianji[1];
      mianji1 = mianji1.split('㎡')[0];
    } else {

    }
    //售价
    if (that.data.minprice == '' && that.data.maxprice == '') {
     
      if (shoujiaselected == '不限') {
        shoujia0 = "";
        shoujia1 = "";
      } else if (shoujiaselected == "500元/月以下") {
        shoujia0 = 0;
        shoujia1 = 500;
      } else if (shoujiaselected == "3000元/月以上") {
        shoujia0 = 3000;
        shoujia1 = "";
      } else if (shoujiaselected == '10万以下'){
        shoujia0 = 0;
        shoujia1 = 10;
      } else if (shoujiaselected == '500万以上'){
        shoujia0 = 500;
        shoujia1 = "";
      } else if (shoujia.length > 1) {
        console.log(this.data.fangxingselected)
        if (this.data.fangxingselected=='出售'){
          shoujia0 = shoujia[0];
          shoujia1 = shoujia[1];
          shoujia1 = shoujia1.split('万')[0];
        } else {
          shoujia0 = shoujia[0];
          shoujia1 = shoujia[1];
          shoujia1 = shoujia1.split('元')[0];
        }
      }
    } else {
      shoujia0 = that.data.minprice;
      shoujia1 = that.data.maxprice;
    }

    var data = {
      cityCode: wx.getStorageSync('citycode'),
      countyCode: that.data.quyucode,
      mode: that.data.fangxingselected,
      minSquare: mianji0,
      maxSquare: mianji1,
      minMoney: shoujia0,
      maxMoney: shoujia1,
      pageNumber: pageNumber,
      type: type
    }
    that.requestDate(data);
  },

  houseDetails: function (e) {
    var user = wx.getStorageSync('user');
    if (user.phone == '' || user.phone == null) {
      wx.showModal({
        title: '温馨提示',
        showCancel: false,
        content: '绑定手机后,可查看详情!',
        success(res) {
          if (res.confirm) {
            //用户点击确定 跳转个人中心
            wx.reLaunch({
              url: '../person/person'
            })
          } else if (res.cancel) {

          }
        }
      })
      return false
    }

    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../houseDetails/houseDetails?id=' + id + '&type=' + type,
    })
  },
  // 区域
  quyu: function (e) {
    var index = e.currentTarget.dataset.index;
    var names = e.currentTarget.dataset.item;
    var code = e.currentTarget.dataset.code;
    this.setData({
      quyuindex: index,
      quyuselected: names,
      quyucode: code
    })
  },
  // 面积
  mianji: function (e) {
    var index = e.currentTarget.dataset.index;
    var names = e.currentTarget.dataset.item;
    this.setData({
      mianjiindex: index,
      mianjiselected: names
    })
  },
  // 房型
  fangxing: function (e) {
    var index = e.currentTarget.dataset.index;
    var names = e.currentTarget.dataset.item;
    this.setData({
      fangxingindex: index,
      fangxingselected: names
    })
  },
  //售价
  shoujia: function (e) {
    var index = e.currentTarget.dataset.index;
    var names = e.currentTarget.dataset.item;
    this.setData({
      value: '',
      shoujiaindex: index,
      shoujiaselected: names
    })
  },
  //导航
  nav: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      listIndex: index
    })
    if (index == '0') {
      if (this.data.diqushow) {
        this.setData({
          diqushow: false,
          qyshow: false,
          zhezhaoshow: false,
          shoujiashow: false,
          typeIndex: '5',
        })
      } else {
        this.setData({
          diqushow: true,
          qyshow: false,
          mianshow: false,
          shoujiashow: false,
          zhezhaoshow: true,
          typeIndex: index,
        })
      }
    }

    if (index == '1') {
      if (this.data.qyshow) {
        this.setData({
          diqushow: false,
          qyshow: false,
          zhezhaoshow: false,
          shoujiashow: false,
          typeIndex: '5',
        })
      } else {
        this.setData({
          diqushow: false,
          qyshow: true,
          mianshow: false,
          shoujiashow: false,
          zhezhaoshow: true,
          typeIndex: index,
        })
      }
    }

    if (index == '2') {
      if (this.data.mianshow) {
        this.setData({
          diqushow: false,
          mianshow: false,
          zhezhaoshow: false,
          shoujiashow: false,
          typeIndex: '5',
        })
      } else {
        this.setData({
          diqushow: false,
          mianshow: true,
          zhezhaoshow: true,
          qyshow: false,
          shoujiashow: false,
          typeIndex: index,
        })
      }
    }

    if (index == '3') {
      if (this.data.shoujiashow) {
        this.setData({
          diqushow: false,
          shoujiashow: false,
          mianshow: false,
          zhezhaoshow: false,
          typeIndex: '5',
        })
      } else {
        this.setData({
          diqushow: false,
          shoujiashow: true,
          mianshow: false,
          zhezhaoshow: true,
          qyshow: false,
          typeIndex: index,
        })
      }
    }
  },

  
})