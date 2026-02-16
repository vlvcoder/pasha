const MIDDLWARE_ENABLED = true;
const mockDB = require('./ma-mock-db.json');

module.exports = (req, res, next) => {
    const urlPath = req.url.split(/[?#]/)[0];

    if (MIDDLWARE_ENABLED) {
        switch (urlPath) {
            case '/bla':
                res.status(200);
                res.json({
                    bla: "blabla",
                });
                return;
            case '/labels':
                if (req.method === 'POST') {
                    res.json([]);
                    return;
                }
                break;
            default:
                break;
        }
    }
    next();
};
