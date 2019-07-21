import '../style/index';
import '../style/style';
import { GetQueryString, fuzzyQuery } from '../utils/util';
import $ from 'jquery';
// 图片图层
for (let i =1; i <= 5; i++) {
    console.log(i)
}
var imageLayer1 = new AMap.ImageLayer({
    url: 'http://47.92.118.208:8081/schoolatlas/map01.png',
    bounds: new AMap.Bounds(
        [116.643825,39.91907],
        [116.650799,39.921986]
    ),
    zooms: [16, 19]
});
var imageLayer2 = new AMap.ImageLayer({
    url: 'http://47.92.118.208:8081/schoolatlas/map02.png',
    bounds: new AMap.Bounds(
        [116.643825,39.91907],
        [116.650799,39.921986]
    ),
    zooms: [16, 19]
});
var imageLayer3 = new AMap.ImageLayer({
    url: 'http://47.92.118.208:8081/schoolatlas/map03.png',
    bounds: new AMap.Bounds(
        [116.643825,39.91907],
        [116.650799,39.921986]
    ),
    zooms: [16, 19]
});
var imageLayer4 = new AMap.ImageLayer({
    url: 'http://47.92.118.208:8081/schoolatlas/map04.png',
    bounds: new AMap.Bounds(
        [116.643825,39.91907],
        [116.650799,39.921986]
    ),
    zooms: [16, 19]
});
var imageLayer5 = new AMap.ImageLayer({
    url: 'http://47.92.118.208:8081/schoolatlas/map05.png',
    bounds: new AMap.Bounds(
        [116.643825,39.91907],
        [116.650799,39.921986]
    ),
    zooms: [16, 19]
});
const map = new AMap.Map("mapBox", {
    viewMode:'3D',
    // rotateEnable:false,
    // pitchEnable:false,
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
        imageLayer1,
        imageLayer2,
        imageLayer3,
        imageLayer4,
        imageLayer5
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
const nearby = GetQueryString('nearby');
const startCenter = GetQueryString('startCenter');
const endCenter = GetQueryString('endCenter');
const position = GetQueryString('position');
// 导航初始值
let initCenter = [116.648432,39.92166];
//导航结束值
let endPosition = [];
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
                walk([116.648432,39.92166], position, name, false)
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
                        endPosition = position;
                        map.setCenter(position);
                        const marker = new AMap.Marker({
                            position,
                            offset: new AMap.Pixel(-10, -10),
                            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                            map: map
                        });
                        marker.on('click', function(e) {
                            console.log(position)
                            walk([116.648432,39.92166], position, name, false)
                        })
                    })
                })
            }
        }
    });
    $('.nearby').show();
}
if (position) {
    const positions = position.split(',');
    map.setCenter(positions);
    const marker = new AMap.Marker({
        positions,
        offset: new AMap.Pixel(-10, -10),
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        map: map
    });
    marker.on('click', function(e) {
        console.log(positions)
        walk([116.648432,39.92166], positions, name, false)
    })
}
// 路线导航 
if(startCenter && endCenter) {
    const startCenterArr = startCenter.split(',');
    const endCenterArr = endCenter.split(',');
    // new AMap.Marker({
    //     position: startCenterArr,
    //     icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
    //     map: map
    // })
    walk(startCenterArr, endCenterArr, name, true, false)
    // setInterval(() => {
    //     geolocation();
    //     walk(initCenter, endCenterArr, name, true, true);
    // }, 3000);
}
// 绘制步行路线
/**
 * start 起点
 * end 终点必须
 * name 非必须名字
 * flag 判断有没有起点或者终点
 * dingwei 非必须定位导航
 */
