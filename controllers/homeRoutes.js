const router = require('express').Router();
const sequelize = require('../config/connection');
const { Movie, User, Review } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all movies and JOIN with user data
    const movieData = await Movie.findAll({
      include: [
        {
          model: Review,
          include: [User]          
        },
      ], 
      attributes: {
        include: [
          [
            // Use plain SQL to add up the total mileage
            sequelize.literal(
              '(SELECT ROUND(AVG(rating),2) FROM review WHERE review.movie_id = movie.id)'
            ),
            'starAverage',
          ],
          // [
          //   // Use plain SQL to add up the total mileage
          //   sequelize.literal(
          //     ////'(SELECT u.name FROM user AS u JOIN review AS r JOIN movie AS m ON r.movie_id = m.id ON u.id = r.user_id WHERE r.movie_id = m.id ORDER BY r.created_at LIMIT 1)'
          //     '(SELECT u.name FROM review r INNER JOIN movie m ON r.movie_id = m.id INNER JOIN user u ON r.user_id = u.id WHERE m.id = r.movie_id ORDER BY r.updated_at DESC LIMIT 1)'
          //   ),
          //   'lastReviewName',
          // ],
        ],
      },
      order: [
        [
          "title",
          'ASC'
        ]
      ],
    });

    // Serialize data so the template can read it
    const movies = movieData.map((movie) => movie.get({ plain: true }));
    
    //console.log('object :>> ', movies[0].reviews[0].user.name);
    movies.forEach(movie => {
        movie.reviews.sort((a,b) => {
            return a.createdAt < b.createdAt ? 1 : -1;
        })
    })
    //console.log('movies :>> ', JSON.stringify(movies, null, 4));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      movies, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/movie/:id', withAuth, async (req, res) => {
  try {
    const movieData = await Movie.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          include: [User],
        },
      ],
      order: [
        [
          { model: Review },
          "created_at",
          'DESC'
        ]
      ],
    });

    const movie = movieData.get({ plain: true });
    console.log(JSON.stringify(movie,null,4));

    res.render('review', {
      ...movie,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/homepage');
    return;
  }

  res.render('login');
});

module.exports = router;
