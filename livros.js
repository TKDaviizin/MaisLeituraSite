// Obtém os elementos do HTML
const booksContainer = document.getElementById('books-container');
const paginationContainer = document.getElementById('pagination-container');

// Configurações de paginação
const booksPerPage = 14; // Alterado para 20 livros por página
let currentPage = 1;
let allBooks = [];

// Função para buscar os dados do JSON
async function fetchBooks() {
    try {
        const response = await fetch('livros.json'); 
        if (!response.ok) {
            throw new Error('Erro ao carregar o JSON dos livros');
        }
        allBooks = await response.json();
        renderPage(currentPage);
        setupPagination();
    } catch (error) {
        console.error('Houve um problema com a operação fetch:', error);
        booksContainer.innerHTML = '<p>Não foi possível carregar os livros. Tente novamente mais tarde.</p>';
    }
}

// Função para renderizar os livros da página atual
function renderPage(page) {
    booksContainer.innerHTML = ''; // Limpa o container para a nova página
    
    const startIndex = (page - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = allBooks.slice(startIndex, endIndex);

    booksToShow.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
    bookCard.innerHTML = `
            <img src="${book.imagem}" alt="Capa do livro ${book.titulo}" style="width: 100%; display: block;">
            <div style="padding: 15px;">
                <h2 style="margin: 0; font-size: 1.1em;">${book.titulo}</h2>
                <h3 style="margin: 5px 0 0; font-size: 0.95em; color: #888;">Quantidade: ${book.quantidade}</h3>
                <p style="margin: 5px 0 0; font-size: 0.9em; color: #333;">${book.autor}</p>
                <a href="/livrodetalhe.html?id=${book.id}" class="details-btn">Ver detalhes</a>
            </div>
        `;
        
        booksContainer.appendChild(bookCard);
    });
}
        

// Função para configurar e exibir os botões de paginação
function setupPagination() {
    paginationContainer.innerHTML = ''; // Limpa os botões anteriores
    
    const pageCount = Math.ceil(allBooks.length / booksPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = 'pagination-btn';

        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderPage(currentPage);
            updatePaginationButtons();
        });
        
        paginationContainer.appendChild(pageButton);
    }
}

// Função para atualizar o estado ativo dos botões de paginação
function updatePaginationButtons() {
    const buttons = document.querySelectorAll('.pagination-btn');
    buttons.forEach(button => {
        if (parseInt(button.innerText) === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Inicia o processo quando a página carrega
document.addEventListener('DOMContentLoaded', fetchBooks);