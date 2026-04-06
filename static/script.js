// Hiển thị danh sách phim lên grid
function showMovies(data) {
    const sectionTitle = document.getElementById("section-title");

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

// Tìm kiếm phim theo input
function search() {
    const movie = document.getElementById("movieInput").value.trim();
    if (!movie) return;

    const sectionTitle = document.getElementById("section-title");
    sectionTitle.innerText = `Kết quả cho: "${movie}"`;

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
    // Lưu lịch sử vào localStorage (client-side, bền vững)
    let history = JSON.parse(localStorage.getItem("movieHistory") || "[]");
    if (!history.includes(title)) {
        history.push(title);
        if (history.length > 20) history = history.slice(-20); // giữ 20 phim gần nhất
    }
    localStorage.setItem("movieHistory", JSON.stringify(history));

    window.location.href = `/movie?title=${encodeURIComponent(title)}`;
}

// Khi trang load: đề xuất theo lịch sử, hoặc phim mặc định nếu chưa có
window.onload = function () {
    const sectionTitle = document.getElementById("section-title");
    const history = JSON.parse(localStorage.getItem("movieHistory") || "[]");

    if (history.length > 0) {
        const lastMovie = history[history.length - 1];
        sectionTitle.innerText = `Gợi ý dựa theo: "${lastMovie}"`;

        fetch("/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie: lastMovie })
        })
        .then(res => res.json())
        .then(showMovies);
    } else {
        // Chưa có lịch sử → hiển thị phim mặc định
        sectionTitle.innerText = "🔥 Phim nổi bật";

        fetch("/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie: "Avatar" })
        })
        .then(res => res.json())
        .then(showMovies);
    }
};
