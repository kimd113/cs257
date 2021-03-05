/*
 * webapp.js
 * Daniel Kim, Harry Tian
 * 25 February 2021
 *
 * A little bit of Javascript for the tiny web app sample for CS257.
 */

window.onload = initialize;
console.log("loading");

let videos_list = [];
let videos_list_total_number = 0;
let videos_list_current_page = 0;
let isHorizontalView = true;

let logged_in = false;
let logged_in_user = "";

function initialize() {
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
}

function getAPIBaseURL() {
    var baseURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
    return baseURL;
}

function renderHorizontalVideosList(page_count) {
    /**
     * return: an array of strings of tags, which renders the list of videos in horizontal view.
     */
    let listBodyFirstRow = '';
    let listBodySecondRow = '';

    for (let i = page_count; i < page_count + 10; i++) {
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
    })
    .catch(function(error) {
        console.log(error);
    });
}

//////////// search bar functions ////////////
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
    console.log('videos_list_selected_page :', videos_list_selected_page);
    let selected_page_count = videos_list_selected_page * 10;
    console.log('selected_page_count :', selected_page_count);
    
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
    let listBody = renderVerticalVideosList(videos_list_current_page);
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

function onSignUpButton() {
    let myModal = document.getElementById('signUpModal');
    let myInput = document.getElementById('signUp_input');

    myInput.value = "";

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus();
    })

    let msgBox = document.getElementById('signUpMsg');
    msgBox.innerHTML = "Type username to sign up:";
}

// TODO: fix bug
function onLogInButton() {
    let myModal = document.getElementById('logInModal');
    let myInput = document.getElementById('logIn_input');

    myInput.value = "";

    myModal.addEventListener('shown.bs.modal', function () {
        myInput.focus();
    })

    
    let msgBox = document.getElementById('logInMsg');
    msgBox.innerHTML = "Type username to log in:";
}

function onSignUpSubmitButton() {
    /**
     * When user clicks the sign up button, create an account for the user if the username is not taken*
     */
    let user_name = document.getElementById("signUp_input"); 
    // let user_name = document.getElementById("signup-password"); 
    let url =  `${getAPIBaseURL()}/sign-up?user_name=${user_name.value}`;

    let msgbox = document.getElementById("signUpMsg");
    let sucess_code = "Signed up successfully"
    let error_code = "This name is already taken"

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((msg) => {
        console.log(msg);
        if (msgbox){
            if (msg){
                msgbox.innerHTML = sucess_code;
                // TODO: add close modal box function?
            }
            else{
                msgbox.innerHTML = error_code;
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
    let user_name = document.getElementById("logIn_input"); 
    // let user_name = document.getElementById("signup-password"); 
    let url =  `${getAPIBaseURL()}/log-in?user_name=${user_name.value}`;

    let msgbox = document.getElementById("logInMsg");
    let sucess_code = "Logged in successfully"
    let error_code = "User name does not exists, please sign up first"


    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((msg) => {
        if (msgbox){
            if (msg){
                msgbox.innerHTML = sucess_code;
                logInUser(user_name);
            }
            else{
                msgbox.innerHTML = error_code;
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function logInUser(user_name) {
    /**
     * If the user exists, log them in and make some changes*
     */
    logged_in = true;
    logged_in_user = user_name;
    updateButtons();
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

// TODO: add msgbox "are you sure you want to log out?"
function onLogOutButton(){
    logged_in = false;
    logged_in_user = "";
    updateButtons();
}