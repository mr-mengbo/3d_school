import '../style/index';
import '../style/style';
// import '../utils/selfAdaption';
import $ from 'jquery';
console.log($)
var map = new AMap.Map("container", {
    viewMode:'3D',
    pitch:45,
    rotation: -135,
    zoom: 18,
    zooms:[16,20],
    showBuildingBlock: false, // 设置地图显示3D楼块效果，移动端也可使用。推荐使用。
    showLabel: false,
    center: [116.647295,39.920426],
    // mapStyle: 'amap://styles/macaron',
    showIndoorMap: false,
    forceVector:true,
});
// 当前示例的目标是展示如何根据规划结果绘制路线，因此walkOption为空对象
var walkingOption = {}

// 步行导航
var walking = new AMap.Walking(walkingOption)
//根据起终点坐标规划步行路线
walking.search([116.648432,39.92166], [116.644967,39.919488], function(status, result) {
    // result即是对应的步行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_WalkingResult
    if (status === 'complete') {
        if (result.routes && result.routes.length) {
            drawRoute(result.routes[0])
            // log.success('绘制步行路线完成')
        }
    } else {
        console.log(result)
        // log.error('步行路线数据查询失败' + result)
    } 
});

function drawRoute (route) {
    var path = parseRouteToPath(route)

    var startMarker = new AMap.Marker({
        position: path[0],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        map: map
    })

    var endMarker = new AMap.Marker({
        position: path[path.length - 1],
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        map: map
    })

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
    map.setFitView([ startMarker, endMarker, routeLine ])
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
// 创建Object3DLayer图层
// var object3Dlayer = new AMap.Object3DLayer();
// map.add(object3Dlayer);

// map.plugin(["AMap.GltfLoader"], function () {
//     var paramCity = {
//         position: new AMap.LngLat(116.64414,39.919299), // 必须
//         scale: 8.5, // 非必须，默认1
//         height: 70,  // 非必须，默认0
//         scene: 0, // 非必须，默认0
//     };


//     var gltfObj = new AMap.GltfLoader();

//     gltfObj.load('./static/school/school.gltf', function (gltfCity) {
//         gltfCity.setOption(paramCity);
//         gltfCity.rotateX(-90);
//         gltfCity.rotateY(-180);
//         gltfCity.rotateZ(-180);
//         object3Dlayer.add(gltfCity);
//     });

// });   