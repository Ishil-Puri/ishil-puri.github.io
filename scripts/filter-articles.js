function filterArticles(articleType) {
    const articles = document.querySelectorAll('.item-box');

    articles.forEach((article) => {
        if(articleType != "all"){
            if(!article.classList.contains(articleType)){
                article.classList.toggle('hidden');
            } else {
                article.classList.remove('hidden');
            }
        } else {
            article.classList.remove('hidden');
        }
    });
}
