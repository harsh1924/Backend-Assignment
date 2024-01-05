require('dotenv').config();
const port = process.env.PORT;
const app = require('./app');
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})