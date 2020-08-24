$(".task").on('click', '.removetask', async function(e) {
    e.preventDefault();
    var id = $(this).data('id');
    var task = $("#" + id);
    var requestConfig = {
        type: "POST",
        url: "/tasks/deletetask/" + id,
    };
    await $.ajax(requestConfig).then(function () {
        task.hide();
        e.preventDefault();
        
    })
});