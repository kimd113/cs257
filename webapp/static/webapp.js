/*
 * webapp.js
 * Daniel Kim, Harry Tian
 * 25 February 2021
 *
 * A little bit of Javascript for the tiny web app sample for CS257.
 */

window.onload = initialize;

let videos_list = [];
let videos_list_current_page = 0;

function initialize() {
    getVideosListInMainPage();

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
    })
    .catch(function(error) {
        console.log(error);
    });
}

function onSearchButton() {
    /**
     * When user enters the main page, send request to the server and get the list of trending videos.
     */
    let day = document.getElementById('input_date');
    let month = document.getElementById('input_month');
    let year = document.getElementById('input_year');
    
    let date = year.value + '.' +  day.value + '.' + month.value;
    let url =  `${getAPIBaseURL()}?trending_date=${date}`;
    
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
// }