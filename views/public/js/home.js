$(document).ready(function () {
    $('#main-container').empty();

    getArticleList();


    $('#all').click(function (e) {
        $('#main-container').empty();

        e.preventDefault();

        getArticleList()
    });

    $('#World').click(function (e) {
        $('#main-container').empty();
        e.preventDefault();

        getArticleList("http://localhost:1000/api/v1/public/article?category=63f7a17dc7d6cb7e9b54d4bf")


    });

    $('#Politics').click(function (e) {
        $('#main-container').empty();

        e.preventDefault();

        getArticleList("http://localhost:1000/api/v1/public/article?category=63f7a175c7d6cb7e9b54d4bd")
    });

    $('#Business').click(function (e) {
        $('#main-container').empty();

        e.preventDefault();

        getArticleList("http://localhost:1000/api/v1/public/article?category=63f7a16cc7d6cb7e9b54d4bb")
    });

    $('#Science').click(function (e) {
        $('#main-container').empty();

        e.preventDefault();

        getArticleList("http://localhost:1000/api/v1/public/article?category=63f7a157c7d6cb7e9b54d4b9")
    });

    $('#Art').click(function (e) {
        $('#main-container').empty();

        e.preventDefault();

        getArticleList("http://localhost:1000/api/v1/public/article?category=63f7a128c7d6cb7e9b54d4b7")
    });

});




function getArticleList(url = "http://localhost:1000/api/v1/public/article") {
    $.ajax({
        type: "GET",
        url,
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