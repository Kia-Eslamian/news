$(document).ready(function () {
    alert('Hello')
    getCategoryList();
});


function getCategoryList() {
    $.ajax({
        type: "GET",
        url: "http://localhost:1000/api/v1/private/article/category",
        success: function (response) {
            if (response.success === true) {
                console.log(response);
            }
        },
        error: function (error) {
            const alertId = Date.now();
            $('#alertWrapper').append(alertBox(alertId, 'error', 'error', error.responseJSON.message));
        }
    });
}