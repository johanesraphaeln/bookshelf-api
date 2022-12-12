const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

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

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
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
    } else {
      const response = h.reponse({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
    }
  }
};

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  if (books.length === 0) {
    return {
      status: 'success',
      data: {
        books: [],
      },
    };
  } else if (name) {
    const filteredNamedBook = [];
    const namedBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

    for (let i = 0; i < namedBook.length; i++) {
      filteredNamedBook.push({
        id: namedBook[i].id,
        name: namedBook[i].name,
        publisher: namedBook[i].publisher,
      });
    }

    return {
      status: 'success',
      data: {
        books: filteredNamedBook,
      },
    };
  } else if (reading) {
    if (reading === '1') {
      const readBook = [];
      for (let i = 0; i < books.length; i++) {
        if (books[i].reading === true) {
          readBook.push({
            id: books[i].id,
            name: books[i].name,
            publisher: books[i].publisher,
          });
        }
      }
      return {
        status: 'success',
        data: {
          books: readBook,
        },
      };
    } else if (reading === '0') {
      const unreadBook = [];
      for (let i = 0; i < books.length; i++) {
        if (books[i].reading === false) {
          unreadBook.push({
            id: books[i].id,
            name: books[i].name,
            publisher: books[i].publisher,
          });
        }
      }
      return {
        status: 'success',
        data: {
          books: unreadBook,
        },
      };
    }
  } else if (finished) {
    if (finished === '1') {
      const finishedBook = [];
      for (let i = 0; i < books.length; i++) {
        if (books[i].finished === true) {
          finishedBook.push({
            id: books[i].id,
            name: books[i].name,
            publisher: books[i].publisher,
          });
        }
      }
      return {
        status: 'success',
        data: {
          books: finishedBook,
        },
      };
    } else if (finished === '0') {
      const unfinishedBook = [];
      for (let i = 0; i < books.length; i++) {
        if (books[i].finished === false) {
          unfinishedBook.push({
            id: books[i].id,
            name: books[i].name,
            publisher: books[i].publisher,
          });
        }
      }
      return {
        status: 'success',
        data: {
          books: unfinishedBook,
        },
      };
    }
  }

  const filteredBook = [];
  for (let i = 0; i < books.length; i++) {
    filteredBook.push({
      id: books[i].id,
      name: books[i].name,
      publisher: books[i].publisher,
    });
  }

  return {
    status: 'success',
    data: {
      books: filteredBook,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

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
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    const index = books.findIndex((book) => book.id === bookId);
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
        reading,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

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
