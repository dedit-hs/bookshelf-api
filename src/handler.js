const { nanoid } = require('nanoid');
const { books } = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(13);
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const AllBooksToDisplay = books.map((displayBook) => ({
    id: displayBook.id,
    name: displayBook.name,
    publisher: displayBook.publisher,
  }));
  if (name) {
    const filteredBooksByName = books.filter((book) => book.name.toLowerCase()
      .indexOf(name.toLowerCase()) !== -1);
    const booksToDisplay = filteredBooksByName.map((displayBook) => ({
      id: displayBook.id,
      name: displayBook.name,
      publisher: displayBook.publisher,
    }));
    return {
      status: 'success',
      data: {
        books: booksToDisplay,
      },
    };
  }

  if (reading) {
    if (reading === '1') {
      const filteredReadingBooks = books.filter((book) => book.reading === true);
      const booksToDisplay = filteredReadingBooks.map((displayBook) => ({
        id: displayBook.id,
        name: displayBook.name,
        publisher: displayBook.publisher,
      }));
      return {
        status: 'success',
        data: {
          books: booksToDisplay,
        },
      };
    }
    if (reading === '0') {
      const filteredReadingBooks = books.filter((book) => book.reading === false);
      const booksToDisplay = filteredReadingBooks.map((displayBook) => ({
        id: displayBook.id,
        name: displayBook.name,
        publisher: displayBook.publisher,
      }));
      return {
        status: 'success',
        data: {
          books: booksToDisplay,
        },
      };
    }
  }

  if (finished) {
    if (finished === '1') {
      const filteredFinishedBooks = books.filter((book) => book.finished === true);
      const booksToDisplay = filteredFinishedBooks.map((displayBook) => ({
        id: displayBook.id,
        name: displayBook.name,
        publisher: displayBook.publisher,
      }));
      return {
        status: 'success',
        data: {
          books: booksToDisplay,
        },
      };
    }
    if (finished === '0') {
      const filteredFinishedBooks = books.filter((book) => book.finished === false);
      const booksToDisplay = filteredFinishedBooks.map((displayBook) => ({
        id: displayBook.id,
        name: displayBook.name,
        publisher: displayBook.publisher,
      }));
      return {
        status: 'success',
        data: {
          books: booksToDisplay,
        },
      };
    }
  }

  return {
    status: 'success',
    data: {
      books: AllBooksToDisplay,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  }
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
