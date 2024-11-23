function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const genre = document.getElementById("genre").value;
  const releaseYear = document.getElementById("releaseYear").value;
  const isWatched = document.getElementById("isWatched").checked;

  const film = {
    title: title,
    genre: genre,
    releaseYear: releaseYear,
    isWatched: isWatched,
  };

  if(validate.isValid) {
    addFilm(film)
  }
}

async function addFilm(film) {
  await fetch("https://sb-film.skillbox.cc/films", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      email: "ovikdevil@gmail.com",
    },
    body: JSON.stringify(film),
  });
  renderTable();
}


async function renderTable() {
  const filmsResponse = await fetch("https://sb-film.skillbox.cc/films", {
    headers: {
      email: "ovikdevil@gmail.com",
    },
  });
  const films = await filmsResponse.json();

  const filmTableBody = document.getElementById("film-tbody");

  // Clear table body first
  filmTableBody.innerHTML = "";

  // Check filter params
  const filteredArray = filterArr(films)

  // Check sort params
  const sortRule = document.querySelector('#selectSort').value;
  const sortedArray = sortArr(filteredArray, sortRule)

  // Then add new rows
  sortedArray.forEach((film, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${film.title}</td>
      <td>${film.genre}</td>
      <td>${film.releaseYear}</td>
      <td>${film.isWatched ? "Да" : "Нет"}</td>
    `;
    filmTableBody.appendChild(row);

    // add delete btn
    const tdEl = document.createElement('td');
    const deleteFilmBtn = document.createElement('button');
    deleteFilmBtn.textContent = 'Удалить'
    deleteFilmBtn.classList.add('film-table__delete-btn')
    tdEl.append(deleteFilmBtn)
    row.append(tdEl)

    //add delete btn logic
    deleteFilmBtn.addEventListener('click', async function () {
      await fetch(`https://sb-film.skillbox.cc/films/${film.id}`, {
        method: 'DELETE',
        headers: {
          email: "ovikdevil@gmail.com",
        },
      });
      renderTable()
    });
  });
  document.querySelector('#film-form').reset()
}

document.querySelector('#selectSort').addEventListener('change', function () {
  renderTable()
});

document.querySelector('#delete-all-btn').addEventListener('click', async function () {
  await fetch('https://sb-film.skillbox.cc/films/', {
    method: 'DELETE',
    headers: {
      email: "ovikdevil@gmail.com",
    },
  });
  renderTable()
});

function sortArr(array, rule) {                           // Логика сортировки
  let sortedArr = array                                 // Создаю массив, куда изначально падает массив из локалки
  switch (rule) {                                         // Дальше через switch проверяю разные варианты сортировки: они
    case 'title':                                     // меняются в зависимости от того, что передали в rule, а в rule 
      sortedArr = array.sort(function (a, b) {        // мы передаем значение селекта,
        if (a.title > b.title) {                // которые соотвествуют ключам в объекте film
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      })
      break;
    case 'genre':
      sortedArr = array.sort(function (a, b) {
        if (a.genre > b.genre) {
          return 1;
        }
        if (a.genre < b.genre) {
          return -1;
        }
        return 0;
      })
      break
    case 'releaseYear':
      sortedArr = array.sort(function (a, b) {
        if (a.releaseYear > b.releaseYear) {
          return -1;
        }
        if (a.releaseYear < b.releaseYear) {
          return 1;
        }
        return 0;
      })
      break;
    case 'isWatched':
      sortedArr = array.sort(function (a, b) {
        if (a.isWatched > b.isWatched) {
          return -1;
        }
        if (a.isWatched < b.isWatched) {
          return 1;
        }
        return 0;
      })
      break;
    case 'isNotWatched':
      sortedArr = array.sort(function (a, b) {
        if (a.isWatched > b.isWatched) {
          return 1;
        }
        if (a.isWatched < b.isWatched) {
          return -1;
        }
        return 0;
      })
      break;
  }
  return sortedArr;                                               // Возвращаю сортированный массив
}

document.querySelector('#titleSort').addEventListener('input', function(e) {
  renderTable()
});
document.querySelector('#genreSort').addEventListener('input', function(e) {
  renderTable()
});
document.querySelector('#releaseYearSort').addEventListener('input', function(e) {
  renderTable()
});

function filterArr(array) {
  const titleValue = document.querySelector('#titleSort').value;
  const genreValue = document.querySelector('#genreSort').value;
  const releaseYearValue = document.querySelector('#releaseYearSort').value;
  let filteredArray = array
  if(titleValue) {
    filteredArray = filteredArray.filter((film) => {
      return film.title.toLowerCase().startsWith(titleValue.toLowerCase())
    })
  }

  if (genreValue) {
    filteredArray = filteredArray.filter((film) => {
      return film.genre.toLowerCase().startsWith(genreValue.toLowerCase())
    })
  }
  
  if (releaseYearValue) {
    filteredArray = filteredArray.filter((film) => {
      return film.releaseYear.toLowerCase().startsWith(releaseYearValue.toLowerCase())
    })
  }
  return filteredArray
}

const validate = new JustValidate('#film-form')

validate.
      addField('#title', [
        {
          rule: 'required',
          errorMessage: 'Заполните название фильма',
        }
      ])
      .addField('#genre', [
        {
          rule: 'required',
          errorMessage: 'Заполните жанр фильма',
        },
        {
          rule: 'minLength',
          value: 3,
          errorMessage: 'Жанр должен состоять минимум из трех символов',
        },
      ])
      .addField('#releaseYear', [
        {
          rule: 'required',
          errorMessage: 'Заполните год выпуска'
        },
        {
          rule: 'minLength',
          value: 4,
          errorMessage: 'Жанр должен состоять минимум из трех символов',
        }
      ])

document
  .getElementById("film-form")
  .addEventListener("submit", handleFormSubmit);

// Display films on load
renderTable();
