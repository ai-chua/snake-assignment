import { appFactory } from './utilities/app';
import { PORT } from './consts';
import { startNewGame } from './api/get_new';
import { validateCurrentGame } from './api/post_validate';
var app = appFactory();
app.get('/new', startNewGame);
app.post('/validate', validateCurrentGame);
app.use(function (req, res, next) {
    res.status(405).send({ error: 'Method Not Allowed' });
});
app.listen(PORT, function () {
    console.log("Snake server up on port ".concat(PORT));
});
