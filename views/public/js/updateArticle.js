$(document).ready(function () {
    const pathname = window.location.pathname
    const article_id = pathname.split('/')[4];

    $('#saveBtn').click(function (e) {
        e.preventDefault();

        updateArticle(article_id);
    });
});


function updateArticle(article_id) {

    const url = `http://localhost:1000/api/v1/private/article/${article_id}`;

    const title = $('#titleInput').val();
    const page_title = $('#pageTitleInput').val();
    const summary = $('#summaryInput').val();
    const image = $('#imageInput').val();
    const description = $('#descriptionInput').val();


console.log(descriptionInput)
    const data = {}

    if (title) data.title = title;
    if (page_title) data.page_title = page_title;
    if (summary) data.summary = summary;
    if (image) data.image = image;
    if (description) data.description = description;

    $.ajax({
        type: "PATCH",
        url,
        data,
        success: function (response) {
            if (response.success === true) {
                // location.reload();
            }
        },
        error: function (error) {
            const alertId = Date.now();
            $('#alertWrapper').append(alertBox(alertId, 'error', 'error', error.responseJSON.message));
        }
    });
}