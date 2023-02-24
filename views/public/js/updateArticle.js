$(document).ready(function () {
    const pathname = window.location.pathname
    const article_id = pathname.split('/')[4];

    $('#saveBtn').click(function (e) {
        e.preventDefault();

        updateArticle(article_id);
    });
});


function updateArticle(article_id) {

    const url = `http://localhost:1000/api/v1/private/article/${article_id}`

    const titleInput = $('#titleInput').val();
    const pageTitleInput = $('#pageTitleInput').val();
    const summaryInput = $('#summaryInput').val();
    const imageInput = $('#imageInput').val();
    const descriptionInput = $('#imageInput').val();

    const data = {}

    if (titleInput) data.title = titleInput;
    if (pageTitleInput) data.page_title = pageTitleInput;
    if (summaryInput) data.url = summaryInput;
    if (imageInput) data.description = imageInput;
    if (descriptionInput) data.summary = descriptionInput;

    $.ajax({
        type: "PATCH",
        url,
        data,
        success: function (response) {
            if (response.success === true) {
                location.reload();
            }
        },
        error: function (error) {
            const alertId = Date.now();
            $('#alertWrapper').append(alertBox(alertId, 'error', 'error', error.responseJSON.message));
        }
    });
}