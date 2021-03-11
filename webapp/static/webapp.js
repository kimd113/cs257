//Daniel Kim, Harry Tian

window.onload = initialize;
console.log("loading");

/////////////////////////// GLOABL VARIABLES ///////////////////////////
let videos_list = [];
let videos_list_total_number = 0;
let videos_list_current_page = 0;
let isHorizontalView = true;

// user information
let logged_in = false;
let logged_in_user = "";
let user_info = [];

let video_id = "";

function initialize() {
    // console.log(videos_list);
    // console.log("when initialize :", logged_in_user);

    getVideosListInMainPage();

    loadYearList();

    // updateButtons();// this doesn't work.. it's not remembered when page refreshes

    let elementPrevButton = document.getElementById('prev_button');
    if (elementPrevButton) {
        elementPrevButton.onclick = onPrevVideosButton;
    }

    let elementNextButton = document.getElementById('next_button');
    if (elementNextButton) {
        elementNextButton.onclick = onNextVideosButton;
    }

    let searchButton = document.getElementById('search_trending_time_button');
    if (searchButton) {
        searchButton.onclick = onSearchButton;
    }

    let signUpButton = document.getElementById('signUp');
    if (signUpButton) {
        signUpButton.onclick = onSignUpButton;
    }

    let logInButton = document.getElementById('logIn');
    if (logInButton) {
        logInButton.onclick = onLogInButton;
    }

    let verticalButton = document.getElementById('vertical');
    if (verticalButton) {
        verticalButton.onclick = onVerticalViewButton;
    }

    let horizontalButton = document.getElementById('horizontal');
    if (horizontalButton) {
        horizontalButton.onclick = onHorizontalViewButton;
    }

    let signUpSubmitButton = document.getElementById("sign-up-submit"); 
    if (signUpSubmitButton) {
        signUpSubmitButton.onclick = onSignUpSubmitButton;
    }

    let logInSubmitButton = document.getElementById("log-in-submit"); 
    if (logInSubmitButton) {
        logInSubmitButton.onclick = onLogInSubmitButton;
    }
    
    let logOutButton = document.getElementById("logOut"); 
    if (logOutButton) {
        logOutButton.onclick = onLogOutButton;
    }
    
    let createPlaylistSubmitButton = document.getElementById('create-playlist-submit');
    if (createPlaylistSubmitButton) {
        createPlaylistSubmitButton.onclick = onCreatePlaylistSubmitButton;
    }

    let saveToPlaylistSubmitButton = document.getElementById('save-to-submit');
    if (saveToPlaylistSubmitButton) {
        saveToPlaylistSubmitButton.onclick = onSaveToPlaylistSubmitButton;
    }
}

/////////////////////////// VIDEO LIST FUNCTIONS ///////////////////////////
function renderHorizontalVideosList(page_count) {
    /**
     * return: an array of strings of tags, which renders the list of videos in horizontal view.
     */
    let listBodyFirstRow = '';
    let listBodySecondRow = '';

    for (let i = page_count; i < page_count + 10; i++) {
        if (videos_list[i]) {
            let video = videos_list[i];
            let listBody = `<div class="now_trending_videos_list_item col card" id="${video.title}">
                <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                    <img class="video_img card-img-top" src=${video.thumbnail_link} alt="" />
                    <div class="video_title">${video.title}</div>
                </a>
                    <div class="video_channel">${video.channel}</div>
                    <div class="video_list_item_text">
                        <span class="video_views">
                        <img src="../static/imgs/eye.png" width="15px" height="15px" alt="eye">
                        ${video.views}</span>
                        <span class="video_likes">
                        <img src="../static/imgs/like.png" width="15px" height="15px" alt="like">
                        ${video.likes} </span>
                        <span class="video_dislikes">
                        <img src="../static/imgs/dislike.png" width="15px" height="15px" alt="dislike">
                        ${video.dislikes}</span>
                    </div>
                    <button class="save_to_playlist_button btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#saveToPlaylistModal">Save to my playlist</button>
                </div>`;
            if (i < page_count + 5 ) {
                listBodyFirstRow += listBody;
            } else {
                listBodySecondRow += listBody;
            }
        }
    }

    return [listBodyFirstRow, listBodySecondRow];
}

