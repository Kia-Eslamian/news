$(document).ready(function () {




    $('#login').click(function (e) {
        e.preventDefault();

        const mobile = $('#mobile').val();
        const password = $('#password').val();

        console.log(
            mobile,
            password)

        if (!mobile || !password) {
            alert('fields can not be empty');
            return;
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:1000/api/v1/public/auth",
            data: {
                mobile, password
            },
            dataType: "dataType",
            success: function (response) {
                if (response.success) {

                    // $('#alertWrapper').append(alertBox(alertId, 'success', 'successful', response.message));
                    window.location.replace('http://localhost:1000/admin/articles');

                }
            },
            error: function (error) {
                console.log("error => ",error);
            }
        });

    });
});