
import { fetchBreeds, fetchCatByBreed } from './cat-api';


const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');


function showLoader() {
  loader.style.display = 'block';
}


function hideLoader() {
  loader.style.display = 'none';
}


function showError() {
  error.classList.add('show');
}


function hideError() {
  error.classList.remove('show');
}


function toggleLoadingElements(loading) {
  breedSelect.disabled = loading;
  catInfo.style.display = loading ? 'none' : 'block';
  loader.style.display = loading ? 'block' : 'none';
}


function populateBreedsSelect(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });


    new SlimSelect({
      select: breedSelect,
      showSearch: false,
      placeholder: 'Select Breed'
    });
  }


function showCatInfo(catInfoData) {
  catInfo.innerHTML = `
    <img src="${catInfoData.image}" alt="Cat Image" />
    <p><strong>Name:</strong> ${catInfoData.name}</p>
    <p><strong>Description:</strong> ${catInfoData.description}</p>
    <p><strong>Temperament:</strong> ${catInfoData.temperament}</p>
  `;
}


function clearCatInfo() {
  catInfo.innerHTML = '';
}


function onBreedSelectChange() {
  const selectedBreedId = breedSelect.value;

  if (selectedBreedId) {
    toggleLoadingElements(true);
    clearCatInfo();
    hideError();

    fetchCatByBreed(selectedBreedId)
    .then(data => {
            const catData = data[0];
      const breed = catData.breeds[0];
      const catInfo = {
        name: breed.name,
        description: breed.description,
        temperament: breed.temperament,
        image: catData.url,
      };
      return catInfo;
    })
      .then(catInfoData => {
        showCatInfo(catInfoData);
        toggleLoadingElements(false);
      })
      .catch((error) => {
        console.log(error)
        showError();
        toggleLoadingElements(false);
      });
  } else {
    clearCatInfo();
  }
}


breedSelect.addEventListener('change', onBreedSelectChange);


toggleLoadingElements(true);

fetchBreeds()
   .then(data => data.map(breed => ({ id: breed.id, name: breed.name })))
   .then(breeds => {
    breedSelect.style.display = 'block'
    populateBreedsSelect(breeds);
    toggleLoadingElements(false);
  })
  .catch((error) => {
    console.log(error)
    showError();
    toggleLoadingElements(false);
  });


hideError()