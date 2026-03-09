////////////////////////////////////////////////////
// UA判定 //
////////////////////////////////////////////////////
var userAgent = navigator.userAgent;
var userWAgent = window.navigator.userAgent.toLowerCase();

var UA_Android = (userAgent.indexOf('Android') > -1)? true:false;
var UA_Android_version = parseFloat(userAgent.slice(userAgent.indexOf('Android')+8, userAgent.indexOf('Android')+11),10);
var UA_iPhone = (userAgent.indexOf('iPhone') > -1)? true:false;
var UA_iPod = (userAgent.indexOf('iPod') > -1)? true:false;
var UA_iPad = (userAgent.indexOf('iPad') > -1)? true:false;
var UA_IE11 = (userAgent.indexOf('MSIE 11.0') > -1)?true:false;

var UA_SP = false;
var UA_PC = false;
if (navigator.userAgent.indexOf('iPhone') !== -1) {
var UA_SP = true;
}else if (navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mobile') > -1){
var UA_SP = true;
} else if (navigator.userAgent.indexOf('iPad') !== -1) {
var UA_PC = true;
} else if (navigator.userAgent.indexOf('Android') > -1 && navigator.userAgent.indexOf('Mobile') < 0) {
var UA_PC = true;
} else {
var UA_PC = true;
}

var deviceType;
var isFixed = false;
var isfixedParts = false;
var BREAKPOINT1 = 768;
var BREAKPOINT2 = 1024;
var BREAKPOINT3 = 540;

////////////////////////////////////////////////////
// URLからクエリを検索して配列に格納する //
////////////////////////////////////////////////////
var urlQuery = [];
var pair = location.search.substring(1).split('&');
for(var i = 0;pair.length > i;i++) {
  var kv = pair[i].split('=');
  urlQuery[kv[0]]=kv[1];
}

////////////////////////////////////////////////////
// ナビゲーション //
////////////////////////////////////////////////////
if(window.innerWidth > BREAKPOINT2){
  $('.p-header__nav__menu__item.js-menu').hover(function() {
      $(this).children('.p-header__sub__wrapper').stop().fadeIn();
    }, function(){
      $(this).children('.p-header__sub__wrapper').stop().fadeOut();
      return false;
  });
} else {
  $('.p-header__nav__menu__item.js-menu').click(function () {
    $(this).children('.p-header__head').toggleClass('is-act');
    $(this).children('.p-header__sub__wrapper').slideToggle();;
  });
  $('.p-footer__nav__menu__item.js-menu').click(function () {
    $(this).children('.p-footer__head').toggleClass('is-act');
    $(this).children('.p-footer__sub__wrapper').slideToggle();;
  });


  $('.p-header__link').click(function () {
    $('#js-navigation').removeClass('is-act');
    $('.p-header__hamburger').removeClass('is-act');
    $('.p-header__nav').hide();
    $('html, body').css('overflow', 'auto');
  });
}

$('.p-header__hamburger').click(function () {
  $('.p-header__nav, .p-header__nav__wrapper').slideToggle();
  $('.l-header').toggleClass('is-act');

  if($(this).hasClass('is-act')){
    $(this).removeClass('is-act');
    $('html, body').css('overflow', 'auto');
  } else {
    $(this).addClass('is-act');
    $('html, body').css('overflow', 'hidden');
  }
});

////////////////////////////////////////////////////
// スムーススクロール //
////////////////////////////////////////////////////
// smoothScroll();
// function smoothScroll(){
//   $('a[href^="#"]').not('.js-modal').click(function() {
//   var hH =  $('.l-header').outerHeight();
//   var speed = 350;
//   var href= $(this).attr("href");
//   var target = $(href == "#" || href == "" ? 'html' : href);
//   var position = target.offset().top - hH;

//   $('body, html').animate({scrollTop:position}, speed, 'swing');
//   return false;
//   });
// };

////////////////////////////////////////////////////
// 追従パーツ //
////////////////////////////////////////////////////
var fixedParts = $('#js-pagetop, #js-fixed-banner');
var pagetop = $('#js-pagetop')
var pagetopH = pagetop.height();
var ctaBnr = $('#js-fixed-banner');
var navigation = $('#js-navigation')

