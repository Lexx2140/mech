<?php defined('BASEPATH') or exit('No direct script access allowed');

class Up_lib
{

    public function __construct()
    {
        $this->CI = &get_instance();

        // LOAD CI UPLOAD LIBRARY
        $this->CI->load->library('upload');
    }

    /**
     * IMAGE UPLOAD
     * @param  [string]  $path      [fullpath to image]
     * @param  [string]  $file      [file name]
     * @param  [boolean] $overwrite [overwrite existing]
     * @return [array    & file] [image upload an fullimage info]
     */
    public function upload_img($path = null, $filename = null, $overwrite = false)
    {
        // UPLOAD FOLDER
        $path = $path ?? 'assets/upload';
        mdir_create($path);

        // SET FILE NAME
        $filename = $filename ?? $_FILES['userfile']['name'];

        // UPLOAD CONFIG
        $config['upload_path']      = realpath($path);
        $config['allowed_types']    = 'gif|jpg|jpeg|png|svg';
        $config['file_name']        = convert_accented_characters($filename);
        $config['overwrite']        = $overwrite;
        $config['file_ext_tolower'] = true;

        $this->CI->upload->initialize($config);

        // UPLOAD IMAGE
        $this->CI->upload->do_upload() or exit($this->CI->upload->display_errors());

        return $this->CI->upload->data();
    }

// --------------------------------------------------------- MULTIPLE IMAGES UPLOAD
    public function multiupload_img($path = null)
    {
        // UPLOAD FOLDER
        $path = $path ?? 'assets/upload';
        mdir_create($path);

        // GET FILES LIST
        $files = $_FILES['userfile'];

        // COUNT FILES NUMBER
        $count = count($files['tmp_name']);

        // UPLOAD IMAGES
        $images = [];

        for ($i = 0; $i < $count; $i++)
        {
            // PREPARE $_FILES
            $_FILES['userfile']['name']     = $files['name'][$i];
            $_FILES['userfile']['type']     = $files['type'][$i];
            $_FILES['userfile']['tmp_name'] = $files['tmp_name'][$i];
            $_FILES['userfile']['error']    = $files['error'][$i];
            $_FILES['userfile']['size']     = $files['size'][$i];

            // UPLOAD CONFIG
            $config['upload_path']      = realpath($path);
            $config['allowed_types']    = 'gif|jpg|jpeg|png|svg';
            $config['file_name']        = convert_accented_characters($files['name'][$i]);
            $config['overwrite']        = false;
            $config['file_ext_tolower'] = true;

            $this->CI->upload->initialize($config);

            // UPLOAD IMAGE
            $this->CI->upload->do_upload() or exit($this->CI->upload->display_errors());
            $images[$i] = $this->CI->upload->data();
        }

        return $images;
    }

// ------------------------------------------------------------------- UPLOAD ANY FILE
    public function upload_file($path = null, $filename = null, $overwrite = false)
    {
        // UPLOAD FOLDER
        $path = $path ?? 'assets/upload';
        mdir_create($path);

        // SET FILE NAME
        $filename = $filename ?? $_FILES['userfile']['name'];

        // UPLOAD CONFIG
        $config['upload_path']      = realpath($path);
        $config['allowed_types']    = '*';
        $config['file_name']        = convert_accented_characters($filename);
        $config['overwrite']        = $overwrite;
        $config['file_ext_tolower'] = true;

        $this->CI->upload->initialize($config);

        // UPLOAD IMAGE
        $this->CI->upload->do_upload() or exit($this->CI->upload->display_errors());
        return $this->CI->upload->data();
    }

}
