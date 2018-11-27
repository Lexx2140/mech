<?php defined('BASEPATH') or exit('No direct script access allowed');

class Fileup_lib
{

    public function __construct()
    {
        $this->CI = &get_instance();
    }

// ------------------------------------------------------------------ MULTIPLE IMAGES UPLOAD
    public function multiup($conf)
    {
        // UPLOAD FOLDER
        $dir = $conf['path'] ?? 'upload';
        if (!is_dir($dir))
        {
            mkdir($dir, 0755, true);
        }

        // GET FILES LIST
        $files = $_FILES['userfile'];

        // COUNT FILES NUMBER
        $count = count($files['tmp_name']);

        // UPLOAD FILES
        $uploaded_files = [];

        for ($i = 0; $i < $count; $i++)
        {
            // PREPARE $_FILES
            $_FILES['userfile']['name']     = $files['name'][$i];
            $_FILES['userfile']['type']     = $files['type'][$i];
            $_FILES['userfile']['tmp_name'] = $files['tmp_name'][$i];
            $_FILES['userfile']['error']    = $files['error'][$i];
            $_FILES['userfile']['size']     = $files['size'][$i];

            // UPLOAD CONFIG
            $config['upload_path']      = realpath($dir);
            $config['allowed_types']    = $conf['allowed_types'];
            $config['file_name']        = convert_accented_characters($files['name'][$i]);
            $config['overwrite']        = false;
            $config['file_ext_tolower'] = true;
            $config['encrypt_name']     = $conf['encrypt_name'];

            $this->CI->upload->initialize($config);

            // UPLOAD IMAGE
            $this->CI->upload->do_upload() or exit($this->CI->upload->display_errors());
            $uploaded_files[$i] = $this->CI->upload->data();
        }

        return $uploaded_files;
    }

}
