jQuery(function ($) {

  var file_frame;

  $(document).on('click', '#gallery-metabox a.gallery-add', function (e) {

    e.preventDefault();

    if (file_frame) file_frame.close();

    file_frame = wp.media.frames.file_frame = wp.media({
      title: $(this).data('uploader-title'),
      button: {
        text: $(this).data('uploader-button-text'),
      },
      multiple: true
    });

    file_frame.on('select', function () {
      var listIndex = $('#gallery-metabox-list li').index($('#gallery-metabox-list li:last')),
        selection = file_frame.state().get('selection');

      selection.map(function (attachment, i) {
        let noOfImages = document.querySelectorAll("#gallery-metabox-list li").length;
        
        let imageIds = [];
        for (let i = 1; i <= noOfImages; i++) {
          imageIds.push(parseInt(document.querySelector("#gallery-metabox-list > li:nth-child("+i+") > input[type=hidden]").value));
        }
        
        let currentId = parseInt(attachment['attributes']['id']);
        attachment = attachment.toJSON();
        index = listIndex + (i + 1);
        if (!imageIds.includes(currentId)) { 
            let galleryList = document.createElement("li");
            let galleryInput = document.createElement("input");
            let galleryImg = document.createElement("img");
            let galleryAnchorOne = document.createElement("a");   
            var galleryBreak = document.createElement("BR");
            let galleryAnchorTwo = document.createElement("a");
            let gallerySmall = document.createElement("small");

            galleryInput.setAttribute("type", "hidden");
            galleryInput.setAttribute("name", 'image_gallery_id['+index+']');
            galleryInput.setAttribute("value", attachment.id);

            galleryList.innerHTML = galleryInput.outerHTML;

            galleryImg.setAttribute("class", "image-preview");
            galleryImg.setAttribute("src", attachment.sizes.thumbnail.url);

            galleryList.innerHTML+=galleryImg.outerHTML;

            galleryAnchorOne.setAttribute("class", "change-image button button-small" );
            galleryAnchorOne.setAttribute("href", "#");
            galleryAnchorOne.setAttribute("data-uploader-title", "Change image");
            galleryAnchorOne.setAttribute("data-uploader-button-text", "Change image");
            galleryAnchorOne.innerText = "Change Image";


            galleryList.innerHTML+=galleryAnchorOne.outerHTML;
            
            galleryList.innerHTML+=galleryBreak.outerHTML;
            
            galleryAnchorTwo.setAttribute("class", "remove-image" );
            galleryAnchorTwo.setAttribute("href", "#");
            galleryAnchorTwo.innerText = "Remove Image";

            gallerySmall.innerHTML = galleryAnchorTwo.outerHTML;


            galleryList.innerHTML += gallerySmall.outerHTML;

            $('#gallery-metabox-list').append(galleryList.outerHTML);

        }
      });
    });

    makeSortable();

    file_frame.open();

  });

  $(document).on('click', '#gallery-metabox a.change-image', function (e) {

    e.preventDefault();

    var that = $(this);

    if (file_frame) file_frame.close();

    file_frame = wp.media.frames.file_frame = wp.media({
      title: $(this).data('uploader-title'),
      button: {
        text: $(this).data('uploader-button-text'),
      },
      multiple: false
    });

    file_frame.on('select', function () {
      attachment = file_frame.state().get('selection').first().toJSON();

      that.parent().find('input:hidden').attr('value', attachment.id);
      that.parent().find('img.image-preview').attr('src', attachment.sizes.thumbnail.url);
    });

    file_frame.open();

  });

  function resetIndex() {
    $('#gallery-metabox-list li').each(function (i) {
      $(this).find('input:hidden').attr('name', 'image_gallery_id[' + i + ']');
    });
  }

  function makeSortable() {
    $('#gallery-metabox-list').sortable({
      stop: function () {
        resetIndex();
      }
    });
  }

  $(document).on('click', '#gallery-metabox a.remove-image', function (e) {
    e.preventDefault();

    $(this).parents('li').animate({ opacity: 0 }, 200, function () {
      $(this).remove();
      resetIndex();
    });
  });

  makeSortable();

});