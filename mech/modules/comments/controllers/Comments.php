<?php defined('BASEPATH') or exit('No direct script access allowed');

class Comments extends Frontend
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Comments_model');
    }

// ------------------------------------------------------------------------ SHOW WIDGET
    public function show($page_id, $show = null)
    {
        if (!$show)
        {
            return null;
        }

        // GET WIDGET DATA
        $comments = $this->Comments_model->get_comments($page_id);

        $data['comments'] = (!empty($comments))
            ? $this->Comments_model->render_comments($comments)
            : null;

        $data['page_id'] = $page_id;

        // RENDER COMMENTS
        return $this->load->view('comments/comments.tpl', $data);
    }

// ------------------------------------------------------------------------ SHOW COMMENT FORM
    public function add()
    {
        if ($this->input->is_ajax_request())
        {
            echo $this->load->view('comments/form.tpl');
        }
    }

// ------------------------------------------------------------------------ SEND COMMENT FORM
    public function send()
    {
        if ($this->input->is_ajax_request())
        {
            $this->Comments_model->submit();
        }
    }
}
