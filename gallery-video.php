<?php
/**
 * Plugin Name: Video Gallery Inserter
 *
 * @package Gallery WordPress
 */

/**
 * Enqueue CSS and JAVASCRIPT
 *
 * @param action $hook_suffix Required to initialize gallery.
 */
function gallery_metabox_enqueue_video( $hook_suffix ) {
	$cpt = array( 'post' ); // Array of post types that will contain the gallery.
	if ( in_array( $hook_suffix, array( 'post.php', 'post-new.php' ), true ) ) {
		$screen = get_current_screen();
		if ( is_object( $screen ) && in_array( $screen->post_type, $cpt, true ) ) {
			wp_enqueue_script( 'video_gallery_metabox', plugin_dir_url( __FILE__ ) . '/js/gallery-metabox-video.js', array( 'jquery', 'jquery-ui-sortable' ), 1.0, true );
			wp_enqueue_style( 'gallery-metabox', plugin_dir_url( __FILE__ ) . '/css/gallery-metabox.css', 1.0, true );
		}
	}
}

add_action( 'admin_enqueue_scripts', 'gallery_metabox_enqueue_video' );

/**
 * Add Gallery metabox for Gallery
 *
 * @param custom_post $post_type Adding custom post for gallery to appear.
 */
function add_video_gallery_metabox( $post_type ) {
	$types = array( 'post' ); // Array of post types that will contain the gallery.
	add_meta_box(
		'video_gallery_metabox',
		__( 'Gallery Video', 'text-domain' ),
		'gallery_meta_callback_video',
		$types,
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'add_video_gallery_metabox' );




/**
 * Calling function for gallery metabox.
 *
 * @param post $post Create metabox on given post.
 */
function gallery_meta_callback_video( $post ) {
	wp_nonce_field( basename( __FILE__ ), 'video_gallery_meta_nonce' );
	$ids = get_post_meta( $post->ID, 'video_gallery_id', true );
	?>
	<table class="form-table-video">
		<tr><td>
			<a class="gallery-add-video button" href="#" data-uploader-title="<?php esc_html_e( 'Add video(s) to gallery', 'text-domain' ); ?>" data-uploader-button-text="<?php esc_html_e( 'Add video(s)', 'text-domain' ); ?>"><?php esc_html_e( 'Add Videos', 'text-domain' ); ?>
			</a>

			<ul class="gallery-metabox-list">
				<?php
				if ( $ids ) {
					foreach ( $ids as $key => $value ) {
						$video = wp_get_attachment_url( $value );
						?>
						<li>
							<input type="hidden" name="video_gallery_id[<?php echo esc_attr( $key ); ?>]" value='<?php echo esc_attr( $value ); ?>'>
							<video width="320" height="240" controls class="video-preview" src=<?php echo esc_url( $video ); ?> >
							</video>
							<a class="change-video button button-small" href="#" data-uploader-title="<?php esc_attr_e( 'Change video', 'text-domain' ); ?>" data-uploader-button-text="<?php esc_attr_e( 'Change video', 'text-domain' ); ?>"><?php esc_html_e( 'Change video', 'text-domain' ); ?></a><br>
							<small><a class="remove-video" href="#"><?php esc_html_e( 'Remove video', 'text-domain' ); ?></a></small>
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
function gallery_meta_save_video( $post_id ) {
	if ( ! isset( $_POST['video_gallery_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['video_gallery_meta_nonce'] ) ), basename( __FILE__ ) ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( ! empty( $_POST['video_gallery_id'] ) ) {
		update_post_meta( $post_id, 'video_gallery_id', array_map( 'intval', wp_unslash( $_POST['video_gallery_id'] ) ) );
	} else {
		delete_post_meta( $post_id, 'video_gallery_id' );
	}
}
add_action( 'save_post', 'gallery_meta_save_video' );
