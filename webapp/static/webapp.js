/*
 * webapp.js
 * Daniel Kim, Harry Tian
 * 25 February 2021
 *
 * A little bit of Javascript for the tiny web app sample for CS257.
 */

window.onload = initialize;

let videos_list = [];
let videos_list_total_number = 0;
let videos_list_current_page = 0;

function initialize() {
    getVideosListInMainPage();

    loadYearList();

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

    let signUpButton = document.getElementById('signup');
    if (signUpButton) {
        signUpButton.onclick = onSignUpButton;
    }

    let logInButton = document.getElementById('logIn');
    if (logInButton) {
        logInButton.onclick = onSignUpButton;
    }

    let verticalButton = document.getElementById('vertical');
    if (verticalButton) {
        verticalButton.onclick = onVerticalViewButton;
    }
}

function getAPIBaseURL() {
    var baseURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
    return baseURL;
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
        let listBodyFirstRow = '';
        let listBodySecondRow = '';
        for (let i = 0; i < 10; i++) {
            let video = videos[i];
            let listBody = `<div class="now_trending_videos_list_item col card">
                <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                    <img class="video_img card-img-top" src=${video.thumbnail_link} alt="" />
                    <div class="video_title">${video.title}</div>
                </a>
                    <div class="video_channel">${video.channel}</div>
                    <div class="video_list_item_text">
                        <span class="video_views">${video.views} </span>|
                        <span class="video_likes">${video.likes} </span>|
                        <span class="video_dislikes">${video.dislikes}</span>
                    </div>
                    <button class="save_to_playlist_button btn btn-sm btn-outline-primary">Save to my playlist</button>
                </div>`;
            if (i < 5) {
                listBodyFirstRow += listBody;
            } else {
                listBodySecondRow += listBody;
            }
        }

        // let videosListElement = document.getElementById('now_trending_videos_list');
        let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
        let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
        if (videosListElementFirstRow) {
            videosListElementFirstRow.innerHTML = listBodyFirstRow;
        }
        if (videosListElementSecondRow) {
            videosListElementSecondRow.innerHTML = listBodySecondRow;
        }

        console.log(videos_list_total_number);
        onLoadVideoPages();
    })
    .catch(function(error) {
        console.log(error);
    });
}

let search_day = "";
let search_month = "";
let search_year = "";

//////////// search bar functions ////////////
function loadYearList() {
    var yearList = document.getElementById('year-list');
    if (yearList) {
        var defaultText = '<option value="" selected="selected">year</option>\n';
        var listBody = defaultText + '<option value="2017">2017</option>\n<option value="2018">2018</option>\n';
        yearList.innerHTML = listBody;
        
        yearList.onchange = function() {
            search_year = this.value;
            if (search_year == "2017"){
                search_year = "17";
            }
            else if (search_year == "2018"){
                search_year = "18";
            }
            console.log(search_year);
            loadMonthList(search_year);
        }
    }
}

function loadMonthList(yearSelection) {
    var monthList = document.getElementById('month-list');
    if (monthList) {
        var defaultText = '<option value="" selected="selected">month</option>\n';
        var listBody = defaultText;
        if (yearSelection == '17') {
            listBody += '<option value="11">11</option>\n<option value="12">12</option>\n';
        } else if (yearSelection == '18') {
            listBody += '<option value="01">01</option>\n<option value="02">02</option>\n<option value="03">03</option>\n<option value="04">04</option>\n<option value="05">05</option>\n<option value="06">06</option>\n';
        }
        monthList.innerHTML = listBody;

        monthList.onchange = function() {
            search_month = this.value;
            console.log(search_month);
            loadDayList(search_month);
        }
    }
}

function loadDayList(monthSelection) {
    var dayList = document.getElementById('day-list');
    if (dayList) {
        var defaultText = '<option value="" selected="selected">day</option>\n';
        var listBody = defaultText;
        for (var k=1; k <= 9; k++) {
            listBody += '<option value="0' + k + '">0' + k + '</option>\n';
        }
        for (var k=10; k <= 28; k++) {
            listBody += '<option value="' + k + '">' + k + '</option>\n';
        }
        if (monthSelection == '01' || monthSelection == '03' || monthSelection == '05' || monthSelection == '12'){
            for (var k=28; k <= 31; k++) {
                listBody += '<option value="' + k + '">' + k + '</option>\n';
            }
        }
        else if (monthSelection == '04' || monthSelection == '06' || monthSelection == '11'){
            for (var k=28; k <= 30; k++) {
                listBody += '<option value="' + k + '">' + k + '</option>\n';
            }
        }

        dayList.innerHTML = listBody;
        dayList.onchange = function() {
            search_day = this.value;
            console.log(search_day);
        }
    }
}


