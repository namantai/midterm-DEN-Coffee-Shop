const viewer = document.getElementById("photo-viewer");
const photos = $(".gallery-grid").children("figure");
const viewerContent = $("#photo-viewer .viewer-content");
const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 150;
let currentIndex = 0;

function showPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;
    const thumbnail = photos.eq(currentIndex).find("img");
    const caption = thumbnail.attr("alt");

    $("#large-photo").stop(true, true).hide()
        .attr("src", thumbnail.attr("src"))
        .attr("alt", caption)
        .fadeIn(duration);
    $("#photo-caption").text(caption);
    $("#photo-position").text("Photo " + (currentIndex + 1) + " of " + photos.length);
}

function closeViewer() {
    viewerContent.stop(true).fadeOut(duration, function () {
        viewer.close();
    });
}

$(".gallery-photo").on("click", function (event) {
    event.preventDefault();
    const index = photos.index($(this).closest("figure"));
    viewerContent.show();
    viewer.showModal();
    showPhoto(index);
});

$("#previous-photo").on("click", function () {
    showPhoto(currentIndex - 1);
});

$("#next-photo").on("click", function () {
    showPhoto(currentIndex + 1);
});

$("#close-photo").on("click", closeViewer);

$(viewer).on("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const step = event.key === "ArrowRight" ? 1 : -1;
        showPhoto(currentIndex + step);
    }
});

$(viewer).on("cancel", function (event) {
    event.preventDefault();
    closeViewer();
});
