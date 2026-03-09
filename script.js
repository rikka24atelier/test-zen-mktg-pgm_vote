// 動きのきっかけとなるアニメーションの名前を定義
function fadeUpAnime(){

    // ふわっ
    $('.fadeUpTrigger').each(function(){ //fadeInUpTriggerというクラス名が
        var elemPos = $(this).offset().top-0; //要素より、50px上の
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll >= elemPos - windowHeight){
        $(this).addClass('fadeUp');
        // 画面内に入ったらfadeInというクラス名を追記
        }
        // else{
        // $(this).removeClass('fadeUp');
        // // 画面外に出たらfadeInというクラス名を外す
        // }
        });
    }
  
  // 画面をスクロールをしたら動かしたい場合の記述
    $(window).scroll(function (){
      fadeUpAnime();/* アニメーション用の関数を呼ぶ*/
    });// ここまで画面をスクロールをしたら動かしたい場合の記述
  
  // 画面が読み込まれたらすぐに動かしたい場合の記述
    $(window).on('load', function(){
      fadeUpAnime();/* アニメーション用の関数を呼ぶ*/
    });// ここまで画面が読み込まれたらすぐに動かしたい場合の記述


    function fadeLeftAnime () {
         $('.fadeLeftTrigger').each(function(){ //fadeInUpTriggerというクラス名が
        var elemPos = $(this).offset().top-0; //要素より、50px上の
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll >= elemPos - windowHeight){
        $(this).addClass('fadeLeft');
        // 画面内に入ったらfadeInというクラス名を追記
        }
        // else{
        // $(this).removeClass('fadeLeft');
        // // 画面外に出たらfadeInというクラス名を外す
        // }
        });
    }
     // 画面をスクロールをしたら動かしたい場合の記述
     $(window).scroll(function (){
        fadeLeftAnime();/* アニメーション用の関数を呼ぶ*/
      });// ここまで画面をスクロールをしたら動かしたい場合の記述
    
    // 画面が読み込まれたらすぐに動かしたい場合の記述
      $(window).on('load', function(){
        fadeLeftAnime();/* アニメーション用の関数を呼ぶ*/
      });// ここまで画面が読み込まれたらすぐに動かしたい場合の記述