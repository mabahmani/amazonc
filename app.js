var Crawler = require("crawler");

let reviews = [];

var c = new Crawler({
    maxConnections: 10,
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;

            $('.review').each(function(index) {
                let review = {
                    name: $('.a-profile-name', this).text().trim(),
                    rate: $('.a-icon-alt', this).text().trim(),
                    title: $('.review-title', this).text().trim(),
                    date: $('.review-date', this).text().trim(),
                    text: $('.review-text', this).text().trim()
                };
                //reviews.push(review);
                console.log(JSON.stringify(review));
            });
        }
        done();
    }
});

c.queue('https://www.amazon.com/product-reviews/B073YTMMQS/ref=cm_cr_arp_d_viewopt_srt?reviewerType=all_reviews&pageNumber=0');