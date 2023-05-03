function addClickCount(buttonName,url){
    inter.addClickCount(buttonName).then(r=>{
        //console.log(r);
        debugger
        if(!url)return
        inter.browser(r=>{
            if(r==0){
                window.open(url)
            }else{
                window.location.href = url;
            }
        });
    })
}

let inter={
    url:'/java/pao/',
    //版本
    pkgGetList(){
        return new Promise((resolve)=>{
            this.ajax('pkg/getLatest',{status:0}).then(r=>{
                console.log(r)
                let obj={}
                let arr = r.data || [];
                arr.forEach(item=>{
                    if(item.pltfType=='ios')obj.ios = item.downloadUrl;
                    if(item.pltfType=='android')obj.android = item.downloadUrl;
                    if(item.pltfType=='h5')obj.h5 = item.downloadUrl;
                    obj.remark = item.remark;
                    obj.updateTime =time.init(item.updateTime,1);
                    obj.version = item.version;
                })
                this.mediaGetList().then(r=>{
                    obj.game = r.game;
                    obj.service = r.service;
                    obj.fanbook = r.fanbook;
                    obj.official = r.official;
                    resolve(obj);
                })
            });
        })
    },
    //站内链接
    getNativeLinks(){
        return this.ajax('channel/getNativeLinks',{status:0});
    },
    //社交链接
    getSNSLinks(){
        return this.ajax('channel/getSNSLinks',{status:0});
    },

    //添加点击事件
    addClickCount(buttonName){
        let url='clickCount/addClickCount/'+buttonName
        return this.ajax(url);
    },

    /**
     * 统一口
     * */
    getLinks(){
        return this.ajax('channel/getLinks');
    },

    //新闻详细接口
    apiGetPostContent(id){
        return this.ajax('post/apiGetPostContent/'+id);
    },

    //主页新闻推荐
    indexNesList(pageSize){
        return this.ajax('post/apiGetPostMap',{pageNum:1,pageSize:pageSize});
    },

    //新闻分页接口
    apiGetList(data){
       // console.log(data)
        return this.ajax('post/apiGetPostList',data);
    },

    //查询官方更多游戏
    channelGetMoreGames(data){
        if(!data)data = {status:0}
        return this.ajax('game/getMoreGames',data);
    },
    plays(){
        return this.ajax('media/getList',{mediaKey:'pao.banner.video'});
    },
    //图标等媒体资源管理
    mediaGetList(){
        return new Promise((resolve)=>{
            this.ajax('media/getList',{status:0}).then(res=>{
               // console.log(res);
                let obj={}
                let arr = res.data || [];
                arr.forEach(r=>{
                    if(r.mediaKey=='pao.wechat.official')obj.official = this.imgPath(r.mediaUrl);
                    if(r.mediaKey=='pao.icon')obj.icon = this.imgPath(r.mediaUrl);
                    if(r.mediaKey=='pao.qrcode.game')obj.game = this.imgPath(r.mediaUrl);
                    if(r.mediaKey=='pao.qrcode.service')obj.service = this.imgPath(r.mediaUrl);
                    if(r.mediaKey=='pao.qrcode.fanbook')obj.fanbook = this.imgPath(r.mediaUrl);
                    if(r.mediaKey=='pao.banner')obj.banner = this.imgPath(r.mediaUrl);
                })
                this.ajax('media/getList',{mediaKey:'pao.slideshow',status:0}).then(res=>{
                    obj.banner=res.data || [];
                    resolve(obj);
                })
            });
        })
    },


    imgPath(url){
        return '/java'+url;
    },
    /*对象转字符串*/
    getStr:function(data,d){
        var str="";
        var s='?';
        if (typeof(d) != "undefined"){
            s=d;
        }
        for (let attr in data) {
            str+=s+attr+"="+(data[attr]);
            s='&';
        }
        return str;
    },
    ajax(inter,data){
        let url = this.url+inter+this.getStr(data);
        //console.log(url);
        if(!data)data={};
        return new Promise((resolve)=>{
            let obj={data:{},url:url,dataType:'json',type:'get'}
            obj.success=(res)=>{
                resolve(res);
            }
            $.ajax(obj);
        })
    },

    //读取HTML文件模板
    readHTML:function(url){
        return new Promise((resolve)=>{
            url='/skin/tem/'+url+'.html?v='+Math.random();
            let obj={async:false,url:url};
            obj.success = function(result){
                resolve(result);
            }
            obj.error = function(){
                resolve('');
            }
            $.ajax(obj);
        })
    },

    browser(call){
        var u = navigator.userAgent, app = navigator.appVersion;
        var versions={
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
        var ua = window.navigator.userAgent.toLowerCase();
        this.appVersion=0;
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            this.appVersion=3;
        }
        if (versions.ios || versions.iPhone || versions.iPad){
            this.appVersion=2;
        }
        else if (versions.android){
            this.appVersion=1;
        }
        call(this.appVersion);
    }
}

let time={

    //获取url参数
    getqueryString:function(name){
        var Request = this.theRequest();
        var str=(Request[name]);
        if(typeof(str)=='undefined'){
            return null;
        }
        return decodeURIComponent(str);
    },

    //获取url中"?"符后的字串
    theRequest:function(){
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },

    init(date,type){
        date = date.replace(/T/g, " ");
        date = new Date(date.replace(/-/g, "/"));
        var year = date.getFullYear();       //年
        var month = date.getMonth() + 1;     //月
        var day = date.getDate();            //日
        var hh = date.getHours();            //时
        var mm = date.getMinutes();          //分
        var clock = '';
        month=(month<10)?('0'+month):month;
        day=(day<10)?('0'+day):day;
        hh=(hh<10)?('0'+hh):hh;
        mm=(mm<10)?('0'+mm):mm;
        if(type==2){
            return  clock = year +'-'+ month + '-' + day + ' '+hh+':'+mm;
        }
        if(type==1){
            clock = year +'.'+ month + '.' + day + '';
        }else{
            clock = month + '月' + day + '日 ';
        }

        return clock;
    }
}