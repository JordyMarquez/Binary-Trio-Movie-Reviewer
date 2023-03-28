const newFormHandler = async (event) => {
    event.preventDefault();
  
    const rating = document.querySelector('#project-funding').value.trim();
    // const needed_funding = document.querySelector('#project-funding').value.trim();
    const comments = document.querySelector('#project-desc').value.trim();
  
    if ( rating && comments) {
      const response = await fetch(`/api/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comments }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to create project');
      }
    }
  };
  
  // const delButtonHandler = async (event) => {
  //   if (event.target.hasAttribute('data-id')) {
  //     const id = event.target.getAttribute('data-id');
  
  //     const response = await fetch(`/api/projects/${id}`, {
  //       method: 'DELETE',
  //     });
  
  //     if (response.ok) {
  //       document.location.replace('/profile');
  //     } else {
  //       alert('Failed to delete project');
  //     }
  //   }
  // };
  
  document
    .querySelector('.new-project-form')
    .addEventListener('submit', newFormHandler);
  
  document
    .querySelector('.project-list')
    .addEventListener('click', delButtonHandler);