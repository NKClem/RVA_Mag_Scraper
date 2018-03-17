$("#scrape-btn").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data);
        window.location = "/"
    });
});

$(".nav-link").on("click", function() {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
});

$("#save-article").on("click", function() {
    let dataId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/save/" + dataId
    }).done(function(data) {
        window.location = "/"
    });
});

$("#delete-article").on("click", function() {
    let dataId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/delete/" + dataId
    }).done(function(data) {
        window.location = "/saved"
    });
});

$("#save-note").on("click", function() {
    let dataId = $(this).attr("data-id");
    if($("#note-text" + dataId).val() === "") {
        alert("Please enter a note!");
    } else {
        $.ajax({
            method: "POST",
            url: "/notes/save/" + dataId,
            data: {
                text: $("#note-text" + dataId).val()
            }
        }).done(function(data) {
            console.log(data);
            $("#note-text" + dataId).val("");
            $("#notes-modal").modal("hide");
            window.location = "/saved"
        });
    }
});

$(".delete-note").on("click", function() {
    let noteId = $(this).attr("data-note-id");
    let articleId = $(this).attr("data-article-id");

    $.ajax({
        method: "DELETE",
        url: `/notes/delete/${noteId}/${articleId}`
    }).done(function(data) {
        console.log(data);
        $(".note-modal").modal("hide");
        window.location = "/saved"
    });
});