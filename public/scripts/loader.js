// loader.js
function showLoader() {                                                                 
    const loader = document.querySelector('.loader');  
    if (loader) {
        loader.style.display = 'block';
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}
