const newFormHandler = async (event) => {
    event.preventDefault();
    const rating = document.querySelector('#movie-rating').value.trim();
    // const needed_funding = document.querySelector('#project-funding').value.trim();
    const comments = document.querySelector('#movie-comments').value.trim();
    
    if (rating && comments) {
      const response = await fetch(`/api/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comments, movie_id: window.location.href.split('/')[4] }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to create a review');
      }
    }
  };
  
  const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete review');
      }
    }
  };
  
  //console.log('window.location.href :>> ', window.location.href.split('/')[4]);

  document
    .querySelector('.new-project-form')
    .addEventListener('submit', newFormHandler);
  
  document
    .querySelector('.project-delete')
    .addEventListener('click', delButtonHandler);