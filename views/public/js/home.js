$(document).ready(function () {

    getArticleList();



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

                    console.log(typeof article);
                    console.log(article);

                    $('#main-container').append(articleCardGenerator({
                        title: article.title,
                        summary: article.summary,
                        date: article.updatedAt,
                        id: article._id,
                        image: article.image
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


function articleCardGenerator({ title, summary, date, id, image }) {
    return `
        <article class="container articles-wrapper">
                <div class="row">
                    <div class="col-7 d-flex flex-column align-items-start">
                        <h5>
                           ${title}
                        </h5>
                        <h6>
                            ${summary}
                        </h6>

                        <p class="date">
                            ${date}
                        </p>
                        <a href="http://localhost:1000/article/${id}" class="align-self-start">Read more</a>
                    </div>
                    <div class="col-5 text-end">
                        <img src="http://localhost:1000/serve/${image}" alt="ddd">
                    </div>

                </div>
         </article>
    `;
}