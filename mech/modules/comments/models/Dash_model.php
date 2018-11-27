<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash_model extends MY_Model
{
    protected $_table  = 'comments';
    protected $_select = 'id, user_name, user_email, msg, created, status';
    // protected $_select2 = 'id, pid, sort, title, icon, item_type, pub';
    protected $_order = 'created DESC';
    // protected $_order2  = 'sort ASC';

    // Default language
    public $def_lang = '1';

    public function __construct()
    {
        parent::__construct();

    }

// ------------------------------------------------------------------------ GET
    public function get_comments($status = '0', $num = null, $offset = null)
    {
        if ($status !== '0')
        {
            $this->db->where('comments.status', $status);
        }

        $this->db
             ->select('comments.id, comments.user_name, comments.user_email, comments.msg, comments.created')
             ->select('pages.url, pages.home')
             ->select('pages_desc.title')
             ->from('comments', $num, $offset)
             ->join('pages', 'pages.id=comments.url_id', 'left')
             ->join('pages_desc', 'pages_desc.id=comments.url_id AND pages_desc.lang_id='. $this->def_lang, 'left');

        return $this->db->get()->result_array();
    }

    public function get_comment($id)
    {
        return $this->db
                    ->select('comments.*')
                    ->select('pages.url, pages.home')
                    ->select('pages_desc.title')
                    ->from('comments', 1)
                    ->where('comments.id', $id)
                    ->join('pages', 'pages.id=comments.url_id', 'left')
                    ->join('pages_desc', 'pages_desc.id=comments.url_id AND pages_desc.lang_id='. $this->def_lang, 'left')
                    ->get()->row_array();
    }

// ------------------------------------------------------------------------ COUNT
    public function count_comments($status = 0)
    {
        return ($status === 0) ? $this->count_it() : $this->count_it(['status' => $status]);
    }

// --------------------------------------------------------------------- CHANGE STATUS
    public function change_status($status, $id = null)
    {
        $comments = json_decode($this->input->post('data'), true);

        foreach ($comments as $key => $value)
        {
            $elems['id']     = $value;
            $elems['status'] = $status;
            $new_status[]    = $elems;
        }

        $this->batch_up($new_status);
    }

// ---------------------------------------------------------------------- DELETE COMMENT
    public function del_comment($comment)
    {
        // DELETE FROM DB
        $this->delete($comment['id']);
    }

}
