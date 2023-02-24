$(document).ready(function () {
    getCommentList();
});


function getCommentList() {
    $.ajax({
        type: "GET",
        url: "http://localhost:1000/api/v1/private/article/comment/",
        success: function (response) {
            if (response.success === true) {

                const commentList = response.data.result;

                for (let index = 0; index < commentList.length; index++) {
                    const comment = commentList[index];

                    $('#comment_tbody').append(trGenerator({
                        index: index + 1,
                        article_id: comment.article._id,
                        commentDescription: comment.message,
                        comment_id: comment._id,
                    }));

                }

            }
        },
        error: function (error) {
            const alertId = Date.now();
            $('#alertWrapper').append(alertBox(alertId, 'error', 'error', error.responseJSON.message));
        }
    });
}


function trGenerator({ commentDescription,comment_id, article_id, index }) {

    // console.log(onClickHandler);
    return `
    
    <tr>
                            <th scope="row">${index}</th>
                            <td>
                                <p class="text-decoration-none d-inline-block text-truncate" style="max-width: 250px;">comment
                                    ${commentDescription}
                                </p>
                            </td>
                            <td class="d-flex flex-row align-items-baseline justify-content-evenly">
                                <a class="w-100 btn btn-outline-primary me-1" href="http://localhost:1000/api/v1/private/article/comment/status/confirm/${comment_id}">save</a>
                                <a class="w-100 btn btn btn-outline-danger me-1" href="http://localhost:1000/api/v1/private/article/comment/status/remove/${comment_id}">remove</a>
                                <a class="w-100 btn btn btn-outline-secondary" href="http://localhost:1000/article/${article_id}">show</a>
                            </td>
                        </tr>
    
    `;
}