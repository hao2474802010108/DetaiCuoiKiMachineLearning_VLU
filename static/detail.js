const urlParams = new URLSearchParams(window.location.search);
const title = urlParams.get("title");

fetch(`/api/movie?title=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
        if (!data || !data.title) {
            document.querySelector(".info-box").innerHTML = "<p>Không tìm thấy thông tin phim.</p>";
            return;
        }

        document.getElementById("title").innerText = data.title;
        document.getElementById("overview").innerText = data.overview || "Không có mô tả.";
        document.getElementById("release").innerText = data.release || "Không rõ";
        document.getElementById("poster").src = data.poster || "";

        // Background blur theo poster
        document.body.style.backgroundImage = `url(${data.poster})`;

        const genreBox = document.getElementById("genres");
        let html = "";
        (data.genres || []).forEach(g => {
            if (g) html += `<span class="genre-tag">${g}</span>`;
        });
        genreBox.innerHTML = html || "<span>Không rõ</span>";
    })
    .catch(() => {
        document.querySelector(".info-box").innerHTML = "<p>Lỗi khi tải thông tin phim.</p>";
    });
