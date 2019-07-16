import '../style/style';
import '../style/school';
import { GetQueryString, fuzzyQuery } from '../utils/util';
import $ from 'jquery';

$('.item').click(function () {
    const index = $(this).attr('data-index')
    $.ajax({ 
        url: `http://47.92.118.208/school-map/schoolInfo/getByType?type=${index}`, 
        success: function(res){
            console.log('校园查询',res)
            if(res.code == 200) {
                const schoolList = res.data;
                $('.open:eq('+ index +')').html('')
                schoolList.forEach(item => {
                    let str = '';
                    if(index == 2) {
                         str = `
                        <div class="small-btn">
                            <a class="dingwei">定位</a>
                            <a class="tuji" src="./photo.html">图集</a>
                        </div>
                        ` 
                    }
                   $('.open:eq('+ index +')').append(
                       `
                       <div class="open-con" data-flag="true">
                            <p class="open-title">${item.title}</p>
                            <div class="small-open">
                                <div class="small-small">
                                    ${item.description}
                                </div>
                            </div>
                            ${str}
                        </div>
                       `
                   ) 
                });
                var length =  $('.activity:eq('+ index +')').find('.open-con').length + 1 || 1;
                $('.activity').animate({
                    height: '1rem', 
                },1000)
                $('.activity').attr('data-flag', 'true')
                $('.activity:eq('+ index +')').animate({
                    height: length * 2.1 + 'rem', 
                },1000)
                $('.activity:eq('+ index +')').attr('data-flag', 'flase')
                // 底下菜单切换
                $(".open-title").click(function() {
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
                })
                $('.tuji').click(function () {
                    $('.photo-container').show();
                    $('.photo').show();
                })
            }
        }
    });    
});
$(".activity-title").click(function() {
    const index = $(this).parent('.activity').attr('data-index');
    const flag = $(this).parent('.activity').attr('data-flag');
    $.ajax({ 
        url: `http://47.92.118.208/school-map/schoolInfo/getByType?type=${index}`, 
        success: function(res){
            console.log('校园查询',res)
            if(res.code == 200) {
                const schoolList = res.data;
                $('.open:eq('+ index +')').html('')
                schoolList.forEach(item => {
                    let str = '';
                    if(index == 2) {
                         str = `
                        <div class="small-btn">
                            <a class="dingwei">定位</a>
                            <a class="tuji" src="./photo.html">图集</a>
                        </div>
                        ` 
                    }
                   $('.open:eq('+ index +')').append(
                       `
                       <div class="open-con" data-flag="true">
                            <p class="open-title">${item.title}</p>
                            <div class="small-open">
                                <div class="small-small">
                                    ${item.description}
                                </div>
                            </div>
                            ${str}
                        </div>
                       `
                   ) 
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
                })
                $('.tuji').click(function () {
                    $('.photo-container').show();
                    $('.photo').show();
                })
            }
        }
    });      
})

let index = 0;
const length = $('.fengguang').length;
$('.left').click(function () {
    index--;
    if(index < 0) {
        index = 0;
        return false;
    }
    $('.fengguang').hide();
    $('.fengguang:eq('+ index +')').show();
})
$('.right').click(function () {
    index++;
    if(index >= length) {
        index = length - 1;
        return false;
    }
    $('.fengguang').hide();
    $('.fengguang:eq('+ index +')').show();
})
$('.photo-container').click(function () {
    $('.photo-container').hide();
    $('.photo').hide();
})