$(document).ready(function() {
    // *********  GLOBAL VARIABLES *******
    // Initialize prepending URL for thumbnail
    var prependingThumbnailURL = 'https://static01.nyt.com/'
    
    // Step 0: Initialize dropdown menu
    $('.selection.dropdown').dropdown()
    // Hide test article
    $('#test-article').hide()

    // Step 0: Create click handler for search button
    $("#search-button").on("click", function(event) {
      event.preventDefault()
      clearArticles()
   
      
    // 1. Create request
    // 1A. Retrieve the value from the search term input
    var searchTerm = $("#search-term").val().trim()
    // 1B. Retrieve the value from the dropdown
    var numberOfRecordToRetrieve = $('#records-number').val()
    console.log(numberOfRecordToRetrieve)
    // Alternative URL builder using string interpolation
    // var queryURL = `http://api.nytimes.com/svc/search/v2/articlesearch.json?fq=${searchTerm}&begin_date=${startYear}&end_date=${endYear}&api-key=${apiKey}`
    var queryURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json'
    var beginDate = $('#begin-date').val()
    var endDate = $('#end-date').val()
    var apiKey = '3cce17232fc34e54860f952d3509ea53'

    queryURL += '?' + $.param({
      'api-key': apiKey,
      'q': searchTerm
    })
    // Add optional queries - begin_date
    if (beginDate) {
      beginDate = beginDate.replace(/-/g, '') // Regex to replace all occurences of '-' with null
      console.log('Begin Date:' + beginDate)
      queryURL += '&' + $.param({
        'begin_date': beginDate
      })
    }
    // Add optional queries - end_date
    if (endDate) {
      endDate = endDate.replace(/-/g, '') // Regex to replace all occurences of '-' with null
      console.log('End Date:' + endDate)
      queryURL += '&' + $.param({
        'end_date': endDate
      })
    }
    // *** PRINT queryURL
    console.log(queryURL)

  ////// END Step: 1


    // 2. AJAX request
    $.ajax({
      url: queryURL,
      method: "GET"
    })

    // // Wait until ajax is done then call the callback function containing data retrieved
      .then(function(result) {

        // !!! Parse through AJAX request individual articles
        for (var i = 0; i < numberOfRecordToRetrieve; i++) {
          // ** Store retrieved articles in variable
          var article = result.response.docs[i]

          // ** Error handler: If the article array returns empty, exit out of for loop
          if (article === undefined) {
            console.log('NO MORE ARTICLES') // ****************
            break
          }

          ////// 2A. Parse through the response and store in variables
          //// Store article URL
          var articleURL =  article.web_url
          console.log('Article URL: ' + articleURL)

          //// Store article thumbnail
          var articleThumbnail = article.multimedia[0].url
          articleThumbnail = prependingThumbnailURL + articleThumbnail
          console.log('Article Thumbnail: ' + articleThumbnail) // ****************

          ////  Store article snippet
          var articleSnippet = article.snippet
          console.log('Article Snippet: ' + articleURL)
          

          ////  Store headline
          var headLine = article.headline.main
          console.log('Headline: '+ headLine)

          //// Store date
          var publicationDate = article.pub_date
          publicationDate = new Date(publicationDate)
          console.log(publicationDate)

          //// Store source
          var articleSource = article.source
          console.log(articleSource)

          ////// 2B. Create elements and assign querried data
          //// Create .ui.item container to hold the article
          // var articlePanel = $('div.ui.items').append('<div class="item">')
          var articlePanel = $('<div class="item">')
          
          // Create img tag
          var articleImgDiv = $('<div class="image">')
          // Create <img> tag that goes within div.image
          var articleImgDivThumbnail = $('<img>')

          // Create content holder div.content
          var articleContent = $('<div class="content">')

          // // Create header
          var articleContentHeader = $('<a class="header">')

          // // Create meta info
          var articleContentMeta = $('<div class="meta">')
          // // Create <span> that goes within div.meta
          var articleContentMetaDate = $('<span>')

          // // Create div.description
          var articleContentDescription = $('<div class="description">')
          // // Create <p> tag that goes within div.description
          var articleContentDescriptionPtag = $('<p>')

          // // Create div.extra
          var articleContentExtra = $('<div class="extra">')


          ////// 2C. Append elements to proper containers
          // Attach div.item
          $('#articles-container').append(articlePanel)

          // Image section
          articlePanel.append(articleImgDiv)
          articleImgDiv.append(articleImgDivThumbnail)

          // Content section
          articlePanel.append(articleContent)
          //// Header
          articleContent.append(articleContentHeader)
          
          //// Meta
          articleContent.append(articleContentMeta)
          articleContentMeta.append(articleContentMetaDate)

          //// Description
          articleContent.append(articleContentDescription)
          articleContentDescription.append(articleContentDescriptionPtag)

          //// Extra
          articleContent.append(articleContentExtra)


          ////// 2D. Assign querried values to created elements
          // Assign thumbnail
          console.log(articleThumbnail)
          articleImgDivThumbnail.attr('src', articleThumbnail)
          // Assign header
          articleContentHeader.text(headLine)
          // Assign meta
          articleContentMetaDate.text(publicationDate)
          // Assign snippet
          articleContentDescriptionPtag.text(articleSnippet)
          // Assign source
          articleContentExtra.text(articleSource)
          
        }




      }).fail(function(err) {
        throw err;

      })

  })

  function clearArticles() {
    $('#articles-container').html('')
  }

})