$(window).on('scroll', function() {
  // if ($(this).scrollTop() > 100) {
    fixedParts.fadeIn();
    navigation.addClass('is-scrolling');
  // } else {
  //   fixedParts.fadeOut();
  //   navigation.removeClass('is-scrolling');
  // }

  scrollHeight = $(document).height();
  scrollPosition = $(window).height() + $(window).scrollTop();
  footHeight = $('.l-footer').innerHeight();

  if ( scrollHeight - scrollPosition  <= footHeight ) {
    fixedParts.css({
      "position":"absolute",
    });
    pagetop.css({
      "bottom":"0",
      "top":"-66px"
    });
    ctaBnr.css({
      "bottom": footHeight + pagetopH + 40
    });
  } else if (window.innerWidth <= BREAKPOINT3) {
    fixedParts.css({
      "position":"fixed",
    });
    pagetop.css({
      "top":"auto",
      "bottom": "20px"
    });
    ctaBnr.css({
      "bottom": pagetopH + 100
    });
  } else if (window.innerWidth <= BREAKPOINT1) {
    fixedParts.css({
      "position":"fixed",
    });
    pagetop.css({
      "top":"auto",
      "bottom": "105px"
    });
    ctaBnr.css({
      "bottom": pagetopH + 135
    });
  } else {
    fixedParts.css({
      "position":"fixed",
    });
    pagetop.css({
      "top":"auto",
      "bottom": "20px"
    });
    ctaBnr.css({
      "bottom": pagetopH + 40
    });
  }

  //SP時のフッター追従CTA
  if(BREAKPOINT2 > window.innerWidth) {
    fixedC = $('#js-cta-fixed');
    if(fixedC.length > 0){
      if ( scrollHeight - scrollPosition  <= footHeight ) {
        fixedC.fadeOut();
      } else {
        fixedC.fadeIn();
      }
    }
  }
});

$('#js-fixed-banner-close').click(function() {
  ctaBnr.addClass('is-hide');
  setTimeout(function(){
    ctaBnr.remove();
  }, 550);
});

////////////////////////////////////////////////////
// サイドメニュー アコーディオン //
////////////////////////////////////////////////////
$('.c-info__archive__sub__head.js-menu').click(function () {
  $(this).toggleClass('is-act');
  $(this).next('.c-info__archive__sub__wrapper').slideToggle();;
});

////////////////////////////////////////////////////
// モーダル //
////////////////////////////////////////////////////
$('.js-modal').on('click',function() {
  var target = $(this).attr('data-target');
  $('#'+target).fadeIn();
  $('html').css({'cssText': 'overflow: hidden !important;'});
});

function closeModal(){
  $('.c-modal__container').fadeOut();
  $('html').css('overflow', 'auto');
  $('.c-modal__inner').find('.c-modal__video').empty();
}

$('.js-modal-close').on('click',function() {
  closeModal();
});

$(document).on('click','.js-modal-video',function(){
  var mvId = $(this).attr('data-mvId');
  if(mvId !== ''){
   var iframe = '<iframe frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" width="640" height="390" src="https://www.youtube.com/embed/' + mvId + '?rel=0&amp;modestbranding=1&amp;enablejsapi=1" style="display: inline;"></iframe>';
   $('.c-modal__inner').find('.c-modal__video').append(iframe);
  }
});

$('.c-modal__inner').on('click',function(event){
  event.stopPropagation();
});

$('.js-category').on('click',function() {
  var target = $(this).attr('data-target');
  $('.c-info__category__label__wrapper').fadeIn();
  $('.c-pagetop, .c-cta__fixed').addClass('is-hide');
  $('html').css({'cssText': 'overflow: hidden !important;'});
});

$('.js-category-close').on('click',function() {
  $('.c-info__category__label__wrapper').fadeOut();
  $('.c-pagetop, .c-cta__fixed').removeClass('is-hide');
  $('html').css('overflow', 'auto');
});

////////////////////////////////////////////////////
// //デバイスの向きが切り替わったら再読み込み //
////////////////////////////////////////////////////
$(window).on("orientationchange", function() {
  var timer = false;
  var prewidth = $(window).width();

  if (timer !== false) {
    clearTimeout(timer);
  }
  timer = setTimeout(function() {
    var nowWidth = $(window).width();
    if(prewidth !== nowWidth){
      location.reload();
    }
    prewidth = nowWidth;
  }, 200);
});

////////////////////////////////////////////////////
// CMSシェア //
////////////////////////////////////////////////////
var url = location.href;
var title = $('title').html();

// Twitter
var text = encodeURIComponent(title);
// var tweet_url = 'http://twitter.com/share?url=' + url + '&text=' + text;
var tweet_url = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text;
$('#js-share-tw').attr("href", tweet_url);

// Facebook
var text = encodeURIComponent(title);
// var facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
var facebook_url = 'https://www.facebook.com/sharer/sharer.php?u=' + url + '&t=' + text;
$('#js-share-fb').attr("href", facebook_url);

// LINE
// $('#js-share-ln').off('click');
// $('#js-share-ln').on('click', function(){
//   var message = title + ' ' + url;
//   var shareLink = 'http://line.me/R/msg/text/?' + encodeURIComponent(message);
//   window.open(shareLink, '_blank');
// });

var line_url = 'https://line.me/R/share?text=' + encodeURIComponent(title + ' ' + url);
$('#js-share-ln').attr("href", line_url);

$(function () {
  $('[data-start], [data-end]').each(function () {
    let startDateString = $(this).data('start');
    let startDate = new Date(startDateString);
    let endDateString = $(this).data('end');
    let endDate = new Date(endDateString);

    if ((!isNaN(startDate) && new Date() < startDate) || (!isNaN(endDate) && new Date() > endDate)) {
      $(this).remove();
    }
  });
});
