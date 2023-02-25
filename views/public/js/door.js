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
            type: "post",
            url: "http://localhost:1000/api/v1/public/auth",
            data: {
                mobile, password
            },
            success: function (response) {
    
                if (response.success) {
    
                    window.location.replace('http://localhost:1000/admin/articles');
    
                } else if (!response.success) {
                    console.log("error => ", error.responseText);
                    alert(error.responseText);
                }
    
            },
            error: function (error) {
                console.log("error => ", error.responseText);
                alert(error.responseText);
            }
        });

    });
});