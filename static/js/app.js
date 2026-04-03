function getRecommend() {
    let id = document.getElementById("user_id").value;

    fetch(`/recommend?user_id=${id}`)
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(movie => {
                html += `
                    <div class="card">
                        <img src="${movie.poster}">
                        <p>${movie.title}</p>
                    </div>
                `;
            });

            document.getElementById("movies").innerHTML = html;
        });
}