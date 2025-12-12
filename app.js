/* ============================================================
   ShMovie+ — APP ENGINE
============================================================ */

const $ = (id) => document.getElementById(id);
const pages = document.querySelectorAll(".page");

/* ------------------------ Navigation ------------------------ */
function showPage(id) {
    pages.forEach((p) => p.classList.remove("active"));
    $(id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("#bottomNav button").forEach((btn) => {
    btn.onclick = () => {
        document.querySelector("#bottomNav .active").classList.remove("active");
        btn.classList.add("active");
        showPage(btn.dataset.page);
    };
});

$("openSearch").onclick = () => showPage("pageSearch");
$("openProfileFromHeader").onclick = () => showPage("pageProfile");

/* ------------------------ HERO SLIDER ------------------------ */
let heroIndex = 0;
function loadHero() {
    const m = heroSlides[heroIndex];
    $("heroSlide").style.backgroundImage = `url('${m.poster}')`;
    $("heroTitle").innerText = m.title;
    $("heroPlayBtn").onclick = () => openMovieModal(m.id);
    heroIndex = (heroIndex + 1) % heroSlides.length;
}
setInterval(loadHero, 5000);
loadHero();

/* ------------------------ RENDER ROWS ------------------------ */
function renderRow(targetId, list) {
    const row = $(targetId);
    row.innerHTML = "";
    list.forEach((m) => {
        row.innerHTML += `
        <div class="movie-card"
            style="background-image:url('${m.poster}')"
            onclick="openMovieModal(${m.id})">
            <div class="movie-overlay">
                <div class="movie-title">${m.title}</div>
            </div>
        </div>`;
    });
}

renderRow("rowHot", movies);
renderRow("rowPopular", movies);
renderRow("rowNewest", movies.slice(5.5));
function renderHomeCategories() {
    const box = document.getElementById("homeCategories");
    box.innerHTML = "";

    categories.forEach((cat, index) => {
        const el = document.createElement("div");
        el.className = "category-chip";
        el.innerText = cat;

        if (index === 0) el.classList.add("active");

        el.onclick = () => {
            document
                .querySelectorAll(".category-chip")
                .forEach(c => c.classList.remove("active"));
            el.classList.add("active");

            if (cat === "هەمی فلم") {
                renderRow("rowHot", movies);
            } else {
                renderRow(
                    "rowHot",
                    movies.filter(m =>
                        m.genre && m.genre.includes(cat)
                    )
                );
            }
        };

        box.appendChild(el);
    });
}


/* ------------------------ TWO PART PLAYER ------------------------ */
let activeMovie = null;

function openMovieModal(movieId) {
    const m = movies.find((x) => x.id === movieId);
    activeMovie = m;

    $("videoContainer").innerHTML = `
    <h2>${m.title}</h2>
    <p style="opacity:.7; margin-bottom:10px; white-space:pre-line;">${m.desc}</p>
    `;

    $("videoModal").classList.add("show");

    $("btnPart1").onclick = () => playVideo(m.part1, movieId, "part1");
    $("btnPart2").onclick = () => playVideo(m.part2, movieId, "part2");
    $("btnPart3").onclick = () => playVideo(m.part3, movieId, "part3");

}

function playVideo(src, id, part) {
    $("videoContainer").innerHTML = `
        <video id="activeVideo" controls autoplay>
            <source src="${src}">
        </video>
    `;

    localStorage.setItem("cw_movieId", id);
    localStorage.setItem("cw_part", part);

    setInterval(() => {
        const v = $("activeVideo");
        if (v) {
            localStorage.setItem("cw_time", v.currentTime);
            localStorage.setItem("cw_duration", v.duration);
        }
    }, 1200);
}

$("closeVideoModal").onclick = () => {
    $("videoModal").classList.remove("show");
    $("videoContainer").innerHTML = "";
};

/* ------------------------ CONTINUE WATCHING ------------------------ */
function renderContinue() {
    const id = localStorage.getItem("cw_movieId");
    const time = localStorage.getItem("cw_time");
    const dur = localStorage.getItem("cw_duration");

    if (!id || !time || !dur) return;

    const m = movies.find((x) => x.id == id);
    const percent = Math.floor((time / dur) * 100);

    if (percent > 90) {
        localStorage.removeItem("cw_movieId");
        localStorage.removeItem("cw_time");
        localStorage.removeItem("cw_duration");
        return;
    }

    $("rowContinue").innerHTML = `
        <div class="movie-card"
         style="background-image:url('${m.poster}')"
         onclick="openMovieModal(${m.id})">
            <div class="continue-badge">⏳ بەردەوام بکە</div>
            <div class="progress-container">
                <div class="progress-bar" style="width:${percent}%"></div>
            </div>
        </div>
    `;
}
renderContinue();

/* ------------------------ CATEGORIES ------------------------ */
const catList = $("categoryList");
categories.forEach((cat) => {
    const el = document.createElement("div");
    el.className = "category-item";
    el.innerText = cat;
    el.onclick = () => {
        const list = cat === "هەمی فلم"
            ? movies
            : movies.filter(m
                (m.genre && m.genre.includes(cat)) ||
                (m.title && m.title.includes(cat))
            )
        renderRow("rowCategoryMovies", list);
    };
    catList.appendChild(el);
});

/* ------------------------ SEARCH ------------------------ */
$("searchBox").oninput = (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return $("rowSearchResults").innerHTML = "";

    renderRow(
        "rowSearchResults",
        movies.filter(m =>
            m.title.toLowerCase().includes(q) ||
            (m.desc && m.desc.toLowerCase().includes(q))
        )
    );
};

/* ------------------------ PROFILE ------------------------ */
if (localStorage.getItem("userData")) {
    Object.assign(userData, JSON.parse(localStorage.getItem("userData")));
}

$("profileName").innerText = userData.name;
$("profileImage").src = userData.image;

$("editProfileBtn").onclick = () => {
    $("editName").value = userData.name;
    $("editImage").value = userData.image;
    showPage("pageEditProfile");
};

$("saveProfileBtn").onclick = () => {
    userData.name = $("editName").value;
    userData.image = $("editImage").value;
    localStorage.setItem("userData", JSON.stringify(userData));
    $("profileName").innerText = userData.name;
    $("profileImage").src = userData.image;
    showPage("pageProfile");
};
renderHomeCategories();