function renderVerticalVideosList(page_count) {
    /**
     * return: an array of strings of tags, which renders the list of videos in vertical view.
     */
    let listBody = '';
    for (let i = page_count; i < page_count + 10; i++) {
        if (videos_list[i]) {
            let video = videos_list[i];
            const { publish_time } = video
            listBody += 
                `<tr>
                    <td><a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">${video.title}</a></td>
                    <td>${video.channel}</td>
                    <td>${publish_time.substring(0,4)}/${publish_time.substring(5,7)}/${publish_time.substring(8,10)}</td>
                    <td>${video.views}</td>
                    <td>${video.likes}</td>
                    <td>${video.dislikes}</td>
                    <td>${video.comment_count}</td>
                    <td class="td_playlist_button">
                        <button class="save_to_playlist_button btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#saveToPlaylistModal">Save to my playlist</button>
                    </td>
                </tr>`;
        }
    }

    return listBody;
}

function getVideosListInMainPage() {
    /**
     * When user enters the main page, send request to the server and get the list of trending videos.
     */
    let url =  getAPIBaseURL();

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((videos) => {
        videos_list = videos;
        videos_list_total_number = videos_list.length;

        let listBodies = renderHorizontalVideosList(0);

        let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
        let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
        if (videosListElementFirstRow) {
            videosListElementFirstRow.innerHTML = listBodies[0];
        }
        if (videosListElementSecondRow) {
            videosListElementSecondRow.innerHTML = listBodies[1];
        }

        onLoadVideoPages();
        let pageItem = document.querySelectorAll(".page-item");
        if (pageItem) {
            pageItem.forEach(function(element) {
                element.onclick = onClickVideoPage;
            });
        }

        let saveToPlaylistButton = document.querySelectorAll(".save_to_playlist_button");
        if (saveToPlaylistButton) {
            saveToPlaylistButton.forEach((element) => {
                element.onclick = onSaveToPlaylistButton;
            })
        }

    })
    .catch(function(error) {
        console.log(error);
    });
}

function onPrevVideosButton() {
    /**
     * When user clicks prev button, render the list of videos that have smaller index number.
     */
    if (videos_list_current_page == 0) {
        alert('This is the first page of videos.');
        return;
    }

    let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
    let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
    let verticalTableBodyElement = document.getElementById("vertical-table-body");
    videosListElementFirstRow.innerHTML = '';
    videosListElementSecondRow.innerHTML = '';

    videos_list_current_page -= 1;
    let prev_page_count = videos_list_current_page * 10;
    
    let currentPageItemElement = document.getElementById(`page-num${videos_list_current_page+2}`);
    currentPageItemElement.classList.remove("active");
    currentPageItemElement = document.getElementById(`page-num${videos_list_current_page+1}`);
    currentPageItemElement.classList.add("active");

    if (isHorizontalView) {
        let listBodies = renderHorizontalVideosList(prev_page_count);
        if (videosListElementFirstRow) {
            videosListElementFirstRow.innerHTML = listBodies[0];
        }
        if (videosListElementSecondRow) {
            videosListElementSecondRow.innerHTML = listBodies[1];
        }
    } else {
        videosListElementFirstRow.innerHTML = '';
        videosListElementSecondRow.innerHTML = '';
        let listBody = renderVerticalVideosList(prev_page_count);
        verticalTableBodyElement.innerHTML = listBody;
    }
}

