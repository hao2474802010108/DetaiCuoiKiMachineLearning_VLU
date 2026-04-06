const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get("title");

fetch(`/api/movie?title=${title}`)
.then(res => res.json())
.then(data => {

    document.getElementById("title").innerText = data.title;
    document.getElementById("overview").innerText = data.overview;
    document.getElementById("release").innerText = data.release;
    document.getElementById("poster").src = data.poster;

    document.body.style.backgroundImage = `url(${data.poster})`;

    const genreBox = document.getElementById("genres");

    let html = "";
    data.genres.forEach(g => {
        if (g) {
            html += `<span class="genre-tag">${g}</span>`;
        }
    });

    genreBox.innerHTML = html;
});