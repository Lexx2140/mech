<?php defined('BASEPATH') or exit('No direct script access allowed');

class Feedback extends Frontend
{
    public function __construct()
    {
        parent::__construct();
    }

// --------------------------------------------------------- SHOW FORM (onload/via ajax)
    public function view($form, $onload = true)
    {
        echo $this->load->view('feedback/' . $form . '.tpl', null);
    }

// --------------------------------------------------------------- SUBMIT FEEDBACK FORM
    public function submit()
    {
        $this->load->model('Feedback_model');
        !$this->input->is_ajax_request() or $this->Feedback_model->submit();
    }

}