function onNextVideosButton() {
    /**
     * When user clicks next button, render the list of videos that have smaller index number.
     */
    if (videos_list_current_page == Math.ceil(videos_list_total_number / 10) - 1) {
        alert('This is the last page of videos.');
        return;
    }

    let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
    let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
    let verticalTableBodyElement = document.getElementById("vertical-table-body");
    
    videos_list_current_page += 1;
    let next_page_count = videos_list_current_page * 10;
    
    let currentPageItemElement = document.getElementById(`page-num${videos_list_current_page}`);
    currentPageItemElement.classList.remove("active");
    currentPageItemElement = document.getElementById(`page-num${videos_list_current_page+1}`);
    currentPageItemElement.classList.add("active");
    
    if (isHorizontalView) {
        let listBodies = renderHorizontalVideosList(next_page_count);
        if (videosListElementFirstRow) {
            videosListElementFirstRow.innerHTML = listBodies[0];
        }
        if (videosListElementSecondRow) {
            videosListElementSecondRow.innerHTML = listBodies[1];
        }
    } else {
        videosListElementFirstRow.innerHTML = '';
        videosListElementSecondRow.innerHTML = '';
        let listBody = renderVerticalVideosList(next_page_count);
        verticalTableBodyElement.innerHTML = listBody;
    }
}

function onLoadVideoPages() {
    /**
     * Implement the pagination of the video list.
     */
    let verticalVideosListElement = document.getElementById("vertical-videos-list");
    let videos_list_total_pages = Math.ceil(videos_list_total_number / 10);

    let listBody = '';
    for (let i = 0; i < videos_list_total_pages; i++) {
        (i == 0) ? listBody += `<li id="page-num${i+1}" class="page-item active"><a id="page-link-${i+1}" class="page-link" href="#">${i+1}</a></li>`
        : listBody += `<li id="page-num${i+1}" class="page-item"><a id="page-link-${i+1}" class="page-link" href="#">${i+1}</a></li>`;
    }
 
    verticalVideosListElement.innerHTML = listBody;
}

function onClickVideoPage(event) {
    /**
     * Implement onClick function that navigates to the page clicked and switches the videos.
     */
    let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
    let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
    videosListElementFirstRow.innerHTML = '';
    videosListElementSecondRow.innerHTML = '';
    
    let videos_list_selected_page = parseInt(event.target.id.split('-')[2]) - 1;
    let selected_page_count = videos_list_selected_page * 10;
    
    let currentPageItemElement = document.getElementById(`page-num${videos_list_current_page+1}`);
    currentPageItemElement.classList.remove("active");
    currentPageItemElement = document.getElementById(`page-num${videos_list_selected_page+1}`);
    currentPageItemElement.classList.add("active");

    if (isHorizontalView) {
        let listBodies = renderHorizontalVideosList(selected_page_count);
        if (videosListElementFirstRow) {
            videosListElementFirstRow.innerHTML = listBodies[0];
        }
        if (videosListElementSecondRow) {
            videosListElementSecondRow.innerHTML = listBodies[1];
        }
    } else {
        let verticalTableBodyElement = document.getElementById("vertical-table-body");
        let listBody = renderVerticalVideosList(selected_page_count);
        verticalTableBodyElement.innerHTML = listBody;
    }
    videos_list_current_page = videos_list_selected_page;
}

function onVerticalViewButton() {
    /**
     * Change the view of the list into vertical view.
     */
    let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
    let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
    let verticalTableElement = document.getElementById("vertical-table-box");
    videosListElementFirstRow.innerHTML = '';
    videosListElementSecondRow.innerHTML = '';
    verticalTableElement.style.display = "block";

    let verticalTableBodyElement = document.getElementById("vertical-table-body");
    let listBody = renderVerticalVideosList(videos_list_current_page * 10);
    verticalTableBodyElement.innerHTML = listBody;

    isHorizontalView = false;
}

function onHorizontalViewButton() {
    /**
     * Change the view of the list into vertical view.
     */
    let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
    let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
    let verticalTableElement = document.getElementById("vertical-table-box");
    verticalTableElement.style.display = "none";
    
    let verticalTableBodyElement = document.getElementById("vertical-table-body");
    verticalTableBodyElement.innerHTML = '';

    let listBodies = renderHorizontalVideosList(videos_list_current_page * 10);

    if (videosListElementFirstRow) {
        videosListElementFirstRow.innerHTML = listBodies[0];
    }
    if (videosListElementSecondRow) {
        videosListElementSecondRow.innerHTML = listBodies[1];
    }  

    isHorizontalView = true;
}

