<?php
/**
 * Plugin Name: Image Gallery Inserter
 *
 * @package Gallery WordPress
 */

/**
 * Enqueue CSS and JAVASCRIPT
 *
 * @param action $hook_suffix Required to initialize gallery.
 */
function gallery_metabox_enqueue_image( $hook_suffix ) {
	$cpt = array( 'post' ); // Array of post types that will contain the gallery.
	if ( in_array( $hook_suffix, array( 'post.php', 'post-new.php' ), true ) ) {
		$screen = get_current_screen();
		if ( is_object( $screen ) && in_array( $screen->post_type, $cpt, true ) ) {
			wp_enqueue_script( 'gallery-metabox', plugin_dir_url( __FILE__ ) . '/js/gallery-metabox-image.js', array( 'jquery', 'jquery-ui-sortable' ), 1.0, true );
			wp_enqueue_style( 'gallery-metabox', plugin_dir_url( __FILE__ ) . '/css/gallery-metabox.css', 1.0, true );
		}
	}
}

add_action( 'admin_enqueue_scripts', 'gallery_metabox_enqueue_image' );

/**
 * Add Gallery metabox for Gallery
 *
 * @param custom_post $post_type Adding custom post for gallery to appear.
 */
function add_image_gallery_metabox( $post_type ) {
	$types = array( 'post' ); // Array of post types that will contain the gallery.
	add_meta_box(
		'gallery-metabox',
		'Gallery Image',
		'gallery_meta_callback',
		$types,
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'add_image_gallery_metabox' );
/**
 * Calling function for gallery metabox.
 *
 * @param post $post Create metabox on given post.
 */
function gallery_meta_callback( $post ) {
	wp_nonce_field( basename( __FILE__ ), 'gallery_meta_nonce' );
	$ids = get_post_meta( $post->ID, 'image_gallery_id', true );
	?>
	<table class="form-table">
		<tr><td>
			<a class="gallery-add button" href="#" data-uploader-title="<?php esc_html_e( 'Add image(s) to gallery', 'text-domain' ); ?>" data-uploader-button-text="<?php esc_html_e( 'Add image(s)', 'text-domain' ); ?>"><?php esc_html_e( 'Add Photos', 'text-domain' ); ?>
			</a>

			<ul class="gallery-metabox-list">
				<?php
				if ( $ids ) {
					foreach ( $ids as $key => $value ) {
						$image = wp_get_attachment_image_src( $value );
						?>
						<li>
							<input type="hidden" name="image_gallery_id[<?php echo esc_attr( $key ); ?>]" value='<?php echo esc_attr( $value ); ?>'>
							<img class="image-preview" src="<?php echo esc_url( $image[0] ); ?>">
							<a class="change-image button button-small" href="#" data-uploader-title="<?php esc_attr_e( 'Change image', 'text-domain' ); ?>" data-uploader-button-text="<?php esc_attr_e( 'Change image', 'text-domain' ); ?>"><?php esc_html_e( 'Change image', 'text-domain' ); ?></a><br>
							<small><a class="remove-image" href="#"><?php esc_html_e( 'Remove image', 'text-domain' ); ?></a></small>
						</li>
						<?php
					}
				}
				?>
			</ul>

		</td></tr>
	</table>
	<?php
}
/**
 * Saving custom gallery into post_meta table
 *
 * @param Post_id $post_id Id of current post that we are working on.
 */
function gallery_meta_save( $post_id ) {
	if ( ! isset( $_POST['gallery_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['gallery_meta_nonce'] ) ), basename( __FILE__ ) ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( ! empty( $_POST['image_gallery_id'] ) ) {
		update_post_meta( $post_id, 'image_gallery_id', array_map( 'intval', wp_unslash( $_POST['image_gallery_id'] ) ) );
	} else {
		delete_post_meta( $post_id, 'image_gallery_id' );
	}
}
add_action( 'save_post', 'gallery_meta_save' );
