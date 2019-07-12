import '../style/style';
import '../style/panoramaContainer';
import $ from 'jquery';
import { equal } from 'assert';
$('.item').click(function() {
  var index = $(this).attr('data-index');
  $('.abroad').hide()
  $('.abroad:eq('+ index +')').show();
})