jQuery(function ($) {

    var file_frame;
    $(document).on('click', '#video_gallery_metabox a.gallery-add-video', function (e) {
  
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
        var listIndex = $('#video_gallery_metabox-list li').index($('#video_gallery_metabox-list li:last')),
          selection = file_frame.state().get('selection');
  
        selection.map(function (attachment, i) {
          let noOfVideos = document.getElementById('video_gallery_metabox').getElementsByTagName('li').length;
          let videoIds = [];
          for (let i = 1; i <= noOfVideos; i++) {
            videoIds.push(parseInt(document.querySelector("#video_gallery_metabox-list > li:nth-child(" + i + ") > input[type=hidden]").value));
          }
          let currentId = parseInt(attachment['attributes']['id']);
          let currentFile = attachment['attributes']['filename'];
          let extension = currentFile.substr((currentFile.lastIndexOf('.') + 1));
          attachment = attachment.toJSON();
          index = listIndex + (i + 1);
          let videoFormats = ['mp4', 'mov', 'wmv', 'avi', 'mkv', 'webm', 'html5'];
          if (videoFormats.includes(extension) && (!videoIds.includes(currentId))) {
  
              let galleryList = document.createElement("li");
              let galleryInput = document.createElement("input");
              let galleryVideo = document.createElement("video");
              let galleryAnchorOne = document.createElement("a");   
              var galleryBreak = document.createElement("BR");
              let galleryAnchorTwo = document.createElement("a");
              let gallerySmall = document.createElement("small");
  
              galleryInput.setAttribute("type", "hidden");
              galleryInput.setAttribute("name", 'video_gallery_id['+index+']');
              galleryInput.setAttribute("value", attachment.id);
  
              galleryList.innerHTML = galleryInput.outerHTML;
  
              galleryVideo.setAttribute("width","320");
              galleryVideo.setAttribute("height","240");
              galleryVideo.controls = true;
              galleryVideo.setAttribute("class","video-preview");
              galleryVideo.setAttribute("src", attachment.url );
              galleryList.innerHTML+=galleryVideo.outerHTML;
  
              galleryAnchorOne.setAttribute("class", "change-video button button-small" );
              galleryAnchorOne.setAttribute("href", "#");
              galleryAnchorOne.setAttribute("data-uploader-title", "Change Video");
              galleryAnchorOne.setAttribute("data-uploader-button-text", "Change Video");
              galleryAnchorOne.innerText = "Change Video";
  
  
              galleryList.innerHTML+=galleryAnchorOne.outerHTML;
              
              galleryList.innerHTML+=galleryBreak.outerHTML;
  
              galleryAnchorTwo.setAttribute("class", "remove-video" );
              galleryAnchorTwo.setAttribute("href", "#");
              galleryAnchorTwo.innerText = "Remove Video";
  
              gallerySmall.innerHTML = galleryAnchorTwo.outerHTML;
  
  
              galleryList.innerHTML += gallerySmall.outerHTML;
  
              $('#video_gallery_metabox-list').append(galleryList.outerHTML);
  
          }
        });
      });
  
      makeSortable();
  
      file_frame.open();
  
    });
  
    $(document).on('click', '#video_gallery_metabox a.change-video', function (e) {
  
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
        that.parent().find('video.image-preview').attr('src', attachment.url);
      });
  
      file_frame.open();
  
    });
  
    function resetIndex() {
      $('#video_gallery_metabox-list li').each(function (i) {
        $(this).find('input:hidden').attr('name', 'video_gallery_id[' + i + ']');
      });
    }
  
    function makeSortable() {
      $('#video_gallery_metabox-list').sortable({
        stop: function () {
          resetIndex();
        }
      });
    }
  
    $(document).on('click', '#video_gallery_metabox a.remove-video', function (e) {
      e.preventDefault();
  
      $(this).parents('li').animate({ opacity: 0 }, 200, function () {
        $(this).remove();
        resetIndex();
      });
    });
  
    makeSortable();
  
  });