function onSearchButton() {
    /**
     * When user enters the main page, send request to the server and get the list of trending videos.
     */
    let search_date = search_year + '.' +  search_day + '.' + search_month;
    let url =  `${getAPIBaseURL()}?trending_date=${search_date}`;
    console.log(url);

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((videos) => {
        let listBodyFirstRow = '';
        let listBodySecondRow = '';
        videos_list_current_page = 0;
        for (let i = 0; i < 10; i++) {
            let video = videos[i];
            let listBody = `<div class="now_trending_videos_list_item col card">
                <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                    <img class="video_img card-img-top" src=${video.thumbnail_link} alt="" />
                    <div class="video_title">${video.title}</div>
                </a>
                    <div class="video_channel">${video.channel}</div>
                    <div class="video_list_item_text">
                        <span class="video_views">${video.views} </span>|
                        <span class="video_likes">${video.likes} </span>|
                        <span class="video_dislikes">${video.dislikes}</span>
                    </div>
                    <button class="save_to_playlist_button btn btn-sm btn-outline-primary">Save to my playlist</button>
                </div>`;
            if (i < 5) {
                listBodyFirstRow += listBody;
            } else {
                listBodySecondRow += listBody;
            }
        }

        let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
        let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
        if (videosListElementFirstRow) {
            videosListElementFirstRow.innerHTML = listBodyFirstRow;
        }
        if (videosListElementSecondRow) {
            videosListElementSecondRow.innerHTML = listBodySecondRow;
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
    videosListElementFirstRow.innerHTML = '';
    videosListElementSecondRow.innerHTML = '';

    videos_list_current_page -= 1;
    let prev_page_count = videos_list_current_page * 10;
    let listBodyFirstRow = '';
    let listBodySecondRow = '';
    for (let i = prev_page_count; i < prev_page_count + 10; i++) {
        let video = videos_list[i];
        let listBody = `<div class="now_trending_videos_list_item col card">
            <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                <img class="video_img card-img-top" src=${video.thumbnail_link} alt="" />
                <div class="video_title">${video.title}</div>
            </a>
                <div class="video_channel">${video.channel}</div>
                <div class="video_list_item_text">
                    <span class="video_views">${video.views} </span>|
                    <span class="video_likes">${video.likes} </span>|
                    <span class="video_dislikes">${video.dislikes}</span>
                </div>
                <button class="save_to_playlist_button btn btn-sm btn-outline-primary">Save to my playlist</button>
            </div>`;
        if (i < prev_page_count + 5 ) {
            listBodyFirstRow += listBody;
        } else {
            listBodySecondRow += listBody;
        }
    }

    if (videosListElementFirstRow) {
        videosListElementFirstRow.innerHTML = listBodyFirstRow;
    }
    if (videosListElementSecondRow) {
        videosListElementSecondRow.innerHTML = listBodySecondRow;
    }
}

function onNextVideosButton() {
    /**
     * When user clicks next button, render the list of videos that have smaller index number.
     */
    if (videos_list_current_page == Math.ceil(videos_list.length / 10) - 1) {
        alert('This is the last page of videos.');
        return;
    }

    let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
    let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
    videosListElementFirstRow.innerHTML = '';
    videosListElementSecondRow.innerHTML = '';

    
    videos_list_current_page += 1;
    let next_page_count = videos_list_current_page * 10;
    let listBodyFirstRow = '';
    let listBodySecondRow = '';
    for (let i = next_page_count; i < next_page_count + 10; i++) {
        if (videos_list[i]) {
            let video = videos_list[i];
            let listBody = `<div class="now_trending_videos_list_item col card">
                <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                    <img class="video_img card-img-top" src=${video.thumbnail_link} alt="" />
                    <div class="video_title">${video.title}</div>
                </a>
                    <div class="video_channel">${video.channel}</div>
                    <div class="video_list_item_text">
                        <span class="video_views">${video.views} </span>|
                        <span class="video_likes">${video.likes} </span>|
                        <span class="video_dislikes">${video.dislikes}</span>
                    </div>
                    <button class="save_to_playlist_button btn btn-sm btn-outline-primary">Save to my playlist</button>
                </div>`;
            if (i < next_page_count + 5 ) {
                listBodyFirstRow += listBody;
            } else {
                listBodySecondRow += listBody;
            }
        }
    }

    if (videosListElementFirstRow) {
        videosListElementFirstRow.innerHTML = listBodyFirstRow;
    }
    if (videosListElementSecondRow) {
        videosListElementSecondRow.innerHTML = listBodySecondRow;
    }
}

function onLoadVideoPages() {
    /**
     * Implement the pagination of the video list.
     */
    let verticalVideosListElement = document.getElementById("vertical-videos-list");
    console.log(videos_list_total_number);
    let videos_list_total_pages = Math.ceil(videos_list_total_number / 10);
    console.log(videos_list_total_pages)
    let listBody = '<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">Prev</a></li>';
    for (let i = 0; i < videos_list_total_pages; i++) {
        listBody += `<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`;
    }
    listBody += '<li class="page-item"><a class="page-link" href="#">Next</a></li>';
 

    verticalVideosListElement.innerHTML = listBody;
}

function onVerticalViewButton() {
    /**
     * Change the view of the list into vertical view.
     */
    let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
    let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
    let verticalTableElement = document.getElementById("vertical-table-box");
    let verticalTableBodyElement = document.getElementById("vertical-table-body");
    videosListElementFirstRow.innerHTML = '';
    videosListElementSecondRow.innerHTML = '';
    verticalTableElement.style.display = "block";

    let listBody = '';
    for (let i = videos_list_current_page; i < videos_list_current_page + 10; i++) {
        console.log(videos_list[i]);
        if (videos_list[i]) {
            let video = videos_list[i];
            const { publish_time } = video
            listBody += 
                `<tr>
                    <td>${video.title}</td>
                    <td>${video.channel}</td>
                    <td>${publish_time.substring(0,4)}/${publish_time.substring(5,7)}/${publish_time.substring(8,10)}</td>
                    <td>${video.views}</td>
                    <td>${video.likes}</td>
                    <td>${video.dislikes}</td>
                    <td>${video.comment_count}</td>
                </tr>`;
        }
    }

    verticalTableBodyElement.innerHTML = listBody;
}

function onSignUpButton() {
    let myModal = document.getElementById('signUpModal');
    let myInput = document.getElementById('signUp_input');

    myInput.value = "";

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus();
    })
}

function onLogInButton() {
    let myModal = document.getElementById('logInModal');
    let myInput = document.getElementById('logIn_input');

    myInput.value = "";

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus();
    })
}

