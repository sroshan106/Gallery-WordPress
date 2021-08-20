## gallery-metabox

Extract this folder inside plugin directory and activate the plugin to use Gallery metaboxes with post types.

There are Two plugins for Image and Video Gallery, Activate them as per your need.

If you do not want to create a new plugin, You can also copy the code in your Plugin main file and use it from there.

### How to use

`$cpt = array( 'post' );`
`$types = array( 'post' );`
You can insert multiple Post Types along with Custom Post Type using the array. Just type the name of the post-type.

### Working

The code can be refactored into multiple steps :-

#### 1. Enqueueing Style and Script.
`function gallery_metabox_enqueue_image( $hook_suffix )`

#### 2. Adding metabox to post types
`function add_image_gallery_metabox( $post_type )`

#### 3. Callback to display already saved gallery and providing the interface for admin side.
`function gallery_meta_callback( $post )`

#### 4. Calling javascript Function on button click to render wp.media uploader and saving the data in Variable.
```<a class="gallery-add button" href="#" data-uploader-title="<?php esc_html_e( 'Add image(s) to gallery', 'text-domain' ); ?>" data-uploader-button-text="<?php esc_html_e( 'Add image(s)', 'text-domain' ); ?>"><?php esc_html_e( 'Add Photos', 'text-domain' ); ?>```

#### 5. Saving the variable in post-meta table
`function gallery_meta_save( $post_id )`
