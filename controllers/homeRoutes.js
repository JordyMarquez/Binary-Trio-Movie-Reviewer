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
    
    // Sort reviews by created date to show the latest reviewer
    movies.forEach(movie => {
        movie.reviews.sort((a,b) => {
            return a.createdAt < b.createdAt ? 1 : -1;
        })
    })

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      movies, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// API route to get movie by id
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
