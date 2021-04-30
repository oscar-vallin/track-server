require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

//middlware;
app.use(express.json());
app.use(morgan('tiny'));

const mongoUri = 'mongodb+srv://vallin:vallin1993@cluster0.ztuvu.mongodb.net/trackDataBase?retryWrites=true&w=majority';

mongoose.connect(mongoUri,{         
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.connection.on('connected', () => {
    console.log('connected to mongo instance!')
});
mongoose.connection.on('error', (err) => {
    console.error('Erro connecting mong', err);
});

//routes
app.use('/users', require('./routes/userRoutes'));
app.use('/tracks', require('./routes/trackRoutes'));

app.listen(5001, () => {
    console.log('server up!');
});