function filterArticles(articleType) {
  const articles = document.querySelectorAll('.item-box');

  articles.forEach((article) => {
    const hidden = articleType !== 'all' && !article.classList.contains(articleType);
    article.classList.toggle('hidden', hidden);
  });

  document.querySelectorAll('[data-article-filter]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.articleFilter === articleType));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-article-filter]').forEach((button) => {
    button.addEventListener('click', () => filterArticles(button.dataset.articleFilter));
  });
});
