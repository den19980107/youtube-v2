var socket = io();
var vedioInfo = {
    state: 0, //1 = play 0 = pause
    time: 0,
    nowPlayingVideoId: 'rvWYBE_QO-E'
}

function pageReady() {
    console.log("ready");
    console.log(player.b.b.videoId);
    player.playVideo();

    var playbtn = document.getElementById('playbtn');
    var slider = document.getElementById('slider');
    var timelong = player.getDuration();
    var vtime;

    playbtn.onclick = function playOnClick() {
        if (this.innerHTML == "播放") {
            this.innerHTML = "暫停";
            player.playVideo();
            timelong = player.getDuration();
            vedioInfo.state = 1;
            vedioInfo.time = vtime;
            socket.emit("message", vedioInfo);
            console.log("1");

        } else {
            this.innerHTML = "播放";
            player.pauseVideo();
            vedioInfo.state = 0;
            vedioInfo.time = vtime;

            socket.emit("message", vedioInfo);

        }


    }
    slider.onchange = function sliderOnChange() {
        // console.log(player);
        // console.log(this.value);
        //要把0~100的值轉變到0～影片長度
        vtime = (slider.value / 100) * timelong;
        player.seekTo(vtime); //seekTo把影片拖到指定的時機點
        vedioInfo.time = vtime;
        socket.emit("message", vedioInfo);

    }

    getTime = function () {
        var playbarTime = document.getElementById('time');
        vtime = player.getCurrentTime();
        if (!isNaN(vtime)) {
            time.innerHTML = vtime.toFixed(2);
        }
        var nowTime = (player.getCurrentTime() / timelong) * 100; //取得目前時間
        //console.log(nowTime);
        slider.value = nowTime; //將目前間設定到slider上
        cheackVideoState();
    }
    setInterval("getTime()", "100"); //每隔1秒呼叫getTime一次

}

function cheackVideoState() {
    //console.log(player.getPlayerState());

    if (player.getPlayerState() == 1) {
        document.getElementById('playbtn').innerHTML = "暫停";
    }
    if (player.getPlayerState() == 2) {
        document.getElementById('playbtn').innerHTML = "播放";
    }
}

//listen for events
socket.on('message', function (newinfo) {
    console.log("new");
    console.log(newinfo);
    console.log("old");
    console.log(vedioInfo);

    if (vedioInfo.nowPlayingVideoId != newinfo.nowPlayingVideoId) {
        changeVideo(newinfo.nowPlayingVideoId);

    }
    vedioInfo = newinfo;

    if (newinfo.state == 0) { //vedio stop
        player.pauseVideo();
    }
    if (newinfo.state == 1) { //vedio play
        player.playVideo();
    }
    player.seekTo(newinfo.time);
    console.log("is emit");


});


//listen for events