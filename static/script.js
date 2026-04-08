// Hiển thị danh sách phim lên grid
function showMovies(data) {
    if (!data || data.length === 0) {
        document.getElementById("movies").innerHTML = "<p style='text-align:center;color:#aaa'>Không tìm thấy phim phù hợp.</p>";
        return;
    }

    let html = "";
    data.forEach(m => {
        html += `
        <div class="movie-card" onclick="goDetail('${m.title.replace(/'/g, "\\'")}')">
            <img src="${m.poster || 'https://via.placeholder.com/160x240?text=No+Image'}" onerror="this.src='https://via.placeholder.com/160x240?text=No+Image'">
            <h3>${m.title}</h3>
        </div>`;
    });

    document.getElementById("movies").innerHTML = html;
}

// Hiển thị phim ngẫu nhiên vào grid đề xuất
function showRandomMovies(data) {
    if (!data || data.length === 0) {
        document.getElementById("random-movies").innerHTML = "<p style='text-align:center;color:#aaa'>Không tải được phim đề xuất.</p>";
        return;
    }

    let html = "";
    data.forEach(m => {
        html += `
        <div class="movie-card" onclick="goDetail('${m.title.replace(/'/g, "\\'")}')">
            <img src="${m.poster || 'https://via.placeholder.com/160x240?text=No+Image'}" onerror="this.src='https://via.placeholder.com/160x240?text=No+Image'">
            <h3>${m.title}</h3>
        </div>`;
    });

    document.getElementById("random-movies").innerHTML = html;
}

// Tìm kiếm phim theo input
function search() {
    const movie = document.getElementById("movieInput").value.trim();
    if (!movie) return;

    document.getElementById("section-title").innerText = "Gợi Ý Cho Bạn";

    fetch("/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie: movie })
    })
    .then(res => res.json())
    .then(showMovies);
}

// Chuyển sang trang chi tiết + lưu history vào localStorage
function goDetail(title) {
    let history = JSON.parse(localStorage.getItem("movieHistory") || "[]");
    if (!history.includes(title)) {
        history.push(title);
        if (history.length > 20) history = history.slice(-20);
    }
    localStorage.setItem("movieHistory", JSON.stringify(history));

    window.location.href = `/movie?title=${encodeURIComponent(title)}`;
}

// Load phim ngẫu nhiên cho phần Đề Xuất Hôm Nay
function loadRandomMovies() {
    document.getElementById("random-movies").innerHTML = "<p style='text-align:center;color:#aaa;padding:20px'>Đang tải...</p>";

    fetch("/random_movies")
        .then(res => res.json())
        .then(showRandomMovies)
        .catch(() => {
            document.getElementById("random-movies").innerHTML = "<p style='text-align:center;color:#aaa'>Không tải được phim.</p>";
        });
}

// Khi trang load
window.onload = function () {
    const history = JSON.parse(localStorage.getItem("movieHistory") || "[]");

    if (history.length > 0) {
        const lastMovie = history[history.length - 1];
        document.getElementById("section-title").innerText = "Gợi ý cho bạn";

        fetch("/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie: lastMovie })
        })
        .then(res => res.json())
        .then(showMovies);
    } else {
        document.getElementById("section-title").innerText = "Gợi ý cho bạn";

        fetch("/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie: "Avatar" })
        })
        .then(res => res.json())
        .then(showMovies);
    }

    // Load phim ngẫu nhiên mỗi lần trang load
    loadRandomMovies();
};