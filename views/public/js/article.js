$(document).ready(function () {

    getArticleList();

    $('#saveBtn').click(function (e) {
        e.preventDefault();

        createNewArticle();
    });
});

function getArticleList() {
    $.ajax({
        type: "GET",
        url: "http://localhost:1000/api/v1/public/article",
        success: function (response) {
            if (response.success === true) {
                const articleList = response.data.result;

                for (let index = 0; index < articleList.length; index++) {
                    const article = articleList[index];

                    $('#articleTbody').append(trGenerator({
                        articleTitle: article.title,
                        article_id: article._id,
                        index: index + 1,
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

function trGenerator({ article_id, articleTitle, index }) {
    return `
    <tr>
        <th scope="row">${index}</th>
        <td >${articleTitle}</td>
        <td class="d-flex flex-row align-items-baseline justify-content-evenly">
            <a class="w-100 btn btn-outline-primary me-1" href="http://localhost:1000/admin/article/update/${article_id}">edit</a>
            <a class="w-100 btn btn btn-outline-secondary" href="http://localhost:1000/article/${article_id}">show</a>
        </td>
    </tr>
    
    `;
}

function createNewArticle() {

    const title = $('#titleInput').val();
    const page_title = $('#pageTitleInput').val();
    const summary = $('#summaryInput').val();
    const image = $('#imageInput').val();
    const description = $('#descriptionInput').val();

    const data = {
        title,
        page_title,
        // url,
        description,
        summary,
        image
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:1000/api/v1/private/article",
        data,
        success: function (response) {
            if (response.success === true) {
                location.reload();
            }
        },
        error: function (error) {
            alert("error");
            console.log(error)
        }
    });
};