// function onSignUpButton() {
//     /**
//      * When user clicks the sign up button, create an account for the user*
//      */
//     let user_name = document.getElementById(user name id); 
//     let url =  `${getAPIBaseURL()}?user_name=${user_name.value}`;

//     let msgbox = document.getElementById(message box id);
//     let sucess_code = "signed up successfully"
//     let error_code = "this name is already taken"

//     fetch(url, {method: 'get'})
//     .then((response) => response.json())
//     .then((msg) => {
//         if (msgbox){
//             if (msg){
//                 msgbox.innerHTML = sucess_code;
//             }
//             else{
//                 msgbox.innerHTML = error_code;
//             }
//         }
//     })
//     .catch(function(error) {
//         console.log(error);
//     });
// }

// function onLogInButton() {
//     /**
//      * When user clicks the log in button, ...*
//      */
//     let user_name = document.getElementById(user name id); 
//     let url =  `${getAPIBaseURL()}?user_name=${user_name.value}`;

//     let msgbox = document.getElementById(message box id);
//     let sucess_code = "logged in successfully"
//     let error_code = "user name does not exists, please sign up first"

//     fetch(url, {method: 'get'})
//     .then((response) => response.json())
//     .then((msg) => {
//         if (msgbox){
//             if (msg){
//                 msgbox.innerHTML = sucess_code;
//             }
//             else{
//                 msgbox.innerHTML = error_code;
//             }
//         }
//     })
//     .catch(function(error) {
//         console.log(error);
//     });