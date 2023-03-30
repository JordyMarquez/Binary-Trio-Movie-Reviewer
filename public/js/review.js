// Form that makes the POST request to the Controller to create a Review
const newFormHandler = async (event) => {
    event.preventDefault();
    const rating = document.querySelector('#movie-rating').value.trim();
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

// Form that makes the DELETE request to the Controller to delete a Review
  
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
  
  document
    .querySelector('.new-review-form')
    .addEventListener('submit', newFormHandler);
  
  document
    .querySelector('.review-delete')
    .addEventListener('click', delButtonHandler);