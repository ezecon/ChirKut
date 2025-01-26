const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors');
const mongoose = require('mongoose');

const app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());
const port = 3000;

//meQli7KSn320Eozl

//mongodb
mongoose.connect('mongodb+srv://mdeconozzama:meQli7KSn320Eozl@cluster0.soojn.mongodb.net/data?retryWrites=true&w=majority&appName=Cluster0',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Connection error:", err));


// Routes
const messages = require('./routes/messages.js');
app.use('/api/v2/messages', messages);

const authRoutes = require('./routes/auth');
app.use('/api/v2/auth', authRoutes);

const authLogin = require('./Verification/Auth.js');
app.use('/api/v2/auth-login', authLogin);

const authVerify = require('./Verification/verifytoken.js');
app.use('/api/v2/auth-user-info', authVerify);

const user = require('./routes/User.js');
app.use('/api/v2/users', user);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
