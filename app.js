var Crawler = require("crawler");
const express = require('express')
const app = express()
const port = 3000

app.get('/', function (req, res){
let reviews = [];

var page = 'https://www.amazon.com/product-reviews/{{isbn}}/ref=cm_cr_arp_d_viewopt_srt?reviewerType=all_reviews&pageNumber={{page}}'

page = page.replace('{{isbn}}',req.query.isbn);
page = page.replace('{{page}}',req.query.page);

var c = new Crawler({ maxConnections : 10 });

function crawlerPromise(options) {
  return new Promise((resolve, reject) => {
    options.callback = (err, res, done) => {
      if (err) {
        reject(err);
      } else {
        var $ = res.$;
            console.log(page);
            $('.review').each(function(index) {
                let review = {
                    name: $('.a-profile-name', this).text().trim(),
                    title: $('.review-title', this).text().trim(),
                    rate: $('.a-icon-alt', this).text().trim(),
                    date: $('.review-date', this).text().trim(),
                    text: $('.review-text', this).text().trim()
                    };
                    reviews.push(review);
                });
        resolve(reviews);
      }
      done();
    }
    c.queue(options);
  });
}

crawlerPromise({ uri: page })
    .then((reviews) => {res.json(reviews)})
    .catch((error) => {console.log(error)});
});

app.get('/goodreads', function (req, res){
  let reviews = [];
  
  var page = 'https://www.goodreads.com/api/reviews_widget_iframe?isbn={{isbn}}&page={{page}}'
  
  page = page.replace('{{isbn}}',req.query.isbn);
  page = page.replace('{{page}}',req.query.page);
  
  var c = new Crawler({ maxConnections : 10 });
  
  function crawlerPromise(options) {
    return new Promise((resolve, reject) => {
      options.callback = (err, res, done) => {
        if (err) {
          reject(err);
        } else {
          var $ = res.$;
              console.log(page);
              $('.gr_review_container').each(function(index) {
                  let review = {
                      name: $('.gr_review_by', this).text().trim().replace("By ",""),
                      date: $('.gr_review_date', this).text().trim(),
                      text: $('.gr_review_text', this).text().trim().replace("...more",""),
                      };
                      reviews.push(review);
                  });
          resolve(reviews);
        }
        done();
      }
      c.queue(options);
    });
  }
  
  crawlerPromise({ uri: page })
      .then((reviews) => {res.json(reviews)})
      .catch((error) => {console.log(error)});
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`))