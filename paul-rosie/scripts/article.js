'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// DONE-REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// DONE-COMMENT: Why isn't this method written as an arrow function?
// This is because arrow functions do not inherit the contextual this. property and cannot change them. They only have access to the parent and nothing else.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT-DONE: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // The below is a ternary opperator. It's basically shorthand for an if statement, which is what we originally had in the code below.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// DONE-REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// DONE-REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT-DONE: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// Article.loadAll is called in the "Article.fetchAll" function on line 44. rawData is now a property of localStorage, and a parameter of Article.loadAll. In previous labs it was called in a global scope while now it is called within a function.
Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
  articleView.initIndexPage();
};

// DONE-REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  //
  if (localStorage.rawData) {
   var articleStorage= JSON.parse(localStorage.rawData);
    Article.loadAll(articleStorage);

  } else {
  // we need to parse the hackerIpsum.js file in the data directory. COMMENT REQUIRED: How we determined the sequence of code execution--> We worked with Travis to help us understands how to use the code we learned in class yesterday (AJAX calls in the pokeapi and swapi api websites).
$.ajax({
    url:'data/hackerIpsum.json',
    method:'GET',
    headers:{},
    success: function(data, message, xhr){
    console.log(data);

  localStorage.setItem("rawData", JSON.stringify(data));
  }
})
Article.fetchAll();
}};
