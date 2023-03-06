module.exports.dashboard = function(req, res) {
    console.log('Dashboard Controller : Render Dashboard Page');

    return res.render('dashboard', {
        title: "Dashboard page EJS"
    });
}