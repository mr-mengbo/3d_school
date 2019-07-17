import '../style/index';
import '../style/style';
import { GetQueryString, fuzzyQuery } from '../utils/util';
import $ from 'jquery';
// 图片图层
var imageLayer = new AMap.ImageLayer({
    url: 'http://47.92.118.208:8081/dixing.png',
    bounds: new AMap.Bounds(
        [116.643732,39.919007],
        [116.650965,39.922031]
    ),
    zooms: [16, 19]
});
const map = new AMap.Map("mapBox", {
    viewMode:'3D',
    pitch: 0,
    rotation: 0,
    zoom: 18,
    zooms:[16,19],
    showBuildingBlock: false, // 设置地图显示3D楼块效果，移动端也可使用。推荐使用。
    showLabel: false,
    center: [116.64863,39.920623],
    // mapStyle: 'amap://styles/macaron',
    showIndoorMap: false,
    forceVector:true,
    expandZoomRange: true,
    layers: [
        new AMap.TileLayer(),
        imageLayer
    ]
});
let mapList = [];
// 获取模糊查询信息
$.ajax({ 
    url: "http://47.92.118.208/school-map/sitePosition/getAll", 
    success: function(res){
        console.log('模糊查询',res)
        if(res.code == 200) {
            mapList = res.data;
        }
    }
});
const center = GetQueryString('center');
const nearby = GetQueryString('nearby')
if (center) {
    // 获取全景展示信息
    // http://47.92.118.208/school-map/quanjing/getAll
    $.ajax({ 
        url: "http://47.92.118.208/school-map/quanjing/getAll", 
        success: function(res){
            console.log('全景图',res)
            if(res.code == 200) {
               const provinces = res.data;
               var markers = []; //province见Demo引用的JS文件
               var marker;
               for (let i = 0; i < provinces.length; i += 1) {
                   marker = new AMap.Marker({
                       position: provinces[i].center.split(','),
                       offset: new AMap.Pixel(-10, -10),
                       title: provinces[i].name,
                       map: map
                   });
                   var markerContent = document.createElement("div");
                   // console.log((x * 1 == provinces[i].center.split(',')[0]* 1) && (y* 1 == provinces[i].center.split(',')[1]* 1))
                   // 点标记中的图标
                   var markerImg = document.createElement("img");
                   // markerImg.attr('data-type' , 'false');  
                   markerImg.className = "markerlnglat";
                   if(provinces[i].center == center) {
                       markerImg.src = "https://vdata.amap.com/icons/b18/1/2.png";
                   }else {
                       markerImg.src = "http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png";
                   }
                   // markerImg.src = "http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png";
                   markerContent.appendChild(markerImg);
                   marker.on('click', function(e) {
                       console.log(e, i)
                       window.location.href = './panorama.html?imgurl=' + provinces[i].imgUrl
                       // console.log($(this)[0].Ie.contentDom)
                       // $('.amap-marker-content').children('div').remove('span');
                       // 点标记中的文本
                       // var markerSpan = document.createElement("span");
                       // markerSpan.className = 'marker';
                       // markerSpan.innerHTML = provinces[i].name;
                       // $('.amap-marker-content:eq('+ i +')').find('div').append(markerSpan);
                       // marker.setContent(markerContent); //更新点标记内容
                   })
                   marker.setContent(markerContent); //更新点标记内容
               }
               markers.push(marker);
               // map.add(marker);
            }
        }
    });
}
// 搜索模糊查询
$('.search-btn').click(function() {
    const str = $('input').val();
    $('.search-list').show().html('');
    let searchList = fuzzyQuery(mapList, str);
    if(searchList.length > 0) {
        searchList.forEach(function(item){
            $('.search-list').append(`<li class="search-position" data-position="${item.center}">${item.name}</li>`)
        })
        // 搜索位置并导航
        $('.search-position').click(function() {
            $('.search-list').hide();
            $('.footer').hide();
            const name = $(this).html();
            const position = $(this).attr('data-position').split(',');
            map.setCenter(position);
            const marker = new AMap.Marker({
                position,
                offset: new AMap.Pixel(-10, -10),
                icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                map: map
            });
            marker.on('click', function(e) {
                walk([116.648432,39.92166], position, name)
            })
        })
    }else {
        $('.search-list').append('<li>没有查到</li>')
    }
})
// 附近跳转
if (nearby) {
    $('.head').show().find('span').html('退出周边');
    $('.return').attr('href', './periphery.html');
    // 获取周边详细信息
    $.ajax({ 
        url: `http://47.92.118.208/school-map/circum/getByTypeId?typeId=${nearby}`, 
        success: function(res){
            console.log('周边详细信息',res)
            if(res.code == 200) {
                const zhoubian = res.data;
                zhoubian.forEach(item => {
                    $('.nearby').append(
                        `
                        <div class="nearby-con">
                            <div class="nearby-details" data-position="${item.content}">
                                <img src="${item.imgUrl}" alt="">
                                <div class="left">
                                    <span class="left-title">${item.name}</span>
                                    <span>
                                        ${item.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                        `
                    )
                    $('.nearby-details').click(function () {
                        $('.nearby').hide();
                        $('.footer').hide();
                        const position = $(this).attr('data-position').split(',');
                        map.setCenter(position);
                        const marker = new AMap.Marker({
                            position,
                            offset: new AMap.Pixel(-10, -10),
                            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                            map: map
                        });
                        marker.on('click', function(e) {
                            walk([116.648432,39.92166], position, name)
                        })
                    })
                })
            }
        }
    });
    $('.nearby').show();
}
// 绘制步行路线
function walk(start, end, name) {
    // 当前示例的目标是展示如何根据规划结果绘制路线，因此walkOption为空对象
    var walkingOption = {}

    // 步行导航
    var walking = new AMap.Walking(walkingOption)
    //根据起终点坐标规划步行路线
    walking.search(start, end, function(status, result) {
        // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
        if (status === 'complete') {
            if (result.routes && result.routes.length) {
                drawRoute(result.routes[0])
                $('.distance').show();
                $('.head').show().find('span').html('退出导航');
                $('.title').append(`
                <span>${name}</span>
                <span>${result.routes[0].distance}米</span>`)
                // log.success('绘制步行路线完成')
            }
        } else {
            console.log(result)
            // log.error('步行路线数据查询失败' + result)
        } 
    });
} 
function drawRoute(route) {
    var path = parseRouteToPath(route)

    var startMarker = new AMap.Marker({
        position: path[0],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        map: map
    })

    // var endMarker = new AMap.Marker({
    //     position: path[path.length - 1],
    //     icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
    //     map: map
    // })

    var routeLine = new AMap.Polyline({
        path: path,
        zIndex: 10000,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: '#0091ff',
        lineJoin: 'round'
    })

    routeLine.setMap(map)

    // 调整视野达到最佳显示区域
    // map.setFitView([ startMarker, endMarker, routeLine ])
}
// 解析WalkRoute对象，构造成AMap.Polyline的path参数需要的格式
// WalkRoute对象的结构文档 https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkRoute
function parseRouteToPath(route) {
    var path = []
    console.log(route)
    for (var i = 0, l = route.steps.length; i < l; i++) {
        var step = route.steps[i]

        for (var j = 0, n = step.path.length; j < n; j++) {
          path.push(step.path[j])
        }
    }

    return path
}
// var mybounds = new AMap.Bounds([116.647665,39.921826], [116.647574,39.919119]);
// map.setBounds(mybounds);
// var bounds =  map.getBounds();
// map.setLimitBounds(bounds);
// 创建Object3DLayer图层
var object3Dlayer = new AMap.Object3DLayer();
map.add(object3Dlayer);
//  116.643785,39.919007
map.plugin(["AMap.GltfLoader"], function () {
    var paramCity = {
        position: new AMap.LngLat(116.648109,39.920476), // 必须
        scale: 7.4, // 非必须，默认1
        height: -110,  // 非必须，默认0
        scene: 0, // 非必须，默认0
    };


    var gltfObj = new AMap.GltfLoader();

    gltfObj.load('http://47.92.118.208:8081/ceshi03/ceshi03.gltf', function (gltfCity) {
        gltfCity.setOption(paramCity);
        gltfCity.rotateX(-90);
        gltfCity.rotateY(-180);
        gltfCity.rotateZ(-180);
        object3Dlayer.add(gltfCity);
    });

});  
$(".service").click(function(){
    $(".service-container").show();
    $(".container").show();
});
$(".service-container").click(function() {
    $(this).hide();
    $(".container").hide();
})
$(".activity").click(function() {
    var flag = $(this).attr('data-flag');
    console.log(flag)
    if(flag == "true") {
        var length = $(this).find('.open-title').length + 1 || 1;
        $(this).animate({
            height: length * 1.06 + 'rem', 
        },1000)
        $(this).attr('data-flag', 'flase')
        $(this).siblings('.activity').animate({
            height: '1rem', 
        },1000)
        $(this).siblings('.activity').attr('data-flag', 'true')
    }else {
        $(this).animate({
            height: '1rem', 
        },1000)
        $(this).attr('data-flag', 'true')
        $(this).siblings('.activity').attr('data-flag', 'false')
    }
})