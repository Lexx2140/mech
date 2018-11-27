<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash_model extends Admin_model
{
    protected $_table = 'orders';
    private $path     = 'assets/upload/orders/';

    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------------ GET ALL ORDERS
    public function get_orders()
    {
        return $this->get(null, null, 'created DESC');
    }

// ------------------------------------------------------------------------- GET ORDER DATA
    public function get_order($id, $content = false)
    {
        $order = $this->get_row($id);

        // GET UPLOADED FILES FROM PATH
        $date = date_create($order['created']);
        $dir  = $this->path . date_format($date, "Y") . '/' . date_format($date, "m-d_H-i-s");

        $order['folder'] = $dir;

        if ($content)
        {
            $order['uploaded'] = (is_dir($dir)) ? $this->get_files($dir) : null;
        }

        return $order;
    }

// ----------------------------------------------------------------- GET UPLOADED FILES
    public function get_files($dir)
    {
        $files = array_diff(scandir($dir), array('.', '..'));

        $uploaded = [];

        // GET FILES INFO/MIME TYPE
        if (!empty($files))
        {
            foreach ($files as $file)
            {
                $uploaded[] = $this->get_file_info($dir . '/' . $file);
            }
        }

        return $uploaded;
    }

// ---------------------------------------------------------------- GET FILE INFO
    public function get_file_info($file)
    {
        $mime              = get_mime_by_extension($file);
        $fileinfo['mime']  = $mime;
        $fileinfo['file']  = $file;
        $fileinfo['thumb'] = $this->get_file_thumb($file, $mime);

        return $fileinfo;
    }

// ----------------------------------------------------------------- GET FILE THUMB
    public function get_file_thumb($file, $mime)
    {
        $info = getimagesize($file);

        if (is_array($info))
        {
            return '<img src=' . base_url($file) . '>';
        }
        else
        {
            return '<i class="uk-icon uk-icon-file-o order-icon"></i>';
        }
    }

// ---------------------------------------------------------------------- DELETE ORDER
    public function del_order($order)
    {
        if ($this->delete($order['id']))
        {
            // DELETE FOLDER
            mdir_delete($order['folder']);
        }
    }
}
