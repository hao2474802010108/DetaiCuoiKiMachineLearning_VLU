function search() {
    const movie = document.getElementById("movieInput").value;

    fetch("/recommend", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ movie: movie })
    })
    .then(res => res.json())
    .then(data => {
        let html = "";

        data.forEach(m => {
            html += `
            <div class="movie-card" onclick="goDetail('${m.title}')">
                <img src="${m.poster}">
                <h3>${m.title}</h3>
            </div>`;
        });

        document.getElementById("movies").innerHTML = html;
    });
}

function goDetail(title) {

    fetch("/save_history", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ movie: title })
    });

    window.location.href = `/movie?title=${encodeURIComponent(title)}`;
}
window.onload = function() {

    fetch("/get_history")
    .then(res => res.json())
    .then(history => {

        if (history.length > 0) {
            let lastMovie = history[history.length - 1];

            fetch("/recommend", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ movie: lastMovie })
            })
            .then(res => res.json())
            .then(showMovies);
        }
    });
}