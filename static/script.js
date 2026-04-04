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
    window.location.href = `/movie?title=${encodeURIComponent(title)}`;
}