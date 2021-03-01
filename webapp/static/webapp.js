/*
 * webapp.js
 * Daniel Kim, Harry Tian
 * 25 February 2021
 *
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
        let listBody = '';
        for (let i = 0; i < 10; i++) {
            let video = videos[i];
            listBody += `<li class="now_trending_videos_list_item">
                <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                    <img class="video_img" src=${video.thumbnail_link} alt="" />
                    <div class="video_title">${video.title}</div>
                    <div class="video_channel">${video.channel}</div>
                    <div class="video_list_item_text">
                        <span class="video_views">${video.views} </span>|
                        <span class="video_likes">${video.likes} </span>|
                        <span class="video_dislikes">${video.dislikes}</span>
                    </div>
                    <button class="save_to_playlist_button">Save to my playlist</button>
                </a>
            </li>`;
        }

        let videosListElement = document.getElementById('now_trending_videos_list');
        if (videosListElement) {
            videosListElement.innerHTML = listBody;
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
    console.log("111");
    let day = document.getElementById('search_trending_time_input_day');
    let month = document.getElementById('search_trending_time_input_month');
    let year = document.getElementById('search_trending_time_input_year');

    date = day.value + '.' +  month.value + '.' + year.value 
    let url =  getAPIBaseURL() + '?trending_date=' + date;

    fetch(url, {method: 'get'})
    .then((response) => response.json())
    .then((videos) => {
        console.log(videos);
        videos_list = videos;
        let listBody = '';
        for (let i = 0; i < 10; i++) {
            let video = videos[i];
            listBody += `<li class="now_trending_videos_list_item">
                <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                    <img class="video_img" src=${video.thumbnail_link} alt="" />
                    <div class="video_title">${video.title}</div>
                    <div class="video_channel">${video.channel}</div>
                    <div class="video_list_item_text">
                        <span class="video_views">${video.views} </span>|
                        <span class="video_likes">${video.likes} </span>|
                        <span class="video_dislikes">${video.dislikes}</span>
                    </div>
                    <button class="save_to_playlist_button">Save to my playlist</button>
                </a>
            </li>`;
        }

        let videosListElement = document.getElementById('now_trending_videos_list');
        if (videosListElement) {
            videosListElement.innerHTML = listBody;
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function onPrevVideosButton() {
    console.log("111");
    /**
     * When user clicks prev button, render the list of videos that have smaller index number.
     */
    if (videos_list_current_page == 0) {
        alert('This is the first page of videos.');
        return;
    }

    let videosListElement = document.getElementById('now_trending_videos_list');
    videosListElement.innerHTML = '';

    videos_list_current_page -= 1;
    let prev_page_count = videos_list_current_page * 10;
    let listBody = '';
    for (let i = prev_page_count; i < prev_page_count + 10; i++) {
        let video = videos_list[i];
        listBody += `<li class="now_trending_videos_list_item">
        <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
            <img class="video_img" src=${video.thumbnail_link} alt="" />
            <div class="video_title">${video.title}</div>
            <div class="video_channel">${video.channel}</div>
            <div class="video_list_item_text">
                <span class="video_views">${video.views} </span>|
                <span class="video_likes">${video.likes} </span>|
                <span class="video_dislikes">${video.dislikes}</span>
            </div>
            <button class="save_to_playlist_button">Save to my playlist</button>
            </a>
        </li>`;
    }

    if (videosListElement) {
        videosListElement.innerHTML = listBody;
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
    let videosListElement = document.getElementById('now_trending_videos_list');
    videosListElement.innerHTML = '';

    
    videos_list_current_page += 1;
    let next_page_count = videos_list_current_page * 10;
    let listBody = '';
    for (let i = next_page_count; i < next_page_count + 10; i++) {
        if (videos_list[i]) {
            let video = videos_list[i];
            listBody += `<li class="now_trending_videos_list_item">
                <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                    <img class="video_img" src=${video.thumbnail_link} alt="" />
                    <div class="video_title">${video.title}</div>
                    <div class="video_channel">${video.channel}</div>
                    <div class="video_list_item_text">
                        <span class="video_views">${video.views} </span>|
                        <span class="video_likes">${video.likes} </span>|
                        <span class="video_dislikes">${video.dislikes}</span>
                    </div>
                    <button class="save_to_playlist_button">Save to my playlist</button>
                </a>
            </li>`;
        }
    }

    if (videosListElement) {
        videosListElement.innerHTML = listBody;
    }
}


function onSignUpButton() {
    /**
     * When user clicks the sign up button, create an account for the user*
     */
    if (videos_list_current_page == Math.ceil(videos_list.length / 10) - 1) {
        alert('This is the last page of videos.');
        return;
    }
    let videosListElement = document.getElementById('now_trending_videos_list');
    videosListElement.innerHTML = '';

    
    videos_list_current_page += 1;
    let next_page_count = videos_list_current_page * 10;
    let listBody = '';
    for (let i = next_page_count; i < next_page_count + 10; i++) {
        if (videos_list[i]) {
            let video = videos_list[i];
            listBody += `<li class="now_trending_videos_list_item">
                <a href="https://www.youtube.com/watch?v=${video.link}" target="_blank">
                    <img class="video_img" src=${video.thumbnail_link} alt="" />
                    <div class="video_title">${video.title}</div>
                    <div class="video_channel">${video.channel}</div>
                    <div class="video_list_item_text">
                        <span class="video_views">${video.views} </span>|
                        <span class="video_likes">${video.likes} </span>|
                        <span class="video_dislikes">${video.dislikes}</span>
                    </div>
                    <button class="save_to_playlist_button">Save to my playlist</button>
                </a>
            </li>`;
        }
    }

    if (videosListElement) {
        videosListElement.innerHTML = listBody;
    }
}
