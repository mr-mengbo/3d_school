import '../style/roam';
import '../style/style';
import { GetQueryString, fuzzyQuery } from '../utils/util';
import $ from 'jquery';
const player = new ChimeePlayer({
    wrapper: '#wrapper',  // video dom容器
    src: 'http://47.92.118.208:8081/video/整体录屏.mp4',
    controls: false,
    autoplay: true,
});
const videoList = [
    {
        name: "学校北门",
        video: "http://47.92.118.208:8081/video/学校北门.mp4"
    },
    {
        name: "电教馆",
        video: "http://47.92.118.208:8081/video/电教馆.mp4"
    },
    {
        name: "6号学生公寓",
        video: "http://47.92.118.208:8081/video/6号学生公寓.mp4"
    },
    {
        name: "体育场",
        video: "http://47.92.118.208:8081/video/体育场.mp4"
    },
    {
        name: "中心食堂",
        video: "http://47.92.118.208:8081/video/5号公寓和中心食堂.mp4"
    },
    {
        name: "会议楼",
        video: "http://47.92.118.208:8081/video/会议楼.mp4"
    },
    {
        name: "教学楼",
        video: "http://47.92.118.208:8081/video/教学楼.mp4"
    },
    {
        name: "1号学生公寓",
        video: "http://47.92.118.208:8081/video/1号和2号公寓.mp4"
    },
    {
        name: "2号学生公寓",
        video: "http://47.92.118.208:8081/video/1号和2号公寓.mp4"
    },
    {
        name: "3号学生公寓",
        video: "http://47.92.118.208:8081/video/3号和4号公寓.mp4"
    },
    {
        name: "4号学生公寓",
        video: "http://47.92.118.208:8081/video/3号和4号公寓.mp4"
    },
    {
        name: "学生中心",
        video: "http://47.92.118.208:8081/video/学生中心.mp4"
    },
    {
        name: "国际教育学院",
        video: "http://47.92.118.208:8081/video/国际教育学院.mp4"
    },
    {
        name: "文化广场",
        video: "http://47.92.118.208:8081/video/文化广场.mp4"
    },
    {
        name: "运河微缩景观（西）",
        video: "http://47.92.118.208:8081/video/运河微缩景观（西）.mp4"
    },
    {
        name: "运河微缩景观（东）",
        video: "http://47.92.118.208:8081/video/运河微缩景观（东）.mp4"
    },
    {
        name: "两岸水吧",
        video: "http://47.92.118.208:8081/video/两岸水吧.mp4"
    },
    {
        name: "办公楼",
        video: "http://47.92.118.208:8081/video/办公楼.mp4"
    },
    {
        name: "商苑",
        video: "http://47.92.118.208:8081/video/商苑.mp4"
    },
    {
        name: "篮球场",
        video: "http://47.92.118.208:8081/video/篮球场.mp4"
    },
    {
        name: "潘序伦铜像",
        video: "http://47.92.118.208:8081/video/图书馆和潘序伦铜像.mp4"
    }
]
videoList.forEach(item => {
    $('.video-list').append(
        `
            <div class="video-item" data-video="${item.video}">${item.name}</div>
        `
    )
})
$('.video-item').click(function () {
    const url = $(this).attr('data-video');
    console.log(url)
    player.load(url);
})

setRem();
window.addEventListener("onorientationchange" in window ? "orientationchange":"resize",function(){
    setRem();
});
function setRem(){
    var html = document.querySelector("html");
    var width = html.getBoundingClientRect().width;
    var height = html.getBoundingClientRect().height;
    //判断横屏
    if(width < height){
        //竖屏
        html.style.fontSize = height/16 +"px";
    };
    if(width > height){
        //横屏
        html.style.fontSize = width/16 +"px";
    }
    
}