function walk(start, end, name, flag, dingwei) {
    // 当前示例的目标是展示如何根据规划结果绘制路线，因此walkOption为空对象
    var walkingOption = {}

    // 步行导航
    var walking = new AMap.Walking(walkingOption)
    if(dingwei) {
        map.clearMap();
    }
    //根据起终点坐标规划步行路线
    walking.search(start, end, function(status, result) {
        // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
        if (status === 'complete') {
            if (result.routes && result.routes.length) {
                if(flag) {
                    drawRoute(result.routes[0], true)
                }else {
                    $('.distance').show();
                    $('.head').show().find('span').html('退出导航');
                    $('.title').html('');
                    $('.title').append(`
                    <span>${name}</span>
                    <span>${result.routes[0].distance}米</span>`)
                    drawRoute(result.routes[0])
                }
                // log.success('绘制步行路线完成')
            }
        } else {
            console.log(result)
            // log.error('步行路线数据查询失败' + result)
        } 
    });
} 
function drawRoute(route, flag) {
    var path = parseRouteToPath(route)
    if(flag) {
        var endMarker = new AMap.Marker({
            position: path[path.length - 1],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            map: map
        })
    }else {
        var startMarker = new AMap.Marker({
            position: path[0],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            map: map
        })
    }


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
// gltf模型加载
const gltf = [
    {
        name: 'bangonglou',
        paramCity: {
            position: new AMap.LngLat(116.647219,39.92047), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'beimen',
        paramCity: {
            position: new AMap.LngLat(116.647264,39.920496), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'caimaodalou',
        paramCity: {
            position: new AMap.LngLat(116.647296,39.92038), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'dianjiaoguan',
        paramCity: {
            position: new AMap.LngLat(116.647219,39.92047), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'guojijiaoliu',
        paramCity: {
            position: new AMap.LngLat(116.647283,39.920406), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'jiaoxuelou',
        paramCity: {
            position: new AMap.LngLat(116.647321,39.920497), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'jiashuloubei',
        paramCity: {
            position: new AMap.LngLat(116.647218,39.920448), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'xuesheng06',
        paramCity: {
            position: new AMap.LngLat(116.647223,39.92028), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'jishuzhongxin',
        paramCity: {
            position: new AMap.LngLat(116.647294,39.920429), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'kantaidong',
        paramCity: {
            position: new AMap.LngLat(116.647219,39.92047), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'kantaixi',
        paramCity: {
            position: new AMap.LngLat(116.647219,39.92047), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'menwei',
        paramCity: {
            position: new AMap.LngLat(116.647219,39.92047), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'shibei',
        paramCity: {
            position: new AMap.LngLat(116.647284,39.920514), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'shitang',
        paramCity: {
            position: new AMap.LngLat(116.647219,39.92047), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'tree',
        paramCity: {
            position: new AMap.LngLat(116.647224,39.920403), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'tushuguan',
        paramCity: {
            position: new AMap.LngLat(116.647226,39.920474), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'xuesheng01',
        paramCity: {
            position: new AMap.LngLat(116.647273,39.920418), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'xuesheng02',
        paramCity: {
            position: new AMap.LngLat(116.647175,39.920417), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'xuesheng01',
        paramCity: {
            position: new AMap.LngLat(116.647278,39.921155), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'xuesheng02',
        paramCity: {
            position: new AMap.LngLat(116.647186,39.921155), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'xuesheng05',
        paramCity: {
            position: new AMap.LngLat(116.647169,39.920417), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    },
    {
        name: 'jiashulounan',
        paramCity: {
            position: new AMap.LngLat(116.647267,39.9205), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }, 
    {
        name: 'xueshengzhongxin',
        paramCity: {
            position: new AMap.LngLat(116.647265,39.920376), // 必须
            scale: 70, // 非必须，默认1
            height: 0,  // 非必须，默认0
            scene: 0, // 非必须，默认0
        }
    }
]
map.plugin(["AMap.GltfLoader"], function () {
    var gltfObj = new AMap.GltfLoader();
    gltf.forEach(item => {
        gltfObj.load(`http://47.92.118.208:8081/school/${item.name}/${item.name}.gltf`, function (gltfCity) {
            gltfCity.setOption(item.paramCity);
            gltfCity.rotateX(-90);
            gltfCity.rotateY(-180);
            gltfCity.rotateZ(-180);
            object3Dlayer.add(gltfCity);
        });
    })
});
// 地图定位
function geolocation () {
    map.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
}
function onComplete(data) {
    initCenter = data.position.split(',');
    // alert('定位成功')
    // var str = [];
    // str.push('定位结果：' + data.position);
    // str.push('定位类别：' + data.location_type);
    // if(data.accuracy){
    //      str.push('精度：' + data.accuracy + ' 米');
    // }//如为IP精确定位结果则没有精度信息
    // str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
    // document.getElementById('result').innerHTML = str.join('<br>');
}
//解析定位错误信息
function onError(data) {
    // console.log(data)
    // alert('定位失败')
    // document.getElementById('status').innerHTML='定位失败'
    // document.getElementById('result').innerHTML = '失败原因排查信息:'+data.message;
}
$(".service").click(function(){
    $(".service-container").show();
    $(".container").show();
    map.clearMap();
});
$(".service-container").click(function() {
    $(this).hide();
    $(".container").hide();
})
// 服务中心
$(".activity-title").click(function() {
    const index = $(this).parent('.activity').attr('data-index');
    const flag = $(this).parent('.activity').attr('data-flag');
    $.ajax({ 
        url: `http://47.92.118.208/school-map/serviceInfo/getByType?type=${index}`, 
        success: function(res){
            console.log('校园服务中心',res)
            if(res.code == 200) {
                const schoolList = res.data;
                $('.open:eq('+ index +')').html('')
                schoolList.forEach((item, ind) => {
                    let str = '';
                    if( item.positions.length > 1 ) {
                        console.log(item);
                        item.positions.forEach(items => {
                            str += `
                            <div class="place" data-center="${items.center}">
                                ${items.title}
                            </div>
                            `
                        })
                    }
                    if(index == 2) {
                        $('.open:eq('+ index +')').append(
                            `
                            <div class="open-con" data-center="${item.description}">
                                 <p class="open-title">${item.title}</p>
                             </div>
                            `
                        ) 
                    } else if(index == 3) {
                        $('.open:eq('+ index +')').append(
                            `
                            <div class="open-con" data-flag="true" style="font-size: .24rem">
                                 ${item.description}
                             </div>
                            `
                        ) 
                    }else {
                        $('.open:eq('+ index +')').append(
                            `
                            <div class="open-con" data-flag="true">
                                 <p class="open-title">${item.title}</p>
                                 <div class="small-open">
                                     <div class="small-small">
                                         ${str ? str : item.description}
                                     </div>
                                 </div>
                             </div>
                            `
                        ) 
                    }

                });
                
                $('.activity').animate({
                    height: '1rem', 
                },1000)
                $('.activity').attr('data-flag', 'true')
                if(flag == "true") {
                    var length =  $('.activity:eq('+ index +')').find('.open-con').length + 1 || 1;
                    $('.activity:eq('+ index +')').animate({
                        height: length * 2.1 + 'rem', 
                    },1000)
                    $('.activity:eq('+ index +')').attr('data-flag', 'flase')
                }
                $('.open-con').animate({
                    height: '1rem', 
                },1000)
                $('.open-con').attr('data-flag', 'true')
                // 底下菜单切换
                $(".open-title").click(function() {
                    const center = $(this).parent('.open-con').attr('data-center');
                    if(center) {
                        $(".service-container").hide();
                        $(".container").hide();
                        const endCenterArr = center.split(',');
                        walk([116.648432,39.92166], endCenterArr, name, true)
                    }else {
                        var flag = $(this).parent('.open-con').attr('data-flag');
                        $('.open-con').animate({
                            height: '1rem', 
                        },1000)
                        $('.open-con').attr('data-flag', 'true')
                        if(flag == "true") {
                            $(this).parent('.open-con').animate({
                                height: '4rem', 
                            },1000)
                            $(this).parent('.open-con').attr('data-flag', 'flase')
                            $(this).parent('.open-con').siblings('.open-con').animate({
                                height: '1rem', 
                            },1000)
                        }
                        $('.place').click(function(){
                            const center = $(this).attr('data-center');
                            $(".service-container").hide();
                            $(".container").hide();
                            const endCenterArr = center.split(',');
                            walk([116.648432,39.92166], endCenterArr, name, true)
                        })                        
                    }
                })
            }
        }
    });      
})
// 导航
$('.daohang').click(function () {
    $('.distance').hide()
    geolocation();
    walk(initCenter, endPosition, name, true, true);
    setInterval(() => {
        geolocation();
        walk(initCenter, endPosition, name, true, true);
    }, 3000);
})