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

    // let pageItem = document.querySelectorAll(".page-item");
    // if (pageItem) {
    //     pageItem.forEach(function(element) {
    //         element.onclick = onClickVideoPage;
    //     });
    // }

}

function getAPIBaseURL() {
    var baseURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
    return baseURL;
}

function renderHorizontalVideosList(page_count) {
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

        // let videosListElement = document.getElementById('now_trending_videos_list');
        let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
        let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
        if (videosListElementFirstRow) {
            videosListElementFirstRow.innerHTML = listBodies[0];
        }
        if (videosListElementSecondRow) {
            videosListElementSecondRow.innerHTML = listBodies[1];
        }

        onLoadVideoPages();
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
        videos_list_current_page = 0;
        videos_list = videos;
        let listBodies = renderHorizontalVideosList(0);

        let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
        let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
        if (videosListElementFirstRow) {
            videosListElementFirstRow.innerHTML = listBodies[0];
        }
        if (videosListElementSecondRow) {
            videosListElementSecondRow.innerHTML = listBodies[1];
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
    
    let currentPageItemElement = document.getElementById(`page-num${videos_list_current_page+2}`);
    currentPageItemElement.classList.remove("active");
    currentPageItemElement = document.getElementById(`page-num${videos_list_current_page+1}`);
    currentPageItemElement.classList.add("active");
    
    let listBodies = renderHorizontalVideosList(prev_page_count);

    if (videosListElementFirstRow) {
        videosListElementFirstRow.innerHTML = listBodies[0];
    }
    if (videosListElementSecondRow) {
        videosListElementSecondRow.innerHTML = listBodies[1];
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
    
    videos_list_current_page += 1;
    let next_page_count = videos_list_current_page * 10;
    
    let currentPageItemElement = document.getElementById(`page-num${videos_list_current_page}`);
    currentPageItemElement.classList.remove("active");
    currentPageItemElement = document.getElementById(`page-num${videos_list_current_page+1}`);
    currentPageItemElement.classList.add("active");
    
    let listBodies = renderHorizontalVideosList(next_page_count);

    if (videosListElementFirstRow) {
        videosListElementFirstRow.innerHTML = listBodies[0];
    }
    if (videosListElementSecondRow) {
        videosListElementSecondRow.innerHTML = listBodies[1];
    }
}

function onLoadVideoPages() {
    /**
     * Implement the pagination of the video list.
     */
    let verticalVideosListElement = document.getElementById("vertical-videos-list");
    let videos_list_total_pages = Math.ceil(videos_list_total_number / 10);

    // let listBody = '<button type="button" id="prev_button" class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">Prev</a></button>';
    let listBody = '';
    for (let i = 0; i < videos_list_total_pages; i++) {
        (i == 0) ? listBody += `<li id="page-num${i+1}" class="page-item active"><a class="page-link" href="#">${i+1}</a></li>`
        : listBody += `<li id="page-num${i+1}" class="page-item"><a class="page-link" href="#">${i+1}</a></li>`;
    }
    // listBody += '<button type="button" id="next_button" class="page-item"><a class="page-link" href="#">Next</a></button>';
 
    verticalVideosListElement.innerHTML = listBody;
}

function onClickVideoPage() {
    /**
     * Implement onClick function that navigates to the page clicked and switches the videos.
     */
    console.log('hi');
    let videosListElementFirstRow = document.getElementById('now_trending_videos_list_1');
    let videosListElementSecondRow = document.getElementById('now_trending_videos_list_2');
    videosListElementFirstRow.innerHTML = '';
    videosListElementSecondRow.innerHTML = '';

    videos_list_current_page += 1;
    let selected_page_count = videos_list_current_page * 10;
    
    let currentPageItemElement = document.getElementById(`page-num${videos_list_current_page}`);
    currentPageItemElement.classList.remove("active");
    currentPageItemElement = document.getElementById(`page-num${videos_list_current_page+1}`);
    currentPageItemElement.classList.add("active");

    let listBodies = renderHorizontalVideosList();

    if (videosListElementFirstRow) {
        videosListElementFirstRow.innerHTML = listBodies[0];
    }
    if (videosListElementSecondRow) {
        videosListElementSecondRow.innerHTML = listBodies[1];
    }    
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
// }