/////////////////////////// SEARCH BAR FUNCTIONS ///////////////////////////
function loadYearList() {
    var yearList = document.getElementById('year-list');
    if (yearList) {
        var defaultText = '<option value="" selected="selected">year</option>\n';
        var listBody = defaultText + '<option value="2017">2017</option>\n<option value="2018">2018</option>\n';
        yearList.innerHTML = listBody;
        
        yearList.onchange = function() {
            console.log(this.value);
            loadMonthList(this.value);
        }
    }
}

function loadMonthList(yearSelection) {
    var monthList = document.getElementById('month-list');
    if (monthList) {
        var defaultText = '<option value="" selected="selected">month</option>\n';
        var listBody = defaultText;
        if (yearSelection == '2017') {
            listBody += '<option value="11">11</option>\n<option value="12">12</option>\n';
        } else if (yearSelection == '2018') {
            listBody += '<option value="01">01</option>\n<option value="02">02</option>\n<option value="03">03</option>\n<option value="04">04</option>\n<option value="05">05</option>\n<option value="06">06</option>\n';
        }
        monthList.innerHTML = listBody;

        monthList.onchange = function() {
            console.log(this.value);
            loadDayList(this.value);
        }
    }
}

function loadDayList(monthSelection) {
    var dayList = document.getElementById('day-list');
    if (dayList) {
        var defaultText = '<option value="" selected="selected">day</option>\n';
        var listBody = defaultText;
        if (monthSelection == "11"){
            for (var k=14; k <= 30; k++) {
                listBody += '<option value="' + k + '">' + k + '</option>\n';
            }
        }
        else{
            for (var k=1; k < 10; k++) {
                listBody += '<option value="0' + k + '">0' + k + '</option>\n';
            }
            for (var k=10; k < 15; k++) {
                listBody += '<option value="' + k + '">' + k + '</option>\n';
            }
            if (monthSelection == '01' || monthSelection == '03' || monthSelection == '05' || monthSelection == '12'){
                for (var k=15; k <= 31; k++) {
                    listBody += '<option value="' + k + '">' + k + '</option>\n';
                }
            }
            else if (monthSelection == '04'){
                for (var k=15; k <= 30; k++) {
                    listBody += '<option value="' + k + '">' + k + '</option>\n';
                }
            }
        }

        dayList.innerHTML = listBody;
        dayList.onchange = function() {
            console.log(this.value);
        }
    }
}

function onSearchButton() {
    /**
     * When user enters the main page, send request to the server and get the list of trending videos.
     */

    let input_date = document.getElementById("search_input");
    let search_year = input_date.elements[0].value;
    if (search_year == "2017"){
        search_year = "17";
    }
    else{
        search_year = "18";
    }
    let search_month = input_date.elements[1].value;
    let search_day = input_date.elements[2].value;

    let search_date = search_year + '.' +  search_day + '.' + search_month;
    let url =  `${getAPIBaseURL()}?trending_date=${search_date}`;
    console.log(url);

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((videos) => {
        videos_list_current_page = 0;
        videos_list = videos;

        let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
        let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
        let verticalTableBodyElement = document.getElementById("vertical-table-body");
        if (isHorizontalView) {
            let listBodies = renderHorizontalVideosList(videos_list_current_page);
            if (videosListElementFirstRow) {
                videosListElementFirstRow.innerHTML = listBodies[0];
            }
            if (videosListElementSecondRow) {
                videosListElementSecondRow.innerHTML = listBodies[1];
            }
        } else {
            videosListElementFirstRow.innerHTML = '';
            videosListElementSecondRow.innerHTML = '';
            let listBody = renderVerticalVideosList(videos_list_current_page);
            verticalTableBodyElement.innerHTML = listBody;
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

/////////////////////////// LOG IN FUNCTIONS ///////////////////////////

function onSignUpButton() {
    let msgBox = document.getElementById('signUpMsg');
    msgBox.innerHTML = "Type username to sign up:";

    let myModal = document.getElementById('signUpModal');
    let myInput = document.getElementById('signUp_input');

    myInput.value = "";

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus();
    })
}

function onLogInButton() {
    let msgBox = document.getElementById('logInMsg');
    msgBox.innerHTML = 'Type username to log in:';

    let myModal = document.getElementById('logInModal');
    let myInput = document.getElementById('logIn_input');

    myInput.value = "";

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus();
    })
}

