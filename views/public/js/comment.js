$(document).ready(function () {
    getCommentList();
});


function getCommentList() {
    $.ajax({
        type: "GET",
        url: "http://localhost:1000/api/v1/public/article/comment/",
        success: function (response) {
            if (response.success === true) {

                const commentList = response.data.result

                for (let index = 0; index < commentList.length; index++) {
                    const comment = commentList[index];

                    $('#comment_tbody').append(trGenerator({
                        index: index + 1,
                        articleTitle: "articleTitle",
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

function trGenerator({ articleTitle, commentDescription, comment_id, index }) {
    return `
    
    <tr>
                            <th scope="row">${index}</th>
                            <td>
                                <a href="" class="text-decoration-none d-inline-block text-truncate" style="max-width: 150px;">
                                ${articleTitle}
                                </a>
                            </td>
                            <td>
                                <a href="" class="text-decoration-none d-inline-block text-truncate" style="max-width: 150px;">comment
                                    ${commentDescription}
                                </a>
                            </td>
                            <td class="d-flex flex-row align-items-baseline justify-content-evenly">
                                <button class="w-100 btn btn-outline-primary me-1">accept</button>
                                <button class="w-100 btn btn btn-outline-danger">deny</button>
                            </td>
                        </tr>
    
    `;
}