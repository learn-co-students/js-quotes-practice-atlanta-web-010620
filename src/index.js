// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener('DOMContentLoaded', (event) => {
    
    const quoteList = document.querySelector('#quote-list')

    fetch('http://localhost:3000/quotes?_embed=likes')
    .then((response) => {
        return response.json();
    })
    .then((quotes) => {
        quotes.forEach(quote => renderQuote(quote));
    });

    function renderQuote(quote) {
        const listQuote = document.createElement('li')
        listQuote.className = 'quote-card'

        const blockQuote = document.createElement('blockquote')
        blockQuote.className = "blockquote"

        const quoteP = document.createElement('p')
        quoteP.className = "mb-0"
        quoteP.innerText = quote.quote 

        const quoteFooter = document.createElement('footer')
        quoteFooter.className = "blockquote-footer"
        quoteFooter.innerText = quote.author

        let br = document.createElement('br')

        const likeButton = document.createElement('button')
        likeButton.className = 'btn-success'
        likeButton.dataset.id = quote.id
        likeButton.innerText = "Likes: "

        const likeSpan = document.createElement('span')
        if (quote.likes) {
            likeSpan.innerText = quote.likes.length
        } else {
            likeSpan.innerText = 0
        }

        likeButton.addEventListener('click', function(e){
            createLike(e)
        })
        likeButton.appendChild(likeSpan)

        const deleteButton = document.createElement('button')
        deleteButton.innerText = 'Delete'
        deleteButton.className = 'btn-danger'
        deleteButton.dataset.id = quote.id
        deleteButton.addEventListener('click', function(e) {
            deleteQuote(e)
        })

        blockQuote.appendChild(quoteP)
        blockQuote.appendChild(quoteFooter)
        blockQuote.appendChild(br)
        blockQuote.appendChild(likeButton)
        blockQuote.appendChild(deleteButton)

        listQuote.appendChild(blockQuote)
        quoteList.appendChild(listQuote)
    }

    const quoteForm = document.querySelector('#new-quote-form')

    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault()
        const data = {
            quote: `${e.target.querySelector('#new-quote').value}`,
            author: `${e.target.author.value}`
        }

        fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
        renderQuote(data);
    })

    })


    function deleteQuote(e) {
        quote_id = e.target.dataset.id

        fetch(`http://localhost:3000/quotes/${quote_id}`, {
        method: 'DELETE'
        })
        .then((response) => response.json())
        .then((data) => {
            debugger
            e.target.parentElement.parentElement.remove()
        })}

    function createLike(e) {
        const data = {
            quoteId: parseInt(e.target.dataset.id),
            createdAt: Date.now()
        }

        const likeSpan = e.target.querySelector('span')

        fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
        likeSpan.innerText = parseInt(likeSpan.innerText) + 1
    })}
});