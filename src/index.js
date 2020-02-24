window.addEventListener('DOMContentLoaded', (event) => {
    // populate page with all quotes 
    renderQuotes(); 
    newQuoteButtonListener();
});

function renderQuotes(){
    const quoteList = document.querySelector("#quote-list")
    
    // clear list before rendering more 
    while (quoteList.firstChild){   
        quoteList.firstChild.remove();
    };
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(resp=>resp.json())
    .then(function(quotes){
        quotes.forEach(function(quote){
            const quoteList = document.querySelector("#quote-list")
            // create a list item for the quote 
            const quoteListItem = document.createElement('li'); 
            quoteListItem.className = "quote-card"; 
            const quoteBlockQuote = document.createElement('blockquote'); 
            quoteBlockQuote.className = "blockquote"; 
            
            const quotePara = document.createElement('p'); 
            quotePara.className = "mb-0";
            quotePara.innerText = quote.quote; 
            const quoteFooter = document.createElement('footer'); 
            quoteFooter.className = "blockquote-footer"; 
            quoteFooter.innerText = quote.author; 
            
            const linebreak = document.createElement('br'); 
            
            const btnSuccess = document.createElement('button'); 
            btnSuccess.dataset.id = quote.id; 
            btnSuccess.className = "btn-success";
            const btnSuccessSpan = document.createElement('span'); 
            btnSuccessSpan.value = quote.likes.length;   
            console.log(quote.likes.length)
            btnSuccess.innerText = `Likes: ${btnSuccessSpan.value}`
                                btnSuccess.addEventListener('click',function(e){
                                    likeQuote(this.dataset.id); 
                                })



            // debugger 
            const btnDanger = document.createElement('button'); 
            btnDanger.className = "btn-danger"; 
            btnDanger.innerText = "Delete"
            btnDanger.dataset.id = quote.id; 
            btnDanger.addEventListener('click',function(e){
                deleteQuote(this.dataset.id);
            })
            
            // append everything 
            quoteListItem.appendChild(quoteBlockQuote); 
            quoteBlockQuote.appendChild(quotePara); 
            quoteBlockQuote.appendChild(quoteFooter); 
            quoteBlockQuote.appendChild(linebreak); 
            quoteBlockQuote.appendChild(btnSuccess); 
            quoteBlockQuote.appendChild(btnDanger);
            quoteList.appendChild(quoteListItem);
        })
    })
}



function submitQuote(quoteText,authorName){
    objectData = {
        "quote":quoteText, 
        "author":authorName,
        "likes":[]
    }
    fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(objectData),
    })
    .then((response) => response.json())
    .then((data) => {
    console.log('Success:', data);
    })
    .then(renderQuotes())
    .catch((error) => {
    console.error('Error:', error);
    })
    
}

function deleteQuote(id){
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then((response) => response.json())
        .then((data) => {
        console.log('Success:', data);
        })
        .then(renderQuotes())
        .catch((error) => {
        console.error('Error:', error);
        });
    
}

function newQuoteButtonListener(){
    let newQuoteButton = document.querySelector(".btn-primary")
    newQuoteButton.addEventListener('click',function(e){
        let quoteText = document.querySelector("#new-quote").value;
        let authorName = document.querySelector("#author").value;
        submitQuote(quoteText,authorName); 
    })
}

function likeQuote(id){
    let intId = parseInt(id);
    let objectData =   {
        "quoteId": intId,
        "createdAt": Date.now()*0.001
    }; 

    fetch(`http://localhost:3000/likes`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(objectData),
    })
    .then((response) => response.json())
    .then((data) => {
        // debugger
    console.log('Success:', data);
    })
    .then(renderQuotes())
    .catch((error) => {
    console.error('Error:', error);
    })
}