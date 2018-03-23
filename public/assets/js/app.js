$("#scrape-btn").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        //console.log(data);
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
    const thisId = $(this).attr("data-id");

    if(!$("#note-text" + thisId).val()) {
        alert("Please complete the form to leave a note.");
    } else {
        $.ajax({
            method: "POST",
            url: "/notes/save/" + thisId,
            data: {
                text: $("#note-text" + thisId).val()
            }
        }).done(function(entry) {
            console.log(entry);
            $("#note-text" + thisId).val("");
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
        url: "/notes/delete/" + noteId + "/" + articleId
    }).done(function(data) {
        console.log(data);
        $(".note-modal").modal("hide");
        window.location = "/saved"
    });
});
