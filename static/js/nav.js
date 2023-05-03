//单位rem 浏览器宽度自适应
let width = $(window).width();
if(width>1920)width=1920;
if(width<1140)width=1140;
$("html").css({ fontSize: width / 20 });
$(window).resize(function() {
    width = $(window).width();
    if(width<1150 || width>1920)return
    $("html").css({ fontSize: width / 20});
});


function show(){
    var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    if (top > 800) {//500就是滚动条滚动到的位置，大于500(500指500px)才显示
        //node.style.display = 'block';
       // console.log(1,top)


        var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
        if((scrollTop+windowHeight)==scrollHeight){
            $('.right_panel').css('display','none');
        }else{
            $('.right_panel').css('display','block');
        }

    } else {
        $('.right_panel').css('display','none');
    }



}


$(function (){
    show();
    window.onscroll = function () {
        show();
    }

    let a = window.location.pathname;
    inter.browser(r=>{
        if(r==0)return;
        if(a=='' || a=='/'){
            window.location.href = 'phone_index.html'
            return;
        }
        if(a.indexOf('index')>=0){
            window.location.href = 'phone_index.html'
            return;
        }
        if(a.indexOf('news_content')>=0){
            console.log(3);
            window.location.href = 'phone_sing.html?id='+time.getqueryString('id');
            return;
        }
        if(a.indexOf('news')>=0){
            //console.log(2);
            window.location.href = 'phone_list.html'
            return;
        }

    })

    //console.log(a);
    $('.wcn').click(function (){
        $('.tip_box').css('display','flex')
    })
    $('.tip_box a').click(function (){
        $('.tip_box').css('display','none')
    })
})

let navData={
    init(){
        this.right_panel(objs=>{
            inter.channelGetMoreGames().then(res=>{
                //console.log(res);
                let hot = res.data.hot.rows || [];
                let hostObj = hot[0] || {};
                if(hostObj.iconUrl)hostObj.iconUrl = inter.imgPath(hostObj.iconUrl);
                let hotList = [];
                hot.forEach((r,i)=>{
                    if(i>0 && i<7){
                        hotList.push(r);
                    }
                })
                let latest=res.data.latest.rows || [];
                let latestObj = latest[0] || {};
                if(latestObj.iconUrl)latestObj.iconUrl = inter.imgPath(latestObj.iconUrl);
                let latestList = [];
                latest.forEach((r,i)=>{
                    if(i>0 &&i<7){
                        latestList.push(r);
                    }
                })
                let obj ={hotList:hotList,hostObj:hostObj,latestList:latestList,latestObj:latestObj,official:objs.official}


                inter.getLinks().then(vs=>{
                    obj.links=vs.data.pccommunity || []
                    inter.readHTML('nav').then(r=>{
                        inter.mediaGetList().then(r1=>{
                           // console.log(r1);
                            let icon = r1.icon || 'skin/images/n3.png';
                            obj.icon =icon;
                            $('#nav_html').html(template(r,obj));
                        })
                    })
                })


            })
        });

        this.bottom();

    },
    bottom(){
        inter.getLinks().then(r=>{
            let arr = r.data.footer || [];
            inter.readHTML('bottom').then(r=>{
                let v=template(r,{link:arr});
                $('#footer_box_html').html(v);
            })
        })
    },
    right_panel(call){
        inter.pkgGetList().then(obj=>{
            inter.readHTML('right_panel').then(r=>{
                $('#right_panel_html').html(template(r,obj));
            })
            call(obj);
        })

    }
}
