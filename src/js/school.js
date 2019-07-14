import '../style/style';
import '../style/school';
import { GetQueryString, fuzzyQuery } from '../utils/util';
import $ from 'jquery';
$('.item').click(function () {
    var index = $(this).attr('data-index');
    var length =  $('.activity:eq('+ index +')').find('.open-con').length + 1 || 1;
    console.log($('.activity:eq('+ index +')'))
    $('.activity').animate({
        height: '1rem', 
    },1000)
    $('.activity').attr('data-flag', 'true')
    $('.activity:eq('+ index +')').animate({
        height: length * 1.06 + 'rem', 
    },1000)
    $('.activity:eq('+ index +')').attr('data-flag', 'flase')
});
$(".activity-title").click(function() {
    var flag = $(this).parent('.activity').attr('data-flag');
    $('.activity').animate({
        height: '1rem', 
    },1000)
    $('.activity').attr('data-flag', 'true')
    if(flag == "true") {
        var length = $(this).next(".open").find('.open-con').length + 1 || 1;
        $(this).parent('.activity').animate({
            height: length * 2.1 + 'rem', 
        },1000)
        $(this).parent('.activity').attr('data-flag', 'flase')
    }
    $('.open-con').animate({
        height: '1rem', 
    },1000)
    $('.open-con').attr('data-flag', 'true')
})
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