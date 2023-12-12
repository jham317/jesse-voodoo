const port = 4000;
app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, HEAD, GET, PUT, POST, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

  useEffect(() => {
    fetch('/bacon')
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

app.get('/bacon', (req, res) => res.status(200).json('🥓'));
