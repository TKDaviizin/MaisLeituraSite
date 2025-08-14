// Obtém os elementos do HTML
const booksContainer = document.getElementById('books-container');
const paginationContainer = document.getElementById('pagination-container');

// Configurações de paginação
const booksPerPage = 14;
let currentPage = 1;
let allBooks = [];
const visiblePages = 5; // Número de botões de página visíveis (1, 2, 3, 4, 5)

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

    if (booksToShow.length === 0) {
        booksContainer.innerHTML = '<p>Nenhum livro encontrado para esta página.</p>';
        return;
    }

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
    
// Função para configurar e exibir os botões de paginação (LÓGICA CORRIGIDA)
function setupPagination() {
    paginationContainer.innerHTML = '';
    const pageCount = Math.ceil(allBooks.length / booksPerPage);

    if (pageCount <= 1) return;

    // Botão de voltar (<)
    const prevButton = createPaginationButton('<', currentPage > 1, () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevButton);

    const rangeStart = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const rangeEnd = Math.min(pageCount, rangeStart + visiblePages - 1);

    // Adiciona o botão da primeira página se não estiver no intervalo
    if (rangeStart > 1) {
        const firstPageButton = createPaginationButton(1, 1 !== currentPage, () => goToPage(1));
        paginationContainer.appendChild(firstPageButton);
        if (rangeStart > 2) {
            const dotsSpan = document.createElement('span');
            dotsSpan.innerText = '...';
            dotsSpan.className = 'dots';
            paginationContainer.appendChild(dotsSpan);
        }
    }

    // Adiciona os botões de página dentro do intervalo
    for (let i = rangeStart; i <= rangeEnd; i++) {
        const pageButton = createPaginationButton(i, i !== currentPage, () => goToPage(i));
        if (i === currentPage) {
            pageButton.classList.add('active'); // Adiciona a classe 'active' aqui
        }
        paginationContainer.appendChild(pageButton);
    }
    
    // Adiciona as reticências (...) e o botão da última página se necessário
    if (rangeEnd < pageCount) {
        if (rangeEnd < pageCount - 1) {
            const dotsSpan = document.createElement('span');
            dotsSpan.className = 'dots';
            paginationContainer.appendChild(dotsSpan);
        }
        const lastPageButton = createPaginationButton(pageCount, pageCount !== currentPage, () => goToPage(pageCount));
        paginationContainer.appendChild(lastPageButton);
    }

    // Campo de input para ir para a página
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = `1 - ${pageCount}`;
    input.className = 'page-input';
    
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const pageNum = parseInt(input.value);
            if (pageNum >= 1 && pageNum <= pageCount) {
                goToPage(pageNum);
            } else {
                alert(`Por favor, insira um número entre 1 e ${pageCount}.`);
            }
            input.value = '';
        }
    });
    
    paginationContainer.appendChild(input);

    // Botão de prosseguir (>)
    const nextButton = createPaginationButton('>', currentPage < pageCount, () => {
        if (currentPage < pageCount) {
            goToPage(currentPage + 1);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Função auxiliar para criar botões de paginação
function createPaginationButton(text, isEnabled, onClick) {
    const button = document.createElement('button');
    button.innerText = text;
    button.className = 'pagination-btn';
    if (!isEnabled) {
        button.disabled = true;
    }
    button.addEventListener('click', onClick);
    return button;
}

// Função para navegar para uma página específica
function goToPage(page) {
    currentPage = page;
    renderPage(currentPage);
    setupPagination(); // Chama setupPagination para recriar os botões
}

// Inicia o processo quando a página carrega
document.addEventListener('DOMContentLoaded', fetchBooks);