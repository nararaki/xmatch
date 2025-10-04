const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const maxChecked = 1; 

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', async () => {
      const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
      if (checkedCount >= maxChecked) {
        checkboxes.forEach((cb) => {
          if (!cb.checked) {
            cb.disabled = true; 
          }
        });
      } else {
        checkboxes.forEach((cb) => cb.disabled = false); 
      }
    });
  });