// TODO: add msgbox "are you sure you want to log out?"
function onLogOutButton() {
    logged_in = false;
    logged_in_user = "";
    user_info = [];
    updateButtons();
}

function onSignUpSubmitButton() {
    /**
     * When user clicks the sign up button, create an account for the user if the username is not taken*
     */
    let user_name = document.getElementById("signUp_input"); 
    // let user_name = document.getElementById("signup-password"); 

    let url =  `${getAPIBaseURL()}/sign-up?user_name=${user_name.value}`;

    let msgbox = document.getElementById("signUpMsg");

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((msg) => {
        console.log("Signed in=" + msg);
        if (msgbox){
            if (msg){
                document.getElementById('close-signup-modal').click();
                let alert_box = document.getElementById('alert_box');
                let success_alert = `<p class="alert alert-success alert-dismissible fade show
                position-absolute overflow-visible start-50 translate-middle" role="alert">
                <strong>Thank you, you are signed up! Please log in to continue!</strong>
                <button type="button" id="alert-close" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </p>`;
                alert_box.innerHTML = success_alert;
                setTimeout(() => {
                    if(document.getElementById('alert-close')) {
                        document.getElementById('alert-close').click();
                    }
                }, 2000);
            }
            else{
                msgbox.innerHTML = "This name is already taken";
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function onLogInSubmitButton() {
    /**
     * When user clicks the log in button, checks if the user exists in the database*
     */
    let user_name = document.getElementById("logIn_input").value; 
    // let user_name = document.getElementById("signup-password"); 
    let url =  `${getAPIBaseURL()}/log-in?user_name=${user_name}`;

    let msgbox = document.getElementById("logInMsg");

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((msg) => {
        if (msgbox){
            if (msg){

                logged_in = true;
                logged_in_user = user_name;
                console.log("onLogInSubmitButton");
                updateUserInfo();
                
                document.getElementById('close-login-modal').click();
                let alert_box = document.getElementById('alert_box');
                let success_alert = `<p class="alert alert-success alert-dismissible fade show
                position-absolute overflow-visible start-50 translate-middle" role="alert">
                <strong>Welcome back, ${user_name}!</strong>
                <button type="button" id="alert-close" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </p>`;
                alert_box.innerHTML = success_alert;
                setTimeout(() => {
                    if(document.getElementById('alert-close')) {
                        document.getElementById('alert-close').click();
                    }
                }, 2000);

                updateButtons();
            }
            else{
                msgbox.innerHTML = "User name does not exists, please sign up first";
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

/////////////////////////// PLAYLIST FUNCTIONS ///////////////////////////

function onCreatePlaylistSubmitButton(){
    let playlist_title = document.getElementById("playlist_input").value; 
    let alert_msg = document.getElementById("createPlaylistAlert");

    // check for empty inputs
    if (playlist_title == ""){
        alert_msg.innerHTML = "Playlist name cannot be empty!";
        return;
    }

    // check for duplicate naming
    for(var p in user_info) {
        if (p == playlist_title){
            alert_msg.innerHTML = "Playlist already exists!";
            return;
        }
    }
    
    createPlaylist(playlist_title)
    console.log("onCreatePlaylistSubmitButton");
    updateUserInfo();
}

// TODO: debug
function createPlaylist(playlist_title){
    let url =  `${getAPIBaseURL()}/create-playlist?user_name=${logged_in_user}&playlist_title=${playlist_title}`;

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((msg) => {
        console.log("createPlaylist");
        updateUserInfo();
    })
    .catch(function(error) {
        console.log(error);
    });

    // TODO: maybe a success message that disappears after a fews seconds?
    document.getElementById('close-create-modal').click();

    // Apply new playlist options into dropdown immediately.
    let playlist_select = document.getElementById("playlist-options");
    playlist_select.innerHTML += '<option value="' + playlist_title + '">' + playlist_title + '</option>\n';
}

function onSaveToPlaylistButton() {
    /**
     * render a "save to playlist" modal when the button is clicked.
     */
    if (!logged_in){
        // TODO
        console.log("not logged in yet");
    }
    else{
        video_id = checkId(this);

        let playlist_select = document.getElementById("playlist-options");
        playlist_select.innerHTML = "";
        if (isEmpty(user_info)){
            playlist_select.innerHTML += '<option value="" selected="selected">playlists</option>';
        }
        else{
            for(var playlist_title in user_info) {
                playlist_select.innerHTML += '<option value="' + playlist_title + '">' + playlist_title + '</option>\n';
            }
        }
    }
    let myModal = document.getElementById('saveToPlaylistModal');
    let myInput = document.getElementById('playlist_input');

    myInput.value = "";

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus();
    })
}

function onSaveToPlaylistSubmitButton(){
    console.log("onSaveToPlaylistSubmitButton");
    updateUserInfo();
    // let playlist_title = document.getElementById("playlist-form").elements[0].value; 
    let playlist_title = document.getElementById("playlist-options").value; 
    let alert_msg = document.getElementById("saveToPlaylistAlert");

    // check for no playlists
    if (isEmpty(user_info)){
        alert_msg.innerHTML = "Create a playlist first!";
        return;
    }

    // TODO: check for duplicate
    console.log("playlist title:" + playlist_title);
    // console.log(user_info[playlist_title]);

    let playlist_id = user_info[playlist_title][0]['playlist_id'];

    console.log("playlist id:" + playlist_id);
    console.log("video id:" + video_id);
    
    saveToPlaylist(playlist_id, video_id)
    video_id = "";
}

function saveToPlaylist(playlist_id, video_title){
    let url =  `${getAPIBaseURL()}/save-to-playlist?playlist_id=${playlist_id}&video_title=${video_title}`;

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((msg) => {
        console.log("saveToPlaylist");
        updateUserInfo();
    })
    .catch(function(error) {
        console.log(error);
    });

    // TODO: maybe a success message that disappears after a fews seconds?
    document.getElementById('close-save-modal').click();
}

///////////////////////////  UPDATE FUNCTIONS ///////////////////////////

function updateUserInfo(){
    let url =  `${getAPIBaseURL()}/user?user_name=${logged_in_user}`;

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((info) => {
        user_info = info;
    })
    .catch(function(error) {
        console.log(error);
    });

    console.log(user_info)
}

function updateButtons(){
    if (logged_in){
        document.getElementById("logIn").setAttribute('hidden',true);
        document.getElementById("signUp").setAttribute('hidden',true);
        document.getElementById("myPage").removeAttribute("hidden");
        document.getElementById("logOut").removeAttribute("hidden");
    }
    else{
        document.getElementById("logIn").removeAttribute("hidden");
        document.getElementById("signUp").removeAttribute("hidden");
        document.getElementById("myPage").setAttribute('hidden',true);
        document.getElementById("logOut").setAttribute('hidden',true);
    }
}

///////////////////////////  UTILITY FUNCTIONS ///////////////////////////

function getAPIBaseURL() {
    var baseURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
    return baseURL;
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function checkId(elem) {
    /**
     * returns id of the parentNode of current element.
     */
    return elem.parentNode.id;
}