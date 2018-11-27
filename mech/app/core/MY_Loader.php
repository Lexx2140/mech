<?php defined('BASEPATH') or exit('No direct script access allowed');

/* load the MX_Loader class */
require_once APPPATH . "third_party/MX/Loader.php";

class MY_Loader extends MX_Loader
{

    public function __construct()
    {
        parent::__construct();
        $this->_ci_view_paths = array(APPPATH . '../../assets/tpl/' => true);
    }

}
