//準備youtube api
function init() {
    gapi.client.setApiKey("AIzaSyDGw-z8dCUPIXp_8-rJ3dME9ktJvebrl5o");
    gapi.client.load("youtube", "v3", function () {
        // yt api is ready
    })
}

//搜尋按鈕按下時
function searchOnClick() {
    var videoname = document.getElementById("search-text").value;
    search(videoname);
}

//搜索影片並拿回影片資料json再處理
function search(name) {
    var url =
        "https://www.googleapis.com/youtube/v3/search" + //google search api
        "?id=7lCDEYXw3mM" + //影片id
        "&key=AIzaSyDGw-z8dCUPIXp_8-rJ3dME9ktJvebrl5o" + //youtube api 金鑰
        "&part=snippet" + //api要求的我也不知道
        "&type=video" + //搜尋結果要是什麼 有video,playlist,channel
        "&videoCaption=closedCaption" + //只搜尋有標題的影片
        "&maxResults=12"; //最多回傳資料 ６筆
    console.log("name = " + name);
    url += "&q=" + name.toString(); //這邊是把你要搜尋的名稱改成我們要搜尋的方式 "&q = 我們搜尋的keyword"

    console.log(url);

    fetch(url, {
            method: 'get'
        })
        .then(function (response) {
            response.json().then(
                function (data) {
                    //每次搜尋完都要先把之前的搜索紀錄清掉 在改變主影片的標題 
                    //再把主影片改成我們搜索中最符合的第一個

                    clearPlayListElement(); //清空之前的搜索紀錄

                    changeMainVideoTitle(data.items[0]); //改變主影片的標題

                    for (item in data.items) { //總共拿到六個影片 把每一個都用createPlayListElement 建立出一個元件
                        createPlayListElement(data.items[item]);
                        //console.log(data.items[item]);
                        // console.log(data.items[item].id.videoId);
                    }
                    //把主影片改成搜尋結果最符合的第一個
                    socket.emit("message", vedioInfo);
                    changeVideo(data.items[0].id.videoId);

                }
            )
        }).catch(function (err) {
            console.log('error')
        });
}

//改變主影片
function changeVideo(videoID) {
    player.cueVideoById(videoID);
    console.log(videoID);
    vedioInfo.nowPlayingVideoId = videoID;
}
//改變主影片標題
function changeMainVideoTitle(data) {
    console.log("hit");
    //取得dom中的Main-Title物件
    var title = document.getElementById('Main-Title');
    //把內容改成影片的title
    title.innerHTML = data.snippet.title;
}

//建立playlist中的影片元件
//每一個影片元件要有
//.1影片縮圖
//.2影片標題
//.3影片作者
function createPlayListElement(data) {
    //.1影片縮圖
    var imgURL = data.snippet.thumbnails.default.url;

    //.2影片標題
    var titlename = data.snippet.title;
    //console.log(title);

    //.3影片作者
    var channelTitle = data.snippet.channelTitle;
    //console.log(channelTitle);

    //newElement是包住整個影片元件的div
    var newElement = document.createElement('div');

    //img是newElement中來放影片縮圖的元件
    var img = document.createElement('img');

    //設定圖片
    img.src = imgURL;

    //設定標題
    var title = document.createElement('p');
    title.innerHTML = titlename;
    title.classList = "title";

    //設定作者
    var creater = document.createElement('p');
    creater.innerHTML = "作者:" + channelTitle;
    creater.classList = "creater";

    //幫newElement 加上css class
    newElement.classList = "ListVideo";

    //把影片縮圖 標題 作者 一一append到newElement上
    newElement.appendChild(img);
    newElement.appendChild(title);
    newElement.appendChild(creater);

    //幫每一個newElement加上onclick function 讓我們案下面的影片時 可以改變主影片的播放內容 跟 標題
    newElement.onclick = function () {
        //改主影片的播放標題
        changeMainVideoTitle(data)
        //改主影片的播放內容
        changeVideo(data.id.videoId);

    }
    document.getElementById('playList').appendChild(newElement);


}

//清空搜索紀錄
//就是把之前append到playList中的element都清空
function clearPlayListElement() {
    var PlayList = document.getElementById("playList");
    while (PlayList.firstChild) {
        PlayList.removeChild(PlayList.firstChild);
    }

}