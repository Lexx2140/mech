<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash extends Admin
{
    protected $comment_status = [
        0 => 'all',
        1 => 'mod',
        2 => 'approved',
        3 => 'spam'
    ];

    public function __construct()
    {
        parent::__construct();
    }

// ----------------------------------------------------------------------- DEFAULT METHOD
    public function index()
    {
        $this->list();
    }

// ------------------------------------------------------------------------ COMMENTS LIST
    function list($status = '0', $num = null, $offset = null)
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset();

        $this->count_comments();

        // GET COMMENTS (ALL/BY STATUS)
        $this->dash['elems'] = $this->Dash_model->get_comments($status);

        // RENDER TABLE
        $this->dash['list'] = $this->load->view('comments_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('comments');
    }

// ------------------------------------------------------------------------ COMMENTS COUNT
    protected function count_comments()
    {
    		// COUNT COMMENTS BY TYPE
        foreach ($this->comment_status as $key => $value)
        {
            $this->dash['count'][$value] = $this->Dash_model->count_comments($key);
        }

        // SEND COMMENTS COUNT TO JS
        if ($this->input->is_ajax_request())
        {
        	echo json_encode($this->dash['count']);
        }
    }

// ------------------------------------------------------------------------ NOTIFY NEW COMMENTS
    public function notify()
    {
        $this->_isajax();
        echo $this->Dash_model->count_comments(1);
    }

// ------------------------------------------------------------------------ CHANGE COMMENT STATUS
    public function change_status($status)
    {
        $this->_isajax();
        $this->Dash_model->change_status($status);
    }

// ------------------------------------------------------------------------ VIEW/EDIT COMMENT
    public function view($id)
    {
    		$this->_isajax();
    		$data['comment'] = $this->Dash_model->get_comment($id);
    		$data['statuses'] = [
    				1 => 'На модерації',
    				2 => 'Схвалено',
    				3 => 'Спам'
    		];

    		echo $this->load->view('comment_view', $data);
    }

	}
