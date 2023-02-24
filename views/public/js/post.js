$(document).ready(function () {
    const pathname = window.location.pathname
    const article_id = pathname.split('/')[2];

    /* login */
    $('#saveComment').click(function (e) {
        e.preventDefault();

        createNewComment(article_id);
    });

});

function createNewComment(article_id) {

    const name = $('#nameInput').val();
    const email = $('#emailInput').val();
    const message = $('#messageInput').val();

    const url = `http://localhost:1000/api/v1/public/article/comment/${article_id}`;
    const data = {
        name,
        message,
        email,
    };

    $.ajax({
        type: "post",
        url,
        data,
        success: function (response) {

            if (response.success) {

                // $('#alertWrapper').append(alertBox(alertId, 'success', 'successful', response.message));
                // window.location.replace(url);
                location.reload();
                
                console.log(response)

            } else if (!response.success) {
                $('#alertWrapper').append(alertBox(alertId, 'error', 'error', response.message));
            }

        },
        error: function (error) {
            $('#alertWrapper').append(alertBox(alertId, 'error', 'error', error.responseJSON.message));
        }